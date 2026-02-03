---
title: "Digital Necromancy"
date: "2026-02-03"
excerpt: "Centralizing a fragmented knowledge hoard by subjugating the APIs of Manning, O'Reilly, and Packt through MCP."
tags: ["dev", "go", "ruby", "ai"]
keywords: "Calibre, MCP, Model Context Protocol, Ruby, Go, Manning, O'Reilly, Web Scraping"
description: "A technical autopsy of an operation to centralize scattered ebook libraries into a local Calibre instance using custom MCP tools."
author: "Arda Karaduman"
image: "/images/digital_necromancy.png"
---

I have accumulated enough PDF and EPUB files to train a dozen LLMs or bore a thousand junior developers to death. The problem isn't the content; it's the fragmentation. Apress, Packt, Manning, O'Reilly—they all want me to log into their disparate, crumbling walled gardens to access *my* data.

I do not ask. I take.

![Digital Necromancy](/images/digital_necromancy.png)

This week, I declared war on scattered libraries. The goal: Centralize everything into my local Calibre instance, accessible via a custom Model Context Protocol (MCP) server running from Antigravity.

## The Architecture: `calibre-mcp`

This is not a client-server relationship; it is a surgical intervention. Calibre uses SQLite, and SQLite hates concurrency. You cannot have the application open while the agent operates. 

So, the protocol is simple: **Calibre must sleep so the Agent may feast.**

We established a **Model Context Protocol (MCP) server** to interface directly with the local `metadata.db` on the filesystem. Instead of blindly dumping files into a folder and praying for the best, the agent queries the database file directly. It knows what I have. It knows what I lack. It implements a "skip if exists" logic that saves bandwidth and sanity, all without launching the GUI.

```json
{
  "mcpServers": {
    "calibre": {
      "command": "uvx",
      "args": [
        "calibre-mcp",
        "--db-path",
        "C:\\Users\\akara\\Calibre Library\\metadata.db"
      ]
    }
  }
}
```

## The Campaigns

### 1. Apress (The Warm-up)
Apress was the target dummy. We matched simple text titles to the database to verify the MCP connection. It was boring, compliant, and functioned exactly as a test case should. Coverage verified.

### 2. Packt (The Bloatware)
Packt is the fast food of technical publishing. Their download links are signed and expire, effectively mocking standard scraping attempts.

* **The Problem:** Their library is polluted with thousands of "Video" and "Code" files that I have zero interest in archiving.
* **The Solution:** We deployed a "Kill List" (`filter_packt.py`). We ignored the noise and focused solely on the text.
* **The Breach:** Headless browsers (`playwright`) failed against their Cloudflare gates. The workaround? A direct assault using `curl_cffi` masquerading as a legitimate browser session via hijacked cookies. The inventory is secured.

### 3. Manning (The Victory)
Manning tried to be clever with dynamic AJAX dashboards and S3 redirects.

* **The Hack:** `download_manning.py` parses the AJAX endpoint to find the hidden links. When the server redirects to Amazon S3 (which rejects Manning’s cookies), the script intelligently drops the auth headers and requests the resource naked.
* **The Result:** ~76 books extracted, downloaded, imported, and retroactively tagged via `fix_manning_tags.py`. 100% coverage. Clean.

### 4. O'Reilly (The Behemoth)
No API. Just a massive, scrolling DOM of "Your Products."

* **The Brute Force:** I fed the raw HTML into the machine. `download_oreilly.py` extracted ~1500 download links from the DOM.
* **Status:** Currently processing ~190 files in the background. The script bypasses login checks by injecting a pre-authenticated session from `oreilly_cookies.json`.

## The Loot: Classics Recovered

We filtered thousands of files. Most were discarded—casualties of the framework wars. But amidst the debris, we salvaged the Immutable Core: books that survive because they teach concepts, not syntax.


### The Esoteric & Functional Cult

| Cover | Book |
|---|---|
| <img src="/images/books/joy-of-clojure.jpg" width="100" alt="The Joy of Clojure" /> | **[The Joy of Clojure](https://www.manning.com/books/the-joy-of-clojure-second-edition)** (Manning)<br>Not just a language guide, but a philosophy text that rewrites how you think about data. |
| <img src="/images/books/real-world-ocaml.jpg" width="100" alt="Real World OCaml" /> | **[Real World OCaml](https://dev.realworldocaml.org/)** (O'Reilly)<br>The ultimate status symbol for the functional elitist. Hard, fast, and uncompromising. |
| <img src="/images/books/real-world-haskell.jpg" width="100" alt="Real World Haskell" /> | **[Real World Haskell](https://learning.oreilly.com/library/view/real-world-haskell/9780596155339/)** (O'Reilly)<br>For when you want to feel superior to everyone else in the room. |
| <img src="/images/books/programming-elixir.jpg" width="100" alt="Programming Elixir" /> | **[Programming Elixir](https://pragprog.com/titles/elixir16/programming-elixir-1-6/)** (Pragmatic Bookshelf)<br>Because concurrency shouldn't hurt this much. |

### The Deep Magic (Internals & Theory)

| Cover | Book |
|---|---|
| <img src="/images/books/understanding-computation.jpg" width="100" alt="Understanding Computation" /> | **[Understanding Computation](https://learning.oreilly.com/library/view/understanding-computation/9781449330071/)** (O'Reilly)<br>From simple machines to impossible programs. This is the computer science degree you never finished. |
| <img src="/images/books/low-level-programming.jpg" width="100" alt="Low-Level Programming" /> | **[Low-Level Programming](https://link.springer.com/book/10.1007/978-1-4842-2403-8)** (Apress)<br>C, Assembly, and program execution on Intel 64. For when you need to speak directly to the metal. |
| <img src="/images/books/joys-of-hashing.jpg" width="100" alt="The Joys of Hashing" /> | **[The Joys of Hashing](https://link.springer.com/book/10.1007/979-8-8688-0826-5)** (Apress)<br>A niche masterpiece on hash table programming. Pure algorithmic sadism. |

### The Art of Code

| Cover | Book |
|---|---|
| <img src="/images/books/your-code-as-crime-scene.jpg" width="100" alt="Your Code as a Crime Scene" /> | **[Your Code as a Crime Scene](https://pragprog.com/titles/atcrime/your-code-as-a-crime-scene/)** (Pragmatic Bookshelf)<br>Using forensic psychology and graph theory to analyze technical debt. Essential reading. |
| <img src="/images/books/mazes-for-programmers.jpg" width="100" alt="Mazes for Programmers" /> | **[Mazes for Programmers](https://pragprog.com/titles/jbmaze/mazes-for-programmers/)** (Pragmatic Bookshelf)<br>Coding for the sake of beauty and algorithms. A rare gem that sparks joy. |
| <img src="/images/books/prog-musicians.jpg" width="100" alt="Programming for Musicians and Digital Artists" /> | **[Programming for Musicians and Digital Artists](https://www.manning.com/books/programming-for-musicians-and-digital-artists)** (Manning)<br>The only file in this entire dump that has a soul. |

### The Architects

| Cover | Book |
|---|---|
| <img src="/images/books/patterns-ai.jpg" width="100" alt="Patterns of Application Development Using AI" /> | **[Patterns of Application Development Using AI](https://leanpub.com/patterns-of-application-development-using-ai)** (Manning)<br>The new manifesto. It treats LLMs as architectural components, not magic wands. |
| <img src="/images/books/designing-games.jpg" width="100" alt="Designing Games" /> | **[Designing Games](https://learning.oreilly.com/library/view/designing-games/9781449338015/)** (O'Reilly)<br>By Tynan Sylvester (creator of RimWorld). It discusses the mechanics of emotion, not just Unity scripts. |
| <img src="/images/books/metaprogramming-ruby-2.jpg" width="100" alt="Metaprogramming Ruby 2" /> | **[Metaprogramming Ruby 2](https://pragprog.com/titles/ppmetr2/metaprogramming-ruby-2/)** (Pragmatic Bookshelf)<br>The spellbook for bending the language to your will. |

The library is no longer a scattered mess of vendor-locked web portals. It is a single, searchable monolith. The code serves the user. Not the other way around.

# THE END GAME

Some of you may be wondering, "Arda what are you doing ? these are obsolete junk, why bother ?" Well, I now have full access to my library, empowered by a assistant. I can now do things like:

![calibre-mcp-1](/images/calibre-mcp-1.png)

![calibre-mcp-2](/images/calibre-mcp-2.png)

I can query via my assistant, have summaries, cross check, inference. It's like having a research assistant who has read every book in my library.