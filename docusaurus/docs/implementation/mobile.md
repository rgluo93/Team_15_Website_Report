---
sidebar_position: 2
---

# Mobile

## Introduction

The LeadNow mobile application is built with **Flutter**, Google's open-source UI framework for building natively compiled applications for iOS and Android from a single codebase. Flutter uses the Dart programming language and allows teams to ship consistent, high-performance apps across platforms without maintaining separate codebases.

This section covers the AI features added to the LeadNow Flutter app, including new services and UI components built on top of the existing codebase. All AI features communicate with the Azure-hosted FastAPI backend.

## AI Features Implementation

### AI Services

There are 5 services handling AI features:

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

- Available via a floating action button on the home dashboard.
- Chat history is persisted locally using ObjectBox.
- **Functions called:** `sendMessage()`, `clearHistory()`

### User Progress Summary

- AI-generated progress summaries displayed on the home dashboard.
- Cached locally with a 1-hour cooldown before regeneration.
- **Functions called:** `generateUserSummary()`

### Scenario-Based Learning Feedback

- Available after submitting scenario responses via a **Generate Feedback** button.
- AI feedback is shown alongside the user’s answer and expert answer.
- **Functions called:** `generateScenarioFeedback()`

### Speech-to-Text

- Allows users to record voice input instead of typing, with audio transcribed and inserted into the relevant input field.
- Available in the chatbot input bar and per response field in scenario-based learning.
- **Functions called:** `transcribeAudio()`

### Language Translation

- Translates AI-generated text between English and Swahili on demand.
- Available per message in the chatbot, as a single toggle on the user summary, and per field in the scenario feedback dialog.
- **Functions called:** `translateText()`, `clearTranslationCache()`

## Frontend Changes

### Chatbot UI (`lib/ui/views/chatbot/chatbot_view.dart`)
- A floating action button in the bottom-right corner opens the chat interface as an overlay.
- Displays an offline banner when the device has no network connection, and a typing indicator while the AI is responding.
- Messages auto-scroll to the latest response, and a trash icon in the header clears the chat history.
- Chat history is persisted locally in **ObjectBox** (`ChatMessage` entity) so conversations are retained between sessions.
- **Speech-to-text:** A single microphone button in the input bar records audio. On stop, the transcribed text is automatically placed into the input field.
- **Translation:** Each AI message bubble has an independent **Translate** button below it, toggling that message between English and Swahili without affecting other messages.

**Input bar (mic, text field, send):**

```dart
Container(
  padding: EdgeInsets.only(
    left: 8, right: 8, top: 8,
    bottom: MediaQuery.of(context).viewInsets.bottom + MediaQuery.of(context).padding.bottom + 8,
  ),
  child: Row(
    children: [
      _buildMicButton(viewModel),
      Expanded(
        child: TextField(
          controller: viewModel.textController,
          maxLines: null,
          textInputAction: TextInputAction.send,
          onSubmitted: (_) => viewModel.sendMessage(),
          decoration: InputDecoration(
            hintText: 'Type your message...',
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(24), borderSide: BorderSide.none),
            filled: true,
            fillColor: Colors.grey[100],
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          ),
        ),
      ),
      InkWell(
        onTap: viewModel.isLoading ? null : () => viewModel.sendMessage(),
        child: SizedBox(
          width: 40, height: 40,
          child: Icon(Icons.send, color: Digcolors().primaryColor(1.0), size: 20),
        ),
      ),
    ],
  ),
)
```

### User Summary Section (`lib/ui/views/home/home_view.dart`)
- A gradient card on the home dashboard displays the AI-generated progress summary with markdown rendering and a last-updated timestamp.
- A **Refresh/Regenerate** button triggers a new summary generation, with a loading state shown while the request is in progress.
- **Translation:** A single **Translate** button on the card toggles the entire summary block between English and Swahili.

**Summary card header (title, translate and refresh buttons):**

```dart
Row(
  children: [
    Icon(Ionicons.analytics_outline, color: Digcolors().primaryColor(1.0), size: 5.w),
    SizedBox(width: 2.w),
    Expanded(child: Text('Your Learning Journey')),
    Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        InkWell(
          onTap: viewModel.isTranslatingSummary ? null : () => viewModel.translateSummary('sw'),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (viewModel.isTranslatingSummary)
                SizedBox(
                  width: 4.w, height: 4.w,
                  child: CircularProgressIndicator(strokeWidth: 2, color: Digcolors().primaryColor(1.0)),
                )
              else
                Icon(
                  viewModel.translatedSummary != null ? Icons.translate_outlined : Icons.translate,
                  size: 4.w, color: Digcolors().primaryColor(1.0),
                ),
              SizedBox(width: 1.w),
              Text(viewModel.translatedSummary != null ? 'Original' : 'Translate'),
            ],
          ),
        ),
        Divider(height: 1, thickness: 1, color: Digcolors().primaryColor(0.3)),
        InkWell(
          onTap: () => viewModel.regenerateSummary(context),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Ionicons.refresh_outline, size: 4.w, color: Digcolors().primaryColor(1.0)),
              SizedBox(width: 1.w),
              Text('Refresh'),
            ],
          ),
        ),
      ],
    ),
  ],
)
```

### Scenario Feedback Dialog (`lib/services/alert_service.dart`)
- A modal dialog displays the user's answer, the expert answer and the AI-generated feedback side by side.
- A **Generate Feedback** button triggers the AI request; a loading spinner is shown while feedback is being fetched.
- **Speech-to-text:** Each response field has its own microphone button. The transcribed text fills that specific answer field.
- **Translation:** Each AI feedback field has an independent **Translate** button, allowing each field to be toggled between English and Swahili independently.

**Generate Feedback button:**

```dart
_aiLoading[index]
    ? SpinKitThreeBounce(color: Colors.purple, size: 5.w)
    : TextButton.icon(
        onPressed: () => _generateForIndex(index),
        icon: const Icon(Icons.auto_awesome, color: Colors.purple),
        label: Text(
          _aiResults[index] == null ? 'Generate AI Feedback' : 'Regenerate AI Feedback',
        ),
      )
```


## Where to Find These Features

| Feature | Location / How to Access |
|---------|-------------------------|
| **General Chatbot** | Tap the chat icon at the bottom-right of the screen to open the chatbot window and start a conversation. |
| **User Progress Summary** | Scroll to the bottom of the page on the home dashboard. Tap **Refresh** to generate an updated summary. |
| **Scenario-Based Learning Feedback** | Within Scenario-Based Learning pages, tap **Resume Session** to enter the activity. After submitting your response, tap the option to generate AI feedback. |
| **Speech-to-Text** | Tap the **microphone** icon in the chatbot or scenario response input to record your response via speech-to-text. |
| **Language Translation** | Tap the **Translate** button on any AI-generated text to toggle between English and Swahili. |

## Architecture

The app follows the **MVVM (Model-View-ViewModel)** pattern using the **Stacked** framework. MVVM separates the UI from business logic: Views only handle what the user sees, while ViewModels manage state and coordinate service calls, making the codebase easier to test and maintain.

- **Views:** purely UI, no business logic.
- **ViewModels:** manage state, handle user actions and call Services/Repositories.
- **Services:** responsible for a single concern each (e.g. chatbot, translation, speech-to-text).
- **Local storage:** ObjectBox is used to persist chat history and cached summaries.
- **Offline handling:** `isOffline` from the user repository is checked before making AI calls, preventing unnecessary requests when the device is offline.


