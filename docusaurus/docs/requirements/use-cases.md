---
sidebar_position: 5
---

# Use Cases

## Use Case Diagram

![Use Case Diagram](/img/requirements-use-case.png)

---

## Actors

| Actor | Description |
|-------|-------------|
| **Client** | A LeadNow programme participant accessing the web application to practice scenarios, chat with the AI and generate summaries. |
| **Education Officer (EO)** | A LeadNow staff member who uses the EO Agent to query programme data and generate planning documents. |
| **WhatsApp User** | A user interacting with LeadNow via WhatsApp messaging, routed through the LeadNow WhatsApp number. |

---

## Use Cases

### General Chatbot

| Field | Detail |
|-------|--------|
| **Actor** | Client |
| **Description** | The client sends a message to the AI chatbot and receives a contextually relevant response. |
| **Includes** | • Perform Semantic Search: the chatbot always retrieves relevant knowledge base content to ground its response. |
| **Extensions** | • Transcribe Audio: the client may submit a voice message instead of text.<br/>• Translate Text (Mobile): the response may be translated into the client's preferred language. |

---

### Clear Chat History

| Field | Detail |
|-------|--------|
| **Actor** | Client |
| **Description** | The client clears their current conversation history, resetting the chatbot context. |

---

### Input Scenario Responses

| Field | Detail |
|-------|--------|
| **Actor** | Client |
| **Description** | The client submits responses to a scenario-based learning page. |
| **Extensions** | • Transcribe Audio: the client may speak their response rather than type it.<br/>• Get AI Scenario Feedback: after submission, the system may generate AI-powered feedback on the response. |

---

### Get AI Scenario Feedback

| Field | Detail |
|-------|--------|
| **Actor** | Client (via Input Scenario Responses) |
| **Description** | The system analyses both the client's scenario response and the hardcoded Expert Feedback text, then provides structured AI feedback. |
| **Includes** | • Perform Semantic Search: retrieves relevant leadership knowledge to contextualise the feedback. |
| **Extensions** | • Translate Text (Mobile): feedback may be translated into the client's preferred language. |

---

### Generate User Summary

| Field | Detail |
|-------|--------|
| **Actor** | Client |
| **Description** | The system generates a summary of the client's progress, achievements and recommended next steps. |
| **Extensions** | • Translate Text (Mobile): the summary may be translated into the client's preferred language. |

---

### Translate Text (Web)

| Field | Detail |
|-------|--------|
| **Actors** | Client, Education Officer |
| **Description** | The user highlights text on the web application, a popup appears with a translate button, and clicking it displays the translated Swahili text. |

---

### Transcribe Audio

| Field | Detail |
|-------|--------|
| **Actor** | Client (via General Chatbot or Input Scenario Responses) |
| **Description** | The user clicks a record button to capture live audio, which the system transcribes into text and processes as a standard text input. |

---

### Translate Text (Mobile)

| Field | Detail |
|-------|--------|
| **Actor** | Client (via General Chatbot, Get AI Scenario Feedback, or Generate User Summary) |
| **Description** | AI-generated responses are translated into Swahili on the mobile interface via a translate button. |

---

### EO Agent Chat

| Field | Detail |
|-------|--------|
| **Actor** | Education Officer |
| **Description** | The Education Officer interacts with a dedicated AI agent to query programme data, retrieve participant insights, generate planning documents and more. |
| **Includes** | • Langgraph Agent: all EO Agent interactions are orchestrated through the multi-step Langgraph agent pipeline. |

---

### LeadNow WhatsApp Number

| Field | Detail |
|-------|--------|
| **Actor** | WhatsApp User |
| **Description** | A user sends a WhatsApp message to the LeadNow number. The system receives the message and routes it to the Langgraph agent for processing. |
| **Includes** | • Langgraph Agent: all incoming WhatsApp messages are handled by the Langgraph agent pipeline. |

---

### Langgraph Agent

| Field | Detail |
|-------|--------|
| **Actor** | System (invoked by EO Agent Chat or LeadNow WhatsApp Number) |
| **Description** | A multi-step orchestration agent that coordinates tool usage to fulfil complex requests. It selects and invokes the appropriate tools based on the user's intent. |
| **Extensions** | • Perform Semantic Search: optionally retrieves relevant documents from the knowledge base.<br/>• Send WhatsApp Message: optionally sends a reply back to a WhatsApp user.<br/>• Run SQL Query: optionally queries the programme database.<br/>• Translate Response: optionally translates the final response.<br/>• Generate Planning Documents: optionally produces structured planning artefacts for the Education Officer. |

---

### Perform Semantic Search

| Field | Detail |
|-------|--------|
| **Actor** | System |
| **Description** | The system performs a vector similarity search over the LeadNow knowledge base (RAG) to retrieve the most relevant content for a given query. Used across the chatbot, scenario feedback and the Langgraph agent. |

---

### Send WhatsApp Message

| Field | Detail |
|-------|--------|
| **Actor** | System (via Langgraph Agent) |
| **Description** | The Langgraph agent sends a reply message back to the originating WhatsApp user via the WhatsApp Business API. |

---

### Run SQL Query

| Field | Detail |
|-------|--------|
| **Actor** | System (via Langgraph Agent) |
| **Description** | The Langgraph agent executes a structured SQL query against the programme database to retrieve participant or programme data. |

---

### Translate Response

| Field | Detail |
|-------|--------|
| **Actor** | System (via Langgraph Agent) |
| **Description** | The Langgraph agent translates a generated response into the target user's language before delivering it. |

---

### Generate Planning Documents

| Field | Detail |
|-------|--------|
| **Actor** | System (via Langgraph Agent) |
| **Description** | The Langgraph agent produces structured planning documents (e.g., session plans, participant reports) based on programme data, for use by the Education Officer. |
