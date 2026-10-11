import React, { useRef, useEffect, useState } from 'react';
import Prism from 'prismjs';
// Import language definitions
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  language: 'python' | 'java' | 'cpp' | 'c';
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  language,
  onKeyDown,
  placeholder = 'Write your solution here...',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const [lineCount, setLineCount] = useState<number>(1);

  // Sync line numbers count
  useEffect(() => {
    const lines = (code || '').split('\n').length;
    setLineCount(Math.max(1, lines));
  }, [code]);

  // Synchronize scroll between transparent textarea and syntax pre
  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

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

  const highlightedHtml = React.useMemo(() => {
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
      }, 0);
      return;
    }

    // Auto-closing brackets & quotes
    const pairs: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'"
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
      }, 0);
      return;
    }

    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <div className="relative flex-1 flex h-full bg-[#0D1117] overflow-hidden font-mono text-xs sm:text-sm">
      {/* Line Numbers Sidebar */}
      <div
        className="w-12 select-none py-4 px-2 text-right bg-[#090D14] border-r border-slate-800 text-slate-600 font-mono text-xs shrink-0 overflow-hidden"
        aria-hidden="true"
      >
        {Array.from({ length: lineCount }, (_, i) => i + 1).map((lineNum) => (
          <div key={lineNum} className="h-6 leading-6 tabular-nums">
            {lineNum}
          </div>
        ))}
      </div>

      {/* Editor Surface */}
      <div className="relative flex-1 h-full overflow-hidden">
        {/* Background Syntax Highlighted Pre */}
        <pre
          ref={preRef}
          aria-hidden="true"
          className="absolute inset-0 p-4 m-0 overflow-hidden pointer-events-none font-mono text-xs sm:text-sm leading-6 whitespace-pre tab-4 text-slate-200"
          dangerouslySetInnerHTML={{ __html: highlightedHtml + '<br/>' }}
        />

        {/* Foreground Transparent Textarea for Keystrokes */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleEditorKeyDown}
          onScroll={handleScroll}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          placeholder={placeholder}
          className="absolute inset-0 w-full h-full p-4 m-0 bg-transparent text-transparent caret-white selection:bg-indigo-600/40 font-mono text-xs sm:text-sm leading-6 whitespace-pre tab-4 resize-none outline-none focus:ring-0 focus:outline-none border-none z-10 overflow-auto"
        />
      </div>
    </div>
  );
};
