export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type ProblemStatus =
  | 'not_started'
  | 'in_progress'
  | 'resolve_due'
  | 'redo'
  | 'mastered';

export type ReSolveChoice = 'Done' | 'Redo' | null;

export interface TestCase {
  id?: string;
  input: string; // JSON string or raw arguments representation
  parsedInput: any[];
  expected: any;
  description?: string;
  isHidden?: boolean;
}

export interface ProblemDefinition {
  id: number;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  starterTemplates: {
    java: string;
    cpp: string;
    c: string;
    python: string;
  };
  testCases: Array<{
    input: any[];
    expected: any;
  }>;
}

export interface Problem {
  id: string; // e.g., 'p-217'
  number: number; // e.g., 217
  title: string; // e.g., 'Contains Duplicate'
  slug: string; // e.g., 'contains-duplicate'
  week: number; // 1 to 12
  topic: string; // e.g., 'Arrays & Hashing'
  difficulty: Difficulty;
  leetcodeUrl: string;
  freeVersionUrl?: string;
  solutionVideoUrl: string;
  description: string;
  constraints: string[];
  starterTemplates: {
    python: string;
    java: string;
    cpp: string;
    c: string;
  };
  starterCode: {
    python: string;
    java: string;
    cpp: string;
    c: string;
  };
  functionName: string;
  testCases: Array<{
    input: any[];
    expected: any;
  }>;
  sampleTestCases: TestCase[];
  hiddenTestCases: TestCase[];
}

export interface UserProblemState {
  problemId: string;
  status: ProblemStatus;
  day1Date: string | null; // YYYY-MM-DD
  day3Due: string | null;
  day3Status: ReSolveChoice;
  day7Due: string | null;
  day7Status: ReSolveChoice;
  day30Due: string | null;
  day30Status: ReSolveChoice;
  timeComplexity: string;
  spaceComplexity: string;
  pattern: string;
  triggerLine: string;
  confidenceRating: number; // 1 to 5
  attemptsCount: number;
  activeTimeSeconds: number;
  lastAttemptTimestamp: string | null;
  hintsUsedCount: number;
  isSolvedIndependently: boolean;
  notes: string;
  twoMinuteExplanationRecorded: boolean;
}

export interface SubmissionRecord {
  id: string;
  problemId: string;
  problemTitle: string;
  timestamp: string;
  code: string;
  language: 'python' | 'java' | 'cpp' | 'c';
  verdict: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compilation Error';
  totalCases: number;
  passedCases: number;
  runtimeMs: number;
  memoryMb?: number;
  failedCaseDetails?: {
    input: string;
    expected: string;
    actual: string;
  };
  aiAssistanceUsed: boolean;
  hintLevelUsed: number;
  approachType?: 'brute_force' | 'optimal' | 'alternative';
}

export interface WeekCurriculum {
  week: number;
  title: string;
  topics: string[];
  problemCount: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  prerequisites: string[];
  learningObjectives: string[];
  coreCsTopic: string;
  description: string;
}

export interface VideoInsightItem {
  id: string;
  takeaway: string;
  supportingEvidence: string;
  learningImplication: string;
  actionableBehavior: string;
  dashboardIntegration: string;
  successMetric: string;
}
