---
sidebar_position: 1
---

# Mobile

## Introduction

The LeadNow mobile application is built with **Flutter**, Google's open-source UI framework for building natively compiled applications for iOS and Android from a single codebase. Flutter uses the Dart programming language and allows teams to ship consistent, high-performance apps across platforms without maintaining separate codebases.

This section outlines the AI-related updates made to the LeadNow mobile application, covering new features, UI changes and architecture. All AI features communicate with the Azure-hosted FastAPI backend.

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

### Service Pattern

All services follow the same structure: a POST or DELETE request to the backend with an API key, a timeout and error handling for different HTTP status codes. Below is an example from `ai_chatbot_service.dart`:

```dart
Future<String> sendMessage(String userId, String question) async {
  try {
    final uri = Uri.parse('${Config.aiBaseUrl}/api/v1/chatbot/chat');

    final response = await _client.post(
      uri,
      headers: {
        'x-api-key': Config.aiApiKey,
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'user_id': userId,
        'question': question,
      }),
    ).timeout(const Duration(seconds: 30));

    if (response.statusCode == 200) {
      final Map<String, dynamic> responseData = jsonDecode(response.body);
      if (responseData['success'] == true && responseData['data'] != null) {
        final aiResponse = responseData['data']['response'] ??
                          responseData['data']['message'];
        if (aiResponse == null || aiResponse.toString().trim().isEmpty) {
          return 'AI service returned an empty response.';
        }
        return aiResponse.toString();
      } else {
        return 'AI service returned an unexpected response format.';
      }
    } else if (response.statusCode == 422) {
      return 'Invalid request. Please check your input and try again.';
    } else if (response.statusCode == 500) {
      return 'AI service encountered an internal error. Please try again later.';
    } else {
      return 'AI service returned an error (${response.statusCode}). Please try again.';
    }
  } on TimeoutException {
    return 'Request timed out. Please check your internet connection and try again.';
  } on http.ClientException {
    return 'Unable to reach the AI service. Please try again later.';
  } catch (e) {
    return 'AI service is currently unavailable. Please try again later.';
  }
}
```

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

The app follows the **MVVM (Model-View-ViewModel)** pattern using the **Stacked** framework. MVVM separates the UI from business logic: Views only handle what the user sees, while ViewModels manage state and coordinate service calls, making the codebase easier to test and maintain.

- **Views:** purely UI, no business logic.
- **ViewModels:** manage state, handle user actions and call Services/Repositories.
- **Services:** responsible for a single concern each (e.g. chatbot, translation, speech-to-text).
- **Local storage:** ObjectBox is used to persist chat history and cached summaries.
- **Offline handling:** `isOffline` from the user repository is checked before making AI calls, preventing unnecessary requests when the device is offline.


