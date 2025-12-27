
import React, { useState, useRef, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, Plus, CreditCard, Search, FileSpreadsheet, X, Trash2, Save } from 'lucide-react';
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
  const [entryForm, setEntryForm] = useState<Partial<FinanceEntry>>({
    type: 'income', category: 'Aidat', amount: 0, date: new Date().toISOString().split('T')[0],
    description: '', branch: 'Genel', paymentMethod: 'Elden'
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
    if (!entryForm.amount || !entryForm.description) return;
    const newEntry: FinanceEntry = { ...entryForm as FinanceEntry, id: Date.now().toString() };
    setFinance([newEntry, ...finance]);
    setIsAddOpen(false);
    setEntryForm({ type: 'income', category: 'Aidat', amount: 0, date: new Date().toISOString().split('T')[0], description: '', branch: 'Genel', paymentMethod: 'Elden' });
  };

  const deleteEntry = (id: string) => {
    if (window.confirm('Bu finansal işlem kaydı silinecek. Emin misiniz?')) {
        setFinance(prev => prev.filter(f => f.id !== id));
    }
  };

  if (mode === 'parent') return <div className="p-12 text-center font-black uppercase text-slate-400">YALNIZCA YÖNETİCİ ERİŞİMİ</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase italic leading-none">MUHASEBE <span className="text-red-600">PANELİ</span></h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">BATMAN GB FİNANSAL TAKİP</p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="w-full md:w-auto bg-zinc-950 text-white px-10 py-5 rounded-[2.5rem] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-red-600 transition-all flex items-center justify-center gap-3 active:scale-95">
          <Plus size={18} /> İŞLEM EKLE
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100"><p className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">TOPLAM GELİR</p><div className="flex items-center justify-between text-green-600 font-black text-2xl">₺{totalIncome.toLocaleString()} <TrendingUp size={24} /></div></div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100"><p className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">TOPLAM GİDER</p><div className="flex items-center justify-between text-red-600 font-black text-2xl">₺{totalExpense.toLocaleString()} <TrendingDown size={24} /></div></div>
        <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl"><p className="text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">KASA BAKİYE</p><div className="flex items-center justify-between font-black text-2xl">₺{(totalIncome - totalExpense).toLocaleString()} <CreditCard size={24} className="text-red-600" /></div></div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-50 overflow-hidden mx-2 animate-in fade-in">
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input type="text" placeholder="İşlem ara..." className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl text-xs font-bold outline-none border border-slate-100 shadow-inner" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[9px] font-black uppercase text-slate-400 tracking-widest">
              <tr><th className="px-8 py-5">TARİH</th><th className="px-6 py-5">KATEGORİ</th><th className="px-6 py-5">AÇIKLAMA</th><th className="px-6 py-5 text-right">TUTAR</th><th className="px-6 py-5"></th></tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {finance.filter(f => f.description.toLowerCase().includes(searchTerm.toLowerCase())).length > 0 ? finance.filter(f => f.description.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase italic">{item.date}</td>
                  <td className="px-6 py-5"><span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase ${item.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{item.category}</span></td>
                  <td className="px-6 py-5 text-xs font-bold text-slate-900 uppercase italic truncate max-w-[200px]">{item.description}</td>
                  <td className={`px-6 py-5 text-right font-black text-base ${item.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>₺{item.amount.toLocaleString()}</td>
                  <td className="px-6 py-5 text-right"><button onClick={() => deleteEntry(item.id)} className="p-2 text-slate-300 hover:text-red-600 transition-all"><Trash2 size={18} /></button></td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="p-16 text-center text-[10px] font-black text-slate-300 uppercase italic tracking-[0.2em]">FİNANSAL KAYIT BULUNAMADI.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-8 sm:p-12 shadow-2xl relative animate-in zoom-in-95 my-auto">
            <button onClick={() => setIsAddOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-black transition-colors"><X size={28} /></button>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-10 text-center">YENİ <span className="text-red-600">MUHASEBE GİRİŞİ</span></h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">İŞLEM TİPİ</label>
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                  <button onClick={() => setEntryForm({...entryForm, type: 'income'})} className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${entryForm.type === 'income' ? 'bg-zinc-950 text-white shadow-xl' : 'text-slate-400'}`}>GELİR</button>
                  <button onClick={() => setEntryForm({...entryForm, type: 'expense'})} className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${entryForm.type === 'expense' ? 'bg-zinc-950 text-white shadow-xl' : 'text-slate-400'}`}>GİDER</button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">TUTAR (₺)</label>
                  <input 
                    ref={firstInputRef}
                    type="number" 
                    placeholder="0.00" 
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-base font-black outline-none focus:border-red-600" 
                    value={entryForm.amount || ''} 
                    onChange={e => setEntryForm({...entryForm, amount: parseFloat(e.target.value)})} 
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">KATEGORİ</label>
                  <select className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase outline-none focus:border-red-600" value={entryForm.category} onChange={e => setEntryForm({...entryForm, category: e.target.value as any})}>
                    <option value="Aidat">Aidat</option>
                    <option value="Ekipman">Ekipman</option>
                    <option value="Kira">Kira</option>
                    <option value="Maaş">Maaş</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">İŞLEM AÇIKLAMASI</label>
                <input 
                  type="text" 
                  placeholder="Örn: Mayıs Ayı U14 Aidat Ödemesi" 
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-red-600" 
                  value={entryForm.description} 
                  onChange={e => setEntryForm({...entryForm, description: e.target.value})} 
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                />
              </div>

              <button 
                onClick={handleSave} 
                className="w-full py-5 bg-zinc-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 hover:bg-red-600 transition-all mt-4 flex items-center justify-center gap-3"
              >
                <Save size={18} /> İŞLEMİ KAYDET
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
