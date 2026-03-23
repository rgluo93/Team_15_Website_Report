---
sidebar_position: 2
---

# MoSCoW Completion
Here's implementation result against the MoSCoW requirements.

## Must have 
- ✅ **Teacher chatbot for remote training support**
- ✅ **Performance summary report with next-step recommendations**
- ✅ **Personalized scenario feedback**
- ✅ **Cost-aware LLM baseline** (current setup favors lower-cost model defaults)

## Should have 
- ✅ **Education officer agent**
  - ✅ school visit planning
  - ✅ teacher/school performance review via data workflows
  - ✅ WhatsApp messaging actions
  - ✅ multi-step agent execution flow
- ✅ **Speech-to-text capability** (API-level support is in place)
- ✅ **Dockerized setup** (Dockerfiles and compose workflow available)

## Could have 
- ✅ **English ↔ Swahili translation popup**
- ✅ **Kubernetes deployment**
  - As an alternative deployment option as LeadNow scales up

## Won’t have 
- 🚫 **Very large/expensive LLMs as default**
- 🚫 **Translation popup for all languages**
- 🚫 **AI-assisted scenario answer generation**
- 🚫 **Third-party educational content database**