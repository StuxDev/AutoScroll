<p align="center">
  <img src="frontend/src/assets/logo.png" width="300" alt="AutoScroll">
</p>

# Contributing to AutoScroll

AutoScroll is a personal project by [StuxDev](https://github.com/StuxDev), licensed
under [Apache-2.0](LICENSE) — pull requests, forks, and issues are all welcome.

Questions about contributing: [contact@stux.dev](mailto:contact@stux.dev).

## Local setup

```bash
./dev-server.sh      # or dev-server.bat on Windows
```

This starts the Vite dev server (`frontend/`, http://localhost:3000) and the Firebase
Functions emulator (`backend/`) together, and points the frontend at the local emulator
by default so you're not hitting production Cloud Functions during development. Pass
`--no-dev-mode` to keep the frontend pointed at production instead. See the
[Quick start](README.md#quick-start) section of the README if you'd rather run the two
halves separately.

## Project conventions

- **Monorepo, two independently versioned apps.** `frontend/` (Vue 3 + Vuetify + Pinia,
  deployed to Netlify) and `backend/` (Firebase Cloud Functions, Node 22). See
  `CLAUDE.md` for the full architecture rundown.
- **File-based routing.** Pages live in `frontend/src/pages/`; a new route is a new
  `.vue` file there, no manual router wiring needed (see `frontend/src/pages/README.md`).
- **Components auto-import.** No manual `import` statements needed for components under
  `frontend/src/components/`.
- Match the existing code style: no comments explaining *what* code does (names should
  do that), only *why* when something is genuinely non-obvious.
- Both apps enforce lint via `pnpm lint` / `npm run lint`, and the backend's Firebase
  predeploy hooks run lint + build automatically before every deploy.

## Versioning and changelog

- `VERSION.md` (repo root) is a bare version string tracking documentation/tooling
  releases — bump it and add a `CHANGELOG.md` entry whenever you cut one
- `frontend/package.json` and `backend/package.json` track their own, independently
  bumped versions — see the README's [Versioning](README.md#versioning) section
- Every `CHANGELOG.md` release gets `### Added` / `### Changed` / `### Fixed`
  subsections — never a bare bullet list directly under a version heading
- `commit.sh` (bash) and `commit.bat` (Windows) commit and tag a release using whatever
  is currently in `VERSION.md` — update both together if the tagging logic ever changes

## Before committing

- `pnpm --dir frontend lint` and `npm --prefix backend run lint`
- `pnpm --dir frontend build` and `npm --prefix backend run build` to make sure both
  sides still type-check and compile
- Manually smoke-test the pages you touched — there's no automated test suite yet
