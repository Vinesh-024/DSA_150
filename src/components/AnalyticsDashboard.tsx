import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Problem, UserProblemState, SubmissionRecord } from '../types/curriculum';
import { WEEKS_DATA } from '../data/weeksData';
import { CheckCircle2, Clock, Flame, Award, Brain, Target, ShieldCheck, BarChart3, TrendingUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface AnalyticsDashboardProps {
  problems: Problem[];
  states: Record<string, UserProblemState>;
  submissions: SubmissionRecord[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  problems,
  states,
  submissions,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const totalCount = problems.length; // 150
  const startedCount = Object.values(states).filter((s) => s.day1Date !== null).length;
  const masteredCount = Object.values(states).filter((s) => s.status === 'mastered').length;
  const redoCount = Object.values(states).filter((s) => s.status === 'redo').length;

  const totalFocusSeconds = Object.values(states).reduce((acc, s) => acc + (s.activeTimeSeconds || 0), 0);
  const totalFocusHours = (totalFocusSeconds / 3600).toFixed(1);

  const independentSolves = Object.values(states).filter((s) => s.day1Date && s.isSolvedIndependently).length;
  const assistedSolves = Object.values(states).filter((s) => s.day1Date && !s.isSolvedIndependently).length;
  const independentPct = startedCount > 0 ? Math.round((independentSolves / startedCount) * 100) : 0;

  // 1. Difficulty Distribution Data
  const diffData = [
    {
      name: 'Easy',
      total: problems.filter((p) => p.difficulty === 'Easy').length,
      solved: problems.filter((p) => p.difficulty === 'Easy' && states[p.id]?.day1Date !== null).length,
      mastered: problems.filter((p) => p.difficulty === 'Easy' && states[p.id]?.status === 'mastered').length,
    },
    {
      name: 'Medium',
      total: problems.filter((p) => p.difficulty === 'Medium').length,
      solved: problems.filter((p) => p.difficulty === 'Medium' && states[p.id]?.day1Date !== null).length,
      mastered: problems.filter((p) => p.difficulty === 'Medium' && states[p.id]?.status === 'mastered').length,
    },
    {
      name: 'Hard',
      total: problems.filter((p) => p.difficulty === 'Hard').length,
      solved: problems.filter((p) => p.difficulty === 'Hard' && states[p.id]?.day1Date !== null).length,
      mastered: problems.filter((p) => p.difficulty === 'Hard' && states[p.id]?.status === 'mastered').length,
    },
  ];

  // 2. Weekly Progress Data
  const weeklyData = WEEKS_DATA.map((w) => {
    const weekProblems = problems.filter((p) => p.week === w.week);
    const solved = weekProblems.filter((p) => states[p.id]?.day1Date !== null).length;
    const mastered = weekProblems.filter((p) => states[p.id]?.status === 'mastered').length;
    return {
      week: `W${w.week}`,
      total: weekProblems.length,
      solved,
      mastered
    };
  });

  // 3. Topic Completion Data
  const allTopics = Array.from(new Set(problems.map((p) => p.topic)));
  const topicData = allTopics.map((topic) => {
    const topicProblems = problems.filter((p) => p.topic === topic);
    const solved = topicProblems.filter((p) => states[p.id]?.day1Date !== null).length;
    return {
      topic: topic.replace('Dynamic Programming', 'DP').replace('Heap / Priority Queue', 'Heaps'),
      solved,
      total: topicProblems.length,
    };
  });

  const barTrackColor = isDark ? '#1E293B' : '#E2E8F0';
  const axisColor = isDark ? '#94A3B8' : '#64748B';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      
      {/* 1. Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Progress Telemetry</span>
            <span aria-hidden="true">·</span>
            <span>Mastery Diagnostics</span>
            <span aria-hidden="true">·</span>
            <span>150 Curated Problems</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
            Algorithmic Mastery Analytics
          </h1>
        </div>
      </div>

      {/* 2. Large Midnight-Navy Analytical Hero Panel */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-gradient-to-br from-[#090F24] via-[#0B132E] to-[#070B18] p-6 sm:p-8 shadow-2xl text-white">
        <div className="absolute inset-0 bg-grid-midnight pointer-events-none opacity-40" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold tracking-wide uppercase">
              <BarChart3 className="w-4 h-4" />
              <span>Retention & Execution Metrics</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Evidence-Based Problem Solving & Spaced Recall
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Tracking your active struggle time, independent solve purity, and the 30-day retention loop across Easy, Medium, and Hard problem tiers.
            </p>
          </div>

          {/* Metric Tiles inside Navy Hero */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className="p-3 bg-[#0E1736] rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Solved</div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                {startedCount} <span className="text-xs text-slate-400 font-normal">/ 150</span>
              </div>
            </div>

            <div className="p-3 bg-[#0E1736] rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">30d Mastered</div>
              <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                {masteredCount}
              </div>
            </div>

            <div className="p-3 bg-[#0E1736] rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Self-Solved</div>
              <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
                {independentPct}%
              </div>
            </div>

            <div className="p-3 bg-[#0E1736] rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Focus Hours</div>
              <div className="text-2xl font-bold font-mono text-indigo-300 tabular-nums">
                {totalFocusHours}h
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Supporting Cards: Recharts Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Difficulty Distribution */}
        <div className="bg-white dark:bg-[#0D1426] border border-slate-200/90 dark:border-slate-800/90 rounded-xl p-5 shadow-xs space-y-4 transition-colors">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Difficulty Distribution Breakdown</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Solved and 30-Day Mastered counts across difficulty tiers.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diffData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tickLine={false} stroke={axisColor} fontSize={12} />
                <YAxis tickLine={false} stroke={axisColor} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                    borderColor: isDark ? '#334155' : '#E2E8F0',
                    borderRadius: '8px',
                    color: isDark ? '#F8FAFC' : '#0F172A',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="total" fill={barTrackColor} name="Total Problems" radius={[4, 4, 0, 0]} />
                <Bar dataKey="solved" fill="#6366F1" name="Solved (Day 1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="mastered" fill="#10B981" name="Mastered (Day 30)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Weekly Progression Timeline */}
        <div className="bg-white dark:bg-[#0D1426] border border-slate-200/90 dark:border-slate-800/90 rounded-xl p-5 shadow-xs space-y-4 transition-colors">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">12-Week Sprint Progression</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Problems completed across Week 1 through Week 12.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="week" tickLine={false} stroke={axisColor} fontSize={11} />
                <YAxis tickLine={false} stroke={axisColor} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                    borderColor: isDark ? '#334155' : '#E2E8F0',
                    borderRadius: '8px',
                    color: isDark ? '#F8FAFC' : '#0F172A',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="total" fill={barTrackColor} name="Total Week Goal" radius={[3, 3, 0, 0]} />
                <Bar dataKey="solved" fill="#38BDF8" name="Solved" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Topic Completion Spectrum */}
        <div className="bg-white dark:bg-[#0D1426] border border-slate-200/90 dark:border-slate-800/90 rounded-xl p-5 shadow-xs space-y-4 lg:col-span-2 transition-colors">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Algorithmic Pattern Categories</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Completion distribution across all 17 NeetCode 150 topic clusters.
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis
                  dataKey="topic"
                  tickLine={false}
                  stroke={axisColor}
                  fontSize={10}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis tickLine={false} stroke={axisColor} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                    borderColor: isDark ? '#334155' : '#E2E8F0',
                    borderRadius: '8px',
                    color: isDark ? '#F8FAFC' : '#0F172A',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="total" fill={barTrackColor} name="Total in Topic" radius={[3, 3, 0, 0]} />
                <Bar dataKey="solved" fill="#8B5CF6" name="Solved" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
