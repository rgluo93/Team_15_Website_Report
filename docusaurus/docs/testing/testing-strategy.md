---
sidebar_position: 1
---

# Testing Strategy


Testing is a critical phase in software development, ensuring that the application functions as intended, handles edge cases gracefully, and maintains reliability as the codebase evolves. For our project, we chose a comprehensive set of testing strategies to address different aspects of the AI Resource for LeadNow. The methods we chose are Unit Testing, Integration Testing, and Validation Testing. They test all of the new implementations, including the LLM chatbot, RAG pipeline, LangGraph agent, MCP tools, translation, speech-to-text, and WhatsApp messaging.


## Why These Testing Methods?


Below is an overview of the testing methods we employed and why they are suitable for our project. AI-powered backend services are inherently multi-layered, requiring a combination of isolated component testing and cross-system validation to ensure quality. Our testing approach was designed to cover both the functional and non-functional aspects of the service, ensuring that all features work as intended while also delivering reliable responses to end users.


| Reason | Explanation |
|--------|-------------|
| The service is a multi-layered system | The LeadNow AI Resource involves complex interactions between API routers, LLM services, vector databases, Redis memory, MCP tool servers, and external APIs (WhatsApp, Azure OpenAI, Google Gemini). Unit Testing and Integration Testing help ensure that each component works correctly in isolation and when combined with others. |
| External dependencies must be isolated | The service depends on paid APIs (Azure OpenAI, Google Gemini), infrastructure (Redis, Qdrant), and third-party services (WhatsApp Cloud API). Mock-based testing ensures tests are fast, deterministic, and free to run without requiring live credentials or services. |
| Data validation is safety-critical | Incorrect SQL queries, malformed WhatsApp messages, or invalid translation directions could cause downstream failures or unintended side effects. Validation Testing ensures Pydantic schemas and parameter constraints catch bad input before it reaches external systems. |


## Web App Testing Statistics

| Metric | Value |
|--------|-------|
| **Total Tests** | **698** |
| **Unit Tests** | 644 |
| **Integration Tests** | 54 |
| **Test Files** | 44 |
| **Source Modules Covered** | 15/15 |
| **Test Framework** | pytest + pytest-asyncio |
| **Execution Time** | ~8.5 seconds |