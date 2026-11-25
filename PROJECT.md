# PROJECT.md — blog.arda.tr

The handoff document for this repository: architecture, constraints, key files,
how to run and validate. The generic working rules are in CLAUDE.md.

## Project Overview

Personal tech blog at **blog.arda.tr** covering AI/LLM tooling, Go/DevOps, home networking, and generative AI music. Built with Astro for static HTML output.

## Architecture

- **Framework**: Astro 5 (Static Site Generator)
- **Styling**: plain CSS on the family theme's tokens: verbatim copies of arda.tr's brand files in
  `src/brand/`, plus the blog's own `src/styles/global.css`. No Tailwind, no PostCSS config.
- **Content**: Markdown files via Astro Content Collections
- **Design**: Kara Duman, the arda.tr family system (see [DESIGN.md](./DESIGN.md) and `../DESIGN-SYSTEM.md`)
- **Theming**: light (bone paper) unless the visitor pins dark, with a two-state switch (see Theming below)
- **Deployment**: Cloudflare Worker (static assets), by hand: `npm run deploy`

## Project Structure

```
.
├── src/
│   ├── brand/                  # VERBATIM copies of arda.tr/brand/ (never edit here)
│   │   ├── arda.css            # The built Astryx theme: every token, scoped to [data-astryx-theme="arda"]
│   │   ├── brand.css           # The family patterns (ix- classes): bar, row, section, chips, prose, footer
│   │   ├── scheme.js           # The scheme switch: pin light/dark, old stored ids, the pre-paint snippet (+ scheme.d.ts)
│   │   ├── art/                # emblem.webp (the bar), wisp.webp (the plate at the top of a post)
│   │   └── logo/               # wordmark.svg (inlined in the bar as an Astro SVG component)
│   ├── content/
│   │   └── blog/               # Markdown posts in year folders (YYYY/YYYY-MM-DD-slug.md)
│   ├── components/
│   │   ├── Header.astro        # The family bar: emblem and wordmark, "blog", nav, scheme switch
│   │   ├── Footer.astro        # Colophon (keeps the "Human-driven" disclosure), licences, family links
│   │   ├── EntryRow.astro      # The family row: roman numeral, title (+ description), date
│   │   └── TagChip.astro       # A tag as a chip linking to /blog/?tag= (outlined; moss on a post)
│   ├── layouts/
│   │   └── BaseLayout.astro    # Base HTML layout with SEO, fonts and the scheme boot snippet
│   ├── lib/
│   │   ├── posts.ts            # getPublishedPosts()/getSlug() helpers (pages + RSS)
│   │   ├── order.ts            # byNewestFirst(): date, then post id (stable numbers and prev/next)
│   │   ├── feed.ts             # RSS item HTML (escaped excerpt + cover)
│   │   ├── rehype.mjs          # Post-body steps: demote body h1s, lazy media + image sizes, slash post links
│   │   ├── sitemap.mjs         # Sitemap serialize hook: a post's lastmod from the date in its slug
│   │   ├── ledger.ts           # getLedger(): numbering, years, gaps, tag counts
│   │   └── display.ts          # Post number and its roman numeral, the title threshold, date, reading time, summary, hrefs, JSON-LD helpers
│   ├── pages/
│   │   ├── index.astro         # Home: "Blog", the recent-posts carousel, the ten newest posts, the tag index
│   │   ├── blog/
│   │   │   ├── index.astro     # Every post, with the tag filter
│   │   │   └── [slug].astro    # Individual blog post (+ tags, related posts, prev/next)
│   │   ├── archive.astro       # Posts grouped by year
│   │   ├── search.astro        # Pagefind search (lazy-loads the Pagefind UI)
│   │   ├── rss.xml.js          # RSS feed
│   │   └── 404.astro           # Not found page
│   ├── content.config.ts       # Content collection schema
│   ├── scripts/
│   │   ├── site.js             # The scheme switch and the single-key shortcuts (every page)
│   │   └── carousel.js         # The home page's carousel: buttons, markers, the announcement
│   └── styles/
│       └── global.css          # Layer order, the brand imports, and everything the blog adds
├── public/
│   ├── favicon.svg             # The family's small glyph (copy of arda.tr/brand/logo/favicon.svg)
│   └── images/                 # Static images, OG images
├── scripts/                    # new-post, post-to-mastodon/-bluesky (pure parts in scripts/lib/), sitemap merge, theme contract
└── astro.config.mjs            # Astro configuration (rehype steps, Shiki css-variables theme)
```

## Commands

```bash
npm test         # Regression tests (Node's test runner, no extra dependencies)
npm run check    # astro check (types)
npm run dev      # Development server (port 8080)
npm run build    # Production build to dist/ (merges sitemap, then indexes search with Pagefind)
npm run preview  # Preview production build
```

The Pagefind search index (`dist/pagefind/`) only exists after a build, so
`/search` shows a quiet fallback message under `npm run dev`. Only blog post
pages are indexed (`data-pagefind-body` on the post article). Pagefind builds
one index per `<html lang>` (`en`, `ja`, `tr`), each with its own language
support (Japanese word segmentation, Turkish stemming), and a page normally
searches only its own. `/search` therefore gives PagefindUI
`bundlePath: '/pagefind-all/'`: `public/pagefind-all/pagefind.js` loads one
copy of `pagefind.js` per language (separate copies, since copies sharing a
worker clobber each other's language), searches all of them and returns one
list ranked by score. Don't use `--force-language`: one forced index loses the
Japanese segmentation, so words inside unspaced sentences (意味) go missing.

## Deploy

Deploying is manual. Pushing to GitHub does **not** deploy (the workflow is only a build
check), and nothing deploys on its own. To publish:

1. Commit the change. The script builds the committed `HEAD` in a temporary clone (`npm ci`, `npm test`, `npm run check`, `npm run build`), so uncommitted work is not deployed.
2. Run `npm run deploy` on a machine with the owner's wrangler login (`npx wrangler whoami`
   shows the personal account). Never create or store a Cloudflare API token for this.
3. Check the live site: `curl -sI https://blog.arda.tr/` should return 200.

**Deploy before you push a new post.** The announce job (Mastodon, Bluesky) runs on push, after the build check, and does not wait for the site: a post pushed before it is deployed gets announced while it is not live yet.

`worker/ranges.js` serves byte ranges for `*.mp4` and `*.webm` (static assets ignore `Range`). Keep media paths listed in `assets.run_worker_first`.

The Worker is `blog-arda-tr` (personal Cloudflare account), custom domain `blog.arda.tr`, both in
[wrangler.jsonc](wrangler.jsonc). README "Deployment" has the details. Until 2026-11-25
this was GitHub Pages, which could not renew its certificate behind the Cloudflare proxy.

## Blog Posts

### File Naming
Posts live in year subdirectories of `src/content/blog/` with format: `YYYY/YYYY-MM-DD-slug-name.md` (e.g. `src/content/blog/2026/2026-01-28-my-post.md`)

### Frontmatter Fields
```markdown
---
title: "Post Title"           # Required
date: "YYYY-MM-DD"            # Required
excerpt: "Brief description"  # For cards and social previews
tags: ["ai", "dev"]           # For filtering
keywords: "seo, keywords"     # SEO keywords
description: "SEO desc"       # Meta description
author: "Author Name"         # Post author
image: "/images/og.png"       # Optional: custom OG image
lang: "en"                    # Optional: post language (default "en")
draft: true                   # Optional: hide from production builds (default false)
---
```

### Announcements
A push to `main` announces the posts it added or un-drafted (build.yml `announce` job),
so deploy (`npm run deploy`) before pushing. When a post's first push failed its build or announce, the fix push does not announce it:
run the workflow manually with `announce_since` set to the commit right before the missing
post was added. The duplicate check only sees the accounts' recent posts (40 on Mastodon,
100 on Bluesky), so a manual run that selects more than 3 posts fails and posts nothing.

### Content Collection
Posts are loaded via Astro Content Collections defined in `src/content.config.ts`. Schema validates frontmatter at build time.

## Theming

Kara Duman (see [DESIGN.md](./DESIGN.md)). Two schemes; the blog is **light (bone paper) unless
the visitor pinned dark**. The system's scheme does not decide.

- `<html data-astryx-theme="arda">` scopes the theme's tokens. `src/styles/global.css` declares
  `@layer reset, astryx-base, astryx-theme, brand;` first, imports `src/brand/arda.css` and
  `src/brand/brand.css`, then holds the blog's own rules, unlayered. The blog loads no Astryx, so
  `global.css` also states the part of Astryx's reset and base (`--spacing-*`, `--focus-outline-width`,
  `color-scheme`) that the brand files assume.
- A pinned scheme is stored in localStorage under `theme` (only ever `dark`: going back to light
  clears the pin) and mirrored on `<html data-theme>` and the `color-scheme` meta.
  `BaseLayout.astro` inlines `bootSnippet('theme', 'light')` from `src/brand/scheme.js` right after
  the meta, so it applies before first paint. The snippet rewrites old stored ids by role (`night`,
  `night-hc` → `dark`; `xerox`, `xerox-hc` → `light`; the Ink & Ledger ids too) and drops anything
  else. Without script there is no `data-theme`, and the page follows the system.
- The switch is the `[data-scheme-toggle]` button in `Header.astro`; `src/scripts/site.js` calls
  `toggleScheme('theme', 'light')` and `watchScheme('theme', 'light')`. The key and the default
  must be the same pair in both places. It keeps working when browser storage is blocked; the
  choice simply cannot persist. `tests/scheme.test.mjs` runs the snippet and `site.js` against a
  fake page.
- Code blocks are dark in both schemes (brand.css gives `<pre>` `color-scheme: dark`), so every
  token inside one resolves to its dark value; `tests/code-contrast.test.mjs` checks them on both
  plates.
- High contrast is `prefers-contrast: more`, handled in brand.css. There are no renditions.
- A post's number is its chronological position (`ledgerNo()`), printed as a roman numeral
  (`roman()`). A post title longer than `TITLE_MAX` (48 characters), or a Japanese one, is set in
  Spectral instead of blackletter (`isPlainTitle()`), all in `src/lib/display.ts`.

### Brand files and the contract

Everything in `src/brand/` and `public/favicon.svg` is a verbatim copy from `arda.tr/brand/`.
Change a file in arda.tr, then copy it out:

```bash
cp ../arda.tr/brand/{arda.css,brand.css,scheme.js,scheme.d.ts} src/brand/
cp ../arda.tr/brand/art/{emblem.webp,wisp.webp} src/brand/art/
cp ../arda.tr/brand/logo/wordmark.svg src/brand/logo/
cp ../arda.tr/brand/logo/favicon.svg public/favicon.svg
```

`scripts/check-theme-contract.mjs` (run by `.github/workflows/theme-contract.yml`) fetches
`config/themes.json` from `c0ze/arda.tr`. With contract v4 it compares the sha256 of the three
copies with `files[name].sha256` and fails on a mismatch; while arda.tr's `main` still publishes an
older contract it prints a note and passes; it soft-passes when the contract cannot be fetched.
The comparison is `scripts/lib/theme-contract.mjs` (`tests/brand.test.mjs`). Run it locally with
`THEMES_CONTRACT_PATH=../arda.tr/config/themes.json node scripts/check-theme-contract.mjs`.

## SEO & Social Sharing

- **Per-page meta tags** - Title, description, keywords set in BaseLayout
- **Open Graph** - og:title, og:description, og:image, og:url
- **Twitter Cards** - summary_large_image for posts with their own image; summary for the square default image
- **Custom OG images** - Add `image` field to frontmatter for per-post images
- **JSON-LD** - BlogPosting on blog posts (`blogPostingLd()` in `src/lib/display.ts`): author and
  publisher are the family's shared Person `https://arda.tr/#person` (a post by another author keeps
  its own byline), `isPartOf` the Blog `https://blog.arda.tr/#blog`, `inLanguage` the post's `lang`;
  the home page prints that Blog node (`blogLd()`), whose author is the same Person
- **Sitemap** - `@astrojs/sitemap`, merged into `dist/sitemap.xml` by `scripts/merge-sitemap.ts`; post
  URLs carry `lastmod` from the date in their slug (the serialize hook sees only URLs), which
  `tests/sitemap.test.mjs` keeps equal to every post's frontmatter date
- **Canonical URLs** - Automatically generated; the 404 gets `noindex` instead (BaseLayout `noindex` prop)
- **Descriptions** - `description`, else `excerpt`, else ~155 characters of the body

## Path Aliases

Configured in `astro.config.mjs` and `tsconfig.json`:
```typescript
import Component from '@/components/Component.astro'
```

## Key Differences from React Version

1. **Static HTML** - Every page is pre-rendered, no client-side routing
2. **No hydration** - Components render to HTML only; two small bundled modules run the scheme switch and the shortcuts (`src/scripts/site.js` + the family's `scheme.js`) and the home page's carousel (`src/scripts/carousel.js`), everything else is `is:inline`
3. **Content Collections** - Type-safe markdown with Zod schema validation
4. **Per-page OG images** - Social previews work correctly now
5. **Faster builds** - ~3 seconds for all pages

## Code Style

- Use `.astro` files for components and pages
- Keep interactive JS minimal (inline scripts with `is:inline`)
- Use the family's classes (`.ix-bar`, `.ix-list` / `.ix-row`, `.ix-label`, `.ix-num`, `.ix-chip`, `.ix-prose`, …) and the theme's tokens (`--color-*`, `--text-*`, `--spacing-*`, `--ix-*`); see DESIGN.md. No hex colours and no px font sizes in the blog's own CSS (a test fails on either)
- A pattern brand.css lacks goes in `src/styles/global.css` under a class without the `ix-` prefix, and in DESIGN.md's list of what the blog adds
- Nothing is set below 18px (a test fails on a smaller size written in the blog's CSS)
- Post bodies still use a few Tailwind utility classes and One Bit Forest token names in raw HTML; `global.css` keeps those working (see its prose section). Don't rewrite old posts for a new system
- Follow existing component patterns
