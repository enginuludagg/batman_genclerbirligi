
import React, { useState, useRef } from 'react';
import { Wallet, TrendingUp, TrendingDown, Plus, Search, X, Trash2, Save, BellRing, CheckCircle2, Loader2, User, Camera, Image as ImageIcon, Eye } from 'lucide-react';
import { FinanceEntry, AppMode, Student } from '../types';

interface Props {
  finance: FinanceEntry[];
  setFinance: React.Dispatch<React.SetStateAction<FinanceEntry[]>>;
  students: Student[];
  mode?: AppMode;
}

const Finance: React.FC<Props> = ({ finance, setFinance, students, mode }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isReminding, setIsReminding] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [entryForm, setEntryForm] = useState<Partial<FinanceEntry>>({
    type: 'income', category: 'Aidat', amount: 0, date: new Date().toISOString().split('T')[0],
    description: '', branch: 'Genel', paymentMethod: 'Elden', studentId: '', studentName: '', receiptUrl: ''
  });

  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [isStudentListVisible, setIsStudentListVisible] = useState(false);

  const totalIncome = finance.filter(f => f.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = finance.filter(f => f.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

  const optimizeImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500; // Daha agresif sıkıştırma (Firestore dostu)
          let width = img.width;
          let height = img.height;
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.5)); // %50 kalite
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
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">GELİR & GİDER TAKİBİ</p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="w-full md:w-auto bg-zinc-950 text-white px-8 py-4 rounded-[2rem] font-black text-xs uppercase shadow-xl hover:bg-[#E30613] transition-all flex items-center justify-center gap-3">
          <Plus size={18} /> YENİ İŞLEM
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border flex flex-col"><p className="text-[9px] font-black text-slate-400 uppercase">TOPLAM GELİR</p><span className="text-2xl font-black text-green-600">₺{totalIncome.toLocaleString()}</span></div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border flex flex-col"><p className="text-[9px] font-black text-slate-400 uppercase">TOPLAM GİDER</p><span className="text-2xl font-black text-red-600">₺{totalExpense.toLocaleString()}</span></div>
        <div className="bg-zinc-900 text-white p-6 rounded-[2rem] shadow-xl flex flex-col"><p className="text-[9px] font-black text-slate-500 uppercase">KASA</p><span className="text-2xl font-black text-white">₺{(totalIncome - totalExpense).toLocaleString()}</span></div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
               <thead className="bg-slate-50 font-black text-slate-400 uppercase">
                  <tr><th className="px-6 py-4">TARİH</th><th className="px-6 py-4">KATEGORİ</th><th className="px-6 py-4 text-right">TUTAR</th><th className="px-4 py-4">MAKBUZ</th><th className="px-4 py-4"></th></tr>
               </thead>
               <tbody className="divide-y">
                  {finance.map(f => (
                     <tr key={f.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">{f.date}</td>
                        <td className="px-6 py-4 font-black uppercase">{f.category}</td>
                        <td className={`px-6 py-4 text-right font-black ${f.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>₺{f.amount}</td>
                        <td className="px-4 py-4">{f.receiptUrl ? <button onClick={() => setPreviewImage(f.receiptUrl!)} className="p-2 bg-slate-100 rounded-lg"><Eye size={16}/></button> : '-'}</td>
                        <td className="px-4 py-4 text-right"><button onClick={() => setFinance(p => p.filter(x => x.id !== f.id))} className="text-slate-300 hover:text-red-600"><Trash2 size={16} /></button></td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl relative">
            <button onClick={() => setIsAddOpen(false)} className="absolute top-6 right-6"><X size={24} /></button>
            <h3 className="text-xl font-black italic uppercase mb-6">YENİ İŞLEM</h3>
            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-2">
                 <button onClick={() => setEntryForm({...entryForm, type: 'income'})} className={`py-3 rounded-xl font-black text-[10px] ${entryForm.type === 'income' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-400'}`}>GELİR</button>
                 <button onClick={() => setEntryForm({...entryForm, type: 'expense'})} className={`py-3 rounded-xl font-black text-[10px] ${entryForm.type === 'expense' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-400'}`}>GİDER</button>
               </div>
               <input type="number" placeholder="Tutar (₺)" className="w-full p-4 bg-slate-50 border rounded-2xl font-black" onChange={e => setEntryForm({...entryForm, amount: Number(e.target.value)})} />
               <div onClick={() => fileInputRef.current?.click()} className="w-full h-24 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-red-600">
                  {entryForm.receiptUrl ? <img src={entryForm.receiptUrl} className="h-full object-contain" /> : <><Camera size={24} className="text-slate-300" /><span className="text-[10px] font-black text-slate-400 mt-1">BELGE YÜKLE</span></>}
               </div>
               <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
               <button onClick={handleSave} className="w-full py-5 bg-zinc-950 text-white rounded-[2rem] font-black text-xs uppercase shadow-xl hover:bg-red-600 transition-all">KAYDET</button>
            </div>
          </div>
        </div>
      )}

      {previewImage && (
        <div className="fixed inset-0 z-[6000] bg-black/95 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setPreviewImage(null)}>
           <img src={previewImage} className="max-w-full max-h-full rounded-2xl shadow-2xl border" alt="Makbuz" />
        </div>
      )}
    </div>
  );
};

export default Finance;
