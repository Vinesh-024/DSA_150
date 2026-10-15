# RUNBOOK & DEPLOYMENT GUIDE — COZY CODE CORNER

## 1. Local Development Runbook
### Web Application (React + Vite + Express Gateway)
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server (serves on port 3000):
   ```bash
   npm run dev
   ```
3. Open browser at `http://localhost:3000`.

### Standalone FastAPI Backend
1. Navigate to backend directory:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
2. Run FastAPI with Uvicorn:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
3. Access interactive Swagger API documentation at `http://localhost:8000/docs`.

## 2. Production Build & Deployment
- **Frontend SPA**: `npm run build` generates optimized distribution bundles in `/dist`.
- **Docker Deployment**: Build and run containerized service using `Dockerfile`.
- **Environment Variables**: Configure `JUDGE0_API_URL` and `JUDGE0_API_KEY` for remote Judge0 cluster integration.
