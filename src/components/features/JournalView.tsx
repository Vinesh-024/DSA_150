import React, { useState } from 'react';
import { BookOpen, Search, Sparkles, Terminal, FileText, CheckCircle2 } from 'lucide-react';
import { Problem, UserProblemState } from '../../types/curriculum';

interface JournalViewProps {
  problems: Problem[];
  states: Record<string, UserProblemState>;
  onSelectProblem: (id: string) => void;
}

export const JournalView: React.FC<JournalViewProps> = ({
  problems,
  states,
  onSelectProblem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Collect all problems with trigger lines or notes
  const notesEntries = problems.filter((p) => {
    const s = states[p.id];
    return s && (s.triggerLine || s.notes || s.pattern);
  });

  const filteredEntries = notesEntries.filter((p) => {
    const s = states[p.id];
    const text = `${p.title} ${p.topic} ${s?.triggerLine || ''} ${s?.pattern || ''} ${s?.notes || ''}`.toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-[#FFFCF6] border border-[#E7E1D6] rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#252A27] font-serif">
              Personal Study Journal & Trigger Line Directory
            </h2>
            <p className="text-xs text-[#565E59]">
              Your compiled pattern triggers, algorithmic invariants, and complexity comparisons synthesized during practice.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8A928B]" />
            <input
              type="text"
              placeholder="Search triggers or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl text-xs text-[#252A27] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Trigger Lines Grid */}
      <div className="space-y-3">
        {filteredEntries.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#8A928B] bg-[#FFFCF6] rounded-2xl border border-[#E7E1D6]">
            No reflections recorded yet. After solving a problem in the Workspace, articulate your Trigger Line and complexity notes in the 6-Step Loop tab to build your recall library.
          </div>
        ) : (
          filteredEntries.map((p) => {
            const s = states[p.id];
            return (
              <div
                key={p.id}
                className="bg-[#FFFCF6] border border-[#E7E1D6] rounded-xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-[#252A27]">
                      {p.number}. {p.title}
                    </span>
                    <span aria-hidden="true" className="text-[#8A928B]">·</span>
                    <span className="text-[#526B58] font-semibold">{p.topic}</span>
                    <span aria-hidden="true" className="text-[#8A928B]">·</span>
                    <span className="text-[#8A928B]">Week {p.week}</span>
                  </div>

                  <button
                    onClick={() => onSelectProblem(p.id)}
                    className="text-xs text-[#526B58] hover:underline font-semibold"
                  >
                    Open Workspace →
                  </button>
                </div>

                {s?.triggerLine && (
                  <div className="p-3 bg-[#A8B9A0]/15 border border-[#A8B9A0]/40 rounded-xl">
                    <div className="text-[10px] uppercase font-bold text-[#526B58] font-mono">
                      Trigger Line (When you see X, think Y)
                    </div>
                    <div className="text-xs font-semibold text-[#252A27] mt-0.5">
                      {s.triggerLine}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {s?.pattern && (
                    <div className="p-2.5 bg-[#F6F3EC] border border-[#E7E1D6] rounded-lg">
                      <span className="text-[10px] text-[#8A928B] uppercase block">Pattern</span>
                      <span className="font-semibold text-[#252A27]">{s.pattern}</span>
                    </div>
                  )}
                  {s?.timeComplexity && (
                    <div className="p-2.5 bg-[#F6F3EC] border border-[#E7E1D6] rounded-lg">
                      <span className="text-[10px] text-[#8A928B] uppercase block">Time Complexity</span>
                      <span className="font-mono font-semibold text-[#252A27]">{s.timeComplexity}</span>
                    </div>
                  )}
                  {s?.spaceComplexity && (
                    <div className="p-2.5 bg-[#F6F3EC] border border-[#E7E1D6] rounded-lg">
                      <span className="text-[10px] text-[#8A928B] uppercase block">Space Complexity</span>
                      <span className="font-mono font-semibold text-[#252A27]">{s.spaceComplexity}</span>
                    </div>
                  )}
                </div>

                {s?.notes && (
                  <div className="text-xs text-[#565E59] leading-relaxed pt-1">
                    <strong className="text-[#252A27]">Study Notes: </strong>{s.notes}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
