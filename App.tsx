
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
import { Bell, X, LogOut, LayoutGrid, CheckCircle2, Database, RefreshCw, AlertTriangle, Menu, Smartphone, ShieldAlert, CloudOff, RotateCcw } from 'lucide-react';
import { storageService, KEYS } from './services/storageService';
import { isConfigured } from './services/firebaseConfig';

const App: React.FC = () => {
  // --- STATE BAŞLANGIÇ DEĞERLERİ (FLASH ÖNLEME) ---
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

  // URL Hash üzerinden View Başlatma (Yenileme Sorunu Çözümü)
  const getInitialView = (): ViewType => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['dashboard', 'students', 'trainers', 'schedule', 'attendance', 'finance', 'media', 'league', 'ai-coach', 'analytics', 'drills', 'settings', 'notes', 'about'].includes(hash)) {
        return hash as ViewType;
      }
    }
    return 'dashboard';
  };

  const [activeView, setActiveView] = useState<ViewType>(getInitialView);
  const [mediaTab, setMediaTab] = useState<'all' | 'bulletin' | 'gallery' | 'poll' | 'lineup' | 'pending'>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toast, setToast] = useState<Notification | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  // --- MERKEZİ VERİ DURUMLARI (BGB AKADEMİ) ---
  const [students, setStudents] = useState<Student[]>(() => storageService.load(KEYS.STUDENTS, []));
  const [trainers, setTrainers] = useState<Trainer[]>(() => storageService.load(KEYS.TRAINERS, []));
  const [trainerNotes, setNotes] = useState<TrainerNote[]>(() => storageService.load(KEYS.NOTES, []));
  const [sessions, setSessions] = useState<TrainingSession[]>(() => storageService.load(KEYS.SESSIONS, []));
  const [finance, setFinance] = useState<FinanceEntry[]>(() => storageService.load(KEYS.FINANCE, []));
  const [media, setMedia] = useState<MediaPost[]>(() => storageService.load(KEYS.MEDIA, []));
  const [drills, setDrills] = useState<Drill[]>(() => storageService.load(KEYS.DRILLS, []));
  const [fixtures, setFixtures] = useState<MatchResult[]>(() => storageService.load(KEYS.FIXTURES, []));

  // --- TARAYICI GEÇMİŞİ YÖNETİMİ (GERİ TUŞU DESTEĞİ) ---
  useEffect(() => {
    // Sayfa yüklendiğinde hash varsa onu ayarla
    const hash = window.location.hash.replace('#', '');
    if (hash && hash !== activeView) {
      setActiveView(hash as ViewType);
    }

    const handlePopState = () => {
      const currentHash = window.location.hash.replace('#', '');
      if (currentHash && currentHash !== activeView) {
        setActiveView(currentHash as ViewType);
      } else if (!currentHash) {
        setActiveView('dashboard');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []); // Sadece mount anında

  // View değiştiğinde URL güncelle
  const handleNavigate = (view: ViewType, subTab?: string) => {
    setActiveView(view);
    if (view === 'media' && subTab) setMediaTab(subTab as any);
    
    // Geçmişe ekle (Eğer zaten o URL'de değilsek)
    if (window.location.hash !== `#${view}`) {
      window.history.pushState({ view }, '', `#${view}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsSidebarOpen(false); // Mobil menüden geçişte sidebar kapansın
  };

  const handleLogin = (mode: AppMode, student?: Student) => {
    setAppMode(mode);
    setCurrentUser(student || null);
    setIsLoggedIn(true);
    localStorage.setItem('bgb_session', JSON.stringify({ mode, user: student || null }));
    handleNavigate('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('bgb_session');
    setIsLoggedIn(false);
    setAppMode('admin');
    setCurrentUser(null);
    setActiveView('dashboard');
    window.history.pushState(null, '', ' '); // URL temizle
  };

  // --- FIREBASE İLK YÜKLEME VE OTO-DOLDURMA ---
  useEffect(() => {
    if (!isConfigured) return;

    const fetchAllData = async () => {
      setIsSyncing(true);
      setConnectionError(false);
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

        // Veritabanı boşsa otomatik başlangıç verisi ekle
        if (cT.length === 0) {
           const founder: Trainer = {
             id: 'founder-engin', 
             name: 'Engin Uludağ', 
             specialty: 'Teknik Direktör', 
             phone: '0505 340 11 01', 
             groups: ['Tüm Yaş Grupları'], 
             biography: '14 yıllık tecrübe, TFF C ve TVF 2. Kademe Antrenörlük belgesi.',
             photoUrl: ''
           };
           await storageService.saveToCloud(KEYS.TRAINERS, founder);
           setTrainers([founder]);
        } else {
           setTrainers(cT as Trainer[]);
        }

        if (cM.length === 0) {
           const welcomePost: MediaPost = {
             id: 'welcome-post', 
             title: 'SİSTEM AKTİF - HOŞ GELDİNİZ', 
             type: 'bulletin',
             content: 'Batman Gençlerbirliği Dijital Altyapı sistemi başarıyla kuruldu. Veritabanı bağlantısı sağlandı.',
             date: new Date().toLocaleDateString('tr-TR'), 
             status: 'published', 
             likes: 0
           };
           await storageService.saveToCloud(KEYS.MEDIA, welcomePost);
           setMedia([welcomePost]);
        } else {
           setMedia(cM as MediaPost[]);
        }

        if (cS.length) setStudents(cS as Student[]);
        if (cN.length) setNotes(cN as TrainerNote[]);
        if (cSe.length) setSessions(cSe as TrainingSession[]);
        if (cF.length) setFinance(cF as FinanceEntry[]);
        if (cD.length) setDrills(cD as Drill[]);
        if (cFix.length) setFixtures(cFix as MatchResult[]);

      } catch (err) {
        console.error("BGB Sync Error:", err);
        setConnectionError(true);
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
        // Son eklenen/güncellenen öğeyi bulma mantığı basitleştirildi
        // Gerçek senaryoda diff almak gerekebilir ama şimdilik tüm listeyi basmak yerine sonuncuyu basıyoruz.
        // DİKKAT: Firebase Storage kullanılmıyor. Büyük veri (resim) varsa Firestore limitine takılabilir.
        // Bu yüzden optimizeImage fonksiyonları çok önemli.
        const last = updated[updated.length - 1];
        if (last) {
          storageService.saveToCloud(key, last).catch(() => setConnectionError(true));
        }
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
  const handleUpdateFixtures = (u: MatchResult[] | ((p: MatchResult[]) => MatchResult[])) => updateAndSync(KEYS.FIXTURES, u, setFixtures);

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
      // State güncelleme
      setTrainers(prev => prev.map(t => t.id === engin.id ? updatedEngin : t));
      // LocalStorage güncelleme
      const updatedList = trainers.map(t => t.id === engin.id ? updatedEngin : t);
      storageService.saveLocal(KEYS.TRAINERS, updatedList);
      // Cloud güncelleme
      if (isConfigured) {
        await storageService.saveToCloud(KEYS.TRAINERS, updatedEngin);
      }
      setToast({ title: 'BİLGİ', message: 'Hakkımızda sayfası güncellendi.' });
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
      case 'league': return <League students={students} mode={appMode} fixtures={fixtures} setFixtures={handleUpdateFixtures} onPostLineup={(p) => { 
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
    <div className="flex min-h-[100dvh] w-full bg-[#f8fafc] pb-safe-bottom lg:pb-0 selection:bg-red-600 selection:text-white overflow-x-hidden">
      <Sidebar 
        activeView={activeView} 
        onViewChange={(v) => handleNavigate(v)} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        appMode={appMode} 
        setAppMode={setAppMode}
        onLogout={handleLogout}
      />
      
      {/* 
        MobileNav ve Splash gibi fixed elementlerin etkilenmemesi için 
        main container'ı ayrı tutuyoruz.
      */}
      <main className={`flex-1 flex flex-col transition-all duration-500 ease-out min-w-0 min-h-[100dvh] relative ${isSidebarOpen ? 'lg:ml-[280px] scale-[0.98] opacity-50 pointer-events-none lg:opacity-100 lg:pointer-events-auto lg:scale-100' : 'lg:ml-[280px]'}`}>
        
        {/* MASAÜSTÜ HEADER */}
        <div className="hidden lg:flex items-center justify-between px-8 py-6 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-[500]">
           <div className="flex items-center gap-4">
              <div className="bg-red-50 text-[#E30613] p-2.5 rounded-xl"><LayoutGrid size={20} /></div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 italic">
                {activeView.toUpperCase()} <span className="text-slate-200 mx-2">/</span> <span className="text-zinc-900">BGB AKADEMİ</span>
              </h2>
           </div>
           <div className="flex items-center gap-6">
              {appMode === 'parent' && currentUser && (
                <div className="hidden lg:flex items-center gap-3 bg-zinc-900 text-white px-4 py-1.5 rounded-full">
                   <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-[10px] font-black">{currentUser.name[0]}</div>
                   <span className="text-[10px] font-black uppercase tracking-widest">{currentUser.name}</span>
                </div>
              )}

              {connectionError ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-200 bg-red-50 text-red-600 shadow-sm animate-pulse cursor-pointer" onClick={() => window.location.reload()}>
                  <CloudOff size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest italic">BAĞLANTI HATASI (YENİLE)</span>
                </div>
              ) : !isConfigured ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 text-blue-600 shadow-sm">
                  <Smartphone size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest italic">YEREL MOD (CİHAZ KAYDI)</span>
                </div>
              ) : (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${isSyncing ? 'bg-zinc-50 border-zinc-200 text-zinc-400' : 'bg-green-50 border-green-100 text-green-600'}`}>
                  {isSyncing ? <RefreshCw size={14} className="animate-spin" /> : <Database size={14} />}
                  <span className="text-[9px] font-black uppercase tracking-widest italic">{isSyncing ? 'EŞİTLENİYOR...' : 'SİSTEM ONLİNE'}</span>
                </div>
              )}
           </div>
        </div>

        {/* MOBİL HEADER */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white/90 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-[1000] shadow-sm">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-zinc-950 text-white rounded-lg flex items-center justify-center font-black italic">BGB</div>
             <h1 className="text-xs font-black italic uppercase tracking-tighter text-zinc-900 leading-none">AKADEMİ <br/><span className="text-[#E30613]">MOBİL</span></h1>
           </div>
           <div className="flex items-center gap-2">
             {connectionError ? (
               <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-red-50 text-red-600 border border-red-100 animate-pulse" onClick={() => window.location.reload()}>
                 <CloudOff size={16} />
               </div>
             ) : (
               <div className={`flex items-center justify-center w-9 h-9 rounded-xl ${isSyncing ? 'bg-zinc-50 text-zinc-400' : 'bg-green-50 text-green-600'}`}>
                 {isSyncing ? <RefreshCw size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
               </div>
             )}
           </div>
        </div>

        {/* İçerik Alanı */}
        <div className="p-4 sm:p-8 max-w-[1600px] mx-auto w-full flex-1 pb-24 lg:pb-8">{renderView()}</div>
        
      </main>

      {/* MOBİL NAVİGASYON - En Dış Katmanda */}
      {isLoggedIn && (
        <MobileNav 
          activeView={activeView} 
          onViewChange={handleNavigate} 
          onToggleSidebar={() => setIsSidebarOpen(true)}
          appMode={appMode}
        />
      )}

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

      {/* İLK KURULUM YÜKLEME EKRANI */}
      {isSyncing && trainers.length === 0 && !connectionError && (
        <div className="fixed inset-0 z-[9999] bg-[#111] flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
           <div className="relative mb-8">
             <div className="w-24 h-24 border-4 border-zinc-800 rounded-full"></div>
             <div className="w-24 h-24 border-4 border-t-[#E30613] rounded-full animate-spin absolute inset-0"></div>
             <div className="absolute inset-0 flex items-center justify-center font-black italic text-xl tracking-tighter">BGB</div>
           </div>
           <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">SİSTEM KURULUYOR</h2>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 animate-pulse">VERİTABANI BAĞLANTISI SAĞLANIYOR...</p>
        </div>
      )}
    </div>
  );
};

export default App;
