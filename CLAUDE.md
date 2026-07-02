# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

Personal tech blog at **blog.arda.tr** covering AI/LLM tooling, Go/DevOps, home networking, and generative AI music. Built with Astro for static HTML output.

## Architecture

- **Framework**: Astro 5 (Static Site Generator)
- **Styling**: TailwindCSS with CSS variables
- **Content**: Markdown files via Astro Content Collections
- **Theming**: Custom implementation with a 9-theme catalogue (see Theming below)
- **Deployment**: GitHub Pages

## Project Structure

```
.
├── src/
│   ├── content/
│   │   └── blog/               # Markdown posts in year folders (YYYY/YYYY-MM-DD-slug.md)
│   ├── components/
│   │   ├── Header.astro        # Navigation header with mobile menu
│   │   ├── Footer.astro        # Page footer
│   │   ├── CarouselCard.astro  # Featured-post carousel card
│   │   ├── FeatureCard.astro   # Feature card for post highlights
│   │   ├── LedgerRow.astro     # Ledger-style post list row
│   │   ├── TagChip.astro       # Colored tag chip linking to the tag filter
│   │   └── ThemeToggle.astro   # Theme menu (9 themes)
│   ├── layouts/
│   │   └── BaseLayout.astro    # Base HTML layout with SEO + theme boot script
│   ├── lib/
│   │   ├── posts.ts            # getPublishedPosts()/getSlug() helpers (pages + RSS)
│   │   └── display.ts          # Date, reading-time, and tag-chip formatting helpers
│   ├── pages/
│   │   ├── index.astro         # Home page
│   │   ├── blog/
│   │   │   ├── index.astro     # Blog listing with tag filter
│   │   │   └── [slug].astro    # Individual blog post (+ related posts)
│   │   ├── archive.astro       # Posts grouped by year
│   │   ├── search.astro        # Pagefind search (only page that loads JS beyond inline scripts)
│   │   ├── rss.xml.js          # RSS feed
│   │   └── 404.astro           # Not found page
│   ├── content.config.ts       # Content collection schema
│   └── styles/
│       └── global.css          # Theme CSS variables, Tailwind
├── public/
│   └── images/                 # Static images, OG images
├── astro.config.mjs            # Astro configuration
└── tailwind.config.mjs         # Tailwind with CSS variables
```

## Commands

```bash
npm run dev      # Development server (port 8080)
npm run build    # Production build to dist/ (merges sitemap, then indexes search with Pagefind)
npm run preview  # Preview production build
```

The Pagefind search index (`dist/pagefind/`) only exists after a build, so
`/search` shows a quiet fallback message under `npm run dev`. Only blog post
pages are indexed (`data-pagefind-body` on the post article).

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

Nine themes defined in `src/styles/global.css` as per-theme HSL CSS variable blocks. The theme lists live in `src/layouts/BaseLayout.astro` (boot script) and `src/components/ThemeToggle.astro` (`THEMES` array). Catalogue, in menu order:

| ID | Name | Kind |
|----|------|------|
| `alucard` | Ivory | Light |
| `paper` | Paper | High-contrast light |
| `blade` | Abyss | Dark teal (default, bound to `:root`) |
| `dracula-pro` | Void | Dark purple |
| `carbon` | Carbon | High-contrast dark |
| `buffy` | Sakura | Dark magenta |
| `lincoln` | Amber | Dark gold |
| `morbius` | Ember | Dark red |
| `van-helsing` | Steel | Near-black blue |

Theme is stored in localStorage and applied via class on `<html>` element. The boot script in `BaseLayout.astro` migrates legacy stored values (`dark`→`blade`, `light`→`alucard`, `dracula`→`dracula-pro`) and falls back to the system color-scheme/contrast preference when nothing is stored.

`scripts/check-theme-contract.mjs` (run by `.github/workflows/theme-contract.yml`) verifies the menu and CSS tokens against the canonical catalogue published by `c0ze/arda.tr` (`config/themes.json`). Known intentional divergences live in the script's `ALLOWED_DRIFT` allowlist. Run it locally with `THEMES_CONTRACT_PATH=../arda.tr/config/themes.json node scripts/check-theme-contract.mjs`.

## SEO & Social Sharing

- **Per-page meta tags** - Title, description, keywords set in BaseLayout
- **Open Graph** - og:title, og:description, og:image, og:url
- **Twitter Cards** - summary_large_image format
- **Custom OG images** - Add `image` field to frontmatter for per-post images
- **JSON-LD** - BlogPosting schema on blog posts
- **Canonical URLs** - Automatically generated

## Path Aliases

Configured in `astro.config.mjs` and `tsconfig.json`:
```typescript
import Component from '@/components/Component.astro'
```

## Key Differences from React Version

1. **Static HTML** - Every page is pre-rendered, no client-side routing
2. **No hydration** - Components render to HTML only (except ThemeToggle)
3. **Content Collections** - Type-safe markdown with Zod schema validation
4. **Per-page OG images** - Social previews work correctly now
5. **Faster builds** - ~3 seconds for all pages

## Code Style

- Use `.astro` files for components and pages
- Keep interactive JS minimal (inline scripts with `is:inline`)
- Use Tailwind CSS variables (e.g., `bg-background`, `text-primary`)
- Follow existing component patterns
