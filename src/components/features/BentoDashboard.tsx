import React from 'react';
import {
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  BookOpen,
  Brain,
  Coffee,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Award
} from 'lucide-react';
import { Problem, UserProblemState } from '../../types/curriculum';
import { ROADMAP_WEEKS } from '../../data/problemsData';
import { getTodayString } from '../../services/storageService';

interface BentoDashboardProps {
  problems: Problem[];
  states: Record<string, UserProblemState>;
  onSelectProblem: (id: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const BentoDashboard: React.FC<BentoDashboardProps> = ({
  problems,
  states,
  onSelectProblem,
  onNavigateTab,
}) => {
  const today = getTodayString();

  // Metrics
  const totalProblems = problems.length;
  const startedCount = Object.values(states).filter((s) => s.firstSolvedDate !== null).length;
  const masteredCount = Object.values(states).filter((s) => s.status === 'mastered').length;
  const revisionsDue = problems.filter((p) => {
    const s = states[p.id];
    return s && s.status === 'needs_revision';
  });

  const totalStruggleSeconds = Object.values(states).reduce(
    (acc, s) => acc + (s.activeStruggleSeconds || 0),
    0
  );
  const totalStruggleHours = (totalStruggleSeconds / 3600).toFixed(1);

  // Active Next Problem
  const nextProblem = React.useMemo(() => {
    if (revisionsDue.length > 0) return revisionsDue[0];
    const unstarted = problems.find((p) => !states[p.id]?.firstSolvedDate);
    return unstarted || problems[0];
  }, [revisionsDue, problems, states]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Calm Study Greeting & Vision Hero */}
      <section className="bg-[#FFFCF6] border border-[#E7E1D6] rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-[#526B58] font-semibold tracking-wider uppercase">
              <span>Cozy Study Room</span>
              <span aria-hidden="true">·</span>
              <span>Week 1 Focus: Arrays & Hashing</span>
              <span aria-hidden="true">·</span>
              <span>Target: 60 min</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#252A27] font-serif text-balance">
              The 30-Day Blank Page Law
            </h1>
            <p className="text-xs sm:text-sm text-[#565E59] leading-relaxed">
              Solving a problem once is not learning it. A problem is truly mastered only when you can re-solve it on Day 30 on a blank page without compiler hints or looking at notes.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectProblem(nextProblem.id)}
              className="px-5 py-2.5 bg-[#526B58] hover:bg-[#435748] active:scale-[0.98] text-[#FFFCF6] font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              <span>Continue: {nextProblem.title} (#{nextProblem.number})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Bento Grid: Today's Focus & Daily Plan */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Card 1: Today's Adaptive Plan (7 cols) */}
        <div className="md:col-span-7 bg-[#FFFCF6] border border-[#E7E1D6] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-[#252A27] font-serif flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#526B58]" />
                <span>Today's Adaptive Plan</span>
              </h3>
              <p className="text-xs text-[#565E59]">
                Prioritized according to overdue revisions and current-week roadmap.
              </p>
            </div>
            <span className="text-xs text-[#8A928B] font-mono">{today}</span>
          </div>

          <div className="space-y-2.5">
            {revisionsDue.length > 0 ? (
              revisionsDue.slice(0, 2).map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProblem(p.id)}
                  className="p-3.5 bg-[#C98F79]/10 border border-[#C98F79]/30 rounded-xl flex items-center justify-between cursor-pointer hover:bg-[#C98F79]/15 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-[#C98F79] font-mono">
                        Priority 1 · Due Re-Solve
                      </span>
                    </div>
                    <div className="text-xs font-bold text-[#252A27]">
                      {p.number}. {p.title}
                    </div>
                  </div>
                  <button className="text-xs font-semibold text-[#C98F79] flex items-center gap-1">
                    <span>Recall Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : null}

            {/* Current roadmap task */}
            <div
              onClick={() => onSelectProblem(nextProblem.id)}
              className="p-3.5 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl flex items-center justify-between cursor-pointer hover:border-[#A8B9A0] transition-colors"
            >
              <div className="space-y-0.5">
                <div className="text-[10px] uppercase font-bold text-[#526B58] font-mono">
                  Priority 2 · Roadmap Practice
                </div>
                <div className="text-xs font-bold text-[#252A27]">
                  {nextProblem.number}. {nextProblem.title}
                </div>
                <div className="text-[11px] text-[#565E59]">
                  Week {nextProblem.week} · {nextProblem.topic} ({nextProblem.difficulty})
                </div>
              </div>
              <button className="text-xs font-semibold text-[#526B58] flex items-center gap-1">
                <span>Start</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* CS Fundamentals task */}
            <div
              onClick={() => onNavigateTab('fundamentals')}
              className="p-3.5 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl flex items-center justify-between cursor-pointer hover:border-[#A8B9A0] transition-colors"
            >
              <div className="space-y-0.5">
                <div className="text-[10px] uppercase font-bold text-[#8A928B] font-mono">
                  Priority 3 · CS Fundamentals
                </div>
                <div className="text-xs font-bold text-[#252A27]">
                  DBMS: B-Trees, Hash Indexes & Query Optimization
                </div>
              </div>
              <button className="text-xs font-semibold text-[#526B58] flex items-center gap-1">
                <span>Study</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Spaced Retention Summary & KPIs (5 cols) */}
        <div className="md:col-span-5 bg-[#FFFCF6] border border-[#E7E1D6] rounded-2xl p-6 space-y-5">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-[#252A27] font-serif flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#526B58]" />
              <span>Retention & Mastery</span>
            </h3>
            <p className="text-xs text-[#565E59]">
              Track genuine pattern retention, not just accepted attempts.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl space-y-1">
              <div className="text-[11px] text-[#565E59]">Problems Started</div>
              <div className="text-xl font-bold font-mono text-[#252A27]">
                {startedCount} <span className="text-xs font-normal text-[#8A928B]">/ {totalProblems}</span>
              </div>
            </div>

            <div className="p-3.5 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl space-y-1">
              <div className="text-[11px] text-[#565E59]">Day 30 Mastered</div>
              <div className="text-xl font-bold font-mono text-[#526B58]">
                {masteredCount}
              </div>
            </div>

            <div className="p-3.5 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl space-y-1">
              <div className="text-[11px] text-[#565E59]">Revisions Due</div>
              <div className="text-xl font-bold font-mono text-[#C98F79]">
                {revisionsDue.length}
              </div>
            </div>

            <div className="p-3.5 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl space-y-1">
              <div className="text-[11px] text-[#565E59]">Struggle Hours</div>
              <div className="text-xl font-bold font-mono text-[#252A27]">
                {totalStruggleHours}h
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('revisions')}
            className="w-full py-2.5 bg-[#F6F3EC] hover:bg-[#E7E1D6] border border-[#E7E1D6] text-xs font-bold text-[#526B58] rounded-xl transition-colors"
          >
            Open Spaced Retention Center →
          </button>
        </div>
      </section>

      {/* 12-Week Roadmap Track Strip */}
      <section className="bg-[#FFFCF6] border border-[#E7E1D6] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-[#252A27] font-serif">
              12-Week NeetCode 150 Roadmap
            </h3>
            <p className="text-xs text-[#565E59]">
              Sequential curriculum from Arrays & Hashing to Dynamic Programming & Greedy.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('roadmap')}
            className="text-xs font-bold text-[#526B58] hover:underline"
          >
            View Full Roadmap →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {ROADMAP_WEEKS.map((w) => {
            const weekProblems = problems.filter((p) => p.week === w.week);
            const weekSolved = weekProblems.filter((p) => states[p.id]?.firstSolvedDate).length;
            const percentage = Math.round((weekSolved / (weekProblems.length || 1)) * 100);

            return (
              <div
                key={w.week}
                onClick={() => onNavigateTab('roadmap')}
                className="p-3.5 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl space-y-2 cursor-pointer hover:border-[#A8B9A0] transition-colors"
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-[#526B58] uppercase font-mono">
                  <span>W{w.week}</span>
                  <span>{percentage}%</span>
                </div>
                <div className="text-xs font-bold text-[#252A27] line-clamp-1">
                  {w.title}
                </div>
                <div className="w-full bg-[#E7E1D6] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#526B58] h-full rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Study Modules: CS Fundamentals, System Design & Metacognitive Analytics */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => onNavigateTab('fundamentals')}
          className="bg-[#FFFCF6] border border-[#E7E1D6] rounded-2xl p-6 space-y-3 cursor-pointer hover:border-[#A8B9A0] transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#526B58] font-mono">
              Core Subject Library
            </span>
            <BookOpen className="w-4 h-4 text-[#526B58]" />
          </div>
          <h4 className="text-base font-bold text-[#252A27] font-serif">
            CS Fundamentals
          </h4>
          <p className="text-xs text-[#565E59] leading-relaxed">
            Curated lessons with exercises in OOP, DBMS, SQL, Operating Systems, Computer Networks, and Software Engineering.
          </p>
          <div className="text-xs font-semibold text-[#526B58] pt-1">
            Explore 6 Core Modules →
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('system-design')}
          className="bg-[#FFFCF6] border border-[#E7E1D6] rounded-2xl p-6 space-y-3 cursor-pointer hover:border-[#A8B9A0] transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#526B58] font-mono">
              Architecture & Scalability
            </span>
            <Layers className="w-4 h-4 text-[#526B58]" />
          </div>
          <h4 className="text-base font-bold text-[#252A27] font-serif">
            System Design Practice
          </h4>
          <p className="text-xs text-[#565E59] leading-relaxed">
            Core architectural principles (estimations, APIs, sharding, caching, queues) with 5 end-to-end case studies.
          </p>
          <div className="text-xs font-semibold text-[#526B58] pt-1">
            Explore System Design Cases →
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('analytics')}
          className="bg-[#FFFCF6] border border-[#E7E1D6] rounded-2xl p-6 space-y-3 cursor-pointer hover:border-[#A8B9A0] transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#526B58] font-mono">
              Metacognitive Data
            </span>
            <Award className="w-4 h-4 text-[#526B58]" />
          </div>
          <h4 className="text-base font-bold text-[#252A27] font-serif">
            Mastery Analytics
          </h4>
          <p className="text-xs text-[#565E59] leading-relaxed">
            Pattern autonomy curves, Day 30 blank page clearance rate, productive struggle time, and spaced retention metrics.
          </p>
          <div className="text-xs font-semibold text-[#526B58] pt-1">
            View Deep Analytics →
          </div>
        </div>
      </section>
    </div>
  );
};
