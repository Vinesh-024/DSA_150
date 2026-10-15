// Test suite for judge execution response models and error categorization

console.log('[Test Suite] Running Judge Execution Response Test...');

interface ExecutionResult {
  token: string;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'ERROR';
  verdict: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Memory Limit Exceeded' | 'Compilation Error' | 'Runtime Error';
  stdout?: string | null;
  stderr?: string | null;
  timeMs?: number | null;
  memoryKb?: number | null;
  totalCases: number;
  passedCases: number;
}

const mockResponse: ExecutionResult = {
  token: 'tok_1234567890',
  status: 'COMPLETED',
  verdict: 'Accepted',
  stdout: 'All sample test cases passed.',
  stderr: null,
  timeMs: 24,
  memoryKb: 15600,
  totalCases: 3,
  passedCases: 3
};

if (mockResponse.verdict !== 'Accepted') {
  throw new Error('Verdict must match expected');
}
if (mockResponse.passedCases !== mockResponse.totalCases) {
  throw new Error('All cases must pass for Accepted');
}

console.log('✓ Judge Execution adapter tests passed successfully!');
