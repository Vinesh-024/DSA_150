import React, { useState, useEffect } from 'react';
import { PROBLEMS } from './data/curriculumData';
import { UserProblemState, SubmissionRecord, Problem } from './types/curriculum';
import {
  loadAllProblemStates,
  loadAllSubmissions,
  loadDailyRoutine,
  saveDailyRoutine,
  DailyRoutineState
} from './services/storageService';
import { Navbar } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { RoadmapExplorer } from './components/RoadmapExplorer';
import { ReSolveTracker } from './components/ReSolveTracker';
import { ProblemWorkspace } from './components/ProblemWorkspace';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { VideoInsightsView } from './components/VideoInsightsView';
import { CurriculumAuditModal } from './components/CurriculumAuditModal';
import { ToastProvider } from './components/Toast';
import { CommandPalette } from './components/CommandPalette';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [problemStates, setProblemStates] = useState<Record<string, UserProblemState>>({});
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [dailyRoutine, setDailyRoutine] = useState<DailyRoutineState>(loadDailyRoutine());
  const [activeProblemId, setActiveProblemId] = useState<string>('p-217');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Load persisted states on mount
  useEffect(() => {
    setProblemStates(loadAllProblemStates());
    setSubmissions(loadAllSubmissions());
    setDailyRoutine(loadDailyRoutine());

    const handleStatesUpdate = () => setProblemStates(loadAllProblemStates());
    const handleSubmissionsUpdate = () => setSubmissions(loadAllSubmissions());
    const handleRoutineUpdate = () => setDailyRoutine(loadDailyRoutine());

    window.addEventListener('neetcode_states_updated', handleStatesUpdate);
    window.addEventListener('neetcode_submissions_updated', handleSubmissionsUpdate);
    window.addEventListener('neetcode_routine_updated', handleRoutineUpdate);

    return () => {
      window.removeEventListener('neetcode_states_updated', handleStatesUpdate);
      window.removeEventListener('neetcode_submissions_updated', handleSubmissionsUpdate);
      window.removeEventListener('neetcode_routine_updated', handleRoutineUpdate);
    };
  }, []);

  const activeProblem: Problem =
    PROBLEMS.find((p) => p.id === activeProblemId) || PROBLEMS[0];

  const activeProblemIndex = PROBLEMS.findIndex((p) => p.id === activeProblem.id);

  const handleSelectProblem = (id: string) => {
    setActiveProblemId(id);
    setCurrentTab('workspace');
  };

  const handlePreviousProblem = () => {
    if (activeProblemIndex > 0) {
      setActiveProblemId(PROBLEMS[activeProblemIndex - 1].id);
    }
  };

  const handleNextProblem = () => {
    if (activeProblemIndex < PROBLEMS.length - 1) {
      setActiveProblemId(PROBLEMS[activeProblemIndex + 1].id);
    }
  };

  const handleUpdateDailyRoutine = (updates: Partial<DailyRoutineState>) => {
    const updated = { ...dailyRoutine, ...updates };
    setDailyRoutine(updated);
    saveDailyRoutine(updated);
  };

  // Re-solves due count
  const reSolvesDueCount = Object.values(problemStates).filter(
    (s) => s.status === 'resolve_due'
  ).length;

  const handleContinueLearning = () => {
    // Find first re-solve due, or first incomplete problem
    const dueProblem = PROBLEMS.find((p) => problemStates[p.id]?.status === 'resolve_due');
    if (dueProblem) {
      setActiveProblemId(dueProblem.id);
    } else {
      const nextUntouched = PROBLEMS.find((p) => !problemStates[p.id]?.day1Date);
      if (nextUntouched) {
        setActiveProblemId(nextUntouched.id);
      }
    }
    setCurrentTab('workspace');
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen bg-[var(--canvas-bg)] text-[var(--text-primary)] transition-colors duration-200 flex flex-col font-sans selection:bg-indigo-500/25 selection:text-indigo-400">
        <Navbar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          activeProblemTitle={activeProblem.title}
          onContinueLearning={handleContinueLearning}
          reSolvesDueCount={reSolvesDueCount}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          problems={PROBLEMS}
          onSelectProblem={handleSelectProblem}
          onNavigateTab={setCurrentTab}
        />

      <main className="flex-1 w-full">
        {currentTab === 'dashboard' && (
          <div className="w-full py-2 sm:py-4">
            <HomeDashboard
              problems={PROBLEMS}
              states={problemStates}
              onSelectProblem={handleSelectProblem}
              onNavigateTab={setCurrentTab}
              dailyRoutine={dailyRoutine}
              onUpdateDailyRoutine={handleUpdateDailyRoutine}
            />
          </div>
        )}

        {currentTab === 'roadmap' && (
          <div className="w-full py-2 sm:py-4">
            <RoadmapExplorer
              problems={PROBLEMS}
              states={problemStates}
              onSelectProblem={handleSelectProblem}
            />
          </div>
        )}

        {currentTab === 'tracker' && (
          <div className="w-full py-2 sm:py-4">
            <ReSolveTracker
              problems={PROBLEMS}
              states={problemStates}
              onSelectProblem={handleSelectProblem}
            />
          </div>
        )}

        {currentTab === 'workspace' && (
          <ProblemWorkspace
            problem={activeProblem}
            state={problemStates[activeProblem.id] || { problemId: activeProblem.id, status: 'not_started' } as any}
            onUpdateState={(updates) => {
              // triggers local storage update inside workspace component
            }}
            onPreviousProblem={activeProblemIndex > 0 ? handlePreviousProblem : undefined}
            onNextProblem={activeProblemIndex < PROBLEMS.length - 1 ? handleNextProblem : undefined}
          />
        )}

        {currentTab === 'analytics' && (
          <div className="w-full py-2 sm:py-4">
            <AnalyticsDashboard
              problems={PROBLEMS}
              states={problemStates}
              submissions={submissions}
            />
          </div>
        )}

        {currentTab === 'video-insights' && (
          <div className="w-full py-2 sm:py-4">
            <VideoInsightsView />
          </div>
        )}

        {currentTab === 'audit' && (
          <div className="w-full py-2 sm:py-4">
            <CurriculumAuditModal problems={PROBLEMS} />
          </div>
        )}
      </main>
        </div>
      </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
