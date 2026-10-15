import { UserProblemState, SubmissionRecord, Language, MasteryStatus } from '../types/curriculum';
import { PROBLEMS } from '../data/problemsData';

const STORAGE_KEYS = {
  PROBLEM_STATES: 'cozy_problem_states_v1',
  SUBMISSIONS: 'cozy_submissions_v1',
  DRAFTS_PREFIX: 'cozy_draft_',
  ACTIVE_TIMERS: 'cozy_active_timers_v1',
  CUSTOM_TESTCASES_PREFIX: 'cozy_custom_tc_',
  DAILY_PLAN: 'cozy_daily_plan_v1'
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

export function computeProblemStatus(state: Partial<UserProblemState>): MasteryStatus {
  if (state.day30Status === 'Done') {
    return 'mastered';
  }

  if (state.day3Status === 'Redo' || state.day7Status === 'Redo' || state.day30Status === 'Redo') {
    return 'needs_revision';
  }

  if (!state.firstSolvedDate) {
    if (state.attemptsCount && state.attemptsCount > 0) return 'attempted';
    return 'not_started';
  }

  const today = getTodayString();

  // If day 3 is pending and today >= day3Due
  if (!state.day3Status && state.day3Due && today >= state.day3Due) {
    return 'needs_revision';
  }
  // If day 3 is done, check day 7
  if (state.day3Status === 'Done' && !state.day7Status && state.day7Due && today >= state.day7Due) {
    return 'needs_revision';
  }
  // If day 7 is done, check day 30
  if (state.day7Status === 'Done' && !state.day30Status && state.day30Due && today >= state.day30Due) {
    return 'needs_revision';
  }

  return (state.hintsUsedCount && state.hintsUsedCount > 1) ? 'solved_with_help' : 'solved_independently';
}

export function getInitialProblemState(problemId: string): UserProblemState {
  return {
    problemId,
    status: 'not_started',
    firstSolvedDate: null,
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
    notes: '',
    activeStruggleSeconds: 0,
    hintsUsedCount: 0,
    highestHintLevel: 0,
    attemptsCount: 0,
    lastAttemptTimestamp: null,
  };
}

export function loadAllProblemStates(): Record<string, UserProblemState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROBLEM_STATES);
    if (!raw) return initializeDefaultStates();
    const parsed = JSON.parse(raw);
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
  saveAllProblemStates(result);
  return result;
}

export function saveAllProblemStates(states: Record<string, UserProblemState>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROBLEM_STATES, JSON.stringify(states));
    window.dispatchEvent(new Event('cozy_states_updated'));
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

  // If firstSolvedDate was updated or set for the first time
  if (updates.firstSolvedDate && updates.firstSolvedDate !== current.firstSolvedDate) {
    next.firstSolvedDate = updates.firstSolvedDate;
    next.day3Due = addDays(updates.firstSolvedDate, 2);
    next.day7Due = addDays(updates.firstSolvedDate, 6);
    next.day30Due = addDays(updates.firstSolvedDate, 29);
  }

  // Handle Redo restart rule
  if (
    updates.day3Status === 'Redo' ||
    updates.day7Status === 'Redo' ||
    updates.day30Status === 'Redo'
  ) {
    const today = getTodayString();
    next.firstSolvedDate = today;
    next.day3Due = addDays(today, 2);
    next.day3Status = null;
    next.day7Due = addDays(today, 6);
    next.day7Status = null;
    next.day30Due = addDays(today, 29);
    next.day30Status = null;
    next.status = 'needs_revision';
  } else {
    next.status = computeProblemStatus(next);
  }

  states[problemId] = next;
  saveAllProblemStates(states);
  return next;
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
    window.dispatchEvent(new Event('cozy_submissions_updated'));
  } catch (e) {
    console.error('Failed to save submission', e);
  }
}

export function getSubmissionsForProblem(problemId: string): SubmissionRecord[] {
  const list = loadAllSubmissions();
  return list.filter((s) => s.problemId === problemId);
}

// Drafts
export function loadCodeDraft(problemId: string, language: Language): string | null {
  return localStorage.getItem(`${STORAGE_KEYS.DRAFTS_PREFIX}${problemId}_${language}`);
}

export function saveCodeDraft(problemId: string, language: Language, code: string): void {
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

// Full Export / Import
export function exportAllDataAsJson(): string {
  const data = {
    app: 'Cozy Code Corner',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    problemStates: loadAllProblemStates(),
    submissions: loadAllSubmissions()
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
    window.dispatchEvent(new Event('cozy_states_updated'));
    window.dispatchEvent(new Event('cozy_submissions_updated'));
    return true;
  } catch (e) {
    console.error('Import failed', e);
    return false;
  }
}

export function clearAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.PROBLEM_STATES);
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.DAILY_PLAN);
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith(STORAGE_KEYS.DRAFTS_PREFIX) || key.startsWith(STORAGE_KEYS.CUSTOM_TESTCASES_PREFIX) || key.startsWith('cozy_'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    initializeDefaultStates();
    window.dispatchEvent(new Event('cozy_states_updated'));
    window.dispatchEvent(new Event('cozy_submissions_updated'));
    window.dispatchEvent(new Event('cozy_data_cleared'));
  } catch (e) {
    console.error('Failed to clear all data', e);
  }
}
