<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" width="300" srcset="frontend/src/assets/logo-white.png">
    <source media="(prefers-color-scheme: light)" width="300" srcset="frontend/src/assets/logo.png">
    <img src="frontend/src/assets/logo.png" width="300" alt="AutoScroll">
  </picture>
</p>

# Contributing to AutoScroll

AutoScroll is a personal project by [Stux.Dev](https://github.com/StuxDev), licensed
under [Apache-2.0](LICENSE.md) — pull requests, forks, and issues are all welcome.

Questions about contributing: [hello@stux.dev](mailto:hello@stux.dev).

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
  deployed to Netlify) and `backend/` (Firebase Cloud Functions, Node 22).
- **File-based routing.** Pages live in `frontend/src/pages/`; a new route is a new
  `.vue` file there, no manual router wiring needed (see `frontend/src/pages/README.md`).
- **Components auto-import.** No manual `import` statements needed for components under
  `frontend/src/components/`.
- Match the existing code style: no comments explaining *what* code does (names should
  do that), only *why* when something is genuinely non-obvious.
- Both apps enforce lint via `pnpm lint` / `npm run lint`, and the backend's Firebase
  predeploy hooks run lint + build automatically before every deploy.

## Versioning

This project uses [Date Versioning](https://datevers.ing). To release:

1. Add a `## vYY.MM.DD` entry at the top of `CHANGELOG.md`, with its sections in this order: Added, Changed, Fixed, Removed, Security, Deprecated.
2. Set `VERSION.md` to the same bare version (no `v`): today's **UTC** date as `YY.MM.DD`, or `YY.MM.DD-1`, `-2`… for later releases the same UTC day. Never a future date. Use UTC, not local time: just after midnight in the UK it is still the previous day in UTC.
3. Run `bash tests/version.sh`.
4. Run `./commit.sh` (or `commit.bat` on Windows). It checks the version, commits and tags `vYY.MM.DD`, and never pushes.

## Before committing

- `pnpm --dir frontend lint` and `npm --prefix backend run lint`
- `pnpm --dir frontend build` and `npm --prefix backend run build` to make sure both
  sides still type-check and compile
- Manually smoke-test the pages you touched — there's no automated test suite yet
