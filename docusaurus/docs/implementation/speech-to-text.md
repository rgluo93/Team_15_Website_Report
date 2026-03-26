---
sidebar_position: 7
sidebar_label: Speech to Text
---

# Speech to Text 

Implemented as a hybrid frontend + backend pipeline:

1. Browser records microphone audio.
2. Frontend converts the recording to WAV and posts it to Laravel (`/transcribe`).
3. Laravel proxies the file to FastAPI (`/api/v1/speech-to-text/transcribe`) with API key auth.
4. FastAPI normalises incoming audio to mono 16kHz PCM WAV (if needed).
5. `TranscriptionService` runs Vosk inference and returns text.
6. Frontend appends the transcription into chat input or scenario textarea.

---

## Frontend Voice Capture and Submission

The shared recorder utility handles microphone toggling, WAV encoding, and upload to the Laravel endpoint.

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

```js
var response = await fetch(cfg.transcribeUrl, {
  method: 'POST',
  headers: { 'X-CSRF-TOKEN': getCsrf() },
  body: formData
});

if (data.success && data.data && data.data.transcription) {
  var text = data.data.transcription.trim();
  inputEl.value = inputEl.value + (inputEl.value ? ' ' : '') + text;
  inputEl.dispatchEvent(new Event('input', { bubbles: true }));
}
```

**Source:** `public/assets/js/speech-recorder.js`

---

## Laravel Proxy Endpoint

Laravel accepts browser uploads, validates allowed audio MIME types, and forwards the file to FastAPI using multipart upload.

```php
$fastApiUrl = $this->fastApiBaseUrl . '/api/v1/speech-to-text/transcribe';
$cfile = new \CURLFile($file->getRealPath(), $file->getMimeType(), $file->getClientOriginalName());

$ch = curl_init($fastApiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, ['file' => $cfile]);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
	'X-API-Key: ' . $fastApiKey
]);
```

**Source:** `app/Http/Controllers/TranscribeController.php`

Route exposure in web app:

```php
Route::post('/transcribe', 'TranscribeController@transcribe')->name('transcribe');
```

**Source:** `routes/web.php`

---

## FastAPI Speech Router and Audio Normalization

FastAPI exposes the speech endpoint under `/api/v1/speech-to-text/transcribe`. Non-WAV inputs (e.g., WebM, MP3, OGG) are converted before inference.

```python
if file_ext != '.wav' or file.content_type not in ['audio/wav', 'audio/wave', 'audio/x-wav']:
	audio = AudioSegment.from_file(io.BytesIO(audio_bytes))

	# Convert to mono, 16kHz, 16-bit PCM WAV
	audio = audio.set_channels(1)
	audio = audio.set_frame_rate(16000)
	audio = audio.set_sample_width(2)

	wav_buffer = io.BytesIO()
	audio.export(wav_buffer, format='wav', parameters=["-acodec", "pcm_s16le"])
	audio_bytes = wav_buffer.getvalue()
```

**Source:** `ai_resource/api/routers/speech_to_text.py`

---

## Vosk Transcription Service

The service loads a local Vosk model and performs chunked recognition with `KaldiRecognizer`.

```python
class TranscriptionService:
	def __init__(self, model_path: str = "speech_to_text/vosk-model-small-en-us-0.15", sample_rate: int = 16000):
		self.model_path = model_path
		self.sample_rate = sample_rate
		self.chunk_size = 4000
		self.model: Optional[Model] = None
		self._load_model()
```

```python
rec = KaldiRecognizer(self.model, self.sample_rate)
rec.SetWords(True)

while True:
	data = wf.readframes(self.chunk_size)
	if len(data) == 0:
		break
	if rec.AcceptWaveform(data):
		result = json.loads(rec.Result())
		if result.get('text'):
			results.append(result['text'])

final_result = json.loads(rec.FinalResult())
if final_result.get('text'):
	results.append(final_result['text'])
```

**Source:** `ai_resource/speech_to_text/transcription_service.py`

---

## Startup and Deployment Notes

Speech-to-text service initializes during FastAPI startup and degrades gracefully if the model is unavailable.

```python
try:
	get_transcription_service()
	logger.info("✓ TranscriptionService (Vosk) initialized successfully")
except HTTPException as e:
	logger.warning(
		f"Speech-to-text service unavailable at startup: {e.detail}. "
		"The API will continue running without speech-to-text support until the model is installed."
	)
```

**Source:** `ai_resource/api/main.py`

Docker image setup includes the Vosk model and FFmpeg for conversion support:

```dockerfile
RUN apt-get update && apt-get install -y \
	curl \
	ffmpeg \
	wget \
	unzip

RUN mkdir -p /app/speech_to_text && \
	wget -q -O /tmp/vosk-model.zip https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip && \
	unzip -q /tmp/vosk-model.zip -d /app/speech_to_text && \
	rm /tmp/vosk-model.zip
```

**Source:** `ai_resource/Dockerfile`

---

## Key Endpoints

- Web app upload endpoint: `POST /transcribe`
- FastAPI transcription endpoint: `POST /api/v1/speech-to-text/transcribe`
- FastAPI speech health endpoint: `GET /api/v1/speech-to-text/health`

