# MERN Capstone Project: ProjectSync

A full-stack Team Project Management System built with the MERN stack (MongoDB, Express, React, Node.js), containerized with Docker, deployed using Kubernetes, and automated via GitHub Actions.

## Features

- **Authentication**: JWT-based login and registration.
- **Projects**: Create, view, update, and delete projects.
- **Tasks**: Manage tasks with a Kanban-style board (To Do, In Progress, Done).
- **Responsive UI**: Modern, glassmorphism-inspired dark mode UI.

## Local Setup

### Running with Docker Compose (Recommended)

1. Ensure Docker Desktop is installed and running.
2. Clone this repository.
3. Run the following command in the project root:
   ```bash
   docker-compose up --build
   ```
4. Access the frontend at `http://localhost:3000` and backend at `http://localhost:5000`.

### Running Manually

**Backend:**
1. Navigate to the `backend/` directory.
2. Create a `.env` file with `MONGO_URI`, `JWT_SECRET`, and `PORT` (default is 5000).
3. Run `npm install` and then `npm start`.

**Frontend:**
1. Navigate to the `frontend/` directory.
2. Run `npm install` and then `npm run dev`.
3. Application will run on `http://localhost:5173` (Vite's default).

## Kubernetes Deployment (Minikube)

1. Start Minikube:
   ```bash
   minikube start
   ```
2. Apply the Kubernetes YAML files:
   ```bash
   kubectl apply -f k8s/
   ```
3. Get the frontend service URL:
   ```bash
   minikube service projectsync-frontend-svc
   ```

## CI/CD Pipeline

The `.github/workflows/deploy.yml` automates the build and deployment process.

**Required GitHub Secrets:**
- `DOCKER_USERNAME` / `DOCKER_PASSWORD`: Docker Hub credentials.
- `RENDER_DEPLOY_HOOK`: Render.com webhook for deploying the backend container.
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`: Vercel credentials for deploying the frontend.
