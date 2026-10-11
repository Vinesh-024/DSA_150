import { VideoInsightItem } from '../types/curriculum';

export const VIDEO_INSIGHTS_DATA: VideoInsightItem[] = [
  {
    id: 'vi-1',
    takeaway: 'The 30-Day Blank Page Law',
    supportingEvidence: '“Solving a problem once is not learning it. A problem is yours only when you can solve it again on Day 30, on a blank page, without looking.” (Video Overview & PDF Page 1)',
    learningImplication: 'Initial problem completion creates an illusion of competence. True algorithmic mastery requires spaced recall without compiler feedback or IDE syntax auto-complete.',
    actionableBehavior: 'On Day 30 re-solve milestones, close code hints and sketch the solution on paper or blank editor before checking test passes.',
    dashboardIntegration: 'Mastered KPI widget & Retention Timeline tracking items moving from Day 1 -> Day 3 -> Day 7 -> Day 30.',
    successMetric: 'Percentage of problems solved independently on Day 30 without triggering Redo.'
  },
  {
    id: 'vi-2',
    takeaway: 'The 20-Minute Sustained Struggle Window',
    supportingEvidence: '“1. Set a 20-minute timer. Close the solution tab. Write whatever idea comes first, even brute force. Stuck after 20 minutes? Read the idea only, not the code.” (6-step loop, Step 1 & 2)',
    learningImplication: 'Premature solution viewing bypasses synaptic connections needed for problem-solving intuition. Straining for 20 minutes primes the brain to internalize the missing algorithmic pattern.',
    actionableBehavior: 'Work independently until the 20-minute timer expires. When stuck, ask for Socratic idea hints only, never copy-pasting full code.',
    dashboardIntegration: 'Active Problem Workspace 20-minute struggle timer with automated subtle prompt and 5 progressive hint tiers.',
    successMetric: 'Ratio of problems attempted for >= 20 minutes before asking for hints.'
  },
  {
    id: 'vi-3',
    takeaway: 'Mandatory Complexity Articulation',
    supportingEvidence: '“3. Write Time and Space complexity at the top of your code. Every problem, every time. Writing them is the learning.” (6-step loop, Step 3 & PDF Page 1)',
    learningImplication: 'Analyzing complexity forces the student to recognize the underlying cost of nested loops, recursion stacks, and auxiliary data structures.',
    actionableBehavior: 'Always type explicit Big-O Time and Space notes with reasoning into the submission tracker immediately after passing tests.',
    dashboardIntegration: 'Interactive Re-Solve Tracker inline columns (Time / Space) and AI Complexity Analysis Coach feedback.',
    successMetric: '100% submission adherence with recorded Time and Space complexity.'
  },
  {
    id: 'vi-4',
    takeaway: 'The Pattern Name & One-Line Trigger',
    supportingEvidence: '“5. Name the pattern and write a one-line trigger: when you see X in a question, think Y.” (6-step loop, Step 5)',
    learningImplication: 'Interviews require rapid pattern recognition in unfamiliar wording. Triggers compress a problem family into an instant mental lookup heuristic.',
    actionableBehavior: 'Record a concise trigger line for every solved problem (e.g. “When finding contiguous subarray with condition, think Sliding Window”).',
    dashboardIntegration: 'Tracker Trigger Line column, Flashcard review modal, and Quick Trigger Search.',
    successMetric: 'Number of active Trigger lines stored in user personal knowledge base.'
  },
  {
    id: 'vi-5',
    takeaway: 'The 2-to-3 Hour Daily Routine with Core CS from Week 1',
    supportingEvidence: '“Daily routine (2 to 3 hours): 1 to 2 new problems with full 6-step loop. 30 minutes: every re-solve due on Tracker. 30 minutes: core CS (OS, DBMS, SQL, OOP) from week 1, not after DSA.” (PDF Page 2)',
    learningImplication: 'Cramming Core CS subjects in the final week before interviews fails. Integrating 30 minutes of OS, DBMS, Networks, and OOP daily builds holistic software engineering depth.',
    actionableBehavior: 'Follow the 3-part daily breakdown: (1) 60-90m for 1-2 new DSA problems, (2) 30m for due re-solves, (3) 30m for Core CS study.',
    dashboardIntegration: 'Home Dashboard “Today’s Daily Routine” checklist and Core CS weekly syllabus roadmap.',
    successMetric: 'Daily routine completion streak and balanced time distribution across DSA + Core CS.'
  },
  {
    id: 'vi-6',
    takeaway: 'The Strict Redo Calendar Reset Mechanism',
    supportingEvidence: '“Redo means you could not re-solve it. Change the Day 1 date to today and clear the Day 3, Day 7 and Day 30 boxes. The calendar restarts.” (PDF Page 2)',
    learningImplication: 'Failing a spaced review means retention lapsed. Silently marking it "Done" defeats the entire system. Resetting Day 1 guarantees true mastery.',
    actionableBehavior: 'When unable to re-solve a problem on Day 3, 7, or 30 without looking, mark "Redo" and restart the spacing cadence without hesitation.',
    dashboardIntegration: 'Automated Redo button on Tracker that updates Day 1 to current date and clears subsequent milestone flags.',
    successMetric: 'Honest Redo count and eventual second-cycle Day 30 conversion rate.'
  }
];
