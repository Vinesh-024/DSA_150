import { TestCase } from '../types/curriculum';
import {
  isolatedExecutionUtility,
  ExecutionStage,
  ExecutionStageListener,
  validateLanguageSyntax,
  deepEqual
} from './isolatedExecutionUtility';

export interface CaseEvaluationResult {
  index: number;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  isHidden?: boolean;
  description?: string;
  runtimeMs?: number;
}

export interface ExecutionResult {
  verdict: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compilation Error';
  passedCases: number;
  totalCases: number;
  runtimeMs: number;
  memoryMb: number;
  caseResults: CaseEvaluationResult[];
  failedCaseDetails?: CaseEvaluationResult;
  stdout: string[];
  errorMessage?: string;
}

export {
  isolatedExecutionUtility,
  validateLanguageSyntax,
  deepEqual,
  type ExecutionStage,
  type ExecutionStageListener
};

/**
 * Runs test cases through the isolated execution utility connecting
 * to the backend orchestration service.
 */
export async function runTestCasesInSandbox(
  userCode: string,
  language: 'python' | 'java' | 'cpp' | 'c',
  functionName: string,
  testCases: TestCase[],
  timeoutMs: number = 4000,
  onStageChange?: ExecutionStageListener,
  problemId?: string | number,
  customTestcases?: string[]
): Promise<ExecutionResult> {
  return isolatedExecutionUtility.execute(
    {
      problemId,
      code: userCode,
      language,
      functionName,
      testCases,
      customTestcases,
      timeoutMs
    },
    onStageChange
  );
}
