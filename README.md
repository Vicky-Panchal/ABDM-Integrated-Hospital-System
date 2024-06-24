# Hospital System Integration with ABDM

## Project Overview
This project involves the design and implementation of a simple hospital health information system (HIS) integrated with the ABDM sandbox. The system supports key use cases such as registering patients with ABHA ID, pulling records from other Health Information Providers (HIPs), and pushing records to Health Information Users (HIUs). The project ensures interoperability with the ABDM PHR app and demonstrates FHIR-compliant health record sharing between multiple HIS instances.

## Features
- Patient registration with ABHA ID
- Pulling and pushing health records between HIPs and HIUs
- Demonstrating interoperability with ABDM PHR app
- FHIR-compliant health record sharing

## Technology Stack
- **Frontend:** React.js, Bootstrap
- **Backend:** Spring Boot (Java)
- **Database:** MySQL
- **Storage:** AWS S3
- **Version Control:** Git, GitHub
- **Containerization:** Docker, DockerHub
- **Orchestration:** Kubernetes, Docker Compose
- **Configuration Management:** Ansible
- **Continuous Integration/Continuous Deployment (CI/CD):** Jenkins
- **Monitoring and Logging:** ELK Stack (Elasticsearch, Logstash, Kibana)
- **Web Server and Load Balancing:** NGINX

## Project Setup

### Prerequisites
- Node.js
- Java Development Kit (JDK)
- MySQL
- Docker
- Kubernetes
- AWS account for S3 storage

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/Vicky-Panchal/ABDM-Integrated-Hospital-System.git
    cd ABDM-Integrated-Hospital-System
    ```

2. **Frontend Setup:**
    ```bash
    cd frontend
    npm install
    npm start
    ```

3. **Backend Setup:**
    ```bash
    cd backend
    ./mvnw spring-boot:run
    ```

4. **Database Setup:**
    - Install and configure MySQL.
    - Create a database and update the connection details in the backend configuration file.

5. **Docker Setup:**
    ```bash
    docker-compose up --build
    ```

6. **Kubernetes Setup:**
    - Start Minikube:
      ```bash
      minikube start
      ```
    - Apply Kubernetes manifests:
      ```bash
      kubectl apply -f k8s
      ```

## DevOps Tools Usage

### Version Control
- **Git/GitHub:** Used for version control to track changes in source code.

### Containerization
- **Docker/DockerHub:** Used for creating, deploying, and running applications in isolated environments.

### Orchestration
- **Kubernetes:** Used for automating deployment, scaling, and management of applications across clusters.
- **Docker Compose:** Used to define and run multi-container Docker applications.

### Configuration Management
- **Ansible:** Used for configuration management and deployment.

### Continuous Integration/Continuous Deployment (CI/CD)
- **Jenkins:** Used to automate the CI/CD pipeline, ensuring efficient deployment and updates.

### Monitoring and Logging
- **ELK Stack (Elasticsearch, Logstash, Kibana):** Used for centralized logging and monitoring to enhance system performance and troubleshooting.

### Web Server and Load Balancing
- **NGINX:** Used to handle incoming HTTP and HTTPS requests, route them to appropriate backend services, and ensure smooth load balancing.

## API Documentation
For detailed API documentation, visit [Postman Documentation](https://documenter.getpostman.com/view/19657319/2sA3JJA48S).

## Future Updates
- Deploy the application on AWS or GCP.
- Implement autoscaling and load balancing in Kubernetes.

## References
- [Docker Documentation](https://docs.docker.com/)
- [Ansible Documentation](https://docs.ansible.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/home/)
- [Setting up a CI/CD Workflow on GitHub Actions for a React App](https://dev.to/dyarleniber/setting-up-a-ci-cd-workflow-on-github-actions-for-a-react-app-with-github-pages-and-codecov-4hnp)
- [Integrate ELK Stack into Spring Boot Application](https://salithachathuranga94.medium.com/integrate-elk-stack-into-spring-boot-application-ae38a6371f86)
