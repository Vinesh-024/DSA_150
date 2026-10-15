import React, { useState } from 'react';
import {
  Brain,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  BarChart3,
  TrendingUp,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Problem, UserProblemState } from '../../types/curriculum';
import { ROADMAP_WEEKS } from '../../data/problemsData';

interface AnalyticsViewProps {
  problems: Problem[];
  states: Record<string, UserProblemState>;
  onSelectProblem: (id: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  problems,
  states,
  onSelectProblem,
  onNavigateTab,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  // Canonical calculations
  const totalProblems = problems.length;
  const stateValues = Object.values(states);

  const attemptedCount = stateValues.filter((s) => s.status !== 'not_started').length;
  const independentSolves = stateValues.filter((s) => s.status === 'solved_independently').length;
  const withHelpSolves = stateValues.filter((s) => s.status === 'solved_with_help').length;
  const masteredCount = stateValues.filter((s) => s.status === 'mastered').length;
  const needsRevisionCount = stateValues.filter((s) => s.status === 'needs_revision').length;

  const totalStruggleSeconds = stateValues.reduce(
    (acc, s) => acc + (s.activeStruggleSeconds || 0),
    0
  );
  const totalStruggleHours = (totalStruggleSeconds / 3600).toFixed(1);

  // Invariant & Trigger-line synthesis rate
  const problemsWithInvariants = stateValues.filter(
    (s) => (s.triggerLine && s.triggerLine.trim().length > 0) || (s.timeComplexity && s.spaceComplexity)
  ).length;
  const invariantRate = attemptedCount > 0 ? Math.round((problemsWithInvariants / attemptedCount) * 100) : 0;

  // Day 30 Retention Clearance
  const day30Attempts = stateValues.filter((s) => s.day30Status !== null).length;
  const day30Passed = stateValues.filter((s) => s.day30Status === 'Done').length;
  const day30RetentionRate = day30Attempts > 0 ? Math.round((day30Passed / day30Attempts) * 100) : 100;

  // Hint dependency stats
  const hintUsageDistribution = {
    noHints: stateValues.filter((s) => (s.hintsUsedCount || 0) === 0 && s.firstSolvedDate).length,
    h1Only: stateValues.filter((s) => s.highestHintLevel === 1).length,
    h2Used: stateValues.filter((s) => s.highestHintLevel === 2).length,
    h3Used: stateValues.filter((s) => s.highestHintLevel === 3).length,
    h4Disclosed: stateValues.filter((s) => s.highestHintLevel === 4).length,
  };

  // Topic-wise breakdown
  const topicStats = ROADMAP_WEEKS.map((rw) => {
    const topicProblems = problems.filter((p) => p.week === rw.week);
    const count = topicProblems.length;
    const topicStates = topicProblems.map((p) => states[p.id]).filter(Boolean);

    const mastered = topicStates.filter((s) => s.status === 'mastered').length;
    const independent = topicStates.filter((s) => s.status === 'solved_independently').length;
    const withHelp = topicStates.filter((s) => s.status === 'solved_with_help').length;
    const due = topicStates.filter((s) => s.status === 'needs_revision').length;

    const progressPct = count > 0 ? Math.round(((mastered + independent) / count) * 100) : 0;

    return {
      week: rw.week,
      title: rw.title,
      focus: rw.focus,
      total: count,
      mastered,
      independent,
      withHelp,
      due,
      progressPct
    };
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header & Core Philosophy */}
      <section className="bg-[#FFFCF6] border border-[#E7E1D6] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-[#526B58] font-semibold tracking-wider uppercase font-mono">
              <Award className="w-4 h-4 text-[#526B58]" />
              <span>Cognitive Mastery & Active Retrieval Analytics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#252A27] font-serif">
              Genuine Mastery vs Vanity Count
            </h1>
            <p className="text-xs sm:text-sm text-[#565E59] leading-relaxed">
              True algorithmic competence is measured not by how many problems you checked off, but by your ability to retrieve patterns independently after 30 days on a blank page.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('revisions')}
              className="px-4 py-2.5 bg-[#526B58] hover:bg-[#435748] active:scale-[0.98] text-[#FFFCF6] font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Review Due Queue ({needsRevisionCount})</span>
            </button>
          </div>
        </div>
      </section>

      {/* Top Bento Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: 30-Day Blank Page Rate */}
        <div className="bg-[#FFFCF6] border border-[#E7E1D6] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#8A928B]">
            <span className="font-semibold uppercase tracking-wider text-[11px]">30-Day Recall Clearance</span>
            <ShieldCheck className="w-4 h-4 text-[#526B58]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#252A27] font-mono">{day30RetentionRate}%</span>
            <span className="text-xs text-[#526B58] font-medium">{day30Passed} passed</span>
          </div>
          <p className="text-xs text-[#565E59]">
            {day30Attempts} total Day 30 blank page recall trials attempted.
          </p>
        </div>

        {/* Card 2: Independent Solve Ratio */}
        <div className="bg-[#FFFCF6] border border-[#E7E1D6] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#8A928B]">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Independent Solves</span>
            <Brain className="w-4 h-4 text-[#526B58]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#252A27] font-mono">{independentSolves + masteredCount}</span>
            <span className="text-xs text-[#8A928B]">/ {attemptedCount} attempted</span>
          </div>
          <p className="text-xs text-[#565E59]">
            Solved with zero hints or solution disclosure.
          </p>
        </div>

        {/* Card 3: Deep Productive Struggle */}
        <div className="bg-[#FFFCF6] border border-[#E7E1D6] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#8A928B]">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Productive Struggle</span>
            <Clock className="w-4 h-4 text-[#526B58]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#252A27] font-mono">{totalStruggleHours}</span>
            <span className="text-xs text-[#565E59]">hours total</span>
          </div>
          <p className="text-xs text-[#565E59]">
            Active focus timer during 20-minute struggle intervals.
          </p>
        </div>

        {/* Card 4: Invariant Synthesis Rate */}
        <div className="bg-[#FFFCF6] border border-[#E7E1D6] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#8A928B]">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Synthesis Completeness</span>
            <Sparkles className="w-4 h-4 text-[#526B58]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#252A27] font-mono">{invariantRate}%</span>
            <span className="text-xs text-[#526B58]">{problemsWithInvariants} problems</span>
          </div>
          <p className="text-xs text-[#565E59]">
            Problems documented with pattern trigger lines and Big-O invariants.
          </p>
        </div>
      </section>

      {/* Main Analysis Sections */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 12-Week Topic Progression (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFCF6] border border-[#E7E1D6] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-[#252A27] font-serif flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#526B58]" />
                <span>12-Week Pattern Competency Breakdown</span>
              </h3>
              <p className="text-xs text-[#565E59]">
                Progress through high-frequency interview archetypes
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {topicStats.map((topic) => (
              <div
                key={topic.week}
                className="p-3.5 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl space-y-2 hover:border-[#A8B9A0] transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#FFFCF6] border border-[#E7E1D6] rounded-md font-mono text-[10px] font-bold text-[#526B58]">
                      W{topic.week}
                    </span>
                    <span className="font-bold text-[#252A27]">{topic.title}</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#565E59]">
                    {topic.mastered + topic.independent} / {topic.total} ({topic.progressPct}%)
                  </span>
                </div>

                {/* Multi-tier Progress Bar */}
                <div className="w-full h-2 bg-[#E7E1D6] rounded-full overflow-hidden flex">
                  {/* Mastered (Dark Green) */}
                  <div
                    style={{ width: `${(topic.mastered / topic.total) * 100}%` }}
                    className="h-full bg-[#526B58]"
                    title={`Mastered: ${topic.mastered}`}
                  />
                  {/* Independent (Sage) */}
                  <div
                    style={{ width: `${(topic.independent / topic.total) * 100}%` }}
                    className="h-full bg-[#A8B9A0]"
                    title={`Independent: ${topic.independent}`}
                  />
                  {/* With Help (Dusty Blue) */}
                  <div
                    style={{ width: `${(topic.withHelp / topic.total) * 100}%` }}
                    className="h-full bg-[#B9C9D7]"
                    title={`With Help: ${topic.withHelp}`}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#8A928B]">
                  <span className="truncate max-w-[70%]">{topic.focus}</span>
                  {topic.due > 0 && (
                    <span className="text-[#C98F79] font-semibold flex items-center gap-1">
                      <RotateCcw className="w-3 h-3" />
                      {topic.due} due for revision
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Cognitive Assistance & Pedagogical Health (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Hint Dependency Analysis */}
          <div className="bg-[#FFFCF6] border border-[#E7E1D6] rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-[#252A27] font-serif flex items-center gap-2">
              <Brain className="w-4 h-4 text-[#526B58]" />
              <span>Assistance & Hint Autonomy</span>
            </h3>
            <p className="text-xs text-[#565E59]">
              How independently you solve problems before seeking progressive nudges.
            </p>

            <div className="space-y-2.5 pt-1">
              <div className="p-3 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#252A27]">Zero Hints (Complete Autonomy)</div>
                  <div className="text-[11px] text-[#565E59]">Solved without opening Stuck Mode</div>
                </div>
                <span className="text-base font-bold font-mono text-[#526B58]">
                  {hintUsageDistribution.noHints}
                </span>
              </div>

              <div className="p-3 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#252A27]">Hint 1 Only (Socratic Nudge)</div>
                  <div className="text-[11px] text-[#565E59]">Needed gentle conceptual question</div>
                </div>
                <span className="text-base font-bold font-mono text-[#526B58]">
                  {hintUsageDistribution.h1Only}
                </span>
              </div>

              <div className="p-3 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#252A27]">Hint 2 (Pattern Identification)</div>
                  <div className="text-[11px] text-[#565E59]">Identified core data structure</div>
                </div>
                <span className="text-base font-bold font-mono text-[#B9C9D7]">
                  {hintUsageDistribution.h2Used}
                </span>
              </div>

              <div className="p-3 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#252A27]">Hint 3 (Algorithm Blueprint)</div>
                  <div className="text-[11px] text-[#565E59]">Step-by-step pseudo-code guidance</div>
                </div>
                <span className="text-base font-bold font-mono text-[#C98F79]">
                  {hintUsageDistribution.h3Used}
                </span>
              </div>

              <div className="p-3 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#252A27]">Hint 4 (Full Reference Disclosed)</div>
                  <div className="text-[11px] text-[#565E59]">Requires automatic Day 3 re-solve</div>
                </div>
                <span className="text-base font-bold font-mono text-[#C98F79]">
                  {hintUsageDistribution.h4Disclosed}
                </span>
              </div>
            </div>
          </div>

          {/* Retention Health Indicator */}
          <div className="bg-[#FFFCF6] border border-[#E7E1D6] rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-[#252A27] font-serif flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#526B58]" />
              <span>Retention Protocol Discipline</span>
            </h3>
            <p className="text-xs text-[#565E59]">
              Adherence to the Day 3, 7, and 30 spaced repetition loop.
            </p>

            <div className="grid grid-cols-3 gap-3 text-center pt-1">
              <div className="p-3 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl">
                <div className="text-[10px] uppercase font-mono text-[#8A928B]">Day 3 Loop</div>
                <div className="text-xl font-bold font-mono text-[#252A27] mt-1">
                  {stateValues.filter((s) => s.day3Status === 'Done').length}
                </div>
                <div className="text-[10px] text-[#526B58] font-medium mt-0.5">Cleared</div>
              </div>

              <div className="p-3 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl">
                <div className="text-[10px] uppercase font-mono text-[#8A928B]">Day 7 Loop</div>
                <div className="text-xl font-bold font-mono text-[#252A27] mt-1">
                  {stateValues.filter((s) => s.day7Status === 'Done').length}
                </div>
                <div className="text-[10px] text-[#526B58] font-medium mt-0.5">Cleared</div>
              </div>

              <div className="p-3 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl">
                <div className="text-[10px] uppercase font-mono text-[#8A928B]">Day 30 Law</div>
                <div className="text-xl font-bold font-mono text-[#252A27] mt-1">
                  {masteredCount}
                </div>
                <div className="text-[10px] text-[#526B58] font-bold mt-0.5">Mastered</div>
              </div>
            </div>

            <div className="p-3.5 bg-[#FAF8F2] border border-[#E7E1D6] rounded-xl text-xs text-[#565E59] leading-relaxed">
              <span className="font-bold text-[#252A27]">Pedagogical Rule:</span> If a Day 30 recall fails, the problem state reverts back to Day 3. True mastery is enduring retrieval.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
