import React, { useRef, useMemo, useState, useLayoutEffect } from 'react';
import Prism from 'prismjs';
// Import language definitions
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';

export interface CursorPosition {
  line: number;
  column: number;
  offset: number;
}

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  language: 'python' | 'java' | 'cpp' | 'c';
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onCursorChange?: (cursor: CursorPosition) => void;
  placeholder?: string;
  showCursorStatus?: boolean;
}

// Strict 1:1 CSS configuration shared identically between transparent textarea and highlighted pre
const SHARED_EDITOR_STYLE: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  fontSize: '13px',
  lineHeight: '24px', // strict 24px (leading-6 / h-6)
  letterSpacing: '0px',
  tabSize: 4,
  MozTabSize: 4,
  padding: '16px', // strict 16px (p-4)
  margin: 0,
  border: 'none',
  outline: 'none',
  whiteSpace: 'pre',
  wordBreak: 'normal',
  overflowWrap: 'normal',
  boxSizing: 'border-box',
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  language,
  onKeyDown,
  onCursorChange,
  placeholder = 'Write your solution here...',
  showCursorStatus = true,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  // Derive lines strictly and synchronously from code string
  const lines = useMemo(() => (code || '').split('\n'), [code]);

  const [cursorPos, setCursorPos] = useState<CursorPosition>({
    line: 1,
    column: 1,
    offset: 0,
  });

  // Calculate cursor/type pointer position synchronously post-movement
  const updateCursorPosition = (target: HTMLTextAreaElement) => {
    const selectionStart = target.selectionStart ?? 0;
    // Slicing for caret position coordinates uses text.slice(0, selectionStart) without negative off-by-one offsets
    const textBefore = (target.value || '').slice(0, selectionStart);
    const lineList = textBefore.split('\n');
    const line = lineList.length;
    const column = lineList[lineList.length - 1].length + 1;

    const newPos = { line, column, offset: selectionStart };
    setCursorPos(newPos);
    onCursorChange?.(newPos);
  };

  // Synchronize scroll between transparent textarea, syntax pre, and line numbers gutter
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    if (preRef.current) {
      preRef.current.scrollTop = target.scrollTop;
      preRef.current.scrollLeft = target.scrollLeft;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = target.scrollTop;
    }
  };

  // Synchronize gutter scroll position on layout updates
  useLayoutEffect(() => {
    if (textareaRef.current) {
      if (preRef.current) {
        preRef.current.scrollTop = textareaRef.current.scrollTop;
        preRef.current.scrollLeft = textareaRef.current.scrollLeft;
      }
      if (gutterRef.current) {
        gutterRef.current.scrollTop = textareaRef.current.scrollTop;
      }
    }
  }, [code]);

  const getPrismLanguage = (lang: string) => {
    switch (lang) {
      case 'python':
        return Prism.languages.python || Prism.languages.javascript;
      case 'java':
        return Prism.languages.java || Prism.languages.clike;
      case 'cpp':
        return Prism.languages.cpp || Prism.languages.clike;
      case 'c':
        return Prism.languages.c || Prism.languages.clike;
      default:
        return Prism.languages.clike;
    }
  };

  const getPrismLangName = (lang: string) => {
    switch (lang) {
      case 'python':
        return 'python';
      case 'java':
        return 'java';
      case 'cpp':
        return 'cpp';
      case 'c':
        return 'c';
      default:
        return 'clike';
    }
  };

  const highlightedHtml = useMemo(() => {
    const prismLang = getPrismLanguage(language);
    const langName = getPrismLangName(language);
    if (!code) return '';
    try {
      return Prism.highlight(code, prismLang, langName);
    } catch {
      return code;
    }
  }, [code, language]);

  // Tab key and auto-closing brackets / quotes
  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const start = target.selectionStart;
    const end = target.selectionEnd;

    if (e.key === 'Tab') {
      e.preventDefault();
      const nextCode = code.substring(0, start) + '    ' + code.substring(end);
      onChange(nextCode);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
        updateCursorPosition(target);
      }, 0);
      return;
    }

    // Auto-closing brackets & quotes
    const pairs: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'",
    };

    if (pairs[e.key]) {
      e.preventDefault();
      const open = e.key;
      const close = pairs[e.key];
      const selectedText = code.substring(start, end);
      const nextCode = code.substring(0, start) + open + selectedText + close + code.substring(end);
      onChange(nextCode);
      setTimeout(() => {
        target.selectionStart = start + 1;
        target.selectionEnd = end + 1;
        updateCursorPosition(target);
      }, 0);
      return;
    }

    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <div className="relative flex-1 flex h-full bg-[#0D1117] overflow-hidden font-mono text-[13px]">
      {/* Gutter: Line Numbers and Code Folding Markers in Strict Monotonic Numerical Order */}
      <div
        ref={gutterRef}
        className="w-14 select-none py-4 px-2 text-right bg-[#090D14] border-r border-slate-800 text-slate-500 font-mono text-xs shrink-0 overflow-hidden"
        aria-hidden="true"
      >
        {lines.map((lineContent, idx) => {
          const lineNum = idx + 1;
          const trimmed = lineContent.trim();
          const isFoldable = /[{[(:]\s*$/.test(trimmed) || /^(def|class|public|private|protected)\b/.test(trimmed);

          return (
            <div
              key={`gutter-line-${lineNum}`}
              style={{ height: '24px', lineHeight: '24px' }}
              className="h-6 leading-6 flex items-center justify-end gap-1.5 tabular-nums"
            >
              <span
                className="w-2.5 text-[9px] text-slate-600 hover:text-slate-400 cursor-pointer select-none"
                title={isFoldable ? 'Fold block' : undefined}
              >
                {isFoldable ? '▾' : ''}
              </span>
              <span className={cursorPos.line === lineNum ? 'text-indigo-400 font-bold' : 'text-slate-500'}>
                {lineNum}
              </span>
            </div>
          );
        })}
      </div>

      {/* Editor Surface: Dual-Layer Overlay with Exact 1:1 Matching Metrics */}
      <div className="relative flex-1 h-full overflow-hidden">
        {/* Background Syntax-Highlighted Pre */}
        <pre
          ref={preRef}
          aria-hidden="true"
          style={{
            ...SHARED_EDITOR_STYLE,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
          className="absolute inset-0 overflow-hidden text-slate-200"
          dangerouslySetInnerHTML={{
            __html: highlightedHtml + (code.endsWith('\n') ? ' ' : ''),
          }}
        />

        {/* Foreground Transparent Textarea for Keystrokes & Selection */}
        <textarea
          ref={textareaRef}
          value={code}
          style={{
            ...SHARED_EDITOR_STYLE,
            color: 'transparent',
            caretColor: '#ffffff',
            backgroundColor: 'transparent',
            resize: 'none',
          }}
          className="absolute inset-0 w-full h-full selection:bg-indigo-600/40 z-10 overflow-auto focus:ring-0 focus:outline-none"
          onChange={(e) => {
            onChange(e.target.value);
            updateCursorPosition(e.target);
          }}
          onSelect={(e) => updateCursorPosition(e.currentTarget)}
          onKeyUp={(e) => updateCursorPosition(e.currentTarget)}
          onClick={(e) => updateCursorPosition(e.currentTarget)}
          onKeyDown={handleEditorKeyDown}
          onScroll={handleScroll}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          placeholder={placeholder}
        />

        {/* Live Cursor / Pointer Position Status Indicator */}
        {showCursorStatus && (
          <div className="absolute bottom-2 right-4 z-20 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#161B22]/90 border border-slate-800 text-[10px] font-mono text-slate-300 backdrop-blur-sm shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ln {cursorPos.line}, Col {cursorPos.column}</span>
          </div>
        )}
      </div>
    </div>
  );
};
