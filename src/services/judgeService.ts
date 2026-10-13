import { PROBLEMS } from '../data/curriculumData';
import { generateLanguageHarness } from './harnessGenerator';
import { ExecutionResult, CaseEvaluationResult } from './executionService';

export interface JudgeExecutionPayload {
  problemId?: string | number;
  language: 'java' | 'python' | 'cpp' | 'c';
  code: string;
  customTestcases?: string[];
  functionName?: string;
  testCases?: any[];
  timeoutMs?: number;
}

export const LANGUAGE_PISTON_CONFIG = {
  java: { language: 'java', version: '15.0.2', filename: 'Main.java', judge0Id: 91 },
  python: { language: 'python', version: '3.10.0', filename: 'solution.py', judge0Id: 92 },
  cpp: { language: 'c++', version: '10.2.0', filename: 'solution.cpp', judge0Id: 105 },
  c: { language: 'c', version: '10.2.0', filename: 'solution.c', judge0Id: 103 }
} as const;

/**
 * Parses structured JSON stdout produced by language test harnesses.
 */
function parseHarnessStdout(
  stdoutStr: string,
  testCases: any[],
  fallbackMs: number
): ExecutionResult | null {
  if (!stdoutStr) return null;

  // Search for JSON object in stdout lines
  const lines = stdoutStr.trim().split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (line.startsWith('{') && line.endsWith('}')) {
      try {
        const parsed = JSON.parse(line);
        if (parsed.caseResults || parsed.verdict) {
          const caseResults: CaseEvaluationResult[] = (parsed.caseResults || []).map((cr: any, idx: number) => {
            const tc = testCases[idx] || {};
            return {
              index: cr.index || idx + 1,
              input: tc.input || JSON.stringify(tc.parsedInput || []),
              expected: cr.expected !== undefined ? String(cr.expected) : JSON.stringify(tc.expected),
              actual: cr.actual !== undefined ? String(cr.actual) : 'None',
              passed: !!cr.passed,
              isHidden: !!tc.isHidden,
              description: tc.description,
              runtimeMs: cr.runtimeMs || 0
            };
          });

          const passedCases = parsed.passedCases !== undefined
            ? parsed.passedCases
            : caseResults.filter(c => c.passed).length;
          const totalCases = parsed.totalCases || testCases.length;
          const verdict = parsed.verdict || (passedCases === totalCases ? 'Accepted' : 'Wrong Answer');
          const failedCaseDetails = caseResults.find(c => !c.passed);

          return {
            verdict,
            passedCases,
            totalCases,
            runtimeMs: parsed.runtimeMs || fallbackMs,
            memoryMb: parsed.memoryMb || 14.5,
            caseResults,
            failedCaseDetails,
            stdout: lines.slice(0, i)
          };
        }
      } catch {
        // Continue searching
      }
    }
  }
  return null;
}

/**
 * Execute code via Piston API (https://emkc.org/api/v2/piston/execute)
 */
async function executeViaPiston(
  harnessSource: string,
  pistonConfig: { language: string; version: string; filename: string },
  testCases: any[],
  timeoutMs: number
): Promise<{ success: boolean; result?: ExecutionResult; isWhitelistedError?: boolean }> {
  const pistonUrl = process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston/execute';

  try {
    const response = await fetch(pistonUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.PISTON_API_KEY ? { 'Authorization': process.env.PISTON_API_KEY } : {})
      },
      body: JSON.stringify({
        language: pistonConfig.language,
        version: pistonConfig.version,
        files: [
          {
            name: pistonConfig.filename,
            content: harnessSource
          }
        ],
        run_timeout: Math.ceil(timeoutMs / 1000)
      }),
      signal: AbortSignal.timeout(timeoutMs + 4000)
    });

    if (!response.ok) {
      const errText = await response.text();
      const isWhitelisted = errText.includes('whitelist') || response.status === 401 || response.status === 403;
      return { success: false, isWhitelistedError: isWhitelisted };
    }

    const data = await response.json();

    // Check if emkc returned a whitelist message in a 200 response
    if (data.message && data.message.includes('whitelist')) {
      return { success: false, isWhitelistedError: true };
    }

    // 1. Check compilation errors
    if (data.compile && data.compile.output && data.compile.code !== 0) {
      return {
        success: true,
        result: {
          verdict: 'Compilation Error',
          passedCases: 0,
          totalCases: testCases.length,
          runtimeMs: 0,
          memoryMb: 0,
          caseResults: testCases.map((tc, idx) => ({
            index: idx + 1,
            input: tc.input || JSON.stringify(tc.parsedInput || []),
            expected: JSON.stringify(tc.expected),
            actual: 'Compilation Error',
            passed: false,
            isHidden: !!tc.isHidden
          })),
          stdout: [],
          errorMessage: data.compile.output
        }
      };
    }

    // 2. Check runtime exceptions from stderr
    const stderr = data.run?.stderr || '';
    const stdout = data.run?.stdout || '';

    // 3. Parse structured stdout
    const parsedResult = parseHarnessStdout(stdout, testCases, 12);
    if (parsedResult) {
      return { success: true, result: parsedResult };
    }

    // If stdout didn't have structured results and stderr exists, report Runtime Error
    if (stderr && data.run?.code !== 0) {
      return {
        success: true,
        result: {
          verdict: 'Runtime Error',
          passedCases: 0,
          totalCases: testCases.length,
          runtimeMs: 0,
          memoryMb: 0,
          caseResults: [],
          stdout: stdout ? stdout.split('\n') : [],
          errorMessage: stderr
        }
      };
    }

    // Fallback if stdout exists
    return {
      success: true,
      result: {
        verdict: 'Wrong Answer',
        passedCases: 0,
        totalCases: testCases.length,
        runtimeMs: 1,
        memoryMb: 14.0,
        caseResults: testCases.map((tc, idx) => ({
          index: idx + 1,
          input: tc.input || '',
          expected: JSON.stringify(tc.expected),
          actual: stdout.trim() || 'No output',
          passed: false
        })),
        stdout: stdout ? stdout.split('\n') : [],
        errorMessage: stderr || undefined
      }
    };
  } catch (err: any) {
    return { success: false, isWhitelistedError: false };
  }
}

/**
 * Execute code via Judge0 CE (https://ce.judge0.com/submissions?wait=true)
 */
async function executeViaJudge0(
  harnessSource: string,
  judge0Id: number,
  testCases: any[],
  timeoutMs: number
): Promise<ExecutionResult> {
  const response = await fetch('https://ce.judge0.com/submissions?wait=true', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language_id: judge0Id,
      source_code: harnessSource,
      cpu_time_limit: Math.ceil(timeoutMs / 1000)
    }),
    signal: AbortSignal.timeout(timeoutMs + 4000)
  });

  const data = await response.json();

  // 1. Compilation Error
  if (data.compile_output && (data.status?.id === 6 || !data.stdout)) {
    return {
      verdict: 'Compilation Error',
      passedCases: 0,
      totalCases: testCases.length,
      runtimeMs: 0,
      memoryMb: 0,
      caseResults: testCases.map((tc, idx) => ({
        index: idx + 1,
        input: tc.input || JSON.stringify(tc.parsedInput || []),
        expected: JSON.stringify(tc.expected),
        actual: 'Compilation Error',
        passed: false,
        isHidden: !!tc.isHidden
      })),
      stdout: [],
      errorMessage: data.compile_output
    };
  }

  // 2. Parse structured stdout
  const runtimeMs = data.time ? Math.round(parseFloat(data.time) * 1000) : 10;
  const memoryMb = data.memory ? Math.round((data.memory / 1024) * 10) / 10 : 14.5;
  const stdout = data.stdout || '';
  const stderr = data.stderr || '';

  const parsedResult = parseHarnessStdout(stdout, testCases, runtimeMs);
  if (parsedResult) {
    parsedResult.runtimeMs = runtimeMs;
    parsedResult.memoryMb = memoryMb;
    return parsedResult;
  }

  // 3. Time Limit Exceeded
  if (data.status?.id === 5) {
    return {
      verdict: 'Time Limit Exceeded',
      passedCases: 0,
      totalCases: testCases.length,
      runtimeMs: timeoutMs,
      memoryMb,
      caseResults: [],
      stdout: [],
      errorMessage: 'Time limit exceeded.'
    };
  }

  // 4. Runtime Error
  if (stderr || data.status?.id >= 7) {
    return {
      verdict: 'Runtime Error',
      passedCases: 0,
      totalCases: testCases.length,
      runtimeMs,
      memoryMb,
      caseResults: [],
      stdout: stdout ? stdout.split('\n') : [],
      errorMessage: stderr || data.message || 'Runtime exception.'
    };
  }

  return {
    verdict: 'Wrong Answer',
    passedCases: 0,
    totalCases: testCases.length,
    runtimeMs,
    memoryMb,
    caseResults: testCases.map((tc, idx) => ({
      index: idx + 1,
      input: tc.input || '',
      expected: JSON.stringify(tc.expected),
      actual: stdout.trim() || 'No output',
      passed: false
    })),
    stdout: stdout ? stdout.split('\n') : [],
    errorMessage: stderr || undefined
  };
}

/**
 * Master execution handler that resolves problems, maps languages, builds harnesses,
 * and routes to Piston (with resilient Judge0 CE fallback).
 */
export async function executeJudgeSubmission(payload: JudgeExecutionPayload): Promise<ExecutionResult> {
  const { problemId, language, code, customTestcases, timeoutMs = 4000 } = payload;

  // Resolve problem definition
  let matchedProblem: any = null;
  if (problemId !== undefined && problemId !== null) {
    matchedProblem = PROBLEMS.find(
      p => p.id === String(problemId) ||
           p.number === Number(problemId) ||
           p.slug === String(problemId)
    );
  }

  // Fallback to first problem if not found
  if (!matchedProblem) {
    matchedProblem = PROBLEMS[0];
  }

  const functionName = payload.functionName || matchedProblem.functionName;

  // Determine testcases
  let testCasesToRun: any[] = payload.testCases || matchedProblem.sampleTestCases || [];

  if (Array.isArray(customTestcases) && customTestcases.length > 0) {
    const customCases = customTestcases.map((raw, idx) => {
      let parsedInput: any[] = [];
      try {
        const parsed = JSON.parse(raw);
        parsedInput = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        parsedInput = [raw];
      }
      return {
        input: raw,
        parsedInput,
        expected: null,
        description: `Custom Test ${idx + 1}`
      };
    });
    testCasesToRun = [...testCasesToRun, ...customCases];
  }

  // Dynamic language config
  const langConfig = LANGUAGE_PISTON_CONFIG[language] || LANGUAGE_PISTON_CONFIG.python;

  // Wrap user code in language-specific harness
  const harnessSource = generateLanguageHarness({
    language,
    code,
    functionName,
    testCases: testCasesToRun
  });

  // Attempt 1: Piston Execution API
  const pistonAttempt = await executeViaPiston(harnessSource, langConfig, testCasesToRun, timeoutMs);
  if (pistonAttempt.success && pistonAttempt.result) {
    return pistonAttempt.result;
  }

  // Attempt 2: Judge0 Sandbox API (native Java 17, C++ GCC 14, C GCC 14, Python 3.11)
  try {
    const judge0Result = await executeViaJudge0(harnessSource, langConfig.judge0Id, testCasesToRun, timeoutMs);
    return judge0Result;
  } catch (judge0Err: any) {
    return {
      verdict: 'Runtime Error',
      passedCases: 0,
      totalCases: testCasesToRun.length,
      runtimeMs: 0,
      memoryMb: 0,
      caseResults: [],
      stdout: [],
      errorMessage: 'Execution sandbox service unavailable: ' + (judge0Err.message || String(judge0Err))
    };
  }
}
