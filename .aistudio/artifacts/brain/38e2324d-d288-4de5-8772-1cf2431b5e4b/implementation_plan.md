# DSA in 12 Weeks: NeetCode 150 Re-Solve Platform

An interactive, high-retention Data Structures & Algorithms learning and re-solving application implementing the authoritative 12-week NeetCode 150 curriculum, Nihar's 6-step loop with Day 3/7/30 spaced repetition, a LeetCode-identical code editor & judging environment with hidden test cases, and a pedagogical AI hint coach.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were updated and confirmed based on your specifications:
> - **LeetCode-Style Code Editor & Console**: Identical interaction paradigm to LeetCode's web IDE:
>   - Language selector (JavaScript, TypeScript, Python 3) with official LeetCode starter signatures.
>   - Reset to default code stub, format code, and draft auto-saving.
>   - Keyboard shortcuts: `Ctrl+'` / `Cmd+'` to **Run Code**, `Ctrl+Enter` / `Cmd+Enter` to **Submit**.
>   - Bottom drawer with **Testcase tab** (Case 1, Case 2, Case 3 pills + "+ Add Custom Testcase") and **Test Result tab** (Verdict, Runtime ms, Memory MB, Input, Output, Expected).
> - **Two-Stage Test Evaluation & Hidden Test Cases**:
>   - **Run Code**: Executes strictly against visible sample testcases and any user-added custom testcases for rapid local debugging.
>   - **Submit**: Evaluates against the **entire authoritative test suite, including hidden edge-case & stress-test suites** (boundary values, large arrays, empty inputs, negative numbers, duplicates).
>   - Verdict reporting matches LeetCode: `X / Y test cases passed`, `Accepted`, `Wrong Answer` (with failing input and diff), `Time Limit Exceeded (3.0s)`, or `Runtime Error`.
> - **AI Struggle & Hint Protocol**: Configurable timer (default 20 minutes of active coding struggle) providing 5 progressive Socratic hint levels without spoiling code solutions.
> - **Retention & Revision Engine**: Strict Nihar 6-step loop with automatic Day 3, Day 7, and Day 30 re-solve milestones, automated "Redo" reset cycle, pattern naming, and trigger line recording.

---

## 1. Overview & Core Concept

- **What It Does**: A complete, distraction-free DSA platform designed to build genuine problem-solving ability and memory retention. Unlike simple clone trackers or shallow editors, it structures the entire 12-week NeetCode 150 journey (150 problems across 12 distinct weeks, 28 Easy, 101 Medium, 21 Hard) around deliberate practice: 20-minute struggle before hints, complexity self-labeling, pattern and trigger line articulation, and spaced re-solving on Day 3, Day 7, and Day 30 (paper/blank page mode).
- **Target Audience**: Engineers and computer science students preparing for technical interviews who want deep algorithmic understanding rather than superficial problem counts.
- **Key Value**: Enforces the foundational law: *"Solving a problem once is not learning it. A problem is yours only when you can solve it again on Day 30 without looking."*

---

## 2. LeetCode-Identical Code Editor & Two-Stage Evaluation

### A. LeetCode-Style Editor Experience

```
┌────────────────────────────────────────────────────────────────────────┐
│ [Language: Python 3 ▾]    [Auto-Saved]    [↺ Reset Stub]   [⌨ Shortcuts]│
├───────────────────────────────────┬────────────────────────────────────┤
│ Problem Spec & 6-Step Loop        │ Code Editor                        │
│ • Title, Difficulty, Tags         │ 1  class Solution:                 │
│ • Description, Examples, Bounds   │ 2      def containsDuplicate(self, │
│ • 20-Minute Active Struggle Timer │ 3                             nums):│
│ • Pattern & Trigger Line Notes    │ 4          seen = set()            │
├───────────────────────────────────┴────────────────────────────────────┤
│ Bottom Console Drawer                                                  │
│ [Testcase] [Test Result]          [Run (Ctrl+')]  [Submit (Ctrl+↵)]    │
│ ├─ Testcase: [Case 1] [Case 2] [Case 3] [+ Add Custom Testcase]        │
│ │    nums = [1, 2, 3, 1]                                               │
│ └─ Test Result:  Accepted (18ms · 42.1MB)   • 14/14 test cases passed  │
│      [Case 1: Passed]  [Case 2: Passed]  [Case 3: Passed]              │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Editor Features**:
   - **Language Selection**: Instant switching between **JavaScript**, **TypeScript**, and **Python 3** with canonical LeetCode method signatures.
   - **Reset Code Affordance**: One-click reset to the clean initial starter stub with confirmation modal.
   - **Auto-Closing & Formatting**: Auto-pairs brackets `()`, `[]`, `{}`, quotes, and handles automatic 4-space / 2-space indentation.
   - **Shortcuts**:
     - `Ctrl+'` / `Cmd+'`: Run Code (Sample tests)
     - `Ctrl+Enter` / `Cmd+Enter`: Submit (Full suite including hidden tests)
   - **Local Draft Store**: Keystrokes persistently saved per problem and per language in `localStorage`.

2. **Console Drawer Tabs**:
   - **Testcase Tab**:
     - Switch between default Case 1, Case 2, Case 3.
     - "+ Add Testcase": Custom input parameter field allowing users to test their own edge cases.
   - **Test Result Tab**:
     - Status Banner: Green `Accepted` / Red `Wrong Answer` / Amber `Time Limit Exceeded` / Red `Runtime Error`.
     - Test Case Count: e.g. `14 / 14 test cases passed` on submission, or `8 / 14 test cases passed`.
     - Case Breakdown: Input, Output, and Expected Output with visual diff highlighting.
     - Stdout / Debug print statements console.

### B. Two-Stage Evaluation & Hidden Test Cases

```
┌───────────────────────────────────────────────────────────────────────┐
│                           User Triggers Run                           │
└───────────────────────────────────┬───────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────────────┐
│          RUN CODE (Ctrl + ')         │  │         SUBMIT (Ctrl + Enter)        │
│ • Runs visible sample testcases      │  │ • Runs ALL testcases:                │
│ • Runs user-added custom testcases   │  │   - Visible sample cases             │
│ • Fast diagnostic loop               │  │   - Comprehensive HIDDEN test suite  │
│ • Does NOT record official solve     │  │ • Stress tests & boundary edge cases │
│                                      │  │ • Records official immutable record  │
└──────────────────┬───────────────────┘  └──────────────────┬───────────────────┘
                   │                                         │
                   ▼                                         ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────────────┐
│           Sandbox Runner             │  │           Full Judge Engine          │
│ • Web Worker (JS/TS) / Safe Runner   │  │ • Web Worker / Safe Subprocess       │
│ • 3000ms Timeout Watchdog            │  │ • 3000ms Timeout Watchdog            │
│ • Deep-equality value assertions     │  │ • Deep-equality against hidden tests │
└──────────────────┬───────────────────┘  └──────────────────┬───────────────────┘
                   │                                         │
                   ▼                                         ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────────────┐
│ Output: Sample Results Only          │  │ Output: Official LeetCode Verdict    │
│ • Input / Output / Expected          │  │ • Accepted: All N hidden cases pass  │
│ • Runtime ms                         │  │ • Wrong Answer: Failed at Case K/N   │
│                                      │  │ • Updates Day 1 & 6-step loop flow   │
└──────────────────────────────────────┘  └──────────────────────────────────────┘
```

1. **Hidden Test Cases Composition**:
   - Every problem includes both visible canonical cases and **comprehensive hidden test cases** covering:
     - **Boundary Limits**: Empty structures (`[]`, `""`), single elements (`[1]`), two elements, identical elements.
     - **Sign & Range**: Negative numbers, zero, extreme values.
     - **Stress & Scale**: Arrays with 100+ to 1,000+ elements to test $O(n^2)$ vs $O(n)$ / $O(n \log n)$ time limits.
     - **Duplicates & Inversions**: All identical values, reverse-sorted inputs, strictly descending/ascending order.
2. **Infinite Loop & Resource Protection**:
   - Both Run Code and Submit are guarded by a 3000ms watchdog timer. Any non-terminating recursion or `while` loop triggers `Time Limit Exceeded` without freezing the UI.
3. **Official Verdict Actions**:
   - When a problem receives **Accepted** on Submit:
     - Prompts the learner to complete Step 3 & Step 5 of Nihar's 6-step loop: record Time/Space complexity, identify the Pattern, and write the one-line Trigger.
     - Schedules Day 3, Day 7, and Day 30 re-solves automatically.

---

## 3. User Experience & Visual Design

### Key User Flows

1. **Dashboard & Daily Command Center**:
   - Current Week, Overall 150-problem completion, Mastered count (Day 30 completed), Re-solves due today, and Active streak.
   - "Today's Routine" widget displaying: 1-2 new curriculum problems, today's re-solve review queue, and 30-minute Core CS concept reminder.
   - Quick navigation into the Code Workspace with "Continue Learning".

2. **12-Week Curriculum Explorer & Roadmap**:
   - Week-by-week accordion and roadmap displaying learning objectives, prerequisites, topics, and problem cards.
   - Problem cards showing NeetCode ID, difficulty badge, status indicators (Not Started, In Progress, Re-solve Due, Mastered, Redo), free version link (for LeetCode premium problems), and direct links to NeetCode explanation video.

3. **Interactive Problem Workspace**:
   - Split-pane layout with LeetCode-identical editor and console drawer.
   - Active Struggle Timer with pause/resume and automatic 20-minute trigger modal offering: *"Continue independently"*, *"Give me a small hint"*, or *"Review my approach"*.
   - 5 Progressive AI Hint levels (Conceptual nudge -> Pattern recognition -> Algorithmic guidance -> Edge cases & complexity -> Worked explanation).
   - Real test execution showing input, expected output, actual output, runtime, and pass/fail assertion matrix.

4. **Interactive Spreadsheet Tracker (Re-Solve Tracker)**:
   - Replicates the exact layout of the authoritative `DSA_12_Week_NeetCode150_Tracker.xlsx` / PDF sheet.
   - Direct inline inputs for: Day 1 Date, Time/Space Complexity, Pattern, Trigger Line, Day 3 dropdown (Done/Redo), Day 7 dropdown (Done/Redo), Day 30 dropdown (Done/Redo), and Status computation.
   - Instant "Redo" handling: marking Redo resets Day 1 to current date and restarts the retention clock.
   - Bulk filter by week, topic, status, difficulty, and re-solve priority.

5. **Visual Analytics & Retention Radar**:
   - Topic distribution bar and radar charts.
   - Weekly planned vs. actual progress velocity.
   - Retention curve showing problems in Day 1 -> Day 3 -> Day 7 -> Day 30 Mastery pipeline.
   - Independent vs. Assisted solve ratios.

6. **Video Insights & Methodology (Nihar @niihaaarrrr)**:
   - Dedicated learning guide highlighting the 6-step loop, the 2-to-3 hour daily routine, and retention evidence.

### Visual Identity & Theme

- **Aesthetic Direction**: High-focus, dark-first developer environment (`#0B0F19` deep space canvas, `#111827` elevated structural surfaces, `#1F2937` borders).
- **Color Palette & Discipline (60-30-10)**:
  - 60% Canvas: `#0B0F19` / `#0D1117`
  - 30% Structural: `#161E2E` card surfaces, `#1F2937` subtle hairline borders, `#94A3B8` secondary slate text.
  - 10% Accents: Amber/Gold `#F59E0B` for triggers & timers, Emerald `#10B981` for Mastered & Accepted, Indigo `#6366F1` for primary actions, Rose `#F43F5E` for Redo.
- **Typography**: Clean sans headers (`Plus Jakarta Sans`), readable body (`DM Sans`), and tabular monospace figures (`JetBrains Mono`, `tabular-nums`) for code, timestamps, and test matrices.
- **Top Bar Contract**: Clean 3-zone layout: `[DSA 12-Week Re-Solve]` — `[Dashboard · Roadmap · Problems · Tracker · Analytics · Video Insights]` — `[Workspace CTA]`.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Top Navigation Bar                              │
│   [DSA 12 Weeks]  ·  [Dashboard | Roadmap | Tracker | Analytics]       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  Home Dashboard  │      │ Problem Workspace│      │ Re-Solve Tracker │
│  - Today Queue   │      │ - LeetCode IDE   │      │ - Excel replica  │
│  - 6-Step Loop   │      │ - Console Drawer │      │ - Day 1/3/7/30   │
│  - Mastered KPI  │      │ - 20m Timer      │      │ - Redo reset     │
│  - Streak Log    │      │ - Test Harness   │      │ - Trigger Lines  │
└────────┬─────────┘      └────────┬─────────┘      └────────┬─────────┘
         │                         │                         │
         └─────────────────────────┼─────────────────────────┘
                                   ▼
                   ┌───────────────────────────────┐
                   │    Client Application Store   │
                   │    - 150 Problems Registry    │
                   │    - User Progress & Records  │
                   │    - Drafts & Submissions     │
                   └───────────────┬───────────────┘
                                   │
              ┌────────────────────┴────────────────────┐
              ▼                                         ▼
   ┌───────────────────────┐                 ┌───────────────────────┐
   │ Safe In-Browser Engine│                 │   Server API Proxy    │
   │ - Web Worker Sandbox  │                 │   - /api/ai/coach     │
   │ - Hidden Tests Suite  │                 │   - /api/execute      │
   │ - Watchdog (3000ms)   │                 │   - Gemini 3.8 Flash  │
   └───────────────────────┘                 └───────────────────────┘
```

### Data Model & Key Entities

- `Problem`:
  - `id`: string (e.g. `p-217`)
  - `number`: number (e.g. 217)
  - `title`: string ("Contains Duplicate")
  - `week`: number (1..12)
  - `topic`: string ("Arrays & Hashing")
  - `difficulty`: "Easy" | "Medium" | "Hard"
  - `leetcodeUrl`: string
  - `freeVersionUrl`?: string
  - `solutionVideoUrl`?: string
  - `starterCode`: Record<"javascript" | "python" | "typescript", string>
  - `sampleTestCases`: Array<{ input: any; expected: any; description?: string }>
  - `hiddenTestCases`: Array<{ input: any; expected: any; description?: string }>
- `UserProblemState`:
  - `problemId`: string
  - `status`: "not_started" | "in_progress" | "resolve_due" | "redo" | "mastered"
  - `day1Date`: string | null (YYYY-MM-DD)
  - `day3Due`: string | null
  - `day3Status`: "pending" | "done" | "redo" | null
  - `day7Due`: string | null
  - `day7Status`: "pending" | "done" | "redo" | null
  - `day30Due`: string | null
  - `day30Status`: "pending" | "done" | "redo" | null
  - `timeComplexity`: string
  - `spaceComplexity`: string
  - `pattern`: string
  - `triggerLine`: string
  - `confidence`: 1 | 2 | 3 | 4 | 5
  - `lastAttemptDate`: string
  - `attemptsCount`: number
  - `hintsUsed`: number (0..5)
  - `activeTimeSeconds`: number
- `SubmissionRecord`:
  - `id`: string
  - `problemId`: string
  - `timestamp`: string
  - `code`: string
  - `language`: string
  - `result`: "Accepted" | "Wrong Answer" | "Runtime Error" | "Time Limit Exceeded"
  - `testsPassed`: number
  - `totalTests`: number
  - `runtimeMs`: number
  - `notes`: string
