import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import axios from "axios";
import cors from "cors";
import {rateLimit} from "./rateLimiter";
import {getAllowedOrigins, getLocalhostSecret, getApifyToken} from "./config";
import {checkMonthlyLimit} from "./monthlyLimit";
import {initializeGeoIP, getCountryFromIP, trackAnonymousRequest} from "./anonymousAnalytics";

const APIFY_ACTOR_ID = "spry_wholemeal~reddit-scraper";
const APIFY_RUN_URL = `https://api.apify.com/v2/acts/${APIFY_ACTOR_ID}/run-sync-get-dataset-items`;

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

        const validSorts = ["hot", "new", "top", "rising", "controversial"];
        const resolvedSort = validSorts.includes(sort) ? sort : "hot";

        try {
          const apifyResponse = await axios.post(
            `${APIFY_RUN_URL}?token=${getApifyToken()}`,
            {
              mode: "scrape",
              sort: resolvedSort,
              maxPosts: Math.min(limit, 100),
              includeRaw: true,
              includeCommentsMode: "none",
              listings: [{subreddit}],
              proxyConfiguration: {
                useApifyProxy: true,
                apifyProxyGroups: ["RESIDENTIAL"],
              },
            },
            {
              timeout: 110000,
              headers: {"Content-Type": "application/json"},
            }
          );

          const items: any[] = apifyResponse.data;

          // Reshape Apify output to Reddit JSON API format.
          // includeRaw: true embeds the original Reddit post object in each item's `raw` field.
          const children = items
            .filter((item) => item.raw)
            .map((item) => ({kind: "t3", data: item.raw}));

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

        // Reddit's public search endpoint works without OAuth from server-side
        const url = `https://www.reddit.com/api/search_reddit_names.json?query=${encodeURIComponent(query)}&include_over_18=true`;

        try {
          const redditResponse = await axios.get(url, {
            headers: {"User-Agent": "AutoScroll/1.0"},
            timeout: 10000,
          });
          response.status(200).send(redditResponse.data);
        } catch (error) {
          logger.error("Error fetching subreddit names from Reddit:", error);
          if (axios.isAxiosError(error) && error.response) {
            response.status(error.response.status).send(error.response.data);
          } else {
            response.status(500).send("Error fetching subreddit names");
          }
        }
      });
    });
  });
});
