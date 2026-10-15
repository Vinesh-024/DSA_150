# API SPECIFICATION — COZY CODE CORNER (v1)

## Base URL
`/api/v1`

## 1. Problem Catalog
### `GET /api/v1/problems`
Returns the 12-week roadmap of 150 problems.
- Response: `Array<ProblemSummary>`

### `GET /api/v1/problems/{id}`
Returns full problem details including description, constraints, examples, starter code stubs (Python, Java, C++), and progressive hints.
- Response: `ProblemDetail`

## 2. Code Execution (Judge0 Integration)
### `POST /api/v1/submissions/run`
Runs code against public sample testcases or user custom test cases.
- Request Body:
  ```json
  {
    "problemId": "p-001",
    "language": "python",
    "code": "class Solution: ...",
    "customTestCases": ["nums = [2,7,11,15], target = 9"]
  }
  ```
- Response:
  ```json
  {
    "status": "COMPLETED",
    "verdict": "Accepted",
    "runtimeMs": 14,
    "memoryKb": 15400,
    "totalCases": 3,
    "passedCases": 3,
    "caseResults": [...]
  }
  ```

### `POST /api/v1/submissions/submit`
Queues an authoritative submission evaluated against both public and hidden test cases.
- Request Body:
  ```json
  {
    "problemId": "p-001",
    "language": "python",
    "code": "class Solution: ...",
    "hintsUsedCount": 0
  }
  ```
- Response:
  ```json
  {
    "submissionId": "sub_1742080000000",
    "status": "COMPLETED",
    "verdict": "Accepted",
    "runtimeMs": 28,
    "memoryKb": 16200,
    "totalCases": 57,
    "passedCases": 57,
    "isMasteryEligible": true
  }
  ```

## 3. Daily Adaptive Planner
### `GET /api/v1/planner/today`
Returns prioritized daily learning tasks based on overdue revisions, failed recalls, weak prerequisites, and the 12-week roadmap.
- Response:
  ```json
  {
    "date": "2026-10-14",
    "tasks": [
      { "id": "t1", "type": "revision", "priority": 1, "problemId": "p-001", "stage": "Day 3" },
      { "id": "t2", "type": "roadmap", "priority": 4, "problemId": "p-015", "week": 1 },
      { "id": "t3", "type": "fundamentals", "priority": 5, "topic": "dbms_indexes" }
    ],
    "estimatedMinutes": 65
  }
  ```
