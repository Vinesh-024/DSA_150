import React, { useState, useMemo } from 'react';
import { Problem, UserProblemState } from '../types/curriculum';
import {
  Brain,
  Sparkles,
  ChevronRight,
  Target,
  Play,
  RotateCw,
  Pause,
  Layers,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';

interface ConcentricNetworkVisualizationProps {
  problems: Problem[];
  states: Record<string, UserProblemState>;
  onSelectProblem?: (problemId: string) => void;
  onNavigateTab?: (tab: string) => void;
  onFilterTopicInRoadmap?: (topic: string) => void;
}

interface TopicCluster {
  id: string;
  name: string;
  shortName: string;
  ring: 'foundation' | 'structured' | 'advanced';
  ringRadius: number;
  angleDeg: number;
  color: string;
  glowColor: string;
}

// 17 Topics grouped into 3 concentric orbits
const TOPIC_CLUSTERS: TopicCluster[] = [
  // Ring 1: Foundations (Inner orbit, r = 85)
  { id: 'Arrays & Hashing', name: 'Arrays & Hashing', shortName: 'Arrays', ring: 'foundation', ringRadius: 88, angleDeg: 30, color: '#6366F1', glowColor: 'rgba(99,102,241,0.5)' },
  { id: 'Two Pointers', name: 'Two Pointers', shortName: '2-Ptr', ring: 'foundation', ringRadius: 88, angleDeg: 120, color: '#38BDF8', glowColor: 'rgba(56,189,248,0.5)' },
  { id: 'Sliding Window', name: 'Sliding Window', shortName: 'Window', ring: 'foundation', ringRadius: 88, angleDeg: 210, color: '#34D399', glowColor: 'rgba(52,211,153,0.5)' },
  { id: 'Stack', name: 'Stack', shortName: 'Stack', ring: 'foundation', ringRadius: 88, angleDeg: 300, color: '#F472B6', glowColor: 'rgba(244,114,182,0.5)' },

  // Ring 2: Structured & Hierarchies (Mid orbit, r = 155)
  { id: 'Binary Search', name: 'Binary Search', shortName: 'B-Search', ring: 'structured', ringRadius: 155, angleDeg: 15, color: '#818CF8', glowColor: 'rgba(129,140,248,0.45)' },
  { id: 'Linked List', name: 'Linked List', shortName: 'List', ring: 'structured', ringRadius: 155, angleDeg: 85, color: '#2DD4BF', glowColor: 'rgba(45,212,191,0.45)' },
  { id: 'Trees', name: 'Trees', shortName: 'Trees', ring: 'structured', ringRadius: 155, angleDeg: 155, color: '#10B981', glowColor: 'rgba(16,185,129,0.45)' },
  { id: 'Tries', name: 'Tries', shortName: 'Tries', ring: 'structured', ringRadius: 155, angleDeg: 225, color: '#FBBF24', glowColor: 'rgba(251,191,36,0.45)' },
  { id: 'Heap / Priority Queue', name: 'Heap / Priority Queue', shortName: 'Heaps', ring: 'structured', ringRadius: 155, angleDeg: 295, color: '#FB923C', glowColor: 'rgba(251,146,60,0.45)' },

  // Ring 3: Advanced Optimization & Graphs (Outer orbit, r = 225)
  { id: 'Backtracking', name: 'Backtracking', shortName: 'B-Track', ring: 'advanced', ringRadius: 225, angleDeg: 0, color: '#E879F9', glowColor: 'rgba(232,121,249,0.4)' },
  { id: 'Graphs', name: 'Graphs', shortName: 'Graphs', ring: 'advanced', ringRadius: 225, angleDeg: 45, color: '#60A5FA', glowColor: 'rgba(96,165,250,0.4)' },
  { id: 'Advanced Graphs', name: 'Advanced Graphs', shortName: 'Adv-G', ring: 'advanced', ringRadius: 225, angleDeg: 90, color: '#38BDF8', glowColor: 'rgba(56,189,248,0.4)' },
  { id: '1-D Dynamic Programming', name: '1-D Dynamic Programming', shortName: '1D DP', ring: 'advanced', ringRadius: 225, angleDeg: 135, color: '#C084FC', glowColor: 'rgba(192,132,252,0.4)' },
  { id: '2-D Dynamic Programming', name: '2-D Dynamic Programming', shortName: '2D DP', ring: 'advanced', ringRadius: 225, angleDeg: 180, color: '#A855F7', glowColor: 'rgba(168,85,247,0.4)' },
  { id: 'Greedy', name: 'Greedy', shortName: 'Greedy', ring: 'advanced', ringRadius: 225, angleDeg: 225, color: '#34D399', glowColor: 'rgba(52,211,153,0.4)' },
  { id: 'Intervals', name: 'Intervals', shortName: 'Intervals', ring: 'advanced', ringRadius: 225, angleDeg: 270, color: '#F87171', glowColor: 'rgba(248,113,113,0.4)' },
  { id: 'Math & Geometry', name: 'Math & Geometry', shortName: 'Math', ring: 'advanced', ringRadius: 225, angleDeg: 315, color: '#FCD34D', glowColor: 'rgba(252,211,77,0.4)' },
];

export const ConcentricNetworkVisualization: React.FC<ConcentricNetworkVisualizationProps> = ({
  problems,
  states,
  onSelectProblem,
  onNavigateTab,
  onFilterTopicInRoadmap,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>('Arrays & Hashing');
  const [hoveredTopicId, setHoveredTopicId] = useState<string | null>(null);
  const [activeRingFilter, setActiveRingFilter] = useState<'all' | 'foundation' | 'structured' | 'advanced'>('all');
  const [isRotating, setIsRotating] = useState<boolean>(true);

  // Calculate statistics
  const totalProblems = problems.length; // 150
  const totalSolved = useMemo(() => {
    return Object.values(states).filter((s) => s.day1Date !== null).length;
  }, [states]);

  const totalMastered = useMemo(() => {
    return Object.values(states).filter((s) => s.status === 'mastered').length;
  }, [states]);

  const overallMasteryPct = Math.round((totalSolved / (totalProblems || 1)) * 100);

  // Active topic stats
  const activeCluster = useMemo(() => {
    return TOPIC_CLUSTERS.find((c) => c.id === (hoveredTopicId || selectedTopicId)) || TOPIC_CLUSTERS[0];
  }, [hoveredTopicId, selectedTopicId]);

  const activeTopicProblems = useMemo(() => {
    return problems.filter((p) => p.topic === activeCluster.id);
  }, [problems, activeCluster]);

  const activeTopicSolved = useMemo(() => {
    return activeTopicProblems.filter((p) => states[p.id]?.day1Date !== null).length;
  }, [activeTopicProblems, states]);

  const activeTopicMastered = useMemo(() => {
    return activeTopicProblems.filter((p) => states[p.id]?.status === 'mastered').length;
  }, [activeTopicProblems, states]);

  const activeTopicPct = Math.round((activeTopicSolved / (activeTopicProblems.length || 1)) * 100);

  // Center coordinate of SVG (560 x 560 viewBox)
  const center = 280;

  // Interconnection links between topics that share algorithmic principles
  const networkEdges = [
    { from: 'Arrays & Hashing', to: 'Two Pointers' },
    { from: 'Two Pointers', to: 'Sliding Window' },
    { from: 'Arrays & Hashing', to: 'Binary Search' },
    { from: 'Stack', to: 'Binary Search' },
    { from: 'Linked List', to: 'Trees' },
    { from: 'Trees', to: 'Tries' },
    { from: 'Trees', to: 'Heap / Priority Queue' },
    { from: 'Trees', to: 'Backtracking' },
    { from: 'Backtracking', to: 'Graphs' },
    { from: 'Graphs', to: 'Advanced Graphs' },
    { from: 'Backtracking', to: '1-D Dynamic Programming' },
    { from: '1-D Dynamic Programming', to: '2-D Dynamic Programming' },
    { from: 'Greedy', to: '1-D Dynamic Programming' },
    { from: 'Two Pointers', to: 'Intervals' },
  ];

  return (
    <div className="flex flex-col xl:flex-row items-center justify-between gap-6 w-full">
      {/* Interactive Concentric SVG Canvas */}
      <div className="relative flex items-center justify-center shrink-0 w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] lg:w-[480px] lg:h-[480px]">
        {/* Ambient background glows */}
        <div className="absolute inset-0 bg-radial-midnight pointer-events-none rounded-full" />
        <div
          className="absolute inset-16 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: activeCluster.color }}
        />

        <svg
          viewBox="0 0 560 560"
          className="w-full h-full select-none"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Radial glow filter */}
            <filter id="nodeGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="orbitStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#312E81" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="radarBeam" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Background Concentric Radar Rings */}
          {/* Ring 1: Foundational (r=88) */}
          <circle
            cx={center}
            cy={center}
            r={88}
            fill="none"
            stroke={activeRingFilter === 'all' || activeRingFilter === 'foundation' ? 'rgba(99, 102, 241, 0.28)' : 'rgba(99, 102, 241, 0.08)'}
            strokeWidth="1.2"
            strokeDasharray="3 4"
          />
          {/* Ring 2: Structured (r=155) */}
          <circle
            cx={center}
            cy={center}
            r={155}
            fill="none"
            stroke={activeRingFilter === 'all' || activeRingFilter === 'structured' ? 'rgba(56, 189, 248, 0.24)' : 'rgba(56, 189, 248, 0.06)'}
            strokeWidth="1.2"
            strokeDasharray="4 6"
          />
          {/* Ring 3: Advanced (r=225) */}
          <circle
            cx={center}
            cy={center}
            r={225}
            fill="none"
            stroke={activeRingFilter === 'all' || activeRingFilter === 'advanced' ? 'rgba(168, 85, 247, 0.22)' : 'rgba(168, 85, 247, 0.05)'}
            strokeWidth="1.2"
            strokeDasharray="6 8"
          />

          {/* Outer Boundary Reticle Ring */}
          <circle
            cx={center}
            cy={center}
            r={265}
            fill="none"
            stroke="rgba(148, 163, 184, 0.08)"
            strokeWidth="1"
          />

          {/* Concentric Crosshair Axis Lines */}
          <line x1={center} y1={25} x2={center} y2={535} stroke="rgba(148, 163, 184, 0.05)" strokeWidth="1" />
          <line x1={25} y1={center} x2={535} y2={center} stroke="rgba(148, 163, 184, 0.05)" strokeWidth="1" />

          {/* Subtle Rotating Sweeper Ray */}
          {isRotating && (
            <g className="animate-spin-orbit" style={{ transformOrigin: '280px 280px' }}>
              <line
                x1={center}
                y1={center}
                x2={center + 245}
                y2={center}
                stroke="url(#radarBeam)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle
                cx={center + 245}
                cy={center}
                r={2}
                fill="#38BDF8"
                opacity="0.7"
              />
            </g>
          )}

          {/* Inter-node Relationship Edges */}
          {networkEdges.map((edge, idx) => {
            const sourceNode = TOPIC_CLUSTERS.find((c) => c.id === edge.from);
            const targetNode = TOPIC_CLUSTERS.find((c) => c.id === edge.to);
            if (!sourceNode || !targetNode) return null;

            const radS = (sourceNode.angleDeg * Math.PI) / 180;
            const radT = (targetNode.angleDeg * Math.PI) / 180;
            const x1 = center + sourceNode.ringRadius * Math.cos(radS);
            const y1 = center + sourceNode.ringRadius * Math.sin(radS);
            const x2 = center + targetNode.ringRadius * Math.cos(radT);
            const y2 = center + targetNode.ringRadius * Math.sin(radT);

            const isEdgeHighlighted =
              sourceNode.id === activeCluster.id || targetNode.id === activeCluster.id;

            return (
              <line
                key={`edge-${idx}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isEdgeHighlighted ? '#38BDF8' : 'rgba(148, 163, 184, 0.12)'}
                strokeWidth={isEdgeHighlighted ? 1.5 : 0.8}
                strokeDasharray={isEdgeHighlighted ? 'none' : '2 3'}
                className="transition-all duration-300"
              />
            );
          })}

          {/* Center Kernel Node: NeetCode 150 Core Progress */}
          <g
            className="cursor-pointer group"
            onClick={() => onNavigateTab && onNavigateTab('roadmap')}
          >
            {/* Center Outer Glow Ring */}
            <circle
              cx={center}
              cy={center}
              r={46}
              fill="#080E24"
              stroke="rgba(99, 102, 241, 0.35)"
              strokeWidth="1.5"
              filter="url(#coreGlow)"
            />
            {/* Circular Progress Arc */}
            <circle
              cx={center}
              cy={center}
              r={40}
              fill="none"
              stroke="rgba(30, 41, 59, 0.8)"
              strokeWidth="4"
            />
            <circle
              cx={center}
              cy={center}
              r={40}
              fill="none"
              stroke="#6366F1"
              strokeWidth="4"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * overallMasteryPct) / 100}
              strokeLinecap="round"
              transform={`rotate(-90 ${center} ${center})`}
              className="transition-all duration-700"
            />
            {/* Center Content */}
            <circle
              cx={center}
              cy={center}
              r={34}
              fill="#0D1533"
              className="group-hover:fill-[#15214E] transition-colors"
            />
            <text
              x={center}
              y={center - 5}
              textAnchor="middle"
              className="fill-white font-mono font-bold text-base tabular-nums"
            >
              {overallMasteryPct}%
            </text>
            <text
              x={center}
              y={center + 12}
              textAnchor="middle"
              className="fill-slate-400 font-sans text-[9px] uppercase tracking-wider font-semibold"
            >
              {totalSolved}/{totalProblems}
            </text>
          </g>

          {/* Topic Cluster Nodes on Concentric Rings */}
          {TOPIC_CLUSTERS.map((cluster) => {
            const rad = (cluster.angleDeg * Math.PI) / 180;
            const cx = center + cluster.ringRadius * Math.cos(rad);
            const cy = center + cluster.ringRadius * Math.sin(rad);

            const clusterProblems = problems.filter((p) => p.topic === cluster.id);
            const clusterSolved = clusterProblems.filter((p) => states[p.id]?.day1Date !== null).length;
            const clusterMastered = clusterProblems.filter((p) => states[p.id]?.status === 'mastered').length;
            const isCompleted = clusterSolved === clusterProblems.length && clusterProblems.length > 0;
            const isSelected = cluster.id === activeCluster.id;

            const isDimmed =
              activeRingFilter !== 'all' && activeRingFilter !== cluster.ring;

            const nodeRadius = isSelected ? 17 : 13;

            return (
              <g
                key={cluster.id}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => setSelectedTopicId(cluster.id)}
                onMouseEnter={() => setHoveredTopicId(cluster.id)}
                onMouseLeave={() => setHoveredTopicId(null)}
                opacity={isDimmed ? 0.25 : 1}
              >
                {/* Ray line connecting from center orbit */}
                <line
                  x1={center}
                  y1={center}
                  x2={cx}
                  y2={cy}
                  stroke={isSelected ? cluster.color : 'rgba(148, 163, 184, 0.08)'}
                  strokeWidth={isSelected ? 1.2 : 0.6}
                  strokeDasharray="2 4"
                />

                {/* Node Glow Halo */}
                {isSelected && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={nodeRadius + 8}
                    fill="none"
                    stroke={cluster.color}
                    strokeWidth="1.5"
                    strokeOpacity="0.5"
                    filter="url(#nodeGlow)"
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={nodeRadius}
                  fill={isSelected ? '#15214E' : '#0B132B'}
                  stroke={isSelected ? cluster.color : isCompleted ? '#10B981' : clusterSolved > 0 ? '#38BDF8' : 'rgba(148, 163, 184, 0.35)'}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  className="transition-all duration-200"
                />

                {/* Status Dot / Count */}
                <text
                  x={cx}
                  y={cy + 3.5}
                  textAnchor="middle"
                  className="font-mono text-[10px] font-bold select-none tabular-nums"
                  fill={isSelected ? '#FFFFFF' : clusterSolved > 0 ? cluster.color : '#94A3B8'}
                >
                  {clusterSolved > 0 ? clusterSolved : clusterProblems.length}
                </text>

                {/* Label text placed beside node */}
                <text
                  x={cx + (cluster.angleDeg > 90 && cluster.angleDeg < 270 ? -nodeRadius - 6 : nodeRadius + 6)}
                  y={cy + 3}
                  textAnchor={cluster.angleDeg > 90 && cluster.angleDeg < 270 ? 'end' : 'start'}
                  className={`font-sans text-[10px] tracking-tight transition-colors select-none ${
                    isSelected ? 'fill-white font-semibold' : 'fill-slate-400 font-normal hover:fill-slate-200'
                  }`}
                >
                  {cluster.shortName}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Orbit animation pause/play control in corner */}
        <button
          onClick={() => setIsRotating(!isRotating)}
          className="absolute bottom-1 right-1 p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors text-[10px] flex items-center gap-1 shadow-sm"
          title={isRotating ? 'Pause orbit animation' : 'Start orbit animation'}
        >
          {isRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          <span className="hidden sm:inline font-mono">{isRotating ? 'Pause' : 'Play'}</span>
        </button>
      </div>

      {/* Right HUD: Active Topic Telemetry & Drilldown */}
      <div className="flex-1 w-full max-w-lg bg-[#080E21]/90 border border-slate-800/90 rounded-xl p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
        <div className="space-y-4">
          {/* Header Row with Ring Filter Chips */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: activeCluster.color }}
              />
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                {activeCluster.ring} Orbit
              </span>
            </div>

            {/* Orbit selector tabs */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-900/90 rounded-lg border border-slate-800 text-[10px] font-medium">
              {(['all', 'foundation', 'structured', 'advanced'] as const).map((ring) => (
                <button
                  key={ring}
                  onClick={() => setActiveRingFilter(ring)}
                  className={`px-2 py-0.5 rounded capitalize transition-colors ${
                    activeRingFilter === ring
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {ring === 'all' ? 'All Orbits' : ring}
                </button>
              ))}
            </div>
          </div>

          {/* Active Topic Title & Headline */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                {activeCluster.name}
              </h3>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-800/80 text-cyan-400 tabular-nums">
                {activeTopicPct}% Completed
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {activeTopicProblems.length} NeetCode problems curated across foundational patterns, edge cases, and recursive tree/graph invariants.
            </p>
          </div>

          {/* Micro Telemetry Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="p-2.5 bg-[#0C142E] rounded-lg border border-slate-800/60">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Pool</div>
              <div className="text-base font-bold text-white font-mono tabular-nums">
                {activeTopicProblems.length}
              </div>
            </div>
            <div className="p-2.5 bg-[#0C142E] rounded-lg border border-slate-800/60">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Day 1 Solved</div>
              <div className="text-base font-bold text-emerald-400 font-mono tabular-nums">
                {activeTopicSolved}
              </div>
            </div>
            <div className="p-2.5 bg-[#0C142E] rounded-lg border border-slate-800/60">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Mastered (30d)</div>
              <div className="text-base font-bold text-indigo-400 font-mono tabular-nums">
                {activeTopicMastered}
              </div>
            </div>
          </div>

          {/* Quick Problem Preview in Topic */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
              <span>Curated Problems in {activeCluster.shortName}</span>
              <span className="text-[10px] text-slate-500 font-mono">Top Candidates</span>
            </div>
            <div className="space-y-1 max-h-36 overflow-y-auto pr-1 midnight-scroll">
              {activeTopicProblems.slice(0, 4).map((p) => {
                const s = states[p.id];
                const isSolved = s?.day1Date !== null;
                const isMastered = s?.status === 'mastered';
                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectProblem && onSelectProblem(p.id)}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/50 cursor-pointer transition-colors text-xs group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-[10px] text-slate-500 w-8">
                        #{p.number}
                      </span>
                      <span className="text-slate-200 group-hover:text-white truncate font-medium">
                        {p.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                          p.difficulty === 'Easy'
                            ? 'text-emerald-400 bg-emerald-950/40'
                            : p.difficulty === 'Medium'
                            ? 'text-amber-400 bg-amber-950/40'
                            : 'text-rose-400 bg-rose-950/40'
                        }`}
                      >
                        {p.difficulty}
                      </span>
                      {isMastered ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                      ) : isSolved ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 transition-colors" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              if (onFilterTopicInRoadmap) {
                onFilterTopicInRoadmap(activeCluster.id);
              } else if (onNavigateTab) {
                onNavigateTab('roadmap');
              }
            }}
            className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Explore in Roadmap</span>
          </button>

          {activeTopicProblems[0] && (
            <button
              onClick={() => onSelectProblem && onSelectProblem(activeTopicProblems[0].id)}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 rounded-lg transition-all shadow-md flex items-center gap-1.5"
            >
              <span>Practice First Problem</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
