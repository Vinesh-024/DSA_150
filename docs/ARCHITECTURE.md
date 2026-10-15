# ARCHITECTURE — COZY CODE CORNER

## 1. System Overview
Cozy Code Corner is an intelligent personal DSA learning, coding, and CS interview preparation platform built with a Warm Minimalist, Cozy Lofi aesthetic.

### Core Architectural Layers
1. **Frontend (React 19 + TypeScript + Vite + Tailwind CSS v4 + Motion)**
   - Single-page application with modular feature domains:
     - `dashboard`: Bento-style daily focus view ("What should I do today?").
     - `roadmap`: 12-week structured NeetCode 150 curriculum.
     - `workspace`: LeetCode-grade multi-language coding IDE (Java, C++, Python) with Monaco Editor.
     - `revisions`: Day 3, Day 7, Day 30 spaced repetition & Recall Mode.
     - `fundamentals`: CS core subjects (OOP, DBMS, SQL, OS, Networks, SE).
     - `system-design`: 10-concept progressive curriculum + 5 guided case studies.
     - `journal`: Notes, reflections, trigger-line synthesis, and search.
     - `analytics`: Genuine pattern mastery vs superficial problem count metrics.

2. **Backend API Gateway & Contracts (`server.ts` & `backend/`)**
   - Implements `/api/v1/` REST endpoints:
     - `/api/v1/submissions`: Async submission queuing, polling, and verdict normalization.
     - `/api/v1/catalog`: Validated 150-problem roadmap metadata.
     - `/api/v1/planner`: Deterministic daily task schedule generation.
     - `/api/v1/revisions`: Day 3 / 7 / 30 spaced retention calculations and Redo rule cycle.
   - Dual-mode deployment:
     - Native Node.js / Express gateway serving Vite middleware in development container (port 3000).
     - Standalone FastAPI Python service specifications in `backend/app/` for external container deployment.

3. **Code Execution Engine (Judge0 Protocol)**
   - Submission lifecycle: `CREATED` → `QUEUED` → `RUNNING` → `COMPLETED`.
   - Verdicts: `Accepted`, `Wrong Answer`, `Time Limit Exceeded`, `Memory Limit Exceeded`, `Compilation Error`, `Runtime Error`, `Judge Error`.
   - Supports Java (OpenJDK), C++ (GCC), and Python 3.
   - Hidden test suites and reference solutions remain strictly server-side.

4. **Persistence & Data Model**
   - Tier 1: Local IndexedDB for instant keystroke draft recovery and offline resilience.
   - Tier 2: Cloud Firestore for cross-device synchronization, learning records, and submission histories.
