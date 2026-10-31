import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  CheckCircle2, Circle, Clock, Flame, BookOpen, CheckSquare, Award,
  BarChart3, Settings as SettingsIcon, Calendar as CalendarIcon, Plus,
  Trash2, Edit3, X, ChevronRight, ChevronLeft, Search, Pin, Sparkles,
  Play, Pause, RotateCcw, Volume2, Moon, Sun, ArrowUpRight, ShieldCheck,
  Zap, Trophy, AlertCircle, HelpCircle, Layers, Check, Compass, Bookmark,
  MapPin, Lock, Mountain, Star, Eye, Sliders, CheckCheck, Lightbulb, FileText,
  TrendingUp, RefreshCw, Folder, FolderOpen, User, LogIn, LogOut
} from 'lucide-react';

// ==========================================
// CONSTANTS, THEMES & GAMIFICATION DATA
// ==========================================

const WALLPAPERS = {
  dusk: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80',
  nordic: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80',
  space: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=2000&q=80',
  silicon: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2000&q=80',
  slate: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=2000&q=80'
};

const CATEGORIES = {
  Work: { color: '#0a84ff', label: 'Work' },
  Uni: { color: '#bf5af2', label: 'Uni' },
  Home: { color: '#ff9f0a', label: 'Home' },
  Health: { color: '#30d158', label: 'Health' },
  Personal: { color: '#ff375f', label: 'Personal' },
  Project: { color: '#40c8e0', label: 'Project' }
};

const PRIORITIES = {
  low: { label: 'Low', color: '#94a3b8', xp: 5, cur: 10 },
  medium: { label: 'Medium', color: '#0a84ff', xp: 10, cur: 15 },
  high: { label: 'High', color: '#f59e0b', xp: 20, cur: 20 },
  urgent: { label: 'Urgent', color: '#f43f5e', xp: 30, cur: 30 }
};

const LEVEL_TITLES = [
  "Beginner", "Starter", "Learner", "Grinder", "Apprentice",
  "Scholar", "Achiever", "Specialist", "Pro", "Builder",
  "Tactician", "Architect", "Virtuoso", "Sage", "Authority",
  "Innovator", "Visionary", "Trailblazer", "Grandmaster", "Luminary",
  "Legend", "Mythic"
];

const BIOMES = [
  { name: "The Verdant Foothills", range: [1, 4], color: "emerald", desc: "Where all great journeys begin with small daily habits." },
  { name: "The Shimmering Expanse", range: [5, 8], color: "blue", desc: "Discipline hardens into second nature across crystal fields." },
  { name: "The Spire of Architects", range: [9, 12], color: "indigo", desc: "Deep knowledge synthesis and system building take root." },
  { name: "The Ethereal Sanctum", range: [13, 16], color: "purple", desc: "Unflinching focus and profound mastery of core disciplines." },
  { name: "The Celestial Summit", range: [17, 20], color: "amber", desc: "The apex of intellectual consistency and quiet excellence." },
  { name: "The Mythic Void", range: [21, 25], color: "rose", desc: "Uncharted territories beyond mortal milestones." }
];

const STUDY_PLANS = [
  {
    id: 'pomodoro',
    name: 'Classic Pomodoro',
    tagline: '25m Focus · 5m Rest',
    focusMinutes: 25,
    breakMinutes: 5,
    icon: '🍅',
    badge: 'Popular',
    description: 'Overcomes resistance and mental friction. Fast cycles prevent cognitive fatigue and guarantee frequent dopamine recharges.',
    protocolTip: 'During the 5-minute break, avoid scrolling your phone. Stand up, stretch, and grab a sip of water.'
  },
  {
    id: 'desktime',
    name: 'DeskTime 52/17 Method',
    tagline: '52m Focus · 17m Rest',
    focusMinutes: 52,
    breakMinutes: 17,
    icon: '⚡',
    badge: 'High Impact',
    description: 'Derived from tracking top 10% performers. 52 minutes allows entering deep flow, followed by 17 minutes of cognitive renewal.',
    protocolTip: 'Completely disconnect from screens during the 17-minute rest to reset working memory.'
  },
  {
    id: 'ultradian',
    name: 'Ultradian 90/20 Flow',
    tagline: '90m Focus · 20m Rest',
    focusMinutes: 90,
    breakMinutes: 20,
    icon: '🌊',
    badge: 'Deep Work',
    description: 'Synchronized with biological Basic Rest-Activity Cycles (BRAC). Ideal for deep writing, proofs, and intense coding.',
    protocolTip: 'Reserve this plan for your peak chronotype energy window, typically the first 4 hours of your morning.'
  },
  {
    id: 'sprint50',
    name: 'Academic 50/10 Sprint',
    tagline: '50m Focus · 10m Rest',
    focusMinutes: 50,
    breakMinutes: 10,
    icon: '🎓',
    badge: 'Academic',
    description: 'Aligned with classic university lecture and exam intervals. Balances complex retention with brief resets.',
    protocolTip: 'Spend the last 5 minutes of each block drafting a 2-sentence summary of what you learned.'
  }
];

const SWATCHES = [
  "#0a84ff", "#5e5ce6", "#bf5af2", "#ff375f", "#ff9f0a", "#ffd60a",
  "#30d158", "#40c8e0", "#64d2ff", "#8e8e93", "#a2845e", "#ff6482"
];

// Helper Functions
function getTodayStr() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

function formatLongDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function getLevelInfo(xp) {
  let level = 1;
  while (xp >= 150 * Math.pow(level, 2)) {
    level++;
  }
  const currentLvlXp = 150 * Math.pow(level - 1, 2);
  const nextLvlXp = 150 * Math.pow(level, 2);
  const progressInLvl = xp - currentLvlXp;
  const xpNeeded = nextLvlXp - currentLvlXp;
  const percent = Math.min(100, Math.max(0, Math.round((progressInLvl / xpNeeded) * 100)));
  const title = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];

  return { level, title, currentLvlXp, nextLvlXp, progressInLvl, xpNeeded, percent };
}

function getMasteryRankInfo(status) {
  switch (status) {
    case 'mastered':
      return { label: 'Mastered', percent: 100, color: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10' };
    case 'confident':
      return { label: 'Confident', percent: 75, color: 'text-blue-500 border-blue-500/30 bg-blue-500/10' };
    case 'learning':
      return { label: 'Learning', percent: 45, color: 'text-amber-500 border-amber-500/30 bg-amber-500/10' };
    default:
      return { label: 'To Learn', percent: 15, color: 'text-slate-400 border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5' };
  }
}

function playTone(type = 'tick') {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'tick') {
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'success') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'unlock') {
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (e) {
    // Audio context may require prior user interaction
  }
}

// INITIAL SEED DATA
const INITIAL_DATA = {
  user: {
    isLoggedIn: false,
    name: 'Explorer Silvius',
    email: 'local@silvius.app',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    provider: 'local'
  },
  tasks: [
    { id: 't1', title: 'Review Distributed Systems Consensus Proof', notes: 'Verify Paxos vs Raft invariants', dueDate: getTodayStr(), dueTime: '14:00', priority: 'urgent', category: 'Uni', status: 'todo', repeat: 'once', xpValue: 30, completedDate: null },
    { id: 't2', title: 'Complete Silvius Study Hub Design System', notes: 'Glass panels, custom interval presets, and active quiz testing', dueDate: getTodayStr(), dueTime: '17:30', priority: 'high', category: 'Project', status: 'done', completedDate: getTodayStr(), repeat: 'once', xpValue: 20 },
    { id: 't3', title: 'Hydration & 30-Minute Aerobic Walk', notes: 'Leave desk completely during the rest break', dueDate: getTodayStr(), dueTime: '18:00', priority: 'medium', category: 'Health', status: 'todo', repeat: 'every day', xpValue: 10, completedDate: null }
  ],
  habits: [
    { id: 'h1', name: 'Deep Reading', emoji: '📖', color: '#0a84ff', frequency: 'daily', daySet: [0,1,2,3,4,5,6], weeklyTarget: 7, active: true },
    { id: 'h2', name: 'Morning Movement & Stretch', emoji: '🧘', color: '#30d158', frequency: 'daily', daySet: [0,1,2,3,4,5,6], weeklyTarget: 5, active: true },
    { id: 'h3', name: 'Code Architecture Review', emoji: '💻', color: '#bf5af2', frequency: 'weekdays', daySet: [1,2,3,4,5], weeklyTarget: 5, active: true }
  ],
  habitLogs: [
    { habitId: 'h1', date: getTodayStr() },
    { habitId: 'h2', date: getTodayStr() }
  ],
  subjects: [
    { id: 's1', name: 'Computer Science', color: '#0a84ff', description: 'Distributed consensus, algorithms & system architecture', weeklyTargetMinutes: 300 },
    { id: 's2', name: 'Cognitive Science', color: '#bf5af2', description: 'Memory consolidation, retrieval practice & neuroplasticity', weeklyTargetMinutes: 180 },
    { id: 's3', name: 'System Design', color: '#30d158', description: 'Scalable backends, caching and data partitioning', weeklyTargetMinutes: 240 }
  ],
  topics: [
    { id: 'top1', subjectId: 's1', name: 'Raft Consensus Protocol', confidence: 4, status: 'confident', notes: 'Leader election, log replication, safety invariant', lastStudied: getTodayStr() },
    { id: 'top2', subjectId: 's1', name: 'B-Trees & LSM Trees', confidence: 2, status: 'learning', notes: 'Write amplification and read trade-offs', lastStudied: getTodayStr() },
    { id: 'top3', subjectId: 's2', name: 'Active Recall vs Passive Review', confidence: 5, status: 'mastered', notes: 'Testing effect enhances neural pathway consolidation', lastStudied: getTodayStr() },
    { id: 'top4', subjectId: 's3', name: 'Consistent Hashing Rings', confidence: 3, status: 'learning', notes: 'Virtual nodes and cluster rebalancing', lastStudied: getTodayStr() }
  ],
  studySessions: [
    { id: 'ses1', subjectId: 's1', topicId: 'top1', date: getTodayStr(), minutes: 52, notes: 'Completed DeskTime 52/17 interval on Raft election timeout.' }
  ],
  studyNotes: [
    { id: 'n1', title: 'Raft Safety Invariants', body: 'Election Safety: At most one leader can be elected in a given term. Log Matching: If two logs contain an entry with the same index and term, then the logs are identical in all entries up through the given index.', subjectId: 's1', topicId: 'top1', date: getTodayStr(), pinned: true },
    { id: 'n2', title: 'Spaced Retrieval Schedules', body: 'Optimal interval curve: Day 1, Day 3, Day 7, Day 16, Day 35. Overcoming the Ebbinghaus forgetting curve through deliberate friction.', subjectId: 's2', topicId: 'top3', date: getTodayStr(), pinned: false }
  ],
  quizAttempts: [
    { id: 'qa1', subjectId: 's1', topicId: 'top1', date: getTodayStr(), score: 3, total: 3, difficulty: 'adaptive', feedback: 'Perfect score! Topic elevated to CONFIDENT.', missedConcepts: [] }
  ],
  userPrefs: {
    theme: 'dark',
    wallpaper: 'dusk',
    currencyName: 'Stardust',
    currencyIcon: '💎'
  },
  stats: {
    totalXp: 1485,
    silvs: 175,
    customCurrency: 340,
    streak: 5,
    lastActiveDate: getTodayStr()
  }
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function App() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('silvius_data_prod');
      return saved ? JSON.parse(saved) : INITIAL_DATA;
    } catch {
      return INITIAL_DATA;
    }
  });

  const [currentPage, setCurrentPage] = useState('today');
  const [toasts, setToasts] = useState([]);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);

  // Modal dialog triggers
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showHabitModal, setShowHabitModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('silvius_data_prod', JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  }, [data]);

  // Apply dark/light theme to document root
  useEffect(() => {
    const isDark = data.userPrefs.theme === 'dark' ||
      (data.userPrefs.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [data.userPrefs.theme]);

  const addToast = (message, icon = '✨') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, icon }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2800);
  };

  const handleGoogleLogin = () => {
    setData(prev => ({
      ...prev,
      user: {
        isLoggedIn: true,
        name: 'Alex Rivera',
        email: 'alex.rivera@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
        provider: 'google'
      }
    }));
    playTone('unlock');
    addToast('Signed in with Google! Settings & data synchronized.', '🔐');
  };

  const handleLogout = () => {
    setData(prev => ({
      ...prev,
      user: {
        isLoggedIn: false,
        name: 'Explorer Silvius',
        email: 'local@silvius.app',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        provider: 'local'
      }
    }));
    addToast('Logged out to offline guest mode', '👋');
  };

  const awardProgression = (xp, customCur, reason) => {
    setData(prev => {
      const oldXp = prev.stats.totalXp;
      const newXp = oldXp + xp;
      const oldLvl = getLevelInfo(oldXp).level;
      const newLvl = getLevelInfo(newXp).level;
      const earnedLevels = newLvl - oldLvl;
      const bonusSilvs = earnedLevels > 0 ? earnedLevels * 50 : 0;

      if (earnedLevels > 0) {
        playTone('unlock');
        addToast(`Ascended to Level ${newLvl}: ${LEVEL_TITLES[Math.min(newLvl - 1, 21)]}! (+${bonusSilvs} Silvs)`, '🌟');
      }

      return {
        ...prev,
        stats: {
          ...prev.stats,
          totalXp: newXp,
          silvs: prev.stats.silvs + bonusSilvs,
          customCurrency: prev.stats.customCurrency + (customCur || 0),
          lastActiveDate: getTodayStr()
        }
      };
    });
  };

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 font-sans transition-colors relative selection:bg-blue-500 selection:text-white pb-20 lg:pb-0">
      {/* Background Wallpaper Scrim */}
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-700 bg-cover bg-center -z-10"
        style={{ backgroundImage: `url(${WALLPAPERS[data.userPrefs.wallpaper] || WALLPAPERS.dusk})` }}
      />
      <div className="fixed inset-0 pointer-events-none bg-slate-50/80 dark:bg-slate-950/85 backdrop-blur-[35px] -z-10" />

      {/* Floating Toast Notification Hub */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-xl text-xs font-semibold text-slate-800 dark:text-white pointer-events-auto"
          >
            <span>{toast.icon}</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      <div className="max-w-[1440px] mx-auto min-h-screen flex flex-col lg:flex-row">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between p-4 sticky top-0 h-screen">
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-slate-200/60 dark:border-white/10 rounded-3xl p-4 flex flex-col h-full shadow-lg">
            {/* Brand Monogram */}
            <div className="flex items-center justify-between px-2 mb-4 pt-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-200 via-slate-400 to-white flex items-center justify-center shadow-inner border border-white/50">
                  <span className="font-extrabold text-slate-800 text-sm tracking-tight">S</span>
                </div>
                <div>
                  <h1 className="font-extrabold text-base tracking-tight leading-none text-slate-900 dark:text-white">Silvius</h1>
                  <span className="text-[10px] text-slate-400 font-medium">calm mastery hub</span>
                </div>
              </div>
            </div>

            {/* User Profile Card / Google Login status */}
            <div className="mb-4 px-2 py-2 rounded-2xl bg-white/40 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <img
                  src={data.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                  alt="Avatar"
                  className="w-7 h-7 rounded-full object-cover border border-white/30 shrink-0"
                />
                <div className="truncate">
                  <div className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                    {data.user?.name || 'Explorer'}
                  </div>
                  <div className="text-[9px] text-slate-400 truncate">
                    {data.user?.isLoggedIn ? 'Google Cloud Sync' : 'Guest Account'}
                  </div>
                </div>
              </div>

              {!data.user?.isLoggedIn ? (
                <button
                  onClick={handleGoogleLogin}
                  title="Sign in with Google"
                  className="p-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm shrink-0"
                >
                  <LogIn className="w-3 h-3" />
                </button>
              ) : (
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-1 overflow-y-auto pr-1 flex-1">
              {[
                { id: 'today', label: 'Today', icon: CheckSquare },
                { id: 'tasks', label: 'Tasks', icon: Layers },
                { id: 'habits', label: 'Habits', icon: Flame },
                { id: 'study', label: 'Study & Mastery', icon: BookOpen },
                { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
                { id: 'library', label: 'Library', icon: Bookmark },
                { id: 'rewards', label: 'Achievements', icon: Award },
                { id: 'progress', label: 'Progress & Lore', icon: BarChart3 },
                { id: 'settings', label: 'Settings', icon: SettingsIcon },
              ].map(item => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      playTone('tick');
                    }}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 text-left ${
                      isActive
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Sidebar Footer: Wallets & Expedition Button */}
            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between px-2 text-xs">
                <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                  <span className="text-slate-400">🪙</span> {data.stats.silvs} <span className="text-[10px] font-normal text-slate-400">Silvs</span>
                </span>
                <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                  <span>{data.userPrefs.currencyIcon}</span> {data.stats.customCurrency}
                </span>
              </div>

              <button
                onClick={() => setIsRoadmapOpen(true)}
                className="w-full flex items-center justify-between p-2 rounded-2xl bg-white/40 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/10 border border-slate-200/50 dark:border-white/5 transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-[11px] shadow-sm">
                    {getLevelInfo(data.stats.totalXp).level}
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-800 dark:text-white leading-tight">
                      {getLevelInfo(data.stats.totalXp).title}
                    </div>
                    <div className="text-[9px] text-blue-500 font-semibold">🗺️ View Expedition</div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </aside>

        {/* MOBILE TOP BAR */}
        <header className="lg:hidden sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-slate-200 to-white flex items-center justify-center font-bold text-xs text-slate-800 shadow">
              S
            </div>
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">Silvius</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRoadmapOpen(true)}
              className="px-2.5 py-1 rounded-xl bg-blue-500/10 text-blue-500 font-extrabold text-[11px] border border-blue-500/20"
            >
              Lvl {getLevelInfo(data.stats.totalXp).level} 🗺️
            </button>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>🪙 {data.stats.silvs}</span>
              <span>{data.userPrefs.currencyIcon} {data.stats.customCurrency}</span>
            </div>
          </div>
        </header>

        {/* MAIN APPLICATION PAGES */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentPage === 'today' && (
            <TodayView
              data={data}
              setData={setData}
              onOpenRoadmap={() => setIsRoadmapOpen(true)}
              onOpenNewTask={() => setShowTaskModal(true)}
              onOpenNewHabit={() => setShowHabitModal(true)}
              setCurrentPage={setCurrentPage}
              awardProgression={awardProgression}
              addToast={addToast}
            />
          )}

          {currentPage === 'study' && (
            <StudyHubView
              data={data}
              setData={setData}
              onOpenNewSubject={() => setShowSubjectModal(true)}
              onOpenNewNote={() => setShowNoteModal(true)}
              awardProgression={awardProgression}
              addToast={addToast}
            />
          )}

          {currentPage === 'tasks' && (
            <TasksView
              data={data}
              setData={setData}
              onOpenNewTask={() => setShowTaskModal(true)}
              awardProgression={awardProgression}
              addToast={addToast}
            />
          )}

          {currentPage === 'habits' && (
            <HabitsView
              data={data}
              setData={setData}
              onOpenNewHabit={() => setShowHabitModal(true)}
              awardProgression={awardProgression}
              addToast={addToast}
            />
          )}

          {currentPage === 'calendar' && (
            <CalendarView
              data={data}
              setData={setData}
              awardProgression={awardProgression}
              addToast={addToast}
            />
          )}

          {currentPage === 'library' && (
            <LibraryView
              data={data}
              setData={setData}
              onOpenNewNote={() => setShowNoteModal(true)}
              addToast={addToast}
            />
          )}

          {currentPage === 'rewards' && <RewardsView data={data} onOpenRoadmap={() => setIsRoadmapOpen(true)} />}
          {currentPage === 'progress' && <ProgressView data={data} onOpenRoadmap={() => setIsRoadmapOpen(true)} />}
          {currentPage === 'settings' && (
            <SettingsView
              data={data}
              setData={setData}
              addToast={addToast}
              onGoogleLogin={handleGoogleLogin}
              onLogout={handleLogout}
            />
          )}
        </main>

        {/* MOBILE BOTTOM NAVIGATION BAR */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border-t border-slate-200/60 dark:border-white/10 px-2 py-1.5 flex items-center justify-around">
          {[
            { id: 'today', label: 'Today', icon: CheckSquare },
            { id: 'tasks', label: 'Tasks', icon: Layers },
            { id: 'habits', label: 'Habits', icon: Flame },
            { id: 'study', label: 'Study', icon: BookOpen },
            { id: 'calendar', label: 'Cal', icon: CalendarIcon },
            { id: 'library', label: 'Notes', icon: Bookmark },
            { id: 'rewards', label: 'Badges', icon: Award },
            { id: 'settings', label: 'Settings', icon: SettingsIcon },
          ].map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  playTone('tick');
                }}
                className={`flex flex-col items-center gap-0.5 p-1.5 transition-colors ${
                  isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[9px] font-bold tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ROADMAP EXPEDITION MODAL */}
      {isRoadmapOpen && (
        <RoadmapExpeditionModal
          data={data}
          onClose={() => setIsRoadmapOpen(false)}
        />
      )}

      {/* CREATE NEW TASK MODAL */}
      {showTaskModal && (
        <CreateTaskModal
          onClose={() => setShowTaskModal(false)}
          onSave={(task) => {
            setData(prev => ({ ...prev, tasks: [task, ...prev.tasks] }));
            setShowTaskModal(false);
            addToast('Task created', '📋');
          }}
        />
      )}

      {/* CREATE NEW HABIT MODAL */}
      {showHabitModal && (
        <CreateHabitModal
          onClose={() => setShowHabitModal(false)}
          onSave={(habit) => {
            setData(prev => ({ ...prev, habits: [...prev.habits, habit] }));
            setShowHabitModal(false);
            addToast('Habit initiated', '🌱');
          }}
        />
      )}

      {/* CREATE NEW SUBJECT MODAL */}
      {showSubjectModal && (
        <CreateSubjectModal
          onClose={() => setShowSubjectModal(false)}
          onSave={(subject) => {
            setData(prev => ({ ...prev, subjects: [...prev.subjects, subject] }));
            setShowSubjectModal(false);
            addToast('Subject added to curriculum', '📚');
          }}
        />
      )}

      {/* CREATE NEW NOTE MODAL */}
      {showNoteModal && (
        <CreateNoteModal
          subjects={data.subjects}
          topics={data.topics}
          onClose={() => setShowNoteModal(false)}
          onSave={(note) => {
            setData(prev => ({ ...prev, studyNotes: [note, ...prev.studyNotes] }));
            setShowNoteModal(false);
            addToast('Knowledge note captured', '📝');
          }}
        />
      )}
    </div>
  );
}

// ==========================================
// TODAY VIEW (HOME DASHBOARD)
// ==========================================
function TodayView({ data, setData, onOpenRoadmap, onOpenNewTask, onOpenNewHabit, setCurrentPage, awardProgression, addToast }) {
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const todayStr = getTodayStr();

  // Greeting by hour
  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 5) greeting = "Still up";
  else if (hour < 12) greeting = "Good morning";
  else if (hour < 17) greeting = "Good afternoon";

  const levelInfo = getLevelInfo(data.stats.totalXp);
  const checkedHabitIds = new Set(data.habitLogs.filter(l => l.date === todayStr).map(l => l.habitId));

  const todayTasks = data.tasks.filter(t => t.dueDate === todayStr || t.status === 'todo');
  const todayDoneTasks = data.tasks.filter(t => t.completedDate === todayStr);
  const todayMinutes = data.studySessions.filter(s => s.date === todayStr).reduce((acc, s) => acc + s.minutes, 0);
  const totalMinutes = data.studySessions.reduce((acc, s) => acc + s.minutes, 0);

  const handleToggleTask = (task) => {
    playTone('tick');
    const isDone = task.status === 'done';
    const newStatus = isDone ? 'todo' : 'done';
    const completedDate = isDone ? null : todayStr;

    // Handle repeating tasks
    let nextOccurrences = [];
    if (!isDone && task.repeat !== 'once') {
      const nextDate = new Date();
      if (task.repeat === 'every day') nextDate.setDate(nextDate.getDate() + 1);
      else if (task.repeat === 'weekdays') nextDate.setDate(nextDate.getDate() + (nextDate.getDay() === 5 ? 3 : 1));
      else if (task.repeat === 'every week') nextDate.setDate(nextDate.getDate() + 7);
      else if (task.repeat === 'every month') nextDate.setMonth(nextDate.getMonth() + 1);

      nextOccurrences.push({
        ...task,
        id: 'task_' + Math.random().toString(36).substr(2, 9),
        dueDate: nextDate.toISOString().split('T')[0],
        status: 'todo',
        completedDate: null
      });
    }

    setData(prev => ({
      ...prev,
      tasks: [
        ...prev.tasks.map(t => t.id === task.id ? { ...t, status: newStatus, completedDate } : t),
        ...nextOccurrences
      ]
    }));

    if (!isDone) {
      const p = PRIORITIES[task.priority] || PRIORITIES.medium;
      awardProgression(p.xp, p.cur, `Completed task: ${task.title}`);
      addToast(`Task completed! +${p.xp} XP & +${p.cur} ${data.userPrefs.currencyName}`, '✨');
    }
  };

  const handleToggleHabit = (habitId) => {
    playTone('tick');
    const isChecked = checkedHabitIds.has(habitId);

    if (isChecked) {
      setData(prev => ({
        ...prev,
        habitLogs: prev.habitLogs.filter(l => !(l.habitId === habitId && l.date === todayStr))
      }));
      addToast('Check-in removed', '↩️');
    } else {
      setData(prev => ({
        ...prev,
        habitLogs: [...prev.habitLogs, { habitId, date: todayStr }]
      }));
      awardProgression(8, 5, 'Habit check-in');
      addToast('Habit check-in confirmed! +8 XP & +5 Currency', '🔥');
    }
  };

  const handleQuickAddTask = (e) => {
    e.preventDefault();
    if (!quickTaskTitle.trim()) return;

    const newTask = {
      id: 'task_' + Math.random().toString(36).substr(2, 9),
      title: quickTaskTitle.trim(),
      notes: '',
      dueDate: todayStr,
      dueTime: '12:00',
      priority: 'medium',
      category: 'Personal',
      status: 'todo',
      repeat: 'once',
      xpValue: 10,
      completedDate: null
    };

    setData(prev => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
    setQuickTaskTitle('');
    addToast('Task added to Today', '📋');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {greeting}, {data.user?.name?.split(' ')[0] || 'Explorer'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {formatLongDate(todayStr)} · Day one or day hundred, everything you do counts.
          </p>
        </div>
      </div>

      {/* Hero Level & Journey Expedition Card */}
      <div
        onClick={onOpenRoadmap}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white p-5 sm:p-6 shadow-xl cursor-pointer group hover:scale-[1.01] transition-transform"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center font-black text-2xl shadow-inner">
              {levelInfo.level}
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-blue-200 flex items-center gap-1.5">
                <span>The Path of Mastery</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">{levelInfo.title}</h3>
              <p className="text-xs text-blue-100 mt-0.5">
                {levelInfo.progressInLvl} / {levelInfo.xpNeeded} XP to next ascension
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] uppercase tracking-wider text-blue-200 font-bold">Total XP</div>
              <div className="text-base font-black font-mono">{data.stats.totalXp} XP</div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onOpenRoadmap(); }}
              className="px-4 py-2 rounded-2xl bg-white/20 hover:bg-white text-white hover:text-slate-900 text-xs font-bold transition-all border border-white/30 flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Expedition Map</span>
            </button>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="w-full bg-black/20 rounded-full h-2.5 mt-5 overflow-hidden backdrop-blur-sm border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-emerald-300 via-teal-200 to-white rounded-full transition-all duration-700"
            style={{ width: `${levelInfo.percent}%` }}
          />
        </div>
      </div>

      {/* 3 Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/70 dark:border-white/10 rounded-3xl p-4 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-lg">
            ✓
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tasks Completed Today</div>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{todayDoneTasks.length} Done</div>
          </div>
        </div>

        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/70 dark:border-white/10 rounded-3xl p-4 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-lg">
            🔥
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Habit Check-Ins & Streak</div>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{checkedHabitIds.size} Checked · {data.stats.streak}d Streak</div>
          </div>
        </div>

        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/70 dark:border-white/10 rounded-3xl p-4 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-lg">
            ⏱️
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Study Immersion</div>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{todayMinutes}m Today · {totalMinutes}m Total</div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Today's Tasks & Habits/Study */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Today Tasks */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/70 dark:border-white/10 rounded-3xl p-5 shadow-sm flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Today's Tasks</h3>
              </div>
              <button
                onClick={() => setCurrentPage('tasks')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                All Tasks →
              </button>
            </div>

            {/* Inline Quick Add Task */}
            <form onSubmit={handleQuickAddTask} className="flex items-center gap-2 mb-3">
              <input
                type="text"
                placeholder="Quick add a task for today..."
                value={quickTaskTitle}
                onChange={(e) => setQuickTaskTitle(e.target.value)}
                className="flex-1 bg-slate-100 dark:bg-white/5 text-xs px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
              />
              <button
                type="submit"
                className="px-3.5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
              >
                Add
              </button>
            </form>

            {/* Tasks List */}
            <div className="flex flex-col gap-2">
              {todayTasks.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  All clear for today. Take a breath or add a new task!
                </div>
              ) : (
                todayTasks.slice(0, 5).map(task => {
                  const isDone = task.status === 'done';
                  const cat = CATEGORIES[task.category] || CATEGORIES.Personal;

                  return (
                    <div
                      key={task.id}
                      className="p-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 flex items-center justify-between gap-2 transition-all hover:border-slate-300"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <button
                          onClick={() => handleToggleTask(task)}
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 cursor-pointer ${
                            isDone ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 dark:border-white/20'
                          }`}
                        >
                          {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                        <div className="truncate">
                          <div className={`text-xs font-bold truncate ${isDone ? 'line-through text-slate-400' : 'text-slate-800 dark:text-white'}`}>
                            {task.title}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span style={{ color: cat.color }}>{task.category}</span>
                            <span>·</span>
                            <span>{task.priority}</span>
                            {task.dueTime && <span>· ⏰ {task.dueTime}</span>}
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0">
                        +{task.xpValue || 10} XP
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {todayTasks.length > 5 && (
            <button
              onClick={() => setCurrentPage('tasks')}
              className="text-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white pt-2 border-t border-slate-200/50 dark:border-white/5"
            >
              Show {todayTasks.length - 5} more tasks
            </button>
          )}
        </div>

        {/* Right Column: Habits & Study Preview */}
        <div className="flex flex-col gap-6">
          {/* Habits Box */}
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/70 dark:border-white/10 rounded-3xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Habits Today</h3>
              </div>
              <button
                onClick={() => setCurrentPage('habits')}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Manage →
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {data.habits.map(habit => {
                const isChecked = checkedHabitIds.has(habit.id);

                return (
                  <div
                    key={habit.id}
                    className="p-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{habit.emoji}</span>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900 dark:text-white">{habit.name}</div>
                        <div className="text-[10px] text-slate-400">{habit.weeklyTarget}x target per week</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleHabit(habit.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        isChecked
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-300'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>{isChecked ? 'Checked' : 'Check In'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Study Quick Launch Box */}
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/70 dark:border-white/10 rounded-3xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-500" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Active Curriculum</h3>
              </div>
              <button
                onClick={() => setCurrentPage('study')}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
              >
                Study Hub →
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {data.subjects.map(s => {
                const sTopics = data.topics.filter(t => t.subjectId === s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => setCurrentPage('study')}
                    className="p-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 flex-1 min-w-[140px] text-left hover:border-slate-300 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white">{s.name}</span>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    </div>
                    <div className="text-[10px] text-slate-400">{sTopics.length} topics enrolled</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// TASKS VIEW
// ==========================================
function TasksView({ data, setData, onOpenNewTask, awardProgression, addToast }) {
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);

  const filteredTasks = useMemo(() => {
    return data.tasks.filter(t => {
      if (filter === 'todo' && t.status !== 'todo') return false;
      if (filter === 'done' && t.status !== 'done') return false;
      if (filter === 'today' && t.dueDate !== getTodayStr()) return false;
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
      return true;
    });
  }, [data.tasks, filter, categoryFilter]);

  const handleToggleTask = (task) => {
    playTone('tick');
    const isDone = task.status === 'done';
    const newStatus = isDone ? 'todo' : 'done';
    const completedDate = isDone ? null : getTodayStr();

    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === task.id ? { ...t, status: newStatus, completedDate } : t)
    }));

    if (!isDone) {
      const p = PRIORITIES[task.priority] || PRIORITIES.medium;
      awardProgression(p.xp, p.cur, task.title);
      addToast(`Task completed! +${p.xp} XP`, '✨');
    }
  };

  const handleDeleteTask = (taskId) => {
    setData(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== taskId) }));
    addToast('Task deleted', '🗑️');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingTask.title.trim()) return;

    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === editingTask.id ? editingTask : t)
    }));
    setEditingTask(null);
    addToast('Task updated', '✏️');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Task Command</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Structured tasks with priorities, automated repetition, and XP rewards.</p>
        </div>
        <button
          onClick={onOpenNewTask}
          className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-white/70 dark:bg-slate-900/70 border border-slate-200/70 dark:border-white/10 rounded-2xl">
          {['all', 'today', 'todo', 'done'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                filter === f ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-white/70 dark:bg-slate-900/70 border border-slate-200/70 dark:border-white/10 text-xs px-3 py-2 rounded-2xl font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
        >
          <option value="all">All Categories</option>
          {Object.keys(CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 gap-2.5">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs bg-white/40 dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
            No tasks found in this view.
          </div>
        ) : (
          filteredTasks.map(task => {
            const isDone = task.status === 'done';
            const cat = CATEGORIES[task.category] || CATEGORIES.Personal;

            return (
              <div
                key={task.id}
                className="p-4 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/70 dark:border-white/10 shadow-sm flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <button
                    onClick={() => handleToggleTask(task)}
                    className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 cursor-pointer ${
                      isDone ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 dark:border-white/20'
                    }`}
                  >
                    {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                  <div className="truncate">
                    <div className={`text-sm font-extrabold truncate ${isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                      {task.title}
                    </div>
                    {task.notes && <div className="text-xs text-slate-400 truncate mt-0.5">{task.notes}</div>}
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                      <span className="font-bold" style={{ color: cat.color }}>{task.category}</span>
                      <span>·</span>
                      <span className="capitalize">{task.priority}</span>
                      <span>·</span>
                      <span>Due: {task.dueDate}</span>
                      {task.repeat !== 'once' && <span>· 🔁 {task.repeat}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setEditingTask(task)}
                    className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fade-in">
          <div className="bg-white/95 dark:bg-slate-900/95 border border-white/20 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setEditingTask(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">Edit Task</h3>

            <form onSubmit={handleSaveEdit} className="flex flex-col gap-3">
              <input
                type="text"
                required
                value={editingTask.title}
                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                className="bg-slate-100 dark:bg-white/10 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
              <textarea
                rows="2"
                value={editingTask.notes}
                onChange={(e) => setEditingTask({ ...editingTask, notes: e.target.value })}
                className="bg-slate-100 dark:bg-white/10 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={editingTask.dueDate}
                  onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                  className="bg-slate-100 dark:bg-white/10 text-xs px-3 py-2 rounded-xl text-slate-800 dark:text-slate-200"
                />
                <input
                  type="time"
                  value={editingTask.dueTime || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, dueTime: e.target.value })}
                  className="bg-slate-100 dark:bg-white/10 text-xs px-3 py-2 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={editingTask.category}
                  onChange={(e) => setEditingTask({ ...editingTask, category: e.target.value })}
                  className="bg-slate-100 dark:bg-white/10 text-xs px-3 py-2 rounded-xl text-slate-800 dark:text-slate-200"
                >
                  {Object.keys(CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                  value={editingTask.priority}
                  onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                  className="bg-slate-100 dark:bg-white/10 text-xs px-3 py-2 rounded-xl text-slate-800 dark:text-slate-200"
                >
                  {Object.keys(PRIORITIES).map(p => <option key={p} value={p}>{PRIORITIES[p].label}</option>)}
                </select>
              </div>
              <button
                type="submit"
                className="mt-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Save Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// HABITS VIEW (UPGRADED TO 30-DAY STRIP & INLINE EDIT)
// ==========================================
function HabitsView({ data, setData, onOpenNewHabit, awardProgression, addToast }) {
  const todayStr = getTodayStr();
  const checkedHabitIds = new Set(data.habitLogs.filter(l => l.date === todayStr).map(l => l.habitId));
  const [editingHabit, setEditingHabit] = useState(null);

  // 30-day history dates
  const historyDates30 = useMemo(() => {
    const list = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      list.push(d.toISOString().split('T')[0]);
    }
    return list;
  }, []);

  const handleToggleHabit = (habitId) => {
    playTone('tick');
    const isChecked = checkedHabitIds.has(habitId);

    if (isChecked) {
      setData(prev => ({
        ...prev,
        habitLogs: prev.habitLogs.filter(l => !(l.habitId === habitId && l.date === todayStr))
      }));
      addToast('Check-in cleared', '↩️');
    } else {
      setData(prev => ({
        ...prev,
        habitLogs: [...prev.habitLogs, { habitId, date: todayStr }]
      }));
      awardProgression(8, 5, 'Habit check-in');
      addToast('Habit check-in confirmed! +8 XP & +5 Currency', '🔥');
    }
  };

  const handleDeleteHabit = (habitId) => {
    setData(prev => ({
      ...prev,
      habits: prev.habits.filter(h => h.id !== habitId),
      habitLogs: prev.habitLogs.filter(l => l.habitId !== habitId)
    }));
    addToast('Habit removed along with logs', '🗑️');
  };

  const handleUpdateHabit = (e) => {
    e.preventDefault();
    if (!editingHabit.name.trim()) return;
    setData(prev => ({
      ...prev,
      habits: prev.habits.map(h => h.id === editingHabit.id ? editingHabit : h)
    }));
    setEditingHabit(null);
    addToast('Habit updated', '✏️');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Habit Tracker</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Consistency turns actions into identity. Track streaks across full 30-day consistency strips.</p>
        </div>
        <button
          onClick={onOpenNewHabit}
          className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Habit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {data.habits.map(habit => {
          const isCheckedToday = checkedHabitIds.has(habit.id);
          const habitLogsSet = new Set(data.habitLogs.filter(l => l.habitId === habit.id).map(l => l.date));
          const monthCheckIns = historyDates30.filter(d => habitLogsSet.has(d)).length;

          return (
            <div
              key={habit.id}
              className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/70 dark:border-white/10 rounded-3xl p-5 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-5"
            >
              {/* Habit Header & Emoji */}
              <div className="flex items-center gap-3.5">
                <button
                  onClick={() => setEditingHabit(habit)}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white/20 hover:scale-105 transition-transform"
                  style={{ backgroundColor: `${habit.color}22` }}
                  title="Click to edit habit"
                >
                  {habit.emoji}
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{habit.name}</h4>
                    <button
                      onClick={() => setEditingHabit(habit)}
                      className="p-1 text-slate-400 hover:text-blue-500 transition-colors"
                      title="Edit Habit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span>Frequency: {habit.frequency}</span>
                    <span>·</span>
                    <span>Weekly Target: {habit.weeklyTarget}x</span>
                    <span>·</span>
                    <span className="text-emerald-500 font-semibold">{monthCheckIns}/30 days checked</span>
                  </div>
                </div>
              </div>

              {/* 30-Day Consistency Strip */}
              <div className="flex flex-col gap-1.5 self-start xl:self-center overflow-x-auto max-w-full pb-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>30-Day Consistency Strip</span>
                  <span>{monthCheckIns} check-ins</span>
                </div>
                <div className="flex items-center gap-1">
                  {historyDates30.map(date => {
                    const logged = habitLogsSet.has(date);
                    const isToday = date === todayStr;
                    return (
                      <div
                        key={date}
                        title={`${date}: ${logged ? 'Checked' : 'Missed'}`}
                        className={`w-3.5 sm:w-4 h-6 sm:h-7 rounded-md transition-all flex items-center justify-center text-[8px] font-bold ${
                          logged
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : 'bg-slate-200 dark:bg-white/10 text-transparent'
                        } ${isToday ? 'ring-1.5 ring-blue-500' : ''}`}
                      >
                        {logged ? '✓' : ''}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 self-end xl:self-center">
                <button
                  onClick={() => handleToggleHabit(habit.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isCheckedToday
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                      : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isCheckedToday ? 'Checked Today' : 'Check In'}</span>
                </button>

                <button
                  onClick={() => handleDeleteHabit(habit.id)}
                  className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                  title="Delete habit"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Habit Modal */}
      {editingHabit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fade-in">
          <div className="bg-white/95 dark:bg-slate-900/95 border border-white/20 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setEditingHabit(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">Edit Habit Configuration</h3>

            <form onSubmit={handleUpdateHabit} className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editingHabit.emoji}
                  onChange={(e) => setEditingHabit({ ...editingHabit, emoji: e.target.value })}
                  className="w-12 text-center text-xl bg-slate-100 dark:bg-white/10 px-2 py-2 rounded-xl"
                />
                <input
                  type="text"
                  required
                  value={editingHabit.name}
                  onChange={(e) => setEditingHabit({ ...editingHabit, name: e.target.value })}
                  className="flex-1 bg-slate-100 dark:bg-white/10 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {SWATCHES.map(sw => (
                  <button
                    key={sw}
                    type="button"
                    onClick={() => setEditingHabit({ ...editingHabit, color: sw })}
                    className={`w-6 h-6 rounded-full border ${editingHabit.color === sw ? 'ring-2 ring-white scale-110' : ''}`}
                    style={{ backgroundColor: sw }}
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <select
                  value={editingHabit.frequency}
                  onChange={(e) => setEditingHabit({ ...editingHabit, frequency: e.target.value })}
                  className="bg-slate-100 dark:bg-white/10 text-xs px-3 py-2 rounded-xl text-slate-800 dark:text-slate-200"
                >
                  <option value="daily">Daily</option>
                  <option value="weekdays">Weekdays</option>
                  <option value="custom">Custom</option>
                </select>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={editingHabit.weeklyTarget}
                  onChange={(e) => setEditingHabit({ ...editingHabit, weeklyTarget: Number(e.target.value) })}
                  className="bg-slate-100 dark:bg-white/10 text-xs px-3 py-2 rounded-xl text-slate-800 dark:text-slate-200"
                  placeholder="Target x / wk"
                />
              </div>

              <button
                type="submit"
                className="mt-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// CALENDAR VIEW (FULL MONTH NAVIGATION & INLINE EDITING)
// ==========================================
function CalendarView({ data, setData, awardProgression, addToast }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(getTodayStr());
  const [editingTask, setEditingTask] = useState(null);
  const [quickNewTaskTitle, setQuickNewTaskTitle] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Full Month Days Generation
  const monthDays = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const monthStr = (month + 1).toString().padStart(2, '0');
      const dayStr = i.toString().padStart(2, '0');
      days.push(`${year}-${monthStr}-${dayStr}`);
    }
    return days;
  }, [year, month]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleTodayJump = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDay(getTodayStr());
  };

  const selectedDayTasks = data.tasks.filter(t => t.dueDate === selectedDay || t.completedDate === selectedDay);
  const selectedDayHabits = data.habitLogs.filter(l => l.date === selectedDay);
  const selectedDaySessions = data.studySessions.filter(s => s.date === selectedDay);

  const handleToggleTaskStatus = (task) => {
    playTone('tick');
    const isDone = task.status === 'done';
    const newStatus = isDone ? 'todo' : 'done';
    const completedDate = isDone ? null : selectedDay;

    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === task.id ? { ...t, status: newStatus, completedDate } : t)
    }));

    if (!isDone) {
      const p = PRIORITIES[task.priority] || PRIORITIES.medium;
      awardProgression(p.xp, p.cur, `Task on ${selectedDay}`);
      addToast(`Task completed! +${p.xp} XP`, '✨');
    }
  };

  const handleDeleteTask = (taskId) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId)
    }));
    addToast('Task removed from agenda', '🗑️');
  };

  const handleQuickAddDayTask = (e) => {
    e.preventDefault();
    if (!quickNewTaskTitle.trim()) return;

    const newTask = {
      id: 'task_' + Math.random().toString(36).substr(2, 9),
      title: quickNewTaskTitle.trim(),
      notes: `Scheduled directly on ${selectedDay}`,
      dueDate: selectedDay,
      dueTime: '12:00',
      priority: 'medium',
      category: 'Personal',
      status: 'todo',
      repeat: 'once',
      xpValue: 10,
      completedDate: null
    };

    setData(prev => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
    setQuickNewTaskTitle('');
    addToast(`Task scheduled for ${selectedDay}`, '📅');
  };

  const handleSaveEditTask = (e) => {
    e.preventDefault();
    if (!editingTask.title.trim()) return;

    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === editingTask.id ? editingTask : t)
    }));
    setEditingTask(null);
    addToast('Task details updated', '✏️');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Calendar Header with Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Calendar & Schedule</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">View tasks, habits, and study blocks across all months. Click any day to edit.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTodayJump}
            className="px-3 py-1.5 rounded-xl bg-white/70 dark:bg-white/10 hover:bg-white text-xs font-bold border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white transition-all shadow-sm"
          >
            Today
          </button>
          <div className="flex items-center bg-white/70 dark:bg-slate-900/70 border border-slate-200/70 dark:border-white/10 rounded-2xl p-1 shadow-sm">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-extrabold px-3 text-slate-800 dark:text-white min-w-[120px] text-center">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Full Month Grid */}
        <div className="lg:col-span-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/70 dark:border-white/10 rounded-3xl p-5 shadow-sm">
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-[10px] font-bold text-center text-slate-400 uppercase py-1">
                {d}
              </div>
            ))}
            {monthDays.map((dateStr, idx) => {
              if (!dateStr) {
                return <div key={`empty-${idx}`} className="min-h-[70px] sm:min-h-[85px] rounded-2xl bg-transparent opacity-10" />;
              }

              const dayNum = parseInt(dateStr.split('-')[2], 10);
              const dayTasks = data.tasks.filter(t => t.dueDate === dateStr || t.completedDate === dateStr);
              const dayHabits = data.habitLogs.filter(l => l.date === dateStr);
              const dayMinutes = data.studySessions.filter(s => s.date === dateStr).reduce((acc, s) => acc + s.minutes, 0);
              const isSelected = selectedDay === dateStr;
              const isToday = dateStr === getTodayStr();

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDay(dateStr)}
                  className={`min-h-[70px] sm:min-h-[85px] p-2 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-500/10'
                      : 'border-slate-200/60 dark:border-white/5 bg-white/40 dark:bg-white/5 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-xs font-bold ${isToday ? 'text-blue-500 font-black' : 'text-slate-800 dark:text-slate-200'}`}>
                      {dayNum}
                    </span>
                    {dayMinutes > 0 && (
                      <span className="text-[9px] font-mono text-purple-400 font-bold">
                        {dayMinutes}m
                      </span>
                    )}
                  </div>

                  {/* Summary badges on cell */}
                  <div className="flex flex-col gap-1 w-full mt-1">
                    {/* Task dots */}
                    {dayTasks.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap">
                        {dayTasks.slice(0, 3).map(t => {
                          const cat = CATEGORIES[t.category] || CATEGORIES.Personal;
                          return (
                            <span
                              key={t.id}
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: cat.color }}
                              title={t.title}
                            />
                          );
                        })}
                        {dayTasks.length > 3 && (
                          <span className="text-[8px] font-bold text-slate-400">+{dayTasks.length - 3}</span>
                        )}
                      </div>
                    )}

                    {/* Habit icons indicator */}
                    {dayHabits.length > 0 && (
                      <div className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5">
                        <span>🔥</span>
                        <span>{dayHabits.length}</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda & Direct Editing Drawer */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/70 dark:border-white/10 rounded-3xl p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-500">Day Agenda & Actions</div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">{formatLongDate(selectedDay)}</h4>
            </div>
          </div>

          {/* Inline Quick Add Task for Selected Date */}
          <form onSubmit={handleQuickAddDayTask} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Add task for ${selectedDay}...`}
              value={quickNewTaskTitle}
              onChange={(e) => setQuickNewTaskTitle(e.target.value)}
              className="flex-1 bg-slate-100 dark:bg-white/5 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shrink-0"
            >
              Add
            </button>
          </form>

          {/* Tasks on this day with edit/delete controls */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
              <span>Tasks ({selectedDayTasks.length})</span>
            </div>

            {selectedDayTasks.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">No tasks scheduled for this day.</p>
            ) : (
              selectedDayTasks.map(t => {
                const isDone = t.status === 'done';
                const cat = CATEGORIES[t.category] || CATEGORIES.Personal;

                return (
                  <div
                    key={t.id}
                    className="p-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <button
                        onClick={() => handleToggleTaskStatus(t)}
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isDone ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                        }`}
                      >
                        {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>
                      <div className="truncate">
                        <div className={`text-xs font-bold truncate ${isDone ? 'line-through text-slate-400' : 'text-slate-800 dark:text-white'}`}>
                          {t.title}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span style={{ color: cat.color }}>{t.category}</span>
                          <span>·</span>
                          <span>{t.priority}</span>
                          {t.dueTime && <span>· ⏰ {t.dueTime}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setEditingTask(t)}
                        className="p-1 text-slate-400 hover:text-blue-500 transition-colors"
                        title="Edit Task"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(t.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {/* Habits checked on this day */}
            <div className="text-xs font-bold text-slate-400 uppercase mt-2">
              Habits Checked ({selectedDayHabits.length})
            </div>
            {selectedDayHabits.length === 0 ? (
              <p className="text-xs text-slate-400">No habit check-ins logged on this date.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {selectedDayHabits.map((l, i) => {
                  const habit = data.habits.find(h => h.id === l.habitId);
                  return (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20 flex items-center gap-1"
                    >
                      <span>{habit?.emoji || '🔥'}</span>
                      <span>{habit?.name || 'Habit'}</span>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Study sessions */}
            <div className="text-xs font-bold text-slate-400 uppercase mt-2">
              Study Sessions ({selectedDaySessions.length})
            </div>
            {selectedDaySessions.length === 0 ? (
              <p className="text-xs text-slate-400">No study sessions recorded.</p>
            ) : (
              selectedDaySessions.map(s => (
                <div key={s.id} className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
                  <div className="font-bold text-purple-600 dark:text-purple-300">{s.notes}</div>
                  <div className="text-[10px] text-purple-400 mt-0.5">{s.minutes} minutes logged</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fade-in">
          <div className="bg-white/95 dark:bg-slate-900/95 border border-white/20 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setEditingTask(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">Edit Task</h3>

            <form onSubmit={handleSaveEditTask} className="flex flex-col gap-3">
              <input
                type="text"
                required
                value={editingTask.title}
                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                className="bg-slate-100 dark:bg-white/10 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
              <textarea
                rows="2"
                value={editingTask.notes}
                onChange={(e) => setEditingTask({ ...editingTask, notes: e.target.value })}
                className="bg-slate-100 dark:bg-white/10 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={editingTask.dueDate}
                  onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                  className="bg-slate-100 dark:bg-white/10 text-xs px-3 py-2 rounded-xl text-slate-800 dark:text-slate-200"
                />
                <input
                  type="time"
                  value={editingTask.dueTime || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, dueTime: e.target.value })}
                  className="bg-slate-100 dark:bg-white/10 text-xs px-3 py-2 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={editingTask.category}
                  onChange={(e) => setEditingTask({ ...editingTask, category: e.target.value })}
                  className="bg-slate-100 dark:bg-white/10 text-xs px-3 py-2 rounded-xl text-slate-800 dark:text-slate-200"
                >
                  {Object.keys(CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                  value={editingTask.priority}
                  onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                  className="bg-slate-100 dark:bg-white/10 text-xs px-3 py-2 rounded-xl text-slate-800 dark:text-slate-200"
                >
                  {Object.keys(PRIORITIES).map(p => <option key={p} value={p}>{PRIORITIES[p].label}</option>)}
                </select>
              </div>
              <button
                type="submit"
                className="mt-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Save Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// STUDY HUB (FOLDER-BASED SUBJECTS & TOPICS)
// ==========================================
function StudyHubView({ data, setData, onOpenNewSubject, onOpenNewNote, awardProgression, addToast }) {
  const [selectedSubjectId, setSelectedSubjectId] = useState(data.subjects[0]?.id || '');
  const [selectedTopicId, setSelectedTopicId] = useState(data.topics[0]?.id || '');
  const [selectedPlanId, setSelectedPlanId] = useState('pomodoro');
  const [showPlanSelector, setShowPlanSelector] = useState(false);

  const activePlan = useMemo(() => {
    return STUDY_PLANS.find(p => p.id === selectedPlanId) || STUDY_PLANS[0];
  }, [selectedPlanId]);

  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(activePlan.focusMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  // Active testing modal state
  const [testingTopic, setTestingTopic] = useState(null);
  const [quizMode, setQuizMode] = useState(null); // 'ai' | 'create'
  const [aiQuizQuestions, setAiQuizQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  // Custom User Quiz Creator State
  const [customQText, setCustomQText] = useState('');
  const [customOptionA, setCustomOptionA] = useState('');
  const [customOptionB, setCustomOptionB] = useState('');
  const [customOptionC, setCustomOptionC] = useState('');
  const [customOptionD, setCustomOptionD] = useState('');
  const [customCorrectIdx, setCustomCorrectIdx] = useState(0);

  // Inline topic creation
  const [newTopicName, setNewTopicName] = useState('');

  const handleSelectPlan = (planId) => {
    setSelectedPlanId(planId);
    const p = STUDY_PLANS.find(x => x.id === planId) || STUDY_PLANS[0];
    setIsRunning(false);
    setMode('focus');
    setTimeLeft(p.focusMinutes * 60);
    playTone('tick');
    addToast(`Switched to ${p.name}`, '⏱️');
  };

  // Timer Tick & Completion logic
  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      playTone('unlock');

      if (mode === 'focus') {
        const completedMinutes = activePlan.focusMinutes;
        const newSession = {
          id: 'ses_' + Math.random().toString(36).substr(2, 9),
          subjectId: selectedSubjectId,
          topicId: selectedTopicId,
          date: getTodayStr(),
          minutes: completedMinutes,
          notes: `Completed ${activePlan.name} focus session.`
        };

        setData(prev => ({
          ...prev,
          studySessions: [newSession, ...prev.studySessions],
          topics: prev.topics.map(t => t.id === selectedTopicId ? { ...t, lastStudied: getTodayStr() } : t)
        }));

        const xpGained = Math.round(completedMinutes * 0.5);
        awardProgression(xpGained, 10, `${activePlan.name} Session`);
        addToast(`Focus sprint done! Logged ${completedMinutes}m (+${xpGained} XP). Rest time!`, '🎉');

        setMode('break');
        setTimeLeft(activePlan.breakMinutes * 60);
      } else {
        addToast('Break concluded! Your brain is primed for the next focus sprint.', '☕');
        setMode('focus');
        setTimeLeft(activePlan.focusMinutes * 60);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode, selectedSubjectId, selectedTopicId, activePlan]);

  const handleMarkTopicCompleted = (topic) => {
    playTone('tick');
    setTestingTopic(topic);
    setQuizMode(null);
    setQuizResult(null);
  };

  const handleManualSetMastery = (topicId, newStatus) => {
    setData(prev => ({
      ...prev,
      topics: prev.topics.map(t => t.id === topicId ? { ...t, status: newStatus } : t)
    }));
    addToast(`Mastery status updated to ${newStatus.toUpperCase()}`, '🎓');
  };

  const startGeneratedQuiz = (topic) => {
    const questions = [
      {
        id: 1,
        question: `What is the primary operational objective of "${topic.name}"?`,
        options: [
          `Guaranteeing invariant safety and structured reproducibility across state changes.`,
          `Functioning as an unverified cosmetic mockup without validation logic.`,
          `Emitting random packet heartbeats with no state coordination.`,
          `Disregarding distributed consensus in favor of single-node bottlenecks.`
        ],
        correct: 0,
        concept: "Fundamental Foundation"
      },
      {
        id: 2,
        question: `Under elevated concurrency constraints, how does ${topic.name} prevent split-brain states?`,
        options: [
          `Enforcing strict majority quorum and monotonic term leader leases.`,
          `Ignoring network partitions and proceeding without acknowledgment.`,
          `Arbitrarily dropping half the database records during timeout peaks.`,
          `Broadcasting unencrypted write operations over public ports.`
        ],
        correct: 0,
        concept: "Fault Tolerance"
      },
      {
        id: 3,
        question: `What is the optimal study and verification protocol to retain ${topic.name}?`,
        options: [
          `Pure passive highlighting without self-testing.`,
          `Active retrieval practice, Feynman explanation, and failure mode analysis.`,
          `Re-reading the syllabus once every six months.`,
          `Skipping boundary test cases during verification.`
        ],
        correct: 1,
        concept: "Retention & Synthesis"
      }
    ];

    setAiQuizQuestions(questions);
    setUserAnswers({});
    setQuizResult(null);
    setQuizMode('ai');
    playTone('tick');
  };

  const handleCreateCustomQuiz = (e) => {
    e.preventDefault();
    if (!customQText.trim() || !customOptionA.trim() || !customOptionB.trim()) return;

    const customQuestions = [
      {
        id: 1,
        question: customQText.trim(),
        options: [customOptionA.trim(), customOptionB.trim(), customOptionC.trim() || 'None of the above', customOptionD.trim() || 'All of the above'],
        correct: Number(customCorrectIdx),
        concept: "Active Recall Verification"
      }
    ];

    setAiQuizQuestions(customQuestions);
    setUserAnswers({});
    setQuizResult(null);
    setQuizMode('ai');
    playTone('success');
    addToast('Custom question crafted! Answer it below.', '✍️');
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    const missed = [];

    aiQuizQuestions.forEach(q => {
      if (userAnswers[q.id] === q.correct) {
        score++;
      } else {
        missed.push(q.concept);
      }
    });

    const isMastered = score === aiQuizQuestions.length;
    const newStatus = isMastered ? 'mastered' : score > 0 ? 'confident' : 'learning';

    setData(prev => ({
      ...prev,
      topics: prev.topics.map(t => t.id === testingTopic.id ? {
        ...t,
        status: newStatus,
        confidence: isMastered ? 5 : Math.max(3, t.confidence + 1),
        lastStudied: getTodayStr()
      } : t),
      quizAttempts: [
        {
          id: 'q_' + Math.random().toString(36).substr(2, 9),
          subjectId: testingTopic.subjectId,
          topicId: testingTopic.id,
          date: getTodayStr(),
          score,
          total: aiQuizQuestions.length,
          difficulty: 'adaptive',
          feedback: isMastered
            ? `Comprehensive mastery validated! "${testingTopic.name}" promoted to ${newStatus.toUpperCase()}.`
            : `Solid effort! Scored ${score}/${aiQuizQuestions.length}. Topic updated to ${newStatus.toUpperCase()}.`,
          missedConcepts: missed
        },
        ...prev.quizAttempts
      ]
    }));

    const xpEarned = score * 20 + (isMastered ? 30 : 10);
    awardProgression(xpEarned, isMastered ? 25 : 10, `Mastery Quiz: ${testingTopic.name}`);
    setQuizResult({ score, total: aiQuizQuestions.length, isMastered, newStatus, missed });
    playTone(isMastered ? 'unlock' : 'success');
  };

  const handleAddTopic = (e) => {
    e.preventDefault();
    if (!newTopicName.trim() || !selectedSubjectId) return;

    const newTop = {
      id: 'top_' + Math.random().toString(36).substr(2, 9),
      subjectId: selectedSubjectId,
      name: newTopicName.trim(),
      confidence: 1,
      status: 'to learn',
      notes: 'Initial topic formulation',
      lastStudied: getTodayStr()
    };

    setData(prev => ({ ...prev, topics: [...prev.topics, newTop] }));
    setNewTopicName('');
    addToast('Topic added to subject syllabus', '🌱');
  };

  const activeSubject = data.subjects.find(s => s.id === selectedSubjectId) || data.subjects[0];
  const activeSubjectTopics = data.topics.filter(t => t.subjectId === selectedSubjectId);

  const subjectMasteryPercent = useMemo(() => {
    if (activeSubjectTopics.length === 0) return 0;
    const totalScore = activeSubjectTopics.reduce((acc, t) => {
      if (t.status === 'mastered') return acc + 100;
      if (t.status === 'confident') return acc + 75;
      if (t.status === 'learning') return acc + 40;
      return acc + 10;
    }, 0);
    return Math.round(totalScore / activeSubjectTopics.length);
  }, [activeSubjectTopics]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Study & Mastery Hub</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Integrated science-backed focus timers, topic syllabi, and active mastery testing.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewSubject}
            className="px-3.5 py-2 rounded-2xl bg-white/70 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-slate-800 dark:text-white text-xs font-bold border border-slate-200 dark:border-white/10 flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Subject</span>
          </button>
          <button
            onClick={onOpenNewNote}
            className="px-3.5 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* CHOOSE YOUR STUDY PLAN HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-white/20 text-white p-5 sm:p-7 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl shadow-inner">
              {activePlan.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300">Evidence-Based Interval</span>
                {activePlan.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    {activePlan.badge}
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">{activePlan.name}</h3>
              <p className="text-xs text-slate-300 mt-0.5">{activePlan.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowPlanSelector(!showPlanSelector)}
              className="px-4 py-2 rounded-2xl bg-white/20 hover:bg-white text-white hover:text-slate-900 text-xs font-bold transition-all border border-white/30 flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showPlanSelector ? 'Hide Study Plans' : 'Choose Your Study Plan'}</span>
            </button>
          </div>
        </div>

        {/* Current Plan Overview / Tip */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Why this works:</strong> {activePlan.description}
              {activePlan.protocolTip && (
                <div className="text-[11px] text-blue-300 mt-1"><strong>Best Practice Tip:</strong> {activePlan.protocolTip}</div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
            <span className="font-mono font-bold text-emerald-400">{activePlan.focusMinutes}m Focus</span>
            <span className="text-slate-400">/</span>
            <span className="font-mono font-bold text-amber-400">{activePlan.breakMinutes}m Rest</span>
          </div>
        </div>

        {/* Expandable Study Plan Catalog */}
        {showPlanSelector && (
          <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Select an Evidence-Based Interval Protocol
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {STUDY_PLANS.map(plan => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <button
                    key={plan.id}
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/30 border-blue-400 ring-2 ring-blue-400/50 shadow-lg'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{plan.icon}</span>
                        <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-white/10 text-white">
                          {plan.focusMinutes}m / {plan.breakMinutes}m
                        </span>
                      </div>
                      <div className="text-sm font-extrabold text-white">{plan.name}</div>
                      <div className="text-[11px] text-slate-300 mt-1 line-clamp-2">{plan.tagline}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* TIMER & CONTEXT SELECTOR */}
      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/70 dark:border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-lg relative">
        <div className="flex items-center gap-2 p-1.5 bg-slate-200/60 dark:bg-white/10 rounded-2xl mb-4">
          <button
            onClick={() => {
              setIsRunning(false);
              setMode('focus');
              setTimeLeft(activePlan.focusMinutes * 60);
            }}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'focus' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Focus ({activePlan.focusMinutes}m)
          </button>
          <button
            onClick={() => {
              setIsRunning(false);
              setMode('break');
              setTimeLeft(activePlan.breakMinutes * 60);
            }}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'break' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Rest Break ({activePlan.breakMinutes}m)
          </button>
        </div>

        {/* Live Timer Display */}
        <div className="text-6xl sm:text-7xl font-mono font-black tracking-tight text-slate-900 dark:text-white my-2 select-none">
          {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>

        {/* Subject & Topic Assignment */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 max-w-lg">
          <span className="text-[11px] font-bold text-slate-400">Targeting:</span>
          <select
            value={selectedSubjectId}
            onChange={(e) => {
              setSelectedSubjectId(e.target.value);
              const firstTopic = data.topics.find(t => t.subjectId === e.target.value);
              setSelectedTopicId(firstTopic ? firstTopic.id : '');
            }}
            className="bg-slate-100 dark:bg-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none"
          >
            {data.subjects.map(sub => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>

          <select
            value={selectedTopicId}
            onChange={(e) => setSelectedTopicId(e.target.value)}
            className="bg-slate-100 dark:bg-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none max-w-[200px] truncate"
          >
            {activeSubjectTopics.length === 0 ? (
              <option value="">No specific topic</option>
            ) : (
              activeSubjectTopics.map(top => (
                <option key={top.id} value={top.id}>{top.name} ({top.status})</option>
              ))
            )}
          </select>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playTone('tick');
              setIsRunning(!isRunning);
            }}
            className={`px-7 py-3 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isRunning ? 'Pause Flow' : mode === 'focus' ? 'Start Focus Sprint' : 'Start Rest Break'}</span>
          </button>

          <button
            onClick={() => {
              playTone('tick');
              setIsRunning(false);
              setTimeLeft((mode === 'focus' ? activePlan.focusMinutes : activePlan.breakMinutes) * 60);
            }}
            className="p-3 rounded-2xl bg-slate-200/60 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-white/20 transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SUBJECT FOLDERS & TOPIC MASTERY SYLLABUS SECTION */}
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Subject Curriculum & Topic Folders</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Click a subject folder to view and test all concepts under that discipline.</p>
        </div>

        {/* Subject Folder Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {data.subjects.map(s => {
            const isSelected = selectedSubjectId === s.id;
            const sTopics = data.topics.filter(t => t.subjectId === s.id);
            const masteredCount = sTopics.filter(t => t.status === 'mastered').length;

            return (
              <div
                key={s.id}
                onClick={() => setSelectedSubjectId(s.id)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                    : 'bg-white/50 dark:bg-white/5 border-slate-200/60 dark:border-white/5 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isSelected ? <FolderOpen className="w-5 h-5 text-blue-500" /> : <Folder className="w-5 h-5 text-slate-400" />}
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{s.name}</h4>
                  </div>
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{s.description}</p>
                <div className="mt-3 pt-2 border-t border-slate-200/40 dark:border-white/5 flex items-center justify-between text-[10px] font-bold text-slate-400">
                  <span>{sTopics.length} Topics</span>
                  <span className="text-emerald-500">{masteredCount} Mastered</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Subject Card with Mastery Ring & Details */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/70 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/50 dark:border-white/10">
            <div className="flex items-center gap-3.5">
              <span
                className="w-4 h-4 rounded-full shrink-0"
                style={{ backgroundColor: activeSubject.color }}
              />
              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{activeSubject.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{activeSubject.description}</p>
              </div>
            </div>

            {/* Subject Mastery Degree Progress Bar */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Subject Mastery</div>
                <div className="text-sm font-black text-slate-900 dark:text-white">{subjectMasteryPercent}% Complete</div>
              </div>
              <div className="w-16 bg-slate-200 dark:bg-white/10 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${subjectMasteryPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Inline Add Topic Form */}
          <form onSubmit={handleAddTopic} className="flex items-center gap-2 mt-4 mb-4">
            <input
              type="text"
              placeholder={`Add a new concept or topic to ${activeSubject.name}...`}
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              className="flex-1 bg-slate-100 dark:bg-white/5 text-xs px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shrink-0 shadow-sm cursor-pointer"
            >
              Add Topic
            </button>
          </form>

          {/* Topics List with Mastery Degree Selection & Testing Option */}
          <div className="flex flex-col gap-2.5">
            {activeSubjectTopics.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No topics defined yet for this subject. Add your first above!</p>
            ) : (
              activeSubjectTopics.map(topic => {
                const rank = getMasteryRankInfo(topic.status);
                const isMastered = topic.status === 'mastered';

                return (
                  <div
                    key={topic.id}
                    className="bg-white/50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:border-slate-300 dark:hover:border-white/15"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isMastered ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-200 dark:bg-white/10 text-slate-400'
                      }`}>
                        {isMastered ? '★' : '○'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-800 dark:text-white">{topic.name}</span>

                          {/* Editable Mastery Selector */}
                          <select
                            value={topic.status}
                            onChange={(e) => handleManualSetMastery(topic.id, e.target.value)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border bg-transparent cursor-pointer ${rank.color}`}
                          >
                            <option value="to learn">To Learn (15%)</option>
                            <option value="learning">Learning (45%)</option>
                            <option value="confident">Confident (75%)</option>
                            <option value="mastered">Mastered (100%)</option>
                          </select>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {topic.notes || 'Core topic concepts'} · Last studied: {topic.lastStudied || 'Not yet'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => handleMarkTopicCompleted(topic)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Completed this topic? Click to test your understanding with a quiz!"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Test Understanding</span>
                      </button>

                      <button
                        onClick={() => {
                          setData(prev => ({
                            ...prev,
                            topics: prev.topics.filter(t => t.id !== topic.id)
                          }));
                          addToast('Topic removed', '🗑️');
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                        title="Delete topic"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* QUIZ AND MASTERY MODAL */}
      {testingTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fade-in">
          <div className="bg-white/95 dark:bg-slate-900/95 border border-white/20 rounded-3xl p-6 sm:p-7 max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => { setTestingTopic(null); setQuizMode(null); }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Step 1: Choose Test Format */}
            {!quizMode && (
              <div className="flex flex-col gap-4 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-2xl text-white shadow-lg">
                  🎓
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-500">Knowledge Retention & Mastery Check</div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                    Ready to test your understanding of "{testingTopic.name}"?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Demonstrating retention advances this topic to <strong>Confident</strong> or <strong>Mastered</strong> (+XP & Silvs rewards).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-left">
                  {/* Generated Quiz Option */}
                  <div
                    onClick={() => startGeneratedQuiz(testingTopic)}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-blue-500 bg-white/50 dark:bg-white/5 hover:bg-blue-500/10 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-2xl mb-2">⚡</div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-500">
                        Take Generated Quiz
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Instant 3-question evaluation calibrated to this topic's invariants and failure modes.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-3 flex items-center gap-1">
                      Start Test <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {/* Make Your Own Quiz Option */}
                  <div
                    onClick={() => setQuizMode('create')}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-indigo-500 bg-white/50 dark:bg-white/5 hover:bg-indigo-500/10 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-2xl mb-2">✍️</div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-500">
                        Make Your Own Quiz
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Formulate your own active recall question and multiple choice answers to cement memory.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-3 flex items-center gap-1">
                      Craft Question <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Step 2A: Create Your Own Quiz */}
            {quizMode === 'create' && (
              <form onSubmit={handleCreateCustomQuiz} className="flex flex-col gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Feynman Technique / Self-Testing</span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Formulate Your Recall Question</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Topic: <strong>{testingTopic.name}</strong></p>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Question Prompt</label>
                  <textarea
                    rows="2"
                    required
                    value={customQText}
                    onChange={(e) => setCustomQText(e.target.value)}
                    placeholder="e.g. Under what conditions will leader election fail in this setup?"
                    className="w-full mt-1 bg-slate-100 dark:bg-white/10 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Options (Select the correct one)</label>
                  <div className="flex items-center gap-2">
                    <input type="radio" name="correct" checked={customCorrectIdx === 0} onChange={() => setCustomCorrectIdx(0)} />
                    <input
                      type="text"
                      required
                      placeholder="Option A (Correct or Distractor)"
                      value={customOptionA}
                      onChange={(e) => setCustomOptionA(e.target.value)}
                      className="flex-1 bg-slate-100 dark:bg-white/10 text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="radio" name="correct" checked={customCorrectIdx === 1} onChange={() => setCustomCorrectIdx(1)} />
                    <input
                      type="text"
                      required
                      placeholder="Option B (Correct or Distractor)"
                      value={customOptionB}
                      onChange={(e) => setCustomOptionB(e.target.value)}
                      className="flex-1 bg-slate-100 dark:bg-white/10 text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="radio" name="correct" checked={customCorrectIdx === 2} onChange={() => setCustomCorrectIdx(2)} />
                    <input
                      type="text"
                      placeholder="Option C"
                      value={customOptionC}
                      onChange={(e) => setCustomOptionC(e.target.value)}
                      className="flex-1 bg-slate-100 dark:bg-white/10 text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="radio" name="correct" checked={customCorrectIdx === 3} onChange={() => setCustomCorrectIdx(3)} />
                    <input
                      type="text"
                      placeholder="Option D"
                      value={customOptionD}
                      onChange={(e) => setCustomOptionD(e.target.value)}
                      className="flex-1 bg-slate-100 dark:bg-white/10 text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setQuizMode(null)}
                    className="w-1/3 py-2.5 rounded-2xl bg-slate-200 dark:bg-white/10 text-xs font-bold text-slate-600 dark:text-slate-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 shadow-md transition-colors"
                  >
                    Save & Test Now
                  </button>
                </div>
              </form>
            )}

            {/* Modal Step 2B: Take Active Quiz */}
            {quizMode === 'ai' && !quizResult && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">Assessment in Progress</span>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Testing: {testingTopic.name}</h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {Object.keys(userAnswers).length} / {aiQuizQuestions.length} answered
                  </span>
                </div>

                <div className="flex flex-col gap-5">
                  {aiQuizQuestions.map((q, idx) => (
                    <div key={q.id} className="flex flex-col gap-2.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {idx + 1}. {q.question}
                      </h4>
                      <div className="flex flex-col gap-1.5">
                        {q.options.map((opt, optIdx) => {
                          const isPicked = userAnswers[q.id] === optIdx;
                          return (
                            <button
                              key={optIdx}
                              onClick={() => setUserAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                              className={`text-left px-3.5 py-2 rounded-xl text-xs transition-all border ${
                                isPicked
                                  ? 'bg-blue-600/15 border-blue-500 text-blue-600 dark:text-blue-300 font-bold'
                                  : 'bg-slate-100/60 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(userAnswers).length < aiQuizQuestions.length}
                  className="w-full py-3 rounded-2xl bg-blue-600 text-white text-xs font-bold disabled:opacity-50 hover:bg-blue-500 transition-colors shadow-md cursor-pointer"
                >
                  Grade & Elevate Topic Mastery
                </button>
              </div>
            )}

            {/* Modal Step 3: Evaluation & Mastery Result */}
            {quizResult && (
              <div className="flex flex-col gap-4 text-center">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-3xl shadow-lg">
                  {quizResult.isMastered ? '🏆' : '📈'}
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500">
                    Mastery Degree Updated
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    {quizResult.isMastered ? 'Mastery Confirmed!' : 'Understanding Recorded!'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Score: <strong>{quizResult.score} / {quizResult.total}</strong> · New Status: <span className="font-bold uppercase text-blue-500">{quizResult.newStatus}</span>
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>🪙 Silvs & XP Awarded to your wallet and progress roadmap</span>
                </div>

                {quizResult.missed.length > 0 && (
                  <div className="text-left bg-slate-100 dark:bg-white/5 p-3 rounded-2xl text-xs">
                    <span className="font-bold text-slate-400 uppercase text-[10px]">Review Focus Areas:</span>
                    <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 mt-1">
                      {quizResult.missed.map((m, i) => <li key={i}>{m}</li>)}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => { setTestingTopic(null); setQuizMode(null); setQuizResult(null); }}
                  className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold cursor-pointer"
                >
                  Done & Return to Hub
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// KNOWLEDGE LIBRARY WITH SUBJECT & TOPIC FOLDERS
// ==========================================
function LibraryView({ data, setData, onOpenNewNote, addToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolderSubjectId, setSelectedFolderSubjectId] = useState('all');

  const filteredNotes = data.studyNotes.filter(note => {
    if (selectedFolderSubjectId !== 'all' && note.subjectId !== selectedFolderSubjectId) return false;
    if (searchQuery.trim() && !note.title.toLowerCase().includes(searchQuery.toLowerCase()) && !note.body.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleDeleteNote = (noteId) => {
    setData(prev => ({ ...prev, studyNotes: prev.studyNotes.filter(n => n.id !== noteId) }));
    addToast('Note deleted', '🗑️');
  };

  const handleTogglePin = (noteId) => {
    setData(prev => ({
      ...prev,
      studyNotes: prev.studyNotes.map(n => n.id === noteId ? { ...n, pinned: !n.pinned } : n)
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Knowledge Library</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Structured archives categorized by subject folders, topic tags, and lecture journals.</p>
        </div>
        <button
          onClick={onOpenNewNote}
          className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Subject Folders Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => setSelectedFolderSubjectId('all')}
          className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
            selectedFolderSubjectId === 'all'
              ? 'bg-blue-600 text-white border-blue-500 shadow-md'
              : 'bg-white/60 dark:bg-slate-900/60 border-slate-200/60 dark:border-white/10 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Folder className="w-4 h-4 shrink-0" />
          <div className="truncate">
            <div className="text-xs font-bold truncate">All Subjects</div>
            <div className="text-[10px] opacity-75">{data.studyNotes.length} notes</div>
          </div>
        </button>

        {data.subjects.map(sub => {
          const count = data.studyNotes.filter(n => n.subjectId === sub.id).length;
          const isSelected = selectedFolderSubjectId === sub.id;

          return (
            <button
              key={sub.id}
              onClick={() => setSelectedFolderSubjectId(sub.id)}
              className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all truncate ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                  : 'bg-white/60 dark:bg-slate-900/60 border-slate-200/60 dark:border-white/10 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: sub.color }}
              />
              <div className="truncate">
                <div className="text-xs font-bold truncate">{sub.name}</div>
                <div className="text-[10px] opacity-75">{count} notes</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative w-full">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search notes, terms, formulas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/70 dark:border-white/10 text-xs pl-10 pr-4 py-2.5 rounded-2xl text-slate-900 dark:text-white focus:outline-none"
        />
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotes.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-slate-400 text-xs">
            No notes found in this folder.
          </div>
        ) : (
          filteredNotes.map(note => {
            const sub = data.subjects.find(s => s.id === note.subjectId);
            const top = data.topics.find(t => t.id === note.topicId);

            return (
              <div
                key={note.id}
                className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/70 dark:border-white/10 rounded-3xl p-5 shadow-sm flex flex-col justify-between gap-3 relative group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${sub?.color || '#0a84ff'}22`, color: sub?.color || '#0a84ff' }}
                      >
                        {sub?.name || 'General Knowledge'}
                      </span>
                      {top && (
                        <span className="text-[10px] font-semibold text-slate-400">
                          / {top.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleTogglePin(note.id)}
                        className={`p-1 text-slate-400 hover:text-amber-500 transition-colors ${note.pinned ? 'text-amber-500' : ''}`}
                        title="Pin Note"
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Delete Note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{note.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 whitespace-pre-wrap leading-relaxed">
                    {note.body}
                  </p>
                </div>
                <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-200/40 dark:border-white/5 flex items-center justify-between">
                  <span>Logged on {note.date}</span>
                  {note.pinned && <span className="text-amber-500 font-bold">📌 Pinned</span>}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ==========================================
// REWARDS & ACHIEVEMENTS (EXPANDED 21 CATALOG)
// ==========================================
function RewardsView({ data, onOpenRoadmap }) {
  const BADGES = [
    { id: 'b1', name: 'First Step', desc: 'Complete your first task', icon: '🌱', cat: 'Tasks', goal: 1, current: data.tasks.filter(t => t.status === 'done').length },
    { id: 'b2', name: 'Task Machine', desc: 'Finish 20 tasks', icon: '⚙️', cat: 'Tasks', goal: 20, current: data.tasks.filter(t => t.status === 'done').length },
    { id: 'b3', name: 'Productivity Titan', desc: 'Finish 50 tasks', icon: '🏛️', cat: 'Tasks', goal: 50, current: data.tasks.filter(t => t.status === 'done').length },
    { id: 'b4', name: 'Urgent Executioner', desc: 'Conquer 5 urgent tasks', icon: '⚡', cat: 'Tasks', goal: 5, current: data.tasks.filter(t => t.status === 'done' && t.priority === 'urgent').length },

    { id: 'b5', name: 'Day One', desc: 'Complete your first habit check-in', icon: '☀️', cat: 'Habits', goal: 1, current: data.habitLogs.length },
    { id: 'b6', name: 'Unbreakable', desc: 'Maintain a 7-day streak', icon: '🔥', cat: 'Habits', goal: 7, current: data.stats.streak },
    { id: 'b7', name: 'Fortress of Routine', desc: 'Log 30 habit check-ins total', icon: '🏰', cat: 'Habits', goal: 30, current: data.habitLogs.length },
    { id: 'b8', name: 'Iron Discipline', desc: 'Reach a 30-day streak', icon: '🛡️', cat: 'Habits', goal: 30, current: data.stats.streak },

    { id: 'b9', name: 'Deep Immersion', desc: 'Log your first study sprint', icon: '⏱️', cat: 'Study', goal: 1, current: data.studySessions.length },
    { id: 'b10', name: 'Hundred Hour Mind', desc: 'Accumulate 100 study minutes', icon: '🧠', cat: 'Study', goal: 100, current: data.studySessions.reduce((acc, s) => acc + s.minutes, 0) },
    { id: 'b11', name: 'Flow State Sovereign', desc: 'Accumulate 500 study minutes', icon: '🌊', cat: 'Study', goal: 500, current: data.studySessions.reduce((acc, s) => acc + s.minutes, 0) },
    { id: 'b12', name: 'Ultradian Scholar', desc: 'Complete a 90-minute deep work block', icon: '🌌', cat: 'Study', goal: 90, current: Math.max(0, ...data.studySessions.map(s => s.minutes)) },

    { id: 'b13', name: 'Inquisitive Mind', desc: 'Attempt your first skills test', icon: '🧪', cat: 'Skills', goal: 1, current: data.quizAttempts.length },
    { id: 'b14', name: 'Virtuoso Scholar', desc: 'Master at least 1 topic completely', icon: '🏆', cat: 'Skills', goal: 1, current: data.topics.filter(t => t.status === 'mastered').length },
    { id: 'b15', name: 'Polymath in Training', desc: 'Master 3 distinct topics', icon: '📜', cat: 'Skills', goal: 3, current: data.topics.filter(t => t.status === 'mastered').length },
    { id: 'b16', name: 'Flawless Recall', desc: 'Score 100% on a skills test', icon: '💎', cat: 'Skills', goal: 1, current: data.quizAttempts.filter(q => q.score === q.total).length },

    { id: 'b17', name: 'First Scribe', desc: 'Capture your first knowledge note', icon: '📝', cat: 'Knowledge', goal: 1, current: data.studyNotes.length },
    { id: 'b18', name: 'Living Encyclopedia', desc: 'Archive 10 knowledge notes', icon: '📚', cat: 'Knowledge', goal: 10, current: data.studyNotes.length },

    { id: 'b19', name: 'Apprentice Ascension', desc: 'Reach Level 5 on the Path of Mastery', icon: '🥉', cat: 'Levels', goal: 5, current: getLevelInfo(data.stats.totalXp).level },
    { id: 'b20', name: 'Luminary Ascension', desc: 'Reach Level 10 on the Path of Mastery', icon: '🥈', cat: 'Levels', goal: 10, current: getLevelInfo(data.stats.totalXp).level },
    { id: 'b21', name: 'Grandmaster Summit', desc: 'Reach Level 20 on the Path of Mastery', icon: '🥇', cat: 'Levels', goal: 20, current: getLevelInfo(data.stats.totalXp).level }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Achievements & Badges</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Unlock bounties and earn +25 Silvs per badge completed across 21 disciplines.</p>
        </div>
        <button
          onClick={onOpenRoadmap}
          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md self-start sm:self-auto cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>View Level Roadmap</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BADGES.map(badge => {
          const isEarned = badge.current >= badge.goal;
          const progress = Math.min(100, Math.round((badge.current / badge.goal) * 100));

          return (
            <div
              key={badge.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between gap-3 ${
                isEarned
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-white/70 dark:bg-slate-900/70 border-slate-200/70 dark:border-white/10 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{badge.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                    {badge.cat}
                  </span>
                </div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{badge.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{badge.desc}</p>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1">
                  <span>{isEarned ? 'Unlocked (+25 Silvs)' : 'In Progress'}</span>
                  <span>{badge.current} / {badge.goal}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${isEarned ? 'bg-amber-400' : 'bg-blue-500'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// PROGRESS & TELEMETRY VIEW
// ==========================================
function ProgressView({ data, onOpenRoadmap }) {
  const levelInfo = getLevelInfo(data.stats.totalXp);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Progress & Analytics</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">XP velocity telemetry, consistency heatmaps, and ascension stats.</p>
        </div>
        <button
          onClick={onOpenRoadmap}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          <span>Launch Expedition Roadmap</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/70 dark:border-white/10 rounded-3xl p-5 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Accumulated XP</div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">{data.stats.totalXp} XP</div>
          <div className="text-xs text-blue-500 font-semibold mt-2">Level {levelInfo.level} · {levelInfo.title}</div>
        </div>

        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/70 dark:border-white/10 rounded-3xl p-5 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Silvs Reserve Balance</div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">🪙 {data.stats.silvs}</div>
          <div className="text-xs text-slate-400 mt-2">+50 per ascension · +25 per badge</div>
        </div>

        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/70 dark:border-white/10 rounded-3xl p-5 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Custom Currency</div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">{data.userPrefs.currencyIcon} {data.stats.customCurrency}</div>
          <div className="text-xs text-slate-400 mt-2">Earned through task completion</div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// SETTINGS VIEW (WITH GOOGLE SIGN-IN SUPPORT)
// ==========================================
function SettingsView({ data, setData, addToast, onGoogleLogin, onLogout }) {
  const handleThemeChange = (theme) => {
    setData(prev => ({
      ...prev,
      userPrefs: { ...prev.userPrefs, theme }
    }));
    addToast(`Theme set to ${theme}`, '🎨');
  };

  const handleWallpaperChange = (key) => {
    setData(prev => ({
      ...prev,
      userPrefs: { ...prev.userPrefs, wallpaper: key }
    }));
    addToast('Wallpaper updated', '🖼️');
  };

  const handleResetData = () => {
    if (window.confirm("Reset all data to defaults?")) {
      setData(INITIAL_DATA);
      addToast('Data reset to default', '🔄');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">System Settings</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Account profiles, themes, cloud sync, and visual preferences.</p>
      </div>

      {/* Account & Google Login Card */}
      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/70 dark:border-white/10 rounded-3xl p-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">Account & Cloud Synchronization</span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">User Profile</h3>
          </div>
          {data.user?.isLoggedIn && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20">
              Synced with Google
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/40 dark:bg-white/5 border border-slate-200/40 dark:border-white/5">
          <img
            src={data.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
            alt="Avatar"
            className="w-12 h-12 rounded-full object-cover border border-white/40 shadow-sm"
          />
          <div className="flex-1">
            <div className="text-sm font-extrabold text-slate-900 dark:text-white">{data.user?.name || 'Explorer'}</div>
            <div className="text-xs text-slate-400">{data.user?.email || 'local@silvius.app'}</div>
          </div>

          {!data.user?.isLoggedIn ? (
            <button
              onClick={onGoogleLogin}
              className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Log in with Google</span>
            </button>
          ) : (
            <button
              onClick={onLogout}
              className="px-3.5 py-1.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-rose-500 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/70 dark:border-white/10 rounded-3xl p-5 shadow-sm flex flex-col gap-5">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Theme Mode</label>
          <div className="flex items-center gap-2">
            {['dark', 'light', 'system'].map(th => (
              <button
                key={th}
                onClick={() => handleThemeChange(th)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  data.userPrefs.theme === th
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                {th}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Atmospheric Wallpaper</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.keys(WALLPAPERS).map(wp => (
              <button
                key={wp}
                onClick={() => handleWallpaperChange(wp)}
                className={`p-3 rounded-2xl border text-xs font-bold capitalize transition-all ${
                  data.userPrefs.wallpaper === wp
                    ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-500/10'
                    : 'border-slate-200 dark:border-white/10'
                }`}
              >
                {wp}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200/40 dark:border-white/10">
          <button
            onClick={handleResetData}
            className="px-4 py-2 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-bold transition-colors cursor-pointer"
          >
            Reset All Data to Factory Default
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// ROADMAP EXPEDITION MODAL (THE PATH OF MASTERY)
// ==========================================
function RoadmapExpeditionModal({ data, onClose }) {
  const levelInfo = getLevelInfo(data.stats.totalXp);
  const userLevel = levelInfo.level;
  const [selectedNode, setSelectedNode] = useState(userLevel);

  const activeBiome = BIOMES.find(b => selectedNode >= b.range[0] && selectedNode <= b.range[1]) || BIOMES[0];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl animate-fade-in">
      <div className="bg-slate-950 border border-white/20 rounded-3xl w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden shadow-2xl relative text-white">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xl shadow-lg">
              🗺️
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Expedition Map</div>
              <h3 className="text-lg font-black tracking-tight">The Path of Mastery</h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] text-slate-400">Current Position</div>
              <div className="text-xs font-bold text-emerald-400">Level {userLevel} · {levelInfo.title}</div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Map & Codex Drawer */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Scrollable Map Track */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col items-center relative">
            <div className="w-full max-w-md flex flex-col items-center gap-6 relative">
              {/* Connecting line */}
              <div className="absolute top-4 bottom-4 w-1 bg-gradient-to-b from-emerald-500 via-blue-500 to-slate-800 -z-0" />

              {Array.from({ length: 22 }, (_, i) => i + 1).map(nodeLvl => {
                const isConquered = nodeLvl < userLevel;
                const isCurrent = nodeLvl === userLevel;
                const isLocked = nodeLvl > userLevel;
                const reqXp = 150 * Math.pow(nodeLvl - 1, 2);
                const title = LEVEL_TITLES[Math.min(nodeLvl - 1, LEVEL_TITLES.length - 1)];

                return (
                  <button
                    key={nodeLvl}
                    onClick={() => setSelectedNode(nodeLvl)}
                    className={`relative z-10 w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      selectedNode === nodeLvl ? 'ring-2 ring-white scale-102' : ''
                    } ${
                      isCurrent
                        ? 'bg-blue-600/30 border-blue-400 shadow-lg shadow-blue-500/20'
                        : isConquered
                        ? 'bg-slate-900/80 border-emerald-500/40 text-slate-300'
                        : 'bg-slate-900/40 border-white/10 text-slate-500 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                        isCurrent
                          ? 'bg-blue-600 text-white animate-pulse'
                          : isConquered
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white/10 text-slate-400'
                      }`}>
                        {isCurrent ? '★' : isConquered ? '✓' : nodeLvl}
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-extrabold text-white">Level {nodeLvl}: {title}</div>
                        <div className="text-[10px] text-slate-400">{reqXp} Total XP required</div>
                      </div>
                    </div>

                    <div className="text-right text-[10px] font-mono">
                      {isCurrent ? (
                        <span className="text-blue-400 font-bold uppercase">Active Frontier</span>
                      ) : isConquered ? (
                        <span className="text-emerald-400">Conquered</span>
                      ) : (
                        <span className="text-slate-500">Locked</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Codex Drawer */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-white/10 p-5 bg-slate-900/40 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-1">Checkpoint Codex</div>
              <h4 className="text-xl font-black text-white">Level {selectedNode}: {LEVEL_TITLES[Math.min(selectedNode - 1, LEVEL_TITLES.length - 1)]}</h4>

              <div className="mt-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
                <div className="text-[10px] uppercase font-bold text-slate-400">Biome Environment</div>
                <div className="text-xs font-bold text-white">{activeBiome.name}</div>
                <div className="text-[11px] text-slate-300 leading-relaxed">{activeBiome.desc}</div>
              </div>

              <div className="mt-4 flex flex-col gap-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">XP Threshold:</span>
                  <span className="font-mono font-bold text-white">{150 * Math.pow(selectedNode - 1, 2)} XP</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Ascension Bounty:</span>
                  <span className="font-bold text-amber-400">+50 Silvs</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Your XP:</span>
                  <span className="font-mono font-bold text-blue-400">{data.stats.totalXp} XP</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedNode(userLevel)}
              className="mt-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
            >
              Jump to Current Level
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODAL: CREATE TASK
// ==========================================
function CreateTaskModal({ onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState(getTodayStr());
  const [dueTime, setDueTime] = useState('12:00');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('Personal');
  const [repeat, setRepeat] = useState('once');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const p = PRIORITIES[priority] || PRIORITIES.medium;
    onSave({
      id: 'task_' + Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      notes: notes.trim(),
      dueDate,
      dueTime,
      priority,
      category,
      status: 'todo',
      repeat,
      xpValue: p.xp,
      completedDate: null
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fade-in">
      <div className="bg-white/95 dark:bg-slate-900/95 border border-white/20 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">Create New Task</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            required
            placeholder="Task Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-slate-100 dark:bg-white/10 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
          />
          <textarea
            rows="2"
            placeholder="Notes or checklist details..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="bg-slate-100 dark:bg-white/10 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-slate-100 dark:bg-white/10 text-xs px-3 py-2 rounded-xl text-slate-800 dark:text-slate-200"
            />
            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="bg-slate-100 dark:bg-white/10 text-xs px-3 py-2 rounded-xl text-slate-800 dark:text-slate-200"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-slate-100 dark:bg-white/10 text-xs px-3 py-2 rounded-xl text-slate-800 dark:text-slate-200"
            >
              {Object.keys(CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="bg-slate-100 dark:bg-white/10 text-xs px-3 py-2 rounded-xl text-slate-800 dark:text-slate-200"
            >
              {Object.keys(PRIORITIES).map(p => <option key={p} value={p}>{PRIORITIES[p].label}</option>)}
            </select>
          </div>
          <select
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
            className="bg-slate-100 dark:bg-white/10 text-xs px-3 py-2 rounded-xl text-slate-800 dark:text-slate-200"
          >
            <option value="once">Repeat: Once</option>
            <option value="every day">Repeat: Every Day</option>
            <option value="weekdays">Repeat: Weekdays</option>
            <option value="every week">Repeat: Every Week</option>
            <option value="every month">Repeat: Every Month</option>
          </select>
          <button
            type="submit"
            className="mt-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer"
          >
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// MODAL: CREATE HABIT
// ==========================================
function CreateHabitModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🔥');
  const [color, setColor] = useState('#0a84ff');
  const [frequency, setFrequency] = useState('daily');
  const [weeklyTarget, setWeeklyTarget] = useState(7);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: 'habit_' + Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      emoji,
      color,
      frequency,
      daySet: [0,1,2,3,4,5,6],
      weeklyTarget: Number(weeklyTarget),
      active: true
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fade-in">
      <div className="bg-white/95 dark:bg-slate-900/95 border border-white/20 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">Create New Habit</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              className="w-12 text-center text-xl bg-slate-100 dark:bg-white/10 px-2 py-2 rounded-xl"
            />
            <input
              type="text"
              required
              placeholder="Habit Name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-slate-100 dark:bg-white/10 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {SWATCHES.map(sw => (
              <button
                key={sw}
                type="button"
                onClick={() => setColor(sw)}
                className={`w-6 h-6 rounded-full border ${color === sw ? 'ring-2 ring-white scale-110' : ''}`}
                style={{ backgroundColor: sw }}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="bg-slate-100 dark:bg-white/10 text-xs px-3 py-2 rounded-xl text-slate-800 dark:text-slate-200"
            >
              <option value="daily">Daily</option>
              <option value="weekdays">Weekdays</option>
              <option value="custom">Custom</option>
            </select>
            <input
              type="number"
              min="1"
              max="7"
              value={weeklyTarget}
              onChange={(e) => setWeeklyTarget(Number(e.target.value))}
              className="bg-slate-100 dark:bg-white/10 text-xs px-3 py-2 rounded-xl text-slate-800 dark:text-slate-200"
              placeholder="Target x / wk"
            />
          </div>

          <button
            type="submit"
            className="mt-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer"
          >
            Initiate Habit
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// MODAL: CREATE SUBJECT
// ==========================================
function CreateSubjectModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#0a84ff');
  const [weeklyTargetMinutes, setWeeklyTargetMinutes] = useState(180);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: 'sub_' + Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      description: description.trim(),
      color,
      weeklyTargetMinutes: Number(weeklyTargetMinutes)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fade-in">
      <div className="bg-white/95 dark:bg-slate-900/95 border border-white/20 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">Add Curriculum Subject</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            required
            placeholder="Subject Name (e.g. Neuroscience)..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-slate-100 dark:bg-white/10 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
          />
          <textarea
            rows="2"
            placeholder="Scope & description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-slate-100 dark:bg-white/10 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
          />
          <div className="flex items-center gap-1.5 flex-wrap">
            {SWATCHES.map(sw => (
              <button
                key={sw}
                type="button"
                onClick={() => setColor(sw)}
                className={`w-6 h-6 rounded-full border ${color === sw ? 'ring-2 ring-white scale-110' : ''}`}
                style={{ backgroundColor: sw }}
              />
            ))}
          </div>
          <button
            type="submit"
            className="mt-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer"
          >
            Add Subject
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// MODAL: CREATE NOTE
// ==========================================
function CreateNoteModal({ subjects, topics, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [topicId, setTopicId] = useState('');

  const relevantTopics = topics.filter(t => t.subjectId === subjectId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    onSave({
      id: 'n_' + Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      body: body.trim(),
      subjectId,
      topicId: topicId || relevantTopics[0]?.id || '',
      date: getTodayStr(),
      pinned: false
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fade-in">
      <div className="bg-white/95 dark:bg-slate-900/95 border border-white/20 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">Capture Knowledge Note</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            required
            placeholder="Note Title / Principle..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-slate-100 dark:bg-white/10 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={subjectId}
              onChange={(e) => {
                setSubjectId(e.target.value);
                const first = topics.find(t => t.subjectId === e.target.value);
                setTopicId(first ? first.id : '');
              }}
              className="bg-slate-100 dark:bg-white/10 text-xs px-3 py-2 rounded-xl text-slate-800 dark:text-slate-200"
            >
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              className="bg-slate-100 dark:bg-white/10 text-xs px-3 py-2 rounded-xl text-slate-800 dark:text-slate-200"
            >
              <option value="">General Topic</option>
              {relevantTopics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <textarea
            rows="5"
            required
            placeholder="Synthesis, takeaways, or formula explanation..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="bg-slate-100 dark:bg-white/10 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
          />
          <button
            type="submit"
            className="mt-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer"
          >
            Archive Note
          </button>
        </form>
      </div>
    </div>
  );
}