---
sidebar_position: 1
---

# Summary of Achievements

Details about the summary of achievements will go here.

## Achievement Table

Here's implementation result against the MoSCoW requirements.

## Functional requirements

| ID | Requirements | Priority | State |
|---|---|---|---|
| 1 | Deliver personalised learning recommendations and automated summaries based on user activity and performance. | Must have | ✅ |
| 2 | Support teachers within the modules they are learning and guidance on structured learning plans. | Must have | ✅ |
| 3 | Personalised feedback for scenario-based learning modules. | Must have | ✅ |
| 4 | Provide teachers with the option to speak their answers instead of typing. | Should have | ✅ |
| 5 | Provide teachers with the ability to translate between English and Swahili. | Could have | ✅ |
| 6 | Develop tooling to support education officers with their everyday tasks. | Should have | ✅ |
| 7 | Very large/expensive LLMs as default. | Won't have | 🚫 |
| 8 | Translation popup for all languages. | Won't have | 🚫 |

## Non-functional requirements

| ID | Requirements | Priority | State |
|---|---|---|---|
| 1 | Simple and intuitive interface that allows teachers and education officers to easily navigate modules, submit responses and access feedback. | Must have | ✅ |
| 2 | Functions should not take too long to load to maintain a smooth user experience. | Should have | ✅ |
| 3 | Features should remain consistently available on both the website and the mobile app so that users can reliably access them whenever needed. | Should have | ✅ |
| 4 | Operational and hosting costs should be minimised. | Must have | ✅ |
| 5 | Features should be usable on low-cost smartphones and desktop devices, and should handle intermittent or low-bandwidth internet connections. | Must have | ✅ |
| 6 | System should be designed so that new features can be added without significant changes to the core platform. | Should have | ✅ |
| 7 | iOS support for the mobile application. | Won't have | 🚫 |
| 8 | Authentication and security features such as two-factor authentication. | Won't have | 🚫 |


Through this project, we developed new AI-powered features to make the platform more accessible and 
personalised for educators, improving how teachers in Kenya engage with professional teacher training.

The project successfully delivered all MoSCoW requirements, including all Must Have and Should
Have items, and went beyond the original scope by proactively identifying and addressing
additional client needs. All AI features: teacher chatbot, progress summaries,
scenario feedback, the Education Officer agent, speech-to-text and translation from English to Swahili, 
were fully implemented and deployed.

The system is stable and cloud-hosted on Azure Container Apps, with a comprehensive
three-layer test suite providing strong regression resistance. API response times average
1.52s for the chatbot and 2.74s for progress summaries, well within acceptable limits.
The microservice architecture ensures full backward compatibility with the client's existing
system, requiring no changes to pre-existing functionality.

The interface maintains a consistent design across web and mobile, and the system is designed
for extensibility. Additional features and integrations can be introduced with minimal effort
as the platform scales.

By integrating AI into the LeadNow platform, we have given educators personalised feedback, intelligent support, the ability to track their own progress and more, which directly addresses the barriers that limit teaching quality.

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
| Implementation              | 50%   | 20%  | 0%     | 15%  | 15%  |
| Testing                     | 25%   | 0%      | 65%    | 0%      | 10%     |
| Evaluation and Future Work  | 60%   | 0%      | 0%     | 10%     | 30%     |
| User and Deployment Manuals | 0%    | 0%      | 0%     | 0%      | 100%    |
| Legal Issues                | 0%    | 0%      | 0%     | 100%    | 0%      |
| Blog and Monthly Video      | 0%    | 65%      | 35%   | 0%      | 0%      |
| **Overall contribution**    | **22%** | **18%** | **20%** | **20%** | **20%** |