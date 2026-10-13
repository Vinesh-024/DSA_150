import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Send,
  RotateCcw,
  Clock,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ExternalLink,
  BookOpen,
  Plus,
  Terminal,
  FileCode2,
  Copy,
  Check,
  Pause,
  Award,
  Video,
  Maximize2,
  Minimize2,
  Activity,
  Zap,
  Sliders,
  CloudUpload,
  Cloud
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveSubmissionToCloud, uploadSolutionSnippetToStorage } from '../services/firebase';
import { Problem, UserProblemState, TestCase, SubmissionRecord } from '../types/curriculum';
import { ComplexityVisualizer } from './ComplexityVisualizer';
import {
  runTestCasesInSandbox,
  ExecutionResult,
  CaseEvaluationResult
} from '../services/executionService';
import { requestAiCoach } from '../services/aiService';
import {
  loadCodeDraft,
  saveCodeDraft,
  loadCustomTestcases,
  saveCustomTestcases,
  saveSubmission,
  updateProblemState,
  getTodayString,
  getSubmissionsForProblem
} from '../services/storageService';
import Editor, { BeforeMount, OnMount } from '@monaco-editor/react';
import { CodeEditor } from './CodeEditor';

export interface CompilerDiagnosticHint {
  type: 'typo' | 'case' | 'api' | 'syntax' | 'import';
  title: string;
  suggestion: string;
  codeSnippet?: string;
}

export function analyzeCompilerDiagnostics(
  errorMessage: string,
  userCode: string,
  language: string
): CompilerDiagnosticHint[] {
  if (!errorMessage) return [];
  const hints: CompilerDiagnosticHint[] = [];
  const lowerMsg = errorMessage.toLowerCase();

  // 1. Java-specific diagnostics
  if (language === 'java') {
    // Case sensitivity: Hashmap -> HashMap
    if (errorMessage.includes('Hashmap') || (lowerMsg.includes('cannot find symbol') && lowerMsg.includes('hashmap'))) {
      hints.push({
        type: 'case',
        title: 'Case Sensitivity Mismatch: Hashmap → HashMap',
        suggestion: 'Java standard collections are case-sensitive. Replace `Hashmap` with `HashMap<K, V>`.',
        codeSnippet: 'HashMap<Integer, Integer> map = new HashMap<>();'
      });
    }

    // Case sensitivity: Hashset -> HashSet
    if (errorMessage.includes('Hashset') || (lowerMsg.includes('cannot find symbol') && lowerMsg.includes('hashset'))) {
      hints.push({
        type: 'case',
        title: 'Case Sensitivity Mismatch: Hashset → HashSet',
        suggestion: 'Java standard collections are case-sensitive. Replace `Hashset` with `HashSet<E>`.',
        codeSnippet: 'HashSet<Integer> set = new HashSet<>();'
      });
    }

    // Case sensitivity: Arraylist -> ArrayList
    if (errorMessage.includes('Arraylist') || (lowerMsg.includes('cannot find symbol') && lowerMsg.includes('arraylist'))) {
      hints.push({
        type: 'case',
        title: 'Case Sensitivity Mismatch: Arraylist → ArrayList',
        suggestion: 'Replace `Arraylist` with `ArrayList<E>`.',
        codeSnippet: 'List<Integer> list = new ArrayList<>();'
      });
    }

    // String type: string -> String
    if (errorMessage.includes('cannot find symbol') && errorMessage.includes('class string')) {
      hints.push({
        type: 'case',
        title: 'Type Case Typo: string → String',
        suggestion: 'In Java, the String class is capitalized (`String`), unlike C++ primitive aliases.',
        codeSnippet: 'String s = "example";'
      });
    }

    // Bool -> boolean
    if (errorMessage.includes('cannot find symbol') && errorMessage.includes('class bool')) {
      hints.push({
        type: 'case',
        title: 'Primitive Type Typo: bool → boolean',
        suggestion: 'In Java, the boolean primitive type is written as `boolean` (or `Boolean` wrapper).',
        codeSnippet: 'boolean flag = true;'
      });
    }

    // API typo: getValues() -> values()
    if (errorMessage.includes('getValues') || (lowerMsg.includes('cannot find symbol') && lowerMsg.includes('getvalues'))) {
      hints.push({
        type: 'api',
        title: 'Method Name Typo: getValues() → values()',
        suggestion: 'Java Map does not have a `getValues()` method. To iterate over values, use `map.values()`. For keys, use `map.keySet()`.',
        codeSnippet: 'for (int val : map.values()) { ... }'
      });
    }

    // API typo: getKeys() -> keySet()
    if (errorMessage.includes('getKeys') || (lowerMsg.includes('cannot find symbol') && lowerMsg.includes('getkeys'))) {
      hints.push({
        type: 'api',
        title: 'Method Name Typo: getKeys() → keySet()',
        suggestion: 'Java Map does not have `getKeys()`. Use `map.keySet()` to get a Set of keys.',
        codeSnippet: 'for (int key : map.keySet()) { ... }'
      });
    }

    // Array .length() -> .length
    if (errorMessage.includes('cannot find symbol') && errorMessage.includes('method length()') && userCode.includes('.length()')) {
      hints.push({
        type: 'api',
        title: 'Array Property Typo: .length() → .length',
        suggestion: 'In Java, arrays have a `.length` field, NOT a `.length()` method. Strings use `.length()`, but arrays use `.length`.',
        codeSnippet: 'int n = nums.length; // without parentheses'
      });
    }

    // Array .size() -> .length
    if (errorMessage.includes('cannot find symbol') && errorMessage.includes('method size()') && (userCode.includes('nums.size()') || userCode.includes('arr.size()'))) {
      hints.push({
        type: 'api',
        title: 'Array Method Typo: .size() → .length',
        suggestion: 'Primitive arrays in Java use the `.length` property. Only Collections (List, Set, Map) use `.size()`.',
        codeSnippet: 'int n = nums.length;'
      });
    }

    // Variable typo: cannot find symbol: variable X (e.g. hamp vs hmap)
    const varMatches = [...errorMessage.matchAll(/cannot find symbol\s+symbol:\s+variable\s+([a-zA-Z0-9_]+)/g)];
    for (const match of varMatches) {
      const missingVar = match[1];
      const declaredVars = [...userCode.matchAll(/\b(?:int|boolean|String|char|double|long|auto|var|[A-Z][a-zA-Z0-9_<>]+)\s+([a-zA-Z0-9_]+)\b/g)]
        .map(m => m[1])
        .filter(v => v !== missingVar && v.length >= 2);

      const candidate = declaredVars.find(v => {
        if (Math.abs(v.length - missingVar.length) > 2) return false;
        const setA = new Set(v.split(''));
        const setB = new Set(missingVar.split(''));
        let common = 0;
        setA.forEach(c => { if (setB.has(c)) common++; });
        return common >= Math.min(v.length, missingVar.length) - 1;
      });

      if (candidate) {
        hints.push({
          type: 'typo',
          title: `Variable Identifier Typo: '${missingVar}' → '${candidate}'`,
          suggestion: `Compiler cannot find variable \`${missingVar}\`. Did you mean declared variable \`${candidate}\`?`,
          codeSnippet: `// Replace '${missingVar}' with '${candidate}'`
        });
      } else {
        hints.push({
          type: 'typo',
          title: `Unresolved Variable: '${missingVar}'`,
          suggestion: `Variable \`${missingVar}\` is used before declaration or scope. Ensure it is initialized before this line.`,
        });
      }
    }
  }

  // 2. C++ diagnostics
  if (language === 'cpp') {
    if (errorMessage.includes('has no member named') && errorMessage.includes('length')) {
      hints.push({
        type: 'api',
        title: 'Vector Method Typo: .length() → .size()',
        suggestion: 'In C++, std::vector uses `.size()` rather than `.length()`.',
        codeSnippet: 'int n = nums.size();'
      });
    }
  }

  // 3. General missing semicolon
  if (errorMessage.includes("';' expected")) {
    hints.push({
      type: 'syntax',
      title: 'Missing Semicolon: `;` Expected',
      suggestion: 'A line statement is missing a closing semicolon `;` at the end.',
    });
  }

  return hints;
}

interface ProblemWorkspaceProps {
  problem: Problem;
  state: UserProblemState;
  onUpdateState: (updates: Partial<UserProblemState>) => void;
  onPreviousProblem?: () => void;
  onNextProblem?: () => void;
}

export const ProblemWorkspace: React.FC<ProblemWorkspaceProps> = ({
  problem,
  state,
  onUpdateState,
  onPreviousProblem,
  onNextProblem,
}) => {
  const { user } = useAuth();
  const [snippetUploadMsg, setSnippetUploadMsg] = useState<Record<string, string>>({});

  // Language & Code Editor State: Python 3, Java, C++, C
  const [language, setLanguage] = useState<'python' | 'java' | 'cpp' | 'c'>('python');
  const [code, setCode] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ line: number; col: number }>({ line: 1, col: 1 });

  // Bottom Console Drawer State
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [activeConsoleTab, setActiveConsoleTab] = useState<'testcase' | 'testresult'>('testcase');
  const [activeCaseIndex, setActiveCaseIndex] = useState<number>(0);
  const [customCases, setCustomCases] = useState<string[]>([]);
  const [newCustomInput, setNewCustomInput] = useState<string>('');
  const [showAddCustomModal, setShowAddCustomModal] = useState<boolean>(false);

  // Execution & Judging Results
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [evaluationType, setEvaluationType] = useState<'run' | 'submit' | null>(null);
  const [executionStageMessage, setExecutionStageMessage] = useState<string>('');

  // 20-Minute Active Struggle Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(state.activeTimeSeconds || 0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [showStruggleModal, setShowStruggleModal] = useState<boolean>(false);
  const [struggleModalDismissed, setStruggleModalDismissed] = useState<boolean>(false);

  // AI Pedagogical Coach & Hints State
  const [showAiCoach, setShowAiCoach] = useState<boolean>(false);
  const [currentHintLevel, setCurrentHintLevel] = useState<number>(1);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [approachReviewNotes, setApproachReviewNotes] = useState<string>('');

  // 6-Step Loop Note Inputs
  const [timeComplexityInput, setTimeComplexityInput] = useState<string>(state.timeComplexity || '');
  const [spaceComplexityInput, setSpaceComplexityInput] = useState<string>(state.spaceComplexity || '');
  const [patternInput, setPatternInput] = useState<string>(state.pattern || '');
  const [triggerLineInput, setTriggerLineInput] = useState<string>(state.triggerLine || '');
  const [notesInput, setNotesInput] = useState<string>(state.notes || '');

  // Submissions Tab & Tool Views in Left Pane
  const [leftTab, setLeftTab] = useState<'description' | 'loop' | 'submissions' | 'complexity'>('description');
  const [submissionsList, setSubmissionsList] = useState<SubmissionRecord[]>([]);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [leftPaneCollapsed, setLeftPaneCollapsed] = useState<boolean>(false);

  // Load starter code or persisted draft
  useEffect(() => {
    const savedDraft = loadCodeDraft(problem.id, language);
    if (savedDraft) {
      setCode(savedDraft);
    } else {
      setCode(problem.starterCode[language]);
    }
  }, [problem.id, language]);

  // Load custom test cases
  useEffect(() => {
    setCustomCases(loadCustomTestcases(problem.id));
    setSubmissionsList(getSubmissionsForProblem(problem.id));
  }, [problem.id]);

  // Active Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          const next = prev + 1;
          // Trigger subtle 20-minute nudge when passing 1200 seconds (20 mins)
          if (next >= 1200 && !struggleModalDismissed && !showStruggleModal) {
            setShowStruggleModal(true);
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, struggleModalDismissed, showStruggleModal]);

  // Save elapsed time and drafts periodically
  useEffect(() => {
    onUpdateState({ activeTimeSeconds: timerSeconds });
  }, [timerSeconds]);

  const [editorEngine, setEditorEngine] = useState<'monaco' | 'canvas'>('monaco');
  const [resetConfirmOpen, setResetConfirmOpen] = useState<boolean>(false);
  const [resetSuccessToast, setResetSuccessToast] = useState<boolean>(false);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCode(val);
    saveCodeDraft(problem.id, language, val);
  };

  const handleResetCode = () => {
    try {
      localStorage.removeItem(`draft_${problem.id}_${language}`);
      localStorage.removeItem(`code_draft_${problem.id}_${language}`);
    } catch (err) {
      console.warn('Storage cleanup notice', err);
    }
    const cleanStub = problem.starterTemplates?.[language] || problem.starterCode?.[language] || '';
    setCode(cleanStub);
    saveCodeDraft(problem.id, language, cleanStub);
    if (editorRef.current) {
      editorRef.current.setValue(cleanStub);
    }
    setResetConfirmOpen(false);
    setResetSuccessToast(true);
    setTimeout(() => setResetSuccessToast(false), 3000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Monaco Editor Instance Ref & Language-Specific Theme Definitions
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const [hasCRegistered, setHasCRegistered] = useState<boolean>(true);

  // Determine the Monaco syntax theme tailored to the active language
  const getLanguageTheme = (lang: 'python' | 'java' | 'cpp' | 'c'): string => {
    switch (lang) {
      case 'java':
        return 'leetcode-java-dark';
      case 'cpp':
        return 'leetcode-cpp-dark';
      case 'c':
        return 'leetcode-c-dark';
      case 'python':
      default:
        return 'leetcode-python-dark';
    }
  };

  const getLanguageThemeLabel = (lang: 'python' | 'java' | 'cpp' | 'c'): string => {
    switch (lang) {
      case 'java':
        return 'Java Dark (IntelliJ)';
      case 'cpp':
        return 'C++20 Dark (CLion)';
      case 'c':
        return 'C11 Dark (UNIX)';
      case 'python':
      default:
        return 'Python Dark (PyCharm)';
    }
  };

  // Resolve Monaco's internal language mode identifier dynamically
  const getMonacoLanguageMode = (lang: 'python' | 'java' | 'cpp' | 'c'): string => {
    switch (lang) {
      case 'java':
        return 'java';
      case 'cpp':
        return 'cpp';
      case 'c':
        return hasCRegistered ? 'c' : 'cpp';
      case 'python':
      default:
        return 'python';
    }
  };

  const handleEditorBeforeMount: BeforeMount = (monaco) => {
    monacoRef.current = monaco;

    // Verify and ensure 'c' is recognized in Monaco
    try {
      const langs = monaco.languages.getLanguages();
      const cExists = langs.some((l: any) => l.id === 'c');
      if (!cExists) {
        monaco.languages.register({ id: 'c', extensions: ['.c', '.h'], aliases: ['c', 'C'] });
        setHasCRegistered(true);
      }
    } catch {
      // Fallback to cpp tokenizer if already registered
    }

    // 1. JAVA THEME (IntelliJ / LeetCode Java Style)
    monaco.editor.defineTheme('leetcode-java-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'FF7B72', fontStyle: 'bold' },
        { token: 'keyword.java', foreground: 'FF7B72', fontStyle: 'bold' },
        { token: 'storage.modifier', foreground: 'FF7B72', fontStyle: 'bold' },
        { token: 'storage.type', foreground: '79C0FF', fontStyle: 'bold' },
        { token: 'type', foreground: '79C0FF', fontStyle: 'bold' },
        { token: 'type.java', foreground: '79C0FF', fontStyle: 'bold' },
        { token: 'annotation', foreground: 'E3B341', fontStyle: 'bold' },
        { token: 'annotation.java', foreground: 'E3B341', fontStyle: 'bold' },
        { token: 'string', foreground: 'A5D6FF' },
        { token: 'string.java', foreground: 'A5D6FF' },
        { token: 'number', foreground: '79C0FF' },
        { token: 'number.java', foreground: '79C0FF' },
        { token: 'comment', foreground: '8B949E', fontStyle: 'italic' },
        { token: 'comment.java', foreground: '8B949E', fontStyle: 'italic' },
        { token: 'identifier', foreground: 'E6EDF3' },
        { token: 'function', foreground: 'D2A8FF' },
        { token: 'delimiter', foreground: 'C9D1D9' },
        { token: 'operator', foreground: 'FF7B72' },
      ],
      colors: {
        'editor.background': '#0C1017',
        'editor.foreground': '#E6EDF3',
        'editor.lineHighlightBackground': '#161B22',
        'editorCursor.foreground': '#E3B341',
        'editorWhitespace.foreground': '#484F58',
        'editorIndentGuide.background': '#21262D',
        'editorIndentGuide.activeBackground': '#30363D',
        'editorLineNumber.foreground': '#484F58',
        'editorLineNumber.activeForeground': '#E6EDF3',
      }
    });

    // 2. C++ THEME (Modern C++20 / CLion Style with preprocessor & template highlighting)
    monaco.editor.defineTheme('leetcode-cpp-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'FF7B72', fontStyle: 'bold' },
        { token: 'keyword.cpp', foreground: 'FF7B72', fontStyle: 'bold' },
        { token: 'keyword.directive', foreground: 'D2A8FF', fontStyle: 'bold' },
        { token: 'keyword.directive.include', foreground: 'D2A8FF', fontStyle: 'bold' },
        { token: 'keyword.directive.cpp', foreground: 'D2A8FF', fontStyle: 'bold' },
        { token: 'metatag', foreground: 'D2A8FF', fontStyle: 'bold' },
        { token: 'metatag.cpp', foreground: 'D2A8FF', fontStyle: 'bold' },
        { token: 'type', foreground: '58A6FF', fontStyle: 'bold' },
        { token: 'type.cpp', foreground: '58A6FF', fontStyle: 'bold' },
        { token: 'storage.type', foreground: '58A6FF', fontStyle: 'bold' },
        { token: 'storage.modifier', foreground: 'FF7B72' },
        { token: 'operator', foreground: 'FFA657', fontStyle: 'bold' },
        { token: 'operator.cpp', foreground: 'FFA657', fontStyle: 'bold' },
        { token: 'string', foreground: '7EE787' },
        { token: 'string.cpp', foreground: '7EE787' },
        { token: 'number', foreground: '79C0FF' },
        { token: 'number.cpp', foreground: '79C0FF' },
        { token: 'comment', foreground: '8B949E', fontStyle: 'italic' },
        { token: 'comment.cpp', foreground: '8B949E', fontStyle: 'italic' },
        { token: 'identifier', foreground: 'E6EDF3' },
        { token: 'function', foreground: 'D2A8FF' },
        { token: 'delimiter', foreground: 'C9D1D9' },
      ],
      colors: {
        'editor.background': '#0C1015',
        'editor.foreground': '#E6EDF3',
        'editor.lineHighlightBackground': '#151B23',
        'editorCursor.foreground': '#58A6FF',
        'editorWhitespace.foreground': '#484F58',
        'editorIndentGuide.background': '#21262D',
        'editorIndentGuide.activeBackground': '#30363D',
        'editorLineNumber.foreground': '#484F58',
        'editorLineNumber.activeForeground': '#E6EDF3',
      }
    });

    // 3. C THEME (C11 UNIX Dark Style with distinct pointer & preprocessor colors)
    monaco.editor.defineTheme('leetcode-c-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'FB7185', fontStyle: 'bold' },
        { token: 'keyword.c', foreground: 'FB7185', fontStyle: 'bold' },
        { token: 'keyword.directive', foreground: 'C084FC', fontStyle: 'bold' },
        { token: 'keyword.directive.c', foreground: 'C084FC', fontStyle: 'bold' },
        { token: 'metatag', foreground: 'C084FC', fontStyle: 'bold' },
        { token: 'metatag.c', foreground: 'C084FC', fontStyle: 'bold' },
        { token: 'type', foreground: '38BDF8', fontStyle: 'bold' },
        { token: 'type.c', foreground: '38BDF8', fontStyle: 'bold' },
        { token: 'storage.type', foreground: '38BDF8', fontStyle: 'bold' },
        { token: 'storage.modifier', foreground: 'FB7185' },
        { token: 'operator', foreground: 'F59E0B', fontStyle: 'bold' },
        { token: 'operator.c', foreground: 'F59E0B', fontStyle: 'bold' },
        { token: 'string', foreground: '4ADE80' },
        { token: 'string.c', foreground: '4ADE80' },
        { token: 'number', foreground: '67E8F9' },
        { token: 'number.c', foreground: '67E8F9' },
        { token: 'comment', foreground: '64748B', fontStyle: 'italic' },
        { token: 'comment.c', foreground: '64748B', fontStyle: 'italic' },
        { token: 'identifier', foreground: 'F1F5F9' },
        { token: 'function', foreground: 'A78BFA' },
        { token: 'delimiter', foreground: '94A3B8' },
      ],
      colors: {
        'editor.background': '#0B0F19',
        'editor.foreground': '#F1F5F9',
        'editor.lineHighlightBackground': '#131929',
        'editorCursor.foreground': '#38BDF8',
        'editorWhitespace.foreground': '#484F58',
        'editorIndentGuide.background': '#21262D',
        'editorIndentGuide.activeBackground': '#30363D',
        'editorLineNumber.foreground': '#484F58',
        'editorLineNumber.activeForeground': '#F1F5F9',
      }
    });

    // 4. PYTHON THEME (PyCharm / Clean Python Style)
    monaco.editor.defineTheme('leetcode-python-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'FF7B72', fontStyle: 'bold' },
        { token: 'keyword.python', foreground: 'FF7B72', fontStyle: 'bold' },
        { token: 'type', foreground: '58A6FF', fontStyle: 'bold' },
        { token: 'type.python', foreground: '58A6FF', fontStyle: 'bold' },
        { token: 'storage.type', foreground: '58A6FF' },
        { token: 'string', foreground: 'A5D6FF' },
        { token: 'string.python', foreground: 'A5D6FF' },
        { token: 'number', foreground: '79C0FF' },
        { token: 'number.python', foreground: '79C0FF' },
        { token: 'comment', foreground: '8B949E', fontStyle: 'italic' },
        { token: 'comment.python', foreground: '8B949E', fontStyle: 'italic' },
        { token: 'identifier', foreground: 'E6EDF3' },
        { token: 'function', foreground: 'D2A8FF' },
        { token: 'delimiter', foreground: 'C9D1D9' },
        { token: 'operator', foreground: 'FF7B72' },
      ],
      colors: {
        'editor.background': '#0D1117',
        'editor.foreground': '#E6EDF3',
        'editor.lineHighlightBackground': '#161B22',
        'editorCursor.foreground': '#7EE787',
        'editorWhitespace.foreground': '#484F58',
        'editorIndentGuide.background': '#21262D',
        'editorIndentGuide.activeBackground': '#30363D',
        'editorLineNumber.foreground': '#484F58',
        'editorLineNumber.activeForeground': '#E6EDF3',
      }
    });

    // Fallback theme
    monaco.editor.defineTheme('leetcode-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'FF7B72', fontStyle: 'bold' },
        { token: 'type', foreground: '79C0FF', fontStyle: 'bold' },
        { token: 'string', foreground: 'A5D6FF' },
        { token: 'number', foreground: '79C0FF' },
        { token: 'comment', foreground: '8B949E', fontStyle: 'italic' },
        { token: 'identifier', foreground: 'E6EDF3' },
        { token: 'function', foreground: 'D2A8FF' },
      ],
      colors: {
        'editor.background': '#0D1117',
        'editor.foreground': '#E6EDF3',
      }
    });
  };

  // Dynamically synchronize Monaco Editor language mode property and syntax highlighting theme
  useEffect(() => {
    const targetTheme = getLanguageTheme(language);
    const targetLangMode = getMonacoLanguageMode(language);

    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(targetTheme);
    }

    if (editorRef.current && monacoRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monacoRef.current.editor.setModelLanguage(model, targetLangMode);
      }
    }
  }, [language, hasCRegistered]);

  const handleEditorOnMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    monaco.editor.setTheme(getLanguageTheme(language));
    const model = editor.getModel();
    if (model) {
      monaco.editor.setModelLanguage(model, getMonacoLanguageMode(language));
    }
    // Track cursor position in status telemetry
    editor.onDidChangeCursorPosition((e) => {
      setCursorPos({
        line: e.position.lineNumber,
        col: e.position.column
      });
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Quote, () => {
      handleRunCode();
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleSubmitCode();
    });
  };

  // Run Code (Runs visible sample tests + custom test cases only)
  const handleRunCode = async () => {
    setIsRunning(true);
    setEvaluationType('run');
    setConsoleOpen(true);
    setActiveConsoleTab('testresult');
    setExecutionStageMessage(`Compiling ${language.toUpperCase()} and preparing test harness...`);

    const testSuiteToRun: TestCase[] = [
      ...problem.sampleTestCases,
      ...customCases.map((c, i) => ({
        input: c,
        parsedInput: tryParseJson(c),
        expected: null,
        description: `Custom Case ${i + 1}`
      }))
    ];

    const result = await runTestCasesInSandbox(
      code,
      language,
      problem.functionName,
      testSuiteToRun,
      4000,
      (_stage, msg) => setExecutionStageMessage(msg),
      problem.number || problem.id,
      customCases
    );

    setExecutionResult(result);
    setIsRunning(false);
  };

  // Submit Solution (Evaluates against BOTH Sample AND Hidden testcases)
  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setEvaluationType('submit');
    setConsoleOpen(true);
    setActiveConsoleTab('testresult');
    setExecutionStageMessage(`Compiling ${language.toUpperCase()} and evaluating against authoritative test suite...`);

    const fullAuthoritativeSuite: TestCase[] = [
      ...problem.sampleTestCases,
      ...problem.hiddenTestCases
    ];

    const result = await runTestCasesInSandbox(
      code,
      language,
      problem.functionName,
      fullAuthoritativeSuite,
      4000,
      (_stage, msg) => setExecutionStageMessage(msg),
      problem.number || problem.id
    );

    setExecutionResult(result);
    setIsSubmitting(false);

    // Record immutable submission
    const newSubmission: SubmissionRecord = {
      id: `sub_${Date.now()}`,
      problemId: problem.id,
      problemTitle: problem.title,
      timestamp: new Date().toISOString(),
      code,
      language,
      verdict: result.verdict,
      totalCases: result.totalCases,
      passedCases: result.passedCases,
      runtimeMs: result.runtimeMs,
      memoryMb: result.memoryMb,
      failedCaseDetails: result.failedCaseDetails
        ? {
            input: result.failedCaseDetails.input,
            expected: result.failedCaseDetails.expected,
            actual: result.failedCaseDetails.actual
          }
        : undefined,
      aiAssistanceUsed: showAiCoach || currentHintLevel > 1,
      hintLevelUsed: currentHintLevel
    };

    saveSubmission(newSubmission);
    if (user) {
      saveSubmissionToCloud(user.uid, newSubmission).catch(console.warn);
    }
    setSubmissionsList(getSubmissionsForProblem(problem.id));

    // If Accepted, set Day 1 date and auto-schedule Day 3/7/30 if first time!
    if (result.verdict === 'Accepted') {
      const today = getTodayString();
      if (!state.day1Date) {
        updateProblemState(problem.id, {
          day1Date: today,
          status: 'in_progress',
          attemptsCount: (state.attemptsCount || 0) + 1,
          isSolvedIndependently: currentHintLevel === 1 && !showAiCoach
        });
      } else {
        updateProblemState(problem.id, {
          attemptsCount: (state.attemptsCount || 0) + 1
        });
      }
      // Switch left tab to 6-step loop note pad so user immediately logs Time/Space and Pattern
      setLeftTab('loop');
    }
  };

  const tryParseJson = (str: string) => {
    try {
      const parsed = JSON.parse(str);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [str];
    }
  };

  // Add Custom Test Case
  const handleAddCustomCase = () => {
    if (!newCustomInput.trim()) return;
    const updated = [...customCases, newCustomInput.trim()];
    setCustomCases(updated);
    saveCustomTestcases(problem.id, updated);
    setNewCustomInput('');
    setShowAddCustomModal(false);
  };

  // AI Hint Trigger
  const handleRequestHint = async (level: number) => {
    setCurrentHintLevel(level);
    setAiLoading(true);
    setShowAiCoach(true);

    const res = await requestAiCoach({
      problemTitle: problem.title,
      problemDescription: problem.description,
      difficulty: problem.difficulty,
      language,
      userCode: code,
      hintLevel: level,
      promptType: 'struggle_hint'
    });

    setAiFeedback(res.feedback);
    setAiLoading(false);
  };

  const handleRequestComplexityCoach = async () => {
    setAiLoading(true);
    setShowAiCoach(true);

    const res = await requestAiCoach({
      problemTitle: problem.title,
      problemDescription: problem.description,
      difficulty: problem.difficulty,
      language,
      userCode: code,
      promptType: 'complexity_coach'
    });

    setAiFeedback(res.feedback);
    setAiLoading(false);
  };

  const handleRequestApproachReview = async () => {
    setAiLoading(true);
    setShowAiCoach(true);

    const res = await requestAiCoach({
      problemTitle: problem.title,
      problemDescription: problem.description,
      difficulty: problem.difficulty,
      language,
      userCode: code,
      promptType: 'approach_review',
      notes: approachReviewNotes
    });

    setAiFeedback(res.feedback);
    setAiLoading(false);
  };

  // Save 6-step loop notes
  const handleSaveLoopNotes = () => {
    updateProblemState(problem.id, {
      timeComplexity: timeComplexityInput,
      spaceComplexity: spaceComplexityInput,
      pattern: patternInput,
      triggerLine: triggerLineInput,
      notes: notesInput
    });
    alert('6-Step Loop reflections saved successfully!');
  };

  // Format Timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const allVisibleCases = [...problem.sampleTestCases];

  return (
    <div className="flex flex-col h-[calc(100vh-76px)] bg-[#0B0F19] text-slate-200 overflow-hidden sm:mx-4 lg:mx-6 sm:mb-4 rounded-xl sm:rounded-2xl border border-slate-800/90 shadow-2xl">
      {/* Workspace Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#111827] border-b border-slate-800 shrink-0 text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onPreviousProblem}
            disabled={!onPreviousProblem}
            className="p-1 hover:bg-slate-800 disabled:opacity-30 rounded text-slate-400 hover:text-white"
            title="Previous Problem"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onNextProblem}
            disabled={!onNextProblem}
            className="p-1 hover:bg-slate-800 disabled:opacity-30 rounded text-slate-400 hover:text-white"
            title="Next Problem"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">
              {problem.number}. {problem.title}
            </span>
            <span
              className={`font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                problem.difficulty === 'Easy'
                  ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/50'
                  : problem.difficulty === 'Medium'
                  ? 'bg-amber-950/70 text-amber-400 border border-amber-800/50'
                  : 'bg-rose-950/70 text-rose-400 border border-rose-800/50'
              }`}
            >
              {problem.difficulty}
            </span>
            <span className="text-slate-500 font-mono text-[11px]">
              Week {problem.week} · {problem.topic}
            </span>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-3">
          {/* Active 20-min Struggle Timer */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300">
            <Clock className={`w-3.5 h-3.5 ${timerSeconds >= 1200 ? 'text-amber-400' : 'text-indigo-400'}`} />
            <span className="font-mono tabular-nums font-semibold">
              {formatTime(timerSeconds)}
            </span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-0.5 hover:text-white text-slate-400"
              title={isTimerRunning ? 'Pause Timer' : 'Resume Timer'}
            >
              {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
          </div>

          {/* AI Pedagogical Hint Trigger */}
          <button
            onClick={() => setShowAiCoach(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-lg font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Coach & Hints</span>
          </button>

          {/* Language Selector: Java, C++, C, Python 3 */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-lg px-2.5 py-1 transition-colors">
            <span
              className="w-2 h-2 rounded-full inline-block shrink-0 transition-colors"
              style={{
                backgroundColor:
                  language === 'java'
                    ? '#E3B341'
                    : language === 'cpp'
                    ? '#58A6FF'
                    : language === 'c'
                    ? '#38BDF8'
                    : '#7EE787',
              }}
              title={`Monaco syntax theme: ${getLanguageThemeLabel(language)}`}
            />
            <label htmlFor="language-selector" className="sr-only">
              Programming Language
            </label>
            <select
              id="language-selector"
              aria-label="Programming Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'python' | 'java' | 'cpp' | 'c')}
              className="bg-transparent text-slate-200 text-xs font-mono font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="java" className="bg-slate-900 text-slate-200">Java</option>
              <option value="cpp" className="bg-slate-900 text-slate-200">C++</option>
              <option value="c" className="bg-slate-900 text-slate-200">C</option>
              <option value="python" className="bg-slate-900 text-slate-200">Python 3</option>
            </select>
          </div>

          <button
            onClick={() => setLeftTab(leftTab === 'complexity' ? 'description' : 'complexity')}
            title="Algorithmic Complexity Visualizer"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
              leftTab === 'complexity'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Complexity</span>
          </button>

          <button
            onClick={() => setIsFocusMode(!isFocusMode)}
            title={isFocusMode ? 'Exit Distraction-Free Focus Mode' : 'Enter Distraction-Free Focus Mode'}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
              isFocusMode
                ? 'bg-violet-600/30 text-violet-300 border-violet-500/50 shadow-sm'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {isFocusMode ? <Minimize2 className="w-3.5 h-3.5 text-violet-300" /> : <Maximize2 className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden sm:inline">{isFocusMode ? 'Exit Focus' : 'Focus'}</span>
          </button>

          <button
            onClick={() => setResetConfirmOpen(true)}
            title="Reset code to clean starter template"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-rose-300 border-rose-900/40 hover:border-rose-700/60 transition-all shadow-sm group"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400 group-hover:-rotate-90 transition-transform duration-300" />
            <span className="hidden sm:inline">Reset Code</span>
          </button>

          <button
            onClick={handleCopyCode}
            title="Copy Code"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Split Body: Left Pane (Problem Statement & 6-Step Loop) + Right Pane (LeetCode Editor & Drawer) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Pane (Description, 6-Step Loop Checklist, Submissions) - Collapses in Focus Mode */}
        {!isFocusMode && (
          <div className="w-full md:w-[45%] lg:w-[42%] flex flex-col border-r border-slate-800 bg-[#0F1420] overflow-hidden">
          {/* Left Tabs */}
          <div className="flex items-center border-b border-slate-800 bg-slate-900/80 px-3 shrink-0 text-xs">
            <button
              onClick={() => setLeftTab('description')}
              className={`py-2.5 px-3 font-semibold border-b-2 transition-colors ${
                leftTab === 'description'
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setLeftTab('loop')}
              className={`py-2.5 px-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                leftTab === 'loop'
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>6-Step Loop</span>
              {state.triggerLine && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>
            <button
              onClick={() => setLeftTab('submissions')}
              className={`py-2.5 px-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                leftTab === 'submissions'
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Submissions</span>
              <span className="text-[10px] text-slate-500 font-mono">({submissionsList.length})</span>
            </button>
            <button
              onClick={() => setLeftTab('complexity')}
              className={`py-2.5 px-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                leftTab === 'complexity'
                  ? 'border-cyan-500 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Complexity</span>
            </button>
          </div>

          {/* Left Content Area */}
          <div className="flex-1 overflow-y-auto p-5 text-xs space-y-5 leading-relaxed">
            {leftTab === 'description' && (
              <>
                <div className="space-y-3">
                  <h2 className="text-base font-bold text-white">
                    {problem.number}. {problem.title}
                  </h2>
                  <p className="text-slate-300 whitespace-pre-line text-sm leading-relaxed">
                    {problem.description}
                  </p>
                </div>

                {/* Canonical Examples */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
                    Examples
                  </h3>
                  {problem.sampleTestCases.map((tc, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px]"
                    >
                      <div className="text-indigo-300 font-semibold">Example {idx + 1}:</div>
                      <div>
                        <span className="text-slate-500">Input: </span>
                        <span className="text-slate-200">{tc.input}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Output: </span>
                        <span className="text-emerald-400">{JSON.stringify(tc.expected)}</span>
                      </div>
                      {tc.description && (
                        <div className="text-slate-400 text-[10px] font-sans pt-0.5">
                          {tc.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                {problem.constraints && problem.constraints.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h3 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
                      Constraints
                    </h3>
                    <ul className="list-disc list-inside space-y-1 font-mono text-slate-400 text-[11px]">
                      {problem.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Authoritative Links & NeetCode Solution */}
                <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
                  <a
                    href={problem.leetcodeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
                  >
                    <span>LeetCode #{problem.number}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>

                  {problem.freeVersionUrl && (
                    <a
                      href={problem.freeVersionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950/60 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/50 rounded-lg text-xs font-medium transition-colors"
                    >
                      <span>Free Version Mirror</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {problem.solutionVideoUrl && (
                    <a
                      href={problem.solutionVideoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/50 rounded-lg text-xs font-medium transition-colors"
                      title="Only watch after 20 minutes of struggle"
                    >
                      <Video className="w-3 h-3" />
                      <span>NeetCode Video</span>
                    </a>
                  )}
                </div>
              </>
            )}

            {leftTab === 'loop' && (
              <div className="space-y-4">
                <div className="p-3 bg-indigo-950/40 border border-indigo-800/50 rounded-lg text-xs space-y-1">
                  <div className="font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    Nihar's 6-Step Loop Checkpoints
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    "Writing Time & Space, Pattern, and Trigger line is where the actual learning happens."
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Time Complexity *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. O(n) time"
                        value={timeComplexityInput}
                        onChange={(e) => setTimeComplexityInput(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Space Complexity *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. O(1) space"
                        value={spaceComplexityInput}
                        onChange={(e) => setSpaceComplexityInput(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Algorithmic Pattern *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hash Map lookup, Two Pointers, Monotonic Stack"
                      value={patternInput}
                      onChange={(e) => setPatternInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Trigger Line (When you see X, think Y) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. When looking for pairs summing to target, use hash map complement"
                      value={triggerLineInput}
                      onChange={(e) => setTriggerLineInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Second Approach & Trade-Off Notes (Discuss / Solutions)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Compare brute force vs optimal, or sort vs hash map..."
                      value={notesInput}
                      onChange={(e) => setNotesInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={handleSaveLoopNotes}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow transition-colors"
                    >
                      Save Checkpoints to Tracker
                    </button>
                    <button
                      onClick={handleRequestComplexityCoach}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>AI Complexity Coach</span>
                    </button>
                  </div>
                </div>

                {/* Day 3 / 7 / 30 Spacing Status Card */}
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2 text-xs">
                  <div className="font-semibold text-slate-300">Spaced Retention Calendar</div>
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                    <div className="p-2 bg-slate-950 rounded border border-slate-800">
                      <div className="text-slate-500">Day 3 Due</div>
                      <div className="text-white">{state.day3Due || 'Not set'}</div>
                      <div className="text-indigo-400">{state.day3Status || 'Pending'}</div>
                    </div>
                    <div className="p-2 bg-slate-950 rounded border border-slate-800">
                      <div className="text-slate-500">Day 7 Due</div>
                      <div className="text-white">{state.day7Due || 'Not set'}</div>
                      <div className="text-indigo-400">{state.day7Status || 'Pending'}</div>
                    </div>
                    <div className="p-2 bg-slate-950 rounded border border-slate-800">
                      <div className="text-slate-500">Day 30 (Blank)</div>
                      <div className="text-white">{state.day30Due || 'Not set'}</div>
                      <div className="text-emerald-400">{state.day30Status || 'Pending'}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {leftTab === 'submissions' && (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Submission History ({submissionsList.length})
                </div>

                {submissionsList.length === 0 ? (
                  <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-lg text-center text-slate-500 text-xs">
                    No submissions recorded yet for this problem. Click "Submit" to judge your solution against all hidden tests.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {submissionsList.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1.5 text-xs font-mono"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-bold flex items-center gap-1.5 ${
                              sub.verdict === 'Accepted'
                                ? 'text-emerald-400'
                                : sub.verdict === 'Wrong Answer'
                                ? 'text-rose-400'
                                : 'text-amber-400'
                            }`}
                          >
                            {sub.verdict === 'Accepted' ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5" />
                            )}
                            {sub.verdict}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {new Date(sub.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          <span>Passed: {sub.passedCases} / {sub.totalCases}</span>
                          <span aria-hidden="true">·</span>
                          <span>{sub.runtimeMs} ms</span>
                          <span aria-hidden="true">·</span>
                          <span className="uppercase">{sub.language}</span>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
                          <button
                            onClick={() => setCode(sub.code)}
                            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-sans"
                          >
                            Load code into editor →
                          </button>

                          {user && (
                            <button
                              onClick={async () => {
                                try {
                                  setSnippetUploadMsg(prev => ({ ...prev, [sub.id]: 'Uploading...' }));
                                  await uploadSolutionSnippetToStorage(user.uid, problem.id, sub.language, sub.code);
                                  setSnippetUploadMsg(prev => ({ ...prev, [sub.id]: 'Saved to Storage!' }));
                                  setTimeout(() => {
                                    setSnippetUploadMsg(prev => {
                                      const next = { ...prev };
                                      delete next[sub.id];
                                      return next;
                                    });
                                  }, 3000);
                                } catch (e) {
                                  setSnippetUploadMsg(prev => ({ ...prev, [sub.id]: 'Upload failed' }));
                                }
                              }}
                              className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono transition-colors"
                              title="Upload and archive this code snippet in Firebase Cloud Storage"
                            >
                              <CloudUpload className="w-3 h-3" />
                              <span>{snippetUploadMsg[sub.id] || 'Save to Storage'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {leftTab === 'complexity' && (
              <div className="space-y-4">
                <ComplexityVisualizer
                  currentTheoretical={{
                    time: state.timeComplexity || 'O(n)',
                    space: state.spaceComplexity || 'O(1)'
                  }}
                />
              </div>
            )}
          </div>
        </div>
        )}

        {/* Right Pane (LeetCode Code Editor & Console Drawer) */}
        <div className={`flex flex-col bg-[#0B0F19] overflow-hidden transition-all duration-300 ${
          isFocusMode ? 'w-full' : 'w-full md:w-[55%] lg:w-[58%]'
        }`}>
          {/* Monaco Editor Surface with language-specific theme highlighting */}
          <div className="flex-1 relative flex flex-col bg-[#0D1117] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-1.5 bg-[#161B22] border-b border-slate-800 text-[11px] text-slate-400 shrink-0">
              <div className="flex items-center gap-2 font-mono">
                <span className="text-white font-medium">
                  Solution.{language === 'python' ? 'py' : language === 'java' ? 'java' : language === 'cpp' ? 'cpp' : 'c'}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400 font-semibold">{language === 'cpp' ? 'C++' : language === 'c' ? 'C' : language === 'java' ? 'Java' : 'Python 3'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  <span
                    className="w-1.5 h-1.5 rounded-full inline-block"
                    style={{
                      backgroundColor:
                        language === 'java'
                          ? '#E3B341'
                          : language === 'cpp'
                          ? '#58A6FF'
                          : language === 'c'
                          ? '#38BDF8'
                          : '#7EE787',
                    }}
                  />
                  <span>Theme: {getLanguageThemeLabel(language)}</span>
                </span>
                <span className="text-slate-600 text-[10px]">|</span>
                <span className="text-slate-400 font-mono text-[10px]">
                  Mode: <span className="text-indigo-400 font-semibold">{getMonacoLanguageMode(language)}</span>
                </span>
                <span className="text-slate-600 text-[10px]">|</span>
                <span className="text-slate-300 font-mono text-[10px] flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
                </span>
                <span className="text-slate-600 text-[10px]">|</span>
                <div className="flex items-center rounded-md border border-slate-800 bg-slate-950/80 p-0.5 text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => setEditorEngine('monaco')}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      editorEngine === 'monaco' ? 'bg-indigo-600/40 text-indigo-200 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Monaco
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorEngine('canvas')}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      editorEngine === 'canvas' ? 'bg-indigo-600/40 text-indigo-200 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Canvas
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 relative overflow-hidden">
              {editorEngine === 'canvas' ? (
                <CodeEditor
                  code={code}
                  onChange={(val) => {
                    setCode(val);
                    saveCodeDraft(problem.id, language, val);
                  }}
                  language={language}
                  onCursorChange={(pos) => {
                    setCursorPos({ line: pos.line, col: pos.column });
                  }}
                />
              ) : (
                <Editor
                  height="100%"
                  language={getMonacoLanguageMode(language)}
                  path={`solution-${problem.id}-${language}.${language === 'python' ? 'py' : language === 'java' ? 'java' : language === 'cpp' ? 'cpp' : 'c'}`}
                  value={code}
                  theme={getLanguageTheme(language)}
                  beforeMount={handleEditorBeforeMount}
                  onMount={handleEditorOnMount}
                  onChange={(val) => {
                    const nextVal = val || '';
                    setCode(nextVal);
                    saveCodeDraft(problem.id, language, nextVal);
                  }}
                  options={{
                    fontSize: 13,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    lineHeight: 24,
                    tabSize: 4,
                    insertSpaces: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    lineNumbers: 'on',
                    lineNumbersMinChars: 3,
                    folding: true,
                    foldingHighlight: true,
                    showFoldingControls: 'always',
                    renderLineHighlight: 'all',
                    padding: { top: 12, bottom: 12 },
                    bracketPairColorization: { enabled: true },
                    suggestOnTriggerCharacters: true,
                    quickSuggestions: true,
                    formatOnPaste: true,
                    cursorBlinking: 'smooth',
                    smoothScrolling: true,
                  }}
                  loading={
                    <div className="flex items-center justify-center h-full text-slate-500 font-mono text-xs">
                      Initializing Monaco Editor with {getLanguageThemeLabel(language)}...
                    </div>
                  }
                />
              )}
            </div>
          </div>

          {/* Bottom Console Drawer (LeetCode style with Testcase & Test Result tabs) */}
          <div className={`border-t border-slate-800 bg-[#111827] flex flex-col transition-all ${consoleOpen ? 'h-52' : 'h-10'}`}>
            {/* Drawer Header Controls */}
            <div className="flex items-center justify-between px-4 py-1.5 bg-[#161E2E] border-b border-slate-800 shrink-0 text-xs">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setConsoleOpen(true);
                    setActiveConsoleTab('testcase');
                  }}
                  className={`px-3 py-1 font-semibold rounded-md transition-colors ${
                    activeConsoleTab === 'testcase' && consoleOpen
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Testcase
                </button>
                <button
                  onClick={() => {
                    setConsoleOpen(true);
                    setActiveConsoleTab('testresult');
                  }}
                  className={`px-3 py-1 font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                    activeConsoleTab === 'testresult' && consoleOpen
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>Test Result</span>
                  {executionResult && (
                    <span className={`w-2 h-2 rounded-full ${executionResult.verdict === 'Accepted' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                  )}
                </button>
              </div>

              {/* Action Buttons: Run Code (Ctrl+') & Submit (Ctrl+Enter) */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConsoleOpen(!consoleOpen)}
                  className="p-1 text-slate-400 hover:text-slate-200"
                  title={consoleOpen ? 'Collapse Console' : 'Expand Console'}
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${consoleOpen ? '' : 'rotate-180'}`} />
                </button>

                <button
                  onClick={handleRunCode}
                  disabled={isRunning || isSubmitting}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isRunning
                      ? 'bg-indigo-600 text-white animate-pulse shadow-md shadow-indigo-950'
                      : 'bg-[#151D2C] hover:bg-[#1E293B] text-slate-200 border border-slate-700/80 hover:border-slate-600 active:scale-95'
                  }`}
                  title="Run Sample Tests (Ctrl + ')"
                >
                  <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin text-white' : 'text-cyan-400'}`} />
                  <span>{isRunning ? 'Running Cases...' : 'Run'}</span>
                  <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">(Ctrl+&apos;)</span>
                </button>

                <button
                  onClick={handleSubmitCode}
                  disabled={isRunning || isSubmitting}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95 ${
                    isSubmitting
                      ? 'bg-emerald-700 text-white animate-pulse shadow-emerald-950'
                      : 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-emerald-950/60 border border-emerald-400/30'
                  }`}
                  title="Submit & Judge with Hidden Tests (Ctrl + Enter)"
                >
                  <Send className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-bounce text-emerald-200' : 'text-white'}`} />
                  <span>{isSubmitting ? 'Judging All...' : 'Submit'}</span>
                  <span className="text-[10px] text-emerald-200 font-mono hidden sm:inline">(Ctrl+↵)</span>
                </button>
              </div>
            </div>

            {/* Console Drawer Content */}
            {consoleOpen && (
              <div className="flex-1 overflow-y-auto p-4 text-xs font-mono">
                {activeConsoleTab === 'testcase' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {allVisibleCases.map((tc, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveCaseIndex(idx)}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                            activeCaseIndex === idx
                              ? 'bg-slate-700 text-white'
                              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                          }`}
                        >
                          Case {idx + 1}
                        </button>
                      ))}

                      {customCases.map((_, idx) => (
                        <button
                          key={`custom-${idx}`}
                          onClick={() => setActiveCaseIndex(allVisibleCases.length + idx)}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                            activeCaseIndex === allVisibleCases.length + idx
                              ? 'bg-indigo-700 text-white'
                              : 'bg-indigo-950/40 text-indigo-300 hover:text-white border border-indigo-800/50'
                          }`}
                        >
                          Custom {idx + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => setShowAddCustomModal(true)}
                        className="px-2.5 py-1 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md text-xs flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Case</span>
                      </button>
                    </div>

                    {/* Active Selected Case Input View */}
                    <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg">
                      <div className="text-[11px] text-slate-500 mb-1">Input parameter(s):</div>
                      <div className="text-slate-200 font-mono whitespace-pre-wrap">
                        {activeCaseIndex < allVisibleCases.length
                          ? allVisibleCases[activeCaseIndex]?.input
                          : customCases[activeCaseIndex - allVisibleCases.length]}
                      </div>
                    </div>
                  </div>
                )}

                {activeConsoleTab === 'testresult' && (
                  <div className="space-y-3">
                    {(isRunning || isSubmitting) ? (
                      <div className="py-6 flex flex-col items-center justify-center space-y-3 font-sans">
                        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        <div className="text-sm font-semibold text-white">
                          {isSubmitting ? 'Evaluating Submission with Hidden Tests...' : 'Running Code in Secure Sandbox...'}
                        </div>
                        <div className="text-xs text-indigo-400 font-mono flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-indigo-500/30">
                          <Terminal className="w-3.5 h-3.5" />
                          <span>{executionStageMessage || 'Orchestrating backend execution pipeline...'}</span>
                        </div>
                      </div>
                    ) : !executionResult ? (
                      <div className="text-slate-500 py-6 text-center font-sans">
                        Click "Run" to test with samples, or "Submit" to evaluate all hidden test cases.
                      </div>
                    ) : (
                      <>
                        {/* Status Header */}
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-base font-bold flex items-center gap-2 ${
                                executionResult.verdict === 'Accepted'
                                  ? 'text-emerald-400'
                                  : executionResult.verdict === 'Wrong Answer'
                                  ? 'text-rose-400'
                                  : 'text-amber-400'
                              }`}
                            >
                              {executionResult.verdict === 'Accepted' ? (
                                <CheckCircle2 className="w-5 h-5" />
                              ) : (
                                <XCircle className="w-5 h-5" />
                              )}
                              {executionResult.verdict}
                            </span>
                            <span className="text-slate-400 text-xs">
                              {executionResult.passedCases} / {executionResult.totalCases} test cases passed
                            </span>
                            {evaluationType === 'submit' && (
                              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-indigo-300 font-sans">
                                Hidden Tests Evaluated
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-slate-400 text-xs font-mono">
                            <span>Runtime: {executionResult.runtimeMs} ms</span>
                            <span>Memory: {executionResult.memoryMb} MB</span>
                          </div>
                        </div>

                        {/* Error Message if Compilation / Runtime Error */}
                        {executionResult.errorMessage && (
                          <div className="space-y-3">
                            <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg text-rose-300 text-xs leading-relaxed whitespace-pre-wrap font-mono">
                              {executionResult.errorMessage}
                            </div>

                            {/* Actionable Compiler Diagnostics & Auto-Remediation Hints */}
                            {(() => {
                              const hints = analyzeCompilerDiagnostics(executionResult.errorMessage, code, language);
                              if (hints.length === 0) return null;
                              return (
                                <div className="p-3.5 bg-amber-950/30 border border-amber-500/40 rounded-xl space-y-2.5">
                                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                                    <Sparkles className="w-4 h-4 text-amber-400" />
                                    <span>Actionable Compiler Diagnostics & Typo Detection:</span>
                                  </div>
                                  <div className="space-y-2">
                                    {hints.map((hint, hIdx) => (
                                      <div key={hIdx} className="bg-slate-900/90 border border-amber-500/30 rounded-lg p-2.5 text-xs space-y-1">
                                        <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                          <span>{hint.title}</span>
                                        </div>
                                        <p className="text-slate-300 leading-normal">{hint.suggestion}</p>
                                        {hint.codeSnippet && (
                                          <div className="mt-1 px-2.5 py-1 bg-black/60 rounded border border-slate-800 text-emerald-300 font-mono text-[11px]">
                                            {hint.codeSnippet}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        {/* Case Evaluation Tabs */}
                        {executionResult.caseResults.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 overflow-x-auto pb-1">
                              {executionResult.caseResults.map((cr, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setActiveCaseIndex(idx)}
                                  className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 ${
                                    activeCaseIndex === idx
                                      ? 'bg-slate-700 text-white font-bold'
                                      : 'bg-slate-900 border border-slate-800 text-slate-400'
                                  }`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${cr.passed ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                                  <span>{cr.isHidden ? `Hidden ${cr.index}` : `Case ${cr.index}`}</span>
                                </button>
                              ))}
                            </div>

                            {executionResult.caseResults[activeCaseIndex] && (
                              <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg space-y-1.5 text-xs">
                                <div>
                                  <span className="text-slate-500">Input: </span>
                                  <span className="text-slate-200">{executionResult.caseResults[activeCaseIndex].input}</span>
                                </div>
                                <div>
                                  <span className="text-slate-500">Output: </span>
                                  <span className={executionResult.caseResults[activeCaseIndex].passed ? 'text-emerald-400' : 'text-rose-400'}>
                                    {executionResult.caseResults[activeCaseIndex].actual}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-slate-500">Expected: </span>
                                  <span className="text-emerald-400">{executionResult.caseResults[activeCaseIndex].expected}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Stdout Logs */}
                        {executionResult.stdout.length > 0 && (
                          <div className="p-2.5 bg-black/60 rounded border border-slate-800 text-[11px] text-slate-400 font-mono space-y-0.5">
                            <div className="text-slate-500 font-semibold text-[10px]">Stdout Logs:</div>
                            {executionResult.stdout.map((log, i) => (
                              <div key={i}>{log}</div>
                            ))}
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

      {/* 20-Minute Sustained Struggle Modal Trigger */}
      {showStruggleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#0E131F] border border-amber-500/40 rounded-2xl p-6 max-w-lg w-full shadow-2xl shadow-amber-950/40 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/15 text-amber-400 rounded-xl border border-amber-500/30">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">20-Minute Cognitive Checkpoint</h3>
                <p className="text-xs text-amber-400/90 font-mono">Pedagogical Struggle Threshold (Step 2)</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-[#121828] p-3.5 rounded-xl border border-slate-800">
              You&apos;ve actively grappled with this problem for 20 minutes. Straining strengthens your neural problem-solving pathways, but prolonged spinning causes frustration. Choose how you&apos;d like to proceed:
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setShowStruggleModal(false);
                  setStruggleModalDismissed(true);
                }}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors text-left flex items-center justify-between"
              >
                <span>1. Continue Independently (Keep straining)</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setShowStruggleModal(false);
                  setStruggleModalDismissed(true);
                  handleRequestHint(1);
                }}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors text-left flex items-center justify-between"
              >
                <span>2. Give me a small hint (Level 1 Conceptual Nudge)</span>
                <Sparkles className="w-4 h-4 text-indigo-200" />
              </button>

              <button
                onClick={() => {
                  setShowStruggleModal(false);
                  setStruggleModalDismissed(true);
                  setShowAiCoach(true);
                }}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors text-left flex items-center justify-between"
              >
                <span>3. Review my current approach & invariants</span>
                <HelpCircle className="w-4 h-4 text-indigo-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Pedagogical Hint & Coach Drawer / Modal */}
      {showAiCoach && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[490px] bg-[#0C101A] border-l border-indigo-500/30 shadow-2xl shadow-indigo-950/70 flex flex-col animate-in slide-in-from-right duration-250">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#111726]/90 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Neural AI Learning Coach</h3>
                <p className="text-[10px] text-indigo-300/80 font-mono">Pedagogical Socratic Mentor</p>
              </div>
            </div>
            <button
              onClick={() => setShowAiCoach(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close AI Coach drawer"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
            <div className="space-y-1">
              <div className="font-semibold text-slate-200">Progressive Hint Tiers</div>
              <p className="text-[11px] text-slate-400">
                Socratic hints that progressively nudge your invariant thinking without spoiling the answer.
              </p>
            </div>

            {/* 5 Levels Buttons */}
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { lvl: 1, label: 'L1: Nudge' },
                { lvl: 2, label: 'L2: Pattern' },
                { lvl: 3, label: 'L3: Steps' },
                { lvl: 4, label: 'L4: Bounds' },
                { lvl: 5, label: 'L5: Solution' }
              ].map((tier) => (
                <button
                  key={tier.lvl}
                  onClick={() => handleRequestHint(tier.lvl)}
                  disabled={aiLoading}
                  className={`py-2 px-1 text-[11px] rounded-lg font-mono font-medium transition-colors text-center ${
                    currentHintLevel === tier.lvl
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>

            {/* AI Response Display */}
            {aiLoading ? (
              <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 text-center space-y-2">
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-slate-400 text-xs">Generating pedagogical hint...</p>
              </div>
            ) : aiFeedback ? (
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-indigo-400 font-semibold uppercase">
                  <span>Level {currentHintLevel} Guidance</span>
                  <span className="text-slate-500 font-mono">Pedagogical Mode</span>
                </div>
                <div className="text-slate-200 text-xs leading-relaxed whitespace-pre-line">
                  {aiFeedback}
                </div>
              </div>
            ) : null}

            {/* Approach Review Input */}
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 space-y-2.5">
              <span className="font-semibold text-slate-300">Approach Review</span>
              <p className="text-[11px] text-slate-400">
                Stuck on a mental model? Describe what you're trying to do, and the AI coach will critique your reasoning.
              </p>
              <textarea
                rows={3}
                placeholder="I am trying to use two pointers starting from left and right..."
                value={approachReviewNotes}
                onChange={(e) => setApproachReviewNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleRequestApproachReview}
                disabled={aiLoading}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
              >
                Critique My Approach
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Testcase Modal */}
      {showAddCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-xl p-5 max-w-md w-full shadow-2xl space-y-3">
            <h3 className="text-sm font-bold text-white">Add Custom Testcase</h3>
            <p className="text-xs text-slate-400">
              Provide input parameters formatted as valid JSON or arguments (e.g. <code className="text-indigo-300">[1, 2, 3]</code>):
            </p>
            <textarea
              rows={3}
              value={newCustomInput}
              onChange={(e) => setNewCustomInput(e.target.value)}
              placeholder="[1, 2, 3, 4, 5]"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddCustomModal(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomCase}
                className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
              >
                Add Case
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Code Confirmation Modal */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-[#0E131F] border border-rose-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 font-sans">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-500/15 text-rose-400 rounded-xl border border-rose-500/30">
                <RotateCcw className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Reset Solution Code</h3>
                <p className="text-xs text-rose-400/90 font-mono">Restore Clean Canonical Template</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-[#121828] p-3 rounded-xl border border-slate-800">
              This will clear your current local draft and restore the clean, strongly-typed starter code signature for <strong className="text-white">{language.toUpperCase()}</strong>. Any unsaved edits will be discarded.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetCode}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl shadow-lg transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Confirm Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Toast Notification */}
      {resetSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-emerald-950/90 border border-emerald-600/60 rounded-xl text-emerald-200 text-xs shadow-2xl font-sans animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Code reset successfully to clean strongly-typed starter template!</span>
        </div>
      )}
    </div>
  );
};
