---
sidebar_position: 1
---

# Related Projects

To build our project successfully, we referred to a couple of similar projects which we could learn from. The projects chosen were chosen for their relevance to a specific component of our project. 


### Project For Integrating AI into Educational Platforms

**Project name**: Duolingo,explain my answer

**Main features**: Duolingo is a widely used language-learning application that delivers structured lessons to help users acquire new languages. Recently, Duolingo integrated AI-powered features into its platform, including an AI that evaluates user responses to questions and provides contextual feedback explaining whether an answer is correct or incorrect. The integration of AI into an established online educational platform is closely aligned with the aims of our project, making Duolingo AI features a relevant case study for our group to analyse. 
 
**What can be learnt from this project**: Duolingo served as a key reference during the ideation phase of our mobile UI design, providing inspiration for how an AI-enhanced educational experience can be presented in an intuitive and accessible way. Notably, it demonstrated how AI can be meaningfully integrated into an educational learning platform to enhance the user's learning journey without feeling disruptive or intrusive. The "Explain My Answer" feature in particular directly influenced the design of our personalised scenario feedback feature, where AI is used to provide users with contextual, constructive feedback.


### Project For RAG 

**Project name**: Building an RAG Chatbot with Qdrant, LangChain and Streamlit. 

**Main features**:  This project demonstrates the construction of a simple RAG-based chatbot that retrieves relevant information through semantic search over a vector database. It uses Qdrant as the vector store and LangChain as the AI orchestration framework, both of which are design decisions that closely align with our own project's architecture. Additionally, the project incorporates Streamlit for the user interface and containerises the Qdrant instance using Docker, providing a clean and portable deployment setup.

**What can be learnt from this project**: This project served as a practical reference for building a RAG pipeline using LangChain and Qdrant, offering a working implementation that was more immediately accessible than navigating through library documentation alone. Specifically, it demonstrated the key functions and classes needed for loading and preprocessing PDFs with LangChain, creating vector embeddings, setting up a Qdrant client, and performing semantic search. The primary architectural difference between this reference project and our own is in how and when embeddings are generated. In this project, documents are converted to vector embeddings at runtime, whereas our implementation features a dedicated ETL pipeline accessible via a CLI, that preprocesses and embeds documents in advance, with the resulting embeddings persisted in the vector store. This design improves efficiency by decoupling the embedding process from the application's runtime. Additionally, our project differs in its choice of embedding model.

### Project for AI LangGraph agent 

**Project name**: Building a powerful SQL Agent with LangGraph: A Step-by-Step guide 

**Main features**: This project creates an AI agent with LangGraph specifically for executing SQL queries. The project blog goes over the LangGraph architecture, the nodes and state which enable the agent to successfully execute SQL queries. The SQL agent described here fetches available tables from a database, determines relevant tables, retrieves the DDL, generates an SQL query, double checks the query, executes the query, formulates a response according to the query and returns the result

**What can be learnt from this project**: This project was instrumental in informing the design and implementation of our own SQL agent workflow. It provided practical guidance on setting up LangGraph, defining agent state, adding nodes, and constructing recursive workflows, in this project's case, recursively validating an SQL query until correct, which directly parallels our own use of recursive evaluation to verify whether a plan has been successfully executed. In particular, the workflow architecture also inspired our approach to handling database and table schema context within the agent. That said, we made deliberate design decisions where appropriate  for instance, rather than dynamically fetching table schemas at runtime, we embedded the table and schema details directly into the query prompt, as the relatively small size of our database allowed this information to fit comfortably within the context window.

### Project for MCP server 

**Project name**: WhatsApp MCP server

This project implements a Model Context Protocol (MCP) server that enables an AI to interact with WhatsApp, allowing it to search and read messages, send messages, search contacts, and access media files. Rather than using Meta's official WhatsApp Business Platform, this is achieved through the WhatsApp Web multi-device API, which connects to a personal WhatsApp account by acting as a linked device, similar to how WhatsApp Web works in a browser.

**What can be learnt from the project**: This project provided valuable guidance on how an MCP server can be used to host and expose WhatsApp-related tools to an AI agent. It offered a practical reference for working with fastMCP to host tools and helped inform the design of the types of tools that can be exposed through an MCP server for WhatsApp interaction. A key distinction between this project and our own is that while this project connects to WhatsApp via the unofficial WhatsApp Web multi-device API, our implementation uses the official WhatsApp Business Platform making our approach more suitable for a production environment and compliant with Meta's terms of service.


### Project for fine-tuning 

**Project name**: NLLB fine-tuning with LoRA training

**Main features**: This project demonstrates the fine-tuning of Meta's No Language Left Behind (NLLB) model using Low-Rank Adaptation (LoRA), specifically targeting Korean-to-English translation via the PEFT (Parameter-Efficient Fine-Tuning) library. By leveraging LoRA, the project reduces the number of trainable parameters significantly, enabling efficient adaptation of a large pre-trained model without the computational overhead of full fine-tuning. It serves as a highly relevant reference point for our work, given that our project similarly applies a fine-tuned NLLB model, in our case targeting English-to-Swahili translation.

**What can be learnt from this project**: This project proved particularly valuable during the early stages of our development, as it provided a concrete, working implementation of the LoRA fine-tuning process applied to an NLLB model. By studying its structure and methodology, we were able to establish a well-grounded boilerplate for our own fine-tuning script, ensuring our approach followed established best practices. The primary differences between this reference project and our own implementation lie in the target language pair, the training dataset, and the selection of hyperparameters, all of which were adapted to suit our English-to-Swahili translation task.


