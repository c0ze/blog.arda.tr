---
title: "Enhancing local AI with quantized KV cache and mem0"
date: "2026-04-11"
excerpt: "How I squeezed 131K of context out of a Mac mini, evaluated MemPalace, and ended up building my own chat-history consolidation hub on mem0."
tags: ["ai", "dev", "homelab"]
keywords: "local ai, llama.cpp, kv cache quantization, mem0, mempalace, lm studio, gemma, qwen, turbo quant"
description: "A walkthrough of my local AI stack — LM Studio + Gemma on a 16GB GPU, asymmetric KV cache quantization on the Mac mini, and why I passed on MemPalace and landed on mem0 as my cross-service memory layer."
author: "Arda Karaduman"
image: "/images/2026-04-11-quantized-kv-cache-mem0-og.png"
draft: false
---

I had two problems nagging at me at the same time.

The first was context. My two local inference boxes are a Ryzen 5700X3D with an RX 9060 XT (16GB of VRAM) and a Mac mini M4 with 32GB of unified memory. Both are in a strange no-man's-land for long-context LLMs. You can fit a mid-size model, or you can fit a generous KV cache, but not both. Every time I tried to push a long conversation through a local model, I'd hit the ceiling and the machine would start trading memory for disk.

The second was scatter. My chat history is spread across Gemini, Claude, ChatGPT, and Open WebUI, and at some point I realised I was asking the same questions to four different assistants because none of them could see what the others had said. I was becoming a human cache coherence protocol.

This post is about how those two problems connected, and the stack I ended up with.

## Starting from Alex Ziskind's video

The thing that kicked this off was [Alex Ziskind's KV cache quantization video](https://www.youtube.com/watch?v=XLlQDfhyBjc). If you haven't seen it: the short version is that the KV cache — the per-token memory that transformers keep around during inference — can be aggressively quantized without meaningfully hurting output quality, and llama.cpp already supports it behind a couple of flags.

This matters a lot on small-memory machines. The KV cache scales linearly with context length, and at 32K+ tokens it can easily be larger than the model weights. Shrink that, and you can either fit a bigger model or run a much longer context on the same hardware.

I went looking for a fork that pushed this further and found [llama-cpp-turboquant](https://github.com/TheTom/llama-cpp-turboquant) on the `experiment/asymmetric-kv` branch. The interesting idea there is asymmetric quantization — K and V don't need to be quantized the same way. Keys are more sensitive, values less so, so you can keep K at `q8_0` and push V down to a more aggressive scheme (`turbo3`) and get most of the savings without the quality hit.

The Mac mini was the right place to try this. The M4's unified memory gives it more usable headroom for a single big model than the RX 9060 XT has for KV cache, and Metal is well-supported in llama.cpp. I built the fork locally, grabbed the `Qwen3.5-35B-A3B-Q4_K_M` GGUF I already had on disk, and ran:

```bash
./build/bin/llama-server \
  -m Qwen_Qwen3.5-35B-A3B-Q4_K_M.gguf \
  --fit on \
  -c 131072 \
  -ngl 999 \
  -fa on \
  -ctk q8_0 \
  -ctv turbo3
```

131072 tokens of context. On a Mac mini. The memory breakdown at the top of the run was roughly:

| Segment | MiB |
|---|---|
| Metal total | 25559 |
| Model weights | 20400 |
| Context (KV cache) | 1022 |
| Compute buffers | 489 |

A KV cache under 1GB at 128K tokens. Before this I was budgeting KV caches in the 8–16GB range for that kind of context. It's hard to overstate how much headroom this unlocks — and on a fanless desktop the size of a hardback book.

A few things I hit while getting there:

- `--fit on` is not optional on the M4 with this model. At 32768 context without it, I reproduced the same Metal OOM / "Compute error" pattern I'd been seeing before.
- LM Studio itself doesn't expose the Turbo Quant KV-cache flags from its CLI, so this has to run as a separate `llama-server` process alongside or instead of LM Studio. I run it via a small zsh wrapper that stops LM Studio first so port `1234` belongs to the TurboQuant server.
- The current command doesn't include `--embeddings`, so `/v1/chat/completions` works but `/v1/embeddings` returns `501`. If you want mem0 to do retrieval *and* chat through the same endpoint, you'll need a second process.

## The current local stack

With the Mac mini validated as the long-context machine, the rest of the stack fell into place:

- **cachyos-x4070 (primary workstation, 16GB VRAM)** — LM Studio serves `gemma-4-E4B-it-GGUF` at Q8_0 on port 1234 with a 65536 context. Gemma 4 E4B is the sweet spot for this card: the 26B A4B MoE needs ~14–15GB for weights alone, which leaves nothing for KV cache. E4B fits in about 4.5GB and leaves 11.5GB for everything else.
- **Open WebUI** on the same Linux box via Docker Compose, `network_mode: host`, `ENABLE_OLLAMA_API=False`. It's the UI layer; LM Studio is the engine.
- **Open Terminal** container on port 8000, sandboxed separately from the chat stack, for when I want the model to actually run commands.
- **SearXNG** running on my Synology as the Open WebUI search backend. No Google, no Bing API keys, no telemetry.
- **Mac mini (M4, 32GB unified memory)** as the long-context / heavy-reasoning endpoint, running Qwen 3.5 35B A3B via the TurboQuant `llama-server` described above. Slower than Gemma, but it's where I send anything that actually needs 32K+ of context or real multi-step reasoning.
- **mem0 chat proxy** on the Linux host at `127.0.0.1:8787`. This is the piece that ties it all together: Open WebUI sends chat requests to this proxy, the proxy retrieves top matching memories from a local Qdrant, injects them as hidden context, and forwards the request to the Mac mini TurboQuant endpoint. One extra hop, a lot more context.

Everything comes up on boot via `~/.config/autostart/lmstudio.desktop` for LM Studio and user systemd units for the bootstrap + mem0 proxy, so I don't have to think about it. If you want the homelab context for where this machine lives, I wrote that up in [setting up a triple-boot Linux machine](/blog/2026-03-14-setting-up-a-triple-boot-linux-machine).

At this point the inference side felt done. The memory side did not.

## The MemPalace detour

![A cinematic portrait of Milla Jovovich as Aya The Keeper in a neon-lit MemPalace](/images/milla-mempalace.webp)

Around the same time I saw [Milla Jovovich pitching MemPalace](https://x.com/bensig/status/2041229266432733356) — yes, that Milla Jovovich, cast as "Aya The Keeper" in the project's promo material. The pitch is genuinely compelling: a local-first memory layer for AI assistants, architected as Wings / Halls / Rooms, with a compression scheme called AAAK that claims ~30x reduction (120 tokens for months of context). Offline by default. MCP integration. Exactly the shape of tool I was looking for.

I dug into the repo and the surrounding docs. The architecture is thoughtful and the CLI has features I wanted — `mempalace mine ~/chats/ --mode convos` for bulk-importing chat exports was almost exactly the workflow I'd sketched out in my own notes.

Then I looked at the dev's background and it was crypto-adjacent all the way down. That's not an automatic disqualifier, but combined with the celebrity promo and the novel-compression-scheme pitch, the vibe tipped from "ambitious open-source project" to "I am not going to bet my memory layer on this in 2026." I closed the tab.

This isn't a takedown — MemPalace might turn out to be great. But for something that's going to hold years of conversation history, I wanted boring and inspectable over novel and promoted.

## Landing on mem0

So I went back to what I'd already been tinkering with: [mem0](https://mem0.ai/). It's a much less exciting pitch — vector store, semantic search, MCP server, that's basically it — but "boring and inspectable" was the whole point.

The setup is unremarkable: a local Qdrant instance under `~/.mem0/qdrant_db`, a small Python chat proxy (`mem0_chat_proxy.py`) that speaks OpenAI and forwards to whichever upstream I configure, and an MCP endpoint exposed from the same process so Claude Code and other MCP clients can search the same store. One default `user_id` (`my_lord`, which is a Gemini-era artifact — long story), no Wings or Halls or AAAK, just embeddings and metadata. Each entry has a `source` field so I can tell where a memory came from: `obsidian` for notes, `gemini_activity` for imported chats, `claude` for Claude-side summaries.

A few practical notes from living with it:

- Embedded local Qdrant allows only one mem0 process at a time, so the chat proxy and the MCP endpoint are intentionally hosted inside the same process. Don't run ingestion concurrently with the proxy against the same store.
- Retrieval is functional but noisy right now. The store has duplicates and a lot of raw long-form notes and chat cards — the biggest quality bottleneck is retrieval precision and prompt noise, not the plumbing.
- `ChatGPT` and `Claude` cloud connectors can't reach `127.0.0.1` directly. If you want them to hit this MCP endpoint, you need to publish it behind HTTPS with authentication first.

It's not as clever as MemPalace wants to be. But it is the thing I actually use every day, and I can `jq` the underlying store when something goes wrong.

## The part that turned out to actually matter

Here's the bit I didn't plan for. Once mem0 was running, I realised the most useful thing it was doing had nothing to do with local inference and everything to do with consolidation.

I exported my Gemini chat history via [Google Takeout](https://takeout.google.com) — the path is `Deselect all → My Activity → Gemini Apps → MyActivity.html` — ran it through a small importer, and suddenly every conversation I'd had with Gemini over the last year was searchable from Claude Code. One prompt-response pair per entry, timestamps preserved, word counts in metadata.

That changes what "having a conversation with Claude" means for me. I can ask Claude a question, and Claude can search across things I already worked out with Gemini months ago, and just… bring them in. The cache-coherence problem I opened this post with went away — not because I moved everything to one assistant, but because I moved all the *history* into one place and let whatever assistant I'm talking to query it.

This is also where the stack started feeling like a coherent system instead of four disconnected tools. Open WebUI is where I chat casually with Gemma. The Mac mini is where I send long-context prompts to the TurboQuant-backed Qwen. Claude Code is where I do real work. And mem0 sits underneath all of them as the shared memory layer — imperfect, slightly lossy, absolutely not a 30x compression miracle, but present in every context.

If you want the other half of why a shared memory layer matters to me, I wrote about it from the model's side in [The Context Dilemma](/blog/2026-01-28-the-context-dilemma). And for the "how AI actually integrates into my daily workflow" angle, [Migrating an AI chatbot to the Gleam stack](/blog/2026-04-06-migrating-an-ai-chatbot-to-gleam-stack) covers the adjacent ground.

## What I'd do differently

A few things I'd flag if you're thinking of building something similar:

1. **Try the KV cache quantization first.** Before you shop for a bigger GPU, try `-ctk q8_0 -ctv q4_0` (or the asymmetric turbo3 variant if you're comfortable building from a fork). The gains are large and the quality hit is small. Ziskind's video is the clearest explanation I've seen.
2. **Pick the right machine for the long context.** On Apple Silicon, unified memory plus Metal plus Turbo Quant gets you further than raw VRAM on a mid-range consumer GPU. I tried to fight my 16GB Linux card for months before I moved the long-context workload to the M4 and stopped fighting.
3. **Don't conflate the inference layer and the memory layer.** I wasted some time thinking MemPalace-style projects were "the missing piece of the local AI stack" when actually they're a separate, optional layer that sits alongside whatever inference backend you use. mem0 + LM Studio + a llama.cpp fork is not a weird combination — they're orthogonal.
4. **Export your chat history now, not later.** Google Takeout is slow and the Gemini Apps format is not especially friendly, but it's the only copy you have. If you're using any cloud assistant at all, pull the export and stash it somewhere, even if you don't have an import path yet.
5. **Pick a memory backend you can debug.** I like mem0 because when something goes wrong I can open Qdrant directly and poke at it. I'd be nervous about a system where "the AAAK compression ate your memory" is an answer I can't verify.

The setup isn't perfect. Embeddings still need a separate endpoint because the TurboQuant server doesn't expose `/v1/embeddings` yet. Reranking on large result sets is rough. The Gemini import doesn't preserve conversation threading properly, so related turns get split into separate entries. I don't have a good story yet for deduplicating memories across sources. But it's *mine*, I understand every piece of it, and — for the first time since I started using multiple AI assistants in parallel — they're starting to feel like one system instead of four.

That's the real win. The 131K context on a Mac mini was just the excuse.
