---
sidebar_position: 2
---

# Unit Testing

## Mobile

The tests focus on the AI functionalities implemented in the LeadNow mobile application.

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
- **`alert_service.dart`**: Covers AI feedback generation, button states, spinners, translation toggle (non-AI methods not tested)

### Testing Limitations

- **`chatbot_view_model.dart`**: The `startRecording` and `stopRecording` methods instantiate `Record()` directly, which requires real microphone permissions and cannot be tested.
- **`chatbot_view.dart`**: Microphone and recording UI elements, such as buttons and waveform, are tied to the real `Record` instance, preventing simulation in tests.
- **`home_view.dart`**: Uses localisation (`S.of(context)`), `CachedNetworkImage`, `Marquee` and `DigDrawer`, all of which do not function in the test environment.
- **`alert_service.dart`**: Only `feedbackDialog` was tested as part of this refactor (it uses the AI feedback and translation services). The non-AI methods were out of scope and were untested.
- **General limitations**: Platform channels (mic, camera), localisation, third-party widgets and direct instantiation of services limit testability and mockability.
