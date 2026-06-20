---
title: "Introducing Arda"
date: "2026-06-20"
excerpt: "Sad songs for immortals — elven laments in Sindarin and Tengwar"
tags: ["music"]
keywords: "Arda, elvish music, Sindarin, Tengwar, Tolkien, Suno AI, Gemini, Imagen, lyric video, lind.arda.tr, dark folk, lament"
description: "Introducing Arda: original elven laments in J.R.R. Tolkien's Sindarin, written in Tengwar, made with Suno and Gemini and tied together into a website and lyric videos."
author: "Arda Karaduman"
image: "/images/og/2026-06-20-introducing-arda.webp"
---

![Introducing Arda — sad songs for immortals](/images/og/2026-06-20-introducing-arda.webp)

# The Question

Have you ever wondered what elven court music would actually sound like? Not the movie-trailer version — the real thing, the music they'd play in some hall in Lothlórien on a slow grey evening, when nobody's listening. I have. That single question is the whole reason this thing exists. I wanted to get as close to that feeling as I could.

# Why elven music has to be sad

The more I poked at lyrical themes, the more I kept landing on one idea: elven music should be *sad*. Not dramatic-sad. Tired-sad.

Think about it. They don't die. They just... endure. They watch the seasons turn, watch friends and lovers and whole kingdoms rise and crumble to dust, and they stay. Time passes *around* them. After a few thousand years of that, what's left isn't grief exactly — it's a long, worn-down ache. The "long defeat," as Tolkien called it. That was the spirit I tried to bottle: the melancholy of someone who has seen too much and isn't even granted the mercy of forgetting.

So that's the register. Autumn. Departure. Watching the light go.

# Making the music

The songs are **Suno**. Same general workflow as [The Seventh Shadow](/blog/2025-12-10-introducing-the-seventh-shadow) and the [Suno stuff](/blog/2025-11-14-suno-stuff) I've written about before — I describe the sound I'm after, Suno gives it a shape. For Arda I steered it toward ethereal dark / chamber folk: Celtic harp, cello, woodwinds, a deep female voice, slow and structured. (I briefly went full tribal Nordic drone, with tagelharpa and throat singing, before remembering that throat singing is a *dwarf* thing. Elves are creatures of air and starlight. Wrong species.)

For the words, I drove the themes and handed the heavy lifting to **Gemini**. I picked the language too: **Sindarin**, the Grey-elven tongue, over the high Quenya — it's dimmer, more faded, and it suits a lament far better. Three songs came out of it:

- *Gwannad i-Lû* — "The Fading of Time"
- *I Dhae Odog* — "The Seventh Shadow" (yes, I snuck my own band's name into an elven song; sue me)
- *I Dann Haer* — "The Long Defeat"

Mastered on **LANDR**, like the rest of my stuff.

# The script

Here's where I went down a rabbit hole. If you're writing in Sindarin, you might as well write it in **Tengwar** — the actual elvish script. You can't just install a font and type, though; Tengwar floats its vowels above the consonants and needs real transcription. So the lyrics get run through **Glǽmscribe** (Sindarin general-use mode) and set in **Tengwar Annatar**, then checked against Tecendil, because of course I checked.

# Tying it together

This is where **Claude** earned its keep. I had songs, lyrics, a script, and a pile of ideas, and Claude tied the lot into a website: **[lind.arda.tr](https://lind.arda.tr)**. (*lind* is Sindarin for "song" — "song of Arda." I'm not subtle.) The lyrics are synced to the audio and ignite line by line as the song plays, Tengwar with the English underneath, and it streams lossless FLAC — if you're going to be precious about it, be precious about it.

Then we made **lyric videos**. Claude wrote a [Remotion](https://www.remotion.dev) pipeline that generates a painterly, Alan-Lee-ish scene for every section of every song with **Gemini's Imagen**, drifts across them, and inks the Tengwar in left to right over the top. They're up as a playlist: **[Arda — Laments of the Eldar](https://www.youtube.com/playlist?list=PLE09tzM-vRbMFoUVFAhZosLzqcKanwMv5)**.

(I dumped the whole process into [Reliquary](/blog/2026-06-03-introducing-reliquary-one-memory-for-every-ai) too, so future-me doesn't have to reverse-engineer his own project.)

# About the name

Yes, I named it **Arda**. As in Tolkien's word for the world. As in... also my name.

Look, it was right there. Arda is a perfectly valid Tolkien theme, the whole project literally *is* about Arda, and if the Estate ever decides to come after me — well. It's my name. They can sue me for plenty of things, but they cannot copyright *Arda Karaduman*. Checkmate, lawyers. HA.

# Listen

It's all here: **[lind.arda.tr](https://lind.arda.tr)**, with the [videos on YouTube](https://www.youtube.com/playlist?list=PLE09tzM-vRbMFoUVFAhZosLzqcKanwMv5). No release, no distro, no Spotify this time — this one's just for the feeling.

__Suilad na-galad Anor__ — *farewell to the light of the Sun.*
