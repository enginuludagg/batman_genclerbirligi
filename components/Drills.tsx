
import React, { useState } from 'react';
import { 
  Zap, Clock, Dumbbell, BrainCircuit, 
  ChevronRight, Sparkles, Filter, Star,
  Info, Loader2, PlayCircle
} from 'lucide-react';
import { Drill } from '../types';
import { getDrillAITips } from '../services/geminiService';

const DRILLS_DATA: Drill[] = [
  { id: 'd1', title: 'Zikzak Dribbling', category: 'Teknik', difficulty: 2, duration: '15 Dakika', equipment: ['Huniler', 'Top'], description: 'Huni aralarından seri top sürme ve yön değiştirme çalışması.' },
  { id: 'd2', title: '1-2 Pas & Duvar Pası', category: 'Taktik', difficulty: 3, duration: '20 Dakika', equipment: ['Top', 'Partner'], description: 'Dar alanda hızlı tek pas ve boşa kaçma drill\'i.' },
  { id: 'd3', title: 'Patlayıcı Kuvvet Sprint', category: 'Kondisyon', difficulty: 4, duration: '10 Dakika', equipment: ['Engeller'], description: 'Engeller üzerinden atlayıp 10 metre tam saha depar.' },
  { id: 'd4', title: 'İstasyon Şut Çalışması', category: 'Teknik', difficulty: 3, duration: '25 Dakika', equipment: ['Kaleler', 'Toplar'], description: 'Farklı açılardan gelen toplara tek vuruş ve bitiricilik.' },
  { id: 'd5', title: 'Gölge Markajı', category: 'Taktik', difficulty: 2, duration: '15 Dakika', equipment: ['Yelekler'], description: 'Defansif pozisyon alma ve rakibi karşılama egzersizi.' }
];

const Drills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'Tümü' | 'Teknik' | 'Kondisyon' | 'Taktik'>('Tümü');
  const [loadingTips, setLoadingTips] = useState<string | null>(null);
  const [aiTip, setAiTip] = useState<{ id: string, text: string } | null>(null);

  const filtered = DRILLS_DATA.filter(d => activeCategory === 'Tümü' || d.category === activeCategory);

  const fetchTips = async (drill: Drill) => {
    setLoadingTips(drill.id);
    const tip = await getDrillAITips(drill);
    setAiTip({ id: drill.id, text: tip });
    setLoadingTips(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">ANTRENMAN <span className="text-red-600">DRİLLERİ</span></h2>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest pl-1 mt-1">Saha İçi Uygulamalı Çalışmalar</p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto no-scrollbar gap-1">
          {['Tümü', 'Teknik', 'Kondisyon', 'Taktik'].map((cat) => (
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
        {filtered.map(drill => (
          <div key={drill.id} className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-gray-50 flex flex-col group hover:border-red-600 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                {drill.category === 'Teknik' ? <Zap size={20} /> : drill.category === 'Kondisyon' ? <Dumbbell size={20} /> : <BrainCircuit size={20} />}
              </div>
              <div className="flex gap-0.5">
                 {Array.from({length: 5}).map((_, i) => (
                   <Star key={i} size={10} fill={i < drill.difficulty ? 'currentColor' : 'none'} className={i < drill.difficulty ? 'text-yellow-500' : 'text-gray-200'} />
                 ))}
              </div>
            </div>

            <h3 className="text-lg font-black text-zinc-900 uppercase italic tracking-tighter mb-2 leading-tight">{drill.title}</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4 italic">{drill.description}</p>

            <div className="space-y-3 mb-6">
               <div className="flex items-center gap-2 text-zinc-500">
                  <Clock size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{drill.duration}</span>
               </div>
               <div className="flex flex-wrap gap-1.5">
                  {drill.equipment.map(e => (
                    <span key={e} className="bg-zinc-100 text-zinc-500 px-2.5 py-1 rounded-lg text-[8px] font-black uppercase">{e}</span>
                  ))}
               </div>
            </div>

            {/* AI Tip Section */}
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

      <div className="px-2 mt-10">
         <div className="bg-red-600 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-black/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="relative z-10">
               <h4 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter leading-none mb-4">DRİLL <span className="text-zinc-900">OLUŞTURUCU</span></h4>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 max-w-sm">
                 Kendi antrenman metodunuzu AI desteğiyle oluşturun ve akademi kütüphanesine ekleyin.
               </p>
            </div>
            <button className="bg-white text-zinc-900 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center gap-3">
               <PlayCircle size={20} /> YENİ DRİLL YAZ
            </button>
         </div>
      </div>
    </div>
  );
};

export default Drills;
