---
sidebar_position: 4
---

# System Testing 

As the AI Resource is deployed as a live cloud service accessible via a public URL, system testing was conducted by sending cURL requests directly against the deployed endpoints. This tests the entire system end-to-end, from the FastAPI backend, through the LangGraph workflow, MCP tool calls, RAG, and database queries, under real network conditions, validating that all components interact correctly as a unified deployed service.

For conducting system tests, two approaches were used: the requests library to validate endpoint availability and response schema, and semantic similarity scoring to evaluate the correctness of AI-generated responses.

### Requests library

To perform system testing against the deployed service, the requests library was used to send HTTP requests to the public URL. The response is then checked for a status code of 200 indicating success and that the response body conforms to the expected schema. Below is an example sending a POST request to the user summary endpoint 

```python
@pytest.mark.system
def test_user_summary_endpoint_schema_and_similarity(api_base_url: str, api_key: str) -> None:
	"""Call the user summary endpoint and validate schema and similarity."""

	url = f"{api_base_url}/api/v1/user-summary/generate"

	payload = {
		"user_id": "test-user-123",
		"modules_completed": "Module 1: Classroom Management (2024-01-15), Module 2: Student Engagement (2024-02-10)",
		"topics_covered": "Classroom Management, Student Engagement",
		"all_modules": "Module 1: Classroom Management, Module 2: Student Engagement, Module 3: Assessment Strategies",
		"additional_details": "Completed quizzes with an average score of 85%, actively participated in discussions."
	}

	headers = {
		"Accept": "application/json",
		"Content-Type": "application/json",
		"X-API-Key": api_key,
	}

	response = requests.post(url, json=payload, headers=headers, timeout=30)

	# Basic HTTP status check
	assert response.status_code == 200, (
		f"Expected 200 from user summary endpoint, got {response.status_code}: {response.text}"
	)

	body = response.json()

	# Validate StandardResponse schema structure
	assert isinstance(body, dict), "Response body should be a JSON object."
	assert body.get("success") is True, "StandardResponse.success should be True."
	assert "data" in body, "StandardResponse should contain 'data' field."
	assert isinstance(body["data"], dict), "StandardResponse.data should be an object."
	assert "summary" in body["data"], "UserSummaryResponseData should contain 'summary'."
	assert "user_id" in body["data"], "UserSummaryResponseData should contain 'user_id'."
	assert body["data"]["user_id"] == payload["user_id"], "user_id should echo the request value."
```
### Semantic similarity scoring

AI responses are non-deterministic by nature — given the same input, a language model may produce a different response each time due to the stochastic sampling process during token generation. This means traditional testing strategies that compare an exact expected output against the generated output are not suitable, as two responses can be semantically identical while differing in wording, phrasing, or structure.

To address this, semantic similarity scoring was used to evaluate AI response correctness. Rather than checking for an exact match, the expected and actual responses are each converted into vector embeddings using the `all-MiniLM-L6-v2` sentence embedding model. Cosine similarity is then computed between the two embedding vectors, measuring the angle between them in vector space as a proxy for semantic closeness. If the resulting similarity score exceeds a defined threshold, the test passes; if it falls below, the test is rejected. This allows the test suite to accept responses that convey the same meaning as the expected output, regardless of the exact wording used as semantic similarity captures the underlying meaning rather than surface-level text. This approach is essential for robustly testing AI-generated content, which can vary widely in expression while still being correct.

```python
class SystemTestEmbedder(TextEmbedder):
    def __init__(self) -> None:
        # Use CPU and disable verbose logging for tests
        super().__init__(model_kwargs={"device": "cpu"}, verbose=False)

    @staticmethod
    def _cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
        """Compute cosine similarity between two embedding vectors."""

        if not vec1 or not vec2 or len(vec1) != len(vec2):
            return 0.0

        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        norm1 = sqrt(sum(a * a for a in vec1))
        norm2 = sqrt(sum(b * b for b in vec2))

        if norm1 == 0.0 or norm2 == 0.0:
            return 0.0

        return dot_product / (norm1 * norm2)

    def check_similarity(self, text1: str, text2: str) -> float:
        """Embed two responses and return their cosine similarity score."""

        emb1 = self.embed_query(text1)
        emb2 = self.embed_query(text2)
        return self._cosine_similarity(emb1, emb2)

@pytest.mark.system
def test_user_summary_endpoint_schema_and_similarity(api_base_url: str, api_key: str) -> None:
	"""Call the user summary endpoint and validate schema and similarity."""

	url = f"{api_base_url}/api/v1/user-summary/generate"

	payload = {
		"user_id": "test-user-123",
		"modules_completed": "Module 1: Classroom Management (2024-01-15), Module 2: Student Engagement (2024-02-10)",
		"topics_covered": "Classroom Management, Student Engagement",
		"all_modules": "Module 1: Classroom Management, Module 2: Student Engagement, Module 3: Assessment Strategies",
		"additional_details": "Completed quizzes with an average score of 85%, actively participated in discussions."
	}

	headers = {
		"Accept": "application/json",
		"Content-Type": "application/json",
		"X-API-Key": api_key,
	}

	response = requests.post(url, json=payload, headers=headers, timeout=30)
	body = response.json()

	generated_summary = body["data"]["summary"]

	# Define a desired/expected description to compare against.
	expected_summary = (
		"The user has completed two modules on Classroom Management and Student Engagement with strong "
		"participation and an average quiz score around 85%. The next recommended step is to study "
		"Assessment Strategies to continue improving their teaching practice."
	)

	embedder = SystemTestEmbedder()
	similarity = embedder.check_similarity(generated_summary, expected_summary)

	# For LLM outputs we use a moderate similarity threshold to allow variation.
	assert similarity >= 0.6, (
		f"Summary similarity too low (got {similarity:.3f}); LLM output may be off-topic."
	)
```

### Test results

| System | Test File | Tests | Endpoint Tested |
|--------|-----------|-------|-----------------|
| Chatbot endpoints | `test_chatbot.py` | 4 | `/api/v1/chatbot/chat` |
| Education officer agent endpoints | `test_eo_agent.py` | 6 | `/api/v1/chatbot/history/{user_id}` |
| Health endpoints | `test_health.py` | 2 | `/api/v1/health` |
| Scenario feedback endpoints | `test_scenario_feedback.py` | 3 | `/api/v1/scenario-feedback/generate` |
| Translate text endpoints | `test_translate_text.py` | 2 | `/api/v1/translate` |
| User summary endpoints | `test_user_summary.py` | 3 | `/api/v1/user-summary/generate` |

## Web App System Testing (Playwright E2E)

The LeadNow web dashboard also includes browser-level system tests using Playwright. These tests execute realistic user workflows against the running Laravel application and verify visible behavior in a real browser context.

### E2E Scope

| E2E Suite | File | Scenarios Covered |
|-----------|------|-------------------|
| **Teacher chatbot workflow** | `teacher-chatbot-workflow.spec.js` | Teacher login, chatbot open, successful AI response rendering, clear-history confirmation and empty state |
| **Education officer chatbot workflow** | `eo-chatbot-workflow.spec.js` | EO login, workflow-summary response handling, thought-process toggle, workflow arrows and step rendering |

### E2E Test Configuration

- Test runner: `@playwright/test`
- Base URL: `E2E_BASE_URL` (defaults to `http://127.0.0.1:8000`)
- Artifacts: trace on first retry, screenshots/videos on failure
- Retry strategy: retries in CI, no retries locally

### E2E Execution

- Run all suites: `npm run test:e2e`
- Run EO suite only: `npm run test:e2e:eo`
- Run teacher suite only: `npm run test:e2e:teacher`

### Environment Variables

- `E2E_BASE_URL` (optional)
- `E2E_EO_LOGIN` (required for EO suite)
- `E2E_EO_PASSWORD` (required for EO suite)
- `E2E_TEACHER_LOGIN` (required for teacher suite)
- `E2E_TEACHER_PASSWORD` (required for teacher suite)
