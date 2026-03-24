---
sidebar_position: 6
---

# MoSCoW Requirements List
The requirements were defined based on the needs and approved add ons from the Dignitas team

## Must have
- **Teacher chatbot for remote training support**
  - Answer teacher questions about training content and progress.
  - Provide context-aware responses (not static FAQ-only responses).
- **Performance summary report with next-step recommendations**
  - Generate teacher progress summaries and recommended follow-up actions.
- **Personalized scenario feedback**
  - Return tailored feedback based on teacher input and expected expert answers.
- **Cost-aware LLM baseline**
  - Default to practical, lower-cost model choices for production reliability and scale.

## Should have
- **Education officer agent (multi-capability assistant)**
  - Works as a chatbot and task agent for:
    1. planning school visits,
    2. reviewing teacher performance across schools/cohorts,
    3. sending WhatsApp messages.
  - Also supports multi-step execution where one request can chain tasks.
- **Speech-to-text in relevant workflows**
  - Enable voice input where typing is limiting (for example, scenario-related input and agent interactions).
- **Dockerized local/runtime setup**
  - Maintain Docker files and compose flow for consistent local/dev execution.

## Could have
- **English ↔ Swahili translation popup**
  - Lightweight translation assist focused on teacher and officer workflows.
- **Kubernetes deployment hardening**
  - Production-ready deployment patterns (replicas, scaling, secrets, ingress).

## Won’t have (this phase)
- **Very large/expensive LLMs**
  - No premium, high-cost model tier as default for this release.
- **Translation popup for all languages**
  - Translation scope remains focused (English and Swahili only).
- **AI-assisted scenario answer generation**
  - Users provide their own responses; AI focuses on feedback quality.
- **Third-party educational content database**
  - No external paid/third-party curriculum content ingestion in this phase.
