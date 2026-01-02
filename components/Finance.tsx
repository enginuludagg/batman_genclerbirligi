
import React, { useState, useRef } from 'react';
import { Wallet, TrendingUp, TrendingDown, Plus, Search, X, Trash2, Save, BellRing, CheckCircle2, Loader2, User, Camera, Image as ImageIcon, Eye, RefreshCw, ShieldCheck } from 'lucide-react';
import { FinanceEntry, AppMode, Student } from '../types';
import { storageService, KEYS } from '../services/storageService';

interface Props {
  finance: FinanceEntry[];
  setFinance: React.Dispatch<React.SetStateAction<FinanceEntry[]>>;
  students: Student[];
  mode?: AppMode;
}

const Finance: React.FC<Props> = ({ finance, setFinance, students, mode }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [highlightKey, setHighlightKey] = useState(0); 
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString('tr-TR'));
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [entryForm, setEntryForm] = useState<Partial<FinanceEntry>>({
    type: 'income', category: 'Aidat', amount: 0, date: new Date().toISOString().split('T')[0],
    description: '', branch: 'Genel', paymentMethod: 'Elden', studentId: '', studentName: '', receiptUrl: ''
  });

  const totalIncome = finance.filter(f => f.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = finance.filter(f => f.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

  const handleForceRefresh = async () => {
    setIsRefreshing(true);
    try {
      const freshData = await storageService.loadFromCloud(KEYS.FINANCE, true);
      setFinance(freshData as FinanceEntry[]);
      setLastUpdate(new Date().toLocaleTimeString('tr-TR'));
      setHighlightKey(prev => prev + 1);
    } catch (err) {
      console.error("Finansal veriler tazelenemedi:", err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  const optimizeImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500;
          let width = img.width;
          let height = img.height;
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.5));
        };
      };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsOptimizing(true);
      try {
        const optimized = await optimizeImage(file);
        setEntryForm(prev => ({ ...prev, receiptUrl: optimized }));
      } finally {
        setIsOptimizing(false);
      }
    }
  };

  const handleSave = () => {
    if (!entryForm.amount || entryForm.amount <= 0) return alert("Tutar girmelisiniz.");
    const newEntry: FinanceEntry = { ...entryForm as FinanceEntry, id: Date.now().toString(), amount: Number(entryForm.amount) };
    setFinance(prev => [newEntry, ...prev]);
    setIsAddOpen(false);
    setEntryForm({ type: 'income', category: 'Aidat', amount: 0, date: new Date().toISOString().split('T')[0], receiptUrl: '' });
  };

  if (mode === 'parent') return <div className="p-12 text-center font-black uppercase text-slate-400">ADMİN YETKİSİ GEREKLİ</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 pb-24 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase italic">MUHASEBE <span className="text-[#E30613]">PANELİ</span></h2>
          <div className="flex items-center gap-3 mt-2">
             <div className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1 rounded-full border border-green-100 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[9px] font-black text-green-700 uppercase tracking-widest">CANLI VERİ SİSTEMİ</span>
             </div>
             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-white px-2 py-1 rounded-full border border-slate-100 shadow-sm">SON SENK: {lastUpdate}</span>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={handleForceRefresh} 
            disabled={isRefreshing}
            className="p-4 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all active:scale-90 shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => setIsAddOpen(true)} className="flex-1 md:flex-none bg-zinc-950 text-white px-8 py-4 rounded-[2rem] font-black text-xs uppercase shadow-xl hover:bg-[#E30613] transition-all flex items-center justify-center gap-3">
            <Plus size={18} /> YENİ İŞLEM
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div key={`inc-${highlightKey}`} className={`bg-white p-6 rounded-[2.5rem] shadow-sm border flex flex-col group hover:border-green-200 transition-all ${highlightKey > 0 ? 'animate-highlight' : ''}`}>
          <p className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-2">TOPLAM GELİR <TrendingUp size={10} className="text-green-500" /></p>
          <span className="text-2xl font-black text-green-600">₺{totalIncome.toLocaleString()}</span>
        </div>
        <div key={`exp-${highlightKey}`} className={`bg-white p-6 rounded-[2.5rem] shadow-sm border flex flex-col group hover:border-red-200 transition-all ${highlightKey > 0 ? 'animate-highlight' : ''}`}>
          <p className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-2">TOPLAM GİDER <TrendingDown size={10} className="text-red-500" /></p>
          <span className="text-2xl font-black text-red-600">₺{totalExpense.toLocaleString()}</span>
        </div>
        <div key={`bal-${highlightKey}`} className={`bg-zinc-900 text-white p-6 rounded-[2.5rem] shadow-xl flex flex-col relative overflow-hidden transition-all ${highlightKey > 0 ? 'scale-[1.02]' : ''}`}>
          <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck size={48} /></div>
          <p className="text-[9px] font-black text-slate-500 uppercase">GÜNCEL KASA DURUMU</p>
          <span className="text-2xl font-black text-white italic">₺{(totalIncome - totalExpense).toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
               <thead className="bg-slate-50 font-black text-slate-400 uppercase tracking-widest">
                  <tr><th className="px-6 py-5">TARİH</th><th className="px-6 py-5">KATEGORİ</th><th className="px-6 py-5 text-right">TUTAR</th><th className="px-4 py-5">BELGE</th><th className="px-6 py-5"></th></tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {finance.map(f => (
                     <tr key={f.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-5 font-medium text-slate-500 uppercase">{f.date}</td>
                        <td className="px-6 py-5 font-black uppercase text-slate-900 italic tracking-tighter">{f.category}</td>
                        <td className={`px-6 py-5 text-right font-black ${f.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>₺{f.amount.toLocaleString()}</td>
                        <td className="px-4 py-5">
                          {f.receiptUrl ? (
                            <button onClick={() => setPreviewImage(f.receiptUrl!)} className="p-2.5 bg-slate-100 rounded-xl text-slate-500 hover:bg-zinc-950 hover:text-white transition-all">
                              <Eye size={16}/>
                            </button>
                          ) : (
                            <span className="text-[9px] font-bold text-slate-300 uppercase italic">YOK</span>
                          )}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button onClick={() => setFinance(p => p.filter(x => x.id !== f.id))} className="p-2 text-slate-300 hover:text-red-600 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-8 sm:p-10 shadow-2xl relative animate-in zoom-in-95 max-h-[90vh] overflow-y-auto no-scrollbar">
            <button onClick={() => setIsAddOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8 leading-none">YENİ <span className="text-[#E30613]">İŞLEM KAYDI</span></h3>
            
            <div className="space-y-5 pb-8">
               <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl">
                 <button onClick={() => setEntryForm({...entryForm, type: 'income'})} className={`py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${entryForm.type === 'income' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-400'}`}>GELİR</button>
                 <button onClick={() => setEntryForm({...entryForm, type: 'expense'})} className={`py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${entryForm.type === 'expense' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400'}`}>GİDER</button>
               </div>

               <div>
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block px-1">TUTAR (TRY)</label>
                 <input type="number" placeholder="0.00" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-black text-xl italic outline-none focus:border-red-600 transition-all" onChange={e => setEntryForm({...entryForm, amount: Number(e.target.value)})} />
               </div>

               <div className="grid grid-cols-2 gap-3">
                 <div>
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block px-1">KATEGORİ</label>
                   <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase outline-none focus:border-red-600" value={entryForm.category} onChange={e => setEntryForm({...entryForm, category: e.target.value as any})}>
                     <option value="Aidat">AİDAT</option>
                     <option value="Ekipman">EKİPMAN</option>
                     <option value="Kira">KİRA</option>
                     <option value="Maaş">MAAŞ</option>
                     <option value="Diğer">DİĞER</option>
                   </select>
                 </div>
                 <div>
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block px-1">ÖDEME ŞEKLİ</label>
                   <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase outline-none focus:border-red-600" value={entryForm.paymentMethod} onChange={e => setEntryForm({...entryForm, paymentMethod: e.target.value})}>
                     <option value="Elden">ELDEN</option>
                     <option value="Havale">HAVALE</option>
                     <option value="Kart">KREDİ KARTI</option>
                   </select>
                 </div>
               </div>

               <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block px-1">MAKBUZ / BELGE</label>
                  <div onClick={() => fileInputRef.current?.click()} className={`w-full h-32 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center cursor-pointer transition-all ${entryForm.receiptUrl ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-slate-50 hover:border-red-600 group'}`}>
                      {entryForm.receiptUrl ? (
                        <img src={entryForm.receiptUrl} className="h-full w-full object-contain p-2" />
                      ) : (
                        <>
                          <Camera size={28} className="text-slate-300 group-hover:text-red-600 transition-colors" />
                          <span className="text-[9px] font-black text-slate-400 mt-2 uppercase tracking-widest">DOSYA YÜKLE</span>
                        </>
                      )}
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
               </div>

               <button onClick={handleSave} disabled={isOptimizing} className="w-full py-5 bg-zinc-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-red-600 transition-all active:scale-95 flex items-center justify-center gap-3 mt-4 disabled:opacity-50 mb-4">
                  <Save size={18} /> {isOptimizing ? 'İŞLENİYOR...' : 'İŞLEMİ KAYDET'}
               </button>
            </div>
          </div>
        </div>
      )}

      {previewImage && (
        <div className="fixed inset-0 z-[10002] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in" onClick={() => setPreviewImage(null)}>
           <div className="max-w-xl w-full relative">
              <button onClick={() => setPreviewImage(null)} className="absolute -top-12 right-0 text-white flex items-center gap-2 font-black uppercase text-[10px] tracking-widest bg-white/10 px-4 py-2 rounded-full">KAPAT <X size={16}/></button>
              <img src={previewImage} className="w-full rounded-3xl shadow-[0_0_100px_rgba(255,255,255,0.1)] border-2 border-white/10" alt="Makbuz" />
           </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
