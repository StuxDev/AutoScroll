#!/bin/bash
# AutoScroll - Local dev server
# Usage: ./dev-server.sh [--no-dev-mode] [--lan]
#   --no-dev-mode   don't force the frontend's proxy backend to the local
#                   Firebase emulator for this run - it'll hit production
#                   Cloud Functions instead, same as a plain `pnpm dev`
#   --lan           let phones and other devices on your network open the frontend: Vite
#                   listens on all interfaces (prints the addresses to open) and forwards the
#                   frontend's emulator calls itself, so the emulator stays on 127.0.0.1.
#                   Without it everything stays on 127.0.0.1 / localhost only
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
LAN=0

while [ $# -gt 0 ]; do
    case "$1" in
        --no-dev-mode) NO_DEV_MODE=1; shift ;;
        --lan) LAN=1; shift ;;
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
    if [ "$LAN" = "1" ]; then
        # The other device can't reach 127.0.0.1:5001, so it calls Vite, which forwards to the emulator
        export AUTOSCROLL_EMULATOR_PROXY="http://127.0.0.1:5001"
        export VITE_PROXY_BASE_URL="/__emulator/${PROJECT_ID}/europe-west4"
    else
        export VITE_PROXY_BASE_URL="http://127.0.0.1:5001/${PROJECT_ID}/europe-west4"
    fi
    echo "Frontend proxy backend forced to the local emulator ($VITE_PROXY_BASE_URL) - pass --no-dev-mode to use production instead."
fi

echo "Starting Vite dev server (frontend/, http://localhost:3000)..."
VITE_ARGS=()
if [ "$LAN" = "1" ]; then
    VITE_ARGS=(--host 0.0.0.0)
    # This machine's IPv4 addresses (Windows, macOS or Linux), minus loopback
    case "$OSTYPE" in
        msys*|cygwin*|win32*) ADDRS="$(ipconfig | awk -F': *' '/IPv4/{print $2}' | tr -d '\r')" ;;
        darwin*) ADDRS="$(ifconfig | awk '/inet /{print $2}')" ;;
        *) ADDRS="$(hostname -I 2>/dev/null)" ;;
    esac
    echo "On your local network (--lan), open one of these on the other device:"
    for a in $ADDRS; do
        case "$a" in 127.*|'') ;; *) echo "    http://$a:3000" ;; esac
    done
    echo "  (usually the 192.168.x.x one; allow Node through the firewall if asked)"
fi
(cd "$DIR/frontend" && pnpm dev "${VITE_ARGS[@]}") &
PIDS+=("$!")

wait
