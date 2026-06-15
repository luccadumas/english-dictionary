#!/usr/bin/env bash

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

SERVICE="${RAILWAY_SERVICE:-dictionary-api}"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Error: '$1' is required but not installed." >&2
    exit 1
  fi
}

require_cmd railway
require_cmd node
require_cmd npm

echo "==> Checking Railway auth..."
if ! railway whoami >/dev/null 2>&1; then
  echo "Run 'railway login' first." >&2
  exit 1
fi
railway whoami

if [[ ! -d ".railway" ]]; then
  echo "==> Linking Railway project..."
  railway link
fi

echo "==> Linking service: ${SERVICE}"
railway service link "${SERVICE}"

echo "==> Generating Prisma client..."
(cd backend && npm run prisma:generate)

echo "==> Importing words into production database (may take several minutes)..."
railway run npm run import:words

echo "==> Import finished."
