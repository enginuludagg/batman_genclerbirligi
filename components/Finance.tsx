
import React, { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Plus, CreditCard, Search, FileSpreadsheet, X } from 'lucide-react';
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

  const totalIncome = finance.filter(f => f.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = finance.filter(f => f.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

  const handleSave = () => {
    if (!entryForm.amount || !entryForm.description) return;
    setFinance([{ ...entryForm as FinanceEntry, id: Date.now().toString() }, ...finance]);
    setIsAddOpen(false);
  };

  if (mode === 'parent') return <div className="p-12 text-center font-black uppercase text-slate-400">YALNIZCA YÖNETİCİ ERİŞİMİ</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 pb-20">
      <div className="flex justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase italic">MUHASEBE <span className="text-red-600">PANELİ</span></h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">BATMAN GB FİNANSAL TAKİP</p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="bg-red-600 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-black transition-all flex items-center gap-2">
          <Plus size={18} /> İŞLEM EKLE
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <p className="text-[9px] font-black text-slate-400 uppercase mb-2">TOPLAM GELİR</p>
          <div className="flex items-center justify-between text-green-600 font-black text-2xl">
            ₺{totalIncome.toLocaleString()} <TrendingUp size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <p className="text-[9px] font-black text-slate-400 uppercase mb-2">TOPLAM GİDER</p>
          <div className="flex items-center justify-between text-red-600 font-black text-2xl">
            ₺{totalExpense.toLocaleString()} <TrendingDown size={24} />
          </div>
        </div>
        <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl">
          <p className="text-[9px] font-black text-slate-500 uppercase mb-2">GÜNCEL KASA</p>
          <div className="flex items-center justify-between font-black text-2xl">
            ₺{(totalIncome - totalExpense).toLocaleString()} <CreditCard size={24} className="text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-50 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              type="text" placeholder="İşlem ara..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl text-xs font-bold outline-none border border-slate-100" 
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase hover:bg-slate-200 transition-all">
            <FileSpreadsheet size={16} /> EXCEL'E AKTAR
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[9px] font-black uppercase text-slate-400 tracking-widest">
              <tr>
                <th className="px-6 py-4">TARİH</th>
                <th className="px-6 py-4">KATEGORİ</th>
                <th className="px-6 py-4">AÇIKLAMA</th>
                <th className="px-6 py-4 text-right">TUTAR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {finance.filter(f => f.description.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase italic">{item.date}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[8px] font-black px-2 py-1 rounded-lg uppercase ${item.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-900 uppercase italic truncate max-w-[200px]">{item.description}</td>
                  <td className={`px-6 py-4 text-right font-black text-sm ${item.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    ₺{item.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative">
            <button onClick={() => setIsAddOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
               <X size={24} />
            </button>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-6">İŞLEM <span className="text-red-600">EKLE</span></h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-50 rounded-2xl">
                <button 
                  onClick={() => setEntryForm({...entryForm, type: 'income'})}
                  className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all ${entryForm.type === 'income' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-400'}`}
                >
                  GELİR
                </button>
                <button 
                  onClick={() => setEntryForm({...entryForm, type: 'expense'})}
                  className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all ${entryForm.type === 'expense' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400'}`}
                >
                  GİDER
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">TUTAR (₺)</label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-red-600 transition-colors"
                    value={entryForm.amount || ''}
                    onChange={e => setEntryForm({...entryForm, amount: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">KATEGORİ</label>
                  <select 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-red-600 transition-colors"
                    value={entryForm.category}
                    onChange={e => setEntryForm({...entryForm, category: e.target.value as any})}
                  >
                    <option value="Aidat">Aidat</option>
                    <option value="Ekipman">Ekipman</option>
                    <option value="Kira">Kira</option>
                    <option value="Maaş">Maaş</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">AÇIKLAMA</label>
                  <input 
                    type="text" 
                    placeholder="İşlem detayı..." 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-red-600 transition-colors"
                    value={entryForm.description}
                    onChange={e => setEntryForm({...entryForm, description: e.target.value})}
                  />
                </div>
              </div>

              <button 
                onClick={handleSave}
                className="w-full py-5 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all mt-4 hover:bg-red-600"
              >
                KAYDET
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
