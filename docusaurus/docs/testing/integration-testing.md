---
sidebar_position: 3
---

# Integration Testing

Due to the multi-layered nature of the AI Resource service, there are frequent interactions between API routers, dependency injection, LLM services, agent workflows, and external tool calls. Therefore, we also performed integration tests to ensure these interactions function correctly. They validate interactions like dependency injection, state passing, error propagation, and response formatting.

### Test Results by Integration Area


| Integration Area | Test File | Tests | Flow Tested |
|-----------------|-----------|-------|-------------|
| **RAG Pipeline** | `test_rag_pipeline.py` | 7 | Chunks → QdrantUploader → upload → SemanticSearcher → search with score filtering |
| **Chat Flow** | `test_chat_flow.py` | 13 | User question → ChatService → Redis history → LLM chain → response; memory CRUD; Prompt validation |
| **Agent Workflow** | `test_agent_flow.py` | 11 | Message → classify → route → execute node → response; all 6 routing paths; GeneralAgent.chat() end-to-end |
| **API Endpoints** | `test_api_endpoints.py` | 7 | HTTP request → FastAPI router → dependency injection → service call → StandardResponse; shared dependencies across routers; error propagation (500, 422) |
| **MCP Integration** | `test_mcp_integration.py` | 16 | Parameter validation → tool call → MCP server communication; Pydantic constraint enforcement; convenience function delegation |

## Web App Integration Testing

For the web application, integration tests validate full frontend feature flows by combining UI interactions, request payload construction, API response parsing, and UI state updates.

### Frontend Integration Test Results

| Integration Area | Test File | Flow Tested |
|------------------|-----------|-------------|
| **Teacher Chat Flow** | `chat-flow.spec.js` | Message send/receive cycle, typing indicator, send button state, CSRF headers, error fallbacks |
| **Clear History Flow** | `clear-history-flow.spec.js` | Clear-history API call, modal confirmation path, UI reset and empty state |
| **EO Agent Flow** | `eo-agent-flow.spec.js` | EO endpoint calls, workflow summary rendering, step sorting, collapsible thought-process panel |
| **Session Flow** | `session-flow.spec.js` | Session-scoped conversation behavior and payload consistency |
| **Speech Flow** | `speech-flow.spec.js` | Speech capture flow integration with chat input and sending pipeline |

### Frontend Integration Testing Approach

- Test runtime: Jest + jsdom.
- API transport is mocked via `fetch` mocks to validate client behavior deterministically.
- DOM assertions verify rendered output and interaction side effects.
- Integration tests are executed with `npm run test:integration`.

### Laravel Feature Test Harness

Laravel feature/integration testing is configured under the `Feature` suite in `phpunit.xml`.

- Suite location: `tests/Feature`
- Current baseline file in repo: `tests/Feature/ExampleTest.php`
- Execution command: `php artisan test --testsuite=Feature`
