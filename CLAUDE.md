# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

Personal tech blog at **blog.arda.tr** covering AI/LLM tooling, Go/DevOps, home networking, and generative AI music. Built with Astro for static HTML output.

## Architecture

- **Framework**: Astro 5 (Static Site Generator)
- **Styling**: TailwindCSS with CSS variables
- **Content**: Markdown files via Astro Content Collections
- **Theming**: Custom implementation with 3 themes (dark/light/dracula)
- **Deployment**: Cloudflare Pages

## Project Structure

```
.
├── src/
│   ├── content/
│   │   └── blog/               # Markdown blog posts (YYYY-MM-DD-slug.md)
│   ├── components/
│   │   ├── Header.astro        # Navigation header with mobile menu
│   │   ├── Footer.astro        # Page footer
│   │   ├── PostCard.astro      # Blog post card component
│   │   └── ThemeToggle.astro   # Theme switcher (dark→light→dracula)
│   ├── layouts/
│   │   └── BaseLayout.astro    # Base HTML layout with SEO
│   ├── pages/
│   │   ├── index.astro         # Home page
│   │   ├── blog/
│   │   │   ├── index.astro     # Blog listing with tag filter
│   │   │   └── [slug].astro    # Individual blog post
│   │   ├── archive.astro       # Posts grouped by year
│   │   └── 404.astro           # Not found page
│   └── styles/
│       └── global.css          # Theme CSS variables, Tailwind
├── public/
│   └── images/                 # Static images, OG images
├── content.config.ts           # Content collection schema
├── astro.config.mjs            # Astro configuration
└── tailwind.config.mjs         # Tailwind with CSS variables
```

## Commands

```bash
npm run dev      # Development server (port 8080)
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

## Blog Posts

### File Naming
Posts in `src/content/blog/` with format: `YYYY-MM-DD-slug-name.md`

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
---
```

### Content Collection
Posts are loaded via Astro Content Collections defined in `src/content.config.ts`. Schema validates frontmatter at build time.

## Theming

Three themes defined in `src/styles/global.css` using HSL CSS variables:

| Theme | Description | Colors |
|-------|-------------|--------|
| `dark` | Default. Dracula Pro Blade | Cyan/green palette |
| `light` | Alucard theme | Light purple/blue |
| `dracula` | Full Dracula Pro | Purple/pink palette |

Theme is stored in localStorage and applied via class on `<html>` element.

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
