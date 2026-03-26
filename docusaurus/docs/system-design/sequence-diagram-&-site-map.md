---
sidebar_position: 2
---

# Sequence Diagram & Site Map

## Sequence Diagram

The system is built with a client (browser/mobile app), Laravel backend, FastAPI services, and supporting infrastructure (databases, vector store, and AI services). Each feature follows a request-response pattern where user actions trigger backend processing, often involving AI models and data retrieval, before returning results to the user. Sequence diagrams were built for the following key features:

1. User Progress Summary Generation
 Generates a summary of a user’s learning progress using stored module and performance data, enhanced with AI-generated insights.

``` mermaid
sequenceDiagram
    actor User
    participant App as Browser / Mobile App
    participant Laravel
    participant MySQL
    participant FastAPI
    participant Azure as Azure Foundry (LLM)

    User->>App: Request Progress Summary
    App->>Laravel: POST /dashboard/user-summary
    Laravel->>MySQL: Fetch User Modules & Progress
    MySQL-->>Laravel: User Data (JSON)
    Laravel->>FastAPI: POST /api/v1/user-summary/generate
    FastAPI->>Azure: Generate Summary (Prompt)
    Azure-->>FastAPI: AI-Generated Summary
    FastAPI-->>Laravel: Summary Response
    Laravel-->>App: JSON Response
    App-->>User: Display Summary Report
```

2. AI Chatbot (General Education Assistant)
 Provides interactive support by responding to user queries using conversational history and contextual knowledge retrieval.

```mermaid
sequenceDiagram
    actor User
    participant App as Browser / Mobile App
    participant Laravel
    participant FastAPI
    participant Redis
    participant Qdrant
    participant Azure as Azure Foundry (LLM)

    User->>App: Send Chat Message
    App->>Laravel: POST /dashboard/chatbot
    Laravel->>FastAPI: POST /api/v1/chatbot/chat
    FastAPI->>Redis: Fetch Conversation History
    Redis-->>FastAPI: Last N Messages
    FastAPI->>Qdrant: Retrieve Context
    Qdrant-->>FastAPI: Knowledge Base Context
    FastAPI->>Azure: Generate Response
    Azure-->>FastAPI: AI Response
    FastAPI-->>Laravel: Chat Response
    Laravel-->>App: JSON Response
    App-->>User: Display Chat Bubble
```

3. Personalised Scenario Feedback
 Evaluates user-submitted answers to scenarios and provides structured, AI-generated feedback based on expected solutions and pedagogical context.

```mermaid
sequenceDiagram
    actor User
    participant App as Browser / Mobile App
    participant Laravel
    participant MySQL
    participant FastAPI
    participant Qdrant
    participant Azure as Azure Foundry (LLM)

    User->>App: Submit Scenario Answer
    App->>Laravel: POST /leadnow-module/scenario-ai-feedback
    Laravel->>MySQL: Fetch Scenario Details
    MySQL-->>Laravel: Expert Answer + Metadata
    Laravel->>FastAPI: POST /api/v1/scenario-feedback/generate
    FastAPI->>Qdrant: Retrieve Pedagogical Context
    Qdrant-->>FastAPI: Context Data
    FastAPI->>Azure: Generate Feedback
    Azure-->>FastAPI: AI Feedback
    FastAPI-->>Laravel: Feedback Response
    Laravel-->>App: JSON Response
    App-->>User: Display Feedback
```

4. Education Officer Agent
 An intelligent assistant that can perform multi-step tasks such as querying databases and sending messages (e.g. via WhatsApp), using AI planning and tool execution.

```mermaid
sequenceDiagram
    actor User
    participant App as Browser / Mobile App
    participant Laravel
    participant FastAPI
    participant Azure as Azure Foundry (LLM)
    participant MCP as MCP Server
    participant MySQL

    User->>App: Education Officer Interaction
    App->>Laravel: POST /dashboard/eo-chatbot
    Laravel->>FastAPI: POST /api/v1/eo-agent/chat
    FastAPI->>Azure: Plan (Intent Classification)
    Azure-->>FastAPI: Execution Plan
    FastAPI->>MCP: Call Tool (execute_sql / send_whatsapp)
    MCP->>MySQL: Query Database
    MySQL-->>MCP: Results
    MCP-->>FastAPI: Tool Output
    FastAPI->>Azure: Generate Final Response
    Azure-->>FastAPI: Response
    FastAPI-->>Laravel: Chat Response
    Laravel-->>App: JSON Response
    App-->>User: Display Response
```

5. English to Swahili Translation
 Converts text from English to Swahili using a dedicated translation model served through a tool-based architecture.

```mermaid
sequenceDiagram
    actor User
    participant App as Browser / Mobile App
    participant Laravel
    participant FastAPI
    participant MCP as MCP Server

    User->>App: Request Translation
    App->>Laravel: POST /translate
    Laravel->>FastAPI: POST /api/v1/translate
    FastAPI->>MCP: Call Tool (translate_text)
    MCP->>MCP: Run NLLB Model
    MCP-->>FastAPI: Translated Text
    FastAPI-->>Laravel: Response
    Laravel-->>App: JSON Response
    App-->>User: Display Translation
```

6. Speech-to-Text Transcription
 Converts audio input into written text through backend processing and transcription services.

```mermaid
sequenceDiagram
    actor User
    participant App as Browser / Mobile App
    participant Laravel
    participant FastAPI

    User->>App: Upload Audio
    App->>Laravel: POST /transcribe
    Laravel->>FastAPI: POST /api/v1/speech-to-text/transcribe
    FastAPI->>FastAPI: Process & Transcribe Audio
    FastAPI-->>Laravel: Transcribed Text
    Laravel-->>App: JSON Response
    App-->>User: Display Transcription
```

The components of this sequence diagram are
- User
- Browser / Mobile App (Client)
- Laravel
- FastAPI
- MySQL
- Redis
- Qdrant
- MCP Server
- Azure Foundry (LLM)

Across all features, the system follows a consistent pattern:
1. The user initiates an action via the client.
2. The request is routed through Laravel.
3. FastAPI handles AI-related processing.
4. Supporting systems (MySQL, Redis, Qdrant, MCP) provide data, context, or tools.
5. The LLM generates intelligent output, which is returned through the stack.
6. The response is displayed back to the user.



## Site Map

Below is the site map for a regular user (for example, a teacher) for LeadNow Dignitas. The site map will slightly differ for education officers and admins, however they still follow the general structure of the regular user.

The **Home and Public Access** layer serves as the platform’s entry point, providing essential information through the landing page and public school lists. User management is centralized within the **My Account and Settings** section, which facilitates secure authentication and personal dashboard access. The core value proposition of the platform is delivered through the **Learning Journey**, a comprehensive engine that houses all pedagogical content, AI-driven modules, and progress tracking. To bridge the gap between theory and practice, the **Community and Action** pillar provides a space for peer discussion and the tracking of classroom action plans. Finally, the **Help and Support** layer ensures technical and pedagogical resilience by providing a dedicated channel for direct assistance, primarily through integrated WhatsApp support.

![Site Map](/img/site-map.png)
