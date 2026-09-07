# Changelog

All notable changes to the AutoScroll backend are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
the version in `VERSION.md` follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.1.0] - 2026-09-07

### Changed
- Version is now read from `VERSION.md` instead of `package.json`

### Fixed
- `searchSubredditsProxy` called Reddit's `search_reddit_names.json`, part of the public API Reddit shut down in May 2026, and got back a 403 block page — switched to Arctic Shift's subreddit-prefix search, reshaped to match the frontend's expected `{names: [...]}` response
- Missing `engines.node` field, which Firebase's deploy now requires to determine the Cloud Functions runtime

## [1.0.0] - 2026-09-07

Initial documented release, capturing the app as it stood before this changelog existed.
