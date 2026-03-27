---
title: What Mobile Architecture Taught Me About Building AI Systems
excerpt: Twenty years designing software for unreliable environments turns out to be surprisingly good preparation for enterprise AI. Here's the map between the two worlds.
publishDate: 'Jun 18 2024'
tags:
  - AI
  - Architecture
  - Mobile
  - Enterprise
seo:
  image:
    src: '/mobile-architecture-and-ai.jpg'
    alt: Mobile architecture and AI systems parallels
---

![Mobile architecture and AI systems parallels](/mobile-architecture-and-ai.jpg)

I've been building mobile software long enough to remember when "mobile" meant figuring out how to make your app survive a 2G connection dropping mid-request. Before offline-first was a design pattern with a name. Before the frameworks. When you had to reason from first principles about what happens when the environment you're depending on simply stops cooperating.

That experience shaped how I think about software in ways I didn't fully appreciate until I started paying serious attention to AI systems. Because the core challenge is remarkably similar: how do you build something reliable on top of something that isn't?

## The Unreliable Environment Problem

Mobile developers spend their careers designing for environments they don't control. The network drops. The device runs out of battery mid-sync. The OS kills your process to free memory. The user taps in exactly the sequence you didn't test. Storage fills up. The GPS lies.

You can't prevent any of these things. You can only design for them — explicitly, deliberately, as a first-class concern. The mobile engineers who build things that last are the ones who internalized this early: the environment is your adversary. Not a malicious adversary, just an indifferent one. Plan accordingly.

AI systems have the same fundamental property, but the failure modes are less visible. An LLM doesn't throw an exception when it hallucinates. A retrieval step doesn't return a 404 when it fetches the wrong documents. The system keeps running, keeps generating output, keeps looking like it's working — while producing results that range from subtly wrong to completely fabricated.

That invisibility is what makes AI failures harder to catch than network failures. A dropped connection is obvious. A confident wrong answer isn't, until someone who knows better reads it.

## Five Mobile Patterns That Map Directly to AI

Going through my mental model of how I approach mobile architecture, I keep finding direct parallels to the problems AI systems face. These aren't analogies for the sake of analogy — they're the same underlying problem in different clothes.

![Five Mobile Patterns That Map Directly to AI](/mobile-architecture-and-ai-1.jpg)

### Offline-first thinking → Context-first thinking

Mobile apps designed for unreliable connectivity assume the network is absent by default and treat availability as a bonus. Data is cached locally. Operations are queued and synced when possible. The app works regardless of connectivity state.

AI systems need something similar with respect to context. Don't assume the model knows what it needs to know. Design the system so that the relevant context is always explicitly provided — retrieved, injected, validated. Treat the model's internal knowledge the way a good mobile app treats network data: useful when available, but never assumed.

The pattern that's emerging in AI to solve this — retrieval-augmented generation — is essentially offline-first thinking applied to language models. Fetch what you need, inject it explicitly, don't rely on what might or might not be baked into the model's weights.

### Graceful degradation → Fallback paths for AI components

Mobile apps define explicit behavior for every failure state. If the API call fails, show cached data. If cached data is stale beyond a threshold, show an error with a retry option. If location is unavailable, use a default. Every component has a fallback.

AI components need the same treatment. If the retrieval step returns nothing useful, don't let the model confabulate — fall back to a deterministic response or escalate to a human. If the model's confidence indicators suggest the output is unreliable (where such signals exist), surface that uncertainty rather than hiding it. If the AI component fails entirely, what's the graceful degradation path?

Most AI integrations I've seen don't have answers to these questions. They have a happy path. That's not enough.

### State management → Context window management

Managing state in complex mobile apps is one of the genuinely hard problems in the field. What's the source of truth? How does state flow through the component tree? What triggers a re-render, and is that correct? What happens when two parts of the system have conflicting views of the same state?

AI systems have an analogous problem with context. The context window is a resource — finite, ordered, and consequential. What you put in it, in what order, at what length, matters. Irrelevant context dilutes signal. Missing context leads to wrong answers. Contradictory context confuses the model.

Treating context management as a first-class architectural concern — not as an afterthought in the prompt — is one of the things that separates AI systems that work from ones that sort of work sometimes.

### Instrumentation → AI observability

In mobile, you can't reproduce user issues without telemetry. What was the device state? What network were they on? What was the sequence of actions that led to the crash? Good mobile telemetry captures enough context to reconstruct what happened, even in edge cases you didn't anticipate.

AI systems need a similar level of observability, but the questions are different. What did the retrieval step return? What prompt was actually sent to the model, with what context? What was the model's output before any post-processing? Why did the system produce this particular response?

Without this data, debugging AI misbehavior is guesswork. And instrumenting after the fact is always harder than building it in from the start.

### Version management → Model version management

Mobile developers know the pain of API versioning. The backend changes an endpoint, you need to handle both the old and new response format during a transition period, you need to know which version of the API a given user is hitting. It's not glamorous work, but it keeps production systems running.

Model versioning is the same problem with higher stakes. An LLM provider updates a model and the behavior changes — sometimes subtly, sometimes significantly. If your system assumes a specific model's response patterns, you'll find out about the change in production, not in testing. Building AI systems that treat the model as a versioned, swappable dependency — rather than a fixed point — is the kind of defensive engineering that prevents expensive surprises.

## What This Means in Practice

None of these parallels are perfect. AI systems have properties that mobile systems don't, and the specific implementation patterns are different. But the underlying discipline — designing explicitly for failure, treating unreliability as the default, building observability in from the start — transfers almost completely.

The engineers I've talked to who've had the most success with AI in production are almost universally people who brought this mindset to the problem. They didn't trust the demo. They asked what happens when it goes wrong. They built fallbacks before they built features.

The ones who've struggled built impressive demos and then discovered, in production, all the ways the environment could fail them.

## Why I'm Writing This Now

I'm in the middle of a deliberate shift in how I'm spending my technical attention. Mobile architecture has been my home for a long time. AI systems — specifically the question of how to make them reliable enough for enterprise use — is where I'm investing the next phase.

Not because mobile is done or uninteresting. Because the reliability problem in enterprise AI is one of the most consequential unsolved engineering problems I've encountered, and the skills I have are directly relevant to it.

This series of posts is part of how I'm thinking through it publicly. The mapping from mobile to AI is one piece. The specific patterns for retrieval, evaluation, and observability in AI systems are things I'll be writing about as I go deeper.

The goal isn't to become an AI researcher. It's to become someone who can build and evaluate AI systems with the same level of rigor that good mobile engineers bring to their work.

That rigor is what's missing from most of what I see being shipped right now. And it's the problem worth solving.
