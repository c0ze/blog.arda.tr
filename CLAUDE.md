# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

Personal tech blog at **blog.arda.tr** covering AI/LLM tooling, Go/DevOps, home networking, and generative AI music. Built with Vite + React + TypeScript.

## Architecture

- **Framework**: Vite 5 + React 18 + TypeScript
- **Styling**: TailwindCSS + shadcn/ui components
- **Content**: Markdown files with gray-matter frontmatter, loaded via `import.meta.glob()`
- **Routing**: react-router-dom
- **Theming**: next-themes with 3 theme options
- **Deployment**: Cloudflare Pages via GitHub Actions

## Project Structure

```
.
├── src/
│   ├── App.tsx                 # Main router setup
│   ├── main.tsx                # Entry point
│   ├── index.css               # Global styles, theme CSS variables
│   ├── components/
│   │   ├── Header.tsx          # Navigation header with mobile menu
│   │   ├── Footer.tsx          # Page footer with attribution
│   │   ├── PostCard.tsx        # Blog post card component
│   │   ├── TagFilter.tsx       # Tag filtering component
│   │   ├── ThemeProvider.tsx   # Theme context provider
│   │   ├── ThemeToggle.tsx     # Theme switcher (cycles dark→light→dracula)
│   │   └── ui/                 # shadcn/ui components (30+)
│   ├── pages/
│   │   ├── Home.tsx            # Landing page with featured posts
│   │   ├── Blog.tsx            # All posts with tag filtering
│   │   ├── BlogPost.tsx        # Individual post with prev/next nav
│   │   ├── Archive.tsx         # Posts grouped by year
│   │   └── NotFound.tsx        # 404 page
│   ├── hooks/
│   │   ├── use-mobile.tsx      # Mobile breakpoint detection
│   │   └── use-toast.ts        # Toast notification hook
│   ├── lib/
│   │   └── utils.ts            # Utility functions (cn helper)
│   └── data/
│       └── blogPosts.ts        # Dynamic markdown loader
├── content/
│   └── blog/                   # Markdown blog posts (YYYY-MM-DD-slug.md)
├── public/                     # Static assets
├── publicimages/               # Blog post images
├── scripts/
│   ├── new-post.ts             # Create new blog post script
│   └── generate-sitemap.ts     # Sitemap generator
├── .github/workflows/          # GitHub Actions for deployment
├── tailwind.config.ts          # Tailwind with CSS variables
├── vite.config.ts              # Vite config with path aliases
├── components.json             # shadcn/ui configuration
└── wrangler.toml               # Cloudflare Workers config
```

## Commands

```bash
npm run dev              # Development server (port 8080)
npm run build            # Production build + sitemap generation
npm run build:dev        # Build in development mode
npm run preview          # Preview production build
npm run lint             # ESLint
npm run post             # Create new blog post (interactive)
npm run new-post         # Alias for npm run post
npm run generate-sitemap # Standalone sitemap generation
```

## Blog Posts

### File Naming
Posts are stored in `content/blog/` with the format: `YYYY-MM-DD-slug-name.md`

### Frontmatter Fields
```markdown
---
title: "Post Title"           # Required
date: "YYYY-MM-DD"            # Publication date
excerpt: "Brief description"  # Card preview text
tags: ["ai", "devops"]        # For filtering
keywords: "seo, keywords"     # SEO keywords
description: "SEO desc"       # Meta description
author: "Author Name"         # Post author
---
```

### Content Loading
Posts are loaded dynamically at build time using Vite's `import.meta.glob()` in `src/data/blogPosts.ts`. No manual registration needed - just add a markdown file.

## Theming

Three themes available, defined in `src/index.css` using HSL CSS variables:

| Theme | Description | Colors |
|-------|-------------|--------|
| `dark` | Default. Dracula Pro Blade | Cyan/green palette |
| `light` | Alucard theme | Light purple/blue |
| `dracula` | Full Dracula Pro | Purple/pink palette |

ThemeToggle cycles: dark → light → dracula → dark

### Adding/Modifying Themes
1. Add CSS variables in `src/index.css` under a new `.theme-name` class
2. Update ThemeToggle.tsx cycle logic
3. Tailwind uses CSS variables automatically via `tailwind.config.ts`

## Path Aliases

TypeScript path alias configured in `vite.config.ts` and `tsconfig.json`:
```typescript
import { Component } from "@/components/Component"
```

## Key Dependencies

| Package | Purpose |
|---------|---------|
| react-markdown | Markdown rendering |
| rehype-prism-plus | Syntax highlighting |
| remark-gfm | GitHub Flavored Markdown |
| next-themes | Theme management |
| gray-matter | Frontmatter parsing |
| lucide-react | Icons |
| sonner | Toast notifications |

## SEO

- Semantic HTML5 (`article`, `section`, `aside`)
- JSON-LD structured data (BlogPosting, Person, MusicGroup)
- OpenGraph and Twitter card meta tags in BlogPost.tsx
- Auto-generated sitemap at build time
- Unique meta titles/descriptions per route

## Code Style

- Use the `cn()` utility from `@/lib/utils` for conditional classes
- Follow existing component patterns in `src/components/`
- shadcn/ui components are in `src/components/ui/` - don't modify directly
- Use Tailwind CSS variables (e.g., `bg-background`, `text-foreground`)

## Deployment

Automatic deployment via GitHub Actions on push to main:
1. Build runs `npm run build` (includes sitemap generation)
2. Deploys to Cloudflare Pages
3. Site available at blog.arda.tr
