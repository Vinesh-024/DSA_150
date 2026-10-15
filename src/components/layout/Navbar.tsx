import React, { useState } from 'react';
import { Clock, Database, Download, Upload, Trash2, CheckCircle, Coffee, RefreshCw } from 'lucide-react';
import { exportAllDataAsJson, importAllDataFromJson, clearAllData } from '../../services/storageService';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onContinueLearning: () => void;
  revisionsDueCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onContinueLearning,
  revisionsDueCount,
}) => {
  const [showDataModal, setShowDataModal] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: 'Study Room' },
    { id: 'roadmap', label: '12-Week Roadmap' },
    { id: 'workspace', label: 'Workspace' },
    { id: 'revisions', label: 'Revision Center' },
    { id: 'fundamentals', label: 'CS Fundamentals' },
    { id: 'system-design', label: 'System Design' },
    { id: 'journal', label: 'Journal & Notes' },
    { id: 'analytics', label: 'Analytics & Mastery' },
  ];

  const handleExport = () => {
    const json = exportAllDataAsJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cozy_code_corner_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importAllDataFromJson(content);
      if (success) {
        setImportStatus('Backup restored successfully!');
        setTimeout(() => {
          setImportStatus(null);
          setShowDataModal(false);
        }, 1200);
      } else {
        setImportStatus('Invalid JSON format');
      }
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    clearAllData();
    setShowConfirmClear(false);
    setShowDataModal(false);
  };

  return (
    <>
      {/* Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (4-5 Nav Links) — Zone 3 (Primary Action) */}
      <header className="sticky top-0 z-40 bg-[#FFFCF6]/95 backdrop-blur-md border-b border-[#E7E1D6] px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onTabChange('dashboard')}
              className="text-lg font-bold tracking-tight text-[#252A27] font-serif hover:text-[#526B58] transition-colors whitespace-nowrap shrink-0"
            >
              Cozy Code Corner
            </button>
            <span className="text-xs text-[#8A928B] hidden sm:inline" aria-hidden="true">·</span>
            <span className="text-xs text-[#565E59] hidden sm:inline font-mono">12-Week Mastery</span>
          </div>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[#565E59] uppercase tracking-wider">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onTabChange(link.id)}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 ${
                    isActive ? 'text-[#526B58] font-bold' : 'hover:text-[#252A27]'
                  }`}
                >
                  {link.label}
                  {link.id === 'revisions' && revisionsDueCount > 0 && (
                    <span className="ml-1.5 text-[#C98F79] font-mono text-[11px] font-bold">
                      ({revisionsDueCount})
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#526B58] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action + backup tool */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowDataModal(true)}
              title="Cloud Sync & Data Backup"
              className="p-2 text-[#565E59] hover:text-[#252A27] hover:bg-[#E7E1D6]/50 rounded-xl transition-colors"
            >
              <Database className="w-4 h-4" />
            </button>

            <button
              onClick={onContinueLearning}
              className="px-4 py-2 text-xs font-semibold text-[#FFFCF6] bg-[#526B58] hover:bg-[#435748] active:scale-[0.98] rounded-xl shadow-xs transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Continue Learning</span>
            </button>
          </div>
        </div>

        {/* Mobile Nav Row */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto pt-2.5 pb-1 border-t border-[#E7E1D6] mt-2.5 scrollbar-none">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onTabChange(link.id)}
              className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap shrink-0 ${
                currentTab === link.id
                  ? 'bg-[#526B58] text-[#FFFCF6] font-semibold'
                  : 'text-[#565E59] hover:bg-[#E7E1D6]/40'
              }`}
            >
              {link.label}
              {link.id === 'revisions' && revisionsDueCount > 0 && (
                <span className="ml-1 font-mono">({revisionsDueCount})</span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Data Backup & Cloud Synchronization Modal */}
      {showDataModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#252A27]/60 backdrop-blur-sm p-4">
          <div className="bg-[#FFFCF6] border border-[#E7E1D6] rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#526B58]" />
                <h3 className="text-sm font-bold text-[#252A27] font-serif">
                  Data Backup & Synchronization
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowDataModal(false);
                  setShowConfirmClear(false);
                }}
                className="text-[#8A928B] hover:text-[#252A27] text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#565E59] leading-relaxed">
              Your problem attempts, Day 3/7/30 review schedules, trigger lines, notes, and local code drafts are preserved locally and cross-device compatible.
            </p>

            {importStatus && (
              <div className="p-3 bg-[#A8B9A0]/20 border border-[#A8B9A0] text-[#526B58] text-xs rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{importStatus}</span>
              </div>
            )}

            {showConfirmClear ? (
              <div className="p-4 bg-[#C98F79]/15 border border-[#C98F79]/40 rounded-xl space-y-3">
                <p className="text-xs text-[#C98F79] font-medium leading-relaxed">
                  Are you sure you want to clear all data? This will permanently wipe all problem progress, drafts, and revision milestones.
                </p>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setShowConfirmClear(false)}
                    className="px-3 py-1.5 bg-[#F6F3EC] text-xs font-semibold text-[#565E59] rounded-lg border border-[#E7E1D6]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClear}
                    className="px-3 py-1.5 bg-[#C98F79] text-xs font-bold text-white rounded-lg"
                  >
                    Yes, Clear Everything
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 pt-1">
                <button
                  onClick={handleExport}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F6F3EC] hover:bg-[#E7E1D6] border border-[#E7E1D6] text-[#252A27] rounded-xl text-xs font-semibold transition-colors"
                >
                  <Download className="w-4 h-4 text-[#526B58]" />
                  <span>Export Progress Snapshot (JSON)</span>
                </button>

                <label className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F6F3EC] hover:bg-[#E7E1D6] border border-[#E7E1D6] text-[#252A27] rounded-xl text-xs font-semibold transition-colors cursor-pointer">
                  <Upload className="w-4 h-4 text-[#526B58]" />
                  <span>Import Backup File</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={() => setShowConfirmClear(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-[#C98F79] hover:bg-[#C98F79]/10 border border-[#C98F79]/30 rounded-xl text-xs font-semibold transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All Progress & Reset</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
