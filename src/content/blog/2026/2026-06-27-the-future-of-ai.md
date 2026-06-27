---
title: "The Future of AI"
date: "2026-06-27"
excerpt: "Regulations, Governance, Sovereignty. Where do we go from here?"
tags: ["ai", "llm", "geek", "governance"]
keywords: "AI regulation, AI governance, sovereign AI, frontier models, GPT-5.6, Sol, Anthropic Mythos, Fable 5, open-weight models, local AI, model routing, export control, Mistral, DeepSeek, Sakana Fugu, enterprise AI"
description: "Frontier AI is turning into strategic infrastructure, not SaaS. Why model access is going geopolitical — conditional access, sovereign AI, open-weight resilience — and how to architect around it before the weather turns."
author: "Arda Karaduman"
image: "/images/og/2026-06-27-the-future-of-ai.webp"
---

For about two years, the only question anyone asked about AI was *which model is best.* That question is dying. Not because we ran out of models — because the best ones are quietly becoming things you can't simply sign up for.

The most capable systems have stopped behaving like software products. They're starting to look like infrastructure — closer to semiconductors, cloud regions, cryptography, or defense-adjacent comms than to a SaaS subscription with a monthly invoice.

Look at the last news cycle. OpenAI's new GPT-5.6 family — including the one reportedly called **Sol** — landed as a *limited* preview, access restricted to trusted partners, [reportedly at the request of the U.S. government](https://www.businessinsider.com/openai-gpt-5-6-limited-preview-us-government-ai-security-2026-6). The Guardian [described the same staggered rollout](https://www.theguardian.com/technology/2026/jun/26/openai-ai-model-release-trump-us-sam-altman-gpt-anthropic-mythos), down to a customer-by-customer approval process. Around the same time Anthropic's **Mythos** and **Fable 5** were said to be suspended over cybersecurity concerns, then [let back out on a leash](https://www.axios.com/2026/06/27/commerce-anthropic-mythos-restrictions-lift) once mitigations landed. The details are still half-rumor and will have changed again by the time you read this. Doesn't matter. The signal is already clear: **frontier access is becoming conditional.**

That's a bigger deal than any single launch. The market is sliding from *which model is best* toward a much uglier list of questions. Who controls access? Which government can pull the lever? Where does inference actually run? Who reads the logs? Are prompts retained? Can the thing be pointed at cyber, bio, autonomous coding, agentic ops? Can a foreign company switch me off tomorrow?

That's not "AI regulation." That's regulation, export control, compute policy, national-security review, cloud governance, and procurement all collapsing into one layer. We love to label a thing with one word and then act shocked when the word can't hold it.

## The stack splits in three

Here's where I think this goes. The AI stack pulls apart into three layers.

**Frontier models** stay the top capability tier — what you reach for when maximum reasoning, coding, planning, multimodal really matters. Closed, expensive, watched, politically radioactive.

**Enterprise-governed models** become the default for business. Companies won't necessarily ditch the big providers, but they'll demand the contract: zero data retention, regional storage, audit logs, private networking, no-training clauses, hard boundaries on what tools the model is allowed to touch. Most of that already exists on paper — [OpenAI](https://openai.com/enterprise-privacy/) doesn't train on API data by default and [offers zero retention](https://help.openai.com/en/articles/10306912) on eligible endpoints; [AWS Bedrock](https://aws.amazon.com/bedrock/security-privacy-responsible-ai/) says your prompts never reach the model vendor at all, behind PrivateLink, IAM, and CloudTrail. The clauses exist. The open question is whether you've actually built your stack to lean on them.

**Local and open-weight models** become the resilience layer. They won't always beat the strongest closed model. They don't have to. They run on your own metal, get audited directly, fine-tuned, embedded — and, the important part, *they keep running when somebody an ocean away changes the terms.* I've been [building on exactly this layer](/blog/2026-04-11-enhancing-local-ai-with-quantized-kv-cache-and-mem0) for a while, and not out of nostalgia.

So the future isn't "national models replace OpenAI." It's hybrid: global frontier for peak capability, local or sovereign for the sensitive work, and an orchestration layer routing each task by risk, cost, latency, and jurisdiction.

## Why access went geopolitical

The U.S. already treats advanced chips as strategic. Treating advanced *models* — the weights, certain deployment modes — the same way is the obvious next step. It doesn't take one dramatic law saying *only Americans may use frontier AI.* It takes selective access: by customer, country, use case, trust level, risk category. Quieter, and far more effective.

Let's not oversell it either. What's been reported so far is limited previews, trusted partners, specific deals, maybe access for some allied-country staff. Nobody's built a wall. But the direction isn't subtle: the strongest capabilities are migrating from *generally available* to *governed.*

Cybersecurity is the obvious fault line. A model that accelerates defensive engineering accelerates exploit development, vuln discovery, and phishing automation just as happily. The same weights are valuable to a bank, a software shop, a security researcher, and a state actor. Nobody in government treats that as a neutral productivity tool forever.

So: a risk-tiered model market. Summarization, translation, search, office busywork — broadly available. Autonomous coding, cyber, bio-design, long-horizon agentic execution — locked down. And that's exactly where the class divide creeps in. If only a handful of anointed institutions get the highest cognitive leverage, the productivity gap stops being a gap and becomes a moat.

## "Sovereign AI" is not one thing

Every country feeling this pressure is going to stand up and announce it's building **sovereign AI.** But sovereignty isn't a switch. A country can have domestic data and foreign chips. Local cloud regions and foreign weights. Open-weight models and foreign tooling. Strong regulation and no compute. Money and silicon but no decent local-language data.

Useful sovereignty has at least five parts:

1. **Compute** — GPUs, accelerators, power, data centers, HPC.
2. **Model** — controllable foundation models, weights *and* the post-training pipeline.
3. **Data** — local data rights, language data, government and enterprise access, governance.
4. **Deployment** — the ability to actually run inference locally or in trusted regional infra.
5. **Operational** — monitoring, evals, red-teaming, incident response, logging, procurement rules.

Almost nobody hits all five at frontier scale. Here's the thing — most don't need to. For the bulk of real workloads you only need *enough* sovereignty to avoid catastrophic dependency. The goal isn't autarky. It's not having your entire stack revocable by someone else's cabinet meeting.

## Who's actually trying to fill the gap

**China** is the strongest non-U.S. pole, full stop. [DeepSeek-R1](https://arxiv.org/abs/2501.12948) was the proof shot — an open reasoning model that genuinely dented the closed-model assumption — and it's not alone: Qwen, GLM/Z.ai, Kimi, Baidu, Huawei have all shown open-weight, lower-cost models can compete seriously on coding, reasoning, agentic work. For a lot of developers the pitch is obvious: strong, cheap, inspectable. For Western governments and regulated firms the problem is equally obvious: jurisdiction, vendor trust, supply-chain exposure. Both things are true at once, which is what makes it interesting.

**Europe**'s card is [Mistral](https://mistral.ai/news/mistral-3/) — and the Mistral 3 family shipping under Apache-2.0 is the point as much as the benchmarks: a European stack aligned with European governance and data-protection instincts. The AI Act and the [AI Factories / gigafactory push](https://digital-strategy.ec.europa.eu/en/policies/ai-factories) — datacenters speccing 100,000+ accelerators apiece — show Europe understands AI as infrastructure, not an app. The problem is speed. Regulation doesn't manufacture GPUs, energy, or globally dominant products. You can't legislate your way to compute.

**India** is quietly getting interesting. [Sarvam](https://www.sarvam.ai/blogs/sarvam-30b-105b) — 30B and 105B open models trained from scratch in India on IndiaAI Mission compute — points at a pragmatic play: local languages, local compute, open weights, plugged into public digital infrastructure. India doesn't need to win every English benchmark to build a strategically valuable layer. Scale, multilingual mess, and a government already fluent in digital public infra — that's the edge.

**Japan** — where I live, so I'll be blunt — is a special case. Sakana's **Fugu** is genuinely promising, but don't mistake it for a frontier foundation model. Read [the technical report](https://arxiv.org/abs/2606.21228): Fugu is an *orchestrator*, a family trained to coordinate teams of LLM agents and build agentic scaffolds on the fly. That's useful — maybe very useful in a world where no single provider is a safe permanent dependency. But orchestration isn't sovereignty unless the models, hosting, logs, data, and tool permissions underneath are *also* under trusted control. Otherwise you've just built a very elegant remote control for somebody else's television.

**South Korea** has real industrial candidates — Naver HyperCLOVA X, LG EXAONE, Upstage, SKT — and is well placed for Korean-language, telecom, and industrial AI. **The Gulf** is running the same play with state money: Falcon, G42-linked infra, Arabic-first models, sovereign AI as a national industrial project. **Canada and the UK** matter too, differently — Cohere is one of the cleaner enterprise-controllable options, and the UK has research depth without an obvious globally dominant vendor yet.

## Is open source ready?

For a lot of work: yes. For the absolute frontier: not entirely. Both halves of that sentence matter.

Open-weight models are already good enough for most enterprise reality — RAG over internal docs, code assist, support, structured extraction, translation, classification, routing, plenty of agentic tasks where tool use and evals matter more than chat eloquence. Wire up decent retrieval, some domain fine-tuning, guardrails and evals, and a [local model you run yourself](/blog/2026-01-25-the-awakening-of-gemmy) can beat a stronger remote one that legally isn't allowed to see your data in the first place.

But open-weight does not magically mean safe, cheap, or sovereign. Somebody still has to host it, secure it, patch it, monitor it, evaluate it, stop prompt-injection from turning it into a confused deputy, and lock down what tools it can reach. A badly governed local model isn't superior to a well-governed external one. It just fails closer to home.

The real prize with open weights is **optionality.** It breaks total dependency. It lets a company — or a country — say: if the API terms change, if prices spike, if we get blocked, if the data legally cannot leave the building, we still have a working baseline tomorrow morning.

## The enterprise move: treat your vendor as a replaceable part

For companies the correct response isn't panic. It's architecture.

Assume, starting now, that model providers are **replaceable components, not foundations.** Your prompts, evals, retrieval layer, tool integrations, logs, security policy, product behavior — all of that should live *outside* any one vendor. The model is a part you can swap, not something you marry.

In practice that's routing:

- **Low-risk public tasks** → the best frontier API you can get.
- **Business-confidential** → enterprise APIs with real no-training guarantees, regional controls, audit trails.
- **Regulated or IP-heavy** → private-cloud, VPC, or self-hosted open weights.
- **Critical-infra and government** → sovereign or air-gapped, strict logging, human authorization gates.
- **Anything agentic** → treated as security-sensitive regardless of which model is behind it.

That last one is the part people keep underrating. A model that answers questions is one risk profile. A model that can read your mail, modify code, deploy infra, query prod, send invoices, touch the CRM is a different animal entirely. The agent layer — all those MCP-style integrations wiring a model into GitHub, Gmail, Slack, your database, your deploy pipeline — is where governance actually gets decided. Least privilege, allowlists, replayable logs, approval checkpoints, a rollback that works. The question stops being *which model* and becomes *which tools can this thing operate, under whose authority, with what logs, and how do I undo it.*

## What this means for where I live

Japan should treat Sakana as useful, not sufficient. The orchestration hedge is clever. And the country has far more than talent — [LLM-jp](https://arxiv.org/abs/2407.03963) and Fugaku-linked research, an [AI promotion law](https://www.japaneselawtranslation.go.jp/en/laws/view/5066/en) that already frames AI as national-security infrastructure, NTT, Preferred Networks, NEC, Fujitsu, CyberAgent, Rakuten, university capacity. The missing pieces were never brains. They're scale, productization, sustained compute, evaluation infrastructure, and domestic enterprise actually *adopting the stuff.*

The smart near-term move isn't chasing a single national GPT clone — a vanity project with a flag stapled to it. It's a layered Japanese stack: strong Japanese-language models, enterprise-private deployment, model-routing orchestration, robotics and manufacturing integration, secure government cloud, high-quality Japanese evals. For a country this good at robotics, manufacturing, embedded systems, gaming, and industrial operations, the win is in *applied* AI systems, not a leaderboard sprint. Let someone else win the benchmark. Win the factory floor.

## Where we go from here

The era of casual frontier access is closing. Not slamming shut tomorrow, not every model becoming a state secret — but the most capable systems are entering the zone where national security, enterprise governance, export control, and infrastructure policy all apply at once. That zone has rules. We're about to learn them.

It'll widen inequality if access concentrates among governments, megacorps, and approved partners. It'll also push countries to build local capacity — not because everyone can or should build the world's best model, but because total dependence on another country's model layer is just strategically stupid.

The right posture is neither blind faith in U.S. frontier labs nor the romantic belief that open source fixes everything. It's **redundancy.**

Use frontier models when the capability justifies the risk. Use enterprise controls when the data matters. Use local or open weights when sovereignty, auditability, or continuity matters. And build the routing layer *before* you urgently need it — because the day you need it is the worst possible day to start building it.

The question is no longer *which AI is smartest.* It's: **which AI can I still use — safely, legally, at all — when the geopolitical weather turns?**

That's what serious companies and serious governments should be designing around right now. The rest is just waiting to find out whose hand is on the switch.

*(Full disclosure, since this site has a [standing policy of honesty about the machines](/blog/2026-02-03-effects-of-ai-on-productivity): the first-pass research behind this piece was done by an LLM, then dragged into shape by me. Using a frontier model to write about losing access to frontier models is an irony I'm choosing to enjoy.)*

## Sources

The model-access stories — GPT-5.6/Sol, Mythos/Fable — are live press reporting and time-sensitive; treat them as a snapshot, not settled fact. The structural claims (enterprise privacy controls, the EU and Japan policy pushes, the open-model releases) are the durable part and don't hinge on one news cycle.

- [Business Insider — OpenAI says access to GPT-5.6 is limited at the U.S. government's request](https://www.businessinsider.com/openai-gpt-5-6-limited-preview-us-government-ai-security-2026-6)
- [The Guardian — OpenAI staggers AI model release after Trump administration request](https://www.theguardian.com/technology/2026/jun/26/openai-ai-model-release-trump-us-sam-altman-gpt-anthropic-mythos)
- [Axios — Commerce greenlights limited return of Anthropic's Mythos](https://www.axios.com/2026/06/27/commerce-anthropic-mythos-restrictions-lift)
- [Sakana — Fugu technical report (arXiv)](https://arxiv.org/abs/2606.21228)
- [DeepSeek-R1 — technical report (arXiv)](https://arxiv.org/abs/2501.12948)
- [Mistral AI — Introducing Mistral 3](https://mistral.ai/news/mistral-3/)
- [Sarvam AI — open-sourcing Sarvam 30B and 105B](https://www.sarvam.ai/blogs/sarvam-30b-105b)
- [European Commission — AI Factories](https://digital-strategy.ec.europa.eu/en/policies/ai-factories)
- [Japan — Act on Promotion of R&D and Utilization of AI-related Technology](https://www.japaneselawtranslation.go.jp/en/laws/view/5066/en)
- [LLM-jp — a cross-organizational project for fully open Japanese LLMs (arXiv)](https://arxiv.org/abs/2407.03963)
- [OpenAI — Enterprise privacy](https://openai.com/enterprise-privacy/)
- [OpenAI — API data sharing & zero retention](https://help.openai.com/en/articles/10306912)
- [AWS — Bedrock security, privacy & responsible AI](https://aws.amazon.com/bedrock/security-privacy-responsible-ai/)
