import React, { useState, useRef, useEffect } from 'react';
import {
  Brain,
  Clock,
  Database,
  Search,
  Zap,
  Command,
  Download,
  Upload,
  CheckCircle2,
  RefreshCw,
  LogIn,
  LogOut,
  Cloud,
  CloudUpload,
  HardDrive,
  ShieldCheck,
  User as UserIcon,
  ChevronDown,
  ExternalLink,
  Sparkles,
  Layers,
  Code2,
  BookOpen,
  BarChart3,
  Sun,
  Moon
} from 'lucide-react';
import { exportAllDataAsJson, importAllDataFromJson } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  activeProblemTitle?: string;
  onContinueLearning: () => void;
  reSolvesDueCount: number;
  onOpenCommandPalette: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onContinueLearning,
  reSolvesDueCount,
  onOpenCommandPalette,
}) => {
  const { user, loading: authLoading, isSyncing, lastSyncedAt, signIn, signOut, syncWithCloud, backupToCloudStorage } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [cloudBackupUrl, setCloudBackupUrl] = useState<string | null>(null);
  const [isCloudBackingUp, setIsCloudBackingUp] = useState<boolean>(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { id: 'dashboard', label: 'Command Center', icon: Brain },
    { id: 'roadmap', label: 'Roadmap', icon: Layers },
    { id: 'tracker', label: 'Re-Solve Queue', icon: Clock, badge: reSolvesDueCount > 0 ? reSolvesDueCount : undefined },
    { id: 'workspace', label: 'Workspace', icon: Code2 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'video-insights', label: '6-Step Insights', icon: Sparkles },
    { id: 'audit', label: 'Audit', icon: BookOpen },
  ];

  const handleExport = () => {
    const json = exportAllDataAsJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neetcode150_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          setShowBackupModal(false);
        }, 1500);
      } else {
        setImportStatus('Failed to restore backup: Invalid JSON schema');
      }
    };
    reader.readAsText(file);
  };

  const handleCloudBackupTrigger = async () => {
    setIsCloudBackingUp(true);
    const downloadUrl = await backupToCloudStorage();
    setIsCloudBackingUp(false);
    if (downloadUrl) {
      setCloudBackupUrl(downloadUrl);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full pt-3 pb-2 px-4 sm:px-6 pointer-events-none">
      {/* Compact Dark Pill-Shaped Navigation Capsule */}
      <div className="max-w-7xl mx-auto pointer-events-auto bg-[#0B111E]/95 backdrop-blur-md border border-slate-800/90 rounded-2xl sm:rounded-full px-3 sm:px-5 py-2 shadow-2xl flex items-center justify-between gap-3 text-slate-200">
        
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onTabChange('dashboard')}
            className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
          >
            <div className="w-7 h-7 rounded-lg sm:rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-sm flex items-center justify-center">
              <div className="w-full h-full bg-[#0B111E] rounded-lg sm:rounded-full flex items-center justify-center">
                <Brain className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white group-hover:text-indigo-300 transition-colors whitespace-nowrap">
                NEURAL FLOW
              </span>
              <span className="text-[9px] font-mono text-slate-400 -mt-0.5 tracking-wider hidden sm:block">
                NeetCode 150
              </span>
            </div>
          </button>
        </div>

        {/* Center Zone: Horizontal Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 shrink-0">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                onClick={() => onTabChange(link.id)}
                className={`relative px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{link.label}</span>
                {link.badge !== undefined && (
                  <span className="ml-0.5 px-1.5 py-0.2 bg-rose-500 text-white font-mono text-[10px] font-bold rounded-full">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile Nav Dropdown Selector */}
        <div className="lg:hidden flex items-center">
          <select
            value={currentTab}
            onChange={(e) => onTabChange(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold px-2 py-1 text-slate-200 focus:outline-none"
          >
            {navLinks.map((link) => (
              <option key={link.id} value={link.id}>
                {link.label} {link.badge ? `(${link.badge})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Right Action Zone */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Command Palette Button */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
            title="Open Command Palette (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <kbd className="font-mono text-[10px] bg-slate-800 px-1 py-0.2 rounded border border-slate-700 text-slate-300">
              ⌘K
            </kbd>
          </button>

          {/* Cloud Sync Status Indicator */}
          {user && (
            <button
              onClick={() => syncWithCloud()}
              disabled={isSyncing}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 hover:text-white transition-colors"
              title={lastSyncedAt ? `Last synced: ${lastSyncedAt.toLocaleTimeString()}` : 'Sync with Firestore'}
            >
              <RefreshCw className={`w-3 h-3 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="font-mono text-[10px]">
                {isSyncing ? 'Syncing...' : 'Synced'}
              </span>
            </button>
          )}

          {/* Backup & Restore modal toggle button */}
          <button
            onClick={() => setShowBackupModal(true)}
            className="p-1.5 rounded-full hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 transition-colors"
            title="Backup & Cloud Storage"
          >
            <Database className="w-4 h-4" />
          </button>

          {/* Theme Mode Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full hover:bg-slate-800/80 text-slate-300 hover:text-white transition-colors flex items-center justify-center relative group"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle light or dark theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-200" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-300 group-hover:-rotate-12 transition-transform duration-200" />
            )}
          </button>

          {/* Primary CTA: Continue Learning */}
          <button
            onClick={onContinueLearning}
            className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:scale-95 text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1.5 transition-all whitespace-nowrap"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span className="hidden sm:inline">Continue</span>
          </button>

          {/* Firebase Authentication: User Badge or Sign In */}
          {authLoading ? (
            <div className="w-7 h-7 rounded-full bg-slate-800 animate-pulse" />
          ) : user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1 p-0.5 rounded-full hover:ring-2 hover:ring-indigo-500/50 transition-all"
                title={user.displayName || user.email || 'User Account'}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Avatar'}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover border border-slate-700"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center font-mono border border-indigo-400/30">
                    {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#0D1322] border border-slate-800 p-3 shadow-2xl text-xs space-y-3 z-50">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-full object-cover border border-slate-700"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center font-mono">
                        {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <div className="font-semibold text-white truncate">
                        {user.displayName || 'Developer'}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate font-mono">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {/* Sync status info */}
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Cloud className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Firestore Sync</span>
                    </div>
                    <span className="text-emerald-400 font-mono text-[10px]">
                      {lastSyncedAt ? 'Active' : 'Ready'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        syncWithCloud();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Sync Data to Cloud</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowBackupModal(true);
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <CloudUpload className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Cloud Storage Backup</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        signOut();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Backup & Cloud Storage Modal */}
      {showBackupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto">
          <div className="bg-[#0D111A] border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Data Management & Backup</h3>
              </div>
              <button
                onClick={() => setShowBackupModal(false)}
                className="text-slate-400 hover:text-white text-sm p-1 rounded hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Cloud Storage Section */}
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <CloudUpload className="w-4 h-4 text-cyan-400" />
                  <span>Firebase Cloud Storage Archive</span>
                </div>
                {user ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                    Connected: {user.email?.split('@')[0]}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-amber-400">Sign in required</span>
                )}
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Snapshot your entire 12-week curriculum state directly to Google Cloud Storage.
              </p>

              {user ? (
                <div className="flex flex-col gap-2 pt-1">
                  <button
                    onClick={handleCloudBackupTrigger}
                    disabled={isCloudBackingUp}
                    className="w-full py-2 px-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <CloudUpload className="w-4 h-4" />
                    <span>{isCloudBackingUp ? 'Archiving to Cloud Storage...' : 'Archive Snapshot to Cloud'}</span>
                  </button>

                  {cloudBackupUrl && (
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between gap-2 text-xs">
                      <span className="text-emerald-400 truncate text-[11px] font-mono">
                        Archive uploaded successfully
                      </span>
                      <a
                        href={cloudBackupUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded text-[11px] font-semibold flex items-center gap-1 shrink-0"
                      >
                        <span>Download</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign in with Google to enable Cloud Storage</span>
                </button>
              )}
            </div>

            {/* Local JSON Export & Import */}
            <div className="space-y-3 pt-1">
              <div className="text-xs font-semibold text-slate-300">Local JSON Storage</div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleExport}
                  className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl flex flex-col items-center gap-2 text-center transition-all group"
                >
                  <Download className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-semibold text-slate-200">Export JSON</div>
                  <div className="text-[10px] text-slate-400">Download local progress file</div>
                </button>

                <label className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl flex flex-col items-center gap-2 text-center transition-all group cursor-pointer">
                  <Upload className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-semibold text-slate-200">Restore JSON</div>
                  <div className="text-[10px] text-slate-400">Upload progress backup file</div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {importStatus && (
                <div className={`p-2.5 rounded-lg text-xs font-medium text-center ${
                  importStatus.includes('success')
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                    : 'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                }`}>
                  {importStatus}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
