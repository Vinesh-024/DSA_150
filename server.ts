import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { executeJudgeSubmission } from './src/services/judgeService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini AI instance on server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// AI Pedagogical Hint & Complexity Coach endpoint
app.post('/api/ai/coach', async (req, res) => {
  try {
    const { problemTitle, problemDescription, difficulty, language, userCode, hintLevel, promptType, notes } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'Gemini API key is not configured in environment secrets.',
      });
    }

    let systemInstruction = `You are a world-class DSA mentor and competitive programming coach adhering to Nihar's 'DSA in 12 Weeks' philosophy.
CRITICAL PEDAGOGICAL RULES:
1. NEVER reveal the complete final code solution unless explicitly asked for level 5.
2. Foster deep algorithmic intuition, pattern recognition, and self-discovery.
3. Be concise, direct, encouraging, and clear. Avoid fluff.
4. When analyzing complexity, distinguish worst-case time, best-case, and auxiliary space.`;

    let userPrompt = '';

    if (promptType === 'struggle_hint') {
      const hintTiers = [
        'Level 1 (Conceptual Nudge): Ask a guiding Socratic question about the problem invariants, constraints, or a small 3-element example observation.',
        'Level 2 (Pattern Recognition): Name the relevant algorithmic pattern (e.g., Two Pointers, Monotonic Stack, Sliding Window, Prefix Sum) and explain why this pattern fits the problem characteristics.',
        'Level 3 (Algorithmic Guidance): Walk through the mental state transition or invariant steps in pseudo-logic without giving runnable code.',
        'Level 4 (Edge Cases & Invariants): Highlight the tricky edge cases, boundary failures, or complexity trade-offs that cause bugs in this problem.',
        'Level 5 (Complete Solution Breakdown): Explain the optimal solution step-by-step, explain why it works, provide clean commented code, and give the exact Time/Space complexity.'
      ];

      const currentTierDesc = hintTiers[Math.min(Math.max((hintLevel || 1) - 1, 0), 4)];

      userPrompt = `The student has been struggling on problem: "${problemTitle}" (${difficulty}).
Language: ${language || 'JavaScript'}

Problem Summary:
${problemDescription}

Student's Current Code Draft:
\`\`\`${language || 'javascript'}
${userCode || '// No code written yet'}
\`\`\`

Target Hint Level requested: Level ${hintLevel || 1}
Guidelines for this level:
${currentTierDesc}

Provide pedagogical guidance strictly matching this hint level. Keep your response focused and under 180 words.`;
    } else if (promptType === 'complexity_coach') {
      userPrompt = `Analyze the student's solution for "${problemTitle}" (${difficulty}).
Language: ${language || 'JavaScript'}

Student's Submitted Code:
\`\`\`${language || 'javascript'}
${userCode}
\`\`\`

Provide structured feedback in this exact format:
1. Current Approach: (1 sentence name of algorithm/data structure)
2. Estimated Time Complexity: (e.g. O(n) or O(n^2), with 1 sentence rationale)
3. Estimated Space Complexity: (e.g. O(1) or O(n), with 1 sentence rationale)
4. Bottleneck Analysis: (What line or operation is most expensive)
5. Optimization Verdict: (Is this optimal for this problem? If not, what pattern achieves optimal complexity?)
6. Learning Takeaway: (1 crisp sentence trigger: 'When you see X, think Y')`;
    } else if (promptType === 'approach_review') {
      userPrompt = `The student wants an approach review for "${problemTitle}" (${difficulty}).
Language: ${language || 'JavaScript'}

Student's Code / Idea:
\`\`\`${language || 'javascript'}
${userCode}
\`\`\`

Student's notes/thoughts: "${notes || ''}"

Evaluate whether their reasoning is sound, what edge cases they might have overlooked, and what question they should ask themselves before writing further code. Do not give away the solution.`;
    } else {
      userPrompt = `Review this DSA code for "${problemTitle}":
\`\`\`${language || 'javascript'}
${userCode}
\`\`\`
Give a concise pedagogical tip to guide the student forward.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({
      feedback: response.text || 'Keep working through small test cases on paper.',
      hintLevel: hintLevel || 1,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error generating AI coaching feedback:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate AI feedback',
    });
  }
});

// Unified Code Execution Handler using Piston and sandboxed containers
async function handleCodeExecution(req: express.Request, res: express.Response) {
  try {
    const { problemId, language, code, customTestcases, functionName, testCases, timeoutMs } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Missing code or language in execution payload' });
    }

    const result = await executeJudgeSubmission({
      problemId,
      language,
      code,
      customTestcases,
      functionName,
      testCases,
      timeoutMs
    });

    return res.json(result);
  } catch (err: any) {
    console.error('Judge execution error:', err);
    return res.status(500).json({
      verdict: 'Runtime Error',
      passedCases: 0,
      totalCases: 0,
      runtimeMs: 0,
      memoryMb: 0,
      caseResults: [],
      stdout: [],
      errorMessage: err.message || 'Execution failed unexpectedly'
    });
  }
}

app.post('/api/run', handleCodeExecution);
app.post('/api/execute', handleCodeExecution);

// Vite Middleware integration for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
