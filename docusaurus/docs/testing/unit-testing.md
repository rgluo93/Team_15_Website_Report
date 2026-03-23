---
sidebar_position: 2
---

# Unit Testing

We conducted unit tests for all major modules of the AI Resource service, organized into subdirectories mirroring the source code structure. This ensured comprehensive test coverage across all service components.

### Unit Testing with pytest


We use **pytest** as our test framework, with **pytest-asyncio** for testing asynchronous functions. The framework supports class-based test organization, fixtures for shared setup, and parametrized tests for covering multiple input variations. Key testing utilities include:


- **`unittest.mock.MagicMock`** — for mocking synchronous dependencies (Redis clients, LLM chains, HTTP responses)
- **`unittest.mock.AsyncMock`** — for mocking async functions (agent workflows, MCP tool calls, EO agent responses)
- **`unittest.mock.patch`** — for replacing module-level imports (Azure OpenAI client, Qdrant client, HuggingFace embeddings)
- **`FastAPI TestClient`** — for testing HTTP endpoints without starting a real server
- **`sys.modules` stubs** — for handling unavailable native packages (pydub, vosk) in CI environments


### Test Results by Module


| Module | Test File(s) | Tests | Description |
|--------|-------------|-------|-------------|
| **Schemas** | `test_schemas.py` | 53 | Pydantic model validation: required fields, defaults, type constraints, edge cases across all 7 schema files |
| **LLM Service** | `test_chat_service.py`, `test_redis_history.py` | 68 | ChatService initialization, LLM invocation, Redis history CRUD, memory management, Prompt validation |
| **LangGraph Agent** | `test_agent.py`, `test_general_nodes.py`, `test_sql_nodes.py`, `test_whatsapp_nodes.py`, `test_translation_nodes.py`, `test_school_visit_nodes.py`, `test_message_classifier.py`, `test_mcp_client.py` | 124 | Agent workflow, node functions, message classification, SQL generation, MCP tool calls, routing logic |
| **API Routers** | `test_chatbot.py`, `test_eo_agent.py`, `test_health.py`, `test_scenario_feedback.py`, `test_text_to_speech.py`, `test_translate_text.py`, `test_user_summary.py`, `test_whatsapp.py` | 86 | All endpoint request/response cycles: health, chatbot, EO agent, user summary, scenario feedback, speech-to-text, translation, WhatsApp |
| **API Config & Middleware** | `test_config.py`, `test_middleware.py`, `test_dependencies.py` | 51 | Settings validation, CORS parsing, API key verification, singleton dependencies, Redis session counting |
| **RAG Pipeline** | `test_pdf_pipeline.py`, `test_qdrant_uploader.py`, `test_semantic_search.py`, `test_text_embedder.py`, `test_delete_chunks.py` | 91 | PDF chunking, vector upload, semantic search, embedding, chunk deletion |
| **MCP Server** | `test_sql_client.py`, `test_sql_tool.py`, `test_translation_tool.py` | 61 | SQL client operations, MCP tool registration, translation tool singleton |
| **Utils** | `test_errors.py`, `test_logger.py` | 40 | Custom exceptions, exception handlers, JSON log formatting |
| **Language Translation** | `test_translation.py`, `test_markdown_translation.py` | 25 | Translation service, markdown-aware translation, direction validation |
| **WhatsApp Service** | `test_whatsapp_client.py` | 22 | WhatsApp Cloud API client, template messages, payload construction, error handling |
| **Speech-to-Text** | `test_transcription_service.py` | 18 | Vosk model loading, audio processing, transcription, format validation |
| **Education Officer** | `test_eo_agent.py` | 5 | Async agent wrapper delegation, argument passing, error propagation |