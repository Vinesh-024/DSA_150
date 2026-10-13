import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  ExternalLink,
  Layers,
  Sparkles,
  ArrowRight,
  Search,
  Filter,
  Check
} from 'lucide-react';
import { Problem, UserProblemState } from '../types/curriculum';
import { WEEKS_DATA } from '../data/weeksData';

interface RoadmapExplorerProps {
  problems: Problem[];
  states: Record<string, UserProblemState>;
  onSelectProblem: (problemId: string) => void;
}

export const RoadmapExplorer: React.FC<RoadmapExplorerProps> = ({
  problems,
  states,
  onSelectProblem,
}) => {
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([1]);
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleWeek = (weekNum: number) => {
    setExpandedWeeks((prev) =>
      prev.includes(weekNum) ? prev.filter((w) => w !== weekNum) : [...prev, weekNum]
    );
  };

  const expandAll = () => setExpandedWeeks([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const collapseAll = () => setExpandedWeeks([]);

  // Compute total curriculum stats
  const totalSolved = Object.values(states).filter((s) => s.day1Date !== null).length;
  const totalMastered = Object.values(states).filter((s) => s.status === 'mastered').length;

  return (
    <div className="space-y-6 w-full max-w-[1600px] mx-auto px-6 lg:px-10 pb-16 font-sans">
      
      {/* 1. Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Curriculum Architecture</span>
            <span aria-hidden="true">·</span>
            <span>12 Structured Sprints</span>
            <span aria-hidden="true">·</span>
            <span>150 Problems</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
            12-Week Curriculum Roadmap
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="px-3 py-1.5 bg-white dark:bg-[#0D1426] hover:bg-slate-50 dark:hover:bg-[#131B32] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs transition-colors"
          >
            Expand All Weeks
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1.5 bg-white dark:bg-[#0D1426] hover:bg-slate-50 dark:hover:bg-[#131B32] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* 2. Midnight-Navy Summary Analytical Hero Panel */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-gradient-to-br from-[#090F24] via-[#0B132E] to-[#070B18] p-6 sm:p-8 shadow-2xl text-white">
        <div className="absolute inset-0 bg-grid-midnight pointer-events-none opacity-40" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold tracking-wide uppercase">
              <Layers className="w-4 h-4" />
              <span>Full 12-Week Algorithmic Journey</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              NeetCode 150 Systematically Paced with Core CS Milestones
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every week balances new problem exploration with Day 3, Day 7, and Day 30 blank-page re-solves. Never advance without consolidating prior patterns.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <div className="p-3 bg-[#0E1736] rounded-xl border border-slate-800 min-w-28 text-center">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Total Solved</div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                {totalSolved} <span className="text-xs text-slate-400 font-normal">/ 150</span>
              </div>
            </div>

            <div className="p-3 bg-[#0E1736] rounded-xl border border-slate-800 min-w-28 text-center">
              <div className="text-[10px] uppercase font-semibold text-slate-400">30d Mastered</div>
              <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                {totalMastered}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar inside Hero Section */}
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          {/* Difficulty Segmented Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-lg border border-slate-800">
            {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                  difficultyFilter === diff
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by problem title, number, or pattern..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </section>

      {/* 3. Supporting Cards: 12 Weeks Accordions */}
      <div className="space-y-4">
        {WEEKS_DATA.map((weekMeta) => {
          const isExpanded = expandedWeeks.includes(weekMeta.week);
          const weekProblems = problems.filter((p) => p.week === weekMeta.week);
          const filteredProblems = weekProblems.filter((p) => {
            if (difficultyFilter !== 'All' && p.difficulty !== difficultyFilter) return false;
            if (searchQuery.trim()) {
              const q = searchQuery.toLowerCase();
              const matchTitle = p.title.toLowerCase().includes(q);
              const matchNum = String(p.number).includes(q);
              const matchTopic = p.topic.toLowerCase().includes(q);
              if (!matchTitle && !matchNum && !matchTopic) return false;
            }
            return true;
          });

          const weekSolved = weekProblems.filter((p) => states[p.id]?.day1Date !== null).length;
          const weekMastered = weekProblems.filter((p) => states[p.id]?.status === 'mastered').length;
          const weekPct = Math.round((weekSolved / (weekProblems.length || 1)) * 100);

          return (
            <div
              key={weekMeta.week}
              className="bg-white dark:bg-[#0D1426] border border-slate-200/90 dark:border-slate-800/90 rounded-xl overflow-hidden shadow-xs transition-colors hover:shadow-sm"
            >
              {/* Accordion Week Header */}
              <div
                onClick={() => toggleWeek(weekMeta.week)}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 dark:hover:bg-[#121B32]/70 transition-colors select-none"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-transform ${
                      isExpanded
                        ? 'rotate-90 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80'
                        : 'text-slate-400 bg-slate-100 dark:bg-slate-800'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                        Week {weekMeta.week}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                        {weekMeta.title}
                      </h3>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Core CS Focus: <strong className="text-slate-700 dark:text-slate-300">{weekMeta.coreCsTopic}</strong> · {weekProblems.length} Problems
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  {/* Progress indicator */}
                  <div className="text-right">
                    <div className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                      {weekSolved} / {weekProblems.length} Solved ({weekPct}%)
                    </div>
                    <div className="w-32 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-1.5">
                      <div
                        className="bg-indigo-600 dark:bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${weekPct}%` }}
                      />
                    </div>
                  </div>

                  {weekPct === 100 && (
                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Accordion Body: Problems List Table */}
              {isExpanded && (
                <div className="border-t border-slate-100 dark:border-slate-800 p-5 bg-slate-50/50 dark:bg-[#090E1D] space-y-3">
                  <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pb-1">
                    {weekMeta.description}
                  </div>

                  {filteredProblems.length === 0 ? (
                    <div className="text-xs text-slate-400 dark:text-slate-500 py-3 text-center">
                      No problems match the current filter in this week.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredProblems.map((p) => {
                        const s = states[p.id];
                        const isSolved = s?.day1Date !== null;
                        const isMastered = s?.status === 'mastered';
                        const isRedo = s?.status === 'redo';

                        return (
                          <div
                            key={p.id}
                            className="p-3 bg-white dark:bg-[#0D1426] border border-slate-200/80 dark:border-slate-800/80 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-xs font-semibold text-slate-400 dark:text-slate-500 w-10 shrink-0">
                                #{p.number}
                              </span>

                              <div>
                                <div
                                  className="text-xs font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                                  onClick={() => onSelectProblem(p.id)}
                                >
                                  {p.title}
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                  <span>{p.topic}</span>
                                  {s?.pattern && (
                                    <>
                                      <span className="mx-1.5 text-slate-300 dark:text-slate-700">·</span>
                                      <span className="text-indigo-600 dark:text-indigo-400 font-medium">Pattern: {s.pattern}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <span
                                className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
                                  p.difficulty === 'Easy'
                                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                                    : p.difficulty === 'Medium'
                                    ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60'
                                    : 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60'
                                }`}
                              >
                                {p.difficulty}
                              </span>

                              {isMastered ? (
                                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Mastered (30d)</span>
                                </span>
                              ) : isSolved ? (
                                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Solved</span>
                                </span>
                              ) : isRedo ? (
                                <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>Redo Needed</span>
                                </span>
                              ) : null}

                              <button
                                onClick={() => onSelectProblem(p.id)}
                                className="px-3 py-1 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white text-xs font-semibold rounded transition-colors flex items-center gap-1"
                              >
                                <span>Practice</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
