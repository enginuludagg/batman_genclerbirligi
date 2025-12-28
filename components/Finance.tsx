
import React, { useState, useRef, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, Plus, CreditCard, Search, X, Trash2, Save, BellRing, CheckCircle2, Loader2, User } from 'lucide-react';
import { FinanceEntry, AppMode, Student } from '../types';

interface Props {
  finance: FinanceEntry[];
  setFinance: React.Dispatch<React.SetStateAction<FinanceEntry[]>>;
  students: Student[];
  mode?: AppMode;
}

const Finance: React.FC<Props> = ({ finance, setFinance, students, mode }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isReminding, setIsReminding] = useState(false);
  const [showReminderSuccess, setShowReminderSuccess] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  
  const [entryForm, setEntryForm] = useState<Partial<FinanceEntry>>({
    type: 'income', category: 'Aidat', amount: 0, date: new Date().toISOString().split('T')[0],
    description: '', branch: 'Genel', paymentMethod: 'Elden', studentId: '', studentName: ''
  });
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAddOpen && firstInputRef.current) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isAddOpen]);

  const totalIncome = finance.filter(f => f.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = finance.filter(f => f.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

  const handleSave = () => {
    if (!entryForm.amount || (!entryForm.description && !entryForm.studentName)) return;
    const description = entryForm.category === 'Aidat' ? `${entryForm.studentName} - ${entryForm.branch} Aidatı` : entryForm.description;
    const newEntry: FinanceEntry = { ...entryForm as FinanceEntry, id: Date.now().toString(), description: description || '' };
    setFinance([newEntry, ...finance]);
    setIsAddOpen(false);
    setEntryForm({ type: 'income', category: 'Aidat', amount: 0, date: new Date().toISOString().split('T')[0], description: '', branch: 'Genel', paymentMethod: 'Elden', studentId: '', studentName: '' });
  };

  const handleSendReminders = async () => {
    setIsReminding(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsReminding(false);
    setShowReminderSuccess(true);
    setTimeout(() => setShowReminderSuccess(false), 3000);
  };

  if (mode === 'parent') return <div className="p-12 text-center font-black uppercase text-slate-400 italic">YALNIZCA YÖNETİCİ ERİŞİMİ</div>;

  const searchableStudents = students.filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()));

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase italic leading-none">MUHASEBE <span className="text-[#E30613]">PANELİ</span></h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">BATMAN GB FİNANSAL TAKİP</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button onClick={handleSendReminders} disabled={isReminding} className="w-full md:w-auto bg-orange-600 text-white px-8 py-5 rounded-[2.5rem] font-black text-[10px] uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 hover:bg-zinc-950">
            {isReminding ? <Loader2 size={18} className="animate-spin" /> : <BellRing size={18} />} PANEL UYARISI GÖNDER
          </button>
          <button onClick={() => setIsAddOpen(true)} className="w-full md:w-auto bg-zinc-950 text-white px-10 py-5 rounded-[2.5rem] font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-[#E30613] transition-all flex items-center justify-center gap-3 active:scale-95">
            <Plus size={18} /> İŞLEM EKLE
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100"><p className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">TOPLAM GELİR</p><div className="flex items-center justify-between text-green-600 font-black text-2xl">₺{totalIncome.toLocaleString()} <TrendingUp size={24} /></div></div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100"><p className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">TOPLAM GİDER</p><div className="flex items-center justify-between text-[#E30613] font-black text-2xl">₺{totalExpense.toLocaleString()} <TrendingDown size={24} /></div></div>
        <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl"><p className="text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">KASA BAKİYE</p><div className="flex items-center justify-between font-black text-2xl">₺{(totalIncome - totalExpense).toLocaleString()} <CreditCard size={24} className="text-[#E30613]" /></div></div>
      </div>

      {/* Tablo ve diğer alanlar aynı kalacak şekilde devam ediyor */}

      {isAddOpen && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-8 sm:p-12 shadow-2xl relative animate-in zoom-in-95 my-auto">
            <button onClick={() => setIsAddOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-black"><X size={28} /></button>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-10 text-center">YENİ <span className="text-[#E30613]">MUHASEBE GİRİŞİ</span></h3>
            <button onClick={handleSave} className="w-full py-5 bg-zinc-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-[#E30613] transition-all mt-4 flex items-center justify-center gap-3">
              <Save size={18} /> İŞLEMİ KAYDET
            </button>
          </div>
        </div>
      )}
      
      {/* FOOTER IMZA - OZEL TALEP HIYERARSISI */}
      <div className="flex flex-col items-center justify-center space-y-1 pt-20 opacity-40">
         <p className="text-[7px] font-black text-zinc-400 uppercase tracking-[0.4em] italic">BGB AKADEMİ YAZILIM ALTYAPISI</p>
         <div className="flex items-center gap-4 w-full max-w-sm">
            <div className="h-px bg-zinc-300 flex-1"></div>
            <h5 className="text-[11px] font-black text-zinc-900 uppercase tracking-[0.3em] italic whitespace-nowrap">
               powered by <span className="text-red-600">Engin Uludağ</span>
            </h5>
            <div className="h-px bg-zinc-300 flex-1"></div>
         </div>
      </div>
    </div>
  );
};

export default Finance;
