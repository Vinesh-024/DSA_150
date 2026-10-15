import { PROBLEMS } from '../../src/data/problemsData';

export interface ValidationReport {
  totalValidated: number;
  validCount: number;
  errors: { problemId: string; issues: string[] }[];
}

export function validateProblemCatalog(): ValidationReport {
  const errors: { problemId: string; issues: string[] }[] = [];

  PROBLEMS.forEach((problem) => {
    const issues: string[] = [];

    if (!problem.id || !problem.id.startsWith('p-')) {
      issues.push(`Invalid ID: ${problem.id}`);
    }
    if (!problem.title) issues.push('Missing title');
    if (!problem.slug) issues.push('Missing slug');
    if (!['Easy', 'Medium', 'Hard'].includes(problem.difficulty)) {
      issues.push(`Invalid difficulty: ${problem.difficulty}`);
    }
    if (!problem.week || problem.week < 1 || problem.week > 12) {
      issues.push(`Invalid week: ${problem.week}`);
    }
    if (!problem.starterCode?.python) issues.push('Missing Python starter code');
    if (!problem.starterCode?.java) issues.push('Missing Java starter code');
    if (!problem.starterCode?.cpp) issues.push('Missing C++ starter code');
    if (!problem.sampleTestCases || problem.sampleTestCases.length === 0) {
      issues.push('Missing sample test cases');
    }
    if (!problem.hints?.h1 || !problem.hints?.h2 || !problem.hints?.h3 || !problem.hints?.h4) {
      issues.push('Missing one or more progressive hints (h1, h2, h3, h4 required)');
    }

    if (issues.length > 0) {
      errors.push({ problemId: problem.id, issues });
    }
  });

  return {
    totalValidated: PROBLEMS.length,
    validCount: PROBLEMS.length - errors.length,
    errors
  };
}

const report = validateProblemCatalog();
console.log(`[Catalog Validation] ${report.validCount}/${report.totalValidated} problems valid.`);
if (report.errors.length > 0) {
  console.error('[Catalog Validation Errors]:', JSON.stringify(report.errors, null, 2));
}
