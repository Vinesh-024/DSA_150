export interface AiHintRequest {
  problemTitle: string;
  problemDescription: string;
  difficulty: string;
  language: string;
  userCode: string;
  hintLevel?: number; // 1 to 5
  promptType: 'struggle_hint' | 'complexity_coach' | 'approach_review';
  notes?: string;
}

export interface AiHintResponse {
  feedback: string;
  hintLevel: number;
  timestamp: string;
  error?: string;
}

export async function requestAiCoach(params: AiHintRequest): Promise<AiHintResponse> {
  try {
    const res = await fetch('/api/ai/coach', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    console.warn('AI Coach request failed, providing local pedagogical fallback:', error);
    // Provide fallback pedagogical hints based on requested level if API key is not yet configured
    return {
      feedback: getFallbackPedagogicalAdvice(params.hintLevel || 1, params.problemTitle, params.promptType),
      hintLevel: params.hintLevel || 1,
      timestamp: new Date().toISOString(),
      error: error.message
    };
  }
}

function getFallbackPedagogicalAdvice(level: number, title: string, promptType: string): string {
  if (promptType === 'complexity_coach') {
    return `Complexity Analysis Guide for "${title}":
1. Current Approach: Analyze loop depth and state storage.
2. Target Time Complexity: Most optimal solutions for this problem run in O(n) or O(n log n) time.
3. Target Space Complexity: Strive for O(1) auxiliary space or O(n) hash set/map storage.
4. Bottleneck check: Check for nested iterations or repeated slicing.`;
  }

  const adviceByLevel: Record<number, string> = {
    1: `Level 1 Nudge: Take a blank sheet of paper. Trace an example with just 3-4 elements. What invariant or property is true after examining the first 2 items?`,
    2: `Level 2 Pattern: Look at the input constraints. If the data is ordered or can be sorted, can two pointers or binary search eliminate redundant checks? If unordered, what information can a hash set remember?`,
    3: `Level 3 Algorithm: Instead of recalculating from scratch each step, formulate the transition: can you maintain a running window, stack, or running maximum as you iterate?`,
    4: `Level 4 Edge Cases: What happens on an empty input? Single element? All duplicates? Negative values? Guard against out-of-bounds index errors.`,
    5: `Level 5 Solution Insight: Review the core intuition: convert the nested O(n²) search into an O(n) single-pass lookup or two-pointer convergence. Write the solution in clean steps.`
  };

  return adviceByLevel[level] || adviceByLevel[1];
}
