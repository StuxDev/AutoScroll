# AutoScroll — Backend

Firebase Cloud Functions (Node.js 22) that proxy Reddit content through two free Reddit archives ([pullpush.io](https://pullpush.io/), then [Arctic Shift](https://arctic-shift.photon-reddit.com/)), falling back to the [Reddit Scraper](https://apify.com/automation-lab/reddit-scraper) Apify actor if both are unavailable. See the [root README](../README.md) for the full project overview and the [install guide](../docs/install-backend.md) for setup instructions.

## Commands

```bash
npm install          # install dependencies
npm run build        # compile TypeScript → lib/
npm run build:watch  # watch mode
npm run serve        # build + start Firebase emulators locally
npm run deploy       # lint + build + deploy to Firebase
npm run logs         # tail live function logs
npm run lint         # ESLint
```

## Functions

| Function | Endpoint | Purpose |
|----------|----------|---------|
| `redditProxy` | `GET /redditProxy` | Fetches subreddit posts (pullpush.io → Arctic Shift → Apify); reshapes response to Reddit JSON format |
| `searchSubredditsProxy` | `GET /searchSubredditsProxy` | Proxies Reddit's public subreddit name search |
| `proxyStatus` | `GET /proxyStatus` | Health check — returns status, backend version, and service availability |
| `analyticsStatus` | `GET /analyticsStatus` | Returns anonymous aggregated usage statistics |
| `cleanupRateLimits` | Scheduled (hourly) | Removes expired Firestore rate-limit entries |

All HTTP functions are deployed to region **europe-west4**.

## Environment variables

Copy `.env.example` to `.env` for local development:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `APIFY_TOKEN` | Yes | API token from [console.apify.com](https://console.apify.com/account/integrations) |
| `ALLOWED_ORIGINS` | Yes | Comma-separated CORS origins (e.g. `https://your-app.netlify.app`) |
| `LOCALHOST_SECRET` | No | Optional header secret for localhost requests |

In production, set these as Firebase Params:

```bash
firebase functions:params:set APIFY_TOKEN="your_token"
firebase functions:params:set ALLOWED_ORIGINS="https://your-app.netlify.app"
```

## Source layout

```
backend/
├── src/
│   ├── index.ts            # Function exports + proxyStatus + scheduled cleanup
│   ├── proxy.ts            # redditProxy and searchSubredditsProxy handlers
│   ├── config.ts           # Firebase Params + getApifyToken()
│   ├── rateLimiter.ts      # Per-IP Firestore-based rate limiting
│   ├── monthlyLimit.ts     # Global monthly invocation cap
│   └── anonymousAnalytics.ts  # Privacy-compliant GeoIP country tracking
├── lib/                    # Compiled output (git-ignored)
├── .env.example
├── package.json
└── tsconfig.json
```

## How the content-source fallback chain works

`redditProxy` receives `?subreddit=&sort=&limit=` and:

1. Validates the subreddit name and sort value
2. Checks per-IP rate limit (5 req/min) and monthly invocation cap
3. Tries **pullpush.io** first (`fetchFromPullpush()`), a free Pushshift-compatible Reddit archive. It returns the *original* Reddit submission JSON directly, so no reshaping is needed. It has no "hot"/"rising" ranking (it's an archive, not a live feed), so those two sorts are approximated as score-sorted posts from the last 2 days
4. Falls back to **Arctic Shift** (`fetchFromArcticShift()`) if pullpush errors or returns nothing — also a free archive returning real Reddit submission JSON, but it only sorts by `created_utc` (no score-based sort at all), so it's a best-effort fallback regardless of the requested sort
5. Falls back to the paid **Apify actor** (`automation-lab~reddit-scraper`) if both archives come up empty. Unlike the two archives, Apify scrapes Reddit's live HTML in the actor's own field format (`imageUrls`, `isNSFW`, `permalink`, `thumbnail`, etc. — Reddit shut down its old public `.json` API in May 2026, so there's no raw-JSON passthrough here). `reshapeApifyPost()` maps those fields onto the same `{ data: { children: [{ kind: "t3", data: {...} }] } }` shape Reddit's own API used to return, so the frontend requires no changes regardless of which tier served the request. Reddit-hosted video and multi-image galleries fall back to a static thumbnail/first image where a direct video URL isn't available — see the comments in `proxy.ts` for the exact mapping and its limits
6. Returns the JSON to the browser

`searchSubredditsProxy` calls Reddit's public `search_reddit_names.json` endpoint directly (no Apify token needed for search).
