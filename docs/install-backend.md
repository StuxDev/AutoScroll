# Backend Install Guide

The backend is a set of Firebase Cloud Functions (Node.js 22) that proxy Reddit content through the [Reddit Scraper](https://apify.com/automation-lab/reddit-scraper) Apify actor.

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 22 or higher | https://nodejs.org |
| Firebase CLI | latest | `npm install -g firebase-tools` |
| Apify account | — | https://apify.com (free tier available) |
| Firebase project | — | https://console.firebase.google.com |

---

## 1. Install dependencies

```bash
cd backend
npm install
```

---

## 2. Authenticate with Firebase

```bash
firebase login
```

Then link the project:

```bash
firebase use --add
```

Select your Firebase project from the list.

---

## 3. Get your Apify API token

1. Log in to [https://console.apify.com](https://console.apify.com)
2. Go to **Settings → Integrations**
3. Copy your **Personal API token**

---

## 4. Configure environment variables

### For local development

Create `backend/.env` from the example:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
# Comma-separated list of allowed CORS origins
ALLOWED_ORIGINS=https://your-app.netlify.app,http://localhost:3000

# Optional — leave empty to allow all localhost requests without a secret
LOCALHOST_SECRET=

# Your Apify API token
APIFY_TOKEN=your_apify_token_here
```

> `backend/.env` is gitignored. Never commit it.

### For production (Firebase Params)

Firebase Functions v2 uses [Firebase Params](https://firebase.google.com/docs/backend/config-env) for environment configuration. Set each value before deploying:

```bash
firebase functions:params:set APIFY_TOKEN="your_apify_token_here"
firebase functions:params:set ALLOWED_ORIGINS="https://your-app.netlify.app"
firebase functions:params:set LOCALHOST_SECRET=""
```

You will also be prompted for any unset params the first time you run `firebase deploy`.

---

## 5. Build TypeScript

```bash
cd backend
npm run build
```

Output is compiled to `backend/lib/`.

### Watch mode (auto-recompile on save)

```bash
npm run build:watch
```

---

## 6. Run locally with Firebase Emulators

```bash
npm run serve
```

This starts the Functions emulator. Endpoints will be available at:

```
http://localhost:5001/<project-id>/europe-west4/redditProxy
http://localhost:5001/<project-id>/europe-west4/searchSubredditsProxy
http://localhost:5001/<project-id>/europe-west4/proxyStatus
```

To use these from the frontend dev server, set `VITE_LOCALHOST_SECRET` in `frontend/.env.local` to the same value as `LOCALHOST_SECRET` in `backend/.env`, and enable proxy mode in the app's settings.

---

## 7. Deploy to Firebase

```bash
npm run deploy
```

This runs lint + build before deploying (configured as predeploy hooks in `firebase.json`).

To deploy only functions without other Firebase services:

```bash
firebase deploy --only functions
```

---

## 8. Set up Firestore

The rate limiter and analytics require Firestore. Deploy the security rules:

```bash
firebase deploy --only firestore
```

Firestore collections are created automatically on first use:

| Collection | Purpose |
|------------|---------|
| `rateLimits` | Per-IP rate limiting |
| `analytics` | Anonymous country-level usage stats |
| `monthlyUsage` | Global monthly invocation tracking |

---

## Functions overview

| Function | Trigger | Purpose |
|----------|---------|---------|
| `redditProxy` | HTTP GET | Fetches subreddit posts (pullpush.io → Arctic Shift → Apify fallback chain) |
| `searchSubredditsProxy` | HTTP GET | Searches subreddit names |
| `proxyStatus` | HTTP GET | Health check endpoint |
| `analyticsStatus` | HTTP GET | Returns anonymous usage stats |
| `cleanupRateLimits` | Scheduled (hourly) | Removes expired rate limit entries |

All HTTP functions are deployed to region **europe-west4**.

---

## How the content-source fallback chain works

When `redditProxy` receives a request it:

1. Validates the `subreddit` name and `sort` parameter
2. Checks per-IP rate limits (5 requests/minute) and the monthly invocation cap
3. Tries **[pullpush.io](https://pullpush.io/)** first — a free Pushshift-compatible Reddit archive that returns the *original* Reddit submission JSON directly, so no reshaping is needed. It has no live "hot"/"rising" ranking (it's an archive, not a live feed), so those sorts are approximated as score-sorted posts from the last 2 days
4. Falls back to **[Arctic Shift](https://arctic-shift.photon-reddit.com/)** if pullpush errors or returns nothing — also free, also returns real Reddit submission JSON, but only sorts by `created_utc` (no score-based sort at all), so it's a best-effort fallback regardless of the requested sort
5. Falls back to the paid Apify actor `automation-lab~reddit-scraper` if both archives come up empty — this actor scrapes Reddit's HTML rather than the old public `.json` API (which Reddit shut down in May 2026), so its output uses its own field names (`imageUrls`, `isNSFW`, `permalink`, `thumbnail`, etc.) rather than a raw passthrough of the original Reddit post JSON
6. `reshapeApifyPost()` in `proxy.ts` maps the Apify-only case onto the Reddit JSON API format (`{ data: { children: [...] } }`) so the frontend requires no changes regardless of which tier served the request — Reddit-hosted video and multi-image galleries fall back to a static thumbnail/first image where a direct video URL isn't available
7. Returns the JSON to the browser

The `searchSubredditsProxy` calls Reddit's public `search_reddit_names.json` endpoint directly — no Apify token needed for search.

---

## Logs

```bash
npm run logs
```

Or view logs in the [Firebase Console](https://console.firebase.google.com) under **Functions → Logs**.
