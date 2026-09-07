#!/bin/bash
# AutoScroll - Local dev server
# Usage: ./dev-server.sh [--no-dev-mode]
#   --no-dev-mode   don't force the frontend's proxy backend to the local
#                   Firebase emulator for this run - it'll hit production
#                   Cloud Functions instead, same as a plain `pnpm dev`
#
# Starts the Vite dev server (frontend/, http://localhost:3000) and the
# Firebase Functions emulator (backend/) together.
#
# The frontend normally talks to the production Cloud Functions proxy even
# in dev (see VITE_PROXY_BASE_URL in frontend/src/stores/gallery.ts). This
# script forces that env var to point at the local emulator instead, so the
# dev-only backend is what you get out of the box - pass --no-dev-mode to
# test against the real production backend locally instead.
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NO_DEV_MODE=0

while [ $# -gt 0 ]; do
    case "$1" in
        --no-dev-mode) NO_DEV_MODE=1; shift ;;
        *) echo "Unknown option: $1" >&2; exit 1 ;;
    esac
done

PROJECT_ID="$(grep -o '"production"[[:space:]]*:[[:space:]]*"[^"]*"' "$DIR/.firebaserc" | sed -E 's/.*"([^"]+)"$/\1/')"
PROJECT_ID="${PROJECT_ID:-autoscroll-dce73}"

if [ ! -f "$DIR/backend/.env" ]; then
    echo "No backend/.env found - copying backend/.env.example to get you started."
    cp "$DIR/backend/.env.example" "$DIR/backend/.env"
fi

if [ ! -d "$DIR/frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    (cd "$DIR/frontend" && pnpm install)
fi

if [ ! -d "$DIR/backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    (cd "$DIR/backend" && npm install)
fi

PIDS=()
cleanup() {
    echo ""
    echo "Shutting down..."
    for pid in "${PIDS[@]}"; do
        kill "$pid" 2>/dev/null || true
    done
}
trap cleanup EXIT INT TERM

echo "Starting Firebase Functions emulator (backend/)..."
(cd "$DIR/backend" && npm run serve) &
PIDS+=("$!")

if [ "$NO_DEV_MODE" = "1" ]; then
    echo "NOT overriding the proxy backend - frontend will hit production Cloud Functions."
else
    export VITE_PROXY_BASE_URL="http://127.0.0.1:5001/${PROJECT_ID}/us-central1"
    echo "Frontend proxy backend forced to the local emulator ($VITE_PROXY_BASE_URL) - pass --no-dev-mode to use production instead."
fi

echo "Starting Vite dev server (frontend/, http://localhost:3000)..."
(cd "$DIR/frontend" && pnpm dev) &
PIDS+=("$!")

wait
