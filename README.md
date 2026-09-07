<p align="center">
  <img src="frontend/src/assets/logo.png" width="120" alt="AutoScroll">
</p>

# AutoScroll

A clean, auto-scrolling image gallery for Reddit — browse any subreddit's photos, videos, and albums in a slideshow view without leaving the page.

> **Not affiliated with Reddit Inc.** Content is sourced from Reddit's public data. For users 18 and over.

---

## Features

- **Image grid** — browse a subreddit's media posts at a glance, with hover overlays showing title, score, and author
- **Slideshow / media overlay** — fullscreen view with keyboard navigation (← → to move, Space to play/pause, Esc to close)
- **Albums, videos & embeds** — galleries, Reddit-hosted video, YouTube embeds, and GIFs all supported
- **NSFW filtering** — hidden by default with a separate age-gate prompt before any adult content is shown
- **Sort options** — hot, new, top, rising
- **Subreddit autocomplete** — search suggestions as you type
- **Proxy mode** — route requests through the backend when direct Reddit access is restricted
- **Dark theme** — Reddit-style dark UI out of the box

---

## Project structure

```
AutoScroll/
├── frontend/          # Vue 3 + Vuetify app (deployed to Netlify)
├── backend/           # Firebase Cloud Functions (proxy + rate limiting)
├── docs/              # Setup guides
│   ├── install-frontend.md
│   └── install-backend.md
├── firebase.json
└── firestore.rules
```

---

## Quick start

### Frontend

```bash
cd frontend
pnpm install
pnpm dev          # http://localhost:3000
```

### Backend

```bash
cd backend
npm install
cp .env.example .env   # add your APIFY_TOKEN
npm run serve          # starts Firebase emulators
```

See [`docs/install-frontend.md`](docs/install-frontend.md) and [`docs/install-backend.md`](docs/install-backend.md) for full setup instructions, or run both halves together with one command:

```bash
./dev-server.sh      # or dev-server.bat on Windows
```

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | Vue 3 + Composition API |
| UI components | Vuetify 3 (Material Design) |
| State management | Pinia |
| Build tool | Vite |
| Backend | Firebase Cloud Functions (Node.js 22) |
| Content source | [pullpush.io](https://pullpush.io/) → [Arctic Shift](https://arctic-shift.photon-reddit.com/) → [Apify Reddit Scraper](https://apify.com/automation-lab/reddit-scraper) (fallback chain) |
| Rate limiting | Firestore-based, per-IP |
| Frontend hosting | Netlify |

---

## Environment variables

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_LOCALHOST_SECRET` | No | Matches `LOCALHOST_SECRET` on the backend for local proxy testing |

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `APIFY_TOKEN` | Yes | API token from [console.apify.com](https://console.apify.com/account/integrations) |
| `ALLOWED_ORIGINS` | Yes | Comma-separated list of allowed CORS origins |
| `LOCALHOST_SECRET` | No | Optional secret header for localhost requests |

---

## Deployment

**Frontend** — deploy `frontend/dist/` to any static host. Netlify settings:

| Setting | Value |
|---------|-------|
| Base directory | `frontend` |
| Build command | `pnpm build` |
| Publish directory | `frontend/dist` |

**Backend** — deploy Firebase Functions:

```bash
firebase deploy --only functions
```

---

## Versioning

- Frontend version is set in `frontend/package.json` and baked into the build at compile time.
- Backend version is set in `backend/package.json` and returned by the `/proxyStatus` endpoint.
- Both versions are displayed in the app footer and the About dialog.

---

## Legal

See [Boring Legal Stuff](https://autoscroll.stux.dev/legal) (or `/legal` on any deployment) for the full privacy policy, terms, cookies policy, imprint, disclaimer, and opt-out preferences. In short:

- This project is not affiliated with Reddit Inc. in any way.
- All content is sourced from Reddit's publicly available data, directly or via Apify.
- No personal data, IP addresses, or cookies are stored.
- Anonymous, country-level analytics are collected for monitoring purposes only.
- This service is intended for users aged 18 and over.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for project conventions, and [CHANGELOG.md](CHANGELOG.md) for release history.

---

## License

[Apache-2.0](LICENSE)

---

*Written by <img src="https://github.com/StuxieDev.png" height="14" alt="StuxieDev" valign="middle"> [StuxieDev](https://github.com/StuxieDev).*
