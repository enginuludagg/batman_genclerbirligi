
import React from 'react';
import { 
  LayoutDashboard, Users, Calendar, Trophy, 
  Wallet, UserCheck, Newspaper, GraduationCap, 
  BarChart, MessageSquare, Menu, X, ShieldAlert,
  UserCircle, Settings, LogOut, Dumbbell, ClipboardList, Info
} from 'lucide-react';
import { ViewType, AppMode } from '../types';
import Logo from './Logo';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, isOpen, setIsOpen, appMode, setAppMode }) => {
  const adminMenu = [
    { id: 'dashboard', label: 'Ana Panel', icon: LayoutDashboard },
    { id: 'about', label: 'Hakkımızda', icon: Info },
    { id: 'settings', label: 'Ayarlar', icon: Settings, highlight: true },
    { id: 'students', label: 'Sporcular', icon: Users },
    { id: 'attendance', label: 'Yoklama', icon: UserCheck },
    { id: 'schedule', label: 'Program', icon: Calendar },
    { id: 'finance', label: 'Finans', icon: Wallet },
    { id: 'media', label: 'Medya', icon: Newspaper },
    { id: 'league', label: 'Lig & Maç', icon: Trophy },
    { id: 'drills', label: 'Driller', icon: Dumbbell },
    { id: 'analytics', label: 'Analiz', icon: BarChart },
    { id: 'notes', label: 'Raporlar', icon: ClipboardList },
    { id: 'trainers', label: 'Kadro', icon: GraduationCap },
    { id: 'ai-coach', label: 'BGB AI', icon: MessageSquare },
  ];

  const parentMenu = [
    { id: 'dashboard', label: 'Ana Sayfa', icon: LayoutDashboard },
    { id: 'about', label: 'Hakkımızda', icon: Info },
    { id: 'schedule', label: 'Takvim', icon: Calendar },
    { id: 'drills', label: 'Ev Ödevi', icon: Dumbbell },
    { id: 'media', label: 'Haberler', icon: Newspaper },
    { id: 'analytics', label: 'Karne', icon: BarChart },
    { id: 'league', label: 'Fikstür', icon: Trophy },
    { id: 'ai-coach', label: 'Asistan', icon: MessageSquare },
  ];

  const menuItems = appMode === 'admin' ? adminMenu : parentMenu;

  const handleNav = (id: ViewType) => {
    onViewChange(id);
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  return (
    <>
      {/* Mobil Hamburger Buton */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="lg:hidden fixed top-4 right-4 z-[2500] bg-zinc-950 text-white p-3.5 rounded-2xl shadow-xl active:scale-90 transition-all border border-white/10"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <aside className={`fixed left-0 top-0 h-full w-[280px] bg-zinc-950 text-white flex flex-col z-[2100] transition-transform duration-500 ease-out lg:translate-x-0 border-r border-white/5 shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Logo Area */}
        <div className="p-8 flex items-center gap-4 border-b border-white/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
           <div className="relative z-10 w-12 h-12 bg-white rounded-2xl p-1 flex items-center justify-center shadow-lg">
             <Logo className="w-full h-full" />
           </div>
           <div className="relative z-10">
              <h1 className="text-xs font-black tracking-tighter leading-none uppercase">
                BATMAN <br/><span className="text-[#E30613] text-sm">GENÇLERBİRLİĞİ</span>
              </h1>
              <p className="text-[8px] text-zinc-500 font-bold tracking-[0.3em] mt-1">V.1.2</p>
           </div>
        </div>

        {/* User Card */}
        <div className="px-6 py-6">
          <div className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-4 backdrop-blur-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg ${appMode === 'admin' ? 'bg-red-600' : 'bg-blue-600'}`}>
              {appMode === 'admin' ? <ShieldAlert size={20} /> : <UserCircle size={20} />}
            </div>
            <div className="overflow-hidden">
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">AKTİF MOD</p>
              <p className="text-[10px] font-black uppercase text-white truncate italic tracking-wide">
                {appMode === 'admin' ? 'YÖNETİCİ PANELİ' : 'VELİ / SPORCU'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 pb-6 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            const isHighlighted = (item as any).highlight;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id as any)}
                className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-[0.15em] relative overflow-hidden group ${
                  isActive 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/20 translate-x-2' 
                    : isHighlighted 
                      ? 'bg-red-600/10 text-red-500 border border-red-600/20' 
                      : 'text-zinc-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20"></div>}
                <Icon size={18} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span>{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-lg"></div>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-black/20">
           <button 
             onClick={() => window.location.reload()}
             className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-zinc-900 hover:bg-red-600 text-zinc-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest group border border-white/5"
           >
              <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> 
              <span>ÇIKIŞ YAP</span>
           </button>
        </div>
      </aside>
      
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2050] lg:hidden animate-in fade-in duration-500"
        />
      )}
    </>
  );
};

export default Sidebar;
