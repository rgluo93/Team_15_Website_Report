---
sidebar_position: 4
---

# Challenges

During the development of the LeadNow AI-coaching platform, our team faced several technical and operational challenges, particularly around frontend development and integration with backend services.

## Frontend Deployment

One of the main challenges was getting started with the frontend. The development server was hosted in Kenya and was not configured to allow local hosting, causing significant delays early in the project. We spent considerable time in meetings with the developer attempting to get the frontend running locally, but we ultimately did not succeed.

To continue development, we resorted to manually uploading all frontend changes using SFTP and viewing our changes directly in the development website. Without SSH access, we were unable to set up automated GitHub CI/CD pipelines for deploying to the SFTP server, making the deployment process slower and more manual throughout the project.

## AI Feature Integration

Another challenge was demonstrating the AI-powered features on the development website. Since features such as the chatbot, user summary and personalised feedback required a FastAPI backend, we hosted these services on Azure Container Apps as Docker containers. The website cannot be run locally, and we lacked SSH access to run backend services directly on the development server, making Azure the most practical solution. This setup allowed us to showcase the AI features on the frontend despite these constraints.

## Environment Configuration

We also did not have access to the server's `.env` file, which contains critical configuration such as API URLs and keys for the FastAPI backend. Without this, directly connecting the frontend to the backend in a secure and flexible way was not straightforward.

To work around this, we created a `fastapi.conf` file containing the necessary backend configuration values. This file is stored on the SFTP server but is included in `.gitignore` to keep sensitive information out of the GitHub repository. We also created a configuration file in `config/fastapi.php`, which reads values from `fastapi.conf` and falls back to the standard `.env` file if `fastapi.conf` is not present or is missing values. This approach allows for seamless local development while giving the client the option to move these values to the server's `.env` file without any code changes.