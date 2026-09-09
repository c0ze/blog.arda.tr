---
title: "Status Update: tincan v2, Reliquary grows teeth, and my first game ships tomorrow"
date: "2026-09-09"
excerpt: "tincan hit v2.0.0 with hosted listeners and an MCP server, Reliquary spent the summer growing a compilation layer and actual security, and Commit!!! — my first game — releases on Steam tomorrow."
tags: ["dev", "ai", "agents", "godot", "gamedev", "status"]
keywords: "tincan v2, reliquary memory server, commit!!! game, godot career sim, ai agent orchestration, mcp server"
description: "A status update on tincan v2.0.0 (hosted listeners, MCP orchestration), Reliquary's compilation layer and security hardening, and the release of my first game, Commit!!!."
author: "Arda Karaduman"
image: "/images/status-update-2026-09-og.jpg"
draft: false
---

I have not written a status update in a while, which is a shame, because the
last few weeks have been unusually productive. Three things worth writing down
before they blur into the general soup of shipped and half-shipped projects.

## tincan v2.0.0: the agents no longer need you to open terminals for them

When I [introduced tincan](/blog/2026-07-03-introducing-tincan-two-cans-and-a-string-for-ai-agents),
it was a simple promise: let two AI coding agents talk to each other over a
filesystem spool, scoped to a repo, no server, near-zero tokens while idle.

That part worked. The annoying part was me. Every orchestration session started
with the same ritual: open a second terminal, start a listener, keep it alive,
do not accidentally close the wrong tab. I had built a message system for
agents that still required a human terminal butler.

v2.0.0 fixes that. The headline feature is **hosted listeners**: `tincan up
codex` starts a detached listener process that tincan manages itself, and
`tincan down codex` stops it. The orchestrating agent can now bring workers up,
hand them work, collect replies, and shut them down — no human, no extra
terminal, no tab roulette.

The other big piece is a proper **MCP server** mode. `tincan mcp --room
/absolute/repo` exposes structured orchestration tools (`tincan_launch`,
`tincan_send`, `tincan_wait`, and friends) to any MCP client over stdio, with
durable request handles that survive client reconnects. Agents like Claude,
Grok, Agy, and Kimi get persistent conversations by default, so a worker
remembers what it was doing across calls.

There are prebuilt binaries for Linux, macOS, and Windows now, which forced me
to learn things about `MoveFileEx` sharing violations that I did not want to
know. Windows CI caught two genuinely nasty races — snapshot replacement while
readers held old handles, and a legacy PID check reporting dead processes as
alive. Both fixed, both the kind of bug that only exists because you dared to
support more than one platform.

The brand, by the way, was designed by the agents themselves, in a head-to-head
contest over tincan. Codex won. I merely ratified the result, like any good
manager.

## Reliquary: from memory store to memory system

[Reliquary](/blog/2026-06-03-introducing-reliquary-one-memory-for-every-ai) —
my Qdrant-backed memory MCP server — spent the summer becoming less of a
key-value store with delusions of grandeur and more of an actual system.

The biggest change is the **compilation layer**. Raw memories accumulate; that
is what they do. The problem is that a corpus of ten thousand raw records is
not knowledge, it is a pile. Reliquary now maintains a versioned set of
agent-authored synthesis pages above the raw corpus: search leads with the
current synthesis and surfaces raw memories as evidence. New writes flag
dependent pages as stale — a queued suggestion, never an auto-rewrite, because
the day I let software silently rewrite my notes is the day I retire to
farming.

Around that came the usual reality of running something publicly reachable:

- **OAuth refresh tokens**, rotating and revocable, so the Claude connector
  renews silently instead of signing itself out on every restart.
- **Native BM25 hybrid search** as an opt-in, while keeping the
  exact-identifier lexical fallback — because a memory system that cannot find
  the exact string you wrote is a very fancy way to lose things.
- **Retrieval stats feeding a lint CLI**, which proposes archive and compile
  candidates from actual usage evidence. Proposes. Never applies.
- A full **security audit pass**: PKCE downgrade rejected, `/v1/*` routes
  behind the bearer, blob ref-count and crash-consistency fixes, and one
  embarrassing empty-token bug where an unset master token made `"" == ""` a
  valid login. That one is fixed, and I will not be taking questions.

There was also the great mem0 → Reliquary rename in v0.3.0, finished properly
this week. The upstream library keeps its name; my surface finally has mine.
466 tests pass, which is either reassuring or a sign that I enjoy writing
tests too much.

## Commit!!! releases tomorrow

The one I am actually nervous about.

Tomorrow, **September 10**, my first game — [Commit!!!](https://commit.gand.tr)
— releases on Steam. It is a software-career sim built in Godot: take the job,
ship the commit, dodge the debt, try to make rent before the anxiety makes
you. The legacy monolith is the final boss, which is not so much a game design
decision as a documentary.

It runs on Windows, Linux, and Android, in twelve languages, and its phosphor
green CRT palette already escaped into the real world once — the [Omarchy
theme](/blog/2026-08-23-ten-omarchy-themes) I made from its `palette.gd` is,
as far as I know, the only desktop theme in existence whose colors were
machine-read from a game that had not shipped yet.

I have spent twenty-five years shipping software for other people. Tomorrow I
ship a game about how that feels. There is probably a lesson in there, but I
am too busy watching the wishlist counter to find it.
