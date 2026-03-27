---
sidebar_position: 1
---

# Testing Strategy

This strategy ensures both the AI Resource, the web application and mobile app are reliable, maintainable, and usable in real conditions.

## AI Resource Testing Strategy

The AI Resource includes the LLM chatbot, RAG pipeline, LangGraph agent, MCP tools, translation, speech-to-text, and WhatsApp messaging. We use layered testing to validate isolated logic, cross-component behaviour, full deployment flows, and user-level usability.

| Testing Method | Purpose |
|----------------|---------|
| Unit Testing | Validates individual functions/services in isolation (for example LLM adapters, tool wrappers, and utility logic). |
| Integration Testing | Verifies interactions between components (for example API, Redis, vector DB, and tool orchestration). |
| System Testing | Validates end-to-end behaviour in deployed/cloud-like conditions, including API availability and response correctness. |
| User Acceptance Testing | Confirms the workflows are practical and intuitive for teachers and education officers. |

## AI Resource Testing Statistics

| Metric | Value |
|--------|-------|
| **Total Tests** | **698** |
| **Unit Tests** | 644 |
| **Integration Tests** | 54 |
| **Test Files** | 44 |
| **Source Modules Covered** | 15/15 |
| **Test Framework** | pytest + pytest-asyncio |
| **Execution Time** | ~8.5 seconds |

## Web App Testing Strategy

The web app is tested using frontend unit tests, frontend integration tests and browser E2E tests

| Web App Layer | Tools | Scope |
|---------------|-------|-------|
| Frontend Unit Testing | Jest + jsdom + Testing Library | Isolated UI/component logic in `resources/js/chat-module.js` |
| Frontend Integration Testing | Jest + mocked `fetch` + DOM fixtures | End-to-end frontend flows from input to rendered response, with API interactions mocked |
| Browser E2E Testing | Playwright | Role-based user journeys in a real browser against the running Laravel app |

### Web App Test Locations

- Frontend unit tests: `resources/tests/unit`
- Frontend integration tests: `resources/tests/integration`
- Browser E2E tests: `e2e`

### Web App Test Commands

- `npm run test:unit`
- `npm run test:integration`
- `npm run test:e2e`
- `npm run test:e2e:eo`
- `npm run test:e2e:teacher`
- `php artisan test`
