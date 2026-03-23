---
sidebar_position: 6
---

# Redis


### Redis Introduction

Conversation history for the general education assistant and education officer agent is stored using Redis, an in-memory key-value NoSQL database. Unlike relational databases, Redis requires no schema definition and instead supports data structures such as lists, hashes, and sets. Data is held entirely in memory, making reads and writes extremely fast but ephemeral, which is acceptable for conversation history where low latency is prioritised over long-term persistence.


### Redis Structure 

Conversation history is stored as a Redis List under a key of the form `chat_history:{user_id}:{service_id}`, where each entry in the list represents a message in the conversation. A Redis List is an ordered sequence of string elements, implemented as a linked list, allowing efficient insertion and retrieval from both ends. A TTL of 180 seconds is applied and refreshed on every read and write, meaning history is automatically cleared after a period of inactivity. Connection to Redis is managed through a Redis client instance configured with keepalive and health check settings to maintain a stable connection:

```python
self.redis_client = redis.Redis(
    host=redis_host,
    port=redis_port,
    db=redis_db,
    password=redis_password,
    ssl=redis_ssl,
    decode_responses=False,  # We'll handle encoding ourselves
    socket_connect_timeout=5,
    socket_keepalive=True,
    health_check_interval=30
)
# Test connection
self.redis_client.ping()
```

### Redis Operations 

Redis operations are implemeted with RedisHistoru class. RedisHistory inherits from LangChain's BaseChatMessageHistory, an abstract base class that defines a standard interface for storing and retrieving conversation history, allowing it to integrate seamlessly with LangChain's chat components. Messages are serialised to JSON before being stored, and deserialised on retrieval using LangChain's messages_to_dict and messages_from_dict utilities. There are two core methods. `add_messages(self, msgs)` which implements the operation RPUSH, which is the operation that appends a new message to the right end of the Redis List maintaining chronological order. `get_messages(self, limit: int = -1)` which implements the operation LRANGE, which os the operation thatretrieves a specified range of elements from the list to fetch the conversation history for a given session. Both operations are executed atomically using a Redis pipeline, which batches commands into a single network round trip. 

```python
class RedisHistory(BaseChatMessageHistory):
    
    def __init__(self, redis_client: redis.Redis, session_key: str, ttl_seconds: int = 180):
        self.redis_client = redis_client
        self.session_key = f"chat_history:{session_key}"
        self.ttl_seconds = ttl_seconds
        logger.debug(f"Initialized RedisHistory for {session_key} with TTL={ttl_seconds}s")
    
    def add_messages(self, msgs: List[BaseMessage]) -> None:
        try:
            # Convert messages to JSON strings
            msg_jsons = [json.dumps(messages_to_dict([msg])[0]) for msg in msgs]
            
            # Use pipeline for atomic operations
            pipe = self.redis_client.pipeline()
            
            # Add each message to the list
            for msg_json in msg_jsons:
                pipe.rpush(self.session_key, msg_json)
            
            # Set TTL
            pipe.expire(self.session_key, self.ttl_seconds)

            results = pipe.execute()
            total_messages = results[-2]  # RPUSH returns total length
        except Exception as e:
            logger.error(f"Error adding messages to Redis: {str(e)}")
            raise HistoryError(f"Failed to add messages: {str(e)}")
    
    def get_messages(self, limit = -1) -> List[BaseMessage]:
        try:
            # Use pipeline for atomic operations
            pipe = self.redis_client.pipeline()
            
            # Get all messages from the list
            if limit == -1:
                pipe.lrange(self.session_key, 0, -1)
            else:
                pipe.lrange(self.session_key, 0, limit - 1)
            
            # Refresh TTL
            pipe.expire(self.session_key, self.ttl_seconds)
            
            # Execute atomically
            results = pipe.execute()
            msg_jsons = results[0]
            
            if not msg_jsons:
                logger.debug(f"No messages found for {self.session_key}")
                return []
            
            # Parse messages
            msg_dicts = [json.loads(msg_json) for msg_json in msg_jsons]
            messages = messages_from_dict(msg_dicts)
            return messages
        except Exception as e:
            logger.error(f"Error retrieving messages from Redis: {str(e)}")
            raise HistoryError(f"Failed to retrieve messages: {str(e)}")
    
    def clear(self) -> None:
        """Clear all messages for this session."""
        try:
            count = self.redis_client.delete(self.session_key)
            logger.info(f"Cleared messages from {self.session_key} (deleted {count} key(s))")
        except Exception as e:
            logger.error(f"Error clearing messages from Redis: {str(e)}")
            raise HistoryError(f"Failed to clear messages: {str(e)}")

    @property
    def messages(self) -> List[BaseMessage]:
        """Property to get messages - required by BaseChatMessageHistory."""
        return self.get_messages()
        
    def add_message(self, message: BaseMessage) -> None:
        """Add a single message - required by BaseChatMessageHistory."""
        self.add_messages([message]) 
```