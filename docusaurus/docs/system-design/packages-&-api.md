---
sidebar_position: 4
---

# Packages & API

## Packages

The project is organised into the following packages.

```
.dockerignore
.env.api.example
.gitignore
AZURE_SETUP.md
Dockerfile
Dockerfile.mcp
README.md
__init__.py
api/
  __init__.py
  config.py
  dependencies.py
  main.py
  middleware.py
  routers/
    __init__.py
    chatbot.py
    eo_agent.py
    health.py
    scenario_feedback.py
    speech_to_text.py
    translate_text.py
    user_summary.py
    whatsapp.py
docker-compose.yml
education_officer_chat_bot/
  __init__.py
  eo_agent.py
general_chat_bot/
  __init__.py
  chat_bot.py
k8s/
  .gitignore
  QUICK_REFERENCE.md
  README.md
  base/
    configmap.yaml
    fastapi.yaml
    ingress.yaml
    kustomization.yaml
    mcp-server.yaml
    namespace.yaml
    qdrant.yaml
  deploy.ps1
  deploy.sh
langgraph_agent/
  EDUCATION_OFFICER_USAGE_GUIDE.md
  VISUALIZATION_README.md
  __init__.py
  agent.py
  agent_state.py
  coaching_nodes.py
  execution_agent_nodes.py
  general_nodes.py
  mcp_client.py
  planning_agent_nodes.py
  sql_nodes.py
  translation_nodes.py
  utils.py
  visualize_langgraph.py
  whatsapp_nodes.py
  workflow_diagram.mmd
  workflow_diagram.png
  workflow_visualization.html
language_translation/
  __init__.py
  convert_to_onnx.py
  convert_to_openvino.py
  lora_fine_tuning.py
  markdown_translation.py
  merge_lora.py
  translate_en_sw.py
  translation.py
llm_service/
  __init__.py
  api_call.py
  chat_service.py
  redis_history.py
mcp_server/
  __init__.py
  __main__.py
  pyproject.toml
  server_fastmcp.py
  tools/
    __init__.py
    sql_client.py
    sql_tool.py
    translation_tool.py
    whatsapp_tool.py
pyproject.toml
rag/
  PDF_UPLOAD_INSTRUCTIONS.md
  embedding/
    embedding.py
    vector_database_upload.py
  text_chunker/
    pdf_extractor.py
    upload_pdf.py
  utils/
    delete_chunks.py
    semantic_search.py
requirements.txt
research/
  __init__.py
  prompt_engineering/
    general_chat_bot/
      __init__.py
      chain_of_thought.py
      few_shot.py
      meta_prompting.py
      rag.py
      zero_shot.py
    llm_output_data.md
    scenario_based_learning/
      __init__.py
      chain_of_thought.py
      few_shot.py
      meta_prompting.py
      rag.py
      zero_shot.py
    user_summary/
      __init__.py
      chain_of_thought.py
      few_shot.py
      meta_prompting.py
      rag.py
      zero_shot.py
scenario_based_learning/
  __init__.py
  generate_question_feedback.py
schemas/
  __init__.py
  chatbot.py
  common.py
  scenario_feedback.py
  speech_to_text.py
  translate_text.py
  user_summary.py
  whatsapp.py
speech_to_text/
  __init__.py
  test_audio.wav
  transcription_service.py
system-architecture-diagram.png
tests/
  __init__.py
  api/
    __init__.py
    conftest.py
    routers/
      __init__.py
      conftest.py
      test_chatbot.py
      test_eo_agent.py
      test_health.py
      test_scenario_feedback.py
      test_speech_to_text.py
      test_translate_text.py
      test_user_summary.py
      test_whatsapp.py
    test_config.py
    test_dependencies.py
    test_middleware.py
  conftest.py
  education_officer_chat_bot/
    __init__.py
    test_eo_agent.py
  integration/
    __init__.py
    conftest.py
    test_agent_flow.py
    test_api_endpoints.py
    test_chat_flow.py
    test_mcp_integration.py
    test_rag_pipeline.py
  langgraph_agent/
    __init__.py
    conftest.py
    test_agent.py
    test_general_nodes.py
    test_mcp_client.py
    test_message_classifier.py
    test_school_visit_nodes.py
    test_sql_nodes.py
    test_translation_nodes.py
    test_whatsapp_nodes.py
  language_translation/
    __init__.py
    conftest.py
    test_markdown_translation.py
    test_translation.py
  llm_service/
    __init__.py
    conftest.py
    test_chat_service.py
    test_redis_history.py
  mcp_server/
    __init__.py
    conftest.py
    test_sql_client.py
    test_sql_tool.py
    test_translation_tool.py
  rag/
    __init__.py
    conftest.py
    test_delete_chunks.py
    test_pdf_pipeline.py
    test_qdrant_uploader.py
    test_semantic_search.py
    test_text_embedder.py
  schemas/
    __init__.py
    test_schemas.py
  speech_to_text/
    __init__.py
    conftest.py
    test_transcription_service.py
  system/
    chatbot.py
    eo-agent.py
    health.py
    scenario_feedback.py
    test_embeddings.py
    translate_text.py
    user_summary.py
  test_chat_bot.py
  test_generate_question_feedback.py
  test_generate_user_summary.py
  utils/
    __init__.py
    test_errors.py
    test_logger.py
  whatsapp_service/
    __init__.py
    test_whatsapp_client.py
user_summary/
  __init__.py
  generate_user_summary.py
utils/
  __init__.py
  errors.py
  logger.py
whatsapp_service/
  __init__.py
  whatsapp_client.py
```

Each package is responsible for a distinct area of functionality:

- `api`: FastAPI routers, middleware, and entry point
- `education_officer_chat_bot`: chat agent logic for education officers
- `general_chat_bot`: general-purpose conversational chatbot
- `langgraph_agent`: LangGraph-based multi-agent orchestration and workflow
- `language_translation`: English-to-Swahili translation and model fine-tuning
- `llm_service`: LLM API calls, chat service, and conversation history
- `mcp_server`: Model Context Protocol server and tool definitions
- `rag`: document embedding, vector storage, and semantic search
- `research`: prompt engineering experiments across multiple techniques
- `scenario_based_learning`: scenario question generation and feedback
- `schemas`: Pydantic request/response models
- `speech_to_text`: audio transcription service
- `tests`: unit, integration, and system tests
- `user_summary`: user progress summary generation
- `utils`: shared error handling and logging
- `whatsapp_service`: WhatsApp messaging client

## API

The API is built using FastAPI and follows RESTful principles. It consists of the following endpoints:


#### 1. Chatbot & AI Agents

**General Chat & EO Agent**
* **Endpoint:** `POST /api/v1/chatbot/chat` or `POST /api/v1/eo-agent/chat`
* **Request:**
```json
{
  "user_id": "user-123",
  "question": "How do I handle a disruptive classroom?",
  "phone_number": "254712345678"
}
```
* **Response:**
```json
{
  "response": "AI generated coaching advice...",
  "user_id": "user-123",
  "workflow_summary": [
    {
      "step_key": "0",
      "step_description": "Search pedagogy database",
      "summary": "Found 3 relevant teaching modules."
    }
  ]
}
```

---

#### 2. Specialized Feedback & Summaries

**Scenario Feedback**
* **Endpoint:** `POST /api/v1/scenario-feedback/generate`
* **Request:**
```json
{
  "user_id": "user-123",
  "question": "A student refuses to participate. What do you do?",
  "user_answer": "I would ignore them and continue.",
  "expert_answer": "Engage the student privately and offer choice-based tasks."
}
```
* **Response:**
```json
{
  "feedback": "Your approach lacks engagement; try addressing the root cause...",
  "user_id": "user-123"
}
```

**User Summary**
* **Endpoint:** `POST /api/v1/user-summary/generate`
* **Request:**
```json
{
  "user_id": "user-123",
  "user_data": { "progress": "80%", "completed_modules": ["Module A", "Module B"] }
}
```
* **Response:**
```json
{
  "summary": "Teacher has excelled in classroom management...",
  "recommendations": ["Advanced Pedagogy", "Inclusive Learning"],
  "user_id": "user-123"
}
```

---

#### 3. Media & Language Services

**Speech-to-Text (Transcription)**
* **Endpoint:** `POST /api/v1/speech-to-text/transcribe`
* **Request (Multipart):** `file: [binary_audio_data]`
* **Response:**
```json
{
  "text": "The transcribed content from the audio file.",
  "language": "sw",
  "confidence": 0.98
}
```

**Translation**
* **Endpoint:** `POST /api/v1/translate`
* **Request:**
```json
{
  "text": "Habari gani?",
  "target_language": "en"
}
```
* **Response:**
```json
{
  "translated_text": "How are you?"
}
```

---

#### 4. WhatsApp Messaging

**Send Template**
* **Endpoint:** `POST /api/v1/whatsapp/send-template`
* **Request:**
```json
{
  "phone_number": "254712345678",
  "template_name": "welcome_message",
  "components": []
}
```
* **Response:**
```json
{
  "messaging_product": "whatsapp",
  "contacts": [{ "input": "254712345678", "wa_id": "254712345678" }],
  "messages": [{ "id": "wamid.HBgLMjU0Nz..." }]
}
```
