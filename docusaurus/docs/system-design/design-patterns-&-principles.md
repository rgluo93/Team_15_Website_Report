---
sidebar_position: 5
---

# Design Patterns & Principles

## Design Patterns

Multiple design patterns were used throughout the project.

### Creational Design Patterns

| Pattern | Explanation | Example |
|---|---|---|
| Singleton | A class has a single instance which is accessible globally. | `ChatService` is instantiated on FastAPI startup and used by functions everywhere. Other singleton classes include `TranslationService`. |
| Dependency Injection | An object has its required dependencies provided by a framework rather than instantiating them itself. | `get_chat_service` functions allow API endpoints to request the chat service singleton as a dependency, rather than hard-coding instantiation inside the routers. |
| Factory | An interface for creating objects is defined, and other objects can call on this interface to create a specific object. | On startup, FastAPI checks environment variables for a preference string and instantiates a different LLM object depending on the value. |

### Structural Design Patterns

| Pattern | Explanation | Example |
|---|---|---|
| Adapter | A bridge is created between two incompatible interfaces so they can transfer data between each other. | `WhatsAppClient` wraps the external WhatsApp Cloud API, which requires specific HTTP headers and complex JSON payloads, and adapts it into a simple Python class with a `send_text_message` method. |
| Facade | A simplified interface is provided for accessing a complex system. | `TranscriptionService` hides the complexity of audio processing. Instead of the caller managing WAV file bytes, audio chunks, and Vosk model states, they simply call `transcribe_audio_file()`. |
| Flyweight | Memory usage is reduced by sharing common objects instead of creating duplicates. | `TranslationService` is initialised once and shared across every tool and API call. |

### Behavioral Design Patterns

| Pattern | Explanation | Example |
|---|---|---|
| State | An object changes its behavior based on its internal state. | LangGraph is a state machine. Each node (function) receives the current state, performs an action, and returns a state update. System behavior changes dynamically based on state values. |
| Observer | A subject publishes notifications to subscribed observers. | The Python logging library uses a single logger call as the subject, and multiple handlers (the observers), such as console output, a log file, or an external monitoring tool, all observe and respond to that event. |

---

## Design Principles

Multiple design principles were followed throughout the project.

| Principle | Explanation | Example |
|---|---|---|
| Keep It Super Simple (KISS) | Emphasises simple design over unnecessarily complex solutions. | FastAPI was chosen because it is lightweight and easier to learn than alternatives like Django, many of whose built-in features are unnecessary for this project. |
| Don't Repeat Yourself (DRY) | Logic should be reused rather than duplicated across a system. | LLM calls with RAG are accessed through a single `llm_response(question, use_rag)` method, rather than manually initialising the LLM API, performing a semantic search, and constructing the prompt each time. |
| Single Responsibility Principle | Every class should have a single, well-defined purpose. | `WhatsAppClient` exclusively handles communication with the WhatsApp Cloud API. |
| Open/Closed Principle | A system should be open for extension but closed for modification. | `ChatService.respond_with_history` supports a `structured_output` parameter, allowing it to return any Pydantic model without changing its internal LLM calling logic. |
| Liskov Substitution Principle | Child classes should be interchangeable with their parent classes. | `AzureAPIError` and `ChatServiceNotInitializedError` both inherit from `AIServiceError` and can be used interchangeably by the `ai_service_exception_handler`. |
| Interface Segregation Principle | Clients should not be forced to depend on methods they do not use. | Specialised dependency functions like `get_whatsapp_client()` allow an endpoint to inject only the services it needs, rather than all available services. |