---
sidebar_position: 3
---

# Future Work

While the current system delivers a functional AI-powered teacher training platform, several meaningful extensions could significantly improve its capabilities, accessibility and impact.

### 1. Improved RAG System with Better Retrieval

The chatbot currently retrieves chunks from PDFs using vector search. This could be enhanced with:

- **Hybrid search** 
Vector and keyword search combines semantic similarity with exact keyword matching to improve retrieval accuracy, ensuring results are returned even when the query uses precise terminology that a vector search alone might miss

- **Re-ranking models** 
Add a second-pass evaluation after the initial retrieval. Once the top 10 chunks are returned by semantic search, a dedicated re-ranker model (such as a cross-encoder like Cohere Rerank or BGE-Reranker) scores each chunk against the query more precisely than vector similarity alone, reordering them so only the most contextually relevant chunks are passed to the final LLM.

- **Automatic document updates UI** 
Ensure new LeadNow content is indexed into the vector database without manual intervention. Rather than requiring CLI access, a lightweight admin UI would allow non-technical staff to upload documents, trigger re-indexing, and monitor pipeline status

- **Graph databases** 
Offer a structural advantage over flat vector stores for content that has meaningful relationships between topics. Using a tool like Neo4j, LeadNow's curriculum could be modelled as a graph — where topics, subtopics, competencies, and modules exist as nodes with explicit relationships between them (e.g. "Leadership Basics" → prerequisite of → "Strategic Thinking"). In a GraphRAG approach, retrieval traverses these relationships rather than treating chunks in isolation, allowing the LLM to receive richer, more contextually connected information, particularly useful when a learner's question spans multiple related topics.


This would reduce hallucinations and produce more accurate, grounded responses.

### 2. Voice-Based Chatbot Interaction

Currently, speech-to-text is only used for recording answers. A fuller voice experience could include:

- **Full voice conversation with the chatbot, especially for scenario based learning**
A complete voice interaction loop would allow learners to speak directly to the chatbot and receive spoken responses, making scenario-based learning significantly more immersive

- **Responses from the LLM is converted from text to speech**

LLM responses can be converted to audio using a lightweight TTS model such as Coqui TTS or Piper, both of which are open-source and can run on-device. For a more natural, expressive output, a cloud-based service such as Google Cloud Text-to-Speech or ElevenLabs could be used when connectivity is available, falling back to the on-device model offline. 

- **Offline voice support for low-connectivity environments**

This would significantly improve usability for mobile-first users in rural areas.

### 3. Offline Mode for Low Connectivity

Many Kenyan schools face unstable internet access. Possible improvements include:

- **Local caching of training modules**
On home page load, the app lazily fetches the user's recommended modules in the background, downloading content incrementally by priority and storing it locally so modules are accessible without a network connection.

- **Syncing responses when connectivity is restored**
Offline user actions, such as chatbot messages or quiz submissions, are persisted in an on-device SQLite database as a queue of pending requests. A background sync worker monitors connectivity and, once restored, forwards queued actions to the server in order, marking each as synced upon acknowledgement.

- **Running smaller on-device models for basic features when offline**
A lightweight model (sub-10B parameters, e.g. a quantised Llama or Phi variant) fine-tuned on LeadNow's curriculum can be downloaded once over Wi-Fi during onboarding. It handles basic Q&A offline, with the full cloud model resuming when connectivity is restored.

This would make the platform far more accessible to teachers in remote locations.

### 4. Analytics Dashboard for Education Officers

The education officer agent currently responds to natural language prompts. A future extension could add graph visualisation tools to the MCP server:

- Visual dashboards with charts and progress summaries
- Teacher progress heatmaps
- School performance comparisons
- Drop-off analysis across modules

Once the AI agent has retrieved data via the SQL database tool, the education officer can invoke a dedicated graph generation tool on the MCP server, passing the query results directly as input. This tool would be built using Matplotlib or Plotly in Python, both libraries accept structured data (e.g. a list of records or a Pandas DataFrame) and output a graph, either as a rendered image or an interactive HTML component. Plotly is particularly well suited here as it produces interactive charts out of the box, allowing the education officer to hover, filter, and zoom without any additional frontend work. The MCP tool would handle the full pipeline, receiving the data, selecting the appropriate chart type based on context (bar chart for comparisons, heatmap for teacher progress, funnel chart for drop-off analysis), rendering the visualisation, and returning it to the agent's response.

This would help education officers make data-driven decisions more efficiently.

### 5. Multi-language Support Beyond Swahili

Kenya has many regional languages. The platform could be extended to support:

- Kikuyu, Luo, Kalenjin and other major regional languages
- Multilingual translation models integrated into the chat pipeline

This would make teacher training more inclusive across diverse communities. This would involve fine-tuning the Meta NLLB model on these regional languages as well. 

### 6. Smarter Agent Planning

The education officer agent could become significantly more capable with:

- **Calendar tools** enabling the agent to autonomously schedule school visits, book follow-up sessions with underperforming teachers, and set module deadline reminders, all without leaving the conversation interface
- **Email tools** allowing the agent to draft and send performance updates, intervention notices, or training reminders to teachers and school administrators directly from the chat
- **Google Drive integration** connecting the agent to the education officer's own Drive so it can read and reference existing resources, such as lesson plan templates, curriculum documents, or historical performance spreadsheets stored in Google Sheets, and factor them into its responses and recommendations without requiring manual uploads each session

For example: *"Schedule visits to the three lowest-performing schools next week."*

### 7. Model Fine-tuning on Teacher Data

Rather than relying on general-purpose language models, domain-specific fine-tuning could be applied using:

- **LeadNow curriculum content** particularly relevant for the on-device local models used by teachers, where low parameter counts mean the model has limited general knowledge. Fine-tuning these smaller models directly on LeadNow's curriculum would ensure they remain useful and contextually accurate within the constraints of running offline on a low-resource device.
- **Historical teacher responses and feedback** education officers could manually grade past teacher responses with a score, building a labelled dataset of response quality. This dataset would then be used for Reinforcement Learning from Human Feedback (RLHF), where the model is trained to predict scores for unseen responses and progressively align its own outputs toward higher-quality answers. Over time, this would produce a model that can more accurately and consistently assess teacher responses, reducing the marking burden on education officers.

This would produce more contextually appropriate coaching and more accurate content-specific answers.

### 8. Impact Evaluation and A/B Testing

To measure the real-world effectiveness of the platform, structured evaluation could include:

- A/B tests comparing teachers using AI features against a control group
- Metrics such as module completion rates, engagement levels and teaching outcomes
- Longitudinal tracking to assess improvement over time

This would provide evidence of educational impact and support future investment in the platform.

### 9. LLM Observability

As the platform scales to more schools and users, integrating an observability tool such as LangSmith would provide full visibility into every step of the agent's reasoning pipeline — from the initial user prompt through tool calls, retrieved context, and final response generation. Key benefits include:

- **Detailed trace logging** capturing exactly which tools were called, what inputs and outputs were passed at each step, and where latency is being introduced, making it significantly easier to diagnose failure cases such as incorrect SQL queries, poor retrieval results, or unexpected agent behaviour
- **Error pattern detection** allowing developers to identify recurring failure modes across many runs that would be difficult to spot from raw logs alone
- **Regression monitoring** to catch drops in response quality when the underlying model, prompts, or pipeline are updated
- **Token usage and cost tracking** surfaced per run, which is important for managing API expenditure as usage and school onboarding grows
- **Trace annotation and flagging** enabling developers or education officers to mark problematic responses directly, creating a feedback loop between production behaviour and future prompt or pipeline improvements

### 10. SQL Tool Improvements

One of the known limitations of the current system is the SQL tool's inability to reliably handle complex queries. Several improvements could be made to address this:

- **Use a Larger Model for SQL Generation**
Smaller models such as GPT-4o Mini can struggle to reason accurately over large or intricate schemas. Delegating SQL generation specifically to a more capable model would improve query accuracy without upgrading the entire agent stack.

- **Create a Dedicated SQL Subagent**
Rather than generating a query in a single pass, a dedicated SQL subagent could iteratively call the SQL tool multiple times, evaluate intermediate results, and refine its query until it is confident the output is correct. This recursive evaluation loop is particularly valuable for multi-step queries that join several tables or require conditional logic.

- **Dynamic Schema Context via MCP Tools**
Rather than embedding the full database schema statically in the system prompt, dedicated MCP tools would expose table descriptions and schema information on demand. The agent would call these tools selectively to retrieve only the context relevant to the current query, reducing prompt noise and allowing the subagent to build its understanding of the schema incrementally before committing to a final query. This mirrors how an experienced analyst would explore an unfamiliar database, inspecting relevant tables first rather than reasoning over the entire schema at once.