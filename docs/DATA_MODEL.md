# DATA MODEL & PERSISTENCE SPECIFICATION

## 1. Storage Tiers
- **Local Cache & Recovery**: IndexedDB (`cozy_code_corner_db`) stores active code drafts, local timestamps, and editor view states so no work is ever lost during disconnections.
- **Server / Cloud Store**: Cloud Firestore under user-isolated documents.

## 2. Collections & Documents Schema
```
users/{uid}
  profile:
    uid: string
    displayName: string
    email: string
    timezone: string (default "UTC")
    dailyTimeBudgetMinutes: number (default 60)
    preferredLanguage: "python" | "java" | "cpp"
    createdAt: timestamp
    updatedAt: timestamp

users/{uid}/drafts/{problemId}_{language}
  problemId: string
  language: "python" | "java" | "cpp"
  code: string
  updatedAt: timestamp
  version: number

users/{uid}/learningRecords/{problemId}
  problemId: string
  status: "not_started" | "attempted" | "solved_with_help" | "solved_independently" | "needs_revision" | "mastered"
  firstSolvedDate: string (YYYY-MM-DD)
  day3Due: string (YYYY-MM-DD)
  day3Status: "Pending" | "Done" | "Redo" | null
  day7Due: string (YYYY-MM-DD)
  day7Status: "Pending" | "Done" | "Redo" | null
  day30Due: string (YYYY-MM-DD)
  day30Status: "Pending" | "Done" | "Redo" | null
  hintsUsedCount: number
  highestHintLevel: number (0-4)
  timeComplexity: string
  spaceComplexity: string
  pattern: string
  triggerLine: string
  initialApproachNotes: string
  reflectionNotes: string
  activeStruggleSeconds: number
  updatedAt: timestamp

users/{uid}/submissions/{submissionId}
  id: string
  problemId: string
  language: "python" | "java" | "cpp"
  code: string
  verdict: "Accepted" | "Wrong Answer" | "Time Limit Exceeded" | "Memory Limit Exceeded" | "Compilation Error" | "Runtime Error" | "Judge Error"
  runtimeMs: number
  memoryKb: number
  totalCases: number
  passedCases: number
  failingCase?: {
    input: string
    expected: string
    actual: string
    description?: string
  }
  timestamp: string

users/{uid}/dailyActivity/{date}
  date: string (YYYY-MM-DD)
  problemsSolved: string[]
  revisionsCompleted: string[]
  csLessonsCompleted: string[]
  totalStudySeconds: number
```

## 3. Authoritative Ownership Rules
- Clients may read and write their own drafts, notes, and reflections.
- Official submission records and verdict derivations are evaluated by the backend judge service.
- Clients cannot forge "Accepted" status directly in Firestore; learning progress updates only after authoritative verification.
