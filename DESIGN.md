---
name: blog.arda.tr
description: The ledger of side quests in One Bit Forest — amber phosphor on a warm night, every post image dithered live to one bit.
---

# Design System: blog.arda.tr

The blog's rendition of the family system **One Bit Forest**
(`../DESIGN-SYSTEM.md`, adopted 2026-09-23; the approved reference is section
"02 · blog.arda.tr" of `../design-previews/sketch-1bit.html`). It replaces
"The Weekly Page". Every value below is the one in `src/styles/global.css`.

## Overview

A programmer who plays black metal, loves retro machines, forests and
cyberpunk. The meeting point is **1-bit dithering**: photocopied black-metal
covers, early Macs, one neon phosphor per site. On the tone dial the blog is
**semi**: livelier than the résumé and ai, calmer than arda.tr.

The blog's one signature move: **every post's OG image is shown as a live,
dithered canvas.** It develops out of noise, fog drifts through it, and hovering
its row tints it and replays the develop. A post without an image gets a sigil
seeded by its slug. Nothing pictorial ships pre-dithered.

**Key characteristics**

- Amber phosphor (`--signal`) on a warm night; the only colour.
- A 34px mono status bar, the `C0ZE` masthead (zero in signal), a BBS-style
  file list.
- Radius 0, no shadows, no gradients, 1px rules. Focus: 2px solid signal,
  offset 2px.
- Plex Serif for reading, Plex Sans for titles, Plex Mono for everything that
  is metadata.

## Renditions

Four ids, same as every family site. Class on `<html>`, stored in
localStorage `theme`. The boot script in `BaseLayout.astro` runs before paint:
it migrates older ids by role (`pulp`→`xerox`, `pulp-hc`→`xerox-hc`,
`beta`→`night`, `beta-hc`→`night-hc`, and every Ink & Ledger id: `paper`→
`xerox-hc`, `carbon`→`night-hc`, `alucard`/`light`→`xerox`, the rest→`night`).
With nothing stored it follows `prefers-color-scheme` / `prefers-contrast`, and
uses Night when the system states no preference. `:root` carries the Night
tokens, so no-JS visitors get Night. The switch is a `<details>` menu in the
status bar (`ThemeToggle.astro`).

| token | night | night-hc | xerox | xerox-hc |
|---|---|---|---|---|
| `--bg` | `#0a0908` | `#000000` | `#efede6` | `#ffffff` |
| `--surface` | `#13110d` | `#000000` | `#f7f6f1` | `#ffffff` |
| `--fg` | `#ece4d2` | `#ffffff` | `#111210` | `#000000` |
| `--fg-2` (meta) | `#9d917b` 6.4:1 | `#d0cdc4` 13:1 | `#5d5b55` 5.7:1 | `#2e2e2e` 13.6:1 |
| `--fg-soft` (serif excerpts) | `#b9ae98` | `#e8e4da` | `#34332f` | `#1a1a1a` |
| `--rule` | `#2a241b` | `#8a8a8a` | `#cfccc2` | `#1a1a1a` |
| `--rule-2` (row separators) | `#1c1812` | `#5a5a5a` | `#dfdcd3` | `#8a8a8a` |
| `--signal` | `#ffb224` 11:1 | `#ffc34d` 12.6:1 | `#8a4f00` 5.6:1 | `#6b3c00` 9.3:1 |
| `--on-signal` | = `--bg` | = `--bg` | = `--bg` | = `--bg` |

**Canvas palette** (read by `onebit.js` every frame, always hex): `--ob-ink` =
the signal (amber imagery; risograph brown on xerox), `--ob-ground` = `--bg`,
`--ob-signal` = `--fg` (the hover tint).

`theme-color` metas follow `--bg`. Tailwind's `dark:` variant is
`.night &, .night-hc &`.

## Typography

| role | face | where |
|---|---|---|
| masthead, page heads, year numerals | Big Shoulders Display 800–900, uppercase | `C0ZE`, `LEDGER`, `ARCHIVE`, `2026` |
| titles | IBM Plex Sans 500–600 | post title (clamp 32–54px), list titles 16.5px |
| meta, UI, nav, dates, tags | IBM Plex Mono 400–500, 11–13px | status bar, file list, chips |
| reading | IBM Plex Serif 18px / 1.7, measure 68ch | `.prose`, excerpts |
| Japanese | IBM Plex Sans JP | named in every stack; `ja` posts set prose in it |

Plex covers Latin Extended-A, so the Turkish posts' ğ ş İ stay in-face; the
stacks end in metric-close platform faces. The chrome (status bar, footer,
meta lines) carries `lang="en"` so uppercase never becomes `İ` on a `tr` post.

## Layout and components

- **Status bar** (`Header.astro`): signal block + `blog.arda.tr`, nav
  (index · archive · search · tags · rss), `N entries · since 2010`, JST clock,
  rendition menu. Below 720px the nav drops to its own row; stat and clock hide.
- **Index**: masthead + mono stat lines; `.front` grid (1.1fr / 1fr) with the
  lead post (dithered OG at 2px, `#no date min tags` in signal, title,
  Plex Serif excerpt, solid `read ▸`) and the file list of the next seven
  entries, closed by `[a]rchive [/]search [t]ags [r]ss [l]ist` (live single-key
  shortcuts). Below, three mono decks: **the run** (current year by month, ▮
  bars) with **the silence** (the longest gap, over a strip of 1-bit static);
  **tags** (head of the long tail, counts, `+N used once`); **the archive**
  (every year incl. empty ones, then the total and a ghost button).
- **File row** (`FileRow.astro`): cover 120×63 · (№) · date · title + tags ·
  minutes over ▮ bars (one per minute, capped at 12). The title link stretches
  over the row. At ≤720px the cover sits beside a date/minutes line and the
  title. `/archive` uses the text-only variant (no cover).
- **Post**: 760px column — back link, meta line (№, date, minutes + bars,
  author), title, tag chips, excerpt box; then the dithered hero at up to
  1040px; then `.prose`; then related rows (≤3, with covers) and prev/next.
- **Prose**: `## ` / `### ` markers in mono signal before h2/h3, h2 over a 1px
  rule; inline code in signal on `--surface`; code blocks on `--surface` with a
  2px signal left edge; blockquotes italic with a 1px signal rule; tables with
  mono uppercase heads. Raw-HTML embeds keep their Tailwind sizing
  (`aspect-video`, `my-8`), but radius and shadows are neutralised.
- **Chips**: 1px ruled mono cells; pressed = solid signal with `--on-signal`.
- **Footer**: the family treeline in signal, drifting at 5px/s, then the
  colophon line, the "Human-driven" disclosure, licences and links.

## Motion and script

All motion comes from `src/scripts/onebit.js`, a **verbatim copy** of
`../design-previews/onebit/onebit.js` (change it there first, then copy).
`src/scripts/site.js` is the only bundled script and just wires it up:

- `canvas[data-og]` → `dithered()`, created by an IntersectionObserver
  (240px margin), so `/blog` decodes only the covers that come near the screen.
  `data-seed` (the slug) seeds the sigil when the post has no image.
- `[data-og-host]` → pointer/focus enter: `hot(true)` + `develop()`; leave:
  `hot(false)`.
- `canvas[data-treeline]` → `treeline()`; `canvas[data-static]` → `crackle()`.
- A MutationObserver repaints held frames when the rendition changes.

Every animation pauses off-screen and in hidden tabs, and draws one still frame
under `prefers-reduced-motion`. Without JS, each canvas's `<noscript>` shows the
plain image (the default OG image for imageless posts). List covers are
decorative (`aria-hidden`, their title sits beside them); the post hero is
`role="img"` with an `aria-label`.

## Don'ts

- Don't ship pre-dithered PNGs or new image assets for the effect.
- Don't add a second accent colour, radius, shadows or gradients.
- Don't show engagement numbers; the site collects none.
- Don't fork `onebit.js`; don't drop `data-pagefind-body` from the post
  article or `data-pagefind-ignore` from related/prev-next.
