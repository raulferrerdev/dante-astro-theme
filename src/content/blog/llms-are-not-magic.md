---
title: "LLMs Are Not Magic: A Developer's Reality Check"
excerpt: The hype around large language models is real, loud, and often counterproductive. Here's what two decades of building software teaches you about separating what AI can actually do from what the demos suggest.
publishDate: 'May 12 2024'
tags:
  - AI
  - LLM
  - Enterprise
  - Engineering
seo:
  image:
    src: '/post-5.jpg'
    alt: LLMs and developer reality check
---

![LLMs and developer reality check](/llms-are-not-magic.jpg)

Every major technology wave has a hype phase. I've lived through several of them. Blockchain was going to decentralize everything. The metaverse was going to replace the physical world. NoSQL was going to make relational databases obsolete. Each time, the technology turned out to be real and useful — just not in the way the loudest voices claimed, and almost never on the timeline the press releases suggested.

LLMs are in the hype phase right now. And the hype is doing real damage.

Not to the technology — the technology is genuinely impressive and getting better fast. The damage is to the organizations trying to make decisions about it, and to the engineers tasked with building things on top of it, who are getting pulled between two equally unhelpful camps: the true believers who think AI solves everything, and the skeptics who think it's all smoke and mirrors.

Neither camp is useful. Here's what I actually think, after spending the last year paying close attention.

## What LLMs Are Actually Good At

Language models are extraordinary at a specific class of tasks: generating plausible, fluent, contextually appropriate text given an input. That sentence is doing a lot of work, so let me unpack it.

_Plausible_ means the output looks right. It reads like something a competent person might write. The grammar is correct, the structure is coherent, the tone is appropriate. This is genuinely impressive and not trivial to achieve.

_Fluent_ means it flows. There are no awkward constructions, no obviously machine-generated artifacts, no tells that a human didn't write it.

_Contextually appropriate_ means the model can adapt its output to the context you give it. Ask it to write like a lawyer, it sounds like a lawyer. Ask it to explain something to a twelve-year-old, it adjusts.

These capabilities make LLMs genuinely useful for a wide range of tasks: drafting, summarizing, reformatting, translating, explaining, generating code stubs, answering questions about well-documented topics. The productivity gains for individual developers are real. I use these tools daily and they've changed how I work.

But here's the problem. "Generating plausible text" is not the same as "generating correct text." And for most enterprise use cases, correctness is the actual requirement.

## The Confidence Problem

LLMs don't know what they don't know. Or more precisely: they have no reliable mechanism for distinguishing between things they know well, things they half-know, and things they've confabulated entirely. The output looks the same in all three cases — fluent, confident, plausible.

![The Confidence Problem](/llms-are-not-magic-1.jpg)

This is a fundamental property of how these models work, not a bug that'll get patched in the next release. They're trained to predict likely next tokens. A token that confidently continues a wrong claim is, statistically, often just as likely as one that hedges or refuses. So they don't hedge. They continue.

For a developer using an LLM as a writing assistant, this is manageable. You read the output, you check the parts that matter, you correct what's wrong. The human is in the loop.

For an enterprise system where the LLM's output is going directly to a customer, or being used to make a decision, or being stored as a record — this is a serious problem. You can't have a human reviewing every output at scale. Which means you need the system itself to be right, or to know when it isn't.

Neither is straightforward with a raw LLM.

## The Memory Problem

Here's something that surprises people who haven't thought about it: language models, by default, don't remember anything. Each conversation starts fresh. Everything the model "knows" comes from either its training data (frozen at a point in time) or the context window you give it in the current request.

This matters enormously for enterprise use cases. Your company's internal documentation, your product database, your customer records, your policies updated last week — none of that is in the model's training data. And you can't just dump it all into a context window; those have limits, and even within those limits, models don't always pay equal attention to everything you give them.

This is why there's so much current interest in retrieval-augmented generation — the pattern of dynamically fetching relevant context at query time and injecting it into the prompt. It's a real solution to a real problem. But it's also a significant architectural addition that introduces its own complexity: what do you retrieve, when, how do you rank it, how do you handle conflicts between retrieved context and the model's training?

These are solvable engineering problems. But they're engineering problems. They don't disappear just because the underlying model is impressive.

## The Evaluation Problem

How do you know if your AI system is working?

With traditional software, this is mostly a solved problem. You write tests. You define expected outputs for given inputs. You measure pass rates. You set thresholds. You ship when the tests pass.

With LLMs, the output is variable and open-ended. The same input can produce different outputs on different runs. "Correct" often means something subjective — helpful, accurate, appropriately scoped — that's hard to reduce to a boolean.

This doesn't mean evaluation is impossible. There are good approaches: human evaluation panels, model-based evaluation, task-specific metrics, consistency testing, red-teaming. But it's substantially more involved than writing unit tests, and most teams doing their first AI integration don't budget for it properly.

The result is that they ship without knowing whether the system is actually working well. They find out from users. Sometimes that's fine — the failure modes are minor and catchable. But in regulated industries, or in systems where mistakes have real consequences, this is not an acceptable approach.

## What I Think the Next Phase Looks Like

The hype cycle will peak and come down. It always does. What'll be left is something more interesting: a set of genuinely capable tools that are useful for specific, well-understood problems — and an engineering discipline around how to use them reliably.

That discipline doesn't exist yet, at least not in a mature, standardized form. It's being invented right now, by teams who've run into the hard problems and had to solve them. The patterns are starting to emerge — retrieval architectures, evaluation frameworks, output validation layers, human-in-the-loop designs — but they're not yet the default the way REST APIs or relational databases are.

I think the engineers who understand both sides of this — what the models can genuinely do, and what the surrounding system needs to do to make them reliable — are going to be the ones doing the most valuable work in enterprise AI over the next few years.

Not the prompt engineers. Not the people who can make a demo look impressive. The people who can build systems that work correctly, consistently, and at scale.

That's the problem worth solving. And it's a much harder, more interesting problem than the demos suggest.

## A Note on My Own Position

I want to be transparent about where I'm standing when I write this. I'm not a machine learning researcher. I haven't trained a model from scratch. My background is in software architecture, specifically mobile — systems that have to work reliably under conditions you can't fully control.

That perspective makes me more skeptical of raw model capability claims and more interested in the system-level questions. It also means I have genuine gaps in my technical understanding of some of what's happening under the hood.

I'm filling those gaps. Deliberately, methodically. And I'll write about what I find — including the parts where my initial intuitions turn out to be wrong.

That's more useful than pretending I already know everything. And more honest.
