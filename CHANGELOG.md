# Changelog

All notable changes to AutoScroll are documented here. This is the project's
first changelog entry — see git history for everything that came before it.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
the repo-root version in `VERSION.md` follows [Semantic Versioning](https://semver.org/).
Note this root version tracks the *repository* (docs, scripts, both apps
together) — it's separate from the independent `frontend/package.json` and
`backend/package.json` versions described in the README's Versioning section.

## [Unreleased]

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
