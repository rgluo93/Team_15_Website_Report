---
sidebar_position: 11
---

# Azure Implementation

## Platform Choice

The system is hosted on Microsoft Azure using **Container Apps** rather than running directly on a Kubernetes cluster.  

Kubernetes would provide maximum flexibility and control over the infrastructure, but it introduces trade-offs.  

From a cost perspective, Container Apps is more suitable. The services scale based on demand and do not require maintaining compute nodes that must always be on, which would be necessary in a dedicated Kubernetes cluster.  

Additionally, Kubernetes introduces additional infrastructure management. Running a Kubernetes cluster requires managing node pools, networking, persistent storage, scaling policies and cluster maintenance. For a system of this size, needing to manage all these adds unnecessary complexity.

Azure Container Apps provides a simpler alternative that still supports **containerised services and automatic scaling**. It allows the services to run directly from Docker images while Azure manages the underlying infrastructure, networking and scaling behavior.  

For these reasons, Azure Container Apps was chosen as the hosting platform. It provides sufficient scalability and reliability while keeping complexity and infrastructure costs low. A Kubernetes setup has also been prepared in case the client prefers using it in the future.

---

## Azure Infrastructure and Deployment

The AI resource layer runs entirely on Microsoft Azure. Before any service can be deployed, a set of infrastructure resources needs to be created once. This starts with a **resource group**, which holds all the Azure resources together so they can be managed and billed as a unit.  

Within that resource group, the following resources are created:

- **Azure Container Registry (ACR)**: stores Docker images for all services.  
- **Container Apps Environment**: the shared hosting environment for both services.  
- **Redis**: used for session storage.  
- **Qdrant**: used for vector search and semantic retrieval.  

### Redis

For Redis, there are two options:

1. **Container App deployment**: Redis runs as a container inside the same environment using the official Redis image. No authentication is needed, and applications in the same environment can reach it by name through the internal network.  
2. **Azure Cache for Redis**: a fully managed service that provides persistence, high availability and SSL, but requires a password and connecting over port 6380.  

For this deployment, the former option was chosen. Because all services communicate internally within the same Container Apps environment and the Redis instance is not exposed publicly, authentication was not required. This keeps the setup simpler while remaining secure within the private environment.

### Qdrant

Qdrant has a similar trade-off:

1. **Container App deployment** on internal ingress, meaning only services inside the same environment can reach it. However, Azure Container Apps does not support persistent volumes, so data is lost if the container restarts.  
2. **Kubernetes deployment** with persistent disk storage, which provides durability for stored vectors.  

For this deployment, Qdrant was also run as a **container app on internal ingress**. This choice keeps the infrastructure simpler and avoids introducing an additional Kubernetes cluster to maintain. Although this means vector data is not persisted across restarts, the embeddings can be regenerated if needed, making this trade-off acceptable for the current system.

---

## FastAPI Service Deployment

The **FastAPI service** is deployed first. The Docker image is built from the `ai_resource` directory. The first build takes several minutes because it downloads the **sentence transformer model** and the **Vosk speech model**, embedding them into the image.  

Once built, the image is tagged and pushed to the **Azure Container Registry**. The container app is then created, pointing to the image in the registry and configuring all necessary parameters:

- Azure OpenAI credentials  
- API key  
- Redis connection details  
- Qdrant connection details  
- MCP server URL  
- WhatsApp credentials  
- CORS origins  

Sensitive values are stored as **container app secrets** and referenced by name in the environment variables. This ensures credentials are never exposed in code or in the Docker image.  

After the container app is created and running, deployment is verified by hitting the **health endpoint**, which should return a connected status for Azure OpenAI.

---

## MCP Server Deployment

The **MCP server** is deployed similarly, using a separate Dockerfile and container app. Its configuration is simpler, primarily requiring **database credentials** to run SQL queries.  

Once the MCP server is running, the `MCP_SERVER_URL` environment variable in the FastAPI container app is updated to point at it. This enables the FastAPI EO agent to communicate with the MCP server for:

- querying the database  
- translating text  
- sending WhatsApp messages  

This connection ensures the EO agent can handle multi-step tasks seamlessly.

---

## CI/CD and Automated Deployments

After both services are deployed and communicating, all future deployments are handled automatically using **GitHub Actions**.  

The CI/CD setup uses **OIDC federated identity** to authenticate GitHub Actions to Azure. This means no passwords are stored anywhere in GitHub.  

An **Entra ID app registration** is created and given permission to:

- push images to the container registry  
- update the container apps  

It is linked to the specific GitHub repository and branch. When a workflow runs, GitHub and Azure exchange a **short-lived cryptographic token**. If the workflow or federated credential is removed, access is immediately revoked with no cleanup required.  

The only items stored in GitHub are three **non-sensitive identifiers**:

- client ID  
- tenant ID  
- subscription ID  

---

## Deployment Workflows

There are two separate workflow files, one for each service.  

Each workflow only triggers when files for its corresponding service change, so deploying a fix to the MCP server does not unnecessarily rebuild the FastAPI service.  

Every deployment pushes two image tags:

- `latest`  
- the exact **Git commit SHA**  

The container app is always updated to the **SHA-tagged image** rather than `latest`. Rolling back is accomplished by pointing the container app to a previous SHA. Azure creates a new revision from the old image in seconds, with no rebuild required.
