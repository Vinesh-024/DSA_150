import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  RotateCcw,
  ExternalLink,
  Play,
  ArrowUpDown,
  Download,
  Code2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Problem, UserProblemState, ReSolveChoice } from '../types/curriculum';
import {
  updateProblemState,
  markProblemAsRedo,
  getTodayString,
  exportAllDataAsJson
} from '../services/storageService';

interface ReSolveTrackerProps {
  problems: Problem[];
  states: Record<string, UserProblemState>;
  onSelectProblem: (problemId: string) => void;
}

export const ReSolveTracker: React.FC<ReSolveTrackerProps> = ({
  problems,
  states,
  onSelectProblem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWeek, setSelectedWeek] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const today = getTodayString();

  // Summary Metrics as shown in Spaced Repetition specification
  const totalCount = problems.length;
  const startedCount = Object.values(states).filter((s) => s.day1Date !== null).length;
  const masteredCount = Object.values(states).filter((s) => s.status === 'mastered').length;
  const redoCount = Object.values(states).filter((s) => s.status === 'redo').length;
  const reSolveDueCount = Object.values(states).filter((s) => s.status === 'resolve_due').length;
  const percentageMastered = Math.round((masteredCount / (totalCount || 1)) * 100);

  const allTopics = Array.from(new Set(problems.map((p) => p.topic)));

  // Filtered problems list
  const filteredProblems = problems.filter((prob) => {
    const s = states[prob.id] || {};
    if (selectedWeek !== 'All' && prob.week !== Number(selectedWeek)) return false;
    if (selectedTopic !== 'All' && prob.topic !== selectedTopic) return false;
    if (selectedDifficulty !== 'All' && prob.difficulty !== selectedDifficulty) return false;
    if (selectedStatus !== 'All' && s.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = prob.title.toLowerCase().includes(q);
      const matchNum = String(prob.number).includes(q);
      const matchPattern = (s.pattern || '').toLowerCase().includes(q);
      const matchTrigger = (s.triggerLine || '').toLowerCase().includes(q);
      if (!matchTitle && !matchNum && !matchPattern && !matchTrigger) return false;
    }
    return true;
  });

  const handleDay1Change = (problemId: string, val: string) => {
    updateProblemState(problemId, { day1Date: val.trim() || null });
  };

  const handleTimeSpaceChange = (problemId: string, val: string) => {
    updateProblemState(problemId, { timeComplexity: val });
  };

  const handlePatternChange = (problemId: string, val: string) => {
    updateProblemState(problemId, { pattern: val });
  };

  const handleTriggerLineChange = (problemId: string, val: string) => {
    updateProblemState(problemId, { triggerLine: val });
  };

  const handleMilestoneChange = (
    problemId: string,
    field: 'day3Status' | 'day7Status' | 'day30Status',
    val: string
  ) => {
    const choice: ReSolveChoice = val === 'Done' ? 'Done' : val === 'Redo' ? 'Redo' : null;
    updateProblemState(problemId, { [field]: choice });
  };

  return (
    <div className="space-y-6 w-full max-w-[1600px] mx-auto px-6 lg:px-10 pb-16 font-sans">
      
      {/* 1. Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Spaced Retention</span>
            <span aria-hidden="true">·</span>
            <span>Day 1 → Day 3 → Day 7 → Day 30</span>
            <span aria-hidden="true">·</span>
            <span>150 Problems</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
            Re-Solve Retention Matrix
          </h1>
        </div>
      </div>

      {/* 2. Large Midnight-Navy Analytical Hero Panel */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-gradient-to-br from-[#090F24] via-[#0B132E] to-[#070B18] p-6 sm:p-8 shadow-2xl text-white">
        <div className="absolute inset-0 bg-grid-midnight pointer-events-none opacity-40" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold tracking-wide uppercase">
              <Clock className="w-4 h-4" />
              <span>Retention Protocol</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              The 30-Day Blank Page Matrix
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Fill your Day 1 Date, Time/Space complexities, and trigger lines. Day 3, 7, and 30 recall dates calculate automatically. Mark Redo anytime recall hesitates.
            </p>
          </div>

          {/* Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className="p-3 bg-[#0E1736] rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Started</div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                {startedCount} <span className="text-xs text-slate-400 font-normal">/ 150</span>
              </div>
            </div>

            <div className="p-3 bg-[#0E1736] rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Mastered (30d)</div>
              <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                {masteredCount} ({percentageMastered}%)
              </div>
            </div>

            <div className="p-3 bg-[#0E1736] rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Due Today</div>
              <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
                {reSolveDueCount}
              </div>
            </div>

            <div className="p-3 bg-[#0E1736] rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Redos</div>
              <div className="text-2xl font-bold font-mono text-rose-400 tabular-nums">
                {redoCount}
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar inside Hero */}
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center gap-3 text-xs">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search problems, patterns, or trigger lines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Week Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Week:</span>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="bg-slate-900/90 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none font-mono text-xs"
            >
              <option value="All">All Weeks</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((w) => (
                <option key={w} value={w}>Week {w}</option>
              ))}
            </select>
          </div>

          {/* Topic Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Topic:</span>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="bg-slate-900/90 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none text-xs"
            >
              <option value="All">All Topics</option>
              {allTopics.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Diff:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-slate-900/90 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none text-xs"
            >
              <option value="All">All</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-900/90 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none text-xs"
            >
              <option value="All">All</option>
              <option value="resolve_due">Re-solve Due Today</option>
              <option value="in_progress">In Progress</option>
              <option value="mastered">Mastered (30d)</option>
              <option value="redo">Redo Flagged</option>
              <option value="not_started">Not Started</option>
            </select>
          </div>

          {/* Reset filters */}
          {(selectedWeek !== 'All' || selectedTopic !== 'All' || selectedDifficulty !== 'All' || selectedStatus !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedWeek('All');
                setSelectedTopic('All');
                setSelectedDifficulty('All');
                setSelectedStatus('All');
                setSearchQuery('');
              }}
              className="text-indigo-400 hover:text-indigo-300 ml-auto font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      </section>

      {/* 3. Supporting Card: High-Density Spreadsheet Table */}
      <div className="bg-white dark:bg-[#0D1426] border border-slate-200/90 dark:border-slate-800/90 rounded-xl overflow-hidden shadow-xs transition-colors">
        <div className="overflow-x-auto max-h-[680px]">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 z-20 bg-slate-100 dark:bg-[#0A0F1E] border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 w-12 text-center border-r border-slate-200 dark:border-slate-800">Wk</th>
                <th className="py-3 px-3 w-36 border-r border-slate-200 dark:border-slate-800">Topic</th>
                <th className="py-3 px-2 w-12 text-center border-r border-slate-200 dark:border-slate-800">#</th>
                <th className="py-3 px-4 min-w-[200px] border-r border-slate-200 dark:border-slate-800">Problem (opens LeetCode)</th>
                <th className="py-3 px-2 w-20 text-center border-r border-slate-200 dark:border-slate-800">Diff</th>
                <th className="py-3 px-3 w-28 text-center bg-amber-50/80 dark:bg-amber-950/40 border-r border-amber-200/80 dark:border-amber-900/50 text-amber-900 dark:text-amber-300">
                  Day 1 Date *
                </th>
                <th className="py-3 px-3 min-w-[130px] bg-amber-50/80 dark:bg-amber-950/40 border-r border-amber-200/80 dark:border-amber-900/50 text-amber-900 dark:text-amber-300">
                  Time / Space *
                </th>
                <th className="py-3 px-3 min-w-[130px] bg-amber-50/80 dark:bg-amber-950/40 border-r border-amber-200/80 dark:border-amber-900/50 text-amber-900 dark:text-amber-300">
                  Pattern *
                </th>
                <th className="py-3 px-3 min-w-[170px] bg-amber-50/80 dark:bg-amber-950/40 border-r border-amber-200/80 dark:border-amber-900/50 text-amber-900 dark:text-amber-300">
                  Trigger Line *
                </th>
                <th className="py-3 px-2 w-24 text-center border-r border-slate-200 dark:border-slate-800">Day 3 Due</th>
                <th className="py-3 px-2 w-20 text-center bg-amber-50/80 dark:bg-amber-950/40 border-r border-amber-200/80 dark:border-amber-900/50 text-amber-900 dark:text-amber-300">Day 3</th>
                <th className="py-3 px-2 w-24 text-center border-r border-slate-200 dark:border-slate-800">Day 7 Due</th>
                <th className="py-3 px-2 w-20 text-center bg-amber-50/80 dark:bg-amber-950/40 border-r border-amber-200/80 dark:border-amber-900/50 text-amber-900 dark:text-amber-300">Day 7</th>
                <th className="py-3 px-2 w-24 text-center border-r border-slate-200 dark:border-slate-800">Day 30 Due</th>
                <th className="py-3 px-2 w-20 text-center bg-amber-50/80 dark:bg-amber-950/40 border-r border-amber-200/80 dark:border-amber-900/50 text-amber-900 dark:text-amber-300">Day 30</th>
                <th className="py-3 px-3 w-28 text-center border-r border-slate-200 dark:border-slate-800">Status</th>
                <th className="py-3 px-2 w-20 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono">
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={17} className="py-12 text-center text-slate-400 dark:text-slate-500 font-sans">
                    No problems match your current search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProblems.map((prob) => {
                  const s = states[prob.id] || {};
                  const isMastered = s.status === 'mastered';
                  const isDue = s.status === 'resolve_due';
                  const isRedo = s.status === 'redo';

                  return (
                    <tr
                      key={prob.id}
                      className={`hover:bg-slate-50 dark:hover:bg-[#121B32]/70 transition-colors ${
                        isMastered
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20'
                          : isDue
                          ? 'bg-amber-50/50 dark:bg-amber-950/25'
                          : isRedo
                          ? 'bg-rose-50/40 dark:bg-rose-950/20'
                          : ''
                      }`}
                    >
                      {/* Week */}
                      <td className="py-2.5 px-3 text-center border-r border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold">
                        {prob.week}
                      </td>

                      {/* Topic */}
                      <td className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-sans truncate max-w-[140px]" title={prob.topic}>
                        {prob.topic}
                      </td>

                      {/* Number */}
                      <td className="py-2.5 px-2 text-center border-r border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                        {prob.number}
                      </td>

                      {/* Title + Links */}
                      <td className="py-2.5 px-4 border-r border-slate-200 dark:border-slate-800 font-sans">
                        <div className="flex items-center justify-between gap-2">
                          <button
                            onClick={() => onSelectProblem(prob.id)}
                            className="font-medium text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left truncate"
                          >
                            {prob.title}
                          </button>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {prob.freeVersionUrl && (
                              <a
                                href={prob.freeVersionUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-mono"
                                title="Free Version"
                              >
                                [Free]
                              </a>
                            )}
                            <a
                              href={prob.leetcodeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                              title="Open on LeetCode"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            {prob.solutionVideoUrl && (
                              <a
                                href={prob.solutionVideoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                                title="NeetCode Solution Video"
                              >
                                <Play className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Difficulty */}
                      <td className="py-2.5 px-2 text-center border-r border-slate-200 dark:border-slate-800 font-bold">
                        <span
                          className={`text-[11px] ${
                            prob.difficulty === 'Easy'
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : prob.difficulty === 'Medium'
                              ? 'text-amber-700 dark:text-amber-400'
                              : 'text-rose-700 dark:text-rose-400'
                          }`}
                        >
                          {prob.difficulty}
                        </span>
                      </td>

                      {/* Day 1 Date (Yellow editable) */}
                      <td className="py-2 px-2 border-r border-amber-200/80 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/15">
                        <input
                          type="date"
                          value={s.day1Date || ''}
                          onChange={(e) => handleDay1Change(prob.id, e.target.value)}
                          className="w-full bg-white dark:bg-[#070C1A] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded px-1.5 py-0.5 text-[11px] focus:outline-none focus:border-indigo-500"
                        />
                      </td>

                      {/* Time / Space */}
                      <td className="py-2 px-2 border-r border-amber-200/80 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/15 font-sans">
                        <input
                          type="text"
                          placeholder="e.g. O(n), O(1)"
                          value={s.timeComplexity || ''}
                          onChange={(e) => handleTimeSpaceChange(prob.id, e.target.value)}
                          className="w-full bg-white dark:bg-[#070C1A] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded px-1.5 py-0.5 text-[11px] focus:outline-none focus:border-indigo-500"
                        />
                      </td>

                      {/* Pattern */}
                      <td className="py-2 px-2 border-r border-amber-200/80 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/15 font-sans">
                        <input
                          type="text"
                          placeholder="Pattern name"
                          value={s.pattern || ''}
                          onChange={(e) => handlePatternChange(prob.id, e.target.value)}
                          className="w-full bg-white dark:bg-[#070C1A] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded px-1.5 py-0.5 text-[11px] focus:outline-none focus:border-indigo-500"
                        />
                      </td>

                      {/* Trigger line */}
                      <td className="py-2 px-2 border-r border-amber-200/80 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/15 font-sans">
                        <input
                          type="text"
                          placeholder="When you see X, think Y"
                          value={s.triggerLine || ''}
                          onChange={(e) => handleTriggerLineChange(prob.id, e.target.value)}
                          className="w-full bg-white dark:bg-[#070C1A] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded px-1.5 py-0.5 text-[11px] focus:outline-none focus:border-indigo-500"
                        />
                      </td>

                      {/* Day 3 Due */}
                      <td className="py-2.5 px-2 text-center border-r border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[11px]">
                        {s.day3Due || '-'}
                      </td>

                      {/* Day 3 Done/Redo */}
                      <td className="py-2.5 px-1 text-center border-r border-amber-200/80 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/15">
                        <select
                          value={s.day3Status || ''}
                          onChange={(e) => handleMilestoneChange(prob.id, 'day3Status', e.target.value)}
                          disabled={!s.day1Date}
                          className="bg-white dark:bg-[#070C1A] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded px-1 py-0.5 text-[11px] focus:outline-none"
                        >
                          <option value="">-</option>
                          <option value="Done">Done</option>
                          <option value="Redo">Redo</option>
                        </select>
                      </td>

                      {/* Day 7 Due */}
                      <td className="py-2.5 px-2 text-center border-r border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[11px]">
                        {s.day7Due || '-'}
                      </td>

                      {/* Day 7 Done/Redo */}
                      <td className="py-2.5 px-1 text-center border-r border-amber-200/80 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/15">
                        <select
                          value={s.day7Status || ''}
                          onChange={(e) => handleMilestoneChange(prob.id, 'day7Status', e.target.value)}
                          disabled={!s.day1Date || s.day3Status !== 'Done'}
                          className="bg-white dark:bg-[#070C1A] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded px-1 py-0.5 text-[11px] focus:outline-none disabled:opacity-40"
                        >
                          <option value="">-</option>
                          <option value="Done">Done</option>
                          <option value="Redo">Redo</option>
                        </select>
                      </td>

                      {/* Day 30 Due */}
                      <td className="py-2.5 px-2 text-center border-r border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[11px]">
                        {s.day30Due || '-'}
                      </td>

                      {/* Day 30 Done/Redo */}
                      <td className="py-2.5 px-1 text-center border-r border-amber-200/80 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/15">
                        <select
                          value={s.day30Status || ''}
                          onChange={(e) => handleMilestoneChange(prob.id, 'day30Status', e.target.value)}
                          disabled={!s.day1Date || s.day7Status !== 'Done'}
                          className="bg-white dark:bg-[#070C1A] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded px-1 py-0.5 text-[11px] focus:outline-none disabled:opacity-40"
                        >
                          <option value="">-</option>
                          <option value="Done">Done</option>
                          <option value="Redo">Redo</option>
                        </select>
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3 text-center border-r border-slate-200 dark:border-slate-800 font-sans">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap ${
                            isMastered
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                              : isDue
                              ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60 animate-pulse'
                              : isRedo
                              ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
                              : s.day1Date
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {isMastered
                            ? 'Mastered'
                            : isDue
                            ? 'Re-solve due'
                            : isRedo
                            ? 'Redo'
                            : s.day1Date
                            ? 'In progress'
                            : 'Not started'}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-2.5 px-2 text-center font-sans">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onSelectProblem(prob.id)}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded"
                            title="Open in Code Workspace"
                          >
                            <Code2 className="w-3.5 h-3.5" />
                          </button>
                          {s.day1Date && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Restart retention calendar for "${prob.title}" as Redo?`)) {
                                  markProblemAsRedo(prob.id);
                                }
                              }}
                              className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded"
                              title="Mark Redo (Restart Calendar)"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
