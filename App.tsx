
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import Schedule from './components/Schedule';
import AICoach from './components/AICoach';
import Analytics from './components/Analytics';
import League from './components/League';
import Finance from './components/Finance';
import Attendance from './components/Attendance';
import MediaManager from './components/MediaManager';
import TrainerManager from './components/TrainerManager';
import Drills from './components/Drills';
import TrainerNotebook from './components/TrainerNotebook';
import AboutUs from './components/AboutUs';
import Auth from './components/Auth';
import Settings from './components/Settings';
import MobileNav from './components/MobileNav';
import { ViewType, Student, Trainer, FinanceEntry, MediaPost, TrainingSession, AppMode, Notification, Drill, TrainerNote, AppContextData, MatchResult } from './types';
import { Bell, X, LogOut, LayoutGrid, CheckCircle2, Database, RefreshCw, AlertTriangle, Menu, Smartphone, ShieldAlert, CloudOff } from 'lucide-react';
import { storageService, KEYS } from './services/storageService';
import { isConfigured } from './services/firebaseConfig';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('bgb_session'));
  const [appMode, setAppMode] = useState<AppMode>(() => {
    try {
      const saved = localStorage.getItem('bgb_session');
      return saved ? JSON.parse(saved).mode : 'admin';
    } catch { return 'admin'; }
  });
  const [currentUser, setCurrentUser] = useState<Student | null>(() => {
    try {
      const saved = localStorage.getItem('bgb_session');
      return saved ? JSON.parse(saved).user : null;
    } catch { return null; }
  });

  const getInitialView = (): ViewType => {
    const hash = window.location.hash.replace('#', '');
    return (hash && ['dashboard', 'students', 'trainers', 'schedule', 'attendance', 'finance', 'media', 'league', 'ai-coach', 'analytics', 'drills', 'settings', 'notes', 'about'].includes(hash)) 
      ? hash as ViewType : 'dashboard';
  };

  const [activeView, setActiveView] = useState<ViewType>(getInitialView);
  const [mediaTab, setMediaTab] = useState<'all' | 'bulletin' | 'gallery' | 'poll' | 'lineup' | 'pending'>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toast, setToast] = useState<Notification | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  const [students, setStudents] = useState<Student[]>(() => storageService.load(KEYS.STUDENTS, []));
  const [trainers, setTrainers] = useState<Trainer[]>(() => storageService.load(KEYS.TRAINERS, []));
  const [trainerNotes, setNotes] = useState<TrainerNote[]>(() => storageService.load(KEYS.NOTES, []));
  const [sessions, setSessions] = useState<TrainingSession[]>(() => storageService.load(KEYS.SESSIONS, []));
  const [finance, setFinance] = useState<FinanceEntry[]>(() => storageService.load(KEYS.FINANCE, []));
  const [media, setMedia] = useState<MediaPost[]>(() => storageService.load(KEYS.MEDIA, []));
  const [drills, setDrills] = useState<Drill[]>(() => storageService.load(KEYS.DRILLS, []));
  const [fixtures, setFixtures] = useState<MatchResult[]>(() => storageService.load(KEYS.FIXTURES, []));

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '') as ViewType;
      if (hash) setActiveView(hash);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (view: ViewType, subTab?: string) => {
    setActiveView(view);
    if (view === 'media' && subTab) setMediaTab(subTab as any);
    window.history.pushState(null, '', `#${view}`);
    window.scrollTo(0, 0);
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    if (!isConfigured) return;
    const fetchAllData = async () => {
      setIsSyncing(true);
      try {
        const [cS, cT, cN, cSe, cF, cM, cD, cFix] = await Promise.all([
          storageService.loadFromCloud(KEYS.STUDENTS),
          storageService.loadFromCloud(KEYS.TRAINERS),
          storageService.loadFromCloud(KEYS.NOTES),
          storageService.loadFromCloud(KEYS.SESSIONS),
          storageService.loadFromCloud(KEYS.FINANCE),
          storageService.loadFromCloud(KEYS.MEDIA),
          storageService.loadFromCloud(KEYS.DRILLS),
          storageService.loadFromCloud(KEYS.FIXTURES)
        ]);
        if (cS.length) setStudents(cS as Student[]);
        if (cT.length) setTrainers(cT as Trainer[]);
        if (cN.length) setNotes(cN as TrainerNote[]);
        if (cSe.length) setSessions(cSe as TrainingSession[]);
        if (cF.length) setFinance(cF as FinanceEntry[]);
        if (cM.length) setMedia(cM as MediaPost[]);
        if (cD.length) setDrills(cD as Drill[]);
        if (cFix.length) setFixtures(cFix as MatchResult[]);
      } catch (err) {
        setConnectionError(true);
      } finally {
        setIsSyncing(false);
      }
    };
    fetchAllData();
  }, []);

  const syncItem = async (key: string, item: any) => {
    if (isConfigured && item) {
      try {
        await storageService.saveToCloud(key, item);
      } catch {
        setConnectionError(true);
      }
    }
  };

  const handleUpdateStudent = (u: Student[] | ((p: Student[]) => Student[])) => {
    setStudents(prev => {
      const updated = typeof u === 'function' ? u(prev) : u;
      storageService.saveLocal(KEYS.STUDENTS, updated);
      if (updated.length > prev.length) syncItem(KEYS.STUDENTS, updated[updated.length - 1]);
      else if (updated.length === prev.length) {
        const changed = updated.find((item, i) => JSON.stringify(item) !== JSON.stringify(prev[i]));
        if (changed) syncItem(KEYS.STUDENTS, changed);
      }
      return updated;
    });
  };

  const handleUpdateFinance = (u: FinanceEntry[] | ((p: FinanceEntry[]) => FinanceEntry[])) => {
    setFinance(prev => {
      const updated = typeof u === 'function' ? u(prev) : u;
      storageService.saveLocal(KEYS.FINANCE, updated);
      if (updated.length > prev.length) syncItem(KEYS.FINANCE, updated[0]);
      return updated;
    });
  };

  const handleUpdateMedia = (u: MediaPost[] | ((p: MediaPost[]) => MediaPost[])) => {
    setMedia(prev => {
      const updated = typeof u === 'function' ? u(prev) : u;
      storageService.saveLocal(KEYS.MEDIA, updated);
      if (updated.length > prev.length) syncItem(KEYS.MEDIA, updated[0]);
      return updated;
    });
  };

  const handleUpdateSessions = (u: TrainingSession[] | ((p: TrainingSession[]) => TrainingSession[])) => {
    setSessions(prev => {
      const updated = typeof u === 'function' ? u(prev) : u;
      storageService.saveLocal(KEYS.SESSIONS, updated);
      return updated;
    });
  };

  const handleUpdateNotes = (u: TrainerNote[] | ((p: TrainerNote[]) => TrainerNote[])) => {
    setNotes(prev => {
      const updated = typeof u === 'function' ? u(prev) : u;
      storageService.saveLocal(KEYS.NOTES, updated);
      if (updated.length > prev.length) syncItem(KEYS.NOTES, updated[0]);
      return updated;
    });
  };

  const handleUpdateFixtures = (u: MatchResult[] | ((p: MatchResult[]) => MatchResult[])) => {
    setFixtures(prev => {
      const updated = typeof u === 'function' ? u(prev) : u;
      storageService.saveLocal(KEYS.FIXTURES, updated);
      return updated;
    });
  };

  const handleUpdateFounderPhoto = async (photoUrl: string) => {
    const founder = trainers.find(t => t.name.toLowerCase().includes('engin'));
    if (founder) {
      const updated = { ...founder, photoUrl };
      setTrainers(prev => prev.map(t => t.id === founder.id ? updated : t));
      syncItem(KEYS.TRAINERS, updated);
    }
  };

  const contextData: AppContextData = {
    students, trainers, branches: [], sessions, finance, media, drills, attendance: [], notifications: [], trainerNotes, fixtures
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard context={contextData} appMode={appMode} onNavigate={handleNavigate} />;
      case 'about': return <AboutUs trainers={trainers} mode={appMode} onUpdateFounderPhoto={handleUpdateFounderPhoto} />;
      case 'students': return <StudentList students={students} setStudents={handleUpdateStudent} mode={appMode} />;
      case 'schedule': return <Schedule sessions={sessions} setSessions={handleUpdateSessions} mode={appMode} />;
      case 'ai-coach': return <AICoach context={contextData} mode={appMode} currentUser={currentUser} />;
      case 'analytics': return <Analytics students={students} setStudents={setStudents} mode={appMode} />;
      case 'league': return <League students={students} mode={appMode} fixtures={fixtures} setFixtures={handleUpdateFixtures} onPostLineup={(p) => handleUpdateMedia(prev => [{...p, id: Date.now().toString()} as MediaPost, ...prev])} />;
      case 'finance': return <Finance finance={finance} setFinance={handleUpdateFinance} students={students} mode={appMode} />;
      case 'attendance': return <Attendance students={students} sessions={sessions} mode={appMode} />;
      case 'media': return <MediaManager media={media} setMedia={handleUpdateMedia} mode={appMode} activeTabOverride={mediaTab} setActiveTabOverride={setMediaTab} />;
      case 'trainers': return <TrainerManager trainers={trainers} setTrainers={setTrainers} mode={appMode} />;
      case 'drills': return <Drills drills={drills} setDrills={setDrills} mode={appMode} />;
      case 'notes': return <TrainerNotebook notes={trainerNotes} setNotes={handleUpdateNotes} mode={appMode} />;
      case 'settings': return <Settings />;
      default: return <Dashboard context={contextData} appMode={appMode} onNavigate={handleNavigate} />;
    }
  };

  if (!isLoggedIn) return <Auth onLogin={(m, s) => { setAppMode(m); setCurrentUser(s || null); setIsLoggedIn(true); localStorage.setItem('bgb_session', JSON.stringify({ mode: m, user: s || null })); }} onRegisterStudent={async (s) => { setStudents(p => [...p, s]); syncItem(KEYS.STUDENTS, s); }} students={students} />;

  return (
    <div className="flex min-h-[100dvh] bg-[#f8fafc] overflow-x-hidden">
      <Sidebar activeView={activeView} onViewChange={handleNavigate} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} appMode={appMode} setAppMode={setAppMode} onLogout={() => { localStorage.removeItem('bgb_session'); window.location.reload(); }} />
      <main className={`flex-1 flex flex-col transition-all duration-500 lg:ml-[280px] ${isSidebarOpen ? 'opacity-50 pointer-events-none lg:opacity-100 lg:pointer-events-auto' : ''}`}>
        <div className="lg:hidden flex items-center justify-between p-4 bg-white sticky top-0 z-[1000] border-b">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-zinc-900 text-white rounded-lg flex items-center justify-center font-black">BGB</div>
             <h1 className="text-xs font-black uppercase text-zinc-900 leading-none">AKADEMİ <span className="text-red-600">MOBİL</span></h1>
           </div>
           {connectionError ? <CloudOff size={18} className="text-red-500" /> : <RefreshCw size={18} className={`text-green-500 ${isSyncing ? 'animate-spin' : ''}`} />}
        </div>
        <div className="p-4 sm:p-8 max-w-[1600px] mx-auto w-full flex-1 pb-32 lg:pb-8">{renderView()}</div>
      </main>
      <MobileNav activeView={activeView} onViewChange={handleNavigate} onToggleSidebar={() => setIsSidebarOpen(true)} appMode={appMode} />
    </div>
  );
};

export default App;
