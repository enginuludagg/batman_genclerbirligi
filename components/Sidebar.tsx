
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
  // Yönetici Menüsü
  const adminMenu = [
    { id: 'dashboard', label: 'Ana Panel', icon: LayoutDashboard },
    { id: 'about', label: 'Hakkımızda', icon: Info }, // Yeni eklendi
    { id: 'settings', label: 'Sistem Ayarları', icon: Settings, highlight: true },
    { id: 'students', label: 'Sporcu Rehberi', icon: Users },
    { id: 'notes', label: 'Antrenör Notları', icon: ClipboardList },
    { id: 'trainers', label: 'Teknik Ekip', icon: GraduationCap },
    { id: 'attendance', label: 'Yoklama', icon: UserCheck },
    { id: 'drills', label: 'Drill Kütüphanesi', icon: Dumbbell },
    { id: 'schedule', label: 'Antrenman Takvimi', icon: Calendar },
    { id: 'finance', label: 'Finans Yönetimi', icon: Wallet },
    { id: 'media', label: 'BGB Medya', icon: Newspaper },
    { id: 'league', label: 'Lig & Fikstür', icon: Trophy },
    { id: 'analytics', label: 'Gelişim Analizi', icon: BarChart },
    { id: 'ai-coach', label: 'BGB AI Asistan', icon: MessageSquare },
  ];

  const parentMenu = [
    { id: 'dashboard', label: 'Sporcu Özeti', icon: LayoutDashboard },
    { id: 'about', label: 'Hakkımızda', icon: Info }, // Yeni eklendi
    { id: 'schedule', label: 'Antrenman Takvimi', icon: Calendar },
    { id: 'drills', label: 'Ev Çalışmaları', icon: Dumbbell },
    { id: 'media', label: 'Haber & Duyuru', icon: Newspaper },
    { id: 'analytics', label: 'Gelişim Karnesi', icon: BarChart },
    { id: 'league', label: 'Maçlar & Puan', icon: Trophy },
    { id: 'ai-coach', label: 'BGB AI Destek', icon: MessageSquare },
  ];

  const menuItems = appMode === 'admin' ? adminMenu : parentMenu;

  const handleNav = (id: ViewType) => {
    onViewChange(id);
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="lg:hidden fixed top-5 right-5 z-[2500] bg-red-600 text-white p-4 rounded-2xl shadow-2xl active:scale-90 transition-all border-2 border-white/20"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`fixed left-0 top-0 h-full w-64 bg-slate-900 text-white flex flex-col z-[2100] transition-all duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full shadow-none'}`}>
        <div className="p-6 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-10" />
            <div>
              <h1 className="text-[10px] font-black tracking-tighter leading-none uppercase">
                BATMAN <br/><span className="text-red-600 text-xs">GENÇLERBİRLİĞİ<sup>®</sup></span>
              </h1>
            </div>
          </div>
        </div>

        <div className="px-6 pt-6 flex-shrink-0">
          <div className="w-full bg-slate-800/50 border border-slate-800 p-3 rounded-2xl flex items-center gap-3">
            <div className={`p-2 rounded-lg ${appMode === 'admin' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
              {appMode === 'admin' ? <ShieldAlert size={16} /> : <UserCircle size={16} />}
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">HESAP</p>
              <p className="text-[10px] font-black uppercase text-white truncate italic">
                {appMode === 'admin' ? 'Yönetici' : 'Veli Paneli'}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto no-scrollbar scroll-smooth">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            const isHighlighted = (item as any).highlight;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id as any)}
                className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-xl transition-all font-black text-xs uppercase tracking-widest ${
                  isActive 
                    ? 'bg-red-600 text-white shadow-lg scale-105' 
                    : isHighlighted 
                      ? 'bg-red-600/10 text-red-500 border border-red-600/30 shadow-[0_0_15px_rgba(227,6,19,0.1)]' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} className={isHighlighted && !isActive ? 'text-red-500 animate-pulse' : ''} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2 flex-shrink-0">
           <button 
             onClick={() => window.location.reload()}
             className="w-full flex items-center gap-3 p-4 rounded-2xl bg-slate-800/30 hover:bg-red-600 hover:text-white transition-all text-slate-500 font-black text-[10px] uppercase tracking-widest"
           >
              <LogOut size={16} /> <span>GÜVENLİ ÇIKIŞ</span>
           </button>
        </div>
      </aside>
      
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2050] lg:hidden animate-in fade-in duration-300"
        />
      )}
    </>
  );
};

export default Sidebar;
