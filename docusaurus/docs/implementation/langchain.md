---
sidebar_position: 5
---

# LangChain

LangChain is a library that provides powerful abstractions for prompt management, message history, LLM orchestration, and document handling. Its integration enables modular, maintainable, and extensible AI workflows across the platform.

Our project makes extensive use of LangChain as a set of composable building blocks used throughout the LLM service, chat history management, and retrieval-augmented generation (RAG) pipeline. By leveraging LangChain’s interfaces and utilities, the project achieves clean separation of concerns, robust context management, and compatibility with multiple LLM providers.


## Prompt Construction and Pipelining

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

## Message and History Management

The `redis_history.py` module uses LangChain’s `BaseChatMessageHistory` and message serialization utilities to store, retrieve, and manage chat histories in Redis. This ensures that the chat history is compatible with LangChain’s conversational workflows and can be easily extended or reused.

```python
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.messages import BaseMessage, messages_from_dict, messages_to_dict

class RedisHistory(BaseChatMessageHistory):
	# ...implementation...
```

By standardizing on LangChain’s message formats, LeadNow ensures interoperability and future-proofing for new LLM features.

## LLM Provider Abstraction

LangChain’s provider-specific classes, such as `AzureChatOpenAI` and `ChatGoogleGenerativeAI`, are used in `api_call.py` to instantiate and manage connections to different LLM backends. This abstraction allows seamless switching between providers without changing the application logic.

```python
from langchain_openai import AzureChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI

if llm_choice == "azure":
	llm = AzureChatOpenAI(...)
elif llm_choice == "gemini":
	llm = ChatGoogleGenerativeAI(...)
```

## Document Handling and RAG

LangChain’s `Document` abstraction is used in the RAG pipeline and in tests to represent and manipulate retrieved knowledge base documents. This supports context injection for more accurate and relevant LLM responses.

```python
from langchain_core.documents import Document
doc = Document(page_content="Relevant content", metadata={"source": "knowledge_base"})
```
