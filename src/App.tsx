import React, { useState, useEffect } from 'react';
import { PROBLEMS, getProblemById } from './data/problemsData';
import { UserProblemState, Problem } from './types/curriculum';
import {
  loadAllProblemStates,
  updateProblemState,
  getTodayString
} from './services/storageService';
import { Navbar } from './components/layout/Navbar';
import { BentoDashboard } from './components/features/BentoDashboard';
import { RoadmapView } from './components/features/RoadmapView';
import { CodingWorkspace } from './components/features/CodingWorkspace';
import { RevisionCenter } from './components/features/RevisionCenter';
import { CSFundamentalsView } from './components/features/CSFundamentalsView';
import { SystemDesignView } from './components/features/SystemDesignView';
import { JournalView } from './components/features/JournalView';
import { AnalyticsView } from './components/features/AnalyticsView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [problemStates, setProblemStates] = useState<Record<string, UserProblemState>>({});
  const [activeProblemId, setActiveProblemId] = useState<string>('p-1');

  // Load problem states on mount and subscribe to updates
  useEffect(() => {
    setProblemStates(loadAllProblemStates());

    const handleStatesUpdate = () => setProblemStates(loadAllProblemStates());
    const handleDataCleared = () => {
      setProblemStates(loadAllProblemStates());
      setActiveProblemId('p-1');
    };

    window.addEventListener('cozy_states_updated', handleStatesUpdate);
    window.addEventListener('cozy_data_cleared', handleDataCleared);

    return () => {
      window.removeEventListener('cozy_states_updated', handleStatesUpdate);
      window.removeEventListener('cozy_data_cleared', handleDataCleared);
    };
  }, []);

  const activeProblem: Problem =
    getProblemById(activeProblemId) || PROBLEMS[0];

  const handleSelectProblem = (id: string) => {
    setActiveProblemId(id);
    setCurrentTab('workspace');
  };

  const handleUpdateProblemState = (updates: Partial<UserProblemState>) => {
    const next = updateProblemState(activeProblem.id, updates);
    setProblemStates((prev) => ({ ...prev, [activeProblem.id]: next }));
  };

  // Revisions due count
  const revisionsDueCount = Object.values(problemStates).filter(
    (s) => s.status === 'needs_revision'
  ).length;

  const handleContinueLearning = () => {
    const dueProblem = PROBLEMS.find((p) => problemStates[p.id]?.status === 'needs_revision');
    if (dueProblem) {
      setActiveProblemId(dueProblem.id);
    } else {
      const nextUnstarted = PROBLEMS.find((p) => !problemStates[p.id]?.firstSolvedDate);
      if (nextUnstarted) {
        setActiveProblemId(nextUnstarted.id);
      }
    }
    setCurrentTab('workspace');
  };

  return (
    <div className="min-h-screen bg-[#F6F3EC] text-[#252A27] flex flex-col font-sans selection:bg-[#A8B9A0]/40">
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onContinueLearning={handleContinueLearning}
        revisionsDueCount={revisionsDueCount}
      />

      <main className="flex-1 w-full">
        {currentTab === 'dashboard' && (
          <div className="p-4 sm:p-6 lg:p-8">
            <BentoDashboard
              problems={PROBLEMS}
              states={problemStates}
              onSelectProblem={handleSelectProblem}
              onNavigateTab={setCurrentTab}
            />
          </div>
        )}

        {currentTab === 'roadmap' && (
          <div className="p-4 sm:p-6 lg:p-8">
            <RoadmapView
              problems={PROBLEMS}
              states={problemStates}
              onSelectProblem={handleSelectProblem}
            />
          </div>
        )}

        {currentTab === 'workspace' && (
          <CodingWorkspace
            problem={activeProblem}
            problemState={problemStates[activeProblem.id] || { problemId: activeProblem.id, status: 'not_started' } as any}
            onUpdateProblemState={handleUpdateProblemState}
            onNavigateRoadmap={() => setCurrentTab('roadmap')}
          />
        )}

        {currentTab === 'revisions' && (
          <div className="p-4 sm:p-6 lg:p-8">
            <RevisionCenter
              problems={PROBLEMS}
              states={problemStates}
              onSelectProblem={handleSelectProblem}
              onUpdateProblemState={handleUpdateProblemState}
            />
          </div>
        )}

        {currentTab === 'fundamentals' && (
          <div className="p-4 sm:p-6 lg:p-8">
            <CSFundamentalsView />
          </div>
        )}

        {currentTab === 'system-design' && (
          <div className="p-4 sm:p-6 lg:p-8">
            <SystemDesignView />
          </div>
        )}

        {currentTab === 'journal' && (
          <div className="p-4 sm:p-6 lg:p-8">
            <JournalView
              problems={PROBLEMS}
              states={problemStates}
              onSelectProblem={handleSelectProblem}
            />
          </div>
        )}

        {currentTab === 'analytics' && (
          <div className="p-4 sm:p-6 lg:p-8">
            <AnalyticsView
              problems={PROBLEMS}
              states={problemStates}
              onSelectProblem={handleSelectProblem}
              onNavigateTab={setCurrentTab}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      {currentTab !== 'workspace' && (
        <footer className="border-t border-[#E7E1D6] bg-[#FFFCF6] px-6 py-4 text-center text-xs text-[#8A928B]">
          <span>Cozy Code Corner · Warm Minimalist Study Room · Built for Deep Algorithmic Understanding</span>
        </footer>
      )}
    </div>
  );
}
