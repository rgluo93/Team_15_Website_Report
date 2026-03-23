---
sidebar_position: 11
---

# Web App

 The frontend changes were primarily made to integrate AI capabilities into the existing LeadNow Laravel Web App. The implementation was additive, meaning AI features were layered onto current UI patterns and views rather than rewriting the existing frontend.

## 1. AI Assistant Chat (Teacher)

The teacher dashboard now includes an AI chat with message input, response rendering and user-friendly fallback messages when the AI service is unavailable.

```js
async function sendChatMessage() {
	const input = document.getElementById('chatInput');
	const message = input.value.trim();
	if (!message) return;

	addMessageToChat('user', message);
	input.value = '';
	showTypingIndicator();

	try {
		const response = await fetch('/dashboard/chatbot', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRF-TOKEN': document.querySelector('meta[name="_token"]').getAttribute('content')
			},
			body: JSON.stringify({ question: message })
		});

		const data = await response.json();
		removeTypingIndicator();

		if (data.data && data.data.response) {
			addMessageToChat('bot', data.data.response);
		} else {
			addMessageToChat('bot', 'Sorry, I encountered an error. Please try again.');
		}
	} catch (error) {
		removeTypingIndicator();
		addMessageToChat('bot', 'Sorry, I couldn\'t process your message. Please make sure the AI service is running.');
	}
}
```

**Source:** `resources/views/dashboard/partials/client.blade.php`

---

## 2. EO Agent (Workflow Summary)

For education officers, the chatbot supports a collapsible thought-process panel when `workflow_summary` is returned by the backend. This improves explainability by exposing the intermediate steps behind a recommendation.

```js
const workflowSummary = Array.isArray(data.data.workflow_summary)
	? data.data.workflow_summary
	: [];

addMessageToChat('bot', data.data.response, {
	workflowSummary,
});
```

```js
if (type === 'bot' && Array.isArray(options.workflowSummary) && options.workflowSummary.length > 0) {
	const workflowElement = createWorkflowSummaryElement(options.workflowSummary, options);
	messageDiv.appendChild(workflowElement.element);
}
```

**Source:**
- `resources/views/dashboard/partials/edu_officer.blade.php`
- `resources/js/chat-module.js`

---

## 3. AI-Generated Scenario Feedback in SBL

AI-generated scenario feedback is surfaced directly in the Scenario-Based Learning flow as **Expert Feedback**, shown together with the learner's selected response and justification. This keeps reflection and guidance in one interface.

```blade
<li class="list-group-item d-flex align-items-center mb-4" style="background: #e7f1f4;">
	<div class="row">
		<div class="col-md-12">
			<h6 class="mb-1">@lang('Expert Feedback')</h6>
			<small class="text-muted">{{ $responded->feedback }}</small>
		</div>
	</div>
</li>
```

**Source:** `resources/views/user/client/partials/module_tabs/scenarios.blade.php`

---

## 4. Speech to Text Input for Chat and Scenario Responses

Voice input was integrated into both chatbot and scenario response flows to improve accessibility and speed of response authoring.

### Scenario Voice Input Trigger

```blade
<button type="button" class="scenario-mic-btn"
	data-textarea-id="just-{{ $scenario->id }}-{{$key}}"
	onclick="toggleSpeechRecordingFor(this)"
	title="Click to speak">
	...
</button>
```

### Shared Speech Recorder Binding

```js
global.toggleSpeechRecordingFor = function (button) {
	var textareaId = button.getAttribute('data-textarea-id');
	cfgEl = {
		micBtn: button,
		micIcon: button.querySelector('svg'),
		statusDiv: document.getElementById('status-' + textareaId),
		inputEl: document.getElementById(textareaId),
	};
	global.toggleSpeechRecording();
};
```

**Source:**
- `resources/views/client_modules/partials/sbl-scenario.blade.php`
- `public/assets/js/speech-recorder.js`

---

## 5. In-Context Translation Popup

A contextual translation popup allows users to highlight text and request translation without leaving the current page.

```js
$.ajax({
	url: '/translate',
	method: 'POST',
	data: {
		_token: $('meta[name="_token"]').attr('content'),
		text: selectedText,
		target_lang: 'sw'
	},
	success: function (res) {
		var translated = (res.data && res.data.translated_text)
			? res.data.translated_text : (res.translated_text || '');
		resultBox.textContent = translated;
		resultBox.style.display = 'block';
	}
});
```

**Source:**
- `resources/views/layouts/client/partials/js.blade.php`
- `resources/views/layouts/edu_officer/partials/js.blade.php`

---

## 6. AI Learning Journey Summary Panel

The dashboard includes a user summary card that calls an AI summary endpoint, handles loading and error states, and caches the latest result locally for quicker reloads.

```js
const response = await fetch('/dashboard/user-summary', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		'X-CSRF-TOKEN': document.querySelector('meta[name="_token"]').getAttribute('content')
	},
	body: JSON.stringify({})
});

if (data.success && data.data && data.data.summary) {
	contentEl.innerHTML = parseMarkdown(data.data.summary);
	localStorage.setItem('userSummary', data.data.summary);
	localStorage.setItem('userSummaryFingerprint', currentFingerprint);
}
```

**Source:** `resources/views/dashboard/partials/client.blade.php`

---

## 7. Dashboard AI Route Surface (Frontend Integration Endpoints)

The dashboard frontend is wired to dedicated Laravel routes that proxy AI service calls.

```php
Route::post('/dashboard/user-summary', 'DashboardController@generateUserSummary')->name('dashboard.user-summary');
Route::post('/dashboard/chatbot', 'DashboardController@chatbot')->name('dashboard.chatbot');
Route::delete('/dashboard/chatbot/history', 'DashboardController@clearChatHistory')->name('dashboard.chatbot.clear');
Route::post('/dashboard/eo-chatbot', 'DashboardController@chatbotEO')->name('dashboard.eo-chatbot');
Route::post('/dashboard/eo-chatbot/stream', 'DashboardController@chatbotEOStream')->name('dashboard.eo-chatbot.stream');
Route::post('/transcribe', 'TranscribeController@transcribe')->name('transcribe');
Route::post('/translate', 'TranslateController@translate')->name('translate');
```

**Source:** `routes/web.php`


