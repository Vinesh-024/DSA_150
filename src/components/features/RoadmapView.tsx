import React, { useState } from 'react';
import { Search, Filter, CheckCircle2, RotateCcw, Clock, BookOpen, ExternalLink, ArrowRight } from 'lucide-react';
import { Problem, UserProblemState, Difficulty } from '../../types/curriculum';
import { ROADMAP_WEEKS } from '../../data/problemsData';

interface RoadmapViewProps {
  problems: Problem[];
  states: Record<string, UserProblemState>;
  onSelectProblem: (id: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  problems,
  states,
  onSelectProblem,
}) => {
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'not_started' | 'in_progress' | 'mastered' | 'needs_revision'>('all');

  const filteredProblems = problems.filter((p) => {
    if (selectedWeek !== 'all' && p.week !== selectedWeek) return false;
    if (selectedDifficulty !== 'all' && p.difficulty !== selectedDifficulty) return false;
    if (searchQuery.trim() && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) && !p.topic.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    const state = states[p.id];
    if (statusFilter === 'not_started' && state?.firstSolvedDate) return false;
    if (statusFilter === 'in_progress' && (!state?.firstSolvedDate || state?.status === 'mastered')) return false;
    if (statusFilter === 'mastered' && state?.status !== 'mastered') return false;
    if (statusFilter === 'needs_revision' && state?.status !== 'needs_revision') return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Overview */}
      <div className="bg-[#FFFCF6] border border-[#E7E1D6] rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#252A27] font-serif">
              12-Week NeetCode 150 Curriculum
            </h2>
            <p className="text-xs text-[#565E59]">
              Sequential pattern progression covering all high-frequency interview archetypes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#526B58] font-semibold">
              Showing {filteredProblems.length} of {problems.length} problems
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8A928B]" />
            <input
              type="text"
              placeholder="Search problem or pattern..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl text-xs text-[#252A27] focus:outline-none"
            />
          </div>

          {/* Week Filter */}
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl px-3 py-2 text-xs text-[#252A27] focus:outline-none"
          >
            <option value="all">All Weeks (1 - 12)</option>
            {ROADMAP_WEEKS.map((w) => (
              <option key={w.week} value={w.week}>
                Week {w.week}: {w.title}
              </option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as any)}
            className="bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl px-3 py-2 text-xs text-[#252A27] focus:outline-none"
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl px-3 py-2 text-xs text-[#252A27] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="not_started">Unattempted</option>
            <option value="in_progress">In Progress</option>
            <option value="needs_revision">Revision Due</option>
            <option value="mastered">Day 30 Mastered</option>
          </select>
        </div>
      </div>

      {/* Problems List Grid */}
      <div className="space-y-3">
        {filteredProblems.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#8A928B] bg-[#FFFCF6] rounded-2xl border border-[#E7E1D6]">
            No problems match your selected filters. Try adjusting the search query or week filter.
          </div>
        ) : (
          filteredProblems.map((p) => {
            const s = states[p.id];
            const isSolved = s?.firstSolvedDate !== null && s?.firstSolvedDate !== undefined;
            const isMastered = s?.status === 'mastered';
            const isDue = s?.status === 'needs_revision';

            return (
              <div
                key={p.id}
                onClick={() => onSelectProblem(p.id)}
                className="bg-[#FFFCF6] border border-[#E7E1D6] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-[#A8B9A0] transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-[#252A27]">
                      {p.number}. {p.title}
                    </span>
                    <span aria-hidden="true" className="text-[#8A928B]">·</span>
                    <span
                      className={`font-semibold ${
                        p.difficulty === 'Easy'
                          ? 'text-[#526B58]'
                          : p.difficulty === 'Medium'
                          ? 'text-[#C98F79]'
                          : 'text-rose-700'
                      }`}
                    >
                      {p.difficulty}
                    </span>
                    <span aria-hidden="true" className="text-[#8A928B]">·</span>
                    <span className="text-[#565E59]">Week {p.week}</span>
                    <span aria-hidden="true" className="text-[#8A928B]">·</span>
                    <span className="text-[#8A928B]">{p.topic}</span>
                  </div>

                  {s?.triggerLine ? (
                    <div className="text-[11px] text-[#526B58] font-mono italic">
                      Trigger: {s.triggerLine}
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {isMastered ? (
                    <span className="text-xs font-bold text-[#526B58] flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Day 30 Mastered</span>
                    </span>
                  ) : isDue ? (
                    <span className="text-xs font-bold text-[#C98F79] flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Revision Due</span>
                    </span>
                  ) : isSolved ? (
                    <span className="text-xs font-medium text-[#565E59] font-mono">
                      Solved (Day 3 due: {s?.day3Due || 'soon'})
                    </span>
                  ) : (
                    <span className="text-xs text-[#8A928B] font-mono">
                      Unattempted
                    </span>
                  )}

                  <button className="px-3 py-1.5 bg-[#F6F3EC] hover:bg-[#E7E1D6] text-xs font-semibold text-[#252A27] rounded-lg border border-[#E7E1D6] transition-colors flex items-center gap-1">
                    <span>Solve</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
