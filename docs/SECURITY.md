# SECURITY SPECIFICATION — COZY CODE CORNER

## 1. Threat Model & Security Invariants
1. **Untrusted Code Execution**:
   - User code submitted in Python, Java, or C++ is NEVER run with host credentials or root privileges.
   - Server-side Python sandbox runs with restricted subprocess limits (timeout: 4.0s, memory limit: 64MB).
   - Java and C++ execution requests are dispatched through an isolated Judge0 cluster or static verification sandbox.
2. **Hidden Test Cases & Reference Solutions**:
   - Hidden evaluation test cases and reference solutions remain strictly server-side.
   - Client API responses never expose hidden inputs or reference implementation strings.
3. **Data Protection & Persistence**:
   - Firestore security rules strictly enforce owner-only read and write access (`request.auth.uid == userId`).
   - Local storage and IndexedDB hold client-side drafts; sensitive API credentials or JWT secret keys are never stored in client local storage.
4. **Content Security Policy & Sanitization**:
   - All markdown and user notes are rendered with safe sanitization preventing XSS attacks.
