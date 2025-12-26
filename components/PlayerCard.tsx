
import React from 'react';
import { Student } from '../types';
import Logo from './Logo';
import { Shield, Zap, Target, Timer, Dumbbell } from 'lucide-react';

interface Props {
  student: Student;
  onClose: () => void;
}

const PlayerCard: React.FC<Props> = ({ student, onClose }) => {
  // Seviyeye göre tema belirleme
  const getTheme = () => {
    switch (student.level) {
      case 'İleri': return { bg: 'bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-700', text: 'text-yellow-950', border: 'border-yellow-200' };
      case 'Orta': return { bg: 'bg-gradient-to-b from-gray-200 via-gray-400 to-gray-600', text: 'text-gray-900', border: 'border-gray-100' };
      default: return { bg: 'bg-gradient-to-b from-orange-400 via-orange-600 to-orange-800', text: 'text-orange-950', border: 'border-orange-300' };
    }
  };

  const theme = getTheme();

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm">
        {/* Kapat Butonu */}
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-white font-black text-xs uppercase tracking-widest flex items-center gap-2"
        >
          KAPAT <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">✕</div>
        </button>

        {/* Kart Gövdesi */}
        <div className={`aspect-[2/3] ${theme.bg} rounded-[2rem] p-1 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative`}>
          {/* Arka Plan Deseni */}
          <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-white/40"></div>
             <div className="grid grid-cols-6 h-full gap-1 rotate-12 scale-150">
               {Array.from({length: 24}).map((_, i) => <div key={i} className="bg-white/10 h-full w-px"></div>)}
             </div>
          </div>

          <div className={`h-full w-full rounded-[1.9rem] border-4 ${theme.border} flex flex-col items-center p-6 relative z-10`}>
            {/* Logo ve Reyting Üst Kısım */}
            <div className="w-full flex justify-between items-start">
              <div className="flex flex-col items-center">
                <span className={`text-4xl font-black italic ${theme.text} leading-none tracking-tighter`}>99</span>
                <span className={`text-[10px] font-black ${theme.text} opacity-70 uppercase tracking-widest`}>{student.branchId}</span>
              </div>
              <div className="w-10 h-10">
                <Logo className="w-full h-full" />
              </div>
            </div>

            {/* Sporcu Görseli Alanı */}
            <div className="w-40 h-40 mt-4 relative">
              <div className="absolute inset-0 bg-black/10 rounded-full blur-2xl"></div>
              <div className={`w-full h-full bg-black/20 rounded-full flex items-center justify-center overflow-hidden border-4 ${theme.border} shadow-2xl`}>
                 {student.photoUrl ? (
                   <img src={student.photoUrl} className="w-full h-full object-cover" />
                 ) : (
                   <span className={`text-5xl font-black italic ${theme.text} opacity-30`}>{student.name[0]}</span>
                 )}
              </div>
            </div>

            {/* İsim */}
            <div className="mt-6 text-center w-full">
               <h3 className={`text-2xl font-black italic uppercase tracking-tighter ${theme.text} leading-none border-b-2 border-black/10 pb-2 inline-block px-4`}>
                 {student.name}
               </h3>
               <p className={`text-[9px] font-black ${theme.text} opacity-60 mt-2 uppercase tracking-[0.3em]`}>BATMAN GENÇLERBİRLİĞİ SK</p>
            </div>

            {/* İstatistikler */}
            <div className={`mt-8 grid grid-cols-2 gap-x-8 gap-y-4 w-full px-4 ${theme.text}`}>
               <div className="flex justify-between items-center border-b border-black/5 pb-1">
                 <span className="text-[10px] font-black uppercase opacity-60">GÜÇ</span>
                 <span className="text-sm font-black italic">{student.stats.strength}</span>
               </div>
               <div className="flex justify-between items-center border-b border-black/5 pb-1">
                 <span className="text-[10px] font-black uppercase opacity-60">HIZ</span>
                 <span className="text-sm font-black italic">{student.stats.speed}</span>
               </div>
               <div className="flex justify-between items-center border-b border-black/5 pb-1">
                 <span className="text-[10px] font-black uppercase opacity-60">DRN</span>
                 <span className="text-sm font-black italic">{student.stats.stamina}</span>
               </div>
               <div className="flex justify-between items-center border-b border-black/5 pb-1">
                 <span className="text-[10px] font-black uppercase opacity-60">TKN</span>
                 <span className="text-sm font-black italic">{student.stats.technique}</span>
               </div>
            </div>

            {/* Alt Bilgi */}
            <div className="mt-auto pt-6">
               <div className={`flex items-center gap-2 bg-black/10 px-4 py-2 rounded-full border border-black/5`}>
                 <Shield size={12} className={theme.text} />
                 <span className={`text-[8px] font-black uppercase tracking-widest ${theme.text}`}>ELİT GELİŞİM AKADEMİSİ</span>
               </div>
            </div>
          </div>
        </div>

        {/* Paylaş Butonu */}
        <button 
          onClick={() => alert('Kart görüntüsü galerinize kaydediliyor...')}
          className="mt-6 w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
        >
          KARTI SOSYAL MEDYADA PAYLAŞ
        </button>
      </div>
    </div>
  );
};

export default PlayerCard;
