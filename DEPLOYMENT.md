# Deployment Guide

This document outlines how to deploy the HeatSatAI full-stack application to production.

## Architecture
- **Frontend**: React + Vite + Tailwind, deployed as static files or Serverless functions on Vercel.
- **Backend**: FastAPI (Python), serving predictions and metadata via REST, deployed on Render.

## 1. Local Development (Docker Compose)
The easiest way to run the entire stack locally is using Docker Compose.

```bash
# Build and start both containers
docker-compose up --build -d

# Check backend status
curl http://localhost:8000/api/v1/health

# Access frontend
http://localhost:3000
```

## 2. Deploying Backend (Render)
We use `render.yaml` as an Infrastructure-as-Code (IaC) configuration for Render.

1. Create an account on [Render](https://render.com).
2. Connect your GitHub repository.
3. Render will automatically detect `render.yaml` and provision a Web Service for `heatsatai-api`.
4. Ensure the `PYTHON_VERSION` environment variable is set to `3.10.0`.
5. Once deployed, note your Render URL (e.g., `https://heatsatai-api.onrender.com`).

## 3. Deploying Frontend (Vercel)
We use `vercel.json` for frontend configuration.

1. Create an account on [Vercel](https://vercel.com).
2. Connect your GitHub repository and import the `Urban Heat Insight` directory.
3. In the Vercel dashboard, set the following Environment Variable:
   - `VITE_API_URL` = `<YOUR_RENDER_URL>/api/v1`
4. Deploy the project. Vercel will automatically run `npm run build` as configured in `vercel.json`.

## CI/CD Pipeline
GitHub Actions are configured in `.github/workflows/main.yml`. On every push to `main`, the pipeline will:
- Test Python inference and validate dependencies.
- Build the Vite frontend.
- Build Docker images for both services to ensure container integrity.
