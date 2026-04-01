---
title: "ReScript vs Gleam: is it worth writing your frontend in a typesafe functional language?"
date: "2026-04-01"
excerpt: "I rewrote my portfolio site in both ReScript and Gleam to find out which one actually delivers on the promise of less code, more safety, and better developer experience."
tags: ["dev", "rescript", "gleam", "react", "frontend"]
keywords: "rescript, gleam, lustre, react, typesafe frontend, functional programming, typescript alternative, gleam javascript, rescript react"
description: "A side-by-side comparison of rewriting a React TypeScript portfolio site in both ReScript and Gleam, with real line counts, code samples, and a clear verdict."
author: "Arda Karaduman"
image: "/images/2026-04-01-rescript-vs-gleam-og.png"
draft: false
---

I have been curious about typesafe functional languages on the frontend for a while. TypeScript is fine. It gets the job done. But "fine" is not the same as "good," and after years of writing `interface Props`, `React.FC<Props>`, `?.` chains, and watching ESLint fight with Prettier over semicolons, I wanted to see what the other side looks like.

So I took [arda.tr](https://arda.tr) — my personal portfolio site — and rewrote it twice. Once in [ReScript](https://rescript-lang.org/), once in [Gleam](https://gleam.run/). Same site, same design, same Tailwind CSS, same functionality. The only variable was the language.

The results were not what I expected.

## The starting point

The original site is a single-page React app built with Vite, TypeScript, and Tailwind. Five sections: hero, about, portfolio, music, footer. Seven theme variants via CSS variables. Nothing exotic.

The TypeScript version weighs in at **18 source files** and **907 lines** of code (excluding CSS). It uses nine npm production dependencies: React, Radix UI, lucide-react, next-themes, and the usual Tailwind utility stack.

That is the baseline.

## The ReScript rewrite

ReScript compiles to JavaScript and has first-class React bindings. The JSX looks almost identical to what you would write in TypeScript. The big difference is what happens around the JSX.

Here is a Hero component in TypeScript:

```tsx
const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col bg-background">
      {/* ... */}
      <Button variant="default" size="lg" className="gap-2 px-6" asChild>
        <a href="https://resume.arda.tr">
          <User className="w-4 h-4" />
          Resume
        </a>
      </Button>
    </section>
  );
};
```

And in ReScript:

```rescript
@react.component
let make = () => {
  <section className="min-h-screen flex flex-col bg-background">
    {/* ... */}
    <Button variant="default" size="lg" className="gap-2 px-6" asChild=true>
      <a href="https://resume.arda.tr">
        {Icons.user(~className="w-4 h-4", ())}
        <span> {"Resume"->React.string} </span>
      </a>
    </Button>
  </section>
}
```

Close enough to feel familiar. Different enough to notice. The `->React.string` pipe for text content is a minor annoyance you stop seeing after an hour.

### What actually changed

The interesting part was not the syntax. It was the architecture the language nudged me toward.

In the TypeScript version, Portfolio was a 207-line monolith. It defined all the data inline, rendered the cards inline, and repeated section headers three times.

In ReScript, the compiler's module system pushed me to split it naturally:

- `PortfolioContent.res` — 112 lines of typed data
- `ProjectCard.res` — 54 lines, a reusable card component
- `SectionHeader.res` — 14 lines, a shared heading component
- `Portfolio.res` — 50 lines, a clean map over sections

**207 lines became 50.** The data and subcomponents exist in separate files, yes. But the rendering logic itself went from a sprawling mess to a tight loop.

The Footer told a similar story. The TypeScript version had 115 lines including two hand-drawn SVG icon components for Mastodon and Bluesky, plus six nearly identical social link `<a>` tags. In ReScript, social links became data in `FooterContent.res`, icons became bindings, and the render dropped to 56 lines — a map over an array.

### Type safety

ReScript's variant types are the real win. The About section has three highlight cards, each with a different icon:

```rescript
type highlightIcon = Code2 | Globe | Lightbulb

let renderHighlightIcon = icon =>
  switch icon {
  | Code2 => Icons.code2(~className="w-5 h-5 text-primary", ())
  | Globe => Icons.globe(~className="w-5 h-5 text-primary", ())
  | Lightbulb => Icons.lightbulb(~className="w-5 h-5 text-primary", ())
  }
```

Add a fourth variant? The compiler tells you every place that needs updating. No runtime surprises. No `default` case hiding bugs.

### The interop tax

ReScript does not replace everything. The theme dropdown still uses Radix UI and next-themes, so `ThemeToggle.tsx` stayed as TypeScript (69 lines). The shadcn/ui button, card, and dropdown components stayed as TypeScript too. ReScript consumed them through thin binding files — about 7 lines each.

Icons needed bindings as well. `Icons.res` is 139 lines of `@module("lucide-react")` wrappers. It is repetitive but not painful, and you write it once.

### ReScript numbers

- **37 source files** (more files, but each one is focused)
- **1,212 lines** excluding CSS (vs 907 in TypeScript)
- **11 npm production deps** (added `@rescript/core` and `@rescript/react`)
- **3 test files** (added tests during the rewrite)

Wait — more lines? Yes. But that is misleading. The TypeScript version had zero tests and zero data separation. The ReScript version added tests, extracted content into typed modules, and created reusable components. If you compare only the rendering logic, ReScript is roughly 30% shorter.

## The Gleam rewrite

This is where things got interesting.

Gleam compiles to both Erlang and JavaScript. For this rewrite I targeted JavaScript and used [Lustre](https://lustre.dev/), Gleam's own frontend framework. Lustre follows the Elm architecture: Model, Msg, Update, View. No React, no virtual DOM diffing in the React sense. It is its own thing.

The immediate difference is that Gleam's HTML is not JSX. It is function calls:

```gleam
html.div(
  [attr.class("text-sm text-muted-foreground")],
  [html.text("some text")],
)
```

Compared to ReScript:

```rescript
<p className="text-sm text-muted-foreground">
  {"some text"->React.string}
</p>
```

Or TypeScript:

```tsx
<p className="text-sm text-muted-foreground">
  some text
</p>
```

That difference compounds. Fast.

### Where Gleam shines

The type system is the strictest of the three. Every domain type is explicit in `content/types.gleam`:

```gleam
pub type PortfolioItem {
  PortfolioItem(
    title: String,
    description: String,
    image: String,
    link: String,
    tags: List(String),
    playable: Bool,
    contain_image: Bool,
  )
}
```

No `any`. No escape hatches. No `as unknown as Whatever`. If it compiles, it is correct.

The Elm architecture also forces clean state management. The theme selector in Gleam is a textbook example:

```gleam
pub fn update(model: Model, message: Msg) -> #(Model, effect.Effect(Msg)) {
  case message {
    ToggleThemeMenu -> #(
      Model(..model, is_theme_menu_open: toggle(model.is_theme_menu_open)),
      effect.none(),
    )
    SelectTheme(theme_id) -> select_theme(model, theme_id)
  }
}
```

Every state transition is visible, explicit, and exhaustive. No `useState` hooks scattered across the component tree. No stale closures. No rules-of-hooks footgun.

And the dependency story is impressive: **zero npm production dependencies**. The entire app runs on `gleam_stdlib` and `lustre`. No React, no Radix, no class-variance-authority, no next-themes.

### Where Gleam hurts

The HTML DSL is verbose. The Hero section went from 82 lines in TypeScript to 138 lines in Gleam. Every element needs explicit `attr.class(...)`, `attr.attribute(...)`, and child lists. The ceremony adds up.

Icons were the biggest casualty. In TypeScript, you import from lucide-react. In ReScript, you write thin `@module` bindings. In Gleam, you hand-draw every SVG path because lucide-react is a React library and there is no React.

`icons.gleam` is **314 lines** of SVG path data. That is 314 lines that do not exist in either of the other two versions.

The theme selector had to be reimplemented from scratch. In TypeScript, `next-themes` + Radix `DropdownMenu` handle it in 69 lines. In Gleam, I wrote 163 lines of custom state management, dropdown rendering, and localStorage FFI to achieve the same thing.

### Gleam numbers

- **28 source files**
- **1,730 lines** excluding CSS (vs 907 in TypeScript, vs 1,212 in ReScript)
- **0 npm production deps** (2 Gleam deps: gleam_stdlib, lustre)
- **3 test files**

## The comparison

| Metric | TypeScript | ReScript | Gleam |
|--------|-----------|----------|-------|
| Source files | 18 | 37 | 28 |
| Lines (no CSS) | 907 | 1,212 | 1,730 |
| Lines (no CSS, no icons) | 907 | 1,073 | 1,416 |
| npm prod deps | 9 | 11 | 0 |
| Hero component | 82 | 61 | 138 |
| Portfolio render | 207 | 50 | 152 |
| Footer | 115 | 56 | 83 |
| Icons | 0 (import) | 139 (bindings) | 314 (hand-drawn SVG) |
| Theme selector | 69 | 69 (kept TS) | 163 |

## The verdict

ReScript produced the more tangible results for this kind of project.

It reduced rendering code by 30% while adding type safety that TypeScript cannot match. It stayed in the React ecosystem, which meant I could keep using Radix UI, lucide-react, and next-themes without reimplementing them. The architecture improvements — data separation, reusable components, exhaustive pattern matching — emerged naturally from the language rather than being imposed by discipline.

Gleam's strengths are real but misplaced here. Zero npm dependencies is elegant. The Elm architecture is clean. The type system is the strictest of the three. But the HTML DSL inflates every component, the lack of a JSX-like syntax costs real lines, and reimplementing UI primitives that already exist in the React ecosystem is not a productive use of time.

For frontend work, JSX-style syntax is too big an ergonomic advantage to give up. ReScript gives you that. Gleam does not.

## The context angle

There is one more dimension worth mentioning. I use AI coding agents heavily, and context window size is a real constraint.

Fewer lines means more of the codebase fits in context. More fits in context means the agent can reason about the whole project instead of fragments of it.

ReScript saves roughly 30% of context tokens compared to Gleam for equivalent UI work. On a project the size of arda.tr, that is marginal. On something like [skriv.ist](https://skriv.ist) — which has 80+ source files — that difference compounds into something meaningful.

## What I would actually recommend

If you are writing a React frontend and TypeScript feels like it is getting in the way more than helping, ReScript is worth trying. It is not a dramatic departure. It is a better type system bolted onto the same ecosystem you already know.

If you are building a backend service where concurrency, fault tolerance, and zero runtime exceptions matter, Gleam on the BEAM is where it shines. That is a different conversation.

For the frontend, ReScript wins. Not because Gleam is bad, but because the browser is React's territory, and ReScript speaks React natively.

All three branches are public if you want to compare the code yourself: `main`, `rewrite/rescript`, and `rewrite/gleam` on the [arda.tr repo](https://github.com/c0ze/arda.tr).
