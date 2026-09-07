# Changelog

All notable changes to AutoScroll are documented here. This is the project's
first changelog entry — see git history for everything that came before it.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
the repo-root version in `VERSION.md` follows [Semantic Versioning](https://semver.org/).
Note this root version tracks the *repository* (docs, scripts, both apps
together) — it's separate from the independent `frontend/package.json` and
`backend/package.json` versions described in the README's Versioning section.

## [Unreleased]

### Added
- Standard project scaffolding: `CHANGELOG.md`, `VERSION.md`, `CONTRIBUTING.md`, `commit.sh`/`commit.bat`, `dev-server.sh`/`dev-server.bat`, and `LICENSE`
- `/legal` hub page ("Boring Legal Stuff") plus Privacy Policy, Terms and Ethics, Cookies Policy, Imprint, Disclaimer, and Opt-Out Preferences sub-pages, linked from the app footer
- `VITE_PROXY_BASE_URL` frontend env var so `dev-server.sh`/`.bat` can point the app at the local Firebase Functions emulator instead of production by default

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
