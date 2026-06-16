# AutoScroll — Backend

Firebase Cloud Functions (Node.js 22) that proxy Reddit content through the [Apify Reddit Scraper](https://apify.com/spry_wholemeal/reddit-scraper). See the [root README](../README.md) for the full project overview and the [install guide](../docs/install-backend.md) for setup instructions.

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
| `redditProxy` | `GET /redditProxy` | Fetches subreddit posts via Apify; reshapes response to Reddit JSON format |
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

## How the Apify integration works

`redditProxy` receives `?subreddit=&sort=&limit=` and:

1. Validates the subreddit name and sort value
2. Checks per-IP rate limit (5 req/min) and monthly invocation cap
3. POSTs to `spry_wholemeal~reddit-scraper` on Apify with `includeRaw: true` and `includeNsfw: true`
4. Apify returns an array of items; each item's `raw` field is the original Reddit post object
5. Reshapes to `{ data: { children: [{ kind: "t3", data: raw }] } }` — identical to Reddit's own API format so the frontend requires no changes
6. Returns the JSON to the browser

`searchSubredditsProxy` calls Reddit's public `search_reddit_names.json` endpoint directly (no Apify token needed for search).
