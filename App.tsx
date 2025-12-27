
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
import Auth from './components/Auth';
import Settings from './components/Settings';
import { ViewType, Student, Trainer, FinanceEntry, MediaPost, TrainingSession, AppMode, Notification, Drill, TrainerNote, AppContextData } from './types';
import { Bell, X, LogOut, LayoutGrid, CloudCheck, Database } from 'lucide-react';
import { storageService, KEYS } from './services/storageService';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [mediaTab, setMediaTab] = useState<'all' | 'bulletin' | 'gallery' | 'poll' | 'pending'>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appMode, setAppMode] = useState<AppMode>('admin');
  const [toast, setToast] = useState<Notification | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Veri Başlatma
  const [students, setStudents] = useState<Student[]>(() => storageService.load(KEYS.STUDENTS, []));
  const [trainers, setTrainers] = useState<Trainer[]>(() => storageService.load(KEYS.TRAINERS, []));
  const [trainerNotes, setNotes] = useState<TrainerNote[]>(() => storageService.load(KEYS.NOTES, []));
  const [sessions, setSessions] = useState<TrainingSession[]>(() => storageService.load(KEYS.SESSIONS, []));
  const [finance, setFinance] = useState<FinanceEntry[]>(() => storageService.load(KEYS.FINANCE, []));
  const [media, setMedia] = useState<MediaPost[]>(() => storageService.load(KEYS.MEDIA, []));
  const [drills, setDrills] = useState<Drill[]>(() => storageService.load(KEYS.DRILLS, []));

  // Merkezi Kayıt Fonksiyonu (Görsel geri bildirim ile)
  const syncData = useCallback(() => {
    setIsSyncing(true);
    storageService.syncAll({
      students, trainers, notes: trainerNotes, sessions, finance, media, drills
    });
    setTimeout(() => setIsSyncing(false), 800);
  }, [students, trainers, trainerNotes, sessions, finance, media, drills]);

  // Her değişiklikte kaydet
  useEffect(() => {
    syncData();
  }, [syncData]);

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

  const handleRegister = (student: Student) => {
    setStudents(prev => [...prev, student]);
    setToast({ title: 'KAYIT ALINDI', message: 'Başvurunuz başarıyla iletildi.' });
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard context={contextData} appMode={appMode} onNavigate={handleNavigate} />;
      case 'students': return <StudentList students={students} setStudents={setStudents} mode={appMode} />;
      case 'schedule': return <Schedule sessions={sessions} setSessions={setSessions} mode={appMode} />;
      case 'ai-coach': return <AICoach context={contextData} mode={appMode} />;
      case 'analytics': return <Analytics students={students} setStudents={setStudents} mode={appMode} />;
      case 'league': return <League students={students} mode={appMode} />;
      case 'finance': return <Finance finance={finance} setFinance={setFinance} students={students} mode={appMode} />;
      case 'attendance': return <Attendance students={students} sessions={sessions} mode={appMode} />;
      case 'media': return <MediaManager media={media} setMedia={setMedia} mode={appMode} activeTabOverride={mediaTab} setActiveTabOverride={setMediaTab} />;
      case 'trainers': return <TrainerManager trainers={trainers} setTrainers={setTrainers} mode={appMode} />;
      case 'drills': return <Drills drills={drills} setDrills={setDrills} mode={appMode} />;
      case 'notes': return <TrainerNotebook notes={trainerNotes} setNotes={setNotes} mode={appMode} />;
      case 'settings': return <Settings />;
      default: return <Dashboard context={contextData} appMode={appMode} onNavigate={handleNavigate} />;
    }
  };

  if (!isLoggedIn) {
    return <Auth onLogin={handleLogin} onRegisterStudent={handleRegister} students={students} />;
  }

  return (
    <div className="flex min-h-[100dvh] w-full bg-[#f8fafc] selection:bg-red-600 selection:text-white pb-20 lg:pb-0">
      <Sidebar 
        activeView={activeView} 
        onViewChange={(v) => { setActiveView(v); setMediaTab('all'); }} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        appMode={appMode} 
        setAppMode={setAppMode} 
      />
      
      <main className={`flex-1 flex flex-col transition-all duration-300 min-w-0 ${isSidebarOpen ? 'lg:ml-64 opacity-50 lg:opacity-100' : 'lg:ml-64'}`}>
        <div className="hidden lg:flex items-center justify-between px-8 py-6 bg-white border-b border-slate-100 sticky top-0 z-[500]">
           <div className="flex items-center gap-4">
              <div className="bg-red-50 text-red-600 p-2 rounded-xl"><LayoutGrid size={20} /></div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 italic">
                {activeView.toUpperCase()} <span className="text-slate-200">/</span> {appMode === 'admin' ? 'YÖNETİCİ' : 'VELİ'}
              </h2>
           </div>
           <div className="flex items-center gap-6">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${isSyncing ? 'bg-zinc-50 border-zinc-200 text-zinc-400' : 'bg-green-50 border-green-100 text-green-600'}`}>
                <Database size={14} className={isSyncing ? 'animate-pulse' : ''} />
                <span className="text-[9px] font-black uppercase tracking-widest">{isSyncing ? 'YÜKLENİYOR...' : 'VERİ GÜVENDE'}</span>
                {!isSyncing && <CloudCheck size={14} />}
              </div>
              <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-red-600 transition-colors">
                 <LogOut size={16} /> ÇIKIŞ YAP
              </button>
           </div>
        </div>

        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 sticky top-0 z-[1000]">
           <button onClick={() => setIsLoggedIn(false)} className="bg-slate-900 text-white p-2.5 rounded-xl">
             <LogOut size={16} />
           </button>
           <h1 className="text-xs font-black italic uppercase tracking-tighter">
            BATMAN <span className="text-red-600">GB AKADEMİ</span>
           </h1>
           <div className={`flex items-center justify-center w-10 h-10 rounded-full ${isSyncing ? 'text-zinc-300' : 'text-green-500'}`}>
              <CloudCheck size={20} />
           </div>
        </div>

        <div className="p-4 sm:p-8 max-w-[1400px] mx-auto w-full">
          {renderView()}
        </div>
      </main>

      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[6000] w-[calc(100%-2rem)] max-w-sm animate-in slide-in-from-top-10 duration-500">
          <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-2xl flex items-center gap-3 border border-red-600/20">
            <div className="p-2 bg-red-600 rounded-xl"><Bell size={16} /></div>
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
