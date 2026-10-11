import { WeekCurriculum } from '../types/curriculum';

export const WEEKS_DATA: WeekCurriculum[] = [
  {
    week: 1,
    title: 'Arrays & Hashing + Two Pointers',
    topics: ['Arrays & Hashing', 'Two Pointers'],
    problemCount: 14,
    easyCount: 4,
    mediumCount: 9,
    hardCount: 1,
    prerequisites: ['Basic loops, arrays, hash table concept, time complexity fundamentals'],
    learningObjectives: [
      'Master hash map lookups for O(1) membership checks and frequency counting',
      'Understand two-pointer convergence and opposite-end traversal',
      'Recognize when sorting enables two-pointer linear scans'
    ],
    coreCsTopic: 'Operating Systems: Processes, Threads, Memory Hierarchy, Virtual Memory',
    description: 'Build foundational muscle memory with hash sets/maps and two-pointer pointers convergence.'
  },
  {
    week: 2,
    title: 'Sliding Window + Stack',
    topics: ['Sliding Window', 'Stack'],
    problemCount: 13,
    easyCount: 2,
    mediumCount: 8,
    hardCount: 3,
    prerequisites: ['Two pointers, basic array slicing, LIFO data structures'],
    learningObjectives: [
      'Internalize dynamic vs fixed sliding window sizing invariants',
      'Master monotonic stacks for next greater/smaller element problems',
      'Recognize nested parenthesis matching and RPN expression evaluation'
    ],
    coreCsTopic: 'Operating Systems: Concurrency, Deadlocks, Mutexes, CPU Scheduling',
    description: 'Tackle contiguous subarray/substring optimizations and monotonic LIFO structures.'
  },
  {
    week: 3,
    title: 'Binary Search + Intervals',
    topics: ['Binary Search', 'Intervals'],
    problemCount: 13,
    easyCount: 2,
    mediumCount: 9,
    hardCount: 2,
    prerequisites: ['Monotonic functions, sorted arrays, interval boundaries [start, end]'],
    learningObjectives: [
      'Master binary search on values/answer spaces, not just sorted arrays',
      'Handle boundary conditions in rotated and shifted sorted sequences',
      'Sort intervals by start/end times and manage active overlapping windows'
    ],
    coreCsTopic: 'Database Management Systems (DBMS): ACID Properties, Normalization, Indexing (B-Trees)',
    description: 'Halve the search space efficiently and reason about multi-dimensional ranges.'
  },
  {
    week: 4,
    title: 'Linked List',
    topics: ['Linked List'],
    problemCount: 11,
    easyCount: 3,
    mediumCount: 6,
    hardCount: 2,
    prerequisites: ['Pointers/references, sentinel/dummy nodes, fast and slow pointers'],
    learningObjectives: [
      'Master in-place pointer rewiring without memory leaks',
      'Detect cycles using Floyd Tortoise & Hare algorithm',
      'Implement multi-pointer manipulation (Reorder List, Reverse in k-Group)'
    ],
    coreCsTopic: 'DBMS: Transactions, Isolation Levels, WAL (Write-Ahead Logging), Query Optimization',
    description: 'Develop bulletproof pointer arithmetic and sentinel node hygiene.'
  },
  {
    week: 5,
    title: 'Trees',
    topics: ['Trees'],
    problemCount: 15,
    easyCount: 6,
    mediumCount: 7,
    hardCount: 2,
    prerequisites: ['Recursion, Binary Tree node definition, BFS vs DFS queues/stacks'],
    learningObjectives: [
      'Recursively formulate subtree return invariants for height, diameter, and path sums',
      'Traverse trees level-by-level using BFS queues',
      'Validate BST properties (min/max range propagation) and subtree serialization'
    ],
    coreCsTopic: 'Computer Networks: OSI & TCP/IP Models, TCP vs UDP, Handshake, Flow Control',
    description: 'Recursive divide-and-conquer and breadth-first level traversals.'
  },
  {
    week: 6,
    title: 'Heaps + Greedy',
    topics: ['Heap / Priority Queue', 'Greedy'],
    problemCount: 15,
    easyCount: 2,
    mediumCount: 12,
    hardCount: 1,
    prerequisites: ['Complete binary trees, min/max heap invariants, local vs global optima'],
    learningObjectives: [
      'Maintain running top-k elements using bounded min/max heaps',
      'Identify greedy choices where locally optimal steps yield global optimality',
      'Solve interval scheduling and jump game reachability'
    ],
    coreCsTopic: 'Computer Networks: DNS, HTTP/1.1 vs HTTP/2 vs HTTP/3, SSL/TLS, WebSockets',
    description: 'Priority queue streaming and proofs of local optimal greedy choices.'
  },
  {
    week: 7,
    title: 'Backtracking + Tries',
    topics: ['Backtracking', 'Tries'],
    problemCount: 12,
    easyCount: 0,
    mediumCount: 10,
    hardCount: 2,
    prerequisites: ['DFS state tree, undo state mutations, prefix tree n-ary nodes'],
    learningObjectives: [
      'Systematically explore combinatorial state spaces (subsets, permutations, combinations)',
      'Prune dead-end search branches early to satisfy constraints (N-Queens, Sudoku)',
      'Build prefix trees (Tries) for instant O(L) prefix querying'
    ],
    coreCsTopic: 'Object-Oriented Programming (OOP): SOLID Principles, Design Patterns, Inheritance vs Composition',
    description: 'Combinatorial decision trees with branch pruning and prefix structures.'
  },
  {
    week: 8,
    title: 'Graphs',
    topics: ['Graphs'],
    problemCount: 13,
    easyCount: 0,
    mediumCount: 12,
    hardCount: 1,
    prerequisites: ['Adjacency list, visited sets, BFS shortest path, DFS cycle detection'],
    learningObjectives: [
      'Traverse 2D grids as implicit graphs (islands, rotting oranges flood fill)',
      'Detect cycles and topological dependencies using Kahn BFS or DFS coloring',
      'Identify connected components with Disjoint Set Union (Union-Find)'
    ],
    coreCsTopic: 'System Design Fundamentals: Client-Server, Caching (Redis), Load Balancing, CDNs',
    description: 'Connected components, grid traversals, topological sorts, and cycle detection.'
  },
  {
    week: 9,
    title: 'Advanced Graphs + Math & Geometry',
    topics: ['Advanced Graphs', 'Math & Geometry'],
    problemCount: 14,
    easyCount: 2,
    mediumCount: 9,
    hardCount: 3,
    prerequisites: ['Weighted graph shortest paths (Dijkstra), MST (Kruskal/Prim), matrix rotations'],
    learningObjectives: [
      'Implement Dijkstra priority-queue shortest paths on weighted directed networks',
      'Construct Minimum Spanning Trees (MST) with Prim / Kruskal algorithms',
      'Execute matrix manipulations (in-place rotation, spiral traversal) and numerical algorithms'
    ],
    coreCsTopic: 'System Design: Database Sharding, Replication, Consistency Models (CAP Theorem)',
    description: 'Weighted graph shortest paths, minimum spanning trees, and matrix geometry.'
  },
  {
    week: 10,
    title: '1-D Dynamic Programming',
    topics: ['1-D Dynamic Programming'],
    problemCount: 12,
    easyCount: 2,
    mediumCount: 10,
    hardCount: 0,
    prerequisites: ['Optimal substructure, overlapping subproblems, memoization vs tabulation'],
    learningObjectives: [
      'Define DP state arrays `dp[i]` representing optimal solution for prefix i',
      'Optimize space from O(n) array to O(1) state variables where only previous states matter',
      'Master decision-making DP (House Robber, Coin Change, Word Break, LIS)'
    ],
    coreCsTopic: 'System Design: Message Queues (Kafka/RabbitMQ), Asynchronous Processing, Rate Limiting',
    description: 'Break problems into optimal substructure transitions along linear dimensions.'
  },
  {
    week: 11,
    title: '2-D Dynamic Programming',
    topics: ['2-D Dynamic Programming'],
    problemCount: 11,
    easyCount: 0,
    mediumCount: 7,
    hardCount: 4,
    prerequisites: ['1D DP transitions, 2D grid pathing, string subsequence comparison'],
    learningObjectives: [
      'Formulate 2D DP grids `dp[i][j]` over two strings or coordinates',
      'Master string alignment patterns (Longest Common Subsequence, Edit Distance)',
      'Solve interval and game DP (Burst Balloons, Cooldown stock cycles)'
    ],
    coreCsTopic: 'System Design: Distributed Caching Strategies, High Availability, Microservices vs Monoliths',
    description: 'Dual-sequence alignment, grid pathing, and multidimensional state transitions.'
  },
  {
    week: 12,
    title: 'Bit Manipulation + Full Revision',
    topics: ['Bit Manipulation'],
    problemCount: 7,
    easyCount: 5,
    mediumCount: 2,
    hardCount: 0,
    prerequisites: ['Binary representation, bitwise operators (&, |, ^, ~, <<, >>), two complement'],
    learningObjectives: [
      'Use XOR properties (`x ^ x = 0`, `x ^ 0 = x`) for single number identification',
      'Count set bits using Brian Kernighan algorithm (`n & (n - 1)`)',
      'RE-SOLVE BLITZ: dedicate the lighter problem week to re-solving every overdue problem on Day 30 on blank paper!'
    ],
    coreCsTopic: 'Comprehensive Interview Prep: Mock Interviews, Behavioral STAR method, Resume Walkthrough',
    description: 'Bitwise trickery and dedicated final push to achieve 100% Day 30 Mastered retention.'
  }
];
