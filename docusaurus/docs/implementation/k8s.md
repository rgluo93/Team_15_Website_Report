---
sidebar_position: 13
---

# K8s

LeadNow is designed to scale to approximately **16,000 educators**. To support this growth, we implemented Kubernetes as a production-grade deployment option beyond a single Docker host approach. The most notable benefits for our use case include:

- Horizontal scaling for stateless API workloads
- Built-in orchestration and self-healing to ensure services are constantly up and running
- Better operational separation between application, networking, and storage concerns for future LeadNow developers

### Azure Infrastructure Used

We deployed and validated Kubernetes in Microsoft Azure using:

- **Azure Resource Group** as the deployment boundary for platform resources
- **Azure Container Registry (ACR)** for private image storage
- **Azure Kubernetes Service (AKS)** for Kubernetes control plane and worker node orchestration

AKS manages the control plane, while workload configuration is defined declaratively in this repository and applied through `kubectl`/deployment scripts.

### Images Deployed

Two primary container images were built and deployed from ACR:

- `leadnow-fastapi`: Main AI API service
- `ai-resource-mcp`: MCP server supporting tool and orchestration workflows

These images are referenced in Kubernetes manifests and promoted through environment overlays.

### Kubernetes Configuration Approach

Configuration is managed using **Kustomize**:

- `base/` contains reusable core manifests (`namespace`, `configmap`, `secret`, `fastapi`, `mcp-server`, `qdrant`, `ingress`)
- `overlays/dev` and `overlays/production` apply environment-specific customizations
- `kustomization.yaml` composes resources for consistent, repeatable deployments

This structure keeps shared configuration centralized while allowing controlled environment-level overrides.

### Workloads Implemented

- **FastAPI Deployment + Service + HPA** for scalable API serving
- **MCP Server Deployment + Service** for internal model-context protocol capabilities
- **Qdrant StatefulSet + PVC** for persistent vector index/data storage
- **Ingress** for external routing to API endpoints (either FastAPI or MCP server)

### Deployment and Validation Performed

After provisioning Azure resources and pushing images to ACR, manifests were applied to AKS and validated through:

- Pod readiness and stability checks (`kubectl get pods`)
- Service and ingress reachability checks (`kubectl get svc`, `kubectl get ingress`)
- Health endpoint verification for both FastAPI and MCP services
- Functional API tests for key endpoints (chat and translation)
- Persistence checks on Qdrant data across pod restarts

### Outcome

Though the AKS deployment path provided a reliable and scalable runtime option for LeadNow, we have decided to place this deployment option on hold due to:
- Cost Constraints - Deploying 2 virtual machines and an AKS requires significant storage due to the LLMs we have included, which drives up the cost
- Complexity - A Docker host setup would still suffice for the current features and user base

Nonetheless, as this project continues to scale, the current setup would serve as a foundation for future developers to migrate to k8s when it is deemed necessary.
