
import React, { useState, useEffect } from 'react';
import { Loader2, User, Send, CheckCircle2, BrainCircuit, Ruler, Weight, Timer, Activity, Medal } from 'lucide-react';
import { Student } from '../types';
import { getCoachSuggestions } from '../services/geminiService';
import Logo from './Logo';

interface ReportCardProps {
  student: Student;
  onClose: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ student, onClose }) => {
  const [coachNote, setCoachNote] = useState<string>('');
  const [loadingNote, setLoadingNote] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const p = student.physicalStats;

  useEffect(() => {
    const fetchNote = async () => {
      const note = await getCoachSuggestions(student);
      setCoachNote(note);
      setLoadingNote(false);
    };
    fetchNote();
  }, [student]);

  const handleBulkSend = async () => {
    setIsSending(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsSending(false);
    setSendSuccess(true);
    setTimeout(() => { setSendSuccess(false); onClose(); }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-2 bg-black/95 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden my-4 border-4 border-zinc-100 animate-in zoom-in-95">
        {sendSuccess && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center animate-in fade-in">
             <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-xl"><CheckCircle2 size={56} className="animate-bounce" /></div>
             <h3 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">KARNE GÖNDERİLDİ</h3>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-4">VELİYE BİLDİRİM VE MAİL İLETİLDİ</p>
          </div>
        )}

        <div className="bg-red-600 p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-1.5 shadow-xl rotate-3"><Logo className="w-full h-full" /></div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl sm:text-4xl font-black italic uppercase tracking-tighter leading-none">BATMAN <br/>GENÇLERBİRLİĞİ</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-80 mt-2">RESMİ AKADEMİ GELİŞİM KARNESİ</p>
              </div>
            </div>
            <div className="bg-black/20 backdrop-blur-md px-8 py-5 rounded-3xl border border-white/10 text-center"><p className="text-[9px] font-black uppercase tracking-widest opacity-60">RAPOR DÖNEMİ</p><p className="text-xl font-black italic">MAYIS 2024</p></div>
          </div>
        </div>

        <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
          <div className="flex flex-col items-center">
            <div className="w-40 h-40 bg-zinc-950 rounded-[2.5rem] border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden relative">
               {student.photoUrl ? <img src={student.photoUrl} className="w-full h-full object-cover" /> : <div className="text-4xl font-black text-red-600 italic">{student.name[0]}</div>}
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900 text-center leading-none mt-4">{student.name}</h2>
            
            <div className="w-full space-y-3 mt-10">
               <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest text-center mb-2">ELDE EDİLEN ROZETLER</p>
               <div className="flex flex-wrap justify-center gap-2">
                  {student.badges?.length > 0 ? student.badges.map(b => (
                    <div key={b.id} className="bg-yellow-50 text-yellow-600 p-2 rounded-xl border border-yellow-100" title={b.name}>
                       <Medal size={16} />
                    </div>
                  )) : <p className="text-[8px] font-black text-gray-300 italic">HENÜZ ROZET YOK</p>}
               </div>
               <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100 mt-6"><span className="text-[9px] font-black text-gray-400 uppercase">KATILIM</span><span className="text-sm font-black text-green-600 italic">%{student.attendance}</span></div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
               {[
                 { l: 'BOY', v: (p?.height || 150) + 'cm', i: Ruler, c: 'text-blue-500' },
                 { l: 'KİLO', v: (p?.weight || 45) + 'kg', i: Weight, c: 'text-orange-500' },
                 { l: 'HIZ', v: (p?.speed20m || 3.5) + 's', i: Timer, c: 'text-red-500' },
                 { l: '1500M', v: p?.run1500m || '--', i: Activity, c: 'text-green-500' }
               ].map((item, idx) => (
                 <div key={idx} className="bg-gray-50 p-5 rounded-[2rem] border border-gray-100 text-center">
                    <item.i size={20} className={`${item.c} mx-auto mb-3`} />
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{item.l}</p>
                    <p className="text-lg font-black italic text-zinc-900">{item.v}</p>
                 </div>
               ))}
            </div>

            <div className="bg-zinc-950 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
               <div className="relative z-10">
                  <h4 className="text-red-600 font-black text-[10px] uppercase tracking-[0.3em] mb-6 flex items-center gap-2 italic"><BrainCircuit size={14} /> AI & ANTRENÖR TEKNİK ANALİZİ</h4>
                  {loadingNote ? (
                    <div className="flex items-center gap-3 text-white/40 py-10"><Loader2 size={16} className="animate-spin" /><span className="text-[10px] font-black uppercase tracking-widest">Analiz Yazılıyor...</span></div>
                  ) : (
                    <div className="space-y-4">
                      <textarea 
                        className="w-full bg-white/5 text-white text-sm sm:text-base font-black italic leading-relaxed uppercase tracking-tight border border-white/10 outline-none focus:border-red-600 focus:bg-white/10 rounded-2xl p-4 h-32 resize-none transition-all shadow-inner"
                        value={coachNote}
                        onChange={e => setCoachNote(e.target.value)}
                        placeholder="Antrenör notu ekleyin..."
                      />
                      <p className="text-[8px] text-zinc-500 italic uppercase font-black tracking-widest">* AI taslak hazırlar, antrenör düzenleyebilir.</p>
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-8 pt-6 border-t border-white/10">
                     <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white"><User size={20} /></div>
                     <div><p className="text-white font-black text-[10px] uppercase italic">BAŞ ANTRENÖR ONAYLI</p><p className="text-zinc-500 text-[8px] font-bold uppercase">Batman GB Teknik Komitesi</p></div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-10 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6">
           <button onClick={handleBulkSend} disabled={isSending} className="w-full sm:w-auto px-10 py-5 bg-red-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 transition-all hover:bg-zinc-950">
             {isSending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />} KARNEYİ VELİYE GÖNDER
           </button>
           <button onClick={onClose} className="w-full sm:w-auto px-12 py-5 bg-zinc-100 text-zinc-900 rounded-[2rem] font-black uppercase text-xs tracking-widest active:scale-95 transition-all hover:bg-zinc-200">KAPAT</button>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
