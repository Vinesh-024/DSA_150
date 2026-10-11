import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Activity, Zap, TrendingUp, Info } from 'lucide-react';

interface ComplexityVisualizerProps {
  currentTheoretical?: {
    time: string;
    space: string;
  };
}

export const ComplexityVisualizer: React.FC<ComplexityVisualizerProps> = ({
  currentTheoretical = { time: 'O(n)', space: 'O(1)' }
}) => {
  const [inputScale, setInputScale] = useState<number>(100);

  // Generate synthetic operation curve based on input size n
  const data = [10, 25, 50, 100, 200, 500, 1000].map((n) => {
    return {
      n: `n=${n}`,
      'O(1)': 1,
      'O(log n)': Math.round(Math.log2(n) * 10) / 10,
      'O(n)': n,
      'O(n log n)': Math.round(n * Math.log2(n)),
      'O(n²)': Math.min(n * n, 50000), // capped for visualization scale
    };
  });

  const getOperationsForScale = (complexity: string, n: number) => {
    const c = complexity.toLowerCase();
    if (c.includes('n^2') || c.includes('n²')) return n * n;
    if (c.includes('n log n') || c.includes('nlogn')) return Math.round(n * Math.log2(n));
    if (c.includes('log n') || c.includes('logn')) return Math.round(Math.log2(n));
    if (c.includes('o(n)') || c.includes('linear')) return n;
    return 1;
  };

  const opsEstimated = getOperationsForScale(currentTheoretical.time, inputScale);

  return (
    <div className="bg-[#0D121D] border border-slate-800 rounded-xl p-4 space-y-4 text-xs font-sans">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400" />
          <span className="font-bold text-white text-sm">Algorithmic Complexity Growth</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 font-mono font-semibold text-[11px]">
            Time: {currentTheoretical.time}
          </span>
          <span className="px-2 py-0.5 rounded bg-violet-950/80 border border-violet-700/50 text-violet-300 font-mono font-semibold text-[11px]">
            Space: {currentTheoretical.space}
          </span>
        </div>
      </div>

      <p className="text-slate-400 text-[11px] leading-relaxed">
        Theoretical operations curve vs input size $N$. Observe how quadratic approaches explode rapidly while linear & logarithmic maintain constant throughput.
      </p>

      {/* Interactive slider for N */}
      <div className="bg-[#111724] border border-slate-800/80 rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-medium">Simulated Input Size ($N$):</span>
          <span className="text-cyan-400 font-mono font-bold">{inputScale.toLocaleString()} elements</span>
        </div>
        <input
          type="range"
          min="10"
          max="5000"
          step="50"
          value={inputScale}
          onChange={(e) => setInputScale(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
          <span>Estimated Ops: <strong className="text-emerald-400">{opsEstimated.toLocaleString()} ops</strong></span>
          <span className="text-slate-400">Target budget: &lt; 10⁸ ops/sec</span>
        </div>
      </div>

      {/* Complexity Curves Graph */}
      <div className="h-44 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <XAxis dataKey="n" stroke="#64748B" fontSize={10} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={10} tickLine={false} scale="log" domain={[1, 50000]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                borderColor: '#334155',
                borderRadius: '8px',
                fontSize: '11px',
                fontFamily: 'monospace',
                color: '#E2E8F0',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }} />
            <Line type="monotone" dataKey="O(1)" stroke="#10B981" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="O(log n)" stroke="#38BDF8" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="O(n)" stroke="#818CF8" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="O(n log n)" stroke="#F59E0B" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="O(n²)" stroke="#F43F5E" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-start gap-2 text-[10px] text-slate-500 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <span>Theoretical estimates represent asymptotic worst-case bounds. Real execution runtime also reflects cache locality, branching, and VM instruction dispatch.</span>
      </div>
    </div>
  );
};
