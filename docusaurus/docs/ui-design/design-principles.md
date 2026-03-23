---
sidebar_position: 1
---

# Design Principles

This document defines the guiding principles used to design LeadNow frontend AI experiences across chat, summaries, translation, speech input, and scenario feedback.

## 1. Embedded Assistance

AI should appear inside existing learning workflows, not as a separate destination.

- Place AI controls where users already make decisions (dashboard, scenario, reflection views).
- Reduce context-switching by keeping prompts, answers, and actions in one screen.
- Treat AI as a support layer, not a replacement for the core task UI.

## 2. Low-Friction Interaction

AI entry and usage should require minimal effort.

- Use visible and predictable entry points (floating chat trigger, inline utility actions).
- Keep input patterns lightweight: short text input, one-click send, microphone shortcut.
- Prefer progressive disclosure over complex upfront forms.

## 3. Transparent Intelligence

Where AI output affects instructional decisions, show how the output was formed.

- Provide explainability views (for EO workflows) when intermediate reasoning is available.
- Break complex outputs into readable steps rather than long unstructured text.
- Distinguish system reasoning metadata from final user-facing guidance.

## 4. Explicit System State

Users should always know what the AI system is doing.

- Represent empty, loading, typing, success, and error states explicitly.
- Avoid silent failures; always provide actionable fallback messaging.
- Include reversible actions for destructive flows (for example, clear-history confirmation).

## 5. Human-Readable Output

AI responses should be easy to scan and use in practice.

- Render long-form AI content in structured blocks/cards.
- Preserve hierarchy (title, key points, detail) to support quick comprehension.
- Prioritize readability over density in educational contexts.

## 6. Accessibility and Inclusion

AI interaction should support varied language and input preferences.

- Offer speech-to-text as an equivalent input path, not an advanced-only feature.
- Provide in-context translation instead of forcing users into separate translation screens.
- Keep assistive controls close to the affected content area.

## 7. Trust Through Control

Users should remain in control of AI conversation and generated content.

- Provide visible controls for closing, resetting, and retrying interactions.
- Keep user-owned context (like chat history and summaries) manageable from the UI.
- Ensure AI feedback is presented as guidance within the learning flow.

## 8. Consistent Cross-Feature Patterns

Shared interaction rules improve learnability and reduce cognitive load.

- Reuse common UI primitives across AI features (modal shell, feedback block, status area).
- Keep action semantics consistent (`send`, `translate`, `record`, `clear`).
- Align tone and microcopy across participant and EO interfaces.

## 9. Principle-to-Feature Mapping

| Frontend AI Feature | Primary Principles Applied |
|---|---|
| Participant/EO Chat | Embedded Assistance, Low-Friction Interaction, Explicit System State |
| EO Explainability Panel | Transparent Intelligence, Human-Readable Output |
| AI Summary Card | Human-Readable Output, Explicit System State, Trust Through Control |
| Translation Popup | Accessibility and Inclusion, Low-Friction Interaction |
| Speech-to-Text Input | Accessibility and Inclusion, Low-Friction Interaction |
| Scenario Expert Feedback | Transparent Intelligence, Human-Readable Output, Trust Through Control |

## 10. Practical Review Checklist

Use this checklist when adding or changing frontend AI UI:

- Is AI embedded in the user’s current task flow?
- Is the entry point immediate and discoverable?
- Are loading/typing/error states visible?
- Is the output structure easy to scan?
- Are speech/translation pathways available where relevant?
- Can users clear, close, or retry without confusion?


