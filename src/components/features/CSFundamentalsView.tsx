import React, { useState } from 'react';
import { BookOpen, CheckCircle2, ChevronRight, HelpCircle, Sparkles, Terminal, Code2 } from 'lucide-react';

interface Lesson {
  id: string;
  module: string;
  title: string;
  keyPoints: string[];
  content: string;
  interviewQuestion: string;
  answerExplanation: string;
}

const LESSONS: Lesson[] = [
  {
    id: 'oop-1',
    module: 'OOP & Java',
    title: 'Polymorphism: Compile-Time vs Runtime Dispatch',
    keyPoints: [
      'Method Overloading happens at compile time based on parameter signatures.',
      'Method Overriding occurs at runtime using dynamic method dispatch via vtable.',
      'Java uses virtual dispatch for non-static, non-final methods by default.'
    ],
    content: `Polymorphism allows objects to be treated as instances of their parent class while executing overridden behavior.

In Java:
1. Compile-Time (Static): Method overloading resolved by compiler based on arguments and types.
2. Runtime (Dynamic): Method overriding resolved at runtime via the object's actual class memory structure (vtable lookup).

Code Example:
Animal a = new Dog();
a.speak(); // invokes Dog's speak() via dynamic dispatch`,
    interviewQuestion: 'Can you override static or private methods in Java? Why or why not?',
    answerExplanation: 'No. Static methods belong to the class, not an instance, and are resolved at compile time (method hiding, not overriding). Private methods are not inherited by subclasses and cannot be overridden.'
  },
  {
    id: 'dbms-1',
    module: 'DBMS',
    title: 'Indexing: B+ Trees vs Hash Indexes',
    keyPoints: [
      'B+ Trees store all data in leaf nodes linked sequentially for O(log N) range queries.',
      'Hash Indexes provide O(1) point lookups but cannot support range comparisons (<, >).',
      'Clustered Index determines the physical ordering of data pages on disk.'
    ],
    content: `Database indexes drastically reduce disk I/O when executing SELECT queries.

B+ Trees are the industry standard for RDBMS (PostgreSQL, MySQL InnoDB) because:
- High fan-out reduces tree depth (typically 3 to 4 levels for millions of rows).
- Leaf nodes form a doubly linked list, enabling rapid sequential scans for queries like WHERE age BETWEEN 20 AND 30.

Hash indexes compute a hash function on the key. Excellent for exact key lookup (WHERE id = 5), but useless for range scans or sorting.`,
    interviewQuestion: 'Why does adding too many indexes slow down INSERT, UPDATE, and DELETE queries?',
    answerExplanation: 'Because every index is a separate on-disk data structure. Whenever a row is inserted, updated, or deleted, every auxiliary index must be synchronously updated and rebalanced, generating additional disk I/O.'
  },
  {
    id: 'sql-1',
    module: 'SQL',
    title: 'Joins: INNER, LEFT, RIGHT & FULL OUTER',
    keyPoints: [
      'INNER JOIN returns only rows where the join condition matches in both tables.',
      'LEFT JOIN returns all rows from the left table and matched rows from the right table (NULL if no match).',
      'Window functions (ROW_NUMBER, RANK, DENSE_RANK) compute aggregates without collapsing rows.'
    ],
    content: `SQL joins combine columns from one or more tables based on related keys.

Example Query: Find top 3 highest-earning employees per department:
WITH RankedSalaries AS (
  SELECT name, department_id, salary,
         DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as rank
  FROM employees
)
SELECT name, department_id, salary
FROM RankedSalaries
WHERE rank <= 3;`,
    interviewQuestion: 'What is the difference between RANK() and DENSE_RANK() in SQL?',
    answerExplanation: 'RANK() skips numbers after ties (e.g., 1, 2, 2, 4), whereas DENSE_RANK() does not skip numbers after ties (e.g., 1, 2, 2, 3).'
  },
  {
    id: 'os-1',
    module: 'Operating Systems',
    title: 'Process vs Thread, Context Switching & Deadlocks',
    keyPoints: [
      'A process has its own address space, memory pages, file descriptors, and security context.',
      'Threads share code, data, and heap segments but have their own registers and call stack.',
      'Coffman conditions for deadlock: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.'
    ],
    content: `Processes are units of resource allocation; threads are units of execution scheduling.

Context Switching:
- Process switch involves saving registers, switching Page Table Base Register (CR3 on x86), and invalidating the TLB cache.
- Thread switch within the same process does not flush the TLB or reload memory maps, making it significantly faster.

Deadlock Prevention:
Break circular wait by enforcing a strict global ordering on lock acquisition.`,
    interviewQuestion: 'What causes thrashing in virtual memory systems?',
    answerExplanation: 'Thrashing occurs when the system spends more time swapping pages between RAM and disk than executing instructions, caused when total working set sizes exceed physical memory.'
  },
  {
    id: 'net-1',
    module: 'Computer Networks',
    title: 'TCP 3-Way Handshake, Flow Control & Congestion Control',
    keyPoints: [
      'SYN -> SYN-ACK -> ACK establishes sequence numbers and window sizes.',
      'Flow control prevents overwhelming the receiver using sliding window advertised by receiver.',
      'Congestion control prevents overwhelming the network using Congestion Window (cwnd), slow start, and AIMD.'
    ],
    content: `TCP provides reliable, ordered, byte-stream delivery over IP.

The 3-Way Handshake:
1. Client sends SYN (seq = x)
2. Server responds with SYN-ACK (seq = y, ack = x + 1)
3. Client acknowledges with ACK (ack = y + 1)

Why 3 packets?
To ensure both sides synchronize initial sequence numbers and verify bidirectional packet transmission before sending payload data.`,
    interviewQuestion: 'Why does HTTP/3 use UDP instead of TCP?',
    answerExplanation: 'HTTP/3 uses QUIC over UDP to solve TCP head-of-line blocking: in TCP, if a single packet is lost, all multiplexed streams are blocked until retransmission completes. QUIC handles loss per-stream.'
  },
  {
    id: 'se-1',
    module: 'Software Engineering',
    title: 'SOLID Design Principles & Clean Architecture',
    keyPoints: [
      'Single Responsibility: A class should have one, and only one, reason to change.',
      'Open/Closed: Software entities should be open for extension, but closed for modification.',
      'Liskov Substitution: Derived classes must be substitutable for their base classes.',
      'Interface Segregation: Clients should not be forced to depend upon interfaces they do not use.',
      'Dependency Inversion: Depend upon abstractions, not concretions.'
    ],
    content: `SOLID principles guide the design of maintainable, decoupled object-oriented systems.

Dependency Inversion in Practice:
Instead of a OrderProcessor directly instantiating a PostgresDatabase, it depends on a DatabaseRepository interface. In tests, an InMemoryRepository can be injected without altering business logic.`,
    interviewQuestion: 'Explain the difference between coupling and cohesion.',
    answerExplanation: 'Cohesion refers to how closely related the responsibilities inside a single module are (high cohesion is desired). Coupling refers to how dependent different modules are on one another (loose coupling is desired).'
  }
];

export const CSFundamentalsView: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(LESSONS[0]);
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-[#FFFCF6] border border-[#E7E1D6] rounded-2xl p-6 space-y-2">
        <h2 className="text-xl font-bold text-[#252A27] font-serif">
          Computer Science Fundamentals Library
        </h2>
        <p className="text-xs text-[#565E59]">
          High-yield interview preparation across OOP, DBMS, SQL, Operating Systems, Networks, and Software Engineering.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Module / Lesson Selector (4 cols) */}
        <div className="md:col-span-4 bg-[#FFFCF6] border border-[#E7E1D6] rounded-2xl p-4 space-y-2">
          <div className="text-xs font-bold text-[#565E59] uppercase tracking-wider px-2 py-1">
            Lessons & Topics
          </div>
          <div className="space-y-1.5">
            {LESSONS.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  setSelectedLesson(l);
                  setShowAnswer(false);
                }}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  selectedLesson.id === l.id
                    ? 'bg-[#526B58] text-white shadow-xs'
                    : 'bg-[#F6F3EC] text-[#252A27] hover:bg-[#E7E1D6]'
                }`}
              >
                <div className={`text-[10px] uppercase font-mono font-bold ${selectedLesson.id === l.id ? 'text-[#A8B9A0]' : 'text-[#526B58]'}`}>
                  {l.module}
                </div>
                <div className="text-xs font-semibold mt-0.5 line-clamp-1">
                  {l.title}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Lesson Reader & Question Deck (8 cols) */}
        <div className="md:col-span-8 bg-[#FFFCF6] border border-[#E7E1D6] rounded-2xl p-6 space-y-6">
          <div className="space-y-2 border-b border-[#E7E1D6] pb-4">
            <div className="text-xs font-mono font-bold text-[#526B58] uppercase">
              {selectedLesson.module}
            </div>
            <h3 className="text-xl font-bold text-[#252A27] font-serif">
              {selectedLesson.title}
            </h3>
          </div>

          {/* Key Invariants */}
          <div className="p-4 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl space-y-2">
            <div className="text-xs font-bold text-[#252A27] uppercase tracking-wider">
              Core Invariants & Takeaways
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs text-[#565E59]">
              {selectedLesson.keyPoints.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </div>

          {/* Explanation Content */}
          <div className="space-y-3 text-xs leading-relaxed text-[#252A27] whitespace-pre-line font-sans">
            {selectedLesson.content}
          </div>

          {/* Interview Practice Flashcard */}
          <div className="p-5 bg-[#F6F3EC] border border-[#A8B9A0] rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#526B58] uppercase tracking-wider font-mono">
              <HelpCircle className="w-4 h-4" />
              <span>Interview Practice Question</span>
            </div>
            <p className="text-xs font-semibold text-[#252A27] leading-relaxed">
              {selectedLesson.interviewQuestion}
            </p>

            {showAnswer ? (
              <div className="p-3 bg-[#FFFCF6] border border-[#E7E1D6] rounded-lg text-xs text-[#565E59] leading-relaxed">
                <strong>Answer: </strong>
                {selectedLesson.answerExplanation}
              </div>
            ) : (
              <button
                onClick={() => setShowAnswer(true)}
                className="px-3.5 py-1.5 bg-[#526B58] hover:bg-[#435748] text-white text-xs font-bold rounded-lg transition-colors"
              >
                Reveal Model Answer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
