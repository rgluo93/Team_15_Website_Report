---
sidebar_position: 4
---

# Prototype

Using the preferred sketch as a reference, we developed prototypes for the AI features to be integrated into LeadNow.

## Dashboard Summary

An AI-generated summary of a user's progress and activity, displayed on their dashboard to provide personalised insights.

<img src="/img/ui-design-images/prototype-dashboard.png" alt="Dashboard Summary Prototype" width="80%" />

## Scenario-Based Learning

Integrating an LLM into scenario-based learning modules to simulate real-world situations, asking teachers open-ended questions on how they would respond. After a teacher submits their response to a scenario, an LLM generates personalised feedback by comparing their answer against LeadNow's expert feedback.

<img src="/img/ui-design-images/prototype-feedback.png" alt="Scenario-Based Learning - Initial" width="80%" />

<div style={{width: '80%', textAlign: 'center', fontSize: '2.5rem', color: '#888', margin: '1rem 0', lineHeight: 1}}>⬇</div>

<img src="/img/ui-design-images/prototype-feedback1.png" alt="Scenario-Based Learning - Result" width="80%" />

## Education Officer AI Agent

The chatbot is different depending on the user's role. Teachers can use it to get answers to questions related to teaching and student issues. For education officers, the chatbot supports monitoring teacher performance and measuring engagement.

### Education Officer — AI Chatbot

<img src="/img/ui-design-images/prototype-edu-officer-ai.png" alt="Education Officer AI Chatbot" width="80%" />

### Education Officer — Dashboard

<img src="/img/ui-design-images/prototype-edu-officer-dashboard.png" alt="Education Officer Dashboard" width="80%" />

## Changes in the Final Implementation

In the final product, the separate dashboard and chatbot views were consolidated into a single AI agent. Rather than navigating between screens, education officers interact with one chatbot interface that automatically determines the appropriate action (querying live data, sending WhatsApp reminders, generating planning documents or translating messages) based on what they ask.

