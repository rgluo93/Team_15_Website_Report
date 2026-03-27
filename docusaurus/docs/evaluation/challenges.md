---
sidebar_position: 4
---

# Challenges

During the development of the LeadNow AI-coaching platform, our team faced several technical and operational challenges. These issues primarily stemmed from onboarding difficulties, as the codebase could not be run locally and the server environment was not configured to support local hosting. Despite multiple discussions and attempts to resolve these issues with the client, we were unable to establish a working local setup and were instead forced to rely on alternative workarounds. This, in turn, introduced further complications in frontend development and the integration of backend services, increasing both the complexity and time required for development.


## Onboarding Challenges
A major issue encountered during project onboarding was the lack of sufficient and reliable documentation for setting up the repository locally. The provided setup instructions  were often inaccurate or incomplete, leading to repeated failed attempts to initialise the system. As a result, the repository was not ready for development handoff, as it could not be run in a local environment without significant trial-and-error and external support.

After reaching out to the client for assistance, they indicated were not directly responsible for the system’s development. Instead, all technical queries had to be relayed to an external IT consultant who had originally worked on the codebase but had limited availability. This added an additional layer of communication overhead and slowed down the troubleshooting process.

During multiple meetings with the IT consultant, we attempted to follow and clarify the provided setup instructions. This included configuring XAMPP, setting up Apache virtual hosts, modifying system-level host mappings, and updating environment variables. However, even with guided support, the instructions remained inconsistent and did not result in a functioning local environment. As a result, several troubleshooting cycles were required, involving iterative adjustments and repeated attempts to resolve configuration issues.

In total, more than 15 hours were spent addressing these setup challenges, including extensive email correspondence, over 6 hours of live meetings with the IT consultant, and additional time spent independently debugging and interpreting the documentation. Despite these efforts, we were still unable to successfully run the application locally.

Ultimately, we concluded that the repository was not in a state suitable for local development or onboarding. As a workaround, we adopted an alternative approach by interacting directly with the remote server using SFTP, which allowed development to proceed but introduced inefficiencies such as manual file synchronisation, lack of version control, lack of access to the server's `.env` file, which led to reduced development speed.


## Frontend Deployment

One of the main challenges was getting started with the frontend. The development server was hosted in Kenya and was not configured to allow local hosting, causing significant delays early in the project. We spent considerable time in meetings with the developer attempting to get the frontend running locally, but we ultimately did not succeed.

To continue development, we resorted to manually uploading all frontend changes using SFTP and viewing our changes directly in the development website. Without SSH access, we were unable to set up automated GitHub CI/CD pipelines for deploying to the SFTP server, making the deployment process slower and more manual throughout the project.

## AI Feature Integration

Another challenge was demonstrating the AI-powered features on the development website. Since features such as the chatbot, user summary and personalised feedback required a FastAPI backend, we hosted these services on Azure Container Apps as Docker containers. The website cannot be run locally, and we lacked SSH access to run backend services directly on the development server, making Azure the most practical solution. This setup allowed us to showcase the AI features on the frontend despite these constraints.

## Environment Configuration

We also did not have access to the server's `.env` file, which contains critical configuration such as API URLs and keys for the FastAPI backend. Without this, directly connecting the frontend to the backend in a secure and flexible way was not straightforward.

To work around this, we created a `fastapi.conf` file containing the necessary backend configuration values. This file is stored on the SFTP server but is included in `.gitignore` to keep sensitive information out of the GitHub repository. We also created a configuration file in `config/fastapi.php`, which reads values from `fastapi.conf` and falls back to the standard `.env` file if `fastapi.conf` is not present or is missing values. This approach allows for seamless local development while giving the client the option to move these values to the server's `.env` file without any code changes.

## Impact on Development

The challenges outlined above had a significant impact on the overall development process, primarily by introducing delays and unnecessary complexity for what was intended to be a relatively simple MVP.

A major source of slowdown came from the initial onboarding issues. A considerable amount of time was spent attempting to run the codebase locally, particularly the frontend, which ultimately proved unsuccessful. This time could have otherwise been used to implement and refine features. The inability to establish a local development environment meant that even basic debugging and iteration cycles were much slower than expected.

The reliance on SFTP for frontend deployment further compounded these inefficiencies. Without version control integration or automated CI/CD pipelines, every change had to be manually uploaded and synchronised with the development server. This not only increased the risk of inconsistencies between local and remote versions but also made collaboration more cumbersome, as team members had to carefully coordinate updates to avoid overwriting each other’s work.

In addition, the lack of local hosting and server access forced us to adopt a more complex architecture than initially planned. Instead of running services locally, we had to deploy the FastAPI backend on Azure Container Apps, creating and managing multiple Dockerised services. While effective, this introduced additional overhead in terms of configuration, deployment, and monitoring, which would not have been necessary in a standard local-first development workflow.

Testing also became significantly slower and less efficient. Any changes to backend functionality required building and deploying a new Docker image to Azure, waiting for the container to initialise, and only then being able to test the updated endpoint through the live frontend. Similarly, frontend changes required manual SFTP uploads before they could be verified. This lack of immediate feedback hindered rapid iteration and made debugging more time-consuming.

Overall, these constraints resulted in a slower development cycle, increased operational overhead, and unnecessary complexity, all of which detracted from focusing on core feature development and delivering value efficiently.
