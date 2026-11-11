# Coze Blog (Astro)

Personal tech blog at **blog.arda.tr** - built with Astro for static HTML output, perfect SEO, and per-page social media previews.

The visual system is **One Bit Forest**, shared with arda.tr, resume.arda.tr
and ai.arda.tr: amber phosphor on a warm night, a BBS-style file list, and every
post's OG image dithered live to one bit in the browser. See [DESIGN.md](./DESIGN.md).

## Quick Start

```bash
# Install dependencies
npm install

# Development server (http://localhost:8080)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Build Output

The `npm run build` command generates static HTML in the `dist/` folder. Astro automatically:

- **Minifies HTML** - Whitespace removal, attribute optimization
- **Minifies CSS** - Via Tailwind's built-in purging + Vite's CSS minification
- **Minifies JS** - Via Vite/Rollup with tree-shaking
- **Optimizes assets** - Content-hashed filenames for caching

After the Astro build, the sitemap is merged and [Pagefind](https://pagefind.app)
indexes the post pages into `dist/pagefind/`, powering the `/search` page. The
index only exists after a build, so `/search` shows a quiet fallback note under
`npm run dev`.

## Deployment

### GitHub Pages

This repo already ships with [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml).
Push to `main` or trigger the workflow manually and GitHub Pages will build and publish `dist/`.

The workflow has three jobs:

- **build**: `npm ci`, `npm test`, `npm run check`, `npm run build`, then
  uploads `dist/` as the Pages artifact (read-only token);
- **deploy**: publishes the artifact to GitHub Pages (the only job with
  `pages: write` / `id-token: write`);
- **announce** (pushes only, after deploy so the post is live): runs
  `npm run post-mastodon` and `npm run post-bluesky` for posts the push added
  or flipped from draft to published.

Runs queue in the `pages` concurrency group (`queue: max`, up to 100 waiting)
instead of cancelling each other, so a quick series of pushes doesn't lose an
announcement. actionlint 1.7.12 doesn't know the `queue` key yet and flags it;
GitHub documents it.

### Manual Deploy

```bash
npm run build
# Publish dist/ to GitHub Pages or another plain static host
```

## Creating New Posts

Create a new markdown file in the post's year folder, `src/content/blog/YYYY/`, with the format `YYYY-MM-DD-slug-name.md` (e.g. `src/content/blog/2026/2026-01-28-your-post.md`):

```markdown
---
title: "Your Post Title"
date: "2026-01-28"
excerpt: "Brief description for cards and social previews"
tags: ["dev", "ai"]
keywords: "seo, keywords, here"
description: "SEO meta description"
author: "Arda Karaduman"
image: "/images/your-og-image.png"  # Optional: custom social preview image
---

Your content here...
```

### Available Tags

Tags are free-form — reuse an existing tag when one fits (common ones include `dev`, `geek`, `music`, `metal`, `ai`, `hardware`, `retro`). Tags render as ruled mono chips and drive the `/blog?tag=` filter; the front page tallies them with ▮ bars.

## Project Structure

```
src/
├── content/blog/     # Markdown blog posts (one folder per year)
├── components/       # Astro components
├── layouts/          # Page layouts
├── lib/              # Post, ledger and display helpers
├── pages/            # Route pages
├── scripts/          # onebit.js (shared 1-bit engine, verbatim) + site.js (wiring)
└── styles/           # Rendition tokens and component styles
public/
└── images/           # Static images
dist/                 # Build output (git-ignored)
```

## Performance Features

- **Small JS** - One bundled module (`site.js` + the `onebit.js` engine) dithers the post images; covers are created lazily as they scroll near, so `/blog` never decodes every image on load. Everything else is four `is:inline` scripts: the rendition boot, the rendition switch, the `/blog` tag filter, and the `/search` Pagefind loader
- **No-JS fallback** - Each dithered canvas carries a `<noscript>` plain image
- **Static HTML** - Every page is pre-rendered at build time
- **Fonts** - Big Shoulders Display and IBM Plex Sans / Mono / Serif / Sans JP from Google Fonts, with preconnect; the Plex Sans JP stylesheet only blocks rendering on Japanese pages
- **CSS purging** - Unused Tailwind classes removed automatically

## License

The code is [MIT-licensed](./LICENSE). Blog posts (`src/content/blog/`) are
licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — share and
adapt with attribution (a link back to the original post is enough). Images are
© Arda Karaduman unless noted otherwise in the post.
