import { Problem } from '../types/curriculum';
import { generateAll150Problems } from './full150Catalog';

export const PROBLEMS: Problem[] = generateAll150Problems();

// Helper to look up problems by ID, string number, or slug
export function getProblemById(idOrSlug: string): Problem | undefined {
  if (!idOrSlug) return undefined;
  // Support p-001 or p-1 or slug or numeric
  const cleanId = idOrSlug.replace('p-00', 'p-').replace('p-0', 'p-');
  return PROBLEMS.find(
    (p) =>
      p.id === idOrSlug ||
      p.id === cleanId ||
      p.slug === idOrSlug ||
      p.number.toString() === idOrSlug ||
      `p-${p.number}` === idOrSlug
  );
}

export const ROADMAP_WEEKS = [
  { week: 1, title: 'Arrays & Hashing', focus: 'Hash maps, sets, frequency counting, and amortized O(1) lookups.' },
  { week: 2, title: 'Two Pointers', focus: 'Opposite-end traversal, sorted-array two-sum, and palindrome invariance.' },
  { week: 3, title: 'Sliding Window', focus: 'Dynamic & fixed windows, running state, and substring tracking.' },
  { week: 4, title: 'Stack & Monotonic Queue', focus: 'LIFO evaluation, matching delimiters, and nearest greater elements.' },
  { week: 5, title: 'Binary Search', focus: 'Logarithmic search space reduction, sorted arrays, and search on answer.' },
  { week: 6, title: 'Linked List', focus: 'Pointer manipulation, fast & slow runners, in-place reversal.' },
  { week: 7, title: 'Trees & BFS/DFS', focus: 'Recursive traversal, binary search trees, and level-order processing.' },
  { week: 8, title: 'Tries & Heap / Priority Queue', focus: 'Prefix trees, streaming top-K elements, and median tracking.' },
  { week: 9, title: 'Backtracking', focus: 'Decision trees, state undoing, permutations, and combinations.' },
  { week: 10, title: 'Graphs & Connectivity', focus: 'Adjacency list, BFS shortest path, DFS connected components, cycle detection.' },
  { week: 11, title: '1D & 2D Dynamic Programming', focus: 'Optimal substructure, overlapping subproblems, memoization, and tabulation.' },
  { week: 12, title: 'Greedy, Intervals & Bit Manipulation', focus: 'Local choice optimality, interval merging, and binary bitwise operations.' }
];
