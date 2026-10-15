# ARCHITECTURAL DECISION RECORDS (ADR) — COZY CODE CORNER

## ADR 001: Warm Minimalist Design System over Typical Developer Dark Dashboards
- **Context**: Most DSA platforms resemble sterile, competitive, gamified dashboards crowded with bright badges and high-pressure counters.
- **Decision**: Adopt a Cozy Lofi study room aesthetic (Warm Linen `#F6F3EC`, Soft Cream `#FFFCF6`, Forest Green `#526B58`, Sage `#A8B9A0`).
- **Consequence**: Enhances cognitive focus, reduces anxiety during long practice sessions, and encourages deep reflection.

## ADR 002: Pedagogical Blank Page Law vs Immediate Hint Gratification
- **Context**: Engineers frequently look at hints prematurely, creating an illusion of competence that fails during technical interviews.
- **Decision**: Enforce a 20-minute productive struggle timer before unlocking progressive hints, and mandate a Day 30 blank page recall test before declaring a problem "Mastered".
- **Consequence**: Users build genuine retrieval pathways and deep invariant understanding.

## ADR 003: Dual Backend Strategy (In-Process Gateway + Standalone FastAPI)
- **Context**: AI Studio container execution requires a single active dev port (3000) running Express with Vite middlewares, while enterprise setups require modular Python FastAPI services.
- **Decision**: Implement the `/api/v1` routes inside `server.ts` for instant zero-dependency in-container dev and preview, while maintaining the clean `backend/app` FastAPI codebase and schemas.
- **Consequence**: 100% immediate usability inside Google AI Studio preview, alongside production-grade FastAPI parity for external deployment.

## ADR 004: Tiered Persistence (LocalStorage / IndexedDB + Cloud Firestore)
- **Context**: Network disruptions must not cause users to lose their in-progress code drafts or reflection notes.
- **Decision**: Implement optimistic local storage sync with event-driven state updates, combined with exportable JSON snapshots and Firestore rules.
- **Consequence**: Instant typing performance, zero keystroke loss, offline capability, and secure multi-device synchronization.
