# Backend Install Guide

The backend is a set of Firebase Cloud Functions (Node.js 22) that proxy Reddit content through the [Apify Reddit Scraper](https://apify.com/spry_wholemeal/reddit-scraper) actor.

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
cd functions
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

Create `functions/.env` from the example:

```bash
cp functions/.env.example functions/.env
```

Edit `functions/.env`:

```env
# Comma-separated list of allowed CORS origins
ALLOWED_ORIGINS=https://your-app.netlify.app,http://localhost:3000

# Optional — leave empty to allow all localhost requests without a secret
LOCALHOST_SECRET=

# Your Apify API token
APIFY_TOKEN=your_apify_token_here
```

> `functions/.env` is gitignored. Never commit it.

### For production (Firebase Params)

Firebase Functions v2 uses [Firebase Params](https://firebase.google.com/docs/functions/config-env) for environment configuration. Set each value before deploying:

```bash
firebase functions:params:set APIFY_TOKEN="your_apify_token_here"
firebase functions:params:set ALLOWED_ORIGINS="https://your-app.netlify.app"
firebase functions:params:set LOCALHOST_SECRET=""
```

You will also be prompted for any unset params the first time you run `firebase deploy`.

---

## 5. Build TypeScript

```bash
cd functions
npm run build
```

Output is compiled to `functions/lib/`.

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

To use these from the frontend dev server, set `VITE_LOCALHOST_SECRET` in `app_vue3/.env.local` to the same value as `LOCALHOST_SECRET` in `functions/.env`, and enable proxy mode in the app's settings.

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
| `redditProxy` | HTTP GET | Fetches subreddit posts via Apify |
| `searchSubredditsProxy` | HTTP GET | Searches subreddit names |
| `proxyStatus` | HTTP GET | Health check endpoint |
| `analyticsStatus` | HTTP GET | Returns anonymous usage stats |
| `cleanupRateLimits` | Scheduled (hourly) | Removes expired rate limit entries |

All HTTP functions are deployed to region **europe-west4**.

---

## How the Apify integration works

When `redditProxy` receives a request it:

1. Validates the `subreddit` name and `sort` parameter
2. Checks per-IP rate limits (5 requests/minute) and the monthly invocation cap
3. POSTs to the Apify actor `spry_wholemeal~reddit-scraper` with `includeRaw: true`, which returns the original Reddit post objects embedded in each result item
4. Reshapes the response into the Reddit JSON API format (`{ data: { children: [...] } }`) so the frontend requires no changes
5. Returns the reshaped JSON to the browser

The `searchSubredditsProxy` calls Reddit's public `search_reddit_names.json` endpoint directly — no Apify token needed for search.

---

## Logs

```bash
npm run logs
```

Or view logs in the [Firebase Console](https://console.firebase.google.com) under **Functions → Logs**.
