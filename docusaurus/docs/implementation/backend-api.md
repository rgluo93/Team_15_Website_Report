---
sidebar_position: 3
---

# Backend API Implementation

At the core of our backend is a RESTful API implemented using FastAPI, a robust and asynchronous Python backend web framework. 

### FastAPI Background 

FastAPI is built on top of Starlette and operates within the ASGI (Asynchronous Server Gateway Interface) ecosystem and is being served with Uvicorn. ASGI is a specification that defines how asynchronous Python applications communicate with web servers, enabling efficient handling of concurrent requests. Uvicorn is a lightweight ASGI server responsible for listening for incoming HTTP requests, converting them into the ASGI format, passing them to the application, and returning the resulting HTTP responses to the client. Starlette is an asynchronous web framework that provides the core web functionality, including routing, middleware, request and response handling, and support for WebSockets. FastAPI builds on top of Starlette by adding higher-level features such as automatic request validation using Python type hints and dependency injection. Together, these components form an extremely high-performance and easy to use Python web framework.

### API Routing
The API layer is responsible for handling client requests, orchestrating business logic, and interfacing with core services such as the LLM, RAG pipeline, and data storage. FastAPI allows us to specify dependencies for each endpoint, such as database connections or authentication requirements. The API is organized into multiple routers, each managing related endpoints. The main application router links these modular routers together to create a unified API. The API codebase is organized under the api directory.

Key Files
- `main.py`: Entry point for the FastAPI application, including app instantiation and middleware setup.

```python
app = FastAPI(
    title="LeadNow AI Resource API",
    description="REST API for AI-powered features in LeadNow educational platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["Content-Type", "X-API-Key"],
)


app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(AIServiceError, ai_service_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)


API_V1_PREFIX = "/api/v1"

app.include_router(health.router, prefix=API_V1_PREFIX)
app.include_router(chatbot.router, prefix=API_V1_PREFIX)
app.include_router(user_summary.router, prefix=API_V1_PREFIX)
app.include_router(scenario_feedback.router, prefix=API_V1_PREFIX)
app.include_router(whatsapp.router, prefix=API_V1_PREFIX)
app.include_router(speech_to_text.router, prefix=API_V1_PREFIX)
app.include_router(eo_agent.router, prefix=API_V1_PREFIX)
app.include_router(translate_text.router, prefix=API_V1_PREFIX)

@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint with API information.

    Returns:
        dict: API information
    """
    return {
        "service": "LeadNow AI Resource API",
        "version": "1.0.0",
        "status": "running",
        "documentation": "/docs",
        "health_check": f"{API_V1_PREFIX}/health"
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "api.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.api_reload,
        log_level=settings.log_level.lower()
    )
```

- `routers/`: Contains modular route definitions for different API endpoints.

```
routers/
    __init__.py
    chatbot.py
    eo_agent.py
    health.py
    scenario_feedback.py
    speech_to_text.py
    translate_text.py
    user_summary.py
    whatsapp.py
```

- `dependencies.py`: Defines shared dependencies such as database sessions and service clients.

``` python
_chat_service: Optional[ChatService] = None

def initialize_chat_service() -> ChatService:
    """
    Initialize the ChatService singleton on application startup.

    Returns:
        ChatService: Initialized ChatService instance

    Raises:
        RuntimeError: If Azure configuration is invalid
    """
    global _chat_service

    if _chat_service is None:
        if not settings.validate_azure_config():
            raise RuntimeError(
                "Azure OpenAI configuration is incomplete. "
                "Please check environment variables."
            )
        _chat_service = ChatService(
            redis_host=settings.redis_host,
            redis_port=settings.redis_port,
            redis_ssl=settings.redis_ssl,
            redis_password=settings.redis_password or None,
            qdrant_url=settings.qdrant_url
        )
        print(f"✓ ChatService initialized successfully with Azure deployment: {settings.azure_api_deployment}")
        print(f"  └─ Redis: {settings.redis_host}:{settings.redis_port}")
        print(f"  └─ Qdrant: {settings.qdrant_url}")

    return _chat_service
```

- `middleware.py`: Implements custom middleware for API key verification.

```python
def verify_api_key(x_api_key: str = Header(..., description="API key for authentication")):
    """
    Verify API key from request header.

    Args:
        x_api_key: API key from X-API-Key header

    Raises:
        HTTPException: 401 if API key is missing or invalid

    Returns:
        str: The validated API key
    """
    # Use constant-time comparison to prevent timing attacks
    if not secrets.compare_digest(x_api_key, settings.api_key):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key",
            headers={"WWW-Authenticate": "ApiKey"},
        )

    return x_api_key
```

- `config.py`: Manages environment variables, CORS configurations, and integrations to databases. Creates a global settings instance which other modules can import from 

```python
class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    """

    # API Configuration
    api_key: str
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_reload: bool = False
    api_workers: int = 4

    # CORS Configuration
    cors_origins: str = "http://localhost,https://dignitas.dev.leadnow.ke"
    cors_allow_credentials: bool = True

    # Logging Configuration
    log_level: str = "INFO"
    log_format: str = "json"  # or 'text'

    # LLM Configuration
    llm_choice: str = "azure"  # Options: "azure", "gemini"

    # Azure OpenAI Configuration
    azure_api_key: str = ""
    azure_api_endpoint: str = ""
    azure_api_version: str = ""
    azure_api_deployment: str = ""

    # Google Gemini Configuration
    google_api_key: str = ""
    gemini_model: str = "gemini-pro"
    gemini_temperature: float = 0.7

    # WhatsApp Configuration
    whatsapp_token: str = ""
    whatsapp_phone_number_id: str = ""
    whatsapp_verify_token: str = ""

    # Rate Limiting (optional, for future use)
    rate_limit_enabled: bool = False
    rate_limit_per_minute: int = 60

    # Service URLs Configuration
    qdrant_url: str = "http://localhost:6333"
    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_ssl: bool = False
    redis_password: str = ""

    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).parent.parent / ".env.api"),  # Looks for /home/linco/leadnow.ke-v-2.0.0/ai_resource/.env
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

    @property
    def cors_origins_list(self) -> List[str]:
        """Convert comma-separated CORS origins to list."""
        return [origin.strip() for origin in self.cors_origins.split(",")]

    def validate_azure_config(self) -> bool:
        """Validate that all Azure configuration is present."""
        required_fields = [
            self.azure_api_key,
            self.azure_api_endpoint,
            self.azure_api_version,
            self.azure_api_deployment
        ]
        return all(field for field in required_fields)


# Global settings instance
settings = Settings()
```

### Endpoints and Schema Definitions

API endpoints are grouped by functionality and registered using FastAPI’s router mechanism, allowing for modular and maintainable code organisation. For example, user summary is grouped into its own endpoint as it is a separate feature 

```python
router = APIRouter(
    prefix="/user-summary",
    tags=["User Summary"],
    dependencies=[Depends(verify_api_key)]
)


@router.post(
    "/generate",
    response_model=StandardResponse[UserSummaryResponseData],
    summary="Generate User Summary",
    description="Generate an AI-powered summary of user's learning progress and recommendations",
    status_code=status.HTTP_200_OK
)
async def generate_summary(
    request: UserSummaryRequest,
    chat_service: ChatService = Depends(get_chat_service)
) -> StandardResponse[UserSummaryResponseData]
```

Each endpoint validates incoming request data using Pydantic models, ensuring type safety and consistent data handling, and returns standardized JSON responses. 

```python
class UserSummaryRequest(BaseModel):

    user_id: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Unique identifier for the user",
        examples=["user-123"]
    )
    modules_completed: str = Field(
        ...,
        min_length=1,
        description="Description of modules completed with dates",
        examples=["Module 1: Classroom Management (2024-01-15), Module 2: Student Engagement (2024-02-10)"]
    )
    topics_covered: str = Field(
        ...,
        min_length=1,
        description="List or description of topics covered",
        examples=["Classroom Management, Student Engagement, Assessment Strategies"]
    )
    all_modules: str = Field(
        ...,
        min_length=1,
        description="List of all available modules in the system",
        examples=["Module 1: Classroom Management, Module 2: Student Engagement, Module 3: Assessment Strategies, Module 4: Differentiated Instruction"]
    )
    additional_details: str = Field(
        default="",
        description="Any additional user activity details",
        examples=["Active participation in quizzes, completed 5 action plans"]
    )

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user-123",
                "modules_completed": "Module 1: Classroom Management (2024-01-15), Module 2: Student Engagement (2024-02-10)",
                "topics_covered": "Classroom Management, Student Engagement",
                "all_modules": "Module 1: Classroom Management, Module 2: Student Engagement, Module 3: Assessment Strategies",
                "additional_details": "Active participation, completed all quizzes with average score of 85%"
            }
        }


class UserSummaryResponseData(BaseModel):
    summary: str = Field(..., description="AI-generated summary of user's learning progress and recommendations")
    user_id: str = Field(..., description="User identifier")

    class Config:
        json_schema_extra = {
            "example": {
                "summary": "You have successfully completed 2 modules covering Classroom Management and Student Engagement. Your progress shows strong engagement with an 85% average quiz score. Based on your learning path, we recommend exploring Module 3: Assessment Strategies next to build on your classroom management skills.",
                "user_id": "user-123"
            }
        }

```

### Asynchronous Integration with Core Services

The API layer interacts with the LLM service, RAG pipeline, and Redis cache through well-defined service interfaces, ensuring clear separation of concerns and maintainability. Asynchronous calls are used throughout the system when interacting with these interfaces to maximise throughput and scalability, enabling efficient handling of concurrent requests.

``` python
@router.post("/translate", response_model=StandardResponse[TranslateResponse])
async def translate(request: TranslateRequest) -> StandardResponse[TranslateResponse]:
		try:
				translated = await translate_text(
						text=request.text,
						direction="english_to_swahili" if request.target_lang == "sw" else "swahili_to_english"
				)
		except Exception as e:
				raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")

		return StandardResponse(
				data=TranslateResponse(translated_text=translated)
		)
```

### System Reliability and Observability Infrastructure

Core logic is separated from infrastructure through a dedicated utils layer to ensure resilience and transparency. A custom exception hierarchy and global handlers was implemented to catch failures automatically, returning standardized JSON responses that provide clear feedback while preventing system crashes.

```python
class AIServiceError(Exception):
    """Base exception for AI service errors."""

    def __init__(self, message: str, status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class AzureAPIError(AIServiceError):
    """Exception for Azure OpenAI API errors."""

    def __init__(self, message: str = "Azure OpenAI API error occurred"):
        super().__init__(message, status.HTTP_503_SERVICE_UNAVAILABLE)

async def ai_service_exception_handler(request: Request, exc: AIServiceError) -> JSONResponse:
    logger.error(f"AI Service error: {exc.message}", extra={"endpoint": request.url.path})

    error_response = ErrorResponse(
        error=ErrorDetail(
            code="AI_SERVICE_ERROR",
            message=exc.message,
            details=None
        ),
        timestamp=datetime.utcnow()
    )

    return JSONResponse(
        status_code=exc.status_code,
        content=error_response.model_dump(mode="json")
    )


```

Complementing this, the observability engine produces machine-readable JSON logs enriched with contextual metadata, such as user_id, request endpoint, and operation duration_ms, allowing for high-precision monitoring and rapid diagnosis in production environments.

```python
class JSONFormatter(logging.Formatter):
    """
    Custom JSON formatter for structured logging.
    """

    def format(self, record: logging.LogRecord) -> str:
        """
        Format log record as JSON.

        Args:
            record: Log record to format

        Returns:
            str: JSON-formatted log message
        """
        log_data: Dict[str, Any] = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }

        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)

        # Add extra fields if present
        if hasattr(record, "user_id"):
            log_data["user_id"] = record.user_id
        if hasattr(record, "endpoint"):
            log_data["endpoint"] = record.endpoint
        if hasattr(record, "duration_ms"):
            log_data["duration_ms"] = record.duration_ms

        return json.dumps(log_data)

# Create global logger instance
logger = setup_logger("leadnow_ai_api", settings.log_level, settings.log_format)
```
