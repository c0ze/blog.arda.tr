---
name: blog.arda.tr
description: Kara Duman as applied to the blog - bone paper, blackletter titles, one 720px reading column, roman-numeral rows, one wisp on a soot plate.
---

# Design System: blog.arda.tr

The blog's application of the family system **Kara Duman**
(`../DESIGN-SYSTEM.md`, adopted 2026-11-23; the blog is slide 13,
`../output/rebrand-kara-duman/13-blog.png`). It replaces The Index (22 November
2026, rejected the next day) and One Bit Forest before it. The family file is
binding; this file says how the blog uses it and what the blog adds.

## Overview

**His surname means black smoke.** Soot on paper, cut by hand, signed by one
person. On the blog that is:

- **Bone paper** unless the visitor pinned dark. One 720px reading column on
  every page.
- **Blackletter names things**: the page titles (Blog, Archive, Search) and a
  post's title, and the headings inside a post. Spectral says everything else.
- **Every post has a number**, its place in the whole run (oldest = I),
  printed as a roman numeral in ember.
- **One piece of artwork**: a thin wisp on a soot plate in the right margin at
  the top of a post, on wide screens. The emblem signs the bar. Nothing else:
  no hero images, no cover canvases. A post's `image` is its social preview only.
- 2px corners on controls, plates and code; 1px rules; no boxes, no shadows.

## Where it lives

| What | Where |
|---|---|
| The theme (every token) | `src/brand/arda.css`, scoped to `<html data-astryx-theme="arda">` |
| The family patterns (`ix-` classes) | `src/brand/brand.css` |
| The scheme switch | `src/brand/scheme.js` (+ `scheme.d.ts`) |
| Artwork and logo | `src/brand/art/emblem.webp`, `wisp.webp`; `src/brand/logo/wordmark.svg`; `public/favicon.svg` |
| The blog's own rules | `src/styles/global.css`, and the Pagefind styles in `src/pages/search.astro` |

Everything in `src/brand/` and the favicon are **verbatim copies** of
`arda.tr/brand/`. Never edit them here: change them in arda.tr, copy them out
(PROJECT.md has the commands), and `scripts/check-theme-contract.mjs` compares
the hashes with arda.tr's contract.

`global.css` declares `@layer reset, astryx-base, astryx-theme, brand;` before
anything else, imports the theme and the patterns, and keeps the blog's own
rules unlayered so they win. The blog loads no Astryx, so `global.css` also
states the small part of Astryx's reset and base that the brand files assume.

## Scheme

Light (bone paper) unless the visitor pins dark; the system's scheme does not
decide. `BaseLayout.astro` inlines `bootSnippet('theme', 'light')` right after
`<meta name="color-scheme" content="light dark">`; the switch in the bar calls
`toggleScheme('theme', 'light')`. Dark is stored as a pin under the
localStorage key `theme`; going back to light clears it. Old stored ids
(`night`, `xerox`, …) are rewritten by role. `theme-color` is bone, `#E8E0CE`.
Without script the page follows the system.

## Colour

All from the theme's tokens; see the table in `../DESIGN-SYSTEM.md`.

| Use | Token |
|---|---|
| Page, text | `--color-background-body`, `--color-text-primary` |
| Secondary text (standfirst, dates, counts) | `--color-text-secondary` |
| Links, numerals, the label that opens a list | `--ix-link` (`--color-text-accent`) |
| Row hover, inline code, the search input | `--ix-surface` |
| Section rule, row hairline | `--ix-rule`, `--ix-hairline` |
| A post's tag | bone on `--ix-moss` (`.ix-chip--tag`) |
| Code block | bone on soot, in both schemes |

No hex colour is written in the blog's own CSS (a test fails on one).

## Type

Google Fonts, `display=swap`: Grenze Gotisch 700/800/900, Spectral 400/400
italic/600, JetBrains Mono 400/700, and Zen Antique 400 for the Japanese posts
and titles (its stylesheet blocks rendering only on `lang="ja"` pages).

| What | Set in |
|---|---|
| Page title, post title | the theme's Heading 1: Grenze Gotisch 800, 64px, scaled down with the window to 44px |
| A long post title, or a Japanese one | Spectral 600 at the Heading 2 size (`h1.title-plain`) |
| Headings inside a post | h2 Grenze Gotisch 700; h3 and below Spectral 600 |
| Body | Spectral 21px / 1.7 in a post (`.ix-prose`), 20px / 1.6 elsewhere |
| Labels (Posts, a year, Related posts) | `.ix-label`: Spectral 600, capitals, tracked |
| Numerals | `.ix-num`: Spectral 600, ember (blackletter "IV" reads as "IU") |
| Meta line, dates, code | JetBrains Mono (`.ix-mono`) |

**The title threshold.** Blackletter is for names of about six words. A post
title longer than `TITLE_MAX` (48 characters, `src/lib/display.ts`) is a
sentence and is set in Spectral; so is any title of a `lang: ja` post.
Nothing is set below 18px, and no font size is written in px.

## Layout and components

- **Bar** (`Header.astro`): the round emblem and the inline wordmark (to
  arda.tr), `blog` in secondary text (to the blog's home), then the nav at the
  right: works, résumé, ask (ember), archive, search, rss, and the scheme
  switch, which names the scheme it switches to.
- **Page head**: the h1, one line of lede, sometimes a small count.
- **List**: an ember label (`<h2 class="ix-label ix-label--ember">`) with a
  count at the right, then `.ix-list` of `.ix-row`s (`EntryRow.astro`):
  numeral, title (its link covers the row), an optional description in
  italics (two lines at most), the date as `YYYY-MM-DD` in mono.
- **Home**: Blog, the ten newest posts, links to the rest, then the tag index
  as outlined chips.
- **/blog/**: Blog, the tag filter (`.ix-chip` buttons; the pressed one is
  filled), then every post with its description.
- **Archive**: one labelled list per year; a run of empty years is a label
  with a note and nothing under it.
- **Post**: a mono meta line (numeral · date · reading time), the title, the
  description as a secondary standfirst, the body in `.ix-prose` (links ember
  and underlined, a quotation between two rules in italics, code on soot),
  then the post's tags in moss, related posts as rows, and the older and newer
  post as key and value (`.ix-kv`).
- **Search**: Pagefind's UI on the same tokens: the family's input, the result
  count as a label, hairlines between results, hits on a tint of ember.
- **Footer**: `.ix-foot`, with the "Human-driven" disclosure.

## What the blog adds to brand.css

In `src/styles/global.css`, under classes without the `ix-` prefix (or as
overrides of an `ix-` class where the blog's content needs it):

| Addition | Why |
|---|---|
| `--num-col` and the `.ix-row` columns | The family's numeral column holds three letters; the blog's widest numeral is LXXXVIII. Under 720px the numeral and the date share a line and the title takes the full width. |
| `h1` scaling, `h1.title-plain` | The theme's phone sizes wait for a touch screen; long and Japanese titles leave blackletter. |
| `:lang(ja)` corrections | brand.css gives every element in Japanese text the body stack on a 1.8 line; headings, row titles and code spans need their own. |
| `.ix-prose p` | The theme's reset sizes every `<p>` as body text; in a post a paragraph is long-form text (21px / 1.7) like the list items around it. |
| `--code-plate` (a registered `<color>`) | brand.css sets `color-scheme: dark` and a `light-dark()` background on the same `<pre>`, so the plate would always be the dark page's. Resolved on `.ix-prose` and inherited, it is soot on paper and the raised soot on a dark page. |
| `.astro-code` | Shiki's css-variables theme on the theme's `--color-syntax-*` tokens. |
| `.post-wisp` | Where the plate sits: absolute, right of the column, from 68rem up; hidden below and in print. |
| `.list-head`, `.more`, `.block`, `.year-gap`, `.filter`, `.chip-n`, `.tag-toggle`, `.skip-link` | Small layout helpers: a label with its count, the links under a list, the gap between lists, the tag filter. |
| Prose leftovers | List markers, figcaptions, iframes, wide tables on phones, and the few Tailwind utility classes and One Bit Forest token names old posts still carry. |
| Pagefind styles (`search.astro`) | The search UI on the theme's tokens. |

## Motion and script

Little moves, and nothing under `prefers-reduced-motion`: page and post titles
form out of smoke on load (`.ix-emerge`), the wisp on a post sways
(`.ix-art--drift`), and the home page's carousel scrolls smoothly. The carousel
("Recent", `RecentPosts.astro`) shows the five newest posts, one a view: the
post's card image on a plate, its date, title and snippet. It is a native
scroller that snaps; `src/scripts/carousel.js` adds the Previous and Next
buttons' behaviour, one marker per slide, and the announcement. Navigation is
finite: at an end the button that leads nowhere is disabled.

Two bundled modules: `src/scripts/site.js` (with the family's `scheme.js`) runs
the scheme switch and the single-key shortcuts (`a` archive, `/` search, `r`
rss in the bar; `l` all posts and `t` tags on the home page; `i` on the 404),
and `carousel.js` on the home page. Everything else is
`is:inline`: the scheme boot snippet, the tag filter, the Pagefind loader.

## Accessibility

- One h1 per page; list labels are h2, row titles h3. Chrome is `lang="en"`;
  a post sets `<html lang>`, and a foreign title in a list carries its `lang`.
- A roman numeral is `aria-hidden`, with "Post 12" beside it for screen readers.
- Focus: the theme's 2px outline, 3px offset. Nav links, chips, rows and the
  links under a list keep a 44px hit area.
- AA contrast in both schemes; `tests/code-contrast.test.mjs` checks every
  syntax colour on both code plates. `prefers-contrast: more` is handled in
  brand.css.
- The emblem and the wisp are decoration (`alt=""`); the wisp is hidden on a
  narrow screen and lazy, so a phone does not load it.

## Don'ts

- Don't edit `src/brand/`. Don't write a hex colour or a px font size in the
  blog's CSS. Nothing below 18px.
- No blackletter for running text, in controls, labels, numerals, dates, code
  or Japanese.
- No artwork besides the emblem and the one wisp; never on bone paper without
  its soot plate; never over text.
- No boxes, no shadows, no gradients, no radius above 2px (the emblem is round).
- Don't rewrite old posts for the system; make the system carry them.
