---
sidebar_position: 4
---

# Core LLM Service

The AI functionality within LeadNow is designed to deliver personalised learning experiences, automated insights, and intelligent conversational support. The implementation leverages state-of-the-art language models, retrieval-augmented generation (RAG) pipelines, and custom agent workflows.

## Key Technologies and Libraries
The AI implementation relies mainly on the following technologies:
- LangChain
  LangChain is a library that provides powerful abstractions for prompt management, message history, LLM orchestration, and document handling. Its integration enables modular, maintainable, and extensible AI workflows across the platform.
- Redis
- Qdrant

The `llm_service` module is the core component responsible for managing all interactions with large language models (LLMs) within LeadNow. It provides a unified interface for generating responses, managing conversation history, and supporting retrieval-augmented generation (RAG) workflows. The design emphasizes modularity, extensibility, and robust context management.

## Chat Service

The core logic is encapsulated in the `ChatService` class (`llm_service/chat_service.py`). This class manages:

- Conversation history using Redis for context-aware responses.
- Integration with large language models for generating answers, summaries, and recommendations.
- Optional RAG support, retrieving relevant documents from Qdrant and injecting them as context for the LLM.
- Modular, asynchronous methods for prompt construction, context retrieval, and response generation.

The service is designed for extensibility, supporting both standard LLM calls and retrieval-augmented workflows. It also abstracts away the details of the underlying LLM, allowing for future model upgrades or swaps.

### Initialization and State

```python
class ChatService:
    def __init__(
        self,
        redis_host: str = os.getenv("REDIS_HOST", "localhost"),
        redis_port: int = 6379,
        qdrant_url: str = os.getenv("QDRANT_URL", "http://localhost:6333"),
        qdrant_collection: str = "leadnow_documents"
    ):
        self.llm = llm
        self.ttl_seconds = 180
        self.qdrant_url = qdrant_url
        self.qdrant_collection = qdrant_collection
        self._vectorstore = None
        self._retriever = None
        self.redis_client = redis.Redis(host=redis_host, port=redis_port)

- Sets up internal state for prompt and retriever management.

### Conversation History Management
 sidebar_position: 2
Conversation history is managed using Redis, ensuring context is preserved across user sessions.

```python
def get_memory(self, user_id: str, service_id: str) -> RedisHistory:
    session_key = f"{user_id}:{service_id}"
    return RedisHistory(self.redis_client, session_key, self.ttl_seconds)
```

- Each user-service pair has a unique session key.
- History is retrieved and updated for every interaction.

### Retrieval-Augmented Generation (RAG)

RAG is supported via Qdrant, allowing the LLM to ground responses in relevant documents.

```python
def respond_with_history(
    self, 
    user_id: str, 
    service_id: str, 
    prompt: Prompt, 
    question: str,
    use_rag: bool = False,
    rag_k: int = 5,
):
    memory = self.get_memory(user_id, service_id)
    history_messages = memory.get_messages()
    context = ""
    if use_rag:
        retriever = self.get_retriever(k=rag_k)
        docs = retriever.invoke(question)
        context = self.format_docs(docs)
    # Construct prompt and call LLM
    # ...existing code...
```

- Retrieves top-k relevant documents for a query.
- Documents are formatted and injected into the prompt for the LLM.

### Prompt Construction and Pipelining

LangChain’s prompt templates are used to dynamically build prompts for the LLM, supporting both system and user messages, as well as context injection for RAG. This enables flexible, context-aware prompt engineering.

```python
from langchain_core.prompts import (
	ChatPromptTemplate,
	SystemMessagePromptTemplate,
	HumanMessagePromptTemplate,
	MessagesPlaceholder
)
system_tmpl = SystemMessagePromptTemplate.from_template(prompt.system_prompt)
messages = [
	system_tmpl,
	MessagesPlaceholder(variable_name="history"),
	HumanMessagePromptTemplate.from_template(prompt.user_prompt)
]
chat_prompt = ChatPromptTemplate.from_messages(messages)
```

This approach enables the injection of conversation history and retrieved documents into the prompt, improving the relevance and coherence of LLM responses.

### LangChain Expression Language (LCEL) and Pipelining

A key feature of LeadNow’s AI backend is the use of LangChain Expression Language (LCEL), which enables the composition of modular AI workflows using the pipe operator. This approach allows different components—such as prompt templates, LLMs, output parsers, and custom functions—to be chained together in a clear, declarative manner.

In `llm_service/chat_service.py`, LCEL is used to build processing pipelines for handling user queries. For example, a typical pipeline might look like this:

```python
from langchain_core.runnables.history import RunnableLambda
from langchain_core.output_parsers import StrOutputParser

chain = chat_prompt | llm_to_use | RunnableLambda(lambda msg: msg.content) | StrOutputParser()
```

- `chat_prompt`: A LangChain prompt template that formats the input and injects context/history.
- `llm_to_use`: The selected language model (e.g., OpenAI, Gemini) wrapped in a LangChain interface.
- `RunnableLambda(lambda msg: msg.content)`: This extracts the main content from the LLM’s response object, which may include metadata or other fields.
- `StrOutputParser()`: Parses the output into a plain string for downstream use, suitable for returning to the user or further processing.

This pipeline is then wrapped with `RunnableWithMessageHistory` to enable stateful, multi-turn conversations:

```python
wrapped = RunnableWithMessageHistory(
	runnable=chain,
	get_session_history=lambda _: self.get_memory(user_id, service_id),
	input_messages_key="user_question",
	history_messages_key="history"
)
```

Each step in the pipeline represents a reusable, composable component. The pipe syntax of LCEL makes the data flow explicit and easy to follow, and allows new steps (e.g., additional output parsing, logging, or validation) to be inserted with minimal code changes. By wrapping the chain with `RunnableWithMessageHistory`, the system maintains conversation context across turns, enabling coherent, context-aware responses.


## LLM Provider Abstraction

This module abstracts the initialization and selection of the underlying LLM provider. LangChain’s provider-specific classes, such as `AzureChatOpenAI` and `ChatGoogleGenerativeAI`, are used in `api_call.py` to instantiate and manage connections to different LLM backends. This abstraction allows seamless switching between providers without changing the application logic.

```python
from langchain_openai import AzureChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI

if llm_choice == "azure":
    llm = AzureChatOpenAI(
        api_key=settings.azure_api_key,
        azure_endpoint=settings.azure_api_endpoint,
        api_version=settings.azure_api_version,
        azure_deployment=settings.azure_api_deployment,
        temperature=0.7
    )
elif llm_choice == "gemini":
    llm = ChatGoogleGenerativeAI(
        model=settings.gemini_model,
        google_api_key=settings.google_api_key,
        temperature=settings.gemini_temperature,
        convert_system_message_to_human=True
    )
else:
    raise ValueError(f"Unsupported LLM choice: '{settings.llm_choice}'")
```

**Key Features:**

- Reads configuration from environment variables or a .env.api file.
- Initializes the appropriate LLM client (Azure or Gemini) using the LangChain interface.
- Raises clear errors if configuration is incomplete or invalid.


---

## Redis-based Chat History

Conversation history for all features built on the LLM service is stored using Redis, an in-memory key-value NoSQL database. Unlike relational databases, Redis requires no schema definition and instead supports data structures such as lists, hashes, and sets. Data is held entirely in memory, making reads and writes extremely fast but ephemeral, which is acceptable for conversation history where low latency is prioritised over long-term persistence.


### Redis Structure 

Conversation history is stored as a Redis List under a key of the form `chat_history:{user_id}:{service_id}`, where each entry in the list represents a message in the conversation. A Redis List is an ordered sequence of string elements, implemented as a linked list, allowing efficient insertion and retrieval from both ends. A TTL of 180 seconds is applied and refreshed on every read and write, meaning history is automatically cleared after a period of inactivity. Connection to Redis is managed through a Redis client instance configured with keepalive and health check settings to maintain a stable connection:

```python
self.redis_client = redis.Redis(
    host=redis_host,
    port=redis_port,
    db=redis_db,
    password=redis_password,
    ssl=redis_ssl,
    decode_responses=False,  # We'll handle encoding ourselves
    socket_connect_timeout=5,
    socket_keepalive=True,
    health_check_interval=30
)
# Test connection
self.redis_client.ping()
```

### Redis Operations 

Redis operations are implemeted with RedisHistoru class. RedisHistory inherits from LangChain's BaseChatMessageHistory, an abstract base class that defines a standard interface for storing and retrieving conversation history, allowing it to integrate seamlessly with LangChain's chat components. Messages are serialised to JSON before being stored, and deserialised on retrieval using LangChain's messages_to_dict and messages_from_dict utilities. There are two core methods. `add_messages(self, msgs)` which implements the operation RPUSH, which is the operation that appends a new message to the right end of the Redis List maintaining chronological order. `get_messages(self, limit: int = -1)` which implements the operation LRANGE, which os the operation thatretrieves a specified range of elements from the list to fetch the conversation history for a given session. Both operations are executed atomically using a Redis pipeline, which batches commands into a single network round trip. 

```python
class RedisHistory(BaseChatMessageHistory):
    
    def __init__(self, redis_client: redis.Redis, session_key: str, ttl_seconds: int = 180):
        self.redis_client = redis_client
        self.session_key = f"chat_history:{session_key}"
        self.ttl_seconds = ttl_seconds
        logger.debug(f"Initialized RedisHistory for {session_key} with TTL={ttl_seconds}s")
    
    def add_messages(self, msgs: List[BaseMessage]) -> None:
        try:
            # Convert messages to JSON strings
            msg_jsons = [json.dumps(messages_to_dict([msg])[0]) for msg in msgs]
            
            # Use pipeline for atomic operations
            pipe = self.redis_client.pipeline()
            
            # Add each message to the list
            for msg_json in msg_jsons:
                pipe.rpush(self.session_key, msg_json)
            
            # Set TTL
            pipe.expire(self.session_key, self.ttl_seconds)

            results = pipe.execute()
            total_messages = results[-2]  # RPUSH returns total length
        except Exception as e:
            logger.error(f"Error adding messages to Redis: {str(e)}")
            raise HistoryError(f"Failed to add messages: {str(e)}")
    
    def get_messages(self, limit = -1) -> List[BaseMessage]:
        try:
            # Use pipeline for atomic operations
            pipe = self.redis_client.pipeline()
            
            # Get all messages from the list
            if limit == -1:
                pipe.lrange(self.session_key, 0, -1)
            else:
                pipe.lrange(self.session_key, 0, limit - 1)
            
            # Refresh TTL
            pipe.expire(self.session_key, self.ttl_seconds)
            
            # Execute atomically
            results = pipe.execute()
            msg_jsons = results[0]
            
            if not msg_jsons:
                logger.debug(f"No messages found for {self.session_key}")
                return []
            
            # Parse messages
            msg_dicts = [json.loads(msg_json) for msg_json in msg_jsons]
            messages = messages_from_dict(msg_dicts)
            return messages
        except Exception as e:
            logger.error(f"Error retrieving messages from Redis: {str(e)}")
            raise HistoryError(f"Failed to retrieve messages: {str(e)}")
    
    def clear(self) -> None:
        """Clear all messages for this session."""
        try:
            count = self.redis_client.delete(self.session_key)
            logger.info(f"Cleared messages from {self.session_key} (deleted {count} key(s))")
        except Exception as e:
            logger.error(f"Error clearing messages from Redis: {str(e)}")
            raise HistoryError(f"Failed to clear messages: {str(e)}")

    @property
    def messages(self) -> List[BaseMessage]:
        """Property to get messages - required by BaseChatMessageHistory."""
        return self.get_messages()
        
    def add_message(self, message: BaseMessage) -> None:
        """Add a single message - required by BaseChatMessageHistory."""
        self.add_messages([message]) 
```