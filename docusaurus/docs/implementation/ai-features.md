---
sidebar_position: 5
---

# AI Features Implementation

The LeadNow platform offers AI features built on top of the Core LLM Service to help with specific tasks, which are the general chatbot, generating user summaries and scenario-based learning problem feedback. They make use of the LLM to provide relevant responses in different contexts and are accessible via FastAPI endpoints.

For details on ChatService see the [Core LLM Service](core-llm-service.md) page, which covers prompt templates, call pipelines, RAG and history management.

## General guidance (shared concepts)

All three features share a common set of building blocks:

 - `ChatService`: central API for calling LLMs, managing conversation history, and optionally using RAG (see the Core LLM Service documentation).
 - `Prompt` objects: small value objects that hold a `system_prompt` and a `user_prompt` template.
 - RAG (Qdrant + embeddings): features that need grounded context call the vector store to retrieve relevant documents (see Core LLM Service and RAG documentation).
 - Conversation storage (Redis): short-lived chat histories are stored via `RedisHistory` and used to preserve multi-turn context (see the Core LLM Service documentation).

When reading the code for each feature, note whether the feature uses `respond_with_history` (session + optional RAG) or `respond_with_json_input` (structured JSON inputs, typically no history unless specifically passed).

---

## General Chat Bot

**Purpose:** a general-purpose Q&A assistant for LeadNow content. It answers user questions, drawing on the knowledge base (RAG) when appropriate, and preserves session context for multi-turn conversations.

**Implementation highlights:**
- Uses `ChatService.respond_with_history(...)` with `use_rag=True` to retrieve relevant documents and inject them into the prompt.
- Stores and refreshes short-term conversation history in Redis to support multi-turn dialogues.


```python
from utils.logger import logger
from llm_service.chat_service import ChatService, Prompt


def get_general_chat_response(user_id: str, user_question: str, chat_service: ChatService) -> str:

    system_prompt = f"""

        You are an assistant for LeadNow, an educational app for coaching teachers on how to teach effectively in Kenyan classrooms.
        Your job is to answer any generic questions the user might have about LeadNow and the content of LeadNow.
        Respond in a friendly manner as if you are an instructor for LeadNow.

        Use the context provided as it is relevant to LeadNow from pdfs, documents, and other learning materials.
        Include the context in your answers where appropriate.

    """

    human_prompt = """

    User name: {user_id}. User question: {user_question}

    """
    prompt = Prompt(system_prompt, human_prompt)
    response = chat_service.respond_with_history(
        user_id=user_id,
        service_id="general_chat_bot",
        prompt=prompt,
        question=user_question,
        use_rag=True,
    )
    return response
```

**Notes & tips:**
- The `service_id` (`"general_chat_bot"`) is used to namespace stored history in Redis.
- Because `use_rag=True`, the underlying chain will retrieve top‑k documents from Qdrant and inject them into the system prompt before the LLM call. See the RAG page for how documents are indexed and what metadata is stored.
- Use short system prompts focused on role and persona; keep retrieval context distinct from the system prompt (the ChatService layering does this by appending a `Context from knowledge base` section).

---

## User Summaries

**Purpose:** produce a concise, structured progress summary for a teacher based on their completed modules, topics covered, and engagement indicators. The output follows a strict markdown format so it can be displayed directly in the app or sent over messaging channels.

**Implementation highlights:**
- Uses `respond_with_json_input(...)` to pass a JSON payload containing the user's progress data.
- The system prompt enforces an exact response structure (headings, phrasing, and sections) so downstream consumers can rely on a predictable format.


```python
from llm_service.chat_service import ChatService, Prompt


def get_user_summary(user_id: str, user_details: dict[str, str], chat_service: ChatService) -> str:
    
    system_prompt = """You are an assistant for LeadNow, an educational app for coaching teachers \
on how to teach effectively in Kenyan classrooms. You will be given a teacher's progress data \
including modules completed, topics covered, and additional details about their interactions.

You must follow the response structure below exactly. Use the exact section headings and opening \
phrases shown. Fill in the bracketed placeholders with your own analysis.

... (prompt continues with required response structure) ...
"""

    human_prompt = """

    Modules completed and date: {modules_completed}.
    Topics covered: {topics_covered}.
    All modules: {all_modules}.
    Additional details: {additional_details}.

    Generate a well-formatted summary of the user's progress and suggest next steps for their learning journey.
    Use markdown formatting with **bold text** for headers and emphasis.

    """

    prompt = Prompt(system_prompt, human_prompt)
    response = chat_service.respond_with_json_input(
        user_id=user_id,
        service_id="user_summary_generator",
        prompt=prompt,
        input_dict=user_details
    )
    return response
```

**Example input (python dict):**

```python
user_details = {
    "user_id": "James",
    "modules_completed": "Module 1 on Classroom Management (completed on 2024-01-15), Module 2 on Student Engagement (completed on 2024-02-10)",
    "topics_covered": "Classroom Management, Student Engagement",
    "all_modules": "Module 1: Classroom Management, Module 2: Student Engagement, Module 3: Assessment Strategies, Module 4: Inclusive Education",
    "additional_details": "James has actively participated in quizzes and discussions."
}
```

**Notes & tips:**
- Because the system prompt enforces exact headings and text patterns, minor prompt edits can break downstream expectations; test any prompt changes against sample inputs.
- `respond_with_json_input` is useful when the prompt expects named variables (the `input_dict` keys are mapped into the human prompt template).

---

## Scenario-Based Learning (Question Feedback)

**Purpose:** evaluate a teacher's open response to a scenario question and provide constructive feedback, using a step-by-step internal reasoning process to reach a grounded, teacher-facing feedback message.

**Implementation highlights:**
- Uses an internal chain-of-thought (CoT) style reasoning followed by a delimiter (`===FEEDBACK===`) to separate internal reasoning from the public feedback. The LLM is instructed to output internal analysis first, then the delimiter, and finally the feedback which is intended for the teacher.
- Uses `respond_with_json_input` with `use_rag=True` to ground the evaluation in retrieved context where available.


```python
REASONING_DELIMITER = "===FEEDBACK==="


def generate_question_feedback(user_id: str, question_details: dict[str, str], chat_service: ChatService) -> str:

    system_prompt = """You are an expert educational coach for LeadNow...\n\nFollow this reasoning process:\n\nStep 1: UNDERSTAND...\nStep 2: ANALYZE...\nStep 3: COMPARE...\nStep 4: CONNECT...\n\nAfter completing Steps 1-4, output the delimiter """ + REASONING_DELIMITER + """ on its own line, then write your final feedback..."""

    human_prompt = """Scenario Question: {question}\nYour Answer: {user_answer}\nExpert Answer: {expert_answer}\n\nThink through Steps 1-4, then output """ + REASONING_DELIMITER + """ and provide your feedback."""

    prompt = Prompt(system_prompt, human_prompt)
    response = chat_service.respond_with_json_input(
        user_id=user_id,
        service_id="question_feedback_generator",
        prompt=prompt,
        input_dict=question_details,
        use_rag=True,
    )

    if REASONING_DELIMITER in response:
        response = response.split(REASONING_DELIMITER, 1)[1].strip()

    return response
```

**Why the delimiter pattern matters:**
- The delimiter explicitly separates internal chain-of-thought (which should not be shown to the end user) from the final teacher-facing feedback.
- The code strips all content before the delimiter so only the intended output is served.

**Notes & tips:**
- Keep the public feedback concise and actionable (the system prompt enforces the final structure: Strengths, Areas for Improvement, Recommendations).
- Using `use_rag=True` allows the model to reference specific evidence (documents) retrieved from the knowledge base to justify recommendations.

---
