# Coze Blog (Astro)

Personal tech blog at **blog.arda.tr** - built with Astro for static HTML output, perfect SEO, and per-page social media previews.

The visual system is **Kara Duman**, shared with arda.tr, resume.arda.tr
and ai.arda.tr: bone paper (dark if the visitor pins it), titles in blackletter,
text in Spectral in one 720px column, every post numbered in roman numerals.
The theme and the shared patterns are verbatim copies of arda.tr's brand files
in `src/brand/`.
See [DESIGN.md](./DESIGN.md).

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
- **Minifies CSS** - Via Vite's CSS minification
- **Minifies JS** - Via Vite/Rollup with tree-shaking
- **Optimizes assets** - Content-hashed filenames for caching

After the Astro build, the sitemap is merged and [Pagefind](https://pagefind.app)
indexes the post pages into `dist/pagefind/`, powering the `/search` page. The
index only exists after a build, so `/search` shows a quiet fallback note under
`npm run dev`.

## Deployment

Hosted on a Cloudflare Worker with static assets (`blog-arda-tr`, personal account),
deployed **by hand**, before you push:

```bash
npm run deploy   # tools/deploy_cloudflare.sh
```

It clones the **committed** `HEAD` (commit first) into a temporary directory, runs
`npm ci`, `npm test`, `npm run check` and `npm run build` there, and uploads `dist/`
with `wrangler deploy`, using your local wrangler login ([`wrangler.jsonc`](wrangler.jsonc)
holds the custom domain).

`worker/ranges.js` is the only script: static assets ignore `Range`, so the media paths
(`*.mp4`, `*.webm`) run it first to get byte ranges, which Safari needs to play video and the
browser needs to seek.

Until 2026-11-25 this was GitHub Pages; GitHub could not renew its certificates behind
the Cloudflare proxy, and its sites broke (526).

### Build check and announcements

[`.github/workflows/build.yml`](./.github/workflows/build.yml) runs on every push to
`main` and has two jobs:

- **build**: `npm ci`, `npm test`, `npm run check`, `npm run build` (read-only token);
- **announce** (after build): on a push, runs `npm run post-mastodon` and
  `npm run post-bluesky` for posts the push added or flipped from draft to
  published; on a manual run, only when `announce_since` is set (below). The
  post has to be live when Mastodon and Bluesky crawl the link for its preview
  card, so deploy before you push.

When a post's first push failed its build or announce, the push that fixes it
does not announce it. Run the workflow manually on `main` with `announce_since`
set to the commit right before the missing post was added. The duplicate check
only sees the accounts' recent posts (40 on Mastodon, 100 on Bluesky), so an
older commit would announce old posts again; a manual run that selects more
than 3 posts fails and posts nothing.

Runs queue in the `announce` concurrency group (`queue: max`, up to 100 waiting)
instead of cancelling each other, so a quick series of pushes doesn't lose an
announcement. actionlint 1.7.12 doesn't know the `queue` key yet and flags it;
GitHub documents it.

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

Tags are free-form — reuse an existing tag when one fits (common ones include `dev`, `geek`, `music`, `metal`, `ai`, `hardware`, `retro`). Tags render as square mono chips and drive the `/blog/?tag=` filter; the front page lists the ones used more than once, with counts.

## Project Structure

```
src/
├── brand/            # Verbatim copies of arda.tr's brand files (theme, patterns, scheme switch, artwork, logo)
├── content/blog/     # Markdown blog posts (one folder per year)
├── components/       # Astro components
├── layouts/          # Page layouts
├── lib/              # Post, ledger and display helpers
├── pages/            # Route pages
├── scripts/          # site.js: the scheme switch and the single-key shortcuts
└── styles/           # global.css: the brand imports and the blog's own styles
public/
└── images/           # Static images
dist/                 # Build output (git-ignored)
```

## Performance Features

- **Small JS** - One bundled module (`site.js` + the family's `scheme.js`) for the scheme switch and the single-key shortcuts. Everything else is three `is:inline` scripts: the scheme boot snippet, the `/blog` tag filter, and the `/search` Pagefind loader
- **No-JS fallback** - Every page reads fully without script; the scheme then follows the system (with script the blog is light unless dark is pinned)
- **Static HTML** - Every page is pre-rendered at build time
- **Fonts** - Grenze Gotisch, Spectral and JetBrains Mono from Google Fonts, with preconnect and `display=swap`; the Zen Antique stylesheet only blocks rendering on Japanese pages
- **Two small images in the chrome** - The emblem in the bar (15 KB) and one wisp beside a post on wide screens (7 KB, lazy); lists and post heads are text, and a post's `image` is only its social preview

## License

The code is [MIT-licensed](./LICENSE). Blog posts (`src/content/blog/`) are
licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — share and
adapt with attribution (a link back to the original post is enough). Images are
© Arda Karaduman unless noted otherwise in the post.
