
import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, Clock, Dumbbell, BrainCircuit, 
  Sparkles, Star, Loader2, PlayCircle, Plus, Trash2, X,
  RefreshCw, Save, Gamepad2
} from 'lucide-react';
import { Drill, AppMode } from '../types';
import { getDrillAITips, generateNewDrillFromAI } from '../services/geminiService';

interface Props {
  drills: Drill[];
  setDrills: React.Dispatch<React.SetStateAction<Drill[]>>;
  mode?: AppMode;
}

const Drills: React.FC<Props> = ({ drills, setDrills, mode }) => {
  const [activeCategory, setActiveCategory] = useState<'Tümü' | 'Teknik' | 'Kondisyon' | 'Taktik' | 'Eğlenceli Oyun'>('Tümü');
  const [loadingTips, setLoadingTips] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiTip, setAiTip] = useState<{ id: string, text: string } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);
  
  const [newDrill, setNewDrill] = useState<Partial<Drill>>({
    title: '', category: 'Teknik', difficulty: 3, duration: '20 Dakika', equipment: [], description: '', ageGroup: 'U12'
  });

  useEffect(() => {
    if (isAddModalOpen && firstInputRef.current) setTimeout(() => firstInputRef.current?.focus(), 100);
  }, [isAddModalOpen]);

  const handleAIDrillGeneration = async (sport: string = 'Futbol') => {
    setIsGenerating(true);
    try {
      const drill = await generateNewDrillFromAI(sport);
      if (drill) setDrills(prev => [drill, ...prev]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const filtered = Array.isArray(drills) ? drills.filter(d => activeCategory === 'Tümü' || d.category === activeCategory) : [];

  const fetchTips = async (e: React.MouseEvent, drill: Drill) => {
    e.stopPropagation();
    e.preventDefault();
    if (aiTip?.id === drill.id) { setAiTip(null); return; }
    setLoadingTips(drill.id);
    try {
        const tip = await getDrillAITips(drill);
        setAiTip({ id: drill.id, text: tip });
    } finally {
        setLoadingTips(null);
    }
  };

  const handleAddDrill = () => {
    if (!newDrill.title) return;
    const drill: Drill = {
      ...newDrill as Drill,
      id: Date.now().toString(),
      equipment: Array.isArray(newDrill.equipment) ? newDrill.equipment : []
    };
    setDrills(prev => [...prev, drill]);
    setIsAddModalOpen(false);
    setNewDrill({ title: '', category: 'Teknik', difficulty: 3, duration: '20 Dakika', equipment: [], description: '', ageGroup: 'U12' });
  };

  const deleteDrill = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm('Bu drilli silmek istiyor musunuz?')) {
      setDrills(prev => prev.filter(d => d.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">ANTRENMAN <span className="text-red-600">DRİLLERİ</span></h2>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest pl-1 mt-1">Haftalık Dinamik Saha Uygulamaları</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {mode === 'admin' && (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-zinc-950 text-white px-8 py-3.5 rounded-2xl flex items-center gap-2 font-black text-[10px] uppercase shadow-xl hover:bg-red-600 transition-all active:scale-95"
            >
              <Plus size={16} /> MANUEL EKLE
            </button>
          )}
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto no-scrollbar gap-1">
            {['Tümü', 'Teknik', 'Kondisyon', 'Taktik', 'Eğlenceli Oyun'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-zinc-900 text-white shadow-lg' : 'text-gray-400 hover:text-zinc-600'}`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
        {isGenerating && (
          <div className="bg-zinc-900 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center space-y-4 border-2 border-red-600 animate-pulse min-h-[300px]">
             <RefreshCw size={48} className="text-red-600 animate-spin" />
             <h4 className="text-white font-black italic uppercase tracking-tighter">AI ANTRENMANI <br/><span className="text-red-600">HAZIRLIYOR...</span></h4>
          </div>
        )}

        {filtered.map(drill => (
          <div key={drill.id} className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-gray-100 flex flex-col relative pb-24 group hover:border-red-600 transition-all">
            
            {mode === 'admin' && (
              <div className="absolute top-4 right-4 z-[60]">
                <button 
                  onClick={(e) => deleteDrill(e, drill.id)}
                  className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-md cursor-pointer active:scale-90"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
            
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                {drill.category === 'Teknik' ? <Zap size={20} /> : drill.category === 'Kondisyon' ? <Dumbbell size={20} /> : drill.category === 'Eğlenceli Oyun' ? <Gamepad2 size={20} /> : <BrainCircuit size={20} />}
              </div>
              <div className="flex flex-col items-end gap-1 mr-12">
                 <div className="flex gap-0.5">
                   {Array.from({length: 5}).map((_, i) => (
                     <Star key={i} size={10} fill={i < (drill.difficulty || 3) ? 'currentColor' : 'none'} className={i < (drill.difficulty || 3) ? 'text-yellow-500' : 'text-gray-200'} />
                   ))}
                 </div>
                 <span className="text-[8px] font-black bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-md uppercase tracking-wide">{drill.ageGroup || 'U12'}</span>
              </div>
            </div>

            <h3 className="text-lg font-black text-zinc-900 uppercase italic tracking-tighter mb-2 leading-tight pr-8">{drill.title}</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4 italic line-clamp-3 leading-relaxed">{drill.description}</p>

            <div className="space-y-3 mb-2">
               <div className="flex items-center gap-2 text-zinc-500">
                  <Clock size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{drill.duration}</span>
               </div>
               <div className="flex flex-wrap gap-1.5">
                  <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-lg text-[8px] font-black uppercase">{drill.category}</span>
               </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 z-[50]">
              {aiTip?.id === drill.id ? (
                <div onClick={(e) => { e.stopPropagation(); setAiTip(null); }} className="bg-zinc-950 p-4 rounded-2xl relative cursor-pointer shadow-xl animate-in slide-in-from-bottom-2">
                   <p className="text-[10px] font-black text-red-600 uppercase italic tracking-widest mb-2 flex items-center gap-1.5"><Sparkles size={12} /> BGB İPUCU</p>
                   <p className="text-white text-[9px] font-black leading-relaxed italic uppercase opacity-90">"{aiTip.text}"</p>
                </div>
              ) : (
                <button 
                  onClick={(e) => fetchTips(e, drill)}
                  disabled={loadingTips === drill.id}
                  className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all hover:bg-red-600"
                >
                  {loadingTips === drill.id ? <Loader2 size={16} className="animate-spin" /> : <><Sparkles size={14} /> AI TAKTİK AL</>}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto">
           <div className="bg-white w-full max-w-lg rounded-[3rem] p-8 sm:p-10 shadow-2xl relative animate-in zoom-in-95 my-auto">
              <button onClick={() => setIsAddModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black"><X size={28} /></button>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8 text-center">YENİ <span className="text-red-600">DRİLL</span></h3>
              
              <div className="space-y-5">
                 <div>
                   <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">DRİLL ADI</label>
                   <input ref={firstInputRef} type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-red-600" value={newDrill.title} onChange={e => setNewDrill({...newDrill, title: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">KATEGORİ</label>
                      <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase outline-none" value={newDrill.category} onChange={e => setNewDrill({...newDrill, category: e.target.value as any})}>
                        <option value="Teknik">TEKNİK</option>
                        <option value="Kondisyon">KONDİSYON</option>
                        <option value="Taktik">TAKTİK</option>
                        <option value="Eğlenceli Oyun">EĞLENCELİ OYUN</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">YAŞ GRUBU</label>
                      <input type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none" value={newDrill.ageGroup} onChange={e => setNewDrill({...newDrill, ageGroup: e.target.value})} />
                    </div>
                 </div>
                 <div>
                   <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">AÇIKLAMA</label>
                   <textarea className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none h-24 resize-none" value={newDrill.description} onChange={e => setNewDrill({...newDrill, description: e.target.value})} />
                 </div>
                 <button onClick={handleAddDrill} className="w-full py-5 bg-zinc-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-red-600 transition-all active:scale-95 mt-4">
                   <Save size={18} className="inline mr-2" /> KAYDET
                 </button>
              </div>
           </div>
        </div>
      )}

      <div className="px-2 mt-10">
         <div className="bg-red-600 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
               <h4 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter leading-none mb-4">DRİLL <span className="text-zinc-900">ÜRETİCİ</span></h4>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 max-w-sm">Otomatik Drill Önerisi Al</p>
            </div>
            <div className="flex gap-4 relative z-10">
               <button onClick={() => handleAIDrillGeneration('Futbol')} disabled={isGenerating} className="bg-white text-zinc-900 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center gap-2 hover:bg-zinc-100"><PlayCircle size={18} /> FUTBOL</button>
               <button onClick={() => handleAIDrillGeneration('Voleybol')} disabled={isGenerating} className="bg-zinc-900 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center gap-2 hover:bg-black"><Sparkles size={18} className="text-orange-500" /> VOLEYBOL</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Drills;
