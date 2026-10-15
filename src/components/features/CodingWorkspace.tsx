import React, { useState, useEffect } from 'react';
import {
  Play,
  Send,
  RotateCcw,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Pause,
  ChevronDown,
  BookOpen,
  Terminal,
  ExternalLink,
  ShieldAlert,
  Brain,
  FileCode2,
  Trash2
} from 'lucide-react';
import { Problem, Language, TestCase, UserProblemState, SubmissionRecord } from '../../types/curriculum';
import { JudgeExecutionResponse } from '../../types/judge';
import { runCodeViaJudge, submitCodeViaJudge } from '../../services/judgeService';
import {
  loadCodeDraft,
  saveCodeDraft,
  loadCustomTestcases,
  saveCustomTestcases,
  saveSubmission,
  updateProblemState,
  getSubmissionsForProblem,
  getTodayString
} from '../../services/storageService';

interface CodingWorkspaceProps {
  problem: Problem;
  problemState: UserProblemState;
  onUpdateProblemState: (updates: Partial<UserProblemState>) => void;
  onNavigateRoadmap: () => void;
}

export const CodingWorkspace: React.FC<CodingWorkspaceProps> = ({
  problem,
  problemState,
  onUpdateProblemState,
  onNavigateRoadmap,
}) => {
  const [language, setLanguage] = useState<Language>('python');
  const [code, setCode] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);

  // Left Pane Active Tab
  const [leftTab, setLeftTab] = useState<'statement' | 'reflection' | 'submissions'>('statement');
  const [submissionsList, setSubmissionsList] = useState<SubmissionRecord[]>([]);

  // Console Drawer
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [consoleTab, setConsoleTab] = useState<'testcase' | 'testresult'>('testcase');
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [customCases, setCustomCases] = useState<string[]>([]);
  const [newCustomInput, setNewCustomInput] = useState('');
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);

  // Execution States
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState<JudgeExecutionResponse | null>(null);

  // 20-Minute Productive Struggle Timer
  const [timerSeconds, setTimerSeconds] = useState(problemState.activeStruggleSeconds || 0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [struggleAlertShown, setStruggleAlertShown] = useState(false);

  // Stuck Mode & Progressive Hints
  const [showStuckModal, setShowStuckModal] = useState(false);
  const [unlockedHintLevel, setUnlockedHintLevel] = useState(problemState.highestHintLevel || 0);

  // Recall Mode (Blank Page Day 30)
  const [isRecallMode, setIsRecallMode] = useState(false);

  // 6-Step Loop Reflection Fields
  const [timeComplexity, setTimeComplexity] = useState(problemState.timeComplexity || '');
  const [spaceComplexity, setSpaceComplexity] = useState(problemState.spaceComplexity || '');
  const [pattern, setPattern] = useState(problemState.pattern || '');
  const [triggerLine, setTriggerLine] = useState(problemState.triggerLine || '');
  const [notes, setNotes] = useState(problemState.notes || '');

  // Load starter code or local draft
  useEffect(() => {
    const saved = loadCodeDraft(problem.id, language);
    if (saved) {
      setCode(saved);
    } else {
      setCode(problem.starterCode[language]);
    }
  }, [problem.id, language]);

  // Load custom test cases and submissions
  useEffect(() => {
    setCustomCases(loadCustomTestcases(problem.id));
    setSubmissionsList(getSubmissionsForProblem(problem.id));
    setTimeComplexity(problemState.timeComplexity || '');
    setSpaceComplexity(problemState.spaceComplexity || '');
    setPattern(problemState.pattern || '');
    setTriggerLine(problemState.triggerLine || '');
    setNotes(problemState.notes || '');
    setTimerSeconds(problemState.activeStruggleSeconds || 0);
    setUnlockedHintLevel(problemState.highestHintLevel || 0);
  }, [problem.id, problemState]);

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          const next = prev + 1;
          if (next === 1200 && !struggleAlertShown) {
            setStruggleAlertShown(true);
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, struggleAlertShown]);

  // Save struggle time periodically
  useEffect(() => {
    const timeout = setTimeout(() => {
      onUpdateProblemState({ activeStruggleSeconds: timerSeconds });
    }, 2000);
    return () => clearTimeout(timeout);
  }, [timerSeconds]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCode(val);
    saveCodeDraft(problem.id, language, val);
  };

  const handleResetToTemplate = () => {
    const template = problem.starterCode[language];
    setCode(template);
    saveCodeDraft(problem.id, language, template);
  };

  const handleClearToBlank = () => {
    setCode('');
    saveCodeDraft(problem.id, language, '');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Keyboard Shortcuts: Ctrl+' (Run) and Ctrl+Enter (Submit)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "'") {
      e.preventDefault();
      handleRunCode();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmitCode();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const nextCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(nextCode);
      saveCodeDraft(problem.id, language, nextCode);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  // Run Code (Public sample test cases + custom cases)
  const handleRunCode = async () => {
    setIsRunning(true);
    setConsoleOpen(true);
    setConsoleTab('testresult');

    const testSuite: TestCase[] = [
      ...problem.sampleTestCases,
      ...customCases.map((c, i) => ({
        input: c,
        expected: 'Custom Run',
        description: `Custom Case ${i + 1}`
      }))
    ];

    const result = await runCodeViaJudge({
      problemId: problem.id,
      language,
      code,
      functionName: problem.functionName,
      testCases: testSuite,
    });

    setExecutionResult(result);
    setIsRunning(false);
  };

  // Submit Solution (Full evaluation with hidden test cases)
  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setConsoleOpen(true);
    setConsoleTab('testresult');

    const result = await submitCodeViaJudge({
      problemId: problem.id,
      language,
      code,
      functionName: problem.functionName,
      hintsUsedCount: unlockedHintLevel,
    });

    setExecutionResult(result);
    setIsSubmitting(false);

    // Record immutable submission
    const newSub: SubmissionRecord = {
      id: `sub_${Date.now()}`,
      problemId: problem.id,
      problemTitle: problem.title,
      language,
      code,
      verdict: result.verdict,
      runtimeMs: result.timeMs,
      memoryKb: result.memoryKb,
      totalCases: result.totalCases,
      passedCases: result.passedCases,
      timestamp: new Date().toISOString(),
      isRecallMode,
      failedCaseDetails: result.failingCase
    };
    saveSubmission(newSub);
    setSubmissionsList(getSubmissionsForProblem(problem.id));

    // Update Problem State if Accepted
    if (result.verdict === 'Accepted') {
      const today = getTodayString();
      const updates: Partial<UserProblemState> = {
        attemptsCount: (problemState.attemptsCount || 0) + 1,
        lastAttemptTimestamp: new Date().toISOString(),
      };
      if (!problemState.firstSolvedDate) {
        updates.firstSolvedDate = today;
      }
      if (isRecallMode && problemState.day7Status === 'Done') {
        updates.day30Status = 'Done';
      }
      const next = updateProblemState(problem.id, updates);
      onUpdateProblemState(next);
    } else {
      updateProblemState(problem.id, {
        attemptsCount: (problemState.attemptsCount || 0) + 1,
        lastAttemptTimestamp: new Date().toISOString(),
      });
    }
  };

  const handleSaveReflection = () => {
    const updates = {
      timeComplexity,
      spaceComplexity,
      pattern,
      triggerLine,
      notes
    };
    const next = updateProblemState(problem.id, updates);
    onUpdateProblemState(next);
  };

  const handleUnlockHint = (level: number) => {
    const nextLevel = Math.max(unlockedHintLevel, level);
    setUnlockedHintLevel(nextLevel);
    onUpdateProblemState({
      highestHintLevel: nextLevel,
      hintsUsedCount: nextLevel
    });
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const allVisibleCases = [
    ...problem.sampleTestCases,
    ...customCases.map((c, i) => ({
      input: c,
      expected: 'Custom input',
      description: `Custom Case ${i + 1}`
    }))
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] bg-[#F6F3EC]">
      {/* Workspace Header Toolbar */}
      <div className="bg-[#FFFCF6] border-b border-[#E7E1D6] px-6 py-2.5 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateRoadmap}
            className="text-xs text-[#526B58] hover:underline font-semibold"
          >
            ← Roadmap
          </button>
          <span className="text-xs text-[#8A928B]" aria-hidden="true">·</span>
          <span className="text-sm font-bold text-[#252A27] font-serif">
            {problem.number}. {problem.title}
          </span>
          <span className="text-xs text-[#526B58] font-mono">
            {problem.difficulty}
          </span>
          <span className="text-xs text-[#8A928B] hidden sm:inline">
            Week {problem.week} · {problem.topic}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Recall Mode Toggle */}
          <button
            onClick={() => setIsRecallMode(!isRecallMode)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
              isRecallMode
                ? 'bg-[#C98F79] text-white border-[#C98F79]'
                : 'bg-[#F6F3EC] text-[#565E59] border-[#E7E1D6] hover:bg-[#E7E1D6]'
            }`}
            title="Recall Mode: hides hints & solutions for Day 30 blank-page practice"
          >
            {isRecallMode ? 'Recall Mode Active' : 'Recall Mode'}
          </button>

          {/* 20-Min Productive Struggle Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl text-xs font-mono">
            <Clock className={`w-3.5 h-3.5 ${timerSeconds >= 1200 ? 'text-[#C98F79]' : 'text-[#526B58]'}`} />
            <span className="font-semibold tabular-nums text-[#252A27]">
              {formatTimer(timerSeconds)}
            </span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-0.5 hover:text-[#252A27] text-[#8A928B]"
            >
              {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
          </div>

          {/* Stuck Mode Button (disabled in Recall Mode) */}
          {!isRecallMode && (
            <button
              onClick={() => setShowStuckModal(true)}
              className="px-3 py-1.5 bg-[#A8B9A0]/20 hover:bg-[#A8B9A0]/30 text-[#526B58] border border-[#A8B9A0] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Stuck Mode (Hints)</span>
              {unlockedHintLevel > 0 && (
                <span className="text-[10px] font-mono text-[#526B58]">
                  (H{unlockedHintLevel})
                </span>
              )}
            </button>
          )}

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-[#F6F3EC] border border-[#E7E1D6] text-[#252A27] text-xs font-mono font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none"
          >
            <option value="python">Python 3</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>

          <button
            onClick={handleResetToTemplate}
            title="Reset to starter template"
            className="p-1.5 text-[#565E59] hover:text-[#252A27] hover:bg-[#E7E1D6] rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleClearToBlank}
            title="Clear to blank page"
            className="p-1.5 text-[#565E59] hover:text-[#C98F79] hover:bg-[#E7E1D6] rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopyCode}
            title="Copy Code"
            className="p-1.5 text-[#565E59] hover:text-[#252A27] hover:bg-[#E7E1D6] rounded-lg transition-colors"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-[#526B58]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Split Body: Left Problem Pane & Right Editor Surface */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Pane: Statement, 6-Step Loop, Submissions */}
        <div className="w-full md:w-[46%] lg:w-[42%] flex flex-col border-r border-[#E7E1D6] bg-[#FFFCF6] overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center border-b border-[#E7E1D6] px-4 bg-[#FFFCF6] text-xs font-semibold text-[#565E59]">
            <button
              onClick={() => setLeftTab('statement')}
              className={`py-3 px-3 border-b-2 transition-colors ${
                leftTab === 'statement'
                  ? 'border-[#526B58] text-[#252A27] font-bold'
                  : 'border-transparent hover:text-[#252A27]'
              }`}
            >
              Problem Description
            </button>
            <button
              onClick={() => setLeftTab('reflection')}
              className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                leftTab === 'reflection'
                  ? 'border-[#526B58] text-[#252A27] font-bold'
                  : 'border-transparent hover:text-[#252A27]'
              }`}
            >
              <span>6-Step Reflection</span>
              {problemState.triggerLine && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#526B58]" />
              )}
            </button>
            <button
              onClick={() => setLeftTab('submissions')}
              className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                leftTab === 'submissions'
                  ? 'border-[#526B58] text-[#252A27] font-bold'
                  : 'border-transparent hover:text-[#252A27]'
              }`}
            >
              <span>Submissions</span>
              <span className="text-[11px] text-[#8A928B] font-mono">({submissionsList.length})</span>
            </button>
          </div>

          {/* Left Content Area */}
          <div className="flex-1 overflow-y-auto p-6 text-xs space-y-6 leading-relaxed">
            {leftTab === 'statement' && (
              <>
                <div className="space-y-2">
                  <h2 className="text-base font-bold text-[#252A27] font-serif">
                    {problem.number}. {problem.title}
                  </h2>
                  <p className="text-[#565E59] text-xs leading-relaxed whitespace-pre-line">
                    {problem.description}
                  </p>
                </div>

                {/* Examples */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-[#252A27] uppercase tracking-wider">
                    Examples
                  </h3>
                  {problem.sampleTestCases.map((tc, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl font-mono text-xs space-y-1"
                    >
                      <div className="text-[#526B58] font-bold">Example {idx + 1}:</div>
                      <div>
                        <span className="text-[#8A928B]">Input: </span>
                        <span className="text-[#252A27]">{tc.input}</span>
                      </div>
                      <div>
                        <span className="text-[#8A928B]">Output: </span>
                        <span className="text-[#526B58] font-bold">{JSON.stringify(tc.expected)}</span>
                      </div>
                      {tc.description && (
                        <div className="text-[#565E59] text-[11px] font-sans pt-1">
                          {tc.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                {problem.constraints && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-[#252A27] uppercase tracking-wider">
                      Constraints
                    </h3>
                    <ul className="list-disc list-inside font-mono text-[11px] text-[#565E59] space-y-1">
                      {problem.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            {leftTab === 'reflection' && (
              <div className="space-y-4">
                <div className="p-3 bg-[#A8B9A0]/15 border border-[#A8B9A0]/40 rounded-xl space-y-1">
                  <div className="text-xs font-bold text-[#526B58] font-serif">
                    The Nihar 6-Step Deliberate Loop
                  </div>
                  <p className="text-[11px] text-[#565E59] leading-relaxed">
                    Label your invariants and pattern triggers. This forms your personal study review notes on Day 3, 7, and 30.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#565E59] mb-1">
                      Time Complexity
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. O(n)"
                      value={timeComplexity}
                      onChange={(e) => setTimeComplexity(e.target.value)}
                      className="w-full bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl px-3 py-2 text-xs font-mono text-[#252A27] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#565E59] mb-1">
                      Space Complexity
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. O(n)"
                      value={spaceComplexity}
                      onChange={(e) => setSpaceComplexity(e.target.value)}
                      className="w-full bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl px-3 py-2 text-xs font-mono text-[#252A27] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#565E59] mb-1">
                    Algorithmic Pattern
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hash Map Complement, Two Pointers"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    className="w-full bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl px-3 py-2 text-xs text-[#252A27] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#565E59] mb-1">
                    Trigger Line (When you see X, think Y)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. When searching for pairs summing to target, use hash map complement"
                    value={triggerLine}
                    onChange={(e) => setTriggerLine(e.target.value)}
                    className="w-full bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl px-3 py-2 text-xs text-[#252A27] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#565E59] mb-1">
                    Notes & Alternative Trade-Offs
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Compare brute-force O(n^2) vs optimal O(n) hash map..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl px-3 py-2 text-xs text-[#252A27] focus:outline-none resize-none"
                  />
                </div>

                <button
                  onClick={handleSaveReflection}
                  className="w-full py-2.5 bg-[#526B58] hover:bg-[#435748] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Save Reflection to Learning Tracker
                </button>
              </div>
            )}

            {leftTab === 'submissions' && (
              <div className="space-y-3">
                {submissionsList.length === 0 ? (
                  <p className="text-center text-[#8A928B] py-8">
                    No submissions recorded yet for this problem. Click "Submit Solution" to run authoritative tests.
                  </p>
                ) : (
                  submissionsList.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl space-y-1.5 font-mono text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-bold flex items-center gap-1.5 ${
                            sub.verdict === 'Accepted'
                              ? 'text-[#526B58]'
                              : 'text-[#C98F79]'
                          }`}
                        >
                          {sub.verdict === 'Accepted' ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                          {sub.verdict}
                        </span>
                        <span className="text-[11px] text-[#8A928B]">
                          {new Date(sub.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-[#565E59]">
                        <span>Passed: {sub.passedCases} / {sub.totalCases}</span>
                        <span aria-hidden="true">·</span>
                        <span>{sub.runtimeMs} ms</span>
                        <span aria-hidden="true">·</span>
                        <span className="uppercase">{sub.language}</span>
                      </div>
                      <button
                        onClick={() => setCode(sub.code)}
                        className="text-[11px] text-[#526B58] hover:underline font-sans"
                      >
                        Load this code snapshot into editor →
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Code Editor Surface & Bottom Drawer */}
        <div className="w-full md:w-[54%] lg:w-[58%] flex flex-col bg-[#1A1E1B] overflow-hidden">
          {/* Editor Header */}
          <div className="bg-[#222724] border-b border-[#303732] px-4 py-2 flex items-center justify-between text-xs text-[#8A928B] font-mono shrink-0">
            <span>Solution.{language === 'python' ? 'py' : language === 'java' ? 'java' : 'cpp'}</span>
            <span>Auto-saving draft locally</span>
          </div>

          {/* Code Textarea Area */}
          <div className="flex-1 relative flex flex-col bg-[#1A1E1B] overflow-hidden">
            <textarea
              value={code}
              onChange={handleCodeChange}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              placeholder="// Write your solution here..."
              className="flex-1 w-full p-5 bg-[#1A1E1B] text-[#E2E8F0] font-mono text-xs sm:text-sm leading-relaxed resize-none focus:outline-none selection:bg-[#526B58]/50"
            />
          </div>

          {/* Bottom Console Drawer */}
          <div className={`border-t border-[#303732] bg-[#222724] flex flex-col transition-all ${consoleOpen ? 'h-56' : 'h-10'}`}>
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#252A27] border-b border-[#303732] shrink-0 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setConsoleOpen(true);
                    setConsoleTab('testcase');
                  }}
                  className={`px-3 py-1 font-semibold rounded-md transition-colors ${
                    consoleTab === 'testcase' && consoleOpen
                      ? 'bg-[#303732] text-white'
                      : 'text-[#8A928B] hover:text-white'
                  }`}
                >
                  Testcase
                </button>
                <button
                  onClick={() => {
                    setConsoleOpen(true);
                    setConsoleTab('testresult');
                  }}
                  className={`px-3 py-1 font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                    consoleTab === 'testresult' && consoleOpen
                      ? 'bg-[#303732] text-white'
                      : 'text-[#8A928B] hover:text-white'
                  }`}
                >
                  <span>Test Result</span>
                  {executionResult && (
                    <span className={`w-2 h-2 rounded-full ${executionResult.verdict === 'Accepted' ? 'bg-[#A8B9A0]' : 'bg-[#C98F79]'}`} />
                  )}
                </button>
              </div>

              {/* Action Buttons: Run Code & Submit Solution */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConsoleOpen(!consoleOpen)}
                  className="p-1 text-[#8A928B] hover:text-white"
                  title={consoleOpen ? 'Collapse Console' : 'Expand Console'}
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${consoleOpen ? '' : 'rotate-180'}`} />
                </button>

                <button
                  onClick={handleRunCode}
                  disabled={isRunning || isSubmitting}
                  className="px-3.5 py-1.5 bg-[#303732] hover:bg-[#3D463F] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#3D463F]"
                  title="Run Sample Tests (Ctrl + ')"
                >
                  <Play className="w-3.5 h-3.5 text-[#A8B9A0]" />
                  <span>{isRunning ? 'Running...' : 'Run'}</span>
                  <span className="text-[10px] text-[#8A928B] font-mono hidden sm:inline">(Ctrl+')</span>
                </button>

                <button
                  onClick={handleSubmitCode}
                  disabled={isRunning || isSubmitting}
                  className="px-4 py-1.5 bg-[#526B58] hover:bg-[#435748] active:scale-[0.98] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                  title="Submit & Evaluate Hidden Tests (Ctrl + Enter)"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Evaluating...' : 'Submit'}</span>
                  <span className="text-[10px] text-[#A8B9A0] font-mono hidden sm:inline">(Ctrl+↵)</span>
                </button>
              </div>
            </div>

            {/* Console Drawer Content */}
            {consoleOpen && (
              <div className="flex-1 overflow-y-auto p-4 text-xs font-mono text-[#E2E8F0]">
                {consoleTab === 'testcase' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {allVisibleCases.map((tc, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedCaseIndex(idx)}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                            selectedCaseIndex === idx
                              ? 'bg-[#526B58] text-white'
                              : 'bg-[#1A1E1B] text-[#8A928B] hover:text-white border border-[#303732]'
                          }`}
                        >
                          Case {idx + 1}
                        </button>
                      ))}
                    </div>

                    <div className="p-3 bg-[#1A1E1B] border border-[#303732] rounded-lg">
                      <div className="text-[11px] text-[#8A928B] mb-1">Input parameter:</div>
                      <div className="text-[#E2E8F0] font-mono whitespace-pre-wrap">
                        {allVisibleCases[selectedCaseIndex]?.input}
                      </div>
                    </div>
                  </div>
                )}

                {consoleTab === 'testresult' && (
                  <div className="space-y-3">
                    {!executionResult ? (
                      <div className="text-[#8A928B] py-6 text-center font-sans">
                        Click "Run" to test with samples, or "Submit" to evaluate all hidden test cases.
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between pb-2 border-b border-[#303732]">
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-sm font-bold flex items-center gap-1.5 ${
                                executionResult.verdict === 'Accepted'
                                  ? 'text-[#A8B9A0]'
                                  : 'text-[#C98F79]'
                              }`}
                            >
                              {executionResult.verdict === 'Accepted' ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <XCircle className="w-4 h-4" />
                              )}
                              {executionResult.verdict}
                            </span>
                            <span className="text-[#8A928B] text-xs">
                              {executionResult.passedCases} / {executionResult.totalCases} test cases passed
                            </span>
                          </div>
                          <div className="text-[#8A928B] text-xs font-mono">
                            <span>{executionResult.timeMs} ms</span>
                          </div>
                        </div>

                        {executionResult.stderr && (
                          <div className="p-3 bg-[#C98F79]/15 border border-[#C98F79]/40 rounded-lg text-[#C98F79] text-xs leading-relaxed whitespace-pre-wrap">
                            {executionResult.stderr}
                          </div>
                        )}

                        {executionResult.failingCase && (
                          <div className="p-3 bg-[#1A1E1B] border border-[#303732] rounded-lg space-y-1.5">
                            <div className="text-[11px] text-[#C98F79] font-bold">Failing Testcase Input:</div>
                            <div className="text-[#E2E8F0]">{executionResult.failingCase.input}</div>
                            <div className="text-[11px] text-[#8A928B]">Expected: {JSON.stringify(executionResult.failingCase.expected)}</div>
                            <div className="text-[11px] text-[#C98F79]">Output: {JSON.stringify(executionResult.failingCase.actual)}</div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stuck Mode Modal (Progressive 4-Tier Hints) */}
      {showStuckModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#252A27]/70 backdrop-blur-sm p-4">
          <div className="bg-[#FFFCF6] border border-[#E7E1D6] rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#526B58]" />
                <h3 className="text-base font-bold text-[#252A27] font-serif">
                  Stuck Mode: Progressive Learning Tiers
                </h3>
              </div>
              <button
                onClick={() => setShowStuckModal(false)}
                className="text-[#8A928B] hover:text-[#252A27] text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#565E59] leading-relaxed">
              Progressive hints guide your mental model without robbing you of the "Aha!" moment. Solve independently whenever possible to earn full retention credit.
            </p>

            <div className="space-y-3">
              {/* Tier 1 */}
              <div className="p-4 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#252A27]">
                    Tier 1: Conceptual Nudge
                  </span>
                  {unlockedHintLevel >= 1 ? (
                    <span className="text-[11px] text-[#526B58] font-semibold">Revealed</span>
                  ) : (
                    <button
                      onClick={() => handleUnlockHint(1)}
                      className="px-2.5 py-1 bg-[#526B58] text-white text-[11px] font-bold rounded-lg"
                    >
                      Unlock H1
                    </button>
                  )}
                </div>
                {unlockedHintLevel >= 1 && (
                  <p className="text-xs text-[#565E59] leading-relaxed">
                    {problem.hints.h1}
                  </p>
                )}
              </div>

              {/* Tier 2 */}
              <div className="p-4 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#252A27]">
                    Tier 2: Pattern & Data Structure Clue
                  </span>
                  {unlockedHintLevel >= 2 ? (
                    <span className="text-[11px] text-[#526B58] font-semibold">Revealed</span>
                  ) : (
                    <button
                      onClick={() => handleUnlockHint(2)}
                      disabled={unlockedHintLevel < 1}
                      className="px-2.5 py-1 bg-[#526B58] disabled:bg-[#8A928B] text-white text-[11px] font-bold rounded-lg"
                    >
                      Unlock H2
                    </button>
                  )}
                </div>
                {unlockedHintLevel >= 2 && (
                  <p className="text-xs text-[#565E59] leading-relaxed">
                    {problem.hints.h2}
                  </p>
                )}
              </div>

              {/* Tier 3 */}
              <div className="p-4 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#252A27]">
                    Tier 3: Algorithmic Steps & Invariants
                  </span>
                  {unlockedHintLevel >= 3 ? (
                    <span className="text-[11px] text-[#526B58] font-semibold">Revealed</span>
                  ) : (
                    <button
                      onClick={() => handleUnlockHint(3)}
                      disabled={unlockedHintLevel < 2}
                      className="px-2.5 py-1 bg-[#526B58] disabled:bg-[#8A928B] text-white text-[11px] font-bold rounded-lg"
                    >
                      Unlock H3
                    </button>
                  )}
                </div>
                {unlockedHintLevel >= 3 && (
                  <p className="text-xs text-[#565E59] leading-relaxed whitespace-pre-line">
                    {problem.hints.h3}
                  </p>
                )}
              </div>

              {/* Tier 4 */}
              <div className="p-4 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#252A27]">
                    Tier 4: Full Code Solution & Breakdown
                  </span>
                  {unlockedHintLevel >= 4 ? (
                    <span className="text-[11px] text-[#526B58] font-semibold">Revealed</span>
                  ) : (
                    <button
                      onClick={() => handleUnlockHint(4)}
                      disabled={unlockedHintLevel < 3}
                      className="px-2.5 py-1 bg-[#C98F79] disabled:bg-[#8A928B] text-white text-[11px] font-bold rounded-lg"
                    >
                      Reveal Full Code
                    </button>
                  )}
                </div>
                {unlockedHintLevel >= 4 && (
                  <div className="text-[11px] text-[#565E59] font-mono leading-relaxed whitespace-pre-line p-2 bg-[#FFFCF6] border border-[#E7E1D6] rounded-lg">
                    {problem.hints.h4}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
