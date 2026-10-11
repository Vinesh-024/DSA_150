import React, { useState, useEffect } from 'react';
import { Search, Code2, ArrowRight, BookOpen, Layers, Zap, X } from 'lucide-react';
import { Problem } from '../types/curriculum';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  problems: Problem[];
  onSelectProblem: (id: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  problems,
  onSelectProblem,
  onNavigateTab,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Navigation commands
  const navCommands = [
    { id: 'nav-dashboard', label: 'Go to Command Dashboard', tab: 'dashboard', icon: Layers },
    { id: 'nav-roadmap', label: 'Go to 12-Week Roadmap', tab: 'roadmap', icon: BookOpen },
    { id: 'nav-tracker', label: 'Go to Re-Solve Spreadsheet Tracker', tab: 'tracker', icon: Layers },
    { id: 'nav-analytics', label: 'Go to Analytics & Retention', tab: 'analytics', icon: Zap },
    { id: 'nav-video', label: 'Go to Video Insights & 6-Step Loop', tab: 'video-insights', icon: BookOpen },
    { id: 'nav-workspace', label: 'Go to Active Workspace', tab: 'workspace', icon: Code2 },
  ].filter((c) => !q || c.label.toLowerCase().includes(q));

  // Matched problems
  const matchedProblems = problems
    .filter((p) => {
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        String(p.number).includes(q) ||
        p.topic.toLowerCase().includes(q) ||
        p.difficulty.toLowerCase().includes(q)
      );
    })
    .slice(0, 8);

  const totalItems = navCommands.length + matchedProblems.length;

  const handleSelectCurrent = (idx: number) => {
    if (idx < navCommands.length) {
      onNavigateTab(navCommands[idx].tab);
      onClose();
    } else {
      const probIdx = idx - navCommands.length;
      if (matchedProblems[probIdx]) {
        onSelectProblem(matchedProblems[probIdx].id);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#0D111A] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-[#111724]">
          <Search className="w-4 h-4 text-indigo-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % Math.max(1, totalItems));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + totalItems) % Math.max(1, totalItems));
              } else if (e.key === 'Enter') {
                e.preventDefault();
                handleSelectCurrent(selectedIndex);
              }
            }}
            placeholder="Search problems, topics (Two Sum, Binary Search, DP...), or switch tabs..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 p-1 rounded-md"
            aria-label="Close command palette"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-800/40 text-xs">
          {navCommands.length > 0 && (
            <div className="py-1">
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Navigation
              </div>
              {navCommands.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigateTab(item.tab);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedIndex === idx ? 'bg-indigo-600/30 text-white' : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4 text-indigo-400" />
                    <span>{item.label}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              ))}
            </div>
          )}

          {matchedProblems.length > 0 && (
            <div className="py-1">
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Problems ({matchedProblems.length})
              </div>
              {matchedProblems.map((p, idx) => {
                const globalIdx = navCommands.length + idx;
                const isSelected = selectedIndex === globalIdx;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectProblem(p.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                      isSelected ? 'bg-indigo-600/30 text-white' : 'text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono text-slate-500 text-[11px] w-8 shrink-0">#{p.number}</span>
                      <span className="font-medium truncate">{p.title}</span>
                      <span
                        className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-mono font-bold ${
                          p.difficulty === 'Easy'
                            ? 'bg-emerald-950/80 text-emerald-400'
                            : p.difficulty === 'Medium'
                            ? 'bg-amber-950/80 text-amber-400'
                            : 'bg-rose-950/80 text-rose-400'
                        }`}
                      >
                        {p.difficulty}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono ml-2 shrink-0">
                      W{p.week} · {p.topic}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {totalItems === 0 && (
            <div className="py-8 text-center text-slate-500 text-xs">
              No matching problems or actions found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-slate-800 bg-[#090D14] flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">↑↓</kbd> navigate</span>
            <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">↵</kbd> select</span>
            <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">esc</kbd> close</span>
          </div>
          <span className="text-slate-600 font-mono text-[10px]">Neural Flow Palette</span>
        </div>
      </div>
    </div>
  );
};
