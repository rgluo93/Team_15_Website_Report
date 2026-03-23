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