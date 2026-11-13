# PROJECT.md — blog.arda.tr

The handoff document for this repository: architecture, constraints, key files,
how to run and validate. The generic working rules are in CLAUDE.md.

## Project Overview

Personal tech blog at **blog.arda.tr** covering AI/LLM tooling, Go/DevOps, home networking, and generative AI music. Built with Astro for static HTML output.

## Architecture

- **Framework**: Astro 5 (Static Site Generator)
- **Styling**: TailwindCSS with CSS variables
- **Content**: Markdown files via Astro Content Collections
- **Design**: One Bit Forest, the arda.tr family system (see [DESIGN.md](./DESIGN.md))
- **Theming**: Four renditions — Night / Night HC / Xerox / Xerox HC (see Theming below)
- **Deployment**: GitHub Pages

## Project Structure

```
.
├── src/
│   ├── content/
│   │   └── blog/               # Markdown posts in year folders (YYYY/YYYY-MM-DD-slug.md)
│   ├── components/
│   │   ├── Header.astro        # The status bar: site mark, nav, entry count, JST clock, rendition switch
│   │   ├── Footer.astro        # Treeline strip + colophon (keeps the "Human-driven" disclosure)
│   │   ├── OgCanvas.astro      # A post's OG image as a live dithered canvas (+ <noscript> <img>)
│   │   ├── FileRow.astro       # BBS file-list row: cover, №, date, title + tags, minutes ▮ bars
│   │   ├── TagChip.astro       # Ruled mono tag chip (links to /blog/?tag=)
│   │   └── ThemeToggle.astro   # Rendition switch (4 renditions, a <details> menu)
│   ├── layouts/
│   │   └── BaseLayout.astro    # Base HTML layout with SEO + theme boot script
│   ├── lib/
│   │   ├── posts.ts            # getPublishedPosts()/getSlug() helpers (pages + RSS)
│   │   ├── order.ts            # byNewestFirst(): date, then post id (stable № and prev/next)
│   │   ├── feed.ts             # RSS item HTML (escaped excerpt + cover)
│   │   ├── rehype.mjs          # Post-body steps: demote body h1s, lazy media + image sizes, slash post links
│   │   ├── ledger.ts           # getLedger(): numbering, month tiers, year spine, the silence, tag counts
│   │   └── display.ts          # Date, reading-time, ▮ bar, label, postHref, description, JSON-LD helpers
│   ├── pages/
│   │   ├── index.astro         # Home page
│   │   ├── blog/
│   │   │   ├── index.astro     # Blog listing with tag filter
│   │   │   └── [slug].astro    # Individual blog post (+ related posts)
│   │   ├── archive.astro       # Posts grouped by year
│   │   ├── search.astro        # Pagefind search (lazy-loads the Pagefind UI)
│   │   ├── rss.xml.js          # RSS feed
│   │   └── 404.astro           # Not found page
│   ├── content.config.ts       # Content collection schema
│   ├── scripts/
│   │   ├── onebit.js           # VERBATIM copy of ../design-previews/onebit/onebit.js (the 1-bit engine)
│   │   └── site.js             # The only bundled script: wires onebit to the markup (lazy OG canvases…)
│   └── styles/
│       └── global.css          # Rendition tokens and every component style, Tailwind
├── public/
│   └── images/                 # Static images, OG images
├── scripts/                    # new-post, post-to-mastodon/-bluesky (pure parts in scripts/lib/), sitemap merge, theme contract
├── astro.config.mjs            # Astro configuration (rehype steps, Shiki css-variables theme)
└── tailwind.config.mjs         # Tailwind with CSS variables
```

## Commands

```bash
npm test         # Browser-control regression tests (Node, no extra dependencies)
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

### Content Collection
Posts are loaded via Astro Content Collections defined in `src/content.config.ts`. Schema validates frontmatter at build time.

## Theming

Four **renditions** — the One Bit Forest family ids — defined in
`src/styles/global.css` as plain hex custom-property blocks (`--bg`, `--fg`,
`--signal`, `--ob-*` …), see [DESIGN.md](./DESIGN.md). The rendition lists
live in `src/layouts/BaseLayout.astro` (boot script) and
`src/components/ThemeToggle.astro` (`renditions` array, with roles). Catalogue,
in menu order:

| ID | Name | Role |
|----|------|------|
| `night` | Night | dark — the default (bound to `:root`) |
| `night-hc` | Night HC | hc-dark (AAA) |
| `xerox` | Xerox | light |
| `xerox-hc` | Xerox HC | hc-light (AAA) |

The rendition is stored in localStorage under `theme` and applied as a class on
`<html>`. The boot script migrates older ids by role: the Weekly Page ids
(`pulp`→`xerox`, `pulp-hc`→`xerox-hc`, `beta`→`night`, `beta-hc`→`night-hc`)
and every Ink & Ledger id (`paper`→`xerox-hc`, `carbon`→`night-hc`,
`alucard`/`light`→`xerox`, the rest→`night`). With nothing stored it follows the
system color-scheme/contrast preference, and Night when none is stated. Theme
controls keep working when browser storage is blocked; preferences simply
cannot persist. `tests/theme-toggle.test.mjs` runs both scripts against a fake
DOM.

`scripts/check-theme-contract.mjs` (run by `.github/workflows/theme-contract.yml`)
compares this repo against the catalogue published by `c0ze/arda.tr`
(`config/themes.json`). Contract v3 checks shape only — the id set, each id's
role, and that every `requiredTokens` entry is declared per rendition — never
values (each site has its own tint and signal). arda.tr publishes contract v3
and the check passes for real; it only soft-passes when the contract cannot be
fetched or an older contract shares no ids. Run it
locally with `THEMES_CONTRACT_PATH=../arda.tr/config/themes.json node scripts/check-theme-contract.mjs`.


## SEO & Social Sharing

- **Per-page meta tags** - Title, description, keywords set in BaseLayout
- **Open Graph** - og:title, og:description, og:image, og:url
- **Twitter Cards** - summary_large_image for posts with their own image; summary for the square default image
- **Custom OG images** - Add `image` field to frontmatter for per-post images
- **JSON-LD** - BlogPosting schema on blog posts
- **Canonical URLs** - Automatically generated; the 404 gets `noindex` instead (BaseLayout `noindex` prop)
- **Descriptions** - `description`, else `excerpt`, else ~155 characters of the body

## Path Aliases

Configured in `astro.config.mjs` and `tsconfig.json`:
```typescript
import Component from '@/components/Component.astro'
```

## Key Differences from React Version

1. **Static HTML** - Every page is pre-rendered, no client-side routing
2. **No hydration** - Components render to HTML only; one small bundled module (`src/scripts/site.js` + `onebit.js`) runs the 1-bit imagery, everything else is `is:inline`
3. **Content Collections** - Type-safe markdown with Zod schema validation
4. **Per-page OG images** - Social previews work correctly now
5. **Faster builds** - ~3 seconds for all pages

## Code Style

- Use `.astro` files for components and pages
- Keep interactive JS minimal (inline scripts with `is:inline`); pictorial motion goes through `onebit.js`, never a fork of it
- Use the One Bit classes (`.bar`, `.file`, `.ls-head`, `.chip`, `.tally`, `.og`, `.prose`) and tokens (`--bg`, `--fg`, `--fg-2`, `--rule`, `--signal`, `--ob-*`); see DESIGN.md
- Follow existing component patterns
