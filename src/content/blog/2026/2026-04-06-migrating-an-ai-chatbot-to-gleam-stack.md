---
title: "Migrating an AI Chatbot from Go to Full-Stack Gleam"
date: "2026-04-06"
excerpt: "I rewrote ai.arda.tr from a Go backend + vanilla JS frontend to Gleam on both sides — shared types, SSE streaming, and one language from BEAM to browser."
tags: ["dev", "gleam", "ai"]
keywords: "gleam, lustre, beam, erlang, full-stack gleam, sse streaming, shared types, gemini api, ai chatbot, go migration"
description: "A walkthrough of migrating ai.arda.tr from Go + vanilla JS to full-stack Gleam, covering shared types between backend and frontend, SSE streaming with Erlang FFI, and the trade-offs of writing everything in one language."
author: "Arda Karaduman"
image: "/images/2026-04-06-migrating-an-ai-chatbot-to-gleam-stack-og.png"
draft: false
---

Five days ago I published a [comparison of ReScript and Gleam for frontend work](/blog/2026-04-01-rescript-vs-gleam-is-it-worth-to-write-your-frontend-in-a-typesafe-functional-language), where my verdict was that Gleam's strengths are misplaced on the frontend. The HTML DSL is verbose, the ecosystem is young, and reimplementing UI primitives that already exist in React-land is not a good use of time.

That verdict still stands for general frontend work. But it assumed the frontend exists in isolation. What happens when you own the backend too, and both sides speak the same language?

I decided to find out by rewriting [ai.arda.tr](https://ai.arda.tr) — my AI resume chatbot — from Go + vanilla JavaScript to Gleam on both ends. The backend runs on the BEAM. The frontend compiles to JavaScript via [Lustre](https://lustre.build/). The interesting part is what happens in between.

## The starting point

The original [ai.arda.tr](/blog/2025-11-23-ai-resume-bot) was a Go backend deployed on Cloud Run with a vanilla JS frontend on GitHub Pages. It worked fine. The Go code was clean, well-structured, and did exactly what it needed to do: accept a chat message, forward it to Gemini, return the response.

But "works fine" was not the point. I wanted to see what a single-language stack could do when you push it across the entire boundary.

## The backend port

The Go backend had a standard internal package layout: `models`, `gemini`, `api`, `resume`, `email`. The Gleam version mirrors this almost exactly:

```
src/ai_resume_bot/
├── models.gleam      # types + JSON decoders
├── gemini.gleam      # REST client for Gemini API
├── server.gleam      # Wisp handler: CORS, routing, /api/chat
├── resume.gleam      # fetch + load resume data from disk
├── prompt.gleam      # system prompt builder
├── email.gleam       # [[SEND_EMAIL]] tag extraction
├── smtp.gleam        # SMTP delivery
└── dotenv.gleam      # minimal .env loader
```

The port was straightforward. Go's `net/http` maps to Wisp + Mist. Go's `encoding/json` maps to `gleam_json`. The `httpc` stdlib handles outbound HTTP. Gleam's exhaustive pattern matching caught a few edge cases I had been papering over with `default` clauses in Go.

Where it got interesting was SMTP. Gleam does not have a native SMTP client, so I dropped to Erlang FFI and used `gen_smtp_client` directly. About 50 lines of Erlang. Not elegant, but it works, and this is the kind of thing the BEAM ecosystem already solved decades ago.

## The frontend port

The frontend went from ~400 lines of vanilla JavaScript to ~625 lines of Gleam/Lustre plus ~160 lines of JS FFI. More lines, yes. The HTML DSL tax I wrote about last week is real. But the architecture is substantially cleaner.

The old JavaScript was a single file doing everything: DOM manipulation, fetch calls, theme toggling, markdown rendering, localStorage. The Lustre version is an Elm-architecture app with typed state, explicit messages, and effects that are values you can inspect rather than side effects you hope work.

Markdown rendering, localStorage, and scroll-to-bottom still live in JavaScript FFI. The browser does not care what language compiled your `document.querySelector` call.

## Shared types: the actual payoff

This is where the single-language stack earns its keep.

The chat API has a request shape and a response shape. In the Go + JS world, these were defined twice: once as Go structs with `json:"..."` tags, once as implicit shapes in the JavaScript `fetch` call. If one side changed and the other did not, you found out at runtime.

In the Gleam version, there is a `shared` package:

```gleam
pub type ChatMessage {
  ChatMessage(role: String, content: String)
}

pub type ChatRequest {
  ChatRequest(message: String, history: List(ChatMessage))
}

pub type ChatResponse {
  ChatResponse(reply: String, error: String)
}
```

Both the backend (`target = "erlang"`) and the frontend (`target = "javascript"`) depend on this package. The JSON encoders and decoders live here too. If I add a field to `ChatRequest`, the compiler tells me every place on both sides that needs updating. Not at runtime. Not in a test. At compile time.

This is not a new idea. Shared types across client and server exist in TypeScript monorepos, in Haskell with GHCJS, in Kotlin Multiplatform. But Gleam makes it remarkably low-friction. The `shared` package is eleven lines of TOML and one source file. No build plugin. No code generation. It just works because the same compiler targets both runtimes.

## SSE streaming

The original Go version was request-response: send a message, wait for the full reply, render it. This was the biggest UX weakness. Gemini takes a few seconds to generate a full response, and staring at a spinner for that long feels broken in 2026.

The Gleam version streams. `POST /api/chat/stream` returns Server-Sent Events:

```
event: message
data: {"type":"thinking"}

event: message
data: {"type":"chunk","text":"Hello! I am Arda's AI "}

event: message
data: {"type":"chunk","text":"Assistant. I am here to help"}

event: message
data: {"type":"done","text":"Hello! I am Arda's AI Assistant..."}
```

The frontend shows a "Thinking..." animation while waiting for the first token, then renders text progressively as chunks arrive. The `done` event carries the full accumulated reply so the server can handle email tag extraction on the complete text.

The stream event types also live in the `shared` package:

```gleam
pub type StreamEvent {
  StreamThinking
  StreamChunk(text: String)
  StreamDone(text: String)
  StreamError(message: String)
}
```

Same deal as the chat types: one definition, two targets, compiler-enforced contract.

### The SSE plumbing

This part required working at three different levels of abstraction simultaneously.

**Erlang FFI** for the HTTP client. Gleam's `httpc` library does not expose streaming. So I wrote ~80 lines of Erlang that uses `httpc:request/4` with `{sync, false}, {stream, self}` to receive the response body incrementally. It forwards chunks to a Gleam Subject, which is how Gleam/OTP processes communicate.

**Mist SSE** for the server endpoint. Wisp (Gleam's web framework) cannot do streaming responses, so this endpoint is handled at the raw Mist level. Mist has first-class SSE support via `mist.server_sent_events()`, which gives you an actor-based init/loop pattern. The actor receives chunks from the Erlang FFI process, parses Gemini's SSE data lines, extracts text deltas, and pushes them to the client as typed events.

**Fetch ReadableStream** on the frontend. The browser reads the SSE stream via the Fetch API's `ReadableStream`, parses `data:` lines, and dispatches them as Lustre messages. About 50 lines of JavaScript FFI.

Three languages. Three runtimes. One type system holding the contract together.

## The numbers

| | Go + vanilla JS | Gleam full-stack |
|---|---|---|
| Backend lines | ~1,200 | ~1,900 |
| Frontend lines | ~400 | ~780 |
| Shared types | 0 | ~140 |
| Languages | 2 (Go, JS) | 3 (Gleam, Erlang FFI, JS FFI) |
| Runtime type safety across boundary | none | compile-time |
| Streaming | no | yes (SSE) |
| npm deps (frontend) | 2 (marked, DOMPurify) | 2 (same, via CDN) |

More lines overall. That is the tax. But the Go version had no streaming, no shared types, and no compile-time guarantees across the API boundary.

## What I would and would not do again

**Would do again:** shared types. This is the killer feature of a single-language stack. The moment you have a non-trivial API surface between frontend and backend, having the compiler enforce the contract on both sides removes an entire class of bugs. It also removes an entire class of "wait, did we update the frontend after that API change?" conversations.

**Would do again:** SSE streaming. The UX difference between waiting 3 seconds for a full response and seeing tokens appear progressively is enormous. This is table stakes for any LLM-backed interface now.

**Would think twice about:** Erlang FFI for HTTP streaming. It works, but you are writing raw Erlang, pattern-matching on `httpc` mailbox messages, and reasoning about Gleam's internal type representations (`{subject, Pid, Tag}`). If `gleam_httpc` adds streaming support, this goes away. Until then, it is a maintenance surface that requires knowing two languages.

**Would not recommend for:** a team that does not already know or want to learn Gleam. The ecosystem is young. The error messages are good but the Stack Overflow answers do not exist yet. You will read library source code. A lot.

## The real question

Is Gleam ready for production full-stack work? For a personal project with one developer who enjoys the language, yes. The compiler is solid, the BEAM runtime is battle-tested, and the JavaScript output is clean.

For a team project, I would still split the stack. Gleam on the BEAM for the backend, TypeScript or ReScript for the frontend. The shared-types payoff is real, but Lustre's HTML DSL and the thin JS ecosystem mean your frontend developers will spend time fighting ergonomics instead of shipping features.

The sweet spot right now is exactly what I built: a backend-heavy application where the frontend is thin enough that the DSL verbosity does not compound, and the shared types justify the single-language constraint.

The site is live at [ai.arda.tr](https://ai.arda.tr). The code is on [GitHub](https://github.com/c0ze/ai.arda.tr).
