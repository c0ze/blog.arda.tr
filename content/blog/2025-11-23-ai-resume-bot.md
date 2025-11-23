---
title: "AI resume bot"
date: "2025-11-23"
excerpt: "created an AI resume bot which uses gemini api"
tags: ["dev"]
---

Today I saw [this post](https://medium.com/data-science-collective/turning-your-resume-into-an-interactive-ai-chatbot-using-chainlit-semantic-kernel-f83d762aa303) about a resume bot which seemed interesting, and was something I was thinking to try.

The original post uses azure api and python, but I changed it to Gcloud and gemini. It is currently live [here](https://ai.arda.tr) but it is not complete yet. I was more interested in the architecture & devops part of things so I handled that first. It doesnt know anything about me yet, which I will add later on. It still has a certain *flair* though lol.

![Arda AI](/images/arda-ai.png)

The frontend sits at github pages. The backend is at GCP cloud run. Frontend is deployed automatically with each push, but I deploy the backend manually with a script. I didnt want to automate it because I didnt want to do unnecessary deploys when I just wanted to update the frontend.

The repo is [here](https://github.com/c0ze/ai.arda.tr) for those interested.