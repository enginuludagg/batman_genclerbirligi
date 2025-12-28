
import React, { useState, useMemo } from 'react';
import { Student, MediaPost } from '../types';
import { X, Camera, History, Database, Users, Trophy, CheckCircle2, UserPlus, Trash2, Map as MapIcon } from 'lucide-react';
import Logo from './Logo';

interface Props {
  students: Student[];
  onClose: () => void;
  onPostToMedia?: (post: Partial<MediaPost>) => void;
}

type SportType = 'Futbol' | 'Voleybol';
type GameMode = '5v5' | '8v8' | '11v11' | '4v4' | '6v6';

interface Position {
  id: string;
  top: string;
  left: string;
  label: string;
}

const LineupBuilder: React.FC<Props> = ({ students, onClose, onPostToMedia }) => {
  const [sport, setSport] = useState<SportType>('Futbol');
  const [mode, setMode] = useState<GameMode>('8v8');
  const [lineup, setLineup] = useState<Record<string, Student | null>>({});
  const [subs, setSubs] = useState<Student[]>([]);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [selectingFor, setSelectingFor] = useState<'as' | 'sub'>('as');

  // Branş ve Moda Göre Slot Pozisyonları
  const positions = useMemo(() => {
    const config: Record<GameMode, Position[]> = {
      // FUTBOL: Tüm saha (Hücum yönü yukarı)
      '5v5': [
        { id: 'GK', top: '85%', left: '50%', label: 'KL' },
        { id: 'DEF', top: '65%', left: '50%', label: 'DF' },
        { id: 'MID1', top: '45%', left: '25%', label: 'OS' },
        { id: 'MID2', top: '45%', left: '75%', label: 'OS' },
        { id: 'FWD', top: '25%', left: '50%', label: 'FV' },
      ],
      '8v8': [
        { id: 'GK', top: '88%', left: '50%', label: 'KL' },
        { id: 'LB', top: '70%', left: '20%', label: 'SB' },
        { id: 'CB', top: '75%', left: '50%', label: 'ST' },
        { id: 'RB', top: '70%', left: '80%', label: 'SB' },
        { id: 'LM', top: '45%', left: '25%', label: 'SL' },
        { id: 'RM', top: '45%', left: '75%', label: 'SR' },
        { id: 'ST1', top: '25%', left: '35%', label: 'FV' },
        { id: 'ST2', top: '25%', left: '65%', label: 'FV' },
      ],
      '11v11': [
        { id: 'GK', top: '90%', left: '50%', label: 'KL' },
        { id: 'LB', top: '75%', left: '15%', label: 'SLB' },
        { id: 'CB1', top: '80%', left: '40%', label: 'STP' },
        { id: 'CB2', top: '80%', left: '60%', label: 'STP' },
        { id: 'RB', top: '75%', left: '85%', label: 'SĞB' },
        { id: 'CDM', top: '60%', left: '50%', label: 'DOS' },
        { id: 'CM1', top: '45%', left: '30%', label: 'OS' },
        { id: 'CM2', top: '45%', left: '70%', label: 'OS' },
        { id: 'LW', top: '25%', left: '20%', label: 'SĞK' },
        { id: 'RW', top: '25%', left: '80%', label: 'SLK' },
        { id: 'ST', top: '15%', left: '50%', label: 'SNT' },
      ],
      // VOLEYBOL: Sadece alt yarı (Kendi sahamız)
      '4v4': [
        { id: 'V1', top: '85%', left: '30%', label: 'P' },
        { id: 'V2', top: '85%', left: '70%', label: 'S' },
        { id: 'V3', top: '60%', left: '30%', label: 'O' },
        { id: 'V4', top: '60%', left: '70%', label: 'P' },
      ],
      '6v6': [
        { id: 'V1', top: '85%', left: '20%', label: '1' },
        { id: 'V2', top: '85%', left: '50%', label: '6' },
        { id: 'V3', top: '85%', left: '80%', label: '5' },
        { id: 'V4', top: '60%', left: '20%', label: '2' },
        { id: 'V5', top: '60%', left: '50%', label: '3' },
        { id: 'V6', top: '60%', left: '80%', label: '4' },
      ]
    };
    return config[mode];
  }, [mode]);

  const subLimit = useMemo(() => {
    const limits: Record<GameMode, number> = { '5v5': 3, '8v8': 5, '11v11': 7, '4v4': 9, '6v6': 8 };
    return limits[mode];
  }, [mode]);

  const selectPlayer = (student: Student) => {
    const inLineup = (Object.values(lineup) as (Student | null)[]).some(s => s?.id === student.id);
    const inSubs = subs.some(s => s.id === student.id);
    if (inLineup || inSubs) return;

    if (selectingFor === 'as' && activeSlot) {
      setLineup(prev => ({ ...prev, [activeSlot]: student }));
      setActiveSlot(null);
    } else if (selectingFor === 'sub') {
      if (subs.length < subLimit) {
        setSubs(prev => [...prev, student]);
      }
    }
  };

  const removeFromLineup = (slotId: string) => {
    setLineup(prev => ({ ...prev, [slotId]: null }));
  };

  const removeSub = (id: string) => {
    setSubs(prev => prev.filter(s => s.id !== id));
  };

  const handlePostToMedia = () => {
    const playersCount = Object.values(lineup).filter(Boolean).length;
    if (playersCount === 0) return;

    if (onPostToMedia) {
      const title = `🚨 MAÇ KADROSU: ${sport.toUpperCase()} | ${mode}`;
      
      const lineupData = {
        sport,
        mode,
        players: Object.entries(lineup)
          .filter(([_, s]) => s !== null)
          .map(([id, s]) => {
            const player = s as Student;
            return { 
              pos: id, 
              name: player.name, 
              photo: player.photoUrl,
              number: player.jerseyNumber 
            };
          }),
        subs: subs.map(s => ({ 
          name: s.name, 
          photo: s.photoUrl,
          number: s.jerseyNumber 
        }))
      };

      const content = `🔥 BATMAN GENÇLERBİRLİĞİ SAHAYA ÇIKIYOR!\n\n` +
        `🏆 Branş: ${sport}\n` +
        `📊 Formasyon: ${mode}\n\n` +
        `Kadro görseli ve esame listesi haber bültenine eklenmiştir. #BGB #BatmanAkademi`;

      onPostToMedia({ 
        title, 
        content, 
        type: 'lineup', 
        lineupData,
        date: new Date().toLocaleDateString('tr-TR'), 
        status: 'published' 
      });
      alert('Kadro görsel bülten olarak yayınlandı!');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[6000] bg-zinc-950 flex flex-col lg:flex-row overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
      {/* SAHA GÖRSELİ */}
      <div className="flex-[2] bg-zinc-900 relative flex items-center justify-center p-4 overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        {/* SAHA ANA GÖVDE */}
        <div className={`w-full max-w-md aspect-[3/4.5] relative rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] border-[12px] border-zinc-800 overflow-hidden transition-all duration-700 ${
          sport === 'Futbol' 
            ? 'bg-emerald-800' 
            : 'bg-[#d2a679] bg-[url("https://www.transparenttextures.com/patterns/wood-pattern.png")]'
        }`}>
           
           {/* FUTBOL ÇİZGİLERİ */}
           {sport === 'Futbol' && (
             <div className="absolute inset-0 opacity-40">
               <div className="absolute inset-4 border-2 border-white rounded-lg"></div>
               <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white"></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white rounded-full"></div>
               <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-16 border-2 border-white border-t-0"></div>
               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-16 border-2 border-white border-b-0"></div>
             </div>
           )}

           {/* VOLEYBOL ÇİZGİLERİ (Parke Görünüm) */}
           {sport === 'Voleybol' && (
             <div className="absolute inset-0">
                <div className="absolute inset-4 border-2 border-white/80"></div>
                {/* Turuncu Hücum Bölgesi */}
                <div className="absolute top-[35%] bottom-[35%] left-4 right-4 bg-orange-500/30 border-y-2 border-white"></div>
                {/* Merkez File Çizgisi */}
                <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-white/90 z-10 shadow-lg"></div>
                {/* Sahanın Üst Yarısı (Rakip - Karartılmış) */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
                   <p className="text-white/20 font-black text-2xl uppercase italic tracking-[0.5em] -rotate-12">RAKİP SAHA</p>
                </div>
             </div>
           )}

           {/* OYUNCU SLOTLARI */}
           {positions.map((pos) => {
             const player = lineup[pos.id];
             return (
               <div 
                key={pos.id} 
                style={{ top: pos.top, left: pos.left }}
                onClick={() => { setActiveSlot(pos.id); setSelectingFor('as'); }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group z-20"
               >
                 <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-3xl border-4 flex items-center justify-center font-black text-xs transition-all duration-300 ${
                   player ? 'bg-white border-red-600 shadow-[0_10px_30px_rgba(227,6,19,0.3)] scale-110' : 'bg-black/30 border-white/30 text-white/40 hover:border-white/80'
                 }`}>
                    {player ? (
                      <div className="relative w-full h-full overflow-hidden rounded-2xl">
                        {player.photoUrl ? <img src={player.photoUrl} className="w-full h-full object-cover" /> : player.name[0]}
                        {player.jerseyNumber && <div className="absolute bottom-0 right-0 bg-zinc-950 text-white text-[7px] px-1 rounded-tl-md">#{player.jerseyNumber}</div>}
                        <button onClick={(e) => { e.stopPropagation(); removeFromLineup(pos.id); }} className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                      </div>
                    ) : pos.label}
                 </div>
                 {player && (
                   <div className="mt-2 bg-zinc-950 text-white text-[8px] font-black px-3 py-1.5 rounded-xl uppercase whitespace-nowrap border border-white/10 shadow-xl animate-in fade-in slide-in-from-top-1">
                     {player.name}
                   </div>
                 )}
               </div>
             );
           })}

           {/* LOGO FİLİGRANI - DAHA BELİRGİN */}
           <div className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.12] pointer-events-none scale-110">
             <Logo className="w-72 h-72 grayscale invert" />
           </div>
        </div>

        {/* YEDEK KULÜBESİ (Saha Dışı) */}
        <div className="absolute bottom-6 left-0 right-0 px-8">
           <div className="max-w-md mx-auto">
             <div className="flex items-center gap-3 mb-4">
                <div className="h-px bg-white/10 flex-1"></div>
                <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] italic">YEDEK KULÜBESİ</p>
                <div className="h-px bg-white/10 flex-1"></div>
             </div>
             <div className="flex flex-wrap justify-center gap-4">
                {subs.map(s => (
                  <div key={s.id} className="flex flex-col items-center animate-in zoom-in group">
                    <div className="w-10 h-10 bg-zinc-800 rounded-2xl border-2 border-blue-600 overflow-hidden relative shadow-lg">
                      {s.photoUrl ? <img src={s.photoUrl} className="w-full h-full object-cover" /> : s.name[0]}
                      {s.jerseyNumber && <div className="absolute bottom-0 right-0 bg-zinc-950 text-white text-[6px] px-0.5 rounded-tl-sm">#{s.jerseyNumber}</div>}
                      <button onClick={() => removeSub(s.id)} className="absolute inset-0 bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                    </div>
                    <span className="text-[7px] font-black text-white/50 mt-2 uppercase truncate max-w-[55px] tracking-wider">{s.name}</span>
                  </div>
                ))}
                {subs.length < subLimit && (
                  <button 
                    onClick={() => { setSelectingFor('sub'); setActiveSlot(null); }}
                    className="w-10 h-10 border-2 border-dashed border-white/20 rounded-2xl flex items-center justify-center text-white/20 hover:border-white/50 hover:bg-white/5 transition-all active:scale-90"
                  >
                    <UserPlus size={16} />
                  </button>
                )}
             </div>
           </div>
        </div>
      </div>

      {/* KONTROL PANELİ */}
      <div className="flex-1 bg-white flex flex-col h-full shadow-2xl relative z-20">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
           <div>
             <h4 className="font-black text-2xl text-zinc-900 italic uppercase tracking-tighter leading-none">STRATEJİ <span className="text-red-600">TAHTASI</span></h4>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 italic">Kadro ve Taktik Kurulumu</p>
           </div>
           <button onClick={onClose} className="p-3 bg-gray-100 rounded-2xl hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-sm">
             <X size={24} />
           </button>
        </div>

        {/* BRANŞ VE MOD SEÇİMİ */}
        <div className="p-6 bg-gray-50/50 border-b border-gray-100 space-y-4">
          <div className="flex gap-2 p-1.5 bg-white rounded-2xl border border-gray-100">
             <button onClick={() => { setSport('Futbol'); setMode('8v8'); setLineup({}); setSubs([]); }} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase transition-all ${sport === 'Futbol' ? 'bg-zinc-950 text-white shadow-xl' : 'text-gray-400'}`}>⚽ FUTBOL</button>
             <button onClick={() => { setSport('Voleybol'); setMode('6v6'); setLineup({}); setSubs([]); }} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase transition-all ${sport === 'Voleybol' ? 'bg-zinc-950 text-white shadow-xl' : 'text-gray-400'}`}>🏐 VOLEYBOL</button>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {(sport === 'Futbol' ? ['5v5', '8v8', '11v11'] : ['4v4', '6v6']).map(m => (
              <button key={m} onClick={() => { setMode(m as any); setLineup({}); setSubs([]); }} className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase whitespace-nowrap transition-all ${mode === m ? 'bg-red-600 text-white shadow-lg' : 'bg-white text-zinc-400 border border-gray-100'}`}>{m}</button>
            ))}
          </div>

          <div className="flex items-center gap-3 p-4 bg-zinc-900 text-white rounded-2xl shadow-xl animate-in zoom-in-95">
            <div className={`p-2 rounded-xl ${selectingFor === 'as' ? 'bg-red-600' : 'bg-blue-600'}`}>
               <MapIcon size={18} />
            </div>
            <div className="flex-1">
               <p className="text-[9px] font-black uppercase leading-none tracking-widest">{selectingFor === 'as' ? 'AS KADRO SEÇİMİ' : 'YEDEK SEÇİMİ'}</p>
               <p className="text-[8px] font-bold opacity-50 uppercase mt-1">
                 {selectingFor === 'as' ? (activeSlot ? `${activeSlot} pozisyonu için oyuncu atayın` : 'Sahadan bir pozisyon seçin') : `Yedek oyuncu seçin (${subs.length}/${subLimit})`}
               </p>
            </div>
            {selectingFor === 'sub' && <button onClick={() => setSelectingFor('as')} className="bg-white/10 text-white px-3 py-1.5 rounded-lg text-[8px] font-black uppercase hover:bg-white/20 transition-all">AS KADRO</button>}
          </div>
        </div>

        {/* SPORCU LİSTESİ */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2 no-scrollbar bg-white">
           {students.filter(s => s.sport === sport).map(s => {
             const isSelected = (Object.values(lineup) as (Student | null)[]).some(p => p?.id === s.id) || subs.some(sub => sub.id === s.id);
             return (
               <button 
                key={s.id} 
                onClick={() => selectPlayer(s)}
                disabled={isSelected}
                className={`w-full flex items-center justify-between p-4 rounded-3xl border-2 transition-all ${
                  isSelected ? 'opacity-40 grayscale border-gray-100 bg-gray-50' : 'border-gray-50 bg-white hover:border-zinc-900 active:scale-95'
                }`}
               >
                 <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 bg-zinc-950 rounded-2xl flex items-center justify-center text-white text-[11px] font-black italic overflow-hidden shadow-lg">
                      {s.photoUrl ? <img src={s.photoUrl} className="w-full h-full object-cover" /> : s.name[0]}
                    </div>
                    <div>
                       <p className="text-[11px] font-black text-zinc-900 uppercase leading-none">{s.name}</p>
                       <p className="text-[8px] font-bold text-gray-400 uppercase mt-1 tracking-widest">#{s.jerseyNumber || '?'} - {s.branchId}</p>
                    </div>
                 </div>
                 {!isSelected && <div className="p-2 bg-gray-50 rounded-xl text-zinc-300 group-hover:text-zinc-900"><UserPlus size={18} /></div>}
               </button>
             );
           })}
        </div>

        {/* AKSIYONLAR */}
        <div className="p-8 bg-white border-t border-gray-100">
           <button onClick={handlePostToMedia} className="w-full py-5 bg-zinc-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:bg-red-600 transition-all active:scale-95 group">
             <Database size={20} className="group-hover:rotate-12 transition-transform" /> GÖRSEL BÜLTEN OLARAK YAYINLA
           </button>
        </div>
      </div>
    </div>
  );
};

export default LineupBuilder;
