---
sidebar_position: 2
---

# Unit Testing

## Web App

We conducted unit tests for all major modules of the AI Resource service, organised into subdirectories mirroring the source code structure. This ensured comprehensive test coverage across all service components.

### Unit Testing with pytest


We use **pytest** as our test framework, with **pytest-asyncio** for testing asynchronous functions. The framework supports class-based test organisation, fixtures for shared setup, and parametrized tests for covering multiple input variations. Key testing utilities include:


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

## Mobile

The tests focus on the AI functionalities implemented in the LeadNow mobile application.

### Test Coverage by File

| File | Coverage |
|------|---------|
| `ai_chatbot_service.dart` | 100% |
| `ai_user_summary_service.dart` | 100% |
| `ai_scenario_feedback_service.dart` | 100% |
| `ai_speech_to_text_service.dart` | 100% |
| `ai_translation_service.dart` | 100% |
| `home_view_model.dart` | 99% |
| `chatbot_view.dart` | 95% |
| `chatbot_view_model.dart` | 74% |
| `alert_service.dart` | 67% |

### Testing Patterns

- **Mockito with @GenerateMocks** and code generation for mocking services
- **MockClient** from `package:http/testing.dart` to mock HTTP responses in service tests
- **registerServices() / locator.reset()** in `setUp` and `tearDown`
- **`Completer<T>` pattern** to control async timing in widget tests
- **testWidgets** to verify UI state, not just unit behaviour
- Direct instantiation of `AlertService()` to test private dialog widgets
- `tester.binding.setSurfaceSize()` to prevent layout overflow in widget tests

### Key Test Coverage

- **`ai_chatbot_service.dart`**: Covers `sendMessage` and `clearHistory`, including error handling
- **`ai_user_summary_service.dart`**: Covers `generateUserSummary`, including error handling
- **`ai_scenario_feedback_service.dart`**: Covers `generateScenarioFeedback`, including error handling
- **`ai_speech_to_text_service.dart`**: Covers `transcribeAudio`, including error handling
- **`ai_translation_service.dart`**: Covers `translateText`, `clearTranslationCache` and cache size tracking
- **`home_view_model.dart`**: Covers summary generation, translation toggle, caching, navigation and user data refresh
- **`chatbot_view_model.dart`**: Covers message flow, clear history, translation toggle, caching
- **`chatbot_view.dart`**: Covers UI elements, offline banner, input area, translation button, loading indicator
- **`alert_service.dart`**: Covers AI feedback generation, button states, spinners, translation toggle (non-AI methods not tested)

### Testing Limitations

- **`chatbot_view_model.dart`**: The `startRecording` and `stopRecording` methods instantiate `Record()` directly, which requires real microphone permissions and cannot be tested.
- **`chatbot_view.dart`**: Microphone and recording UI elements, such as buttons and waveform, are tied to the real `Record` instance, preventing simulation in tests.
- **`home_view.dart`**: Uses localisation (`S.of(context)`), `CachedNetworkImage`, `Marquee` and `DigDrawer`, all of which do not function in the test environment.
- **`alert_service.dart`**: Only `feedbackDialog` was tested as part of this refactor (it uses the AI feedback and translation services). The non-AI methods were out of scope and were untested.
- **General limitations**: Platform channels (mic, camera), localisation, third-party widgets and direct instantiation of services limit testability and mockability.
