---
sidebar_position: 9
---

# Model Context Protocol

### Introduction 

Model Context Protocol (MCP) is an open standard developed by Anthropic that provides a uniform interface for AI applications to connect to external tools, resources, and workflows. By standardising how agents interact with external systems, MCP makes it straightforward to extend an agent's capabilities beyond what a standalone LLM can provide. In this project, MCP is used to give the education officer agent access to three external systems: the LeadNow SQL database, the WhatsApp Cloud API, and a translation mode. MCP follows a client-server architecture, where the client is responsible for making calls to available tools and resources, and the server hosts those tools and acts as the entrypoint to the external system.


### MCP Server

The MCP server is built using the FastMCP framework, which provides a lightweight abstraction for defining and serving MCP-compatible tools. Under the hood, FastMCP uses Starlette to handle transport via Streamable HTTP. Unlike a regular request-response cycle where the server sends a single response and closes the connection, Streamable HTTP keeps the connection open and allows the server to push multiple updates back to the client over a single request, enabling real-time streaming of tool results. Tools are exposed to the agent by decorating functions with the @mcp.tool() decorator, which registers them with the server and makes them available for the client to discover and invoke.

``` python 
mcp = FastMCP(
    "leadnow-tools",
    stateless_http=True,  # For Azure Container Apps scalability
    json_response=True,    # JSON responses instead of SSE
    host="0.0.0.0",       # Listen on all interfaces
    port=8001              # Port for MCP server
)

@mcp.tool()
async def execute_sql(query: str) -> str:
    return await execute_sql_tool(query)


@mcp.tool()
async def send_whatsapp(phone_number: str, message: str) -> str:
    logger.info(f"WhatsApp tool called: {phone_number}")
    return await send_whatsapp_tool(phone_number, message)


@mcp.tool()
async def send_whatsapp_template(
    phone_number: str, 
    template_name: str, 
    language: str = "en",
    parameters: str = ""
) -> str:
    from mcp_server.tools.whatsapp_tool import send_whatsapp_template_tool
    logger.info(f"WhatsApp template tool called: {template_name} to {phone_number}")
    return await send_whatsapp_template_tool(phone_number, template_name, language, parameters)


@mcp.tool()
async def translate_text(text: str, direction: str) -> str:
    return await translate_text_tool(text, direction)


def main():
    mcp.run(transport="streamable-http")
```

The WhatsApp tool and translation tool will be covered in later sections as they are quite detailed. However, we will cover the SQL tool implementation in this section


### SQL Client 

SQLAlchemy connects to the LeadNow MySQL database through an async engine, which manages a pool of reusable connections and abstracts away low-level driver with `aiomysql` and protocol handling. When a query runs, `async with engine.connect() as connection` opens a managed connection from the pool, guaranteeing it is released (and any transaction rolled back) when the block exits even if an exception is raised. SQL Alchemy also provides protection by wrapping every query in SQLAlchemy's `text()` construct. Rather than interpolating values directly into the SQL string, `text()` enforces parameterised execution: bound parameters are sent separately from the SQL command, so the database driver can distinguish code from data and close off the primary SQL injection vector. A second layer of protection validates that every query begins with a read-only keyword (SELECT, SHOW, or DESCRIBE) before it ever reaches `connection.execute()`, rejecting any mutating statement outright and only allowing database reads. After execution, column names from `result.keys()` are zipped with each row to produce plain Python dicts, which are then passed through `sanitize_rows()` to coerce non-serialisable types (e.g. datetime, Decimal) before being returned as a clean JSON structure.


```python 
class SQLClient:
    
    def __init__(
        self,
        host: Optional[str] = None,
        port: Optional[int] = None,
        database: Optional[str] = None,
        username: Optional[str] = None,
        password: Optional[str] = None,
        verbose: bool = True
    ):
        self.verbose = verbose
        
        # Get configuration from environment or parameters
        self.host = host or os.getenv("DB_HOST", "localhost")
        self.port = port or int(os.getenv("DB_PORT", "3306"))
        self.database = database or os.getenv("DB_DATABASE", "leadnow")
        self.username = username or os.getenv("DB_USERNAME", "root")
        self.password = password or os.getenv("DB_PASSWORD", "")
        
        self.async_url = self._build_async_url()
        
        self.async_engine = None
        self.async_session_factory = None
        
        # Metadata for table inspection
        self.metadata = MetaData()
        
        if self.verbose:
            logger.info(f"SQLClient initialized for database: {self.database}@{self.host}:{self.port}")

    def _build_async_url(self) -> str:
        """Build asynchronous database URL."""
        return f"mysql+aiomysql://{self.username}:{self.password}@{self.host}:{self.port}/{self.database}?charset=utf8mb4"
    
    
    def _get_async_engine(self):
        """Get or create asynchronous engine."""
        if self.async_engine is None:
            if self.verbose:
                logger.info("Creating asynchronous database engine...")
            
            self.async_engine = create_async_engine(
                self.async_url,
                echo=False,
                pool_pre_ping=True,
                pool_recycle=3600,
            )
            
            # Create session factory
            self.async_session_factory = async_sessionmaker(
                self.async_engine,
                class_=AsyncSession,
                expire_on_commit=False
            )
            
            if self.verbose:
                logger.info("✓ Asynchronous engine created")
        
        return self.async_engine
    
    async def execute_async(self, query: str) -> List[Dict[str, Any]]:
        # Clean query: remove markdown code blocks if present
        query = self._clean_query(query)
        
        # Validate query
        query_upper = query.strip().upper()
        if not query_upper.startswith("SELECT") and not query_upper.startswith("SHOW") and not query_upper.startswith("DESCRIBE") and not query_upper.startswith("DESC"):
            raise ValueError("Only SELECT, SHOW, DESCRIBE, and DESC queries are allowed for security.")
        
        engine = self._get_async_engine()
        
        try:
            async with engine.connect() as connection:
                logger.info(f"EXECUTING ASYNC QUERY: {text(query)}...")
                result = await connection.execute(text(query))
                
                # Convert result to list of dictionaries
                columns = result.keys()
                rows = []
                for row in result:
                    rows.append(dict(zip(columns, row)))
                
                # Sanitize rows to ensure JSON serializability
                rows = self.sanitize_rows(rows)
                
                if self.verbose:
                    logger.info(f"Query executed successfully. Rows returned: {len(rows)}")
                
                return rows
        
        except Exception as e:
            logger.error(f"Error executing async query: {str(e)}")
            raise
    
    def close(self):
        """Close database connections."""
        if self.sync_engine:
            self.sync_engine.dispose()
            if self.verbose:
                logger.info("Closed synchronous database connection")
        
        if self.async_engine:
            # Async engine disposal should be awaited, but for cleanup we can call it
            if self.verbose:
                logger.info("Closed asynchronous database connection")
```

### MCP Client
The MCP client connects to the MCP server via `streamable_http_client`, which uses an `httpx.AsyncClient` (120-second timeout) as its transport layer. Calling it as an async context manager yields `read_stream and write_stream` which is a bidirectional async channel where `write_stream` carries outgoing requests and `read_stream` delivers responses. These are passed into `ClientSession`, which handles the MCP protocol, including the `session.initialize()` handshake that negotiates capabilities before any tool call. `session.call_tool()` then serialises the request over `write_stream` and awaits the response on `read_stream`.
Before any call reaches the session, `TOOL_PARAM_MAP` maps each tool name to a Pydantic model (e.g. WhatsAppParams, SQLQueryParams).  Validated parameters are serialised via `model_dump()` and forwarded as the tool's `arguments` payload. Convenience wrappers like `send_whatsapp()` provide clean typed signatures on top of this, and adding a new tool requires only a new Pydantic model and a single entry in `TOOL_PARAM_MAP`.

```python

class WhatsAppParams(BaseModel):
    phone_number: str = Field(
        ...,
        min_length=10,
        description="Recipient's phone number in E.164 format (e.g., +254712345678)"
    )
    message: str = Field(
        ...,
        min_length=1,
        max_length=4096,
        description="Message content to send"
    )
    
TOOL_PARAM_MAP = {
    "execute_sql": SQLQueryParams,
    "send_whatsapp": WhatsAppParams,
    "send_whatsapp_template": WhatsAppTemplateParams,
    "translate_text": TranslationParams,
}


async def call_mcp_tool(tool_name: str, **kwargs) -> str:
  
    # Validate tool name
    if tool_name not in TOOL_PARAM_MAP:
        valid_tools = ", ".join(TOOL_PARAM_MAP.keys())
        raise ValueError(
            f"Invalid tool name: '{tool_name}'. "
            f"Valid tools are: {valid_tools}"
        )
    
    # Validate parameters using the appropriate Pydantic model
    param_model = TOOL_PARAM_MAP[tool_name]
    try:
        validated_params = param_model(**kwargs)
        arguments = validated_params.model_dump()
    except ValidationError as e:
        logger.error(f"Parameter validation failed for {tool_name}: {str(e)}")
        raise ValueError(f"Invalid parameters for {tool_name}: {str(e)}")
    
    logger.info(f"Calling MCP tool: {tool_name} with args: {arguments}")
    
    url = os.getenv("MCP_SERVER_URL", "http://0.0.0.0:8001/mcp")

    async def _call():
        async with streamable_http_client(url, http_client=httpx.AsyncClient(timeout=120)) as (read_stream, write_stream, _):
            async with ClientSession(read_stream, write_stream) as session:
                await session.initialize()
                result = await session.call_tool(tool_name, arguments=arguments)
                if result.content and len(result.content) > 0:
                    response_text = result.content[0].text
                    logger.info(f"Tool {tool_name} completed successfully")
                    return response_text
                else:
                    raise RuntimeError(f"Tool {tool_name} returned empty response")

    try:
        return await asyncio.wait_for(_call(), timeout=120)
    
    except Exception as e:
        logger.error(f"MCP server communication error for {tool_name}: {str(e)}", exc_info=True)
        raise RuntimeError(f"Failed to execute {tool_name}: {str(e)}")
```