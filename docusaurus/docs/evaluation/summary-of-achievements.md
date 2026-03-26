---
sidebar_position: 1
---

# Summary of Achievements

Details about the summary of achievements will go here.

## Achievement Table

Here's implementation result against the MoSCoW requirements.

## Must have 
- ✅ **Teacher chatbot for remote training support**
Contributors: 
- ✅ **Performance summary report with next-step recommendations**
Contributors: 
- ✅ **Personalized scenario feedback** 
Contributors: 
- ✅ **Cost-aware LLM baseline** (current setup favors lower-cost model defaults)

## Should have 
- ✅ **Education officer agent**
  - ✅ school visit planning
  - ✅ teacher/school performance review via data workflows
  - ✅ WhatsApp messaging actions
  - ✅ multi-step agent execution flow
Contributors: 
- ✅ **Speech-to-text capability** (API-level support is in place)
Contributors: 
- ✅ **Dockerized setup** (Dockerfiles and compose workflow available)
Contributors: 

## Could have 
- ✅ **English ↔ Swahili translation popup**
Contributors: 
- ✅ **Kubernetes deployment**
  - As an alternative deployment option as LeadNow scales up
Contributors: 

## Won’t have 
- 🚫 **Very large/expensive LLMs as default**
- 🚫 **Translation popup for all languages**
- 🚫 **AI-assisted scenario answer generation**
- 🚫 **Third-party educational content database**

## Known bugs

The majority of known issues are attributable to limitations in the underlying machine learning models.

| ID | Bug Description | Priority |
|----|----------------|----------|
| 1 | **Education Officer Agent Generates Incorrect SQL Queries**: When retrieving data, the Education Officer agent must dynamically generate an SQL query based on the user's request. This generated query may sometimes be inaccurate, either fetching incorrect data or failing due to a syntax error. While the system prompt provides the LLM with sufficient context about the database schema to attempt query generation, the query may still fail for two reasons: a lack of concrete examples in the context, and the inherent limitations of the model being used. Smaller or less capable models, such as GPT-4o Mini, are particularly prone to this when handling complex queries, as they may struggle to reason accurately over large or intricate schemas. When an incorrect query is generated, this can result in the Education Officer agent returning a wrong or incomplete answer to the user. <br /> <br /> **Proposed Fix:** Rather than providing all table and schema context upfront in a single prompt, the agent would dynamically build its context by calling MCP tools to retrieve information about specific tables as needed. The SQL generation workflow would then iterate, only producing a final query once the agent determines it has gathered sufficient context. This approach is discussed further in the Future Work section. | Medium |
| 2 | **Inaccurate English-to-Swahili Translation**: The translation model does not guarantee accurate English-to-Swahili translation, particularly for longer texts. This limitation persists even after fine-tuning, and was validated through comparison testing against Google Translate. This is a known constraint of working with low-resource languages such as Swahili, where training data is limited, affecting both fine-tuned models and general-purpose LLMs. Despite this, the current approach remains the preferred solution, as cloud-based translation services (e.g. Google Translate API) present a significantly higher operational cost. | Low |
| 3 | **Inaccurate Speech-to-Text Transcription**: The Vosk speech-to-text model may not always produce accurate transcriptions, particularly in suboptimal recording conditions such as background noise or low-quality microphone input. This is a recognised limitation of the model rather than a fault in the application. Despite this, Vosk remains the preferred solution as it is open-source and free to use; alternative models that offer higher accuracy typically come at a significant cost. | Low |
| 4 | **API Timeout Due to Cold Start**: Azure Container Apps automatically scales down idle containers after a period of inactivity. As a result, the first API call made after this idle period may experience a significantly delayed response while the container restarts, a behaviour commonly referred to as a "cold start." If the container takes too long to restart, the API request will timeout and an error will be thrown, rather than returning a valid response. This can cause the UI to update without the expected data, leading to incomplete or missing information being displayed. This scaling behaviour is intentional and is retained as it reduces hosting costs, particularly during development. | Low |

## Feedback

R we including this section? 

## Individual contribution

### System Artefacts

| Work                    | James | Yi Kang | Ronald | Lincoln | Matthew |
|-------------------------|-------|---------|--------|---------|---------|
| Research and Experiments | 30%   | 17.5%   | 15%    | 17.5%   | 20%     |
| UI Design               | 5%    | 45%     | 5%     | 5%      | 40%     |
| Coding                  | 30%   | 20%     | 15%    | 20%     | 15%     |
| Testing                 | 10%   | 20%     | 55%    | 5%      | 10%     |
| **Overall Contribution** | **23%** | **20%** | **19%** | **19%** | **19%** |

### Website Report

| Work                         | James | Lincoln | Ronald | Yi Kang | Matthew |
|------------------------------|-------|---------|--------|---------|---------|
| Website Template and Setup   | 15%   | 0%      | 85%    | 0%      | 0%      |
| Home                         | 0%    | 30%     | 70%    | 0%      | 0%      |
| Video                        | 20%   | 20%     | 20%    | 20%     | 20%     |
| Requirement                  | 5%    | 70%     | 0%     | 10%     | 15%     |
| Research                     | 95%   | 0%      | 0%     | 5%      | 0%      |
| UI Design                    | 0%    | 0%      | 0%     | 25%     | 75%     |
| System Design                | 100%  | 0%      | 0%     | 0%      | 0%      |
| Implementation              | 50%   | 16.66%  | 0%     | 16.66%  | 16.66%  |
| Testing                     | 25%   | 0%      | 65%    | 0%      | 10%     |
| Evaluation and Future Work  | 60%   | 0%      | 0%     | 10%     | 30%     |
| User and Deployment Manuals | 0%    | 0%      | 0%     | 0%      | 100%    |
| Legal Issues                | 0%    | 0%      | 0%     | 100%    | 0%      |
| Blog and Monthly Video      | 0%    | 0%      | 100%   | 0%      | 0%      |
| **Overall contribution**    | **22%** | **18%** | **20%** | **20%** | **20%** |