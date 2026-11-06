# Frontend Install Guide

The frontend is a Vue 3 app built with Vite. It runs on **Node.js 20.19+ or 22.12+** (what Vite 7 needs) and uses **pnpm** as its package manager.

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 20.19+ or 22.12+ | https://nodejs.org |
| pnpm | 8 or higher | `npm install -g pnpm` |

---

## 1. Install dependencies

```bash
cd frontend
pnpm install
```

---

## 2. Configure environment variables

Create a `.env.local` file inside `frontend/`:

```bash
touch frontend/.env.local
```

Open `frontend/.env.local` and set:

```env
# Optional — only needed if the backend requires a localhost secret header.
# Leave empty otherwise.
VITE_LOCALHOST_SECRET=your_secret_here

# Optional: where the Cloud Functions live. Defaults to the production
# europe-west4 URL; point it at the emulator to test locally (dev-server does this for you).
# VITE_PROXY_BASE_URL=http://localhost:5001/<project-id>/europe-west4
```

The app always talks to Reddit through the Firebase Functions backend (see [install-backend.md](install-backend.md)) — Reddit shut down its public .json API in May 2026, so there's no direct-from-browser mode anymore.

---

## 3. Start the development server

```bash
pnpm dev
```

The app will be available at **http://localhost:3000**.

---

## 4. Build for production

```bash
pnpm build
```

Output is written to `frontend/dist/`. Deploy the contents of that folder to any static host (Netlify, Vercel, Cloudflare Pages, etc.).

### Preview the production build locally

```bash
pnpm preview
```

---

## 5. Lint

```bash
pnpm lint
```

ESLint runs with auto-fix enabled.

---

## Deployment (Netlify)

The project is pre-configured for Netlify. Push to your connected branch and Netlify will:

1. Run `pnpm build` inside `frontend/`
2. Serve the `dist/` folder as the publish directory

If setting up from scratch, use these Netlify build settings:

| Setting | Value |
|---------|-------|
| Base directory | `frontend` |
| Build command | `pnpm build` |
| Publish directory | `frontend/dist` |

Set `VITE_LOCALHOST_SECRET` as a Netlify environment variable if you use the localhost secret feature.
