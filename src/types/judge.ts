import { Language } from './curriculum';

export type JudgeSubmissionStatus = 'CREATED' | 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface Judge0LanguageConfig {
  id: number;
  name: string;
  extension: string;
  monacoLang: string;
}

export const JUDGE0_LANGUAGE_MAP: Record<Language, Judge0LanguageConfig> = {
  python: {
    id: 71, // Python (3.8.1) / Python 3.x
    name: 'Python 3',
    extension: 'py',
    monacoLang: 'python',
  },
  java: {
    id: 62, // Java (OpenJDK 13/17)
    name: 'Java (OpenJDK)',
    extension: 'java',
    monacoLang: 'java',
  },
  cpp: {
    id: 54, // C++ (GCC 9.2.0)
    name: 'C++ (GCC)',
    extension: 'cpp',
    monacoLang: 'cpp',
  },
};

export interface JudgeExecutionRequest {
  problemId: string;
  language: Language;
  sourceCode: string;
  stdin?: string;
  expectedOutput?: string;
  cpuTimeLimit?: number;
  memoryLimitKb?: number;
}

export interface JudgeExecutionResponse {
  token: string;
  status: JudgeSubmissionStatus;
  verdict:
    | 'Accepted'
    | 'Wrong Answer'
    | 'Time Limit Exceeded'
    | 'Memory Limit Exceeded'
    | 'Compilation Error'
    | 'Runtime Error'
    | 'Judge Error';
  stdout: string | null;
  stderr: string | null;
  compileOutput: string | null;
  timeMs: number;
  memoryKb: number;
  totalCases: number;
  passedCases: number;
  failingCase?: {
    input: string;
    expected: any;
    actual: any;
    description?: string;
  };
}
