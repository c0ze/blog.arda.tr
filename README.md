# Coze Blog (Astro)

Personal tech blog at **blog.arda.tr** - built with Astro for static HTML output, perfect SEO, and per-page social media previews.

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

## Deployment

### GitHub Pages

This repo already ships with [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml).
Push to `main` or trigger the workflow manually and GitHub Pages will build and publish `dist/`.

If you need to recreate the workflow, the shape is:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci
      - run: npm run build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### Manual Deploy

```bash
npm run build
# Publish dist/ to GitHub Pages or another plain static host
```

## Creating New Posts

Create a new markdown file in `src/content/blog/` with the format `YYYY-MM-DD-slug-name.md`:

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

Use existing tags: `dev`, `geek`, `music`, `metal`, `ai`, `hardware`, `retro`

## Project Structure

```
src/
├── content/blog/     # Markdown blog posts
├── components/       # Astro components
├── layouts/          # Page layouts
├── pages/            # Route pages
└── styles/           # Global CSS
public/
└── images/           # Static images
dist/                 # Build output (git-ignored)
```

## Performance Features

- **Zero JS by default** - Pages ship no JavaScript unless needed
- **Theme toggle** - Only interactive component, uses inline script
- **Static HTML** - Every page is pre-rendered at build time
- **Optimized fonts** - Google Fonts with preconnect
- **CSS purging** - Unused Tailwind classes removed automatically
