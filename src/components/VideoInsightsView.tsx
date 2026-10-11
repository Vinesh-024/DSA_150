import React from 'react';
import { VIDEO_INSIGHTS_DATA } from '../data/videoInsightsData';
import { ExternalLink, Play, CheckCircle2, BookOpen, Clock, Brain, Flame, Target, Sparkles, Timer } from 'lucide-react';

export const VideoInsightsView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      
      {/* 1. Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Pedagogical Methodology</span>
            <span aria-hidden="true">·</span>
            <span>NeetCode 150 System</span>
            <span aria-hidden="true">·</span>
            <span>Evidence-Based Learning</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
            The Authoritative 6-Step Loop
          </h1>
        </div>
      </div>

      {/* 2. Large Midnight-Navy Analytical Hero Panel */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-gradient-to-br from-[#090F24] via-[#0B132E] to-[#070B18] p-6 sm:p-8 shadow-2xl text-white">
        <div className="absolute inset-0 bg-grid-midnight pointer-events-none opacity-40" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold tracking-wider uppercase">
              <Play className="w-4 h-4 fill-rose-500" />
              <span>YouTube Analysis & Curriculum Source</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              DSA in 12 Weeks: NeetCode 150 Re-Solve Methodology
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Synthesized by Nihar (<span className="text-indigo-400 font-mono">@niihaaarrrr</span>). The core truth: solving a problem once is not learning it. You only own an algorithm when you can rewrite it on a blank page on Day 30 without hesitation.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <a
              href="https://youtu.be/6Pr98DCNlV0"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 active:scale-95 text-white font-semibold text-xs rounded-xl shadow-lg border border-rose-400/30 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Watch Original Video (12m)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* 3. Supporting Cards: The 6-Step Loop Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            The 6-Step Loop (Execute this for every single problem)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[#0D1426] border border-slate-200/90 dark:border-slate-800/90 rounded-xl p-5 shadow-xs space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-mono text-xs font-bold">1</span>
              <span>20-Minute Timer (Blank Page)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Close the solution tab. Write whatever idea comes first, even brute force. Do not browse discussion or solution videos prematurely.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0D1426] border border-slate-200/90 dark:border-slate-800/90 rounded-xl p-5 shadow-xs space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-mono text-xs font-bold">2</span>
              <span>Stuck After 20 Mins? Idea Only</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Read the concept idea only (or watch the explanation portion), <strong className="text-slate-900 dark:text-white">never the code</strong>. Close it immediately and type the solution yourself.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0D1426] border border-slate-200/90 dark:border-slate-800/90 rounded-xl p-5 shadow-xs space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-mono text-xs font-bold">3</span>
              <span>Complexity Notation</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Write Big-O Time and Space complexity at the top of your code. Every problem, every time. Articulating the bounds cements pattern recognition.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0D1426] border border-slate-200/90 dark:border-slate-800/90 rounded-xl p-5 shadow-xs space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-mono text-xs font-bold">4</span>
              <span>Explore Second Approach</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              After Accepted, open the Solutions tab. Find an alternative approach and analyze trade-offs (e.g., iterative vs recursive, hash map space vs sorting time).
            </p>
          </div>

          <div className="bg-white dark:bg-[#0D1426] border border-slate-200/90 dark:border-slate-800/90 rounded-xl p-5 shadow-xs space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-mono text-xs font-bold">5</span>
              <span>Pattern & Trigger Line</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Label the algorithmic pattern and draft a one-line trigger: <em className="text-indigo-600 dark:text-indigo-400 font-medium">"When you see monotonic bounds, think binary search on answer."</em>
            </p>
          </div>

          <div className="bg-white dark:bg-[#0D1426] border border-slate-200/90 dark:border-slate-800/90 rounded-xl p-5 shadow-xs space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-mono text-xs font-bold">6</span>
              <span>2-Min Feynman & Day 3/7/30</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Explain the solution out loud in 2 minutes without looking. Then calendar re-solves on Day 3, Day 7, and Day 30 to lock memory into long-term recall.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
