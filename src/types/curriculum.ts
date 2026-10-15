export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Language = 'python' | 'java' | 'cpp';

export interface TestCase {
  input: string;
  expected: any;
  description?: string;
}

export interface ProblemProgressiveHints {
  h1: string; // Conceptual Nudge
  h2: string; // Pattern / Data Structure Clue
  h3: string; // Ordered Algorithm Steps / Pseudo-code
  h4: string; // Full Solution Code & Invariant Breakdown
}

export interface Problem {
  id: string;
  number: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
  topic: string;
  week: number;
  description: string;
  constraints: string[];
  starterCode: Record<Language, string>;
  functionName: string;
  sampleTestCases: TestCase[];
  hiddenTestCases: TestCase[];
  hints: ProblemProgressiveHints;
  leetcodeUrl?: string;
}

export type MasteryStatus =
  | 'not_started'
  | 'attempted'
  | 'solved_with_help'
  | 'solved_independently'
  | 'needs_revision'
  | 'mastered';

export interface UserProblemState {
  problemId: string;
  status: MasteryStatus;
  firstSolvedDate: string | null;
  day3Due: string | null;
  day3Status: 'Done' | 'Redo' | null;
  day7Due: string | null;
  day7Status: 'Done' | 'Redo' | null;
  day30Due: string | null;
  day30Status: 'Done' | 'Redo' | null;
  timeComplexity: string;
  spaceComplexity: string;
  pattern: string;
  triggerLine: string;
  notes: string;
  activeStruggleSeconds: number;
  hintsUsedCount: number;
  highestHintLevel: number; // 0 (none), 1 (H1), 2 (H2), 3 (H3), 4 (H4)
  attemptsCount: number;
  lastAttemptTimestamp: string | null;
}

export interface SubmissionRecord {
  id: string;
  problemId: string;
  problemTitle: string;
  language: Language;
  code: string;
  verdict:
    | 'Accepted'
    | 'Wrong Answer'
    | 'Time Limit Exceeded'
    | 'Memory Limit Exceeded'
    | 'Compilation Error'
    | 'Runtime Error'
    | 'Judge Error';
  runtimeMs: number;
  memoryKb: number;
  totalCases: number;
  passedCases: number;
  timestamp: string;
  isRecallMode?: boolean;
  failedCaseDetails?: {
    input: string;
    expected: any;
    actual: any;
    description?: string;
  };
}
