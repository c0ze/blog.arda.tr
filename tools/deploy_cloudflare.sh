#!/usr/bin/env bash
# Build the committed HEAD in a fresh clone and deploy it to the blog-arda-tr
# Worker (blog.arda.tr). The same steps as the build check
# (.github/workflows/build.yml): npm ci, npm test, npm run check, npm run build.
# Uses your local wrangler login; run `npx wrangler login` once if it asks.
# Commit first: uncommitted changes are not deployed. Deploy before you push:
# the push announces new posts, and they have to be live by then.
# Extra arguments go to wrangler (e.g. --dry-run --outdir DIR).
set -euo pipefail
# Node 24, as in .mise.toml and the build check.
if [[ "$(node --version)" != v24.* ]]; then
  command -v mise >/dev/null && exec mise x node@24 -- "$0" "$@"
  echo "Node 24 is required (found $(node --version))" >&2
  exit 1
fi
repo="$(cd "$(dirname "$0")/.." && pwd)"
rev="$(git -C "$repo" rev-parse HEAD)"
git -C "$repo" diff --quiet HEAD || echo "note: uncommitted changes are not deployed"
mkdir -p "$HOME/tmp"
src="$(mktemp -d -p "$HOME/tmp" blog-arda-tr-deploy.XXXXXX)"
trap 'rm -rf "${src:?}"' EXIT
git clone -q --revision="$rev" "$repo" "$src"
cd "$src"
npm ci
npm test
npm run check
npm run build
npx --yes wrangler@4.168.0 deploy "$@"
echo "blog.arda.tr: done, from ${rev:0:7}"
