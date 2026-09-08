# Changelog

All notable changes to AutoScroll are documented here. This is the project's
first changelog entry — see git history for everything that came before it.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
the repo-root version in `VERSION.md` follows [Semantic Versioning](https://semver.org/).
Note this root version tracks the *repository* (docs, scripts, both apps
together) — it's separate from the independent `frontend/package.json` and
`backend/package.json` versions described in the README's Versioning section.

## [Unreleased]

## [1.2.6] - 2026-09-08

### Changed
- `logo.png` and `logo-white.png`'s "AutoScroll" wordmark recolored from black/white to the site's brand orange (`#FF4500`), matching the icon circle and the app's primary color

## [1.2.5] - 2026-09-08

### Added
- README logo now swaps between light/dark variants (`logo.png` / `logo-white.png`) via `<picture>` + `prefers-color-scheme`, so it stays legible in both GitHub themes (made directly on github.com)

### Changed
- README intro rewritten with a bolded one-line summary, a live link to the app, and a "Built and maintained by Stux.Dev, hosted by Netlify" credit (made directly on github.com)
- README credit line at the bottom expanded to "Built & Maintained by StuxDev, Hosted by Netlify" with a Netlify icon/link, and the Stux.Group line split onto its own line (made directly on github.com)
- Logo width in the README bumped from 120px to 300px for better legibility (made directly on github.com)

### Fixed
- `logo.png` and `logo-white.png` had the eye graphic pasted 40px too high inside the icon circle (the circle itself was centered, but the eye inside it wasn't) — re-composited both from the already-correct master `icon.png` so the eye is centered in the circle

## [1.2.4] - 2026-09-08

### Fixed
- `favicon-16x16.png` (both the standalone file and the 16×16 frame baked into `favicon.ico`/`icon.ico`) was a stale single-chevron design left over from before the eye-and-double-chevron rebrand, while every other size was already correct — regenerated all of them from the same master `icon.png` so every size matches

### Changed
- Frontend version bumped to 1.2.2 (`frontend/package.json`)

## [1.2.3] - 2026-09-08

### Added
- `uploadGeoIPDatabase` admin endpoint (secret-protected via `ADMIN_UPLOAD_SECRET`) to (re)upload the MaxMind GeoLite2 country database to Firebase Storage — see the GeoIP database setup section in `docs/install-backend.md`

### Changed
- Backend version bumped to 1.2.2 (`backend/package.json`)

### Fixed
- Country-level analytics were silently falling back to `XX` for every request — the default Firebase Storage bucket had never actually been provisioned for this project (a one-time manual step in the Firebase Console), so the GeoLite2 database could never be uploaded or downloaded. Storage is now enabled and the database uploaded

### Removed
- `backend/scripts/upload-geolite2.js` — never actually worked (empty `storageBucket` config, and required a service account key that was never set up); replaced by the `uploadGeoIPDatabase` endpoint, which needs no local Google Cloud credentials

## [1.2.2] - 2026-09-07

### Changed
- `frontend/package.json` and `backend/package.json` renamed to `autoscroll_frontend` / `autoscroll_backend`
- Frontend and backend versions live in `frontend/package.json` / `backend/package.json` again, not a separate `VERSION.md` per app — one root-level versioning scheme, not three
- Backend's Firebase codebase renamed from `default` to `autoscroll_backend` — deploy commands now use `firebase deploy --only functions:autoscroll_backend` instead of the unscoped `--only functions`

### Fixed
- `.github/dependabot.yml` pointed at a nonexistent `/app_vue3` directory (the real path is `/frontend`), so Dependabot was never actually scanning frontend dependencies — fixed, and added a `/backend` entry too

## [1.2.1] - 2026-09-07

### Fixed
- `backend/README.md` still described `searchSubredditsProxy` as calling Reddit's public search endpoint directly — updated to match the Arctic Shift switch (see 1.2.0 below)

## [1.2.0] - 2026-09-07

### Added
- `netlify.toml` checking the frontend's Netlify build settings (base directory, build command, publish directory) into the repo so they survive a repo relink

### Changed
- The backend proxy is now the only content path — removed the "use proxy" toggle and all direct-from-browser code paths, since Reddit's public `.json` API shutdown (May 2026) meant direct mode never actually worked anymore. The app now checks backend status automatically on load instead of only after a fetch already failed
- Rebranded `StuxieDev`/`stuxie.dev` references to `StuxDev`/`stux.dev` throughout (README, CONTRIBUTING, legal pages, contact links, GitHub remote)
- Updated the Privacy Policy, Cookies Policy, and Opt-Out Preferences pages, plus the dev install docs, to reflect there's only one content path now

### Fixed
- `searchSubredditsProxy` called Reddit's `search_reddit_names.json`, part of the public API Reddit shut down in May 2026, and got back a 403 block page — switched to Arctic Shift's subreddit-prefix search, reshaped to match the frontend's expected `{names: [...]}` response
- The frontend's default proxy base URL pointed at `us-central1`, but the backend functions are deployed to `europe-west4` — every proxy request silently hit a nonexistent endpoint whenever `VITE_PROXY_BASE_URL` wasn't set, which was always true in production
- `backend/package.json` was missing an `engines.node` field, which Firebase's deploy now requires to determine the Cloud Functions runtime

### Removed
- `CLAUDE.md` and `GEMINI.md` from the repo root

## [1.1.0] - 2026-09-07

### Added
- Standard project scaffolding: `CHANGELOG.md`, `VERSION.md`, `CONTRIBUTING.md`, `commit.sh`/`commit.bat`, `dev-server.sh`/`dev-server.bat`, and `LICENSE`
- `/legal` hub page ("Boring Legal Stuff") plus Privacy Policy, Terms and Ethics, Cookies Policy, Imprint, Disclaimer, and Opt-Out Preferences sub-pages, linked from the app footer
- `VITE_PROXY_BASE_URL` frontend env var so `dev-server.sh`/`.bat` can point the app at the local Firebase Functions emulator instead of production by default
- `redditProxy` now tries [pullpush.io](https://pullpush.io/) and then [Arctic Shift](https://arctic-shift.photon-reddit.com/) — two free Reddit archives that return the original Reddit submission JSON — before falling back to Apify, reducing reliance on the paid Apify actor for most requests
- AutoScroll's own icon and logo — a stylized eye with a downward double-chevron ("auto-scroll"), replacing the generic Stux.Group mark previously used as a placeholder across the favicon, app icons, app bar, and README/CONTRIBUTING headers

### Changed
- Replaced the Apify actor `spry_wholemeal/reddit-scraper` (removed from the Apify Store) with [`automation-lab/reddit-scraper`](https://apify.com/automation-lab/reddit-scraper), now used only as the final fallback tier. It scrapes Reddit's HTML rather than the public `.json` API Reddit shut down in May 2026, so its output no longer includes a raw-JSON passthrough — `reshapeApifyPost()` in `backend/src/proxy.ts` reconstructs the fields the frontend needs, with Reddit-hosted video and multi-image galleries falling back to a static thumbnail/first image where a direct video URL isn't available
- `frontend/public/img/icons/*` were all mislabeled 512×512 copies of the same file regardless of filename (e.g. `favicon-16x16.png` was actually 512×512) — regenerated at their correct declared sizes along with `favicon.ico`/`icon.ico` as proper multi-resolution files
- `manifest.json`'s `theme_color`/`background_color` now match the app's actual Reddit-orangered/dark-surface theme colors instead of close-but-not-quite placeholders

## [1.0.0] - 2026-09-07

Initial documented release, capturing the app as it stood before this changelog existed.

### Added
- Auto-scrolling image/video gallery for any Reddit subreddit, with hover overlays showing title, score, and author
- Fullscreen slideshow view with keyboard navigation (arrows to move, Space to play/pause, Esc to close)
- Support for albums, Reddit-hosted video, YouTube embeds, and GIFs
- NSFW filtering, hidden by default behind a separate age-gate prompt
- Sort options (hot, new, top, rising) and subreddit search with autocomplete
- Direct-to-Reddit mode and a Firebase Functions proxy mode (with per-IP rate limiting) for when direct access is restricted
- Anonymous, country-level usage analytics (GeoIP, no IP storage)
- Reddit-style dark theme
