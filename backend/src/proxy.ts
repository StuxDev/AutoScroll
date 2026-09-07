import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import axios from "axios";
import cors from "cors";
import {rateLimit} from "./rateLimiter";
import {getAllowedOrigins, getLocalhostSecret, getApifyToken} from "./config";
import {checkMonthlyLimit} from "./monthlyLimit";
import {initializeGeoIP, getCountryFromIP, trackAnonymousRequest} from "./anonymousAnalytics";

// spry_wholemeal/reddit-scraper was pulled from the Apify Store after Reddit
// shut down its public .json API in May 2026. automation-lab/reddit-scraper
// scrapes Reddit's HTML directly instead, so it has no "includeRaw" passthrough
// of the original Reddit post JSON - see reshapeApifyPost() below for how its
// own fields are mapped onto the shape the frontend expects.
//
// redditProxy tries two free Pushshift-style Reddit archives first
// (pullpush.io, then Arctic Shift) before falling back to the paid Apify
// actor. Both archives return the real original Reddit submission JSON, so
// their results need no reshaping at all - unlike Apify's own output.
const APIFY_ACTOR_ID = "automation-lab~reddit-scraper";
const APIFY_RUN_URL = `https://api.apify.com/v2/acts/${APIFY_ACTOR_ID}/run-sync-get-dataset-items`;

const PULLPUSH_URL = "https://api.pullpush.io/reddit/search/submission/";
const ARCTIC_SHIFT_URL = "https://arctic-shift.photon-reddit.com/api/posts/search";
const ARCTIC_SHIFT_SUBREDDITS_URL = "https://arctic-shift.photon-reddit.com/api/subreddits/search";

/**
 * Neither archive can replicate Reddit's live "hot"/"rising" ranking (they're
 * archives of past submissions, not a live feed) - biasing toward recent-but
 * -upvoted posts is the closest reasonable approximation for those two.
 */
function pullpushSortParams(sort: string): {sortType: string; order: "asc" | "desc"; after?: string} {
  switch (sort) {
    case "top":
      return {sortType: "score", order: "desc"};
    case "hot":
    case "rising":
      return {sortType: "score", order: "desc", after: "2d"};
    case "new":
    default:
      return {sortType: "created_utc", order: "desc"};
  }
}

/**
 * Tier 1: pullpush.io, a free Pushshift-compatible Reddit archive. Returns
 * the original Reddit submission JSON directly - no reshaping needed.
 * Returns null (rather than throwing) on any failure/empty result so the
 * caller can fall through to the next tier.
 */
async function fetchFromPullpush(subreddit: string, sort: string, limit: number): Promise<any[] | null> {
  try {
    const {sortType, order, after} = pullpushSortParams(sort);
    const params = new URLSearchParams({
      subreddit,
      size: String(limit),
      sort: order,
      sort_type: sortType,
    });
    if (after) params.set("after", after);

    const res = await axios.get(`${PULLPUSH_URL}?${params.toString()}`, {timeout: 10000});
    const items = res.data?.data;
    return Array.isArray(items) && items.length > 0 ? items : null;
  } catch (error) {
    logger.warn("pullpush.io fetch failed, falling back:", (error as Error).message);
    return null;
  }
}

/**
 * Tier 2: Arctic Shift, another free Reddit archive. Also returns the
 * original Reddit submission JSON directly. It only sorts by created_utc
 * (no score/hot ranking at all), so this is a best-effort fallback
 * regardless of the requested sort.
 */
async function fetchFromArcticShift(subreddit: string, limit: number): Promise<any[] | null> {
  try {
    const params = new URLSearchParams({
      subreddit,
      limit: String(limit),
      sort: "desc",
    });

    const res = await axios.get(`${ARCTIC_SHIFT_URL}?${params.toString()}`, {timeout: 10000});
    const items = res.data?.data;
    return Array.isArray(items) && items.length > 0 ? items : null;
  } catch (error) {
    logger.warn("Arctic Shift fetch failed, falling back:", (error as Error).message);
    return null;
  }
}

/**
 * Turn an Apify actor permalink/url field into a Reddit-relative permalink
 * (the shape frontend/src/stores/gallery.ts's goToLink() expects).
 */
function normalizePermalink(item: any, subreddit: string): string {
  const raw = item.permalink || item.url;
  if (typeof raw === "string" && raw.length > 0) {
    if (raw.startsWith("/")) return raw;
    try {
      return new URL(raw).pathname;
    } catch {
      // fall through to the synthetic fallback below
    }
  }
  const id = typeof item.id === "string" ? item.id.replace(/^t3_/, "") : "";
  return `/r/${subreddit}/comments/${id}/`;
}

/**
 * Reshape one automation-lab/reddit-scraper post into the same
 * { kind: "t3", data: {...} } shape Reddit's own API returns, so
 * frontend/src/stores/gallery.ts's post-processing logic (is_gallery/
 * media_metadata, post_hint/url, thumbnail, over_18, permalink, etc.)
 * keeps working unchanged.
 *
 * This actor doesn't expose a playable video URL or gallery image arrays
 * (Reddit's HTML no longer exposes those the way its old public API did),
 * so Reddit-hosted video and multi-image galleries fall back to a static
 * thumbnail/first-image where possible, rather than being dropped outright.
 * Posts with no usable image at all are filtered out.
 */
function reshapeApifyPost(item: any, subreddit: string): {kind: string; data: any} | null {
  const images: string[] = Array.isArray(item.imageUrls) ?
    item.imageUrls.filter((u: any) => typeof u === "string" && u.length > 0) :
    [];
  const thumbnail = typeof item.thumbnail === "string" && item.thumbnail.startsWith("http") ?
    item.thumbnail :
    null;

  const base = {
    id: item.id,
    title: item.title,
    author: item.author,
    score: item.score,
    num_comments: item.numComments,
    over_18: !!item.isNSFW,
    permalink: normalizePermalink(item, subreddit),
    thumbnail: thumbnail ?? undefined,
  };

  if (images.length > 1) {
    const media_metadata: Record<string, {s: {u: string}}> = {};
    images.forEach((u, i) => {
      media_metadata[String(i)] = {s: {u}};
    });
    return {kind: "t3", data: {...base, is_gallery: true, media_metadata}};
  }

  if (images.length === 1) {
    return {kind: "t3", data: {...base, post_hint: "image", is_self: false, url: images[0]}};
  }

  if (thumbnail) {
    return {kind: "t3", data: {...base, post_hint: "image", is_self: false, url: thumbnail}};
  }

  return null;
}

// CORS handler with origin validation
const corsHandler = cors({
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();

    const isLocalhost = origin && (
      origin.startsWith("http://localhost:") ||
      origin.startsWith("http://127.0.0.1:")
    );

    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    if (isLocalhost) {
      callback(null, true);
      return;
    }

    logger.warn(`Blocked request from unauthorized origin: ${origin}`);
    callback(new Error("Not allowed by CORS"));
  },
  allowedHeaders: ["Content-Type", "X-Localhost-Secret"],
});

/**
 * Middleware to validate localhost requests with optional secret
 */
function validateLocalhostSecret(
  req: {headers: {origin?: string; "x-localhost-secret"?: string}},
  res: {status: (code: number) => {json: (data: Record<string, string>) => void}},
  next: () => void
) {
  const origin = req.headers.origin;
  const localhostSecret = getLocalhostSecret();

  if (!localhostSecret) {
    next();
    return;
  }

  const isLocalhost = origin && (
    origin.startsWith("http://localhost:") ||
    origin.startsWith("http://127.0.0.1:")
  );

  if (isLocalhost) {
    const providedSecret = req.headers["x-localhost-secret"];

    if (providedSecret !== localhostSecret) {
      logger.warn(`Blocked localhost request with invalid secret from: ${origin}`);
      res.status(403).json({
        error: "Forbidden",
        message: "Invalid localhost secret. Set X-Localhost-Secret header.",
      });
      return;
    }
  }

  next();
}

// Rate limit: 5 requests per minute per IP
const redditRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  maxRequests: 5,
});

// Rate limit: 10 requests per minute per IP for search
const searchRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  maxRequests: 10,
});

// Initialize GeoIP database (lazy-loaded on first request)
let geoIPLookup: any = null;

async function ensureGeoIP() {
  if (!geoIPLookup) {
    try {
      geoIPLookup = await initializeGeoIP();
    } catch (error) {
      logger.error("Failed to initialize GeoIP:", error);
    }
  }
}

async function trackRequest(request: any, endpoint: string) {
  await ensureGeoIP();
  if (geoIPLookup) {
    try {
      const ip = (request.headers["x-forwarded-for"] as string) || (request as any).ip || "unknown";
      const country = getCountryFromIP(ip, geoIPLookup);
      trackAnonymousRequest(country, endpoint).catch((err) =>
        logger.debug("Analytics tracking error:", err)
      );
    } catch (error) {
      logger.debug("Could not track analytics:", error);
    }
  }
}

export const redditProxy = onRequest({region: "europe-west4", timeoutSeconds: 120}, (request, response) => {
  corsHandler(request, response, () => {
    validateLocalhostSecret(request, response, () => {
      redditRateLimiter(request, response, async () => {
        const withinLimit = await checkMonthlyLimit();
        if (!withinLimit) {
          response.status(429).json({
            error: "Monthly Limit Exceeded",
            message: "Service has reached its monthly usage limit. Please try again next month.",
          });
          return;
        }

        await trackRequest(request, "redditProxy");

        const subreddit = request.query.subreddit as string;
        const sort = (request.query.sort as string) || "hot";
        const limit = parseInt((request.query.limit as string) || "100", 10);

        if (!subreddit) {
          response.status(400).json({
            error: "Bad Request",
            message: "Subreddit is required",
          });
          return;
        }

        // Validate subreddit name format (alphanumeric, underscores, hyphens only, 3-21 chars)
        if (!/^[a-zA-Z0-9_-]{3,21}$/.test(subreddit)) {
          response.status(400).json({
            error: "Bad Request",
            message: "Invalid subreddit name format",
          });
          return;
        }

        // automation-lab/reddit-scraper doesn't support "controversial" - fall
        // back to "hot" for it same as any other unrecognized value.
        const validSorts = ["hot", "new", "top", "rising"];
        const resolvedSort = validSorts.includes(sort) ? sort : "hot";

        const requestLimit = Math.min(limit, 100);

        const rawPosts = await fetchFromPullpush(subreddit, resolvedSort, requestLimit) ??
          await fetchFromArcticShift(subreddit, requestLimit);

        if (rawPosts) {
          response.status(200).json({
            data: {
              children: rawPosts.map((data) => ({kind: "t3", data})),
              after: null,
            },
          });
          return;
        }

        // Both free archives failed or had nothing for this subreddit - fall
        // back to the paid Apify actor, which scrapes Reddit's HTML directly.
        try {
          const apifyResponse = await axios.post(
            `${APIFY_RUN_URL}?token=${getApifyToken()}`,
            {
              urls: [`https://www.reddit.com/r/${subreddit}/`],
              sort: resolvedSort,
              maxPostsPerSource: requestLimit,
              includeComments: false,
            },
            {
              timeout: 110000,
              headers: {"Content-Type": "application/json"},
            }
          );

          const items: any[] = apifyResponse.data;

          // Reshape Apify output to Reddit JSON API format - see reshapeApifyPost().
          const children = items
            .filter((item) => item && item.type !== "comment")
            .map((item) => reshapeApifyPost(item, subreddit))
            .filter(Boolean);

          response.status(200).json({
            data: {
              children,
              after: null,
            },
          });
        } catch (error) {
          logger.error("Error fetching from Apify:", error);
          if (axios.isAxiosError(error) && error.response) {
            response.status(error.response.status).json({
              error: "Apify Error",
              message: error.response.data,
            });
          } else {
            response.status(500).json({error: "Failed to fetch posts from Apify"});
          }
        }
      });
    });
  });
});

export const searchSubredditsProxy = onRequest({region: "europe-west4"}, (request, response) => {
  corsHandler(request, response, () => {
    validateLocalhostSecret(request, response, () => {
      searchRateLimiter(request, response, async () => {
        const withinLimit = await checkMonthlyLimit();
        if (!withinLimit) {
          response.status(429).json({
            error: "Monthly Limit Exceeded",
            message: "Service has reached its monthly usage limit. Please try again next month.",
          });
          return;
        }

        await trackRequest(request, "searchSubredditsProxy");

        const query = request.query.query as string;

        if (!query) {
          response.status(400).send("Query is required");
          return;
        }

        // Reddit shut down search_reddit_names.json along with the rest of its
        // public .json API in May 2026 - Arctic Shift's subreddit-prefix search
        // is the closest replacement, reshaped to the {names: [...]} shape the
        // frontend expects back from Reddit's old endpoint.
        const url = `${ARCTIC_SHIFT_SUBREDDITS_URL}?subreddit_prefix=${encodeURIComponent(query)}&limit=20`;

        try {
          const arcticResponse = await axios.get(url, {timeout: 10000});
          const results: any[] = arcticResponse.data?.data ?? [];
          const names = results
            .map((r) => r.display_name)
            .filter((name: unknown): name is string => typeof name === "string" && name.length > 0);
          response.status(200).json({names});
        } catch (error) {
          logger.error("Error fetching subreddit names from Arctic Shift:", error);
          response.status(200).json({names: []});
        }
      });
    });
  });
});
