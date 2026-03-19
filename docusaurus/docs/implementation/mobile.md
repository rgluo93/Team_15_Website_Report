---
sidebar_position: 1
---

# Mobile

## Introduction

This section outlines the AI-related updates made to the LeadNow mobile application, covering new features, UI changes, architecture and testing. All AI features communicate with the Azure-hosted FastAPI backend.

---

## AI Features Implementation

### AI Services

There are 5 services, each responsible for a single concern:

| Service File | Methods |
|---|---|
| `ai_chatbot_service.dart` | `sendMessage()`, `clearHistory()` |
| `ai_user_summary_service.dart` | `generateUserSummary()` |
| `ai_scenario_feedback_service.dart` | `generateScenarioFeedback()` |
| `ai_speech_to_text_service.dart` | `transcribeAudio()` |
| `ai_translation_service.dart` | `translateText()`, `clearTranslationCache()` |

**Features & Endpoints:**

| Feature             | Method                | Endpoint                                    |
|--------------------|---------------------|--------------------------------------------|
| Chatbot messaging   | `sendMessage()`      | POST `/api/v1/chatbot/chat`               |
| Delete chat history | `clearHistory()`     | DELETE `/api/v1/chatbot/history/{user_id}` |
| User summary        | `generateUserSummary()` | POST `/api/v1/user-summary/generate`     |
| Scenario feedback   | `generateScenarioFeedback()` | POST `/api/v1/scenario-feedback/generate` |
| Speech-to-text      | `transcribeAudio()`  | POST `/api/v1/speech-to-text/transcribe` |
| Translation         | `translateText()`    | POST `/api/v1/translate` |

### General Chatbot

- Floating action button that expands into a full chat interface.  
- Supports voice recording (speech-to-text), per-message translation, offline banner, typing indicator and auto-scroll.  
- Chat history is persisted locally using ObjectBox.  
- **Functions called:** `sendMessage()`, `clearHistory()`, `transcribeAudio()`, `translateText()`

### User Progress Summary

- AI-generated progress summaries displayed on the home dashboard.  
- Cached locally with a 1-hour cooldown before regeneration.  
- Gradient card UI with **Translate** and **Refresh/Regenerate** buttons, markdown rendering and last-updated timestamp.  
- **Functions called:** `generateUserSummary()`, `translateText()`

### Scenario-Based Learning Feedback

- Triggered after submitting scenario responses.  
- AI feedback is shown alongside the user’s answer and expert answer.  
- Modal dialog UI allows per-field translation and shows a loading spinner while feedback is generated.  
- **Functions called:** `generateScenarioFeedback()`, `transcribeAudio()`, `translateText()`

### Language Translation

- On-demand translation for AI-generated content.  
- Translation button available on AI responses; target language selection handled in the UI.  
- Cached locally for performance.  
- **Functions called:** `translateText()`

---

## Frontend Changes

### Chatbot UI (`lib/ui/views/chatbot/`)
- Floating action button expands into a full chat interface.  
- Voice recording with speech-to-text transcription.  
- Per-message translation button on AI responses.  
- Offline banner, typing indicator, auto-scroll.  
- Chat history persisted locally in **ObjectBox** (`ChatMessage` entity).  
- Trash can icon integrated for **delete history**.

### User Summary Section (`lib/ui/views/home/home_view.dart`)
- Gradient card displaying AI-generated summary.  
- Translate, Refresh/Regenerate buttons with loading states.  
- Markdown rendering for formatted AI output.  
- Last-updated timestamp displayed.

### Scenario Feedback Dialog (`lib/services/alert_service.dart`)
- Modal showing user answer, expert answer and AI feedback.  
- Independent translation per field.  
- Loading spinner while feedback is being generated.  

---

## Where to Find These Features

| Feature | Location / How to Access |
|---------|-------------------------|
| **General Chatbot** | Tap the chat icon at the bottom-right of the screen to open the chatbot window and start a conversation. |
| **User Progress Summary** | Scroll to the bottom of the page on the home dashboard. Tap **Refresh** to generate an updated summary. |
| **Scenario-Based Learning Feedback** | Within Scenario-Based Learning pages, tap **Resume Session** to enter the activity. After submitting your response, tap the option to generate AI feedback. |
| **Language Translation** | Tap the **Translate** button on any AI-generated text to see it in a different language. |

---

## Architecture

- **Pattern:** MVVM using **Stacked**.  
- **Views:** purely UI.  
- **ViewModels:** manage state, call Services/Repositories.  
- **Local storage:** ObjectBox.  
- **Offline handling:** `ConnectivityService` gates AI calls.  

---

## Testing

The tests focuses on the AI functionalities we implemented.

### Test Coverage by File

| File | Coverage |
|------|---------|
| `ai_chatbot_service.dart` | 100% |
| `ai_user_summary_service.dart` | 100% |
| `ai_scenario_feedback_service.dart` | 100% |
| `ai_speech_to_text_service.dart` | 100% |
| `ai_translation_service.dart` | 100% |
| `home_view_model.dart` | 99% |
| `chatbot_view.dart` | 95% |
| `chatbot_view_model.dart` | 74% |
| `alert_service.dart` | 67% |

### Testing Patterns

- **Mockito with @GenerateMocks** and code generation for mocking services  
- **MockClient** from `package:http/testing.dart` to mock HTTP responses in service tests
- **registerServices() / locator.reset()** in `setUp` and `tearDown`  
- **`Completer<T>` pattern** to control async timing in widget tests  
- **testWidgets** to verify UI state, not just unit behavior  
- Direct instantiation of `AlertService()` to test private dialog widgets  
- `tester.binding.setSurfaceSize()` to prevent layout overflow in widget tests  

### Key Test Coverage

- **`ai_chatbot_service.dart`**: Covers `sendMessage` and `clearHistory`, including error handling
- **`ai_user_summary_service.dart`**: Covers `generateUserSummary`, including error handling
- **`ai_scenario_feedback_service.dart`**: Covers `generateScenarioFeedback`, including error handling
- **`ai_speech_to_text_service.dart`**: Covers `transcribeAudio`, including error handling
- **`ai_translation_service.dart`**: Covers `translateText`, `clearTranslationCache` and cache size tracking
- **`home_view_model.dart`**: Covers summary generation, translation toggle, caching, navigation and user data refresh
- **`chatbot_view_model.dart`**: Covers message flow, clear history, translation toggle, caching
- **`chatbot_view.dart`**: Covers UI elements, offline banner, input area, translation button, loading indicator
- **`alert_service.dart`**: Covers AI feedback generation, button states, spinners, translation toggle

### Testing Limitations

- **`chatbot_view_model.dart`**: The `startRecording` and `stopRecording` methods instantiate `Record()` directly, which requires real microphone permissions and cannot be tested.  
- **`chatbot_view.dart`**: Microphone and recording UI elements, such as buttons and waveform, are tied to the real `Record` instance, preventing simulation in tests.  
- **`home_view.dart`**: Uses localisation (`S.of(context)`), `CachedNetworkImage`, `Marquee` and `DigDrawer`, all of which do not function in the test environment.  
- **`alert_service.dart`**: Only `feedbackDialog` was tested as part of this refactor (it uses the AI feedback and translation services). The non-AI methods were out of scope and were untested.
- **`General limitations`**: Platform channels (mic, camera), localisation, third-party widgets and direct instantiation of services limit testability and mockability.

---

## Summary

- Mobile app now fully integrates **AI features**: chatbot, user summary, scenario feedback, speech-to-text, translation and delete history.  
- Frontend is enhanced with **intuitive UI components**, including translation buttons, trash icons and loading indicators.  
- Architecture and MVVM pattern maintain clear separation of concerns.  
- Test suite covers the majority of AI-related functionality, with platform-specific limitations noted.  


