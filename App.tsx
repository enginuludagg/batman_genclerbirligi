
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
import Auth from './components/Auth';
import { ViewType, Student, Trainer, FinanceEntry, MediaPost, TrainingSession, AppMode, Notification } from './types';
import { Bell, X, LogOut, LayoutGrid, Users, UserCheck, Wallet, Newspaper } from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [mediaTab, setMediaTab] = useState<'all' | 'bulletin' | 'gallery' | 'poll' | 'pending'>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appMode, setAppMode] = useState<AppMode>('admin');
  const [toast, setToast] = useState<Notification | null>(null);

  const [students, setStudents] = useState<Student[]>([
    { 
      id: '1', name: 'Arda Yılmaz', age: 11, birthYear: 2013, parentPhone: '0532 111 2233', sport: 'Futbol', branchId: 'U11', level: 'Orta', status: 'active', attendance: 92, lastTraining: 'Bugün', 
      stats: { strength: 65, speed: 45, stamina: 70, technique: 90 }, 
      physicalStats: { speed20m: 3.8, height: 145, weight: 38, sitUps: 25, pushUps: 15, sitAndReach: 12, thighLength: 35, run1500m: '06:45' },
      feeStatus: 'Paid' 
    },
    { 
      id: '2', name: 'Zeynep Kaya', age: 12, birthYear: 2012, parentPhone: '0544 222 3344', sport: 'Voleybol', branchId: 'MİDİ KIZLAR', level: 'İleri', status: 'active', attendance: 95, lastTraining: 'Bugün', 
      stats: { strength: 60, speed: 70, stamina: 85, technique: 95 }, 
      physicalStats: { speed20m: 3.5, height: 165, weight: 48, sitUps: 30, pushUps: 20, sitAndReach: 18, thighLength: 40, run1500m: '07:10' },
      feeStatus: 'Paid' 
    }
  ]);

  const [finance, setFinance] = useState<FinanceEntry[]>([
    { id: 'f1', type: 'income', category: 'Aidat', amount: 1200, date: '2024-05-15', description: 'Mayıs Ayı Aidat Ödemesi', branch: 'Futbol Akademi', paymentMethod: 'Banka' }
  ]);

  const [media, setMedia] = useState<MediaPost[]>([
    { id: 'm1', title: 'Yeni Sezon Kayıtları', type: 'bulletin', content: 'Batman Gençlerbirliği akademi kayıtları devam ediyor.', date: '2024-05-20', status: 'published' }
  ]);

  const [sessions, setSessions] = useState<TrainingSession[]>([
    { id: 's1', title: 'Teknik Antrenman', group: 'U11', time: '17:00 - 18:30', day: 'Pazartesi', location: 'Saha 1' }
  ]);

  const handleDeepNav = (view: ViewType, subTab?: string) => {
    setActiveView(view);
    if (view === 'media' && subTab) setMediaTab(subTab as any);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegisterStudent = (newStudent: Student) => {
    setStudents(prev => [newStudent, ...prev]);
    setToast({ title: 'BAŞVURU ALINDI', message: 'Kaydınız teknik ekibe iletildi, sizinle iletişime geçeceğiz.' });
  };

  const contextData = { students, trainers: [], finance, media, drills: [], sessions, attendance: [], branches: [], notifications: [] };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard context={contextData} appMode={appMode} onNavigate={handleDeepNav} />;
      case 'students': return <StudentList students={students} setStudents={setStudents} mode={appMode} />;
      case 'schedule': return <Schedule sessions={sessions} setSessions={setSessions} mode={appMode} />;
      case 'attendance': return <Attendance students={students.filter(s => s.status === 'active')} sessions={sessions} mode={appMode} />;
      case 'finance': return <Finance finance={finance} setFinance={setFinance} students={students} mode={appMode} />;
      case 'media': return <MediaManager media={media} setMedia={setMedia as any} mode={appMode} activeTabOverride={mediaTab} setActiveTabOverride={setMediaTab} />;
      case 'league': return <League students={students} />;
      case 'analytics': return <Analytics students={students.filter(s => s.status === 'active')} setStudents={setStudents} mode={appMode} />;
      case 'ai-coach': return <AICoach context={contextData} />;
      case 'trainers': return <TrainerManager trainers={[]} setTrainers={() => {}} mode={appMode} />;
      case 'drills': return <Drills />;
      default: return <Dashboard context={contextData} appMode={appMode} onNavigate={handleDeepNav} />;
    }
  };

  if (!isLoggedIn) {
    return <Auth onLogin={(mode) => { setIsLoggedIn(true); setAppMode(mode); }} onRegisterStudent={handleRegisterStudent} />;
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
        {/* Desktop Header */}
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

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 sticky top-0 z-[1000]">
           <button onClick={() => setIsLoggedIn(false)} className="bg-slate-900 text-white p-2.5 rounded-xl">
             <LogOut size={16} />
           </button>
           <h1 className="text-xs font-black italic uppercase tracking-tighter">
            BATMAN <span className="text-red-600">GB AKADEMİ</span>
           </h1>
           <div className="w-10"></div>
        </div>

        <div className="p-4 sm:p-8 max-w-[1400px] mx-auto w-full">
          {renderView()}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-6 py-4 flex justify-between items-center z-[2000] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <button onClick={() => setActiveView('dashboard')} className={`p-2 transition-all ${activeView === 'dashboard' ? 'text-red-600 scale-110' : 'text-slate-300'}`}><LayoutGrid size={24} /></button>
        <button onClick={() => setActiveView('students')} className={`p-2 transition-all ${activeView === 'students' ? 'text-red-600 scale-110' : 'text-slate-300'}`}><Users size={24} /></button>
        <button onClick={() => setActiveView('attendance')} className={`p-2 transition-all ${activeView === 'attendance' ? 'text-red-600 scale-110' : 'text-slate-300'}`}><UserCheck size={24} /></button>
        <button onClick={() => setActiveView('finance')} className={`p-2 transition-all ${activeView === 'finance' ? 'text-red-600 scale-110' : 'text-slate-300'}`}><Wallet size={24} /></button>
        <button onClick={() => setActiveView('media')} className={`p-2 transition-all ${activeView === 'media' ? 'text-red-600 scale-110' : 'text-slate-300'}`}><Newspaper size={24} /></button>
      </div>

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
