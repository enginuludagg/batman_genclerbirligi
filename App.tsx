
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
import { ViewType, Student, Trainer, FinanceEntry, MediaPost, TrainingSession, AppMode, Notification, Drill, TrainerNote, AppContextData } from './types';
import { Bell, X, LogOut, LayoutGrid, CheckCircle2, Database, RefreshCw, AlertTriangle } from 'lucide-react';
import { storageService, KEYS } from './services/storageService';
import { isConfigured } from './services/firebaseConfig';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [mediaTab, setMediaTab] = useState<'all' | 'bulletin' | 'gallery' | 'poll' | 'pending'>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appMode, setAppMode] = useState<AppMode>('admin');
  const [toast, setToast] = useState<Notification | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // --- MERKEZİ VERİ DURUMLARI (BGB AKADEMİ) ---
  const [students, setStudents] = useState<Student[]>(() => storageService.load(KEYS.STUDENTS, []));
  const [trainers, setTrainers] = useState<Trainer[]>(() => storageService.load(KEYS.TRAINERS, []));
  const [trainerNotes, setNotes] = useState<TrainerNote[]>(() => storageService.load(KEYS.NOTES, []));
  const [sessions, setSessions] = useState<TrainingSession[]>(() => storageService.load(KEYS.SESSIONS, []));
  const [finance, setFinance] = useState<FinanceEntry[]>(() => storageService.load(KEYS.FINANCE, []));
  const [media, setMedia] = useState<MediaPost[]>(() => storageService.load(KEYS.MEDIA, []));
  const [drills, setDrills] = useState<Drill[]>(() => storageService.load(KEYS.DRILLS, []));

  // --- FIREBASE İLK YÜKLEME ---
  useEffect(() => {
    if (!isConfigured) return;

    const fetchAllData = async () => {
      setIsSyncing(true);
      try {
        const [cS, cT, cN, cSe, cF, cM, cD] = await Promise.all([
          storageService.loadFromCloud(KEYS.STUDENTS),
          storageService.loadFromCloud(KEYS.TRAINERS),
          storageService.loadFromCloud(KEYS.NOTES),
          storageService.loadFromCloud(KEYS.SESSIONS),
          storageService.loadFromCloud(KEYS.FINANCE),
          storageService.loadFromCloud(KEYS.MEDIA),
          storageService.loadFromCloud(KEYS.DRILLS)
        ]);

        if (cS.length) setStudents(cS as Student[]);
        if (cT.length) setTrainers(cT as Trainer[]);
        if (cN.length) setNotes(cN as TrainerNote[]);
        if (cSe.length) setSessions(cSe as TrainingSession[]);
        if (cF.length) setFinance(cF as FinanceEntry[]);
        if (cM.length) setMedia(cM as MediaPost[]);
        if (cD.length) setDrills(cD as Drill[]);
      } catch (err) {
        console.error("BGB Sync Error:", err);
      } finally {
        setIsSyncing(false);
      }
    };

    fetchAllData();
  }, []);

  // --- VERİ GÜNCELLEME VE SENKRONİZASYON ---
  const updateAndSync = async <T extends { id: string }>(
    key: string, 
    items: T[] | ((prev: T[]) => T[]), 
    setter: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    setter(prev => {
      const updated = typeof items === 'function' ? items(prev) : items;
      storageService.saveLocal(key, updated);
      
      // Buluta son değişikliği it (Optimistik yaklaşım)
      if (isConfigured && updated.length > 0) {
        const last = updated[updated.length - 1];
        if (last) storageService.saveToCloud(key, last);
      }
      return updated;
    });
  };

  const handleUpdateStudent = (u: Student[] | ((p: Student[]) => Student[])) => updateAndSync(KEYS.STUDENTS, u, setStudents);
  const handleUpdateTrainer = (u: Trainer[] | ((p: Trainer[]) => Trainer[])) => updateAndSync(KEYS.TRAINERS, u, setTrainers);
  const handleUpdateFinance = (u: FinanceEntry[] | ((p: FinanceEntry[]) => FinanceEntry[])) => updateAndSync(KEYS.FINANCE, u, setFinance);
  const handleUpdateMedia = (u: MediaPost[] | ((p: MediaPost[]) => MediaPost[])) => updateAndSync(KEYS.MEDIA, u, setMedia);
  const handleUpdateDrills = (u: Drill[] | ((p: Drill[]) => Drill[])) => updateAndSync(KEYS.DRILLS, u, setDrills);
  const handleUpdateSessions = (u: TrainingSession[] | ((p: TrainingSession[]) => TrainingSession[])) => updateAndSync(KEYS.SESSIONS, u, setSessions);
  const handleUpdateNotes = (u: TrainerNote[] | ((p: TrainerNote[]) => TrainerNote[])) => updateAndSync(KEYS.NOTES, u, setNotes);

  const handleRegister = async (student: Student) => {
    setStudents(prev => [...prev, student]);
    storageService.saveLocal(KEYS.STUDENTS, [...students, student]);
    if (isConfigured) await storageService.saveToCloud(KEYS.STUDENTS, student);
    setToast({ title: 'HOŞ GELDİNİZ', message: 'BGB Akademi kayıt işleminiz başarıyla tamamlandı.' });
  };

  const handleUpdateFounderPhoto = async (photoUrl: string) => {
    const engin = trainers.find(t => t.name.toLowerCase().includes('engin'));
    if (engin) {
      const updatedEngin = { ...engin, photoUrl };
      handleUpdateTrainer(prev => prev.map(t => t.id === engin.id ? updatedEngin : t));
      setToast({ title: 'BİLGİ', message: 'Hakkımızda sayfası güncellendi.' });
    }
  };

  const contextData: AppContextData = {
    students, trainers, branches: [], sessions, finance, media, drills, attendance: [], notifications: [], trainerNotes
  };

  const handleNavigate = (view: ViewType, subTab?: string) => {
    setActiveView(view);
    if (view === 'media' && subTab) setMediaTab(subTab as any);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (mode: AppMode) => {
    setAppMode(mode);
    setIsLoggedIn(true);
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard context={contextData} appMode={appMode} onNavigate={handleNavigate} />;
      case 'about': return <AboutUs trainers={trainers} mode={appMode} onUpdateFounderPhoto={handleUpdateFounderPhoto} />;
      case 'students': return <StudentList students={students} setStudents={handleUpdateStudent} mode={appMode} />;
      case 'schedule': return <Schedule sessions={sessions} setSessions={handleUpdateSessions} mode={appMode} />;
      case 'ai-coach': return <AICoach context={contextData} mode={appMode} />;
      case 'analytics': return <Analytics students={students} setStudents={setStudents} mode={appMode} />;
      case 'league': return <League students={students} mode={appMode} onPostLineup={(p) => { 
        const post = {...p, id: Date.now().toString()} as MediaPost;
        handleUpdateMedia(prev => [post, ...prev]);
      }} />;
      case 'finance': return <Finance finance={finance} setFinance={handleUpdateFinance} students={students} mode={appMode} />;
      case 'attendance': return <Attendance students={students} sessions={sessions} mode={appMode} />;
      case 'media': return <MediaManager media={media} setMedia={handleUpdateMedia} mode={appMode} activeTabOverride={mediaTab} setActiveTabOverride={setMediaTab} />;
      case 'trainers': return <TrainerManager trainers={trainers} setTrainers={handleUpdateTrainer} mode={appMode} />;
      case 'drills': return <Drills drills={drills} setDrills={handleUpdateDrills} mode={appMode} />;
      case 'notes': return <TrainerNotebook notes={trainerNotes} setNotes={handleUpdateNotes} mode={appMode} />;
      case 'settings': return <Settings />;
      default: return <Dashboard context={contextData} appMode={appMode} onNavigate={handleNavigate} />;
    }
  };

  if (!isLoggedIn) {
    return <Auth onLogin={handleLogin} onRegisterStudent={handleRegister} students={students} />;
  }

  return (
    <div className="flex min-h-[100dvh] w-full bg-[#f8fafc] pb-20 lg:pb-0 selection:bg-red-600 selection:text-white">
      <Sidebar activeView={activeView} onViewChange={(v) => { setActiveView(v); setMediaTab('all'); }} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} appMode={appMode} setAppMode={setAppMode} />
      <main className={`flex-1 flex flex-col transition-all duration-300 min-w-0 ${isSidebarOpen ? 'lg:ml-64 opacity-50 lg:opacity-100' : 'lg:ml-64'}`}>
        
        {/* MASAÜSTÜ HEADER */}
        <div className="hidden lg:flex items-center justify-between px-8 py-6 bg-white border-b border-slate-100 sticky top-0 z-[500]">
           <div className="flex items-center gap-4">
              <div className="bg-red-50 text-[#E30613] p-2 rounded-xl"><LayoutGrid size={20} /></div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 italic">
                {activeView.toUpperCase()} <span className="text-slate-200">/</span> BGB AKADEMİ
              </h2>
           </div>
           <div className="flex items-center gap-6">
              {!isConfigured ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-orange-200 bg-orange-50 text-orange-600">
                  <AlertTriangle size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest italic">FIREBASE YAPILANDIRMASI GEREKLİ</span>
                </div>
              ) : (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${isSyncing ? 'bg-zinc-50 border-zinc-200 text-zinc-400' : 'bg-green-50 border-green-100 text-green-600'}`}>
                  {isSyncing ? <RefreshCw size={14} className="animate-spin" /> : <Database size={14} />}
                  <span className="text-[9px] font-black uppercase tracking-widest italic">{isSyncing ? 'SENKRONİZE EDİLİYOR...' : 'SİSTEM ÇEVRİMİÇİ'}</span>
                </div>
              )}
              <button onClick={() => window.location.reload()} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-[#E30613] transition-colors tracking-widest">
                 <LogOut size={16} /> GÜVENLİ ÇIKIŞ
              </button>
           </div>
        </div>

        {/* MOBİL HEADER */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 sticky top-0 z-[1000]">
           <button onClick={() => setIsLoggedIn(false)} className="bg-slate-900 text-white p-2.5 rounded-xl"><LogOut size={16} /></button>
           <h1 className="text-xs font-black italic uppercase tracking-tighter">BATMAN <span className="text-[#E30613]">GB AKADEMİ<sup>®</sup></span></h1>
           <div className="flex items-center">
             {!isConfigured ? (
               <div className="text-orange-500 p-2"><AlertTriangle size={20} /></div>
             ) : (
               <div className={`flex items-center justify-center w-10 h-10 rounded-full ${isSyncing ? 'text-zinc-300 animate-spin' : 'text-green-500'}`}>
                 {isSyncing ? <RefreshCw size={20} /> : <CheckCircle2 size={20} />}
               </div>
             )}
           </div>
        </div>

        <div className="p-4 sm:p-8 max-w-[1400px] mx-auto w-full">{renderView()}</div>
      </main>

      {/* TOAST BİLDİRİM */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[6000] w-[calc(100%-2rem)] max-w-sm animate-in slide-in-from-top-10 duration-500">
          <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-2xl flex items-center gap-3 border border-red-600/20">
            <div className="p-2 bg-[#E30613] rounded-xl"><Bell size={16} /></div>
            <div className="flex-1">
               <h4 className="font-black text-[10px] uppercase italic tracking-widest">{toast.title}</h4>
               <p className="text-[9px] text-slate-400 mt-0.5">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-slate-500 hover:text-white"><X size={16} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
