# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

Personal tech blog at blog.arda.tr covering AI/LLM tooling, Go/DevOps, home networking, and generative AI music.

## Architecture

- **Framework**: Vite 5 + React 18 + TypeScript
- **Styling**: TailwindCSS + shadcn/ui components
- **Content**: Markdown files with gray-matter frontmatter parsing
- **Deployment**: Cloudflare Pages via GitHub Actions

## Project Structure

```
.
├── src/
│   ├── App.tsx              # Main router setup
│   ├── main.tsx             # Entry point
│   ├── index.css            # Global styles and CSS variables (theme colors)
│   ├── components/
│   │   ├── Header.tsx       # Navigation header
│   │   ├── Footer.tsx       # Page footer
│   │   ├── PostCard.tsx     # Blog post card component
│   │   ├── TagFilter.tsx    # Tag filtering component
│   │   └── ui/              # shadcn/ui components
│   ├── pages/               # Route pages (Home, Blog, BlogPost, Archive)
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   └── data/                # Static data
├── content/                 # Markdown blog posts
├── public/                  # Static assets
├── scripts/                 # Build scripts (sitemap generator, new post)
├── tailwind.config.ts       # Tailwind configuration with CSS variable colors
└── index.html               # HTML template with SEO meta tags
```

## Common Commands

```bash
# Development server
npm run dev

# Production build (includes sitemap generation)
npm run build

# Create new blog post
npm run new-post
# or
npm run post

# Preview production build
npm run preview

# Lint
npm run lint
```

## Key Implementation Details

### Theming
- CSS variables defined in `src/index.css` using HSL format
- Tailwind configured to use CSS variables via `tailwind.config.ts`
- `next-themes` package available for theme switching
- `darkMode: ["class"]` configured in Tailwind

### Content
- Blog posts in `content/` as Markdown with frontmatter
- Frontmatter fields: title, date, excerpt, tags, keywords, description
- Sitemap auto-generated at build time

### Styling
- shadcn/ui components in `src/components/ui/`
- Custom design tokens in CSS (gradients, shadows, transitions)
- Inter font for body, JetBrains Mono for code

## SEO Requirements
- Semantic HTML5 tags (article, section, aside)
- JSON-LD structured data (BlogPosting, Person, MusicGroup)
- Unique meta titles/descriptions per route
- Optimized images with alt text
