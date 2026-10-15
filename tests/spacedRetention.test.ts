import { getTodayString, addDays, computeProblemStatus } from '../src/services/storageService';

console.log('[Test Suite] Running Spaced Retention Rules Test...');

const today = getTodayString();
console.log(`Current base date: ${today}`);

const d3 = addDays(today, 3);
const d7 = addDays(today, 7);
const d30 = addDays(today, 30);

if (!d3 || !d7 || !d30) {
  throw new Error('Revision dates must not be null');
}

console.log(`Day 3 due: ${d3}`);
console.log(`Day 7 due: ${d7}`);
console.log(`Day 30 due: ${d30}`);

if (new Date(d3).getTime() <= new Date(today).getTime()) {
  throw new Error('Day 3 must be strictly after today');
}
if (new Date(d7).getTime() <= new Date(d3).getTime()) {
  throw new Error('Day 7 must be strictly after Day 3');
}
if (new Date(d30).getTime() <= new Date(d7).getTime()) {
  throw new Error('Day 30 must be strictly after Day 7');
}

// Test status calculations
const unstartedStatus = computeProblemStatus({});
if (unstartedStatus !== 'not_started') {
  throw new Error(`Expected not_started, got ${unstartedStatus}`);
}

const masteredStatus = computeProblemStatus({
  firstSolvedDate: '2026-01-01',
  day3Status: 'Done',
  day7Status: 'Done',
  day30Status: 'Done'
});
if (masteredStatus !== 'mastered') {
  throw new Error(`Expected mastered, got ${masteredStatus}`);
}

const redoStatus = computeProblemStatus({
  firstSolvedDate: '2026-01-01',
  day3Status: 'Done',
  day7Status: 'Redo'
});
if (redoStatus !== 'needs_revision') {
  throw new Error(`Expected needs_revision on Redo, got ${redoStatus}`);
}

console.log('✓ All Spaced Retention & Mastery calculation tests passed successfully!');
