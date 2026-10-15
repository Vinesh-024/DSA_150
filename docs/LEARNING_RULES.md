# LEARNING RULES & REVISION ENGINE SPECIFICATION

## 1. The 30-Day Blank Page Law
Solving a problem once is not learning it. A problem is mastered only when the learner can re-solve it on Day 30 on a blank page without compiler hints, external lookups, or solution inspection.

## 2. Spaced Repetition Timeline
From the initial solve date `T`:
- **Day 3 Review**: `T + 2 days` — Recall the core pattern and approach without opening hints.
- **Day 7 Review**: `T + 6 days` — Re-solve and articulate the pattern invariants.
- **Day 30 Review (Recall Mode)**: `T + 29 days` — Blank-page recall check: no starter scaffolding, no hints, test only on submission.

## 3. The Redo Restart Rule
If a review fails on Day 3, Day 7, or Day 30:
1. The problem is flagged as `needs_revision` (Redo).
2. The spaced repetition cycle restarts with Day 1 set to today's date.
3. Prior attempt history and notes are preserved in the learner's timeline.

## 4. Mastery State Machine
- `not_started`: Unattempted problem.
- `attempted`: Code submitted or timed attempt made, but not yet accepted.
- `solved_with_help`: Accepted after viewing Hint 2, 3, or 4.
- `solved_independently`: Accepted with 0 or only Hint 1 (conceptual nudge).
- `needs_revision`: Due for Day 3/7/30 review or marked "Redo".
- `mastered`: Successfully cleared Day 30 recall independently.

## 5. 20-Minute Productive Struggle Rule
- Learners are guided to spend at least 20 minutes in focused problem exploration before opening algorithmic hints.
- The timer provides gentle feedback, never a punitive lockout.
- 4 Progressive Hint Tiers:
  - **H1 (Conceptual Nudge)**: Clarifying question or small observation.
  - **H2 (Pattern / Data Structure)**: Identifies the algorithmic paradigm.
  - **H3 (Algorithmic Steps)**: Ordered pseudo-steps of the state transitions.
  - **H4 (Full Solution & Code)**: Complete explanation and code breakdown.
