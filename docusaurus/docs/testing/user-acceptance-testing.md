---
sidebar_position: 5
---

# User Acceptance Testing

UAT was conducted in collaboration with our client at Dignitas. Following a demo of the new features, the client organised testing sessions in which teachers were given the opportunity to explore the developer environment hands-on. Each session followed a structured format: participants completed a series of guided steps to trial a given feature, then filled out a short questionnaire. Responses were recorded on a 1–5 Likert scale (1 = Strongly Disagree, 5 = Strongly Agree), with participants also providing written feedback to explain their ratings. The client has since returned aggregated results from these sessions. Note that the data does not include the total number of teacher respondents.

---

## Test Case 1 - User Summary Feature

| Question | Rating | Feedback |
|---|---|---|
| The UI is intuitive and easy to navigate | 5 - Strongly Agree | It includes teacher being
able to navigate the platform (audio narrator), it has synced well with the other
content. |
| The personalised learning recommendations were useful and relevant | 4 - Agree | We
need to reference the content more. To create synergy |
| The user summary is easy to understand and contains sufficient information | 4 - Agree | The statement is simple and to the point, Next step are actionable. The only areas of
improvement, there needs to be reference to Dignitas next steps of practice eg COPs
& Action Plan |

**Discussion:** In general, the user summary feature was well-received by the teachers. They found it easy to navigate and understand, and the personalised learning recommendations were useful and relevant. The only areas of improvement were to reference LeadNow and Dignitas content more in the user summary.

---

## Test Case 2 - General Education Assistant Chatbot

| Question | Rating | Feedback |
|---|---|---|
| The UI is intuitive and easy to navigate and use | 5 - Strongly Agree | Easy to use overall, though text visibility is poor when typing long paragraphs. |
| The response to the question is relevant and includes appropriate LeadNow content | 4 - Agree | Significant effort made to reference content. |
| The education assistant chatbot successfully generates a learning plan | 4 - Agree | Accurate in capturing learning plans for a particular module, though no reference was made to the assigned module. |

**Discussion:** In general, the general education assistant chatbot was well-received by the teachers. They found it easy to use and understand, and responses contained relevant LeadNow content. However, we can improve on learning plan generation by attaching user data to each chat session such as the user's assigned module. 

---

## Test Case 3 - Personalised Feedback for Scenario-Based Learning

| Question | Rating | Feedback |
|---|---|---|
| The UI is intuitive and easy to navigate and use | 5 - Strongly Agree | Fits well with the surrounding content. |
| The feedback was appropriate to the answer and the scenario | 4 - Agree | Needs greater contextualisation and reference to learning materials. |
| This feature will improve the user learning experience and make it easier for teachers to learn | 5 - Strongly Agree | Teachers receive personalised feedback, which will serve as a source of motivation. |

**Discussion:** In general, the personalised feedback for scenario-based learning was well-received by the teachers. They found it easy to use and understand, and the feedback was appropriate to the answer and the scenario. To improve the personalised feedback, we could increase the number of LeadNow document chunks fetched by the RAG pipeline, enabling the model to reference a broader range of learning materials.

---

## Test Case 4 - Speech to Text Feature

| Question | Rating | Feedback |
|---|---|---|
| The UI is intuitive and easy to navigate and use | 4 - Agree | Easy to use, but live transcription is not visible during recording - text only appears once recording stops. |
| The speech was accurately recorded and transcribed to text | 2 - Disagree | Background noise significantly affects accuracy. Misspellings and misinterpretations were observed in the generated text. |
| The process felt easier than typing | 4 - Agree | Felt easier than typing overall. |

**Discussion:** The speech to text feature was well-received by teachers. However a large issue was the accuracy of the transcription which was due to background noise in the testing environment. This innacurracy is documented in the known bugs section. Unfortunately, this is a limitation of the underlying speech to text model. Addressing it would require trade-offs such as switching to a more capable model with higher memory requirements or integrating a third-party cloud transcription API which would increase costs.

---

## Test Case 5 - English to Swahili Feature

| Question | Rating | Feedback |
|---|---|---|
| The UI is intuitive and easy to navigate and use | 3 - Neutral | Unless text is highlighted, it is difficult to know the feature is available. |
| The text was accurately translated from English to Swahili | 4 - Agree | Translation would be improved if contextualised to Kenyan Swahili. |
| This feature improves the accessibility of the LeadNow platform for teachers who may not understand English | 3 - Neutral | Would be more effective with a Kenyan Swahili variant. |

**Discussion:** The English to Swahili feature was well-received by teachers. The issue of the UI not being intuitive is partially our fault for not showing the mobile version of the feature which has a clear button to switch between languages. Additionally, the model could be contextualised to Kenyan Swahili by changing the dataset used to train the model so that the dataset specifically uses English and Kenyan Swahili pairs. This would improve accessibility for teachers who may only understand Kenyan Swahili. 

---

## Test Case 6 - Education Officer Agent Feature

| Question | Rating | Feedback |
|---|---|---|
| The UI is intuitive and easy to navigate and use | 4 - Agree | Easy to use and navigate. Suggestion: surface the agent in the menu sidebar for better visibility. |
| It is clear what the capabilities of the Education Officer Agent are | 4 - Agree | A short introduction explaining its function is present. |
| The Education Officer Agent generates an appropriate response with the correct cohort data | 2 - Disagree | Can analyse data, but does not consistently retrieve fully accurate data. |
| The Education Officer Agent successfully sends a WhatsApp message to the correct phone number | 2 - Disagree | Failed to send messages to both previously used and new phone numbers. |
| The Education Officer Agent generates an appropriate school trip plan | 1 - Strongly Disagree | Generates a response, but it was off-task and did not meet expectations. |

**Discussion:** The education officer agent was had a mixed reception from the teachers. While they found the UI to be intuitive and easy to use, they found the agent to be inconsistent in its responses and failed to complete certain functionality. The education officer agent not being able to generate an appropriate response data comes down to the fact that the SQL workflow for the agent is slightly inconsistent due to LLM quality. This is documented in the known bugs section. The agent's inability to send WhatsApp messages is an issue with the WhatsApp Business Platform itself as automated messages can only be sent to users who have already initiated a conversation with the business. This is something that we did not bring up during our demo with the client. Finally, the agent's inability to generate an appropriate school trip plan is an issue with prompt engineering as the instructions to plan a school trip was placed in the prompt. Any issues with school trip planning would require changing the prompt to the expected format from Dignitas. 
