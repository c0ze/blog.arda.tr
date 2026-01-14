---
title: "Introducing Roast"
date: "2025-12-03"
excerpt: "Introducing a simple command line tool to roast your diffs by a cynical senior dev"
tags: ["dev"]
keywords: "git roast, AI code review, Gemini API CLI, LM Studio, code roast tool, Go CLI, developer tools, code review bot"
description: "Introducing Roast: a Go CLI tool that uses AI to roast your git diffs like a cynical senior developer using Gemini or local LLMs."
---

I've been working on a new project called [Roast](https://github.com/c0ze/git-roast) 

It's a simple command line tool to roast your diffs by a cynical senior dev.
You can use it both tied to Gemini API or a local running LM studio model. Might introduce Ollama support later on.

## Gemini

![Gemini Roast](/images/roast-gemini.png)

## Local LM Studio - DeepSeek

![Local Roast](/images/roast-local.png)

Gemini access is quite usable. Local LM Studio is a bit slower. It depends on your hardware of course. On my 4070, it is barely acceptable, taking about 2-3 minutes to complete the roast. But of course it also depends on the size of your diff.

I did this mostly to check available APis. I'm going to check it on a Mac too, to see if it performs better (but I highly doubt it)