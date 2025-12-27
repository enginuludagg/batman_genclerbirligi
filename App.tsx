
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
import Auth from './components/Auth';
import Settings from './components/Settings';
import { ViewType, Student, Trainer, FinanceEntry, MediaPost, TrainingSession, AppMode, Notification, Drill, TrainerNote, AppContextData } from './types';
import { Bell, X, LogOut, LayoutGrid, Users, UserCheck, Wallet, Newspaper } from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [mediaTab, setMediaTab] = useState<'all' | 'bulletin' | 'gallery' | 'poll' | 'pending'>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appMode, setAppMode] = useState<AppMode>('admin');
  const [toast, setToast] = useState<Notification | null>(null);

  // Başlangıç verileri - Stabilizasyon için eksiksiz hale getirildi
  const [students, setStudents] = useState<Student[]>([
    { 
      id: '1', name: 'Arda Yılmaz', age: 11, birthYear: 2013, gender: 'Erkek', parentPhone: '0532 111 2233', 
      parentName: 'Mehmet Yılmaz', parentEmail: 'veli@bgb.com', password: '123456', 
      sport: 'Futbol', branchId: 'U11', level: 'Orta', status: 'active', attendance: 92, lastTraining: 'Bugün', 
      stats: { strength: 65, speed: 45, stamina: 70, technique: 90 }, 
      physicalStats: { speed20m: 3.8, height: 145, weight: 38, sitUps: 25, pushUps: 15, sitAndReach: 12, thighLength: 35, run1500m: '06:45' },
      feeStatus: 'Paid' 
    },
    { 
      id: '2', name: 'Zeynep Kaya', age: 12, birthYear: 2012, gender: 'Kız', parentPhone: '0544 222 3344', 
      parentName: 'Fatma Kaya', parentEmail: 'zeynep@bgb.com', password: '123456',
      sport: 'Voleybol', branchId: 'U12', level: 'İleri', status: 'active', attendance: 95, lastTraining: 'Bugün', 
      stats: { strength: 60, speed: 70, stamina: 85, technique: 95 }, 
      physicalStats: { speed20m: 3.5, height: 165, weight: 48, sitUps: 30, pushUps: 20, sitAndReach: 18, thighLength: 40, run1500m: '07:10' },
      feeStatus: 'Paid' 
    }
  ]);

  const [trainers, setTrainers] = useState<Trainer[]>([
    { id: '1', name: 'Engin Uludağ', specialty: 'Futbol Baş Antrenörü', phone: '0533 123 4567', groups: ['U14', 'U16'] }
  ]);

  const [trainerNotes, setNotes] = useState<TrainerNote[]>([
    { id: 'n1', trainerName: 'Engin Hoca', content: 'U11 takımı için 5 adet yeni antrenman yeleği gerekiyor.', date: '22.05.2024', status: 'new', priority: 'medium', category: 'Malzeme', targetScope: 'U11' },
    { id: 'n2', trainerName: 'Murat Hoca', content: 'Saha aydınlatmalarında 2 panel çalışmıyor.', date: '21.05.2024', status: 'read', priority: 'high', category: 'Saha Dışı', targetScope: 'Genel' }
  ]);

  const [sessions, setSessions] = useState<TrainingSession[]>([
    { id: 's1', title: 'Teknik Antrenman', group: 'U11', time: '17:00 - 18:30', day: 'Pazartesi', location: 'Saha 1 (Ana)' }
  ]);

  const [finance, setFinance] = useState<FinanceEntry[]>([]);
  const [media, setMedia] = useState<MediaPost[]>([]);
  const [drills, setDrills] = useState<Drill[]>([]);

  // Merkezi bağlam verisi
  const contextData: AppContextData = {
    students,
    trainers,
    branches: [],
    sessions,
    finance,
    media,
    drills,
    attendance: [],
    notifications: [],
    trainerNotes
  };

  const handleNavigate = (view: ViewType, subTab?: string) => {
    setActiveView(view);
    if (view === 'media' && subTab) {
      setMediaTab(subTab as any);
    }
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
      case 'schedule': return <Schedule sessions={sessions} setSessions={(s) => setSessions(s)} mode={appMode} />;
      case 'ai-coach': return <AICoach context={contextData} mode={appMode} />;
      case 'analytics': return <Analytics students={students} setStudents={setStudents} mode={appMode} />;
      case 'league': return <League students={students} />;
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
        {/* Header - Desktop */}
        <div className="hidden lg:flex items-center justify-between px-8 py-6 bg-white border-b border-slate-100 sticky top-0 z-[500]">
           <div className="flex items-center gap-4">
              <div className="bg-red-50 text-red-600 p-2 rounded-xl"><LayoutGrid size={20} /></div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 italic">
                {activeView.toUpperCase()} <span className="text-slate-200">/</span> {appMode === 'admin' ? 'YÖNETİCİ' : 'VELİ'}
              </h2>
           </div>
           <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-red-600 transition-colors">
              <LogOut size={16} /> ÇIKIŞ YAP
           </button>
        </div>

        {/* Header - Mobile */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 sticky top-0 z-[1000]">
           <button onClick={() => setIsLoggedIn(false)} className="bg-slate-900 text-white p-2.5 rounded-xl">
             <LogOut size={16} />
           </button>
           <h1 className="text-xs font-black italic uppercase tracking-tighter">
            BATMAN <span className="text-red-600">GB AKADEMİ</span>
           </h1>
           <div className="w-10"></div>
        </div>

        {/* View Content */}
        <div className="p-4 sm:p-8 max-w-[1400px] mx-auto w-full">
          {renderView()}
        </div>
      </main>

      {/* Toast Notification */}
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
