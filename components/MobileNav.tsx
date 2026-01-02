
import React from 'react';
import { LayoutDashboard, Calendar, Users, Menu, Wallet, Trophy } from 'lucide-react';
import { ViewType, AppMode } from '../types';

interface MobileNavProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  onToggleSidebar: () => void;
  appMode: AppMode;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeView, onViewChange, onToggleSidebar, appMode }) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-2xl border-t border-zinc-100 z-[9999] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
      {/* Menü Butonları */}
      <div className="flex justify-around items-center px-2 py-3 pb-[calc(env(safe-area-inset-bottom,12px)+8px)]">
        
        <button 
          onClick={() => onViewChange('dashboard')}
          className={`flex flex-col items-center gap-1.5 transition-all active:scale-90 flex-1 ${activeView === 'dashboard' ? 'text-red-600' : 'text-zinc-400'}`}
        >
          <div className={`p-2 rounded-2xl transition-all ${activeView === 'dashboard' ? 'bg-red-50' : ''}`}>
            <LayoutDashboard size={22} strokeWidth={activeView === 'dashboard' ? 2.5 : 2} />
          </div>
          <span className="text-[7px] font-black uppercase tracking-widest">PANEL</span>
        </button>

        <button 
          onClick={() => onViewChange('schedule')}
          className={`flex flex-col items-center gap-1.5 transition-all active:scale-90 flex-1 ${activeView === 'schedule' ? 'text-red-600' : 'text-zinc-400'}`}
        >
          <div className={`p-2 rounded-2xl transition-all ${activeView === 'schedule' ? 'bg-red-50' : ''}`}>
            <Calendar size={22} strokeWidth={activeView === 'schedule' ? 2.5 : 2} />
          </div>
          <span className="text-[7px] font-black uppercase tracking-widest">TAKVİM</span>
        </button>

        <button 
          onClick={() => onViewChange(appMode === 'admin' ? 'finance' : 'league')}
          className={`flex flex-col items-center gap-1.5 transition-all active:scale-90 flex-1 ${['finance', 'league'].includes(activeView) ? 'text-red-600' : 'text-zinc-400'}`}
        >
          <div className="relative">
            <div className={`p-2 rounded-2xl transition-all ${['finance', 'league'].includes(activeView) ? 'bg-red-50' : ''}`}>
              {appMode === 'admin' ? (
                <Wallet size={22} strokeWidth={activeView === 'finance' ? 2.5 : 2} />
              ) : (
                <Trophy size={22} strokeWidth={activeView === 'league' ? 2.5 : 2} />
              )}
            </div>
            {/* Canlı Veri Göstergesi */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <span className="text-[7px] font-black uppercase tracking-widest">{appMode === 'admin' ? 'FİNANS' : 'LİG'}</span>
        </button>

        <button 
          onClick={() => onViewChange('students')}
          className={`flex flex-col items-center gap-1.5 transition-all active:scale-90 flex-1 ${activeView === 'students' ? 'text-red-600' : 'text-zinc-400'}`}
        >
          <div className={`p-2 rounded-2xl transition-all ${activeView === 'students' ? 'bg-red-50' : ''}`}>
            <Users size={22} strokeWidth={activeView === 'students' ? 2.5 : 2} />
          </div>
          <span className="text-[7px] font-black uppercase tracking-widest">EKİP</span>
        </button>

        <button 
          onClick={onToggleSidebar}
          className="flex flex-col items-center gap-1.5 text-zinc-400 active:text-red-600 transition-all active:scale-90 flex-1"
        >
          <div className="p-2 bg-slate-50 rounded-2xl">
            <Menu size={22} />
          </div>
          <span className="text-[7px] font-black uppercase tracking-widest">DİĞER</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNav;
