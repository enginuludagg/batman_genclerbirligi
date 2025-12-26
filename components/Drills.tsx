
import React, { useState, useEffect } from 'react';
import { 
  Zap, Clock, Dumbbell, BrainCircuit, 
  ChevronRight, Sparkles, Filter, Star,
  Info, Loader2, PlayCircle, Plus, Trash2, X,
  CalendarCheck, RefreshCw
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
  
  const [newDrill, setNewDrill] = useState<Partial<Drill>>({
    title: '', category: 'Teknik', difficulty: 3, duration: '20 Dakika', equipment: [], description: ''
  });

  // Haftalık Otomatik Güncelleme Kontrolü
  useEffect(() => {
    const lastUpdate = localStorage.getItem('bgb_drills_last_update');
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;

    if (!lastUpdate || (now - parseInt(lastUpdate)) > oneWeek) {
      console.log("Yeni haftalık driller isteniyor...");
      // İsteğe bağlı olarak burada otomatik tetikleme yapılabilir 
      // veya kullanıcıya bir bildirim gösterilebilir.
    }
  }, []);

  const handleAIDrillGeneration = async (sport: string = 'Futbol') => {
    setIsGenerating(true);
    try {
      const drill = await generateNewDrillFromAI(sport);
      setDrills(prev => [drill, ...prev]);
      localStorage.setItem('bgb_drills_last_update', Date.now().toString());
    } catch (error) {
      alert("Hocam AI şu an taktik tahtasında meşgul, lütfen tekrar deneyin.");
    } finally {
      setIsGenerating(false);
    }
  };

  const filtered = drills.filter(d => activeCategory === 'Tümü' || d.category === activeCategory);

  const fetchTips = async (drill: Drill) => {
    setLoadingTips(drill.id);
    const tip = await getDrillAITips(drill);
    setAiTip({ id: drill.id, text: tip });
    setLoadingTips(null);
  };

  const handleAddDrill = () => {
    if (!newDrill.title) return;
    const drill: Drill = {
      ...newDrill as Drill,
      id: Date.now().toString()
    };
    setDrills(prev => [...prev, drill]);
    setIsAddModalOpen(false);
    setNewDrill({ title: '', category: 'Teknik', difficulty: 3, duration: '20 Dakika', equipment: [], description: '' });
  };

  const deleteDrill = (id: string) => {
    if (confirm('Bu drilli kütüphaneden silmek istediğinize emin misiniz?')) {
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
              className="bg-white border-2 border-zinc-900 text-zinc-900 px-5 py-2.5 rounded-xl flex items-center gap-2 font-black text-[10px] uppercase shadow-sm hover:bg-zinc-900 hover:text-white transition-all"
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
             <h4 className="text-white font-black italic uppercase tracking-tighter">AI ANTRENMANI <br/><span className="text-red-600">PLANLIYOR...</span></h4>
             <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Batman GB Verileri Analiz Ediliyor</p>
          </div>
        )}

        {filtered.map(drill => (
          <div key={drill.id} className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-gray-100 flex flex-col group hover:border-red-600 transition-all relative">
            {mode === 'admin' && (
              <button 
                onClick={() => deleteDrill(drill.id)}
                className="absolute top-4 right-4 p-2 bg-red-50 text-red-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
            )}
            
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                {drill.category === 'Teknik' ? <Zap size={20} /> : drill.category === 'Kondisyon' ? <Dumbbell size={20} /> : <BrainCircuit size={20} />}
              </div>
              <div className="flex gap-0.5 mr-8">
                 {Array.from({length: 5}).map((_, i) => (
                   <Star key={i} size={10} fill={i < drill.difficulty ? 'currentColor' : 'none'} className={i < drill.difficulty ? 'text-yellow-500' : 'text-gray-200'} />
                 ))}
              </div>
            </div>

            <h3 className="text-lg font-black text-zinc-900 uppercase italic tracking-tighter mb-2 leading-tight">{drill.title}</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4 italic line-clamp-2">{drill.description}</p>

            <div className="space-y-3 mb-6">
               <div className="flex items-center gap-2 text-zinc-500">
                  <Clock size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{drill.duration}</span>
               </div>
               <div className="flex flex-wrap gap-1.5">
                  <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-lg text-[8px] font-black uppercase">{drill.category}</span>
                  {drill.equipment.map(e => (
                    <span key={e} className="bg-zinc-100 text-zinc-500 px-2.5 py-1 rounded-lg text-[8px] font-black uppercase">{e}</span>
                  ))}
               </div>
            </div>

            {aiTip?.id === drill.id ? (
              <div className="mt-auto bg-zinc-950 p-4 rounded-2xl relative overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
                 <div className="absolute top-0 right-0 p-4 opacity-5"><BrainCircuit size={40} className="text-white" /></div>
                 <p className="text-[10px] font-black text-red-600 uppercase italic tracking-widest mb-2 flex items-center gap-1.5">
                   <Sparkles size={12} /> BGB AI İPUCU
                 </p>
                 <p className="text-white text-[9px] font-black leading-relaxed italic uppercase opacity-90">
                   "{aiTip.text}"
                 </p>
              </div>
            ) : (
              <button 
                onClick={() => fetchTips(drill)}
                disabled={loadingTips === drill.id}
                className="mt-auto w-full py-4 bg-zinc-900 text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl active:scale-95 disabled:opacity-50 transition-all hover:bg-red-600"
              >
                {loadingTips === drill.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <><Sparkles size={14} /> AI TAKTİK AL</>
                )}
              </button>
            )}
          </div>
        ))}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative overflow-y-auto max-h-[90vh]">
              <button onClick={() => setIsAddModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black">
                <X size={24} />
              </button>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-6">YENİ <span className="text-red-600">DRİLL</span></h3>
              
              <div className="space-y-4">
                 <div>
                   <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">DRİLL ADI</label>
                   <input 
                    type="text" placeholder="Örn: 1v1 Hücum Varyasyonu" 
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-red-600"
                    value={newDrill.title}
                    onChange={e => setNewDrill({...newDrill, title: e.target.value})}
                   />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">KATEGORİ</label>
                      <select 
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase outline-none"
                        value={newDrill.category}
                        onChange={e => setNewDrill({...newDrill, category: e.target.value as any})}
                      >
                        <option value="Teknik">TEKNİK</option>
                        <option value="Kondisyon">KONDİSYON</option>
                        <option value="Taktik">TAKTİK</option>
                        <option value="Eğlenceli Oyun">EĞLENCELİ OYUN</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">ZORLUK (1-5)</label>
                      <input 
                        type="number" min="1" max="5" 
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none"
                        value={newDrill.difficulty}
                        onChange={e => setNewDrill({...newDrill, difficulty: parseInt(e.target.value) as any})}
                      />
                    </div>
                 </div>

                 <div>
                   <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">AÇIKLAMA</label>
                   <textarea 
                    placeholder="Drill nasıl uygulanır? Detayları buraya yazın..." 
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none h-24 resize-none"
                    value={newDrill.description}
                    onChange={e => setNewDrill({...newDrill, description: e.target.value})}
                   />
                 </div>

                 <button 
                  onClick={handleAddDrill}
                  className="w-full py-5 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-red-600 transition-all active:scale-95"
                 >
                   KÜTÜPHANEYE KAYDET
                 </button>
              </div>
           </div>
        </div>
      )}

      <div className="px-2 mt-10">
         <div className="bg-red-600 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-black/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="relative z-10">
               <h4 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter leading-none mb-4">DRİLL <span className="text-zinc-900">OLUŞTURUCU</span></h4>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 max-w-sm">
                 Kendi antrenman metodunuzu AI desteğiyle oluşturun ve akademi kütüphanesine ekleyin.
               </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full md:w-auto">
               <button 
                onClick={() => handleAIDrillGeneration('Futbol')}
                disabled={isGenerating}
                className="bg-white text-zinc-900 px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 hover:bg-zinc-100"
               >
                  <PlayCircle size={20} /> AI FUTBOL DRİLLİ YAZ
               </button>
               <button 
                onClick={() => handleAIDrillGeneration('Voleybol')}
                disabled={isGenerating}
                className="bg-zinc-900 text-white px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 hover:bg-black"
               >
                  <Sparkles size={20} className="text-orange-500" /> AI VOLEYBOL DRİLLİ YAZ
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Drills;
