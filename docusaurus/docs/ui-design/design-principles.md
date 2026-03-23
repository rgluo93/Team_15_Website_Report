---
sidebar_position: 1
---

# Design Principles

The guiding principles used to design LeadNow frontend AI experiences across chat, summaries, translation, speech input, and scenario feedback.

## 1. Embedded Assistance

AI should be embedded into existing learning workflows, not as a separate destination.

- Place AI controls where users already make decisions (dashboard, scenario, reflection views).
- Reduce context-switching by keeping prompts, answers, and actions in one screen.
- Treat AI as a support layer, not a replacement for the core learning experience.

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

## Principle-to-Feature Mapping

| Frontend AI Feature | Primary Principles Applied |
|---|---|
| Teacher/EO Chat | Embedded Assistance, Low-Friction Interaction, Explicit System State |
| EO Thought Process | Transparent Intelligence, Human-Readable Output |
| Teacher Summary Card | Human-Readable Output, Explicit System State, Trust Through Control |
| Translation Popup | Accessibility and Inclusion, Low-Friction Interaction |
| Speech-to-Text Input | Accessibility and Inclusion, Low-Friction Interaction |
| Scenario Expert Feedback | Transparent Intelligence, Human-Readable Output, Trust Through Control |

