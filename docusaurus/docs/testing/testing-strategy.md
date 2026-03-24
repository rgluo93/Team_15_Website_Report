---
sidebar_position: 1
---

# Testing Strategy


Testing is a critical phase in software development, ensuring that the application functions as intended, handles edge cases gracefully, and maintains reliability as the codebase evolves. For our project, we chose a comprehensive set of testing strategies to address different aspects of the AI Resource for LeadNow. The methods we chose are Unit Testing, Integration Testing, and User Acceptance Testing. They test all of the new implementations, including the LLM chatbot, RAG pipeline, LangGraph agent, MCP tools, translation, speech-to-text, and WhatsApp messaging.


## Why These Testing Methods?


Below is an overview of the testing methods we employed and why they are suitable for our project. AI-powered backend services are inherently multi-layered, requiring a combination of isolated component testing and cross-system validation to ensure quality. Our testing approach was designed to cover both the functional and non-functional aspects of the service, ensuring that all features work as intended while also delivering reliable responses to end users.


| Testing Method | Explanation |
|----------------|-------------|
| Unit Testing | The LeadNow AI Resource involves many components including LLM services, vector databases, MCP tool servers, external APIs, and more. Unit Testing helps ensure that each component works correctly in isolation. |
| Integration Testing | The new AI capabilities involve many interactions between multiple complex components. Integration Testing helps ensure that each component works correctly when combined with others. |
| System Testing | With the AI Resource deployed as a live service on the cloud, System Testing validates the behaviour of the fully deployed system end-to-end, including API availability, response correctness under real network conditions, and overall system stability. |
| User Acceptance Testing | Most importantly, for the LeadNow AI Resource to be useful, it must be usable, intuitive, and easy to adopt for teachers in Kenya. We conducted User Acceptance Testing to ensure this and also identify possible improvements. |


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