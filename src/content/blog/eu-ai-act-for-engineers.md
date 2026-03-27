---
title: 'The EU AI Act for Enterprise Engineers: What You Actually Need to Know'
excerpt: The EU AI Act is now in force. Most coverage explains what it says. This one explains what it means for the engineers who have to build systems that comply with it — and why the requirements aren't as alien as they might seem.
publishDate: 'Dec 3 2024'
tags:
  - EU AI Act
  - Reliable Enterprise AI
  - AI Compliance
  - Enterprise AI
  - AI Regulation
seo:
  image:
    src: '/eu-ai-act-for-engineers.jpg'
    alt: EU AI Act compliance for enterprise engineering teams
---

![EU AI Act compliance for enterprise engineering teams](/eu-ai-act-for-engineers.jpg)

The EU AI Act entered into force in August 2024. Since then, coverage has split predictably into two camps: business-oriented explainers focused on risk categories and fines, and legal analyses dense enough to require a law degree to parse. What's mostly missing is the engineering perspective — what the Act actually requires at the system design level, translated into terms that make sense to people who build software for a living.

That's what this post is.

I want to be clear about what this isn't: it's not legal advice, and it's not a compliance checklist. It's an engineer's reading of a regulatory document, filtered through several months of thinking seriously about AI reliability. My argument is that the Act's technical requirements aren't as foreign as they might seem — they're largely the engineering discipline that reliable AI systems should have anyway, now encoded in law.

## The Risk-Based Structure

The Act organizes AI systems into risk tiers, which determines what obligations apply. Understanding the tiers is the prerequisite for everything else.

**Unacceptable risk** systems are prohibited outright. Social scoring by governments, real-time biometric surveillance in public spaces, AI that manipulates people through subliminal techniques. If you're building these, you have larger problems than compliance.

**High-risk** systems face the most substantial obligations. This is the tier that most enterprise engineering teams need to understand in detail. High-risk systems include AI used in employment decisions (CV screening, performance evaluation, work allocation), access to essential services (credit scoring, insurance, public benefits), education and vocational training, law enforcement, critical infrastructure, and a few other categories. If your AI system makes or materially influences decisions in any of these areas, you're in high-risk territory.

**Limited risk** systems have lighter requirements, primarily around transparency — AI-generated content must be disclosed as such, chatbots must identify themselves as AI.

**Minimal risk** covers everything else and has no specific obligations.

The classification question — which tier does my system fall into — is where legal counsel becomes necessary. The boundaries aren't always clear, and the consequences of misclassification are significant. But once you know you're in high-risk territory, the engineering requirements become the primary concern.

![EU AI Act compliance for enterprise engineering teams](/eu-ai-act-for-engineers-1.jpg)

## What High-Risk Actually Requires

The Act's requirements for high-risk AI systems translate into five engineering domains. Each maps directly to practices that reliable systems should have regardless of regulatory requirements.

**Risk management.** A documented risk management process covering the system's entire lifecycle — not a one-time assessment, but an ongoing process that updates as the system changes and as you learn more about its failure modes. This includes identifying risks, estimating their probability and severity, implementing mitigations, and documenting the residual risk after mitigations.

For engineers: this is a structured version of the failure mode analysis that should happen before any critical system ships. The regulatory requirement is that it be documented, maintained, and traceable. That discipline is valuable regardless of whether regulators are asking for it.

**Data governance.** Training data and, for RAG systems, the knowledge base content must meet quality requirements — relevant, representative, free of errors "to the best extent possible," and handled in accordance with GDPR where personal data is involved. The Act requires documented data governance practices covering data collection, labeling, cleaning, and quality assessment.

For RAG systems specifically, this means the stale content problem I wrote about last month isn't just a reliability concern — it's a compliance concern. A knowledge base that contains outdated or incorrect information, used by a high-risk AI system, is a governance failure under the Act.

**Technical documentation.** Before placing a high-risk AI system on the market, you need comprehensive technical documentation covering the system's purpose and design, its performance characteristics, the training data used, testing methodologies and results, and the measures in place for human oversight. This documentation must be kept up to date.

For engineers, this means the documentation burden needs to be built into the development process, not retrofitted before a compliance audit. The kind of documentation the Act requires — system architecture, evaluation methodology, known limitations, human oversight mechanisms — should be artifacts of good engineering practice. The requirement is that they actually exist and be maintained.

**Logging and traceability.** High-risk AI systems must log their inputs and outputs to the extent that post-hoc review is possible. The specifics depend on the system type, but the principle is that decisions the system influences must be auditable — you must be able to reconstruct what the system did and why.

This is the observability requirement I've been writing about since the beginning of the year. For RAG systems, it means logging not just the final output but the retrieval step — what was fetched, what was injected into the context, what the model received. The regulatory version of this requirement is stricter than most current implementations.

**Human oversight.** High-risk AI systems must be designed to allow humans to effectively oversee their operation, intervene when necessary, and override outputs. This means more than a theoretical ability for a human to be in the loop — it means designing the system so that meaningful human oversight is operationally feasible.

This requirement has implications for how AI outputs are surfaced. A system that presents AI-generated decisions as authoritative conclusions, without context about the AI's role and confidence, makes effective human oversight harder in practice even if humans are nominally involved.

## What "Conformity Assessment" Means in Practice

Before a high-risk AI system can be deployed in the EU, it must undergo conformity assessment — essentially a structured process of demonstrating that it meets the Act's requirements. For most high-risk systems, this is a self-assessment process (the provider evaluates against the requirements themselves). For a narrower set of high-risk applications in sensitive areas, third-party assessment is required.

The self-assessment process requires producing the technical documentation, establishing the risk management process, implementing the required logging and oversight mechanisms, and then certifying that the requirements are met. That certification is supported by the documentation — it's not a statement of good intentions, it's a claim that can be verified against records.

For engineering teams, this means the compliance work is primarily documentation and system design work. The Act doesn't require AI systems to be infallible. It requires them to be well-understood, well-documented, and designed with awareness of their risks and limitations.

## The Timeline That Actually Matters

The Act's obligations don't all apply at once. The prohibitions on unacceptable-risk systems took effect in February 2025. The obligations for high-risk systems in Annex I (embedded in regulated products) apply from August 2026. The obligations for other high-risk systems apply from August 2026 as well for new systems, with an extended transition for systems already deployed before that date.

For engineering teams building new AI systems today, the practical implication is that you're building toward requirements that will apply before the system reaches the end of its initial lifecycle. Designing for compliance now — in the system's architecture, not as a retrofit — is significantly less expensive than redesigning after deployment.

## The Useful Reframe

Here's the perspective I've arrived at after reading the Act carefully: its technical requirements are a codification of what reliable enterprise AI should look like anyway.

Risk management, data governance, comprehensive documentation, traceability logging, meaningful human oversight — these aren't bureaucratic impositions on good engineering practice. They are good engineering practice, applied to AI systems operating in contexts where failures have real consequences.

The teams that will find compliance easiest are the ones that were already building reliable systems before the Act came into force. The teams that will find it hardest are the ones that treated reliability as an afterthought and capability as the primary objective.

That's not a coincidence. The Act was written in part by people who had watched AI systems fail in contexts where reliability mattered, and who concluded that the market wasn't going to enforce these standards on its own. Whether or not you agree with the regulatory approach, the underlying diagnosis is accurate.

Building for compliance and building for reliability are, in most respects, the same project.

---

_Next: the concept I've been calling the determinism gap — why probabilistic AI systems require a fundamentally different reliability model than the deterministic systems most enterprise engineering teams are used to building, and what that means in practice._
