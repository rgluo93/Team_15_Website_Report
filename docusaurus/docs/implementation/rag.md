---
sidebar_position: 4
---

# Retrieval Augmented Generation

### Retrieval Augmented Generation Introduction 

Retrieval Augmented Generation (RAG) is a technique for enhancing the contextual knowledge available to a large language model at inference time, enabling it to produce more accurate and grounded responses. Rather than relying solely on knowledge encoded in the model's parameters during training, RAG retrieves relevant information from an external knowledge store and supplies it as additional context in the prompt.  For example if a user were to ask a question about how Mr. Oloo builds a great culture in the classroom, a scenario unique to LeadNow module, the LLM will generate a response based on LeadNow training content from RAG instead of hallucinating an answer which a normal LLM would.

In this project, RAG is implemented using a vector database which is a database designed to store and query vector embeddings, which are numerical representations of text that represent their semantic meaning. The vector database used is Qdrant, a high-performance similarity search engine written in Rust and optimised for semantic search workloads. Embeddings are generated using all-MiniLM-L6-v2, a lightweight transformer-based model optimised for CPU inference that encodes input text into 384-dimensional vectors.

### ETL Pipeline

The first step in the RAG pipeline is populating the vector database with relevant source material. The content used in this project consists of LeadNow PDFs provided by the client, containing both module content and expert question-answer pairs. To load this data into Qdrant, an ETL (Extract, Transform, Load) pipeline was developed as a Python CLI tool. Given a path to a directory of PDFs, the tool extracts their text content, transforms it into vector embeddings and loads the resulting vectors into the database. Below are the options exposed by the CLI tool:

| Flag | Default | Description |
|---|---|---|
| `path` | — | Path to a PDF file or directory |
| `-r`, `--recursive` | `false` | Process PDFs in subdirectories recursively |
| `-v`, `--verbose` | `false` | Verbose output with processing details |
| `--show-metadata` | `false` | Display PDF metadata for each file |
| `--chunk` | `false` | Enable text chunking, saving chunks as JSON files |
| `--chunk-size` | `1000` | Size of each chunk in characters |
| `--chunk-overlap` | `200` | Overlap between chunks in characters |
| `--vector-upload` | `false` | Upload chunks to Qdrant (requires `--chunk`) |
| `--qdrant-url` | `http://localhost:6333` | Qdrant server URL |
| `--collection-name` | `leadnow_documents` | Qdrant collection name |

**Extract**: The PDF extraction pipeline uses LangChain's PyPDFLoader to parse documents directly into memory, converting each page into a structured Document object from which text content is extracted. The extracted text is then split into chunks using LangChain's `RecursiveCharacterTextSplitter`, which divides text by attempting a list of separators in order, such as paragraphs, sentences, and words, preserving semantic coherence wherever possible. Chunks are configured with a size of 1000 characters and an overlap of 200 characters to ensure context is not lost at boundaries. Below is the code snippet for the text splitting process at `upload_pdf.py`:

```python
text_splitter = RecursiveCharacterTextSplitter(
  chunk_size=chunk_size,
  chunk_overlap=chunk_overlap,
  length_function=len,
  separators=["\n\n", "\n", ". ", " ", ""],
  is_separator_regex=False,
)

# Split the documents
split_docs = text_splitter.split_documents(documents)

# Convert LangChain documents to the expected dict format
chunks = []
for i, doc in enumerate(split_docs):
  chunks.append({
      'chunk_id': i,
      'text': doc.page_content,
      'source': doc.metadata.get('source', str(pdf_path)),
      'page': doc.metadata.get('page', 0),
      'start': 0,  # LangChain doesn't track character positions
      'end': len(doc.page_content)
  })
```

**Transform**: The chunked text is converted into vector embeddings using `all-MiniLM-L6-v2`, loaded via LangChain's `HuggingFaceEmbeddings` wrapper, which provides a standardised interface for generating embeddings from HuggingFace models. Each chunk is passed through the model and returned as a 384-dimensional vector representing the semantic content of that chunk. The `TextEmbedder` class is found at `embedding.py`.

```python

class TextEmbedder:

    def __init__(
        self,
        model_name: str = 'all-MiniLM-L6-v2',
        model_kwargs: dict = None,
        encode_kwargs: dict = None,
        verbose: bool = True
    ):
        self.model_name = model_name
        self.verbose = verbose

        # Default model kwargs
        if model_kwargs is None:
            model_kwargs = {'device': 'cpu'}

        # Default encode kwargs (normalize for cosine similarity)
        if encode_kwargs is None:
            encode_kwargs = {'normalize_embeddings': True}

        # Initialize LangChain HuggingFaceEmbeddings
        if self.verbose:
            print(f"Loading embedding model: {model_name}...")

        self.embeddings = HuggingFaceEmbeddings(
            model_name=model_name,
            model_kwargs=model_kwargs,
            encode_kwargs=encode_kwargs
        )

        if self.verbose:
            print(f"✓ Model loaded: {model_name}")

    def embed_query(self, text: str) -> List[float]:
        return self.embeddings.embed_query(text)

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        return self.embeddings.embed_documents(texts)
```

**Load**: The vector embeddings are uploaded to Qdrant using the QdrantUploader class, which wraps LangChain's QdrantVectorStore to manage the connection and upload process. On initialisation, the class connects to a Qdrant instance and creates the target collection if it does not already exist, configured with 384-dimensional vectors and cosine similarity as the distance metric. Each chunk is stored as a point within the collection, consisting of its 384-dimensional embedding vector and an associated metadata payload containing fields such as document ID, page number, and chunk index. The `QdrantUploader` class is found at `vector_database_upload.py` and the upload process is as follows:

``` python
class QdrantUploader:
    
    def __init__(
        self,
        collection_name: str = "leadnow_documents",
        embedding_dim: int = 384,
        qdrant_url: Optional[str] = None,
        qdrant_api_key: Optional[str] = None,
        distance_metric: str = "Cosine",
        embeddings: Optional[Any] = None,
        verbose: bool = False
    ):
        self.collection_name = collection_name
        self.embedding_dim = embedding_dim
        self.distance_metric = distance_metric
        self.verbose = verbose
        
        # Get Qdrant configuration from environment or parameters
        self.qdrant_url = qdrant_url or os.getenv("QDRANT_URL", "http://localhost:6333")
        self.qdrant_api_key = qdrant_api_key or os.getenv("QDRANT_API_KEY")
        
        # Initialize embeddings if not provided
        if embeddings is None:
            if self.verbose:
                print("Initializing default embeddings (all-MiniLM-L6-v2)...", file=sys.stderr)
            self.embeddings = HuggingFaceEmbeddings(
                model_name='all-MiniLM-L6-v2',
                model_kwargs={'device': 'cpu'},
                encode_kwargs={'normalize_embeddings': True}
            )
        else:
            self.embeddings = embeddings
        
        # Connect to Qdrant
        self._connect()
        
        # Create collection if it doesn't exist
        self._ensure_collection()
        
        # Initialize LangChain vector store
        self._init_vectorstore()
    
    def _connect(self):
        """Connect to Qdrant server."""
        if self.verbose:
            print(f"Connecting to Qdrant at: {self.qdrant_url}", file=sys.stderr)
        
        # Connect to Qdrant
        if self.qdrant_api_key:
            # Cloud instance with API key
            self.client = QdrantClient(
                url=self.qdrant_url,
                api_key=self.qdrant_api_key
            )
        else:
            # Local instance or no auth
            self.client = QdrantClient(url=self.qdrant_url)
            
    def _init_vectorstore(self):
        """Initialize LangChain Qdrant vector store."""
        self.vectorstore = QdrantVectorStore(
            client=self.client,
            collection_name=self.collection_name,
            embedding=self.embeddings
        )
        
    
    def upload_chunks(
        self,
        chunks: List[Dict[str, Any]],
        embeddings: List[List[float]],
        document_id: str,
        tenant_id: Optional[str] = None,
        module_id: Optional[str] = None,
        additional_metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        if embeddings and len(chunks) != len(embeddings):
            raise ValueError(
                f"Chunks count ({len(chunks)}) must match embeddings count ({len(embeddings)})"
            )
        
        # Convert chunks to LangChain Documents
        documents = []
        for i, chunk in enumerate(chunks):
            # Prepare metadata
            metadata = {
                "document_id": document_id,
                "chunk_id": chunk.get("chunk_id", i),
                "chunk_index": chunk.get("chunk_id", i),
                "source": chunk.get("source", ""),
                "page": chunk.get("page", 0),
                "chunk_size": len(chunk.get("text", "")),
            }
            
            # Add optional IDs
            if tenant_id:
                metadata["tenant_id"] = tenant_id
            if module_id:
                metadata["module_id"] = module_id
            
            # Add any additional metadata
            if additional_metadata:
                metadata.update(additional_metadata)
            
            # Create LangChain Document
            doc = Document(
                page_content=chunk.get("text", ""),
                metadata=metadata
            )
            documents.append(doc)
        ids = self.vectorstore.add_documents(documents)
  
        return {
            "success": True,
            "collection_name": self.collection_name,
            "chunks_uploaded": len(ids),
            "document_id": document_id,
            "chunk_ids": ids
        }
    
```

Actually uploading the chunks to Qdrant is as simple as calling the `upload_chunks` method of the `QdrantUploader` class, which takes care of generating embeddings for each chunk and uploading them to the specified collection:

``` python
upload_result = vector_uploader.upload_chunks(
    chunks=chunks,
    embeddings=None,  # Let LangChain generate embeddings
    document_id=document_id
)
```

### Semantic Search

To retrieve context relevant to a user's query, a semantic search is performed against the Qdrant collection. The query is first converted into a vector embedding by the TextEmbedder class using all-MiniLM-L6-v2.

``` python
self.embeddings = HuggingFaceEmbeddings(
    model_name='all-MiniLM-L6-v2',
    model_kwargs={'device': 'cpu'},
    encode_kwargs={'normalize_embeddings': True}
)
```

This embedding is then used to search the collection via the QdrantUploader class, which exposes search functionality through its existing database connection. Qdrant retrieves the closest matching points using cosine similarity which is a measure of the angle between two vectors where a smaller angle indicates greater semantic similarity. The number of results returned is configurable, allowing the pipeline to control how much context is passed to the LLM.

```python
def search_similar(
        self,
        query_text: str,
        limit: int = 5,
        score_threshold: Optional[float] = None,
        filter_dict: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        # Use LangChain's similarity search with score
        if filter_dict:
            # LangChain Qdrant supports metadata filtering
            results = self.vectorstore.similarity_search_with_score(
                query_text,
                k=limit,
                filter=filter_dict
            )
        else:
            results = self.vectorstore.similarity_search_with_score(
                query_text,
                k=limit
            )
        
        # Format results
        formatted_results = []
        for doc, score in results:
            if score_threshold is None or score >= score_threshold:
                formatted_results.append({
                    "text": doc.page_content,
                    "score": score,
                    "document_id": doc.metadata.get("document_id"),
                    "chunk_index": doc.metadata.get("chunk_index"),
                    "source": doc.metadata.get("source"),
                    "page": doc.metadata.get("page"),
                    "metadata": doc.metadata
                })
        
        return formatted_results
```

### Prompt Augmentation

The retrieved context is injected into the prompt before it is sent to the LLM. A use_rag flag has been added to the response methods of the ChatService class. When enabled, ChatService automatically performs a semantic search and prepends the retrieved context to the prompt, providing the LLM with relevant information to inform its response. `self.retriever` is an instance of the `QdrantUploader` class. 

```python
if use_rag:
    retriever = self.get_retriever(k=rag_k)
    query = question
    logger.info(f"RAG: Retrieving documents for query: {query[:100]}...")
    docs = retriever.invoke(query)
    context = self.format_docs(docs)
    logger.info(f"RAG: Retrieved {len(docs)} documents")

    system_tmpl = SystemMessagePromptTemplate.from_template(
        prompt.system_prompt + "\n\nContext from knowledge base:\n{context}"
    )
else:
    system_tmpl = SystemMessagePromptTemplate.from_template(prompt.system_prompt)
```
