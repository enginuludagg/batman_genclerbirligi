
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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 px-6 py-4 pb-safe-bottom z-[2000] flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      
      <button 
        onClick={() => onViewChange('dashboard')}
        className={`flex flex-col items-center gap-1 transition-all ${activeView === 'dashboard' ? 'text-[#E30613] scale-110' : 'text-gray-400'}`}
      >
        <LayoutDashboard size={24} strokeWidth={activeView === 'dashboard' ? 2.5 : 2} />
        {activeView === 'dashboard' && <div className="w-1 h-1 bg-[#E30613] rounded-full mt-1"></div>}
      </button>

      <button 
        onClick={() => onViewChange('schedule')}
        className={`flex flex-col items-center gap-1 transition-all ${activeView === 'schedule' ? 'text-[#E30613] scale-110' : 'text-gray-400'}`}
      >
        <Calendar size={24} strokeWidth={activeView === 'schedule' ? 2.5 : 2} />
        {activeView === 'schedule' && <div className="w-1 h-1 bg-[#E30613] rounded-full mt-1"></div>}
      </button>

      {/* Admin ise Finans, Veli ise Lig/Mac Butonu */}
      <button 
        onClick={() => onViewChange(appMode === 'admin' ? 'finance' : 'league')}
        className={`flex flex-col items-center gap-1 transition-all ${['finance', 'league'].includes(activeView) ? 'text-[#E30613] scale-110' : 'text-gray-400'}`}
      >
        {appMode === 'admin' ? (
           <Wallet size={24} strokeWidth={activeView === 'finance' ? 2.5 : 2} />
        ) : (
           <Trophy size={24} strokeWidth={activeView === 'league' ? 2.5 : 2} />
        )}
        {['finance', 'league'].includes(activeView) && <div className="w-1 h-1 bg-[#E30613] rounded-full mt-1"></div>}
      </button>

      <button 
        onClick={() => onViewChange('students')}
        className={`flex flex-col items-center gap-1 transition-all ${activeView === 'students' ? 'text-[#E30613] scale-110' : 'text-gray-400'}`}
      >
        <Users size={24} strokeWidth={activeView === 'students' ? 2.5 : 2} />
        {activeView === 'students' && <div className="w-1 h-1 bg-[#E30613] rounded-full mt-1"></div>}
      </button>

      <button 
        onClick={onToggleSidebar}
        className="flex flex-col items-center gap-1 text-gray-400 active:text-black transition-colors"
      >
        <Menu size={24} />
      </button>

    </div>
  );
};

export default MobileNav;
