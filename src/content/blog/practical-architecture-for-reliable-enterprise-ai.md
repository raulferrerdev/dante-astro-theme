---
title: 'RAG Is Not One Thing: A Practical Architecture Map for Reliable Enterprise AI Systems'
excerpt: RAG isn’t a single pattern, but a family of architectures. And choosing the wrong architecture isn’t a performance problem, but a design flaw.
publishDate: 'Mar 26 2026'
tags:
  - AI
  - RAG
  - Architecture
  - Enterprise
  - Engineering
seo:
  image:
    src: '/practical-architecture-for-reliable-enterprise-ai.jpg'
    alt: A practical architecture map for RAG systems
---

![Image created by the author.](/practical-architecture-for-reliable-enterprise-ai.jpg)

You might encounter teams that think RAG is just one thing: embed documents, store them in a vector database, retrieve the top-K chunks, and pass them to an LLM. Done.

Okay, this is one way, but it’s the least capable version.

As I delve deeper into building RAG systems with a Java stack — working with **[LangChain4j](https://docs.langchain4j.dev/)** and **[Weaviate](https://weaviate.io/)** — I’ve realized something that radically changes how these systems are evaluated: **RAG isn’t a single pattern, but a family of architectures.** And choosing the wrong architecture isn’t a performance problem, but a design flaw.

Below, I present a map that can help analyze this area.

## The pipeline you must always have in mind

Before categorizing anything, keep the following in mind: each RAG variant is a modification of a basic workflow:

![RAG pipeline.](/practical-architecture-for-reliable-enterprise-ai-1.jpg)

Every technique, every optimization, every new RAG approach intervenes in one or more stages of this workflow.

Therefore, in practice, this workflow becomes a diagnostic tool. When something fails (and it will), the question to ask is not:
_Why isn’t the RAG working?_
But rather:
_Which stage of the workflow is failing and how is it being compensated for (or not)?_

## A failure-oriented lens

In practice, RAG systems tend to fail in a limited number of recurring ways:

1.  **Retrieval miss.** The relevant information is not retrieved at all.
2.  **False positive retrieval.** Semantically similar but irrelevant chunks dominate the context.
3.  **Ranking failure.** The right information is retrieved but not prioritized.
4.  **Context dilution.** Too much low-signal information reduces answer quality.

These failure modes provide a more practical way to evaluate a system than simply asking whether “RAG works”.

## Level 1. Naive RAG: the foundation (and the trap)

The baseline architecture is simple. Documents are divided into chunks, converted into embeddings, and stored in a vector database. When a query is made, the user’s question is embedded and compared against these vectors using similarity metrics such as cosine distance.

In _LangChain4j_, ingestion can be as simple as:

```java
EmbeddingStoreIngestor ingestor = EmbeddingStoreIngestor.builder()
    .embeddingStore(weaviateStore)
    .embeddingModel(embeddingModel)
    .build();
```

And it usually works fine (for a proof of concept).

The problem arises when errors start to appear. There is no correction mechanism. If retrieval returns the wrong chunk, the LLM will generate a response based on that erroneous context, and it will do so with complete certainty.

Observing these flaws might lead us to try to improve the quality of the response by increasing the _top-K_ value. In other words, we aim to obtain better responses by increasing the context. However, in practice, _this often introduces noise and ultimately makes the results less reliable_.

From a diagnostic perspective, this behavior is a strong signal of retrieval weakness. If increasing _top-K_ improves results, the issue is rarely “lack of context”, but rather insufficient precision in the retrieval stage.

The **Naive RAG** is not inherently flawed. However, on its own, it does not constitute a production-ready architecture.

## Level 2. Advanced RAG: where reliability begins

This is where the system begins to compensate for its own weaknesses.

At this level, three techniques stand out, each operating at a different stage of the process.

### Re-Ranking

**Re-Ranking operates immediately after the initial retrieval stage**. Instead of accepting the order obtained by vector similarity, the system retrieves a larger set of candidates (e.g., the top 50) and applies a second model to reorder them based on actual semantic relevance.

This stage is critical for mitigating the “**Lost in the Middle**” phenomenon, where LLMs tend to ignore information located in the middle of a large context, prioritizing only the beginning and the end.
When we reorder, we ensure that the most vital information is in the positions that receive the most attention from the model. From this perspective, the idea is simple: first, we maximize recall, and then we refine precision.

This improvement, however, comes at a cost: additional latency and computational overhead. _In production systems, re-ranking must be carefully balanced against response time constraints_.

### Query transformation

**Query transformation occurs before retrieval**. Users don’t formulate questions in a way that matches how the documents were indexed. Overcoming this difference is not simple. Particularly interesting patterns are often used at this point:

- **HyDE (Hypothetical Document Embeddings)**. A hypothetical answer is generated and embedded in place of the question.
- **Multiple query**. Multiple reformulations of the same query are generated, and the retrieval results are combined.

Both approaches attempt to reduce the discrepancy between the query language and the document language, which is often a cause of silent failures.

### Hybrid search

**Hybrid search combines the power of semantic search (vectors) with the precision of traditional keyword search (BM25)**, merging both results using techniques such as _Reciprocal Rank Fusion (RRF)_.

In many enterprise scenarios, hybrid search is not an optimization but a requirement.

Pure vector search often fails to capture domain-specific identifiers (codes, product IDs, legal references), which are critical for correct retrieval.

In practice, these techniques should be considered less as “advanced features” and more as basic requirements for systems that need to be reliable under real-world conditions.

## Level 3. Structured RAG: when data shape matters

At this point, the architecture begins to diverge depending on the underlying data structure.

### Graph RAG

**Graph RAG introduces explicit relationships between entities**. Instead of relying solely on proximity in a vector space, the system can “navigate” through logical connections.

This is fundamental for queries requiring multi-hop reasoning. For example, instead of searching for fragments that mention “Supplier A” and “Product B,” the graph allows the system to formally understand that “A supplies B,” enabling much more sophisticated and accurate deductions.

### SQL RAG (Text-to-SQL)

**SQL RAG translates natural language into structured queries that can be executed on relational databases**. This gives the system the ability to answer quantitative questions (e.g., _How many sales were there in Q3?_) that a traditional vector-based RAG simply cannot reliably handle.

However, from an evaluation perspective, this introduces governance and security challenges: the system must ensure the correctness of SQL syntax, control access to sensitive data, and prevent glitches that could unintentionally expose private database information.

In practice, even minor errors in query generation can lead to silent but critical failures, especially when results appear plausible but are factually incorrect.

### Multimodal RAG

**Multimodal RAG goes beyond plain text**. Business documents are rarely clean and composed solely of text: tables, diagrams, and design structures often contain critical information. Converting them to plain text can inadvertently degrade the quality of the information.

This is one of the areas where many systems that function correctly may fail upon closer analysis.

## Level 4. Agentic RAG: capability vs. control

This is the most flexible and also the most complex category.
The main characteristic of this category is that the system no longer executes a fixed sequence, but rather makes decisions about how to use it.

### Self-amplified RAG

**Self-amplified RAG introduces internal evaluation steps:** whether to retrieve the information, whether the retrieved content is relevant, and whether the generated response is justified. These decisions are based on models, not on predefined logic.

### Corrective RAG (CRAG)

**Corrective RAG (CRAG) adds external evaluation and fallback strategies** when the retrieval quality is deemed insufficient.

### Adaptive RAG

**Adaptive RAG attempts to classify the complexity of the query and direct it to different strategies**, optimizing both cost and latency.

### Tool-Augmented Agentic RAG

**Tool-Augmented Agentic RAG** further generalizes this concept. The model dynamically coordinates multiple tools (retrieval, databases, APIs).

In _LangChain4j_, this is typically expressed using annotated tools:

```java
@Tool(“Search the corporate knowledge base”)
String searchKnowledgeBase(String query) { … }

@Tool(“Query order status from ERP system”)
String getOrderStatus(String orderId) { … }
```

Each decision point (whether or not to retrieve, which source to use, whether to trust the results) introduces a non-deterministic branch.

This has direct implications for debugging and observability. From a reliability perspective, this expands the catalog of potential failures.

Two identical queries may follow different execution paths, making failures difficult to reproduce and diagnose. Without proper tracing and logging, root cause analysis becomes unreliable.

From a governance perspective, especially under frameworks such as the [EU AI Act](https://artificialintelligenceact.eu/ai-act-explorer/), this introduces a critical requirement:

_Can the system provide a traceable and reproducible explanation of how a response was generated?
In many current implementations, the answer is still unsatisfactory. This gap is not only technical, but regulatory._

## Quick recap

The following table can help you evaluate RAG systems:

![RAG systems table.](/practical-architecture-for-reliable-enterprise-ai-2.jpg)

It’s generally best to work backward when implementing a RAG system. That is, evaluate a Level 2 system before implementing a Level 4 system.

Perhaps agent-based architectures aren’t necessary; a simple re-ranking can be very helpful.

### A note on evaluation

A reliable RAG system cannot be assessed qualitatively alone.

At minimum, evaluation should include:

- Retrieval effectiveness (e.g., Recall@K)
- Ranking quality (e.g., MRR)
- Answer grounding and faithfulness.

Without these signals, improvements are often based on intuition rather than measurable system behavior.

## Conclusion

We can better understand a RAG if we consider it as a set of architectural decisions, not as an isolated technique.

Techniques such as **hybrid search** and **re-ranking** should not be considered optional in many business environments, as they form part of the reliability foundation.

As systems become increasingly autonomous, **their capability and the complexity of evaluating them simultaneously increase**. Managing this balance is critical in regulated environments.

## What’s next

This is the classification I intend to delve into for the construction and evaluation of RAG systems.
In the next article, I will focus on why some RAG systems fail during retrieval, not at the LLM, and what that means for how you diagnose and fix them.
The reference implementation for these patterns is evolving in the [reliable-enterprise-ai repository](https://github.com/raulferrerdev/reliable-enterprise-ai), built with _Java_, _LangChain4j_, and _Weaviate_.
