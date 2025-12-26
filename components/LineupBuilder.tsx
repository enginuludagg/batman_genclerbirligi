
import React, { useState } from 'react';
import { Student } from '../types';
import { Share2, UserPlus, X, Download, Camera, LayoutGrid } from 'lucide-react';
import Logo from './Logo';

interface Props {
  students: Student[];
  onClose: () => void;
}

const LineupBuilder: React.FC<Props> = ({ students, onClose }) => {
  const [selectedPlayers, setSelectedPlayers] = useState<Student[]>([]);
  const [formation, setFormation] = useState('4-3-3');

  const togglePlayer = (student: Student) => {
    if (selectedPlayers.find(p => p.id === student.id)) {
      setSelectedPlayers(selectedPlayers.filter(p => p.id !== student.id));
    } else if (selectedPlayers.length < 11) {
      setSelectedPlayers([...selectedPlayers, student]);
    }
  };

  return (
    <div className="fixed inset-0 z-[6000] bg-zinc-950 flex flex-col sm:flex-row animate-in slide-in-from-bottom-10 duration-500">
      {/* Sol Panel: Saha Görseli */}
      <div className="flex-[2] bg-zinc-900 relative overflow-hidden flex items-center justify-center p-4">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        {/* Futbol Sahası */}
        <div className="w-full max-w-lg aspect-[2/3] bg-emerald-700 rounded-xl relative shadow-2xl border-4 border-white/20 overflow-hidden">
           {/* Saha Çizgileri */}
           <div className="absolute inset-0 border-2 border-white/30 m-4 rounded-lg"></div>
           <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/30 rounded-full"></div>
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 border-2 border-white/30"></div>
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 border-2 border-white/30"></div>

           {/* Kadro Başlığı */}
           <div className="absolute top-8 left-0 right-0 text-center z-10">
              <Logo className="w-12 h-12 mx-auto mb-2" />
              <h3 className="text-white font-black italic text-xl uppercase tracking-tighter shadow-black drop-shadow-lg">MAÇ KADROSU</h3>
              <p className="text-white/70 text-[8px] font-black tracking-[0.3em] uppercase">BATMAN GENÇLERBİRLİĞİ SK</p>
           </div>

           {/* Oyuncuların Sahadaki Yerleşimi (Basit Grid) */}
           <div className="absolute inset-0 pt-32 pb-8 px-4 grid grid-cols-3 gap-4 items-center justify-items-center">
              {selectedPlayers.map((player, idx) => (
                <div key={player.id} className="flex flex-col items-center animate-in zoom-in duration-300">
                  <div className="w-12 h-12 bg-white rounded-full border-2 border-red-600 flex items-center justify-center font-black text-xs text-zinc-900 shadow-xl overflow-hidden">
                    {player.photoUrl ? <img src={player.photoUrl} className="w-full h-full object-cover" /> : player.name[0]}
                  </div>
                  <span className="bg-zinc-900/80 text-white text-[7px] font-black px-2 py-0.5 rounded mt-1 uppercase whitespace-nowrap border border-white/10">{player.name}</span>
                </div>
              ))}
              {Array.from({length: 11 - selectedPlayers.length}).map((_, i) => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                  <UserPlus size={16} className="text-white/10" />
                </div>
              ))}
           </div>

           {/* Alt Bilgi */}
           <div className="absolute bottom-4 left-0 right-0 text-center">
             <span className="text-white/40 text-[7px] font-black uppercase tracking-widest">BGB AKADEMİ DİJİTAL YÖNETİM SİSTEMİ</span>
           </div>
        </div>
      </div>

      {/* Sağ Panel: Oyuncu Seçimi */}
      <div className="flex-1 bg-white flex flex-col h-full border-l border-white/10">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
           <div>
             <h4 className="font-black text-lg text-zinc-900 italic uppercase leading-none">OYUNCU <span className="text-red-600">SEÇİMİ</span></h4>
             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">{selectedPlayers.length} / 11 OYUNCU</p>
           </div>
           <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors">
             <X size={20} />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
           {students.map(s => (
             <button 
              key={s.id}
              onClick={() => togglePlayer(s)}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${
                selectedPlayers.find(p => p.id === s.id) 
                  ? 'border-red-600 bg-red-50' 
                  : 'border-gray-50 bg-white hover:border-gray-200'
              }`}
             >
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white text-[10px] font-black italic">{s.name[0]}</div>
                 <div className="text-left">
                   <p className="text-[10px] font-black text-zinc-900 uppercase leading-none">{s.name}</p>
                   <p className="text-[8px] font-bold text-gray-400 uppercase mt-1">{s.branchId}</p>
                 </div>
               </div>
               {selectedPlayers.find(p => p.id === s.id) && (
                 <div className="w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] font-black">✓</div>
               )}
             </button>
           ))}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-3">
           <button 
            disabled={selectedPlayers.length === 0}
            className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50 transition-all"
           >
             <Camera size={18} /> GÖRSELİ KAYDET
           </button>
           <button 
            disabled={selectedPlayers.length === 0}
            className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50 transition-all"
           >
             <Share2 size={18} /> KADROYU PAYLAŞ
           </button>
        </div>
      </div>
    </div>
  );
};

export default LineupBuilder;
