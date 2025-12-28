
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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-zinc-100 px-6 py-3 pb-[calc(env(safe-area-inset-bottom)+16px)] z-[9999] flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.15)] backdrop-blur-xl">
      
      <button 
        onClick={() => onViewChange('dashboard')}
        className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${activeView === 'dashboard' ? 'text-[#E30613]' : 'text-zinc-400'}`}
      >
        <LayoutDashboard size={26} strokeWidth={activeView === 'dashboard' ? 2.5 : 2} />
        {activeView === 'dashboard' && <div className="w-1 h-1 bg-[#E30613] rounded-full mt-0.5"></div>}
      </button>

      <button 
        onClick={() => onViewChange('schedule')}
        className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${activeView === 'schedule' ? 'text-[#E30613]' : 'text-zinc-400'}`}
      >
        <Calendar size={26} strokeWidth={activeView === 'schedule' ? 2.5 : 2} />
        {activeView === 'schedule' && <div className="w-1 h-1 bg-[#E30613] rounded-full mt-0.5"></div>}
      </button>

      {/* Admin ise Finans, Veli ise Lig/Mac Butonu */}
      <button 
        onClick={() => onViewChange(appMode === 'admin' ? 'finance' : 'league')}
        className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${['finance', 'league'].includes(activeView) ? 'text-[#E30613]' : 'text-zinc-400'}`}
      >
        {appMode === 'admin' ? (
           <Wallet size={26} strokeWidth={activeView === 'finance' ? 2.5 : 2} />
        ) : (
           <Trophy size={26} strokeWidth={activeView === 'league' ? 2.5 : 2} />
        )}
        {['finance', 'league'].includes(activeView) && <div className="w-1 h-1 bg-[#E30613] rounded-full mt-0.5"></div>}
      </button>

      <button 
        onClick={() => onViewChange('students')}
        className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${activeView === 'students' ? 'text-[#E30613]' : 'text-zinc-400'}`}
      >
        <Users size={26} strokeWidth={activeView === 'students' ? 2.5 : 2} />
        {activeView === 'students' && <div className="w-1 h-1 bg-[#E30613] rounded-full mt-0.5"></div>}
      </button>

      <button 
        onClick={onToggleSidebar}
        className="flex flex-col items-center gap-1 text-zinc-400 active:text-black transition-colors active:scale-90"
      >
        <Menu size={26} />
      </button>

    </div>
  );
};

export default MobileNav;
