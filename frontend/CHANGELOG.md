# Changelog

All notable changes to the AutoScroll frontend are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
the version in `VERSION.md` follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.1.0] - 2026-09-07

### Changed
- The backend proxy is now the only content path — removed the "use proxy" toggle and all direct-from-browser code paths, since Reddit's public `.json` API shutdown (May 2026) meant direct mode never actually worked anymore. The app now checks backend status automatically on load instead of only after a fetch already failed
- Rebranded `StuxieDev`/`stuxie.dev` references to `StuxDev`/`stux.dev` throughout
- Updated the Privacy Policy, Cookies Policy, and Opt-Out Preferences pages to reflect there's only one content path now
- Version is now read from `VERSION.md` instead of `package.json`

### Fixed
- Default proxy base URL pointed at `us-central1`, but the backend functions are deployed to `europe-west4` — every proxy request silently hit a nonexistent endpoint whenever `VITE_PROXY_BASE_URL` wasn't set, which was always true in production

## [1.0.0] - 2026-09-07

Initial documented release, capturing the app as it stood before this changelog existed.
