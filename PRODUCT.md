# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: peers and collaborators.** Engineers and makers who arrive from
GitHub (`c0ze`), Mastodon, Bluesky, `arda.tr`, or an RSS reader. They are here
to read something specific, not to browse a brand.

**Secondary: Arda himself.** The blog is the working log — the place a project
gets written down while it is still warm.

Not a recruiter surface (that is `resume.arda.tr`) and not a lead-generation
surface. No conversion funnel belongs here.

## Product Purpose

A personal blog, published since 2010; the site counts its own posts (the
counts beside its lists), so no number is kept here. It is where the work
on `arda.tr` gets explained: how a thing was built, why it was abandoned, what
the interesting part was.

Success: a peer reads to the end of a post and comes back for the next one.

## Positioning

Sixteen years of one person's writing, with a visible seven-year silence in the
middle (2019–2024) and a heavy recent burst — most posts are from 2025–2026.

The archive is not uniform and should not pretend to be: 2010–2011 is a Turkish
and Japanese personal scrapbook (music links, diary entries, one post titled
"(No Title)"); 2013–2018 is sparse infrastructure notes; 2025–2026 is dense
"Introducing X" ship-logs and essays on AI, agents, MCP, Gleam, ReScript and
generative black metal.

## Operating Context

- Astro 5 static site on a Cloudflare Worker (static assets), `blog.arda.tr`.
- Sibling to `arda.tr` (index), `resume.arda.tr` (dossier), `ai.arda.tr`.
- Every push to `main` auto-announces new posts to **Mastodon and Bluesky**
  via `post-mastodon` / `post-bluesky` in a separate `announce` job that runs
  after the deploy job, so the post is live when the networks fetch it.
- Inbound is social, RSS and referral. Search is Pagefind, built at deploy time.

## Capabilities and Constraints

- **Astro 5 static**, `@astrojs/sitemap` only. Plain CSS on the family
  theme's tokens (no Tailwind since 2026-11-22). No MDX integration, and the
  content glob is `**/*.md` — posts cannot embed components today.
- **Minimal JS, no framework.** No hydration. Chrome behaviour is small
  `is:inline` scripts (the scheme boot snippet, the `/blog` tag filter, the
  `/search` Pagefind loader). The one bundled module is `src/scripts/site.js`
  plus the family's `scheme.js`: the scheme switch and the single-key
  shortcuts. Every page reads fully without it.
  A redesign that needs a JS framework is the wrong redesign.
- **Post bodies contain raw HTML** — markdown images alongside raw `<img>`,
  `<iframe>` (youtube-nocookie, SoundCloud) and `<video>`. These must keep
  rendering inside the prose column (rehype steps in `src/lib/rehype.mjs`
  lazy-load them and size local images).
- **Excerpt length is a hard product constraint.** A too-long `excerpt` once
  broke a deploy against Mastodon's 500-character limit.
- **Build is a three-step chain**: `astro build && tsx scripts/merge-sitemap.ts
  && pagefind --site dist` (one index per language; `/search` queries all of
  them through `public/pagefind-all/pagefind.js`). `merge-sitemap` exits 1 without `dist/sitemap-0.xml`;
  Pagefind needs `data-pagefind-body` to survive on post pages.
- **Frontmatter schema** (`src/content.config.ts`): `title`, `date` required;
  `excerpt`, `author`, `description`, `keywords`, `image`, `lang`, `draft`
  optional. `image` is the OG image only (Kara Duman shows no hero and no card
  art); `excerpt` is also the row description and the post's standfirst. No
  `heroImage`, no `series`, no `updated`.
- **Tags are a long tail** — a few heavy ones (`dev`, `ai`, `legacy`, `geek`)
  and most used exactly once; the index prints the live counts. `legacy`
  marks the 2010–2011 posts.
- **No tag pages and no pagination.** `/blog` renders every post at once and
  filters client-side via `?tag=`.
- **Automated gates:** `npm test` (node:test — OG images exist in `public/`,
  the scheme and tag-filter scripts under a fake DOM, code-token contrast and
  tokens-only CSS, the brand-file contract, and the pure helpers: post order,
  links, descriptions, feed, rehype steps, the announce and new-post
  builders), `astro check`, the build, and the theme-contract script. There
  is no lint and no `verify` script.
- Node 24.14.0 pinned via `.mise.toml`.
- **Visual system:** the family's Kara Duman (2026-11-23), see DESIGN.md
  and `../DESIGN-SYSTEM.md`. It replaced The Index (2026-11-22, rejected the
  next day), which had replaced One Bit Forest (2026-09-23), The Weekly Page
  and, before them, Ink & Ledger.

## Brand Commitments

- The bar carries the family's emblem and **arda.tr** wordmark followed by
  `blog`. The home headline is **"Blog"** (2026-11-23, Kara Duman's slide 13;
  it was "Coze."); the line under it is *Notes on software and tools.*
  (2026-11-22; it was *the ledger of side quests*). The blog's own name stays
  **"Coze"** in page titles, the feed, the JSON-LD and the footer line
  *"Coze: Arda Karaduman’s blog, since 2010."*
- The disclosure **"Human-driven. AI is used only for editing."** must
  survive any redesign (reworded 2026-11-22 from "AI is utilized solely for
  editorial refinement").
- Voice is dry, first-person, unhyped — "first post baby", "Grep Thyself".
- Licence split: code MIT, **posts CC BY 4.0**.
- The Cloudflare Web Analytics beacon ships `is:inline` and must stay verbatim.

## Evidence on Hand

Real and usable: every dated post with its real title, tags and reading times; a
genuine 2010 start date; real embedded media; a real RSS feed with enclosures;
Mastodon and Bluesky presences.

**Absent — must never be fabricated:** view counts, subscriber numbers,
comments, reactions, "popular post" rankings, or any engagement metric. The
site collects none of these.

## Product Principles

1. **The post is the product.** Every design decision serves reading a single
   piece of prose to the end.
2. **Minimal JS.** Interactivity is a cost, not a feature: the scheme
   switch, the tag filter, search and a few single-key shortcuts are all of
   it.
3. **Recent work leads; the archive stays reachable.** The front page is
   current; sixteen years of history is one deliberate click away, not buried
   and not shoved forward (confirmed 2026-07-25).
4. **The archive is uneven and that is honest.** Do not retro-fit 2010 diary
   entries into the register of 2026 ship-logs.
5. **Claim only what is real.** There are no engagement numbers to show.

## Accessibility & Inclusion

- WCAG AA contrast in both schemes; under `prefers-contrast: more` hairlines
  take the strong rule colour and muted text the text colour. (The four
  renditions with their AAA high-contrast pair went with One Bit Forest.)
- Light (bone paper) by default; dark is the visitor's pin.
- No animation: there is nothing for `prefers-reduced-motion` to turn off.
- Posts carry `lang` where they are not English (5 `tr`, 4 `ja`); `<html lang>`
  follows it, and so does `og:locale` (`tr_TR`, `ja_JP`, else `en_US`). The
  chrome keeps `lang="en"`.
- Semantic sectioning, keyboard-reachable navigation, visible focus states.
