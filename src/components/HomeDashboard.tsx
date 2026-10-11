import React, { useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  ArrowRight,
  BookOpen,
  Brain,
  Layers,
  Sparkles,
  RotateCcw,
  AlertCircle,
  ExternalLink,
  Zap,
  Target,
  Code2,
  Activity,
  Award,
  Check,
  ChevronRight,
  ShieldCheck,
  Timer
} from 'lucide-react';
import { Problem, UserProblemState } from '../types/curriculum';
import { WEEKS_DATA } from '../data/weeksData';
import { DailyRoutineState, getTodayString } from '../services/storageService';
import { ConcentricNetworkVisualization } from './ConcentricNetworkVisualization';

interface HomeDashboardProps {
  problems: Problem[];
  states: Record<string, UserProblemState>;
  onSelectProblem: (problemId: string) => void;
  onNavigateTab: (tab: string) => void;
  dailyRoutine: DailyRoutineState;
  onUpdateDailyRoutine: (updates: Partial<DailyRoutineState>) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  problems,
  states,
  onSelectProblem,
  onNavigateTab,
  dailyRoutine,
  onUpdateDailyRoutine,
}) => {
  const today = getTodayString();
  const [selectedRailTab, setSelectedRailTab] = useState<'queue' | 'routine'>('queue');

  // Metrics computation
  const totalCount = problems.length; // 150
  const startedCount = Object.values(states).filter((s) => s.day1Date !== null).length;
  const masteredCount = Object.values(states).filter((s) => s.status === 'mastered').length;
  const redoCount = Object.values(states).filter((s) => s.status === 'redo').length;
  const reSolveDueProblems = problems.filter((p) => {
    const s = states[p.id];
    return s && s.status === 'resolve_due';
  });

  const totalFocusSeconds = Object.values(states).reduce((acc, s) => acc + (s.activeTimeSeconds || 0), 0);
  const totalFocusHours = (totalFocusSeconds / 3600).toFixed(1);

  const independentSolves = Object.values(states).filter((s) => s.day1Date && s.isSolvedIndependently).length;
  const assistedSolves = Object.values(states).filter((s) => s.day1Date && !s.isSolvedIndependently).length;
  const independentRatioPct = startedCount > 0 ? Math.round((independentSolves / startedCount) * 100) : 0;

  // Spaced repetition stages counts
  const day3DueCount = Object.values(states).filter((s) => s.day1Date && s.day3Status !== 'Done').length;
  const day7DueCount = Object.values(states).filter((s) => s.day3Status === 'Done' && s.day7Status !== 'Done').length;
  const day30DueCount = Object.values(states).filter((s) => s.day7Status === 'Done' && s.day30Status !== 'Done').length;

  // Determine Current Active Week (first week with incomplete problems)
  const currentWeekNum = useMemo(() => {
    for (let w = 1; w <= 12; w++) {
      const weekProblems = problems.filter((p) => p.week === w);
      const isWeekComplete = weekProblems.every((p) => states[p.id]?.day1Date !== null);
      if (!isWeekComplete) return w;
    }
    return 12;
  }, [problems, states]);

  const currentWeekMeta = WEEKS_DATA.find((w) => w.week === currentWeekNum) || WEEKS_DATA[0];
  const currentWeekProblems = problems.filter((p) => p.week === currentWeekNum);
  const currentWeekSolved = currentWeekProblems.filter((p) => states[p.id]?.day1Date !== null).length;
  const currentWeekPercentage = Math.round((currentWeekSolved / (currentWeekProblems.length || 1)) * 100);

  // Next up candidate problem
  const nextProblem = useMemo(() => {
    if (reSolveDueProblems.length > 0) return reSolveDueProblems[0];
    const untouched = currentWeekProblems.find((p) => !states[p.id]?.day1Date);
    if (untouched) return untouched;
    return problems.find((p) => !states[p.id]?.day1Date) || problems[0];
  }, [reSolveDueProblems, currentWeekProblems, problems, states]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      
      {/* 1. Page Title & Contextual Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Curriculum Engine</span>
            <span aria-hidden="true">·</span>
            <span>NeetCode 150</span>
            <span aria-hidden="true">·</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Week {currentWeekNum} Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
            Algorithmic Command Center
          </h1>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigateTab('tracker')}
            className="px-3.5 py-2 bg-white dark:bg-[#0D1426] hover:bg-slate-50 dark:hover:bg-[#131B32] border border-slate-200/90 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs transition-colors flex items-center gap-2"
          >
            <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Re-Solve Queue</span>
            {reSolveDueProblems.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-mono text-[10px] font-bold border border-rose-200 dark:border-rose-800/40">
                {reSolveDueProblems.length}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectProblem(nextProblem.id)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:scale-95 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>Resume: #{nextProblem.number} {nextProblem.title}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Large Midnight-Navy Analytical Hero Panel with Concentric Network Visualization */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-gradient-to-br from-[#090F24] via-[#0B132E] to-[#070B18] p-6 sm:p-8 shadow-2xl text-white">
        <div className="absolute inset-0 bg-grid-midnight pointer-events-none opacity-40" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Top telemetry kicker */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2.5 text-xs text-indigo-300 font-medium">
              <span className="px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 font-mono text-[11px] font-semibold">
                WEEK {currentWeekNum} / 12
              </span>
              <span className="text-slate-300 font-medium">{currentWeekMeta.title}</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 font-mono text-[11px] tabular-nums">
                {currentWeekSolved} / {currentWeekProblems.length} Solved ({currentWeekPercentage}%)
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="font-mono tabular-nums text-slate-300">
                Total Focus: <strong className="text-white">{totalFocusHours}h</strong>
              </span>
              <span className="text-slate-700" aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-slate-300">
                Mastered: <strong className="text-emerald-400">{masteredCount}</strong> / 150
              </span>
            </div>
          </div>

          {/* Core Concentric Visualization Layout */}
          <div className="pt-2">
            <ConcentricNetworkVisualization
              problems={problems}
              states={states}
              onSelectProblem={onSelectProblem}
              onNavigateTab={onNavigateTab}
            />
          </div>
        </div>
      </section>

      {/* 3. Main Split Layout: Supporting Cards (Left 65%) + Contextual Task Rail (Right 35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 8 Columns: Supporting Metric and Chart Cards */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Metrics 4-Card Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Metric 1: Solved */}
            <div className="bg-white dark:bg-[#0D1426] border border-slate-200/90 dark:border-slate-800/90 rounded-xl p-4 shadow-xs space-y-1 transition-colors">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Solved
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                {startedCount} <span className="text-xs text-slate-400 font-normal font-sans">/ 150</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2">
                <div
                  className="bg-indigo-600 dark:bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.round((startedCount / 150) * 100)}%` }}
                />
              </div>
            </div>

            {/* Metric 2: Mastered (30-Day Blank Page) */}
            <div className="bg-white dark:bg-[#0D1426] border border-slate-200/90 dark:border-slate-800/90 rounded-xl p-4 shadow-xs space-y-1 transition-colors">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                30d Mastered
              </div>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                {masteredCount} <span className="text-xs text-slate-400 font-normal font-sans">verified</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2">
                <div
                  className="bg-emerald-500 dark:bg-emerald-400 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.round((masteredCount / 150) * 100)}%` }}
                />
              </div>
            </div>

            {/* Metric 3: Independent Solve Ratio */}
            <div className="bg-white dark:bg-[#0D1426] border border-slate-200/90 dark:border-slate-800/90 rounded-xl p-4 shadow-xs space-y-1 transition-colors">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Self-Solved
              </div>
              <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">
                {independentRatioPct}% <span className="text-xs text-slate-400 font-normal font-sans">ratio</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2">
                <div
                  className="bg-indigo-500 dark:bg-indigo-400 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${independentRatioPct}%` }}
                />
              </div>
            </div>

            {/* Metric 4: Re-Solves Due */}
            <div className="bg-white dark:bg-[#0D1426] border border-slate-200/90 dark:border-slate-800/90 rounded-xl p-4 shadow-xs space-y-1 transition-colors">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Re-Solves Due
              </div>
              <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 font-mono tabular-nums">
                {reSolveDueProblems.length} <span className="text-xs text-slate-400 font-normal font-sans">now</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2">
                <div
                  className="bg-rose-500 dark:bg-rose-400 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(reSolveDueProblems.length * 10, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Spaced Repetition Retention Funnel Card */}
          <div className="bg-white dark:bg-[#0D1426] border border-slate-200/90 dark:border-slate-800/90 rounded-xl p-5 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Spaced Repetition Retention Funnel
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Solving once is temporary. Full algorithmic retention requires Day 1 → Day 3 → Day 7 → Day 30 re-solves on a blank page.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('tracker')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors flex items-center gap-1"
              >
                <span>View Full Tracker</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Funnel Pipeline Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
              {/* Stage 1 */}
              <div className="p-3 bg-slate-50 dark:bg-[#121B32] rounded-lg border border-slate-100 dark:border-slate-800/80 space-y-1">
                <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                  <span>Day 1 (Initial)</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{startedCount}</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">20-minute struggle</div>
              </div>

              {/* Stage 2 */}
              <div className="p-3 bg-slate-50 dark:bg-[#121B32] rounded-lg border border-slate-100 dark:border-slate-800/80 space-y-1">
                <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                  <span>Day 3 (Spacing)</span>
                  <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">{day3DueCount} in pipeline</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Blank page recall</div>
              </div>

              {/* Stage 3 */}
              <div className="p-3 bg-slate-50 dark:bg-[#121B32] rounded-lg border border-slate-100 dark:border-slate-800/80 space-y-1">
                <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                  <span>Day 7 (Consolidate)</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{day7DueCount} in pipeline</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Pattern trigger check</div>
              </div>

              {/* Stage 4 */}
              <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-lg border border-emerald-100 dark:border-emerald-800/50 space-y-1">
                <div className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                  <span>Day 30 (Mastery)</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{masteredCount}</span>
                </div>
                <div className="text-xs text-emerald-700 dark:text-emerald-400">Permanent mental model</div>
              </div>
            </div>
          </div>

          {/* Current Week Focus Problems Card */}
          <div className="bg-white dark:bg-[#0D1426] border border-slate-200/90 dark:border-slate-800/90 rounded-xl p-5 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Week {currentWeekNum}: {currentWeekMeta.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Core curriculum problems scheduled for this sprint.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('roadmap')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors flex items-center gap-1"
              >
                <span>Roadmap</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {currentWeekProblems.map((p) => {
                const s = states[p.id];
                const isSolved = s?.day1Date !== null;
                const isMastered = s?.status === 'mastered';
                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectProblem(p.id)}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold text-slate-400 dark:text-slate-500 w-10">
                        #{p.number}
                      </span>
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {p.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {p.topic}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
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
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="hidden sm:inline">Mastered</span>
                        </span>
                      ) : isSolved ? (
                        <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          <span className="hidden sm:inline">Solved</span>
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-1 font-semibold">
                          <span>Practice</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 4 Columns: Contextual Task & Action Rail */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Segmented Rail Card: Today's Action Items */}
          <div className="bg-white dark:bg-[#0D1426] border border-slate-200/90 dark:border-slate-800/90 rounded-xl p-5 shadow-xs space-y-4 transition-colors">
            {/* Segmented tab header */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
              <button
                onClick={() => setSelectedRailTab('queue')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  selectedRailTab === 'queue'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Re-Solve Queue ({reSolveDueProblems.length})
              </button>
              <button
                onClick={() => setSelectedRailTab('routine')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  selectedRailTab === 'routine'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Daily Core CS
              </button>
            </div>

            {/* Tab 1: Re-Solve Queue */}
            {selectedRailTab === 'queue' && (
              <div className="space-y-3">
                {reSolveDueProblems.length === 0 ? (
                  <div className="p-6 text-center rounded-lg bg-slate-50 dark:bg-[#121B32] border border-slate-100 dark:border-slate-800 space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Queue is Clear</div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      No re-solves scheduled for today. You are fully up-to-date on Day 3, 7, and 30 intervals!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                    {reSolveDueProblems.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-lg border border-rose-100 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 space-y-2 hover:border-rose-200 dark:hover:border-rose-800/80 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            #{p.number} {p.title}
                          </div>
                          <span className="text-[10px] font-mono text-rose-700 dark:text-rose-300 font-semibold px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-900/60">
                            Due Today
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                          <span>{p.topic}</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{p.difficulty}</span>
                        </div>

                        <button
                          onClick={() => onSelectProblem(p.id)}
                          className="w-full py-1.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-semibold text-xs rounded transition-all flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Re-Solve on Blank Page</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Daily Core CS Routine Checklist */}
            {selectedRailTab === 'routine' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Daily CS Foundations Habit (1 hour dedicated study):
                </div>

                <div className="space-y-2">
                  {[
                    { key: 'coreCsDone', label: '1 Hr Core CS Study (OS, DBMS, CN)', sub: 'Operating Systems / Database internals' },
                    { key: 'dailyProblemsDone', label: 'Complete Daily LeetCode Targets', sub: '2-3 problems using 20-min struggle rule' },
                    { key: 'systemDesignDone', label: 'System Design / Architecture', sub: 'Cache, sharding, consensus, microservices' },
                  ].map((item) => {
                    const isChecked = (dailyRoutine as any)[item.key] || false;
                    return (
                      <div
                        key={item.key}
                        onClick={() => onUpdateDailyRoutine({ [item.key]: !isChecked })}
                        className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                          isChecked
                            ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-slate-900 dark:text-slate-200'
                            : 'bg-slate-50 dark:bg-[#121B32] border-slate-100 dark:border-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="flex-1">
                          <div className={`text-xs font-semibold ${isChecked ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                            {item.label}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {item.sub}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Pedagogical 20-Minute Struggle Rule Card */}
          <div className="bg-white dark:bg-[#0D1426] border border-slate-200/90 dark:border-slate-800/90 rounded-xl p-5 shadow-xs space-y-3 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 flex items-center justify-center">
                <Timer className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                The 20-Minute Struggle Law
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              If stuck, struggle for at least 20 minutes before looking at a hint. If you must look: read the <em>idea only</em>, never the code. Close it and write the implementation yourself.
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Strict Blank Page Rule</span>
              <button
                onClick={() => onNavigateTab('video-insights')}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold"
              >
                Read 6-Step Loop →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
