import { ProblemStatus, ReSolveChoice, SubmissionRecord, UserProblemState } from '../types/curriculum';
import { PROBLEMS } from '../data/curriculumData';

const STORAGE_KEYS = {
  PROBLEM_STATES: 'neetcode150_problem_states_v1',
  SUBMISSIONS: 'neetcode150_submissions_v1',
  DAILY_ROUTINE: 'neetcode150_daily_routine_v1',
  DRAFTS_PREFIX: 'neetcode150_draft_',
  ACTIVE_TIMERS: 'neetcode150_active_timers_v1',
  CUSTOM_TESTCASES_PREFIX: 'neetcode150_custom_tc_'
};

export function addDays(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

export function getTodayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

export function computeProblemStatus(state: Partial<UserProblemState>): ProblemStatus {
  if (state.day30Status === 'Done') {
    return 'mastered';
  }

  if (state.day3Status === 'Redo' || state.day7Status === 'Redo' || state.day30Status === 'Redo') {
    return 'redo';
  }

  if (!state.day1Date) {
    if (state.attemptsCount && state.attemptsCount > 0) return 'in_progress';
    return 'not_started';
  }

  const today = getTodayString();

  // If day 3 is pending and today >= day3Due
  if (!state.day3Status && state.day3Due && today >= state.day3Due) {
    return 'resolve_due';
  }
  // If day 3 is done, check day 7
  if (state.day3Status === 'Done' && !state.day7Status && state.day7Due && today >= state.day7Due) {
    return 'resolve_due';
  }
  // If day 7 is done, check day 30
  if (state.day7Status === 'Done' && !state.day30Status && state.day30Due && today >= state.day30Due) {
    return 'resolve_due';
  }

  return 'in_progress';
}

export function getInitialProblemState(problemId: string): UserProblemState {
  return {
    problemId,
    status: 'not_started',
    day1Date: null,
    day3Due: null,
    day3Status: null,
    day7Due: null,
    day7Status: null,
    day30Due: null,
    day30Status: null,
    timeComplexity: '',
    spaceComplexity: '',
    pattern: '',
    triggerLine: '',
    confidenceRating: 0,
    attemptsCount: 0,
    activeTimeSeconds: 0,
    lastAttemptTimestamp: null,
    hintsUsedCount: 0,
    isSolvedIndependently: true,
    notes: '',
    twoMinuteExplanationRecorded: false
  };
}

// Load all problem states
export function loadAllProblemStates(): Record<string, UserProblemState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROBLEM_STATES);
    if (!raw) return initializeDefaultStates();
    const parsed = JSON.parse(raw);
    // Ensure all 150 problems are represented
    const result: Record<string, UserProblemState> = {};
    for (const p of PROBLEMS) {
      if (parsed[p.id]) {
        result[p.id] = {
          ...parsed[p.id],
          status: computeProblemStatus(parsed[p.id])
        };
      } else {
        result[p.id] = getInitialProblemState(p.id);
      }
    }
    return result;
  } catch (e) {
    console.error('Failed to load problem states from localStorage', e);
    return initializeDefaultStates();
  }
}

function initializeDefaultStates(): Record<string, UserProblemState> {
  const result: Record<string, UserProblemState> = {};
  for (const p of PROBLEMS) {
    result[p.id] = getInitialProblemState(p.id);
  }
  // Save initial
  saveAllProblemStates(result);
  return result;
}

export function saveAllProblemStates(states: Record<string, UserProblemState>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROBLEM_STATES, JSON.stringify(states));
    window.dispatchEvent(new Event('neetcode_states_updated'));
  } catch (e) {
    console.error('Failed to save states to localStorage', e);
  }
}

export function updateProblemState(problemId: string, updates: Partial<UserProblemState>): UserProblemState {
  const states = loadAllProblemStates();
  const current = states[problemId] || getInitialProblemState(problemId);

  let next: UserProblemState = {
    ...current,
    ...updates
  };

  // If day1Date was updated or set for the first time
  if (updates.day1Date && updates.day1Date !== current.day1Date) {
    next.day1Date = updates.day1Date;
    next.day3Due = addDays(updates.day1Date, 2);
    next.day7Due = addDays(updates.day1Date, 6);
    next.day30Due = addDays(updates.day1Date, 29);
  }

  // Handle Redo restart rule
  if (
    updates.day3Status === 'Redo' ||
    updates.day7Status === 'Redo' ||
    updates.day30Status === 'Redo'
  ) {
    const today = getTodayString();
    next.day1Date = today;
    next.day3Due = addDays(today, 2);
    next.day3Status = null;
    next.day7Due = addDays(today, 6);
    next.day7Status = null;
    next.day30Due = addDays(today, 29);
    next.day30Status = null;
    next.status = 'redo';
  } else {
    next.status = computeProblemStatus(next);
  }

  states[problemId] = next;
  saveAllProblemStates(states);
  return next;
}

// Reset problem to Day 1 Redo cycle directly
export function markProblemAsRedo(problemId: string): UserProblemState {
  const today = getTodayString();
  return updateProblemState(problemId, {
    day1Date: today,
    day3Status: null,
    day7Status: null,
    day30Status: null,
    status: 'redo'
  });
}

// Submissions
export function loadAllSubmissions(): SubmissionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load submissions', e);
    return [];
  }
}

export function saveSubmission(submission: SubmissionRecord): void {
  try {
    const list = loadAllSubmissions();
    list.unshift(submission);
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(list));
    window.dispatchEvent(new Event('neetcode_submissions_updated'));
  } catch (e) {
    console.error('Failed to save submission', e);
  }
}

export function getSubmissionsForProblem(problemId: string): SubmissionRecord[] {
  const list = loadAllSubmissions();
  return list.filter(s => s.problemId === problemId);
}

// Drafts
export function loadCodeDraft(problemId: string, language: string): string | null {
  return localStorage.getItem(`${STORAGE_KEYS.DRAFTS_PREFIX}${problemId}_${language}`);
}

export function saveCodeDraft(problemId: string, language: string, code: string): void {
  localStorage.setItem(`${STORAGE_KEYS.DRAFTS_PREFIX}${problemId}_${language}`, code);
}

// Custom Test Cases
export function loadCustomTestcases(problemId: string): string[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.CUSTOM_TESTCASES_PREFIX}${problemId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomTestcases(problemId: string, cases: string[]): void {
  localStorage.setItem(`${STORAGE_KEYS.CUSTOM_TESTCASES_PREFIX}${problemId}`, JSON.stringify(cases));
}

// Daily Routine
export interface DailyRoutineState {
  date: string;
  problem1Solved: boolean;
  problem2Solved: boolean;
  reSolvesCompleted: boolean;
  coreCsReviewed: boolean;
  coreCsNotes: string;
}

export function loadDailyRoutine(): DailyRoutineState {
  const today = getTodayString();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_ROUTINE);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.date === today) return parsed;
    }
  } catch (e) {
    console.error(e);
  }

  const defaultState: DailyRoutineState = {
    date: today,
    problem1Solved: false,
    problem2Solved: false,
    reSolvesCompleted: false,
    coreCsReviewed: false,
    coreCsNotes: ''
  };
  saveDailyRoutine(defaultState);
  return defaultState;
}

export function saveDailyRoutine(state: DailyRoutineState): void {
  localStorage.setItem(STORAGE_KEYS.DAILY_ROUTINE, JSON.stringify(state));
  window.dispatchEvent(new Event('neetcode_routine_updated'));
}

// Full Export / Import
export function exportAllDataAsJson(): string {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    problemStates: loadAllProblemStates(),
    submissions: loadAllSubmissions(),
    dailyRoutine: loadDailyRoutine()
  };
  return JSON.stringify(data, null, 2);
}

export function importAllDataFromJson(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed.problemStates) {
      localStorage.setItem(STORAGE_KEYS.PROBLEM_STATES, JSON.stringify(parsed.problemStates));
    }
    if (parsed.submissions) {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(parsed.submissions));
    }
    if (parsed.dailyRoutine) {
      localStorage.setItem(STORAGE_KEYS.DAILY_ROUTINE, JSON.stringify(parsed.dailyRoutine));
    }
    window.dispatchEvent(new Event('neetcode_states_updated'));
    window.dispatchEvent(new Event('neetcode_submissions_updated'));
    return true;
  } catch (e) {
    console.error('Import failed', e);
    return false;
  }
}
