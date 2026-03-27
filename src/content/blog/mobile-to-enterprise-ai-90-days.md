---
title: "From Mobile to Enterprise AI: My First 90 Days"
excerpt: I've spent two decades building mobile software. Three months ago I started going deep on enterprise AI systems. Here's what surprised me, what confirmed my instincts, and what I got completely wrong.
publishDate: 'Oct 7 2024'
tags:
  - Reliable Enterprise AI
  - Enterprise AI
  - Architecture
  - Career
seo:
  image:
    src: '/mobile-to-enterprise-ai-90-days.jpg'
    alt: Transition from mobile architecture to enterprise AI systems
---

![Transition from mobile architecture to enterprise AI systems](mobile-to-enterprise-ai-90-days.jpg)

Three months ago I made a deliberate decision to go deep on enterprise AI systems. Not surface-level — not "I'll follow the AI news and write about trends." Deep. The kind of deep that means reading papers, working through the architecture decisions, understanding what actually breaks in production and why.

I've been writing about AI reliability from a strategic and architectural standpoint since the beginning of this year. That's been useful — both for my own thinking and, judging by the conversations it's started, for others navigating the same questions. But at some point strategic observation has to give way to hands-on understanding. You can only reason about what you haven't built for so long before the gaps start to show.

So I went deeper. This is what I found.

## What I Expected Going In

Coming from mobile architecture, I had a mental model ready. I wrote about it in June: the parallels between building for unreliable environments and building reliable AI systems are real. Design for failure. Explicit fallbacks. Observability from the start. State management as a first-class concern.

I expected those principles to transfer. They do — but the specific failure modes are different enough that having the right principles doesn't save you from the wrong assumptions about where problems will actually appear.

I also expected the tooling to be immature. It is, but in specific ways I didn't fully anticipate. Some areas have excellent tooling and no consensus on how to use it. Others have strong opinions and weak implementations. The map of "where is this ecosystem actually solid" is very different from what the conference talks and blog posts suggest.

And I expected the hard problems to be in the model layer. They're not. That's probably the single biggest correction to my priors over these three months.

## The Model Is Not the Problem

This bears repeating because it cuts against the dominant narrative: for enterprise AI reliability, the model is rarely where things go wrong.

![The Model Is Not the Problem](mobile-to-enterprise-ai-90-days-1.jpg)

Modern LLMs — the ones worth using in production — are impressively capable within their design parameters. They follow instructions well. They handle nuanced language. They reason across multiple pieces of context with reasonable coherence. When you give a good model good inputs, you usually get good outputs.

The problems are almost always in what surrounds the model.

Retrieval that returns the wrong documents. Chunking strategies that break context across boundaries, so the retrieved text doesn't make sense without what was cut off. Prompt structures that inadvertently instruct the model to be more confident than the evidence warrants. Evaluation frameworks — or the absence of them — that can't detect when the system has quietly started degrading.

I've been tracking a mental list of "where did this go wrong" for every AI system failure I've studied over the past three months. The model itself is responsible for maybe 15% of the cases. The surrounding system accounts for the rest.

This matters because it changes where you invest your engineering attention. If you believe the model is the problem, you spend time on prompt engineering and model selection. If you understand that the system is the problem, you spend time on retrieval quality, evaluation, and observability. The latter is where the reliability work actually lives.

## What Surprised Me About the Retrieval Problem

I understood retrieval-augmented generation conceptually before I started going deep. The architecture made sense. Embed the documents, embed the query, find the closest vectors, inject the context. Straightforward.

What I didn't fully appreciate is how many ways retrieval can fail subtly — in ways that look fine on average but are systematically wrong for specific query types.

Chunking is more consequential than it appears. Split a document at the wrong boundary and the retrieved chunk reads like the middle of a conversation — contextually incomplete, unable to stand alone. The model gets this fragment, tries to use it, and produces an answer that's technically grounded in retrieved content but fundamentally misleading because the context was truncated.

Embedding quality varies by domain. A general-purpose embedding model trained on web text may represent legal language, technical specifications, or domain-specific jargon poorly. The semantic distances it computes aren't wrong in absolute terms — they reflect what the model learned. But what it learned may not match what "similar" means in your specific knowledge base. Retrieval that looks good on generic benchmarks can be mediocre on your actual content.

Query formulation matters in ways users never see. The way a user phrases a question significantly affects what gets retrieved. The same underlying information need, expressed differently, can return very different documents. This variability in retrieval is often invisible to end users — they see the answer, not what was retrieved to produce it — which makes it easy to miss in evaluation.

## What I Got Wrong

I underestimated how much the evaluation problem would dominate everything else.

With traditional software, you define expected behavior, write tests, and verify that the tests pass. The feedback loop is fast and objective. With AI systems, defining "correct" behavior is genuinely hard for a significant fraction of queries, the output space is open-ended, and evaluation at scale requires either substantial human effort or the use of another model to evaluate outputs — which introduces its own error rate.

I thought this was a second-order problem. It's first-order. Everything else — retrieval quality, prompt design, model selection — is only measurable if you have a reliable way to evaluate outputs. Without that, you're making architectural decisions without a way to verify whether they improved anything.

The other thing I underestimated: how much organizational context shapes what "reliable" means in practice. Two systems with identical technical characteristics can have very different reliability profiles depending on who uses them, for what, with what tolerance for error. A system that's reliable enough for an internal research tool is not reliable enough for a customer-facing compliance application. Reliability is not a property of the system in isolation — it's a property of the system in context.

That context has to be defined before you can engineer for it. Most teams skip this step.

## What I'm Taking Forward

Three months of deliberate attention has sharpened the framework I've been building around reliable enterprise AI. A few things I'm now confident about:

The reliability problem is an engineering problem, not a model problem. It's solvable with disciplined systems engineering — the same kind of thinking that makes any complex production system trustworthy. It's just not being applied consistently, because the field is moving fast and the pressure to ship is high.

Evaluation is the foundation everything else rests on. You can't improve what you can't measure. Building serious evaluation before building features is the right order of operations, and almost nobody does it in that order.

The regulatory pressure is going to force this conversation whether the industry is ready or not. The EU AI Act is already in force. The requirements it establishes for high-risk AI systems are not optional. Organizations that treat compliance as a future problem are accumulating technical and legal debt simultaneously.

And the engineers who understand the full stack — model behavior, retrieval architecture, evaluation methodology, observability, compliance requirements — are going to be the ones who can actually build systems that meet enterprise requirements. That combination is rarer than it should be, and more valuable than the market currently reflects.

I'll keep writing about all of it. Going deeper, not broader.

---

*The next few posts will get more specific: what serious RAG failure analysis actually reveals, what the EU AI Act means in practice for engineering teams, and what I'm calling the determinism gap — the missing piece that keeps most enterprise AI systems from being genuinely trustworthy.*
