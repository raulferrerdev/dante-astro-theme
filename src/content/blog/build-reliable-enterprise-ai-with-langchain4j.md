---
title: 'How RAG Actually Works: Building Reliable Enterprise AI with LangChain4j'
excerpt: The gap between the architecture diagram and the working system , documented from the inside.
publishDate: 'Mar 30 2026'
tags:
  - AI
  - RAG
  - Architecture
  - Langchain4j
  - Engineering
seo:
  image:
    src: '/build-reliable-enterprise-ai-with-langchain4j.jpg'
    alt: A RaAG System flow image
---

![RAG pipeline.](/build-reliable-enterprise-ai-with-langchain4j.jpg)

Every RAG tutorial shows the same diagram.

> A document goes in. It gets split into chunks. The chunks become vectors. The vectors go into a database. A user asks a question. The system finds the closest vectors. The LLM generates an answer. Clean arrows, clean boxes, clean result.

What the diagram does not show is what happens when the chunks are the wrong size, when the retrieved vectors are close but not relevant, when the LLM receives context that looks right but answers incorrectly, and when none of this produces an error - the system just quietly returns a wrong answer with full confidence.

Moving from a prototype to **Reliable Enterprise AI** requires more than just connecting an LLM to a database; it requires handling silent failures in the retrieval pipeline.

I have spent the last several days building a RAG pipeline from scratch with _Java_, _[LangChain4j](https://docs.langchain4j.dev)_, and _[Weaviate](https://weaviate.io)_. This is what I actually found.

## The pipeline, stage by stage

The standard diagram is not wrong. The stages are real. What is missing is the operational reality of each one.

![RAG pipeline.](/build-reliable-enterprise-ai-with-langchain4j-1.jpg)

This is the reference. Everything that follows is what that reference looks like in practice.

## Stage 1 and 2. Documents and chunking

The starting point is deceptively simple: _load a document, split it into chunks, store the chunks as vectors_.

In **_LangChain4j_**, the ingestion pipeline looks like this:

```java
EmbeddingStoreIngestor ingestor = EmbeddingStoreIngestor.builder()
.embeddingModel(embeddingModel)
.embeddingStore(weaviateStore)
.documentSplitter(DocumentSplitters.recursive(300, 30))
.build();
```

Three hundred tokens per chunk, thirty token overlap. Those numbers look arbitrary because they are (at first). They are the defaults that get replaced as soon as you discover what happens at the boundaries.

**The overlap is not optional.** Without it, a sentence that straddles two chunks, one that contains the key concept your user is asking about, gets split in half. The embedding of each half captures only part of the meaning. Neither half retrieves cleanly. The context the LLM receives is incomplete, and the answer reflects that incompleteness without signaling it.

**Chunking is the stage where most retrieval problems originate.** It is also the stage most tutorials treat as a configuration detail.

## Stage 3. Embedding

_Each chunk gets converted into a vector: a sequence of numbers that_ **_encodes the semantic meaning of the text._** Two chunks with similar meaning will have vectors that are close together in the vector space. Two chunks about unrelated topics will be far apart.

In our stack, this is handled by _[nomic-embed-text](https://ollama.com/library/nomic-embed-text)_ (an open-source model chosen for its superior 8192-token context window and its ability to handle long-form enterprise documents without losing semantic meaning) running locally via **_[Ollama](https://ollama.com)_**:

```java
EmbeddingModel embeddingModel = OllamaEmbeddingModel.builder()
.baseUrl("http://localhost:11434")
.modelName("nomic-embed-text")
.build();
```

What the diagram does not show is that the embedding model makes an implicit assumption about language and domain. A model trained on general English text will represent enterprise-specific terminology (e.g., regulation identifiers, product codes, internal acronyms) less accurately than it represents everyday language.

The vector for _"EU AI Act Article 12"_ and the vector for "transparency requirements" may be less similar than they should be, depending on how well the embedding model has seen this domain during training.

This is not a failure. It is a constraint to design around, and it is why **embedding model selection is an architecture decision**, not a configuration choice.

## Stage 4. Vector store

_The vectors and their associated text chunks are stored in_ **_Weaviate_**. Each chunk becomes an object with **two components: the raw text and its vector representation**.

```java
EmbeddingStore<TextSegment> store = WeaviateEmbeddingStore.builder()
.scheme("http")
.host("localhost:8090")
.objectClass("EnterpriseDocument")
.build();
```

One thing the diagram omits: **the vector store also maintains an index**. In our case **_HNSW (Hierarchical Navigable Small World)_**, that determines how efficiently similarity searches run at scale. The default configuration works for development. At enterprise scale, with millions of vectors, the index parameters become a performance and accuracy tradeoff that requires explicit tuning.

The **_Weaviate_** schema also activates **_BM25_** indexing on the text property automatically (a critical fallback for **Reliable Enterprise AI**, as it allows the system to find exact matches for jargon or unique identifiers that vector models might otherwise 'hallucinate' or overlook).

## Stage 5. Retrieval

_When a user submits a question, the system embeds that question using the same model used during ingestion, then searches the vector store for the chunks whose vectors are most similar to the question vector._

```java
ContentRetriever retriever = EmbeddingStoreContentRetriever.builder()
.embeddingModel(embeddingModel)
.embeddingStore(embeddingStore)
.maxResults(5)
.minScore(0.75)
.build();
```

Two parameters define the reliability boundary here: **_maxResults_** and **_minScore_**.

### maxResults

**_maxResults_** is _not about how many chunks to use_. It is about _how many candidates to retrieve before filtering_. Setting it too low means you miss relevant chunks. Setting it too high means you flood the LLM with noise.

### minScore

**_minScore_** is the similarity threshold below which a chunk is rejected. This is where I spent the most time. At 0.7, the system retrieved chunks that were semantically adjacent but not actually relevant (e.g., chunks about AI governance when the user asked about AI reliability). The LLM received plausible-looking context and generated a plausible-looking wrong answer.

Raising the threshold to 0.75 reduced false retrievals significantly. It also introduced a new requirement: the system needed to handle the case where no chunks cleared the threshold, and return an explicit, honest response rather than attempting to answer from inadequate context.

```java
if (retrievedContents.size() < MIN_CHUNKS_REQUIRED) {
    return RagResponse.noContextFound(userQuestion);
}
```

This is the most important line in the entire pipeline. A RAG system that says _"I don't have enough context to answer this reliably"_ is more trustworthy (and also more auditable) than one that always generates a response.

## Stage 6 and 7. Augmentation and generation
_The retrieved chunks are assembled into a prompt that instructs the LLM to answer only from the provided context_:

```java
String prompt = """
You are an enterprise AI assistant. Answer ONLY using the context below.
If the context is insufficient, say so explicitly.

CONTEXT:
%s

QUESTION:
%s
""".formatted(context, userQuestion);

String answer = chatModel.chat(prompt);
```

Two decisions here that matter for enterprise reliability.

First, _temperature_: 0.0. In a production RAG system, you want deterministic responses: the same question with the same context should produce the same answer. Temperature zero eliminates the randomness that makes LLM outputs feel conversational but makes them unreliable for auditing.

Second, the explicit instruction to acknowledge insufficient context. This is the prompt-level enforcement of the threshold gate at retrieval. Both layers are necessary: the threshold stops bad retrieval, the prompt instruction handles edge cases where retrieval was technically sufficient but the LLM cannot form a confident answer.

## What the diagram misses: the audit layer

The pipeline I described above retrieves, augments, and generates. For enterprise use, that is not enough.

Every query needs a trace: what was the question, what chunks were retrieved, how many, and what was the answer. Not for debugging, but for compliance. Under the _[EU AI Act](https://artificialintelligenceact.eu/ai-act-explorer/)_, high-risk AI systems require audit trails of their decisions. In a RAG system, the decision is the answer, and the evidence is the retrieved context.

```sh
[RAG-AUDIT] queryId=46d61c6b | chunks=4 | contextFound=true |
question="What are the reliability requirements?" |
answer="All production AI systems must maintain…" |
ts=2026–03–26T06:46:00Z
```

Every query. Every time. This is what separates a RAG proof-of-concept from a system you can put into production and stand behind.

## Conclusion

**Chunking** is where most retrieval problems start: overlap prevents context from being split across boundaries, and **chunk size affects both precision and recall downstream**.

The **_minScore_** **threshold is a reliability decision, not a configuration detail**: too low and you retrieve noise; too high and you retrieve nothing. The right value depends on your domain and your documents.

**An explicit no-answer is a feature, not a failure**: a system that refuses to answer when context is insufficient is more reliable and more auditable than one that always generates a response.

The full implementation of this pipeline is available at [reliable-enterprise-ai, module 01](https://github.com/raulferrerdev/reliable-enterprise-ai), built with _Java 21_, _Spring Boot_, _LangChain4j_, and _Weaviate_.

In the next article, I map the complete RAG ecosystem - from Naive RAG to Agentic pipelines - and explain which architecture is right for which enterprise use case. If you have already read that one, the article after covers the failure mode that most teams misattribute to the LLM but almost always originates in retrieval.
