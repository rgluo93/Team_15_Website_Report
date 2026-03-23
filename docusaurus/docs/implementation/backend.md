---
sidebar_position: 2
---
# Backend/API Layer Implementation

At the core of our backend is a RESTful API implemented using FastAPI, a robust and asynchronous Python backend web framework.

## FastAPI Background

FastAPI is built on top of Starlette and operates within the ASGI (Asynchronous Server Gateway Interface) ecosystem and is being served with Uvicorn. ASGI is a specification that defines how asynchronous Python applications communicate with web servers, enabling efficient handling of concurrent requests. Uvicorn is a lightweight ASGI server responsible for listening for incoming HTTP requests, converting them into the ASGI format, passing them to the application, and returning the resulting HTTP responses to the client. Starlette is an asynchronous web framework that provides the core web functionality, including routing, middleware, request and response handling, and support for WebSockets. FastAPI builds on top of Starlette by adding higher-level features such as automatic request validation using Python type hints and dependency injection. Together, these components form an extremely high-performance and easy to use Python web framework.

## API Routing

The API layer is responsible for handling client requests, orchestrating business logic, and interfacing with core services such as the LLM, RAG pipeline, and data storage. FastAPI allows us to specify dependencies for each endpoint, such as database connections or authentication requirements. The API is organized into multiple routers, each managing related endpoints. The main application router links these modular routers together to create a unified API. The API codebase is organized under the `api` directory.

### Key Files

- `main.py`: Entry point for the FastAPI application, including app instantiation and middleware setup.
	<!-- TODO: Insert code block -->
- `routers/`: Contains modular route definitions for different API endpoints.
	<!-- TODO: Insert code block -->
- `dependencies.py`: Defines shared dependencies such as database sessions and service clients.
- `middleware.py`: Implements custom middleware for API key verification.
- `config.py`: Manages environment variables, CORS configurations, and integrations to databases. Creates a global settings instance which other modules can import from.

## Routing and Endpoints

API endpoints are grouped by functionality and registered using FastAPI’s router mechanism, allowing for modular and maintainable code organisation. For example, user summary is grouped into its own endpoint as it is a separate feature.

Each endpoint validates incoming request data using Pydantic models, ensuring type safety and consistent data handling, and returns standardized JSON responses.

**Example schema**
<!-- TODO: Insert code block -->

Authentication and authorization are implemented through FastAPI’s dependency injection system, enabling reusable and centralized access control across endpoints.

## Integration with Core Services and Asynchronous

The API layer interacts with the LLM service, RAG pipeline, and Redis cache through well-defined service interfaces, ensuring clear separation of concerns and maintainability. Asynchronous calls are used throughout the system when interacting with these interfaces to maximise throughput and scalability, enabling efficient handling of concurrent requests.

## System Reliability and Observability Infrastructure

Core logic is separated from infrastructure through a dedicated utils layer to ensure resilience and transparency. A custom exception hierarchy and global handlers was implemented to catch failures automatically, returning standardized JSON responses that provide clear feedback while preventing system crashes. Complementing this, the observability engine produces machine-readable JSON logs enriched with contextual metadata, such as user_id, request endpoint, and operation duration_ms, allowing for high-precision monitoring and rapid diagnosis in production environments.
