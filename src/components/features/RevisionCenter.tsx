import React from 'react';
import { Clock, CheckCircle2, RotateCcw, AlertTriangle, ShieldCheck, ArrowRight, Brain } from 'lucide-react';
import { Problem, UserProblemState } from '../../types/curriculum';
import { getTodayString, updateProblemState } from '../../services/storageService';

interface RevisionCenterProps {
  problems: Problem[];
  states: Record<string, UserProblemState>;
  onSelectProblem: (id: string) => void;
  onUpdateProblemState: (updates: Partial<UserProblemState>) => void;
}

export const RevisionCenter: React.FC<RevisionCenterProps> = ({
  problems,
  states,
  onSelectProblem,
  onUpdateProblemState,
}) => {
  const today = getTodayString();

  // Due queues
  const day3Due = problems.filter((p) => {
    const s = states[p.id];
    return s?.firstSolvedDate && !s.day3Status && s.day3Due && today >= s.day3Due;
  });

  const day7Due = problems.filter((p) => {
    const s = states[p.id];
    return s?.day3Status === 'Done' && !s.day7Status && s.day7Due && today >= s.day7Due;
  });

  const day30Due = problems.filter((p) => {
    const s = states[p.id];
    return s?.day7Status === 'Done' && !s.day30Status && s.day30Due && today >= s.day30Due;
  });

  const allDueCount = day3Due.length + day7Due.length + day30Due.length;

  const handleMarkReview = (problemId: string, stage: 'day3' | 'day7' | 'day30', status: 'Done' | 'Redo') => {
    const key = `${stage}Status` as 'day3Status' | 'day7Status' | 'day30Status';
    const next = updateProblemState(problemId, { [key]: status });
    onUpdateProblemState(next);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero: The 30-Day Blank Page Law */}
      <section className="bg-[#FFFCF6] border border-[#E7E1D6] rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-[#526B58] font-semibold tracking-wider uppercase font-mono">
              <ShieldCheck className="w-4 h-4 text-[#526B58]" />
              <span>Retention Protocol</span>
              <span aria-hidden="true">·</span>
              <span>Day 3 / 7 / 30 Cadence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#252A27] font-serif text-balance">
              The 30-Day Blank Page Law
            </h1>
            <p className="text-xs sm:text-sm text-[#565E59] leading-relaxed">
              If you cannot re-solve a problem on Day 30 on a blank page without compiler hints or looking at notes, you did not learn it. If a review fails, the Redo Rule restarts the cycle to today while preserving prior attempts.
            </p>
          </div>

          <div className="p-4 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl text-center shrink-0">
            <div className="text-2xl font-bold font-mono text-[#526B58]">{allDueCount}</div>
            <div className="text-xs text-[#565E59]">Reviews Due Today</div>
          </div>
        </div>
      </section>

      {/* 3 Review Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Day 3 Queue */}
        <div className="bg-[#FFFCF6] border border-[#E7E1D6] rounded-2xl p-5 space-y-4">
          <div className="border-b border-[#E7E1D6] pb-3 space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#252A27] font-serif">
                Day 3 Re-Solve
              </h3>
              <span className="text-xs font-mono font-bold text-[#526B58]">
                {day3Due.length} due
              </span>
            </div>
            <p className="text-[11px] text-[#565E59]">
              Recall the core approach and invariant without opening hints or solutions.
            </p>
          </div>

          <div className="space-y-3">
            {day3Due.length === 0 ? (
              <p className="text-xs text-[#8A928B] text-center py-6">
                No Day 3 reviews due today.
              </p>
            ) : (
              day3Due.map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl space-y-2 text-xs"
                >
                  <div className="font-bold text-[#252A27]">
                    {p.number}. {p.title}
                  </div>
                  <div className="text-[11px] text-[#8A928B]">
                    Due: {states[p.id]?.day3Due} · {p.topic}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => onSelectProblem(p.id)}
                      className="text-xs text-[#526B58] hover:underline font-semibold"
                    >
                      Open in IDE →
                    </button>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleMarkReview(p.id, 'day3', 'Redo')}
                        className="px-2 py-0.5 text-[11px] bg-[#C98F79]/15 text-[#C98F79] hover:bg-[#C98F79]/25 rounded font-semibold"
                      >
                        Redo
                      </button>
                      <button
                        onClick={() => handleMarkReview(p.id, 'day3', 'Done')}
                        className="px-2 py-0.5 text-[11px] bg-[#526B58] text-white hover:bg-[#435748] rounded font-semibold"
                      >
                        Pass
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Day 7 Queue */}
        <div className="bg-[#FFFCF6] border border-[#E7E1D6] rounded-2xl p-5 space-y-4">
          <div className="border-b border-[#E7E1D6] pb-3 space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#252A27] font-serif">
                Day 7 Re-Solve
              </h3>
              <span className="text-xs font-mono font-bold text-[#526B58]">
                {day7Due.length} due
              </span>
            </div>
            <p className="text-[11px] text-[#565E59]">
              Re-solve and state the algorithmic pattern trigger and complexity trade-offs.
            </p>
          </div>

          <div className="space-y-3">
            {day7Due.length === 0 ? (
              <p className="text-xs text-[#8A928B] text-center py-6">
                No Day 7 reviews due today.
              </p>
            ) : (
              day7Due.map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl space-y-2 text-xs"
                >
                  <div className="font-bold text-[#252A27]">
                    {p.number}. {p.title}
                  </div>
                  <div className="text-[11px] text-[#8A928B]">
                    Due: {states[p.id]?.day7Due} · {p.topic}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => onSelectProblem(p.id)}
                      className="text-xs text-[#526B58] hover:underline font-semibold"
                    >
                      Open in IDE →
                    </button>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleMarkReview(p.id, 'day7', 'Redo')}
                        className="px-2 py-0.5 text-[11px] bg-[#C98F79]/15 text-[#C98F79] hover:bg-[#C98F79]/25 rounded font-semibold"
                      >
                        Redo
                      </button>
                      <button
                        onClick={() => handleMarkReview(p.id, 'day7', 'Done')}
                        className="px-2 py-0.5 text-[11px] bg-[#526B58] text-white hover:bg-[#435748] rounded font-semibold"
                      >
                        Pass
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Day 30 Blank Page Queue */}
        <div className="bg-[#FFFCF6] border border-[#E7E1D6] rounded-2xl p-5 space-y-4">
          <div className="border-b border-[#E7E1D6] pb-3 space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#252A27] font-serif">
                Day 30 Blank Page Recall
              </h3>
              <span className="text-xs font-mono font-bold text-[#526B58]">
                {day30Due.length} due
              </span>
            </div>
            <p className="text-[11px] text-[#565E59]">
              Complete blank-page recall: no hints, no starter code, no solution lookup.
            </p>
          </div>

          <div className="space-y-3">
            {day30Due.length === 0 ? (
              <p className="text-xs text-[#8A928B] text-center py-6">
                No Day 30 milestones due today.
              </p>
            ) : (
              day30Due.map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl space-y-2 text-xs"
                >
                  <div className="font-bold text-[#252A27]">
                    {p.number}. {p.title}
                  </div>
                  <div className="text-[11px] text-[#8A928B]">
                    Due: {states[p.id]?.day30Due} · {p.topic}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => onSelectProblem(p.id)}
                      className="text-xs text-[#526B58] hover:underline font-semibold"
                    >
                      Recall on Blank IDE →
                    </button>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleMarkReview(p.id, 'day30', 'Redo')}
                        className="px-2 py-0.5 text-[11px] bg-[#C98F79]/15 text-[#C98F79] hover:bg-[#C98F79]/25 rounded font-semibold"
                      >
                        Redo
                      </button>
                      <button
                        onClick={() => handleMarkReview(p.id, 'day30', 'Done')}
                        className="px-2 py-0.5 text-[11px] bg-[#526B58] text-white hover:bg-[#435748] rounded font-semibold"
                      >
                        Mastered
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
