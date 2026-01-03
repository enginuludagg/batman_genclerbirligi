import React, { useState, useEffect } from 'react';
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
import { ViewType, Student, Trainer, FinanceEntry, MediaPost, TrainingSession, AppMode, Drill, TrainerNote, AppContextData, MatchResult } from './types';
import { RefreshCw, CloudOff, Loader2, Menu, LogOut } from 'lucide-react';
import { storageService, KEYS } from './services/storageService';
import { isConfigured, auth } from './services/firebaseConfig';

const APP_VERSION = "1.9.0";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('bgb_session');
    const version = localStorage.getItem('bgb_app_version');
    
    if (version !== APP_VERSION) {
      localStorage.removeItem('bgb_session');
      localStorage.setItem('bgb_app_version', APP_VERSION);
      if (version) window.location.reload();
      return false;
    }
    return !!saved;
  });

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

  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [students, setStudents] = useState<Student[]>(() => storageService.load(KEYS.STUDENTS, []));
  const [trainers, setTrainers] = useState<Trainer[]>(() => storageService.load(KEYS.TRAINERS, []));
  const [trainerNotes, setNotes] = useState<TrainerNote[]>(() => storageService.load(KEYS.NOTES, []));
  const [sessions, setSessions] = useState<TrainingSession[]>(() => storageService.load(KEYS.SESSIONS, []));
  const [finance, setFinance] = useState<FinanceEntry[]>(() => storageService.load(KEYS.FINANCE, []));
  const [media, setMedia] = useState<MediaPost[]>(() => storageService.load(KEYS.MEDIA, []));
  const [drills, setDrills] = useState<Drill[]>(() => storageService.load(KEYS.DRILLS, []));
  const [fixtures, setFixtures] = useState<MatchResult[]>(() => storageService.load(KEYS.FIXTURES, []));

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    if (!isConfigured) {
      setIsAuthChecking(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const inputEmail = user.email?.toLowerCase().trim();
        const adminEmails = ['enginuludagg@gmail.com', 'elitgelisimakademi@gmail.com', 'admin@bgb.com'];

        if (adminEmails.includes(inputEmail || '')) {
           handleLogin('admin');
        } else {
           const student = students.find(s => s.parentEmail?.toLowerCase() === inputEmail);
           if (student) handleLogin('parent', student);
        }
      }
      setIsAuthChecking(false);
    });

    return () => unsubscribe();
  }, [students]);

  const handleLogin = (mode: AppMode, student?: Student) => {
    setAppMode(mode);
    setCurrentUser(student || null);
    setIsLoggedIn(true);
    localStorage.setItem('bgb_app_version', APP_VERSION);
    localStorage.setItem('bgb_session', JSON.stringify({ mode, user: student || null }));
  };

  const handleNavigate = (view: ViewType) => {
    setActiveView(view);
    setIsSidebarOpen(false);
  };

  // GÜVENLİ VE HIZLI ÇIKIŞ FONKSİYONU
  const handleLogout = () => {
    // 1. Kullanıcı onayı (Browser native confirm)
    if (!window.confirm("Hesabınızdan çıkış yapmak istediğinize emin misiniz?")) return;

    try {
      // 2. Önce local state'i ve storage'ı temizle (UI hemen tepki versin)
      localStorage.removeItem('bgb_session');
      setIsLoggedIn(false);

      // 3. Arka planda Firebase oturumunu kapat (Hata verse bile önemli değil, token silindi)
      auth.signOut().catch(err => console.error("Firebase logout error:", err));

      // 4. Sayfayı zorla yenile (Temiz başlangıç)
      window.location.href = "/";
    } catch (err) {
      console.error("Çıkış hatası:", err);
      window.location.reload();
    }
  };

  if (isAuthChecking) {
    return (
      <div className="fixed inset-0 bg-[#111] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-red-600" size={48} />
        <p className="text-white/40 font-black text-[10px] uppercase tracking-widest italic">Güvenli Oturum Kontrolü...</p>
      </div>
    );
  }

  const contextData: AppContextData = {
    students, trainers, branches: [], sessions, finance, media, drills, attendance: [], notifications: [], trainerNotes, fixtures
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard context={contextData} appMode={appMode} onNavigate={handleNavigate} />;
      case 'about': return <AboutUs trainers={trainers} mode={appMode} onUpdateFounderPhoto={() => {}} />;
      case 'students': return <StudentList students={students} setStudents={setStudents} mode={appMode} />;
      case 'schedule': return <Schedule sessions={sessions} setSessions={setSessions} mode={appMode} />;
      case 'ai-coach': return <AICoach context={contextData} mode={appMode} currentUser={currentUser} />;
      case 'analytics': return <Analytics students={students} setStudents={setStudents} mode={appMode} />;
      case 'league': return <League students={students} mode={appMode} fixtures={fixtures} setFixtures={setFixtures} />;
      case 'finance': return <Finance finance={finance} setFinance={setFinance} students={students} mode={appMode} />;
      case 'attendance': return <Attendance students={students} sessions={sessions} mode={appMode} />;
      case 'media': return <MediaManager media={media} setMedia={setMedia} mode={appMode} />;
      case 'trainers': return <TrainerManager trainers={trainers} setTrainers={setTrainers} mode={appMode} />;
      case 'drills': return <Drills drills={drills} setDrills={setDrills} mode={appMode} />;
      case 'notes': return <TrainerNotebook notes={trainerNotes} setNotes={setNotes} mode={appMode} />;
      case 'settings': return <Settings />;
      default: return <Dashboard context={contextData} appMode={appMode} onNavigate={handleNavigate} />;
    }
  };

  if (!isLoggedIn) return (
    <Auth 
      onLogin={handleLogin} 
      onRegisterStudent={async (s) => { 
        setStudents(p => [...p, s]); 
        await storageService.saveToCloud(KEYS.STUDENTS, s); 
      }} 
      students={students} 
    />
  );

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden bg-[#f8fafc] relative">
      <Sidebar 
        activeView={activeView} 
        onViewChange={handleNavigate} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        appMode={appMode} 
        setAppMode={setAppMode} 
        onLogout={handleLogout} 
      />
      
      <main className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-500 lg:ml-[280px] ${isSidebarOpen ? 'opacity-50 pointer-events-none lg:opacity-100' : ''}`}>
        
        {/* MOBİL HEADER - Z-Index 20000 yapıldı */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md sticky top-0 z-[20000] border-b shadow-sm">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-zinc-950 text-white rounded-lg flex items-center justify-center font-black">BGB</div>
             <h1 className="text-xs font-black uppercase text-zinc-900 leading-none tracking-tighter">AKADEMİ <span className="text-red-600">PANEL</span></h1>
           </div>
           <div className="flex items-center gap-3">
             {/* Acil Çıkış Butonu (Mobil) - Doğrudan handleLogout çağırır */}
             <button 
                onClick={handleLogout}
                className="p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors active:scale-95 shadow-sm"
             >
                <LogOut size={20} />
             </button>

             <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-slate-100 rounded-lg active:scale-95"><Menu size={20}/></button>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pt-4 pb-32 sm:p-8">
          <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-0">
            {renderView()}
          </div>
        </div>
      </main>

      <MobileNav 
        activeView={activeView} 
        onViewChange={handleNavigate} 
        onToggleSidebar={() => setIsSidebarOpen(true)} 
        appMode={appMode} 
      />
    </div>
  );
};

export default App;