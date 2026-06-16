# Frontend Install Guide

The frontend is a Vue 3 app built with Vite. It runs on **Node.js 18+** and uses **pnpm** as its package manager.

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 18 or higher | https://nodejs.org |
| pnpm | 8 or higher | `npm install -g pnpm` |

---

## 1. Install dependencies

```bash
cd app_vue3
pnpm install
```

---

## 2. Configure environment variables

Create a `.env.local` file inside `app_vue3/`:

```bash
cp .env.example .env.local 2>/dev/null || touch app_vue3/.env.local
```

Open `app_vue3/.env.local` and set:

```env
# Optional — only needed for local testing against the Firebase proxy.
# Leave empty if you don't need proxy access from localhost.
VITE_LOCALHOST_SECRET=your_secret_here
```

> **Note:** If you are only using the app in direct mode (no Firebase proxy), this file can remain empty.

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

Output is written to `app_vue3/dist/`. Deploy the contents of that folder to any static host (Netlify, Vercel, Cloudflare Pages, etc.).

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

1. Run `pnpm build` inside `app_vue3/`
2. Serve the `dist/` folder as the publish directory

If setting up from scratch, use these Netlify build settings:

| Setting | Value |
|---------|-------|
| Base directory | `app_vue3` |
| Build command | `pnpm build` |
| Publish directory | `app_vue3/dist` |

Set `VITE_LOCALHOST_SECRET` as a Netlify environment variable if you use the localhost secret feature.

---

## Proxy modes

The app can fetch Reddit data in two ways:

| Mode | How it works | When to use |
|------|-------------|-------------|
| **Direct** | Browser calls Reddit's public JSON API | Default; works without any backend |
| **Proxy** | Browser calls your Firebase Function, which calls Apify | Use when direct mode is blocked or restricted |

If direct mode fails, the app will prompt the user to switch to proxy mode automatically.
