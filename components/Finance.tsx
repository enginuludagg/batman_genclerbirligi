
import React, { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Plus, Search, X, Trash2, Save, BellRing, CheckCircle2, Loader2, User } from 'lucide-react';
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
  
  // Form State
  const [entryForm, setEntryForm] = useState<Partial<FinanceEntry>>({
    type: 'income', 
    category: 'Aidat', 
    amount: 0, 
    date: new Date().toISOString().split('T')[0],
    description: '', 
    branch: 'Genel', 
    paymentMethod: 'Elden', 
    studentId: '', 
    studentName: ''
  });

  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [isStudentListVisible, setIsStudentListVisible] = useState(false);

  // Hesaplamalar
  const totalIncome = finance.filter(f => f.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = finance.filter(f => f.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

  const selectStudent = (student: Student) => {
    const today = new Date();
    const currentMonthName = today.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
    
    setEntryForm(prev => ({
      ...prev,
      studentId: student.id,
      studentName: student.name,
      description: `${student.name} - ${currentMonthName} Aidatı`,
      branch: student.branchId
    }));
    setIsStudentListVisible(false);
    setStudentSearchTerm('');
  };

  const checkPaymentDue = (student: Student) => {
    let regDate = new Date();
    if (student.registrationDate) {
      regDate = new Date(student.registrationDate);
    } else {
       const ts = parseInt(student.id);
       if(!isNaN(ts)) regDate = new Date(ts);
    }

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const regDay = regDate.getDate();

    const hasPaidThisMonth = finance.some(f => {
      if (f.studentId !== student.id || f.type !== 'income' || f.category !== 'Aidat') return false;
      const paymentDate = new Date(f.date);
      return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
    });

    if (hasPaidThisMonth) return false;
    return today.getDate() >= regDay;
  };

  const handleSave = () => {
    // Validasyon - Detaylı Hata Mesajları
    if (!entryForm.amount || entryForm.amount <= 0) {
      alert("HATA: Tutar 0 veya boş olamaz. Lütfen bir rakam girin.");
      return;
    }
    
    if (entryForm.category === 'Aidat' && !entryForm.studentId) {
      alert("HATA: 'Aidat' seçtiğinizde listeden bir sporcu seçmek zorundasınız.");
      return;
    }

    if (!entryForm.description && !entryForm.studentName) {
      alert("HATA: Açıklama alanı boş bırakılamaz.");
      return;
    }

    const description = entryForm.description || (entryForm.category === 'Aidat' ? `${entryForm.studentName} Aidatı` : 'Genel İşlem');

    const newEntry: FinanceEntry = { 
      ...entryForm as FinanceEntry, 
      id: Date.now().toString(), 
      description: description,
      amount: Number(entryForm.amount) 
    };

    setFinance([newEntry, ...finance]);
    setIsAddOpen(false);
    
    // Formu Sıfırla
    setEntryForm({ 
      type: 'income', 
      category: 'Aidat', 
      amount: 0, 
      date: new Date().toISOString().split('T')[0], 
      description: '', 
      branch: 'Genel', 
      paymentMethod: 'Elden', 
      studentId: '', 
      studentName: '' 
    });
  };

  const deleteEntry = (id: string) => {
    if(window.confirm("Bu kaydı silmek istediğinize emin misiniz?")) {
      setFinance(prev => prev.filter(f => f.id !== id));
    }
  };

  const handleSendReminders = async () => {
    setIsReminding(true);
    const overdueCount = students.filter(s => checkPaymentDue(s)).length;
    await new Promise(r => setTimeout(r, 2000));
    alert(`${overdueCount} adet ödemesi geciken veliye hatırlatma bildirimi gönderildi.`);
    setIsReminding(false);
  };

  if (mode === 'parent') return <div className="p-12 text-center font-black uppercase text-slate-400 italic">YALNIZCA YÖNETİCİ ERİŞİMİ</div>;

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(studentSearchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase italic leading-none">MUHASEBE <span className="text-[#E30613]">PANELİ</span></h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">GELİR & GİDER YÖNETİMİ</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button onClick={handleSendReminders} disabled={isReminding} className="w-full md:w-auto bg-orange-600 text-white px-6 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 hover:bg-zinc-950">
            {isReminding ? <Loader2 size={18} className="animate-spin" /> : <BellRing size={18} />} AİDAT HATIRLAT
          </button>
          <button onClick={() => setIsAddOpen(true)} className="w-full md:w-auto bg-zinc-950 text-white px-8 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-[#E30613] transition-all flex items-center justify-center gap-3 active:scale-95">
            <Plus size={18} /> YENİ KAYIT
          </button>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-2">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
           <div className="absolute right-0 top-0 p-4 opacity-5"><TrendingUp size={64} /></div>
           <p className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">TOPLAM GELİR</p>
           <div className="flex items-center gap-2 text-green-600 font-black text-2xl">₺{totalIncome.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
           <div className="absolute right-0 top-0 p-4 opacity-5"><TrendingDown size={64} /></div>
           <p className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">TOPLAM GİDER</p>
           <div className="flex items-center gap-2 text-[#E30613] font-black text-2xl">₺{totalExpense.toLocaleString()}</div>
        </div>
        <div className="bg-zinc-900 text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
           <div className="absolute right-0 top-0 p-4 opacity-10"><Wallet size={64} /></div>
           <p className="text-[9px] font-black text-slate-500 uppercase mb-2 tracking-widest">NET KASA</p>
           <div className="flex items-center gap-2 font-black text-2xl">₺{(totalIncome - totalExpense).toLocaleString()}</div>
        </div>
      </div>

      {/* Kayıt Listesi */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden mx-2">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                     <th className="px-6 py-4">TARİH</th>
                     <th className="px-6 py-4">TÜR / KATEGORİ</th>
                     <th className="px-6 py-4">AÇIKLAMA</th>
                     <th className="px-6 py-4 text-right">TUTAR</th>
                     <th className="px-4 py-4"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {finance.map(f => (
                     <tr key={f.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-[10px] font-bold text-slate-500">{f.date}</td>
                        <td className="px-6 py-4">
                           <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${f.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {f.type === 'income' ? 'GELİR' : 'GİDER'}
                           </span>
                           <span className="ml-2 text-[10px] font-black text-slate-700 uppercase">{f.category}</span>
                        </td>
                        <td className="px-6 py-4">
                           <p className="text-xs font-bold text-slate-800">{f.description}</p>
                           {f.studentName && <p className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1 mt-0.5"><User size={10} /> {f.studentName}</p>}
                        </td>
                        <td className={`px-6 py-4 text-right font-black text-sm ${f.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                           {f.type === 'income' ? '+' : '-'}₺{f.amount}
                        </td>
                        <td className="px-4 py-4 text-right">
                           <button onClick={() => deleteEntry(f.id)} className="p-2 text-slate-300 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                        </td>
                     </tr>
                  ))}
                  {finance.length === 0 && (
                     <tr><td colSpan={5} className="p-8 text-center text-xs font-bold text-slate-300 uppercase italic">Henüz kayıt bulunmamaktadır.</td></tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* YENİ KAYIT MODALI */}
      {isAddOpen && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto">
          {/* mb-auto eklendi ki klavye açılınca yukarı kaysın */}
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-6 sm:p-10 shadow-2xl relative animate-in zoom-in-95 my-auto max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsAddOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-black"><X size={28} /></button>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-6 text-center">YENİ <span className="text-[#E30613]">İŞLEM</span></h3>
            
            <div className="space-y-5">
               {/* İşlem Türü */}
               <div className="flex gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <button onClick={() => setEntryForm({...entryForm, type: 'income', category: 'Aidat'})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${entryForm.type === 'income' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-400'}`}>GELİR (TAHSİLAT)</button>
                  <button onClick={() => setEntryForm({...entryForm, type: 'expense', category: 'Ekipman'})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${entryForm.type === 'expense' ? 'bg-[#E30613] text-white shadow-lg' : 'text-slate-400'}`}>GİDER (HARCAMA)</button>
               </div>

               {/* Kategori Seçimi */}
               <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">KATEGORİ</label>
                  <select 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black uppercase outline-none focus:border-[#E30613]"
                    value={entryForm.category}
                    onChange={(e) => setEntryForm({...entryForm, category: e.target.value as any})}
                  >
                     {entryForm.type === 'income' ? (
                        <>
                           <option value="Aidat">SPORCU AİDATI</option>
                           <option value="Diğer">DİĞER GELİR</option>
                        </>
                     ) : (
                        <>
                           <option value="Ekipman">EKİPMAN / MALZEME</option>
                           <option value="Kira">SAHA KİRASI</option>
                           <option value="Maaş">PERSONEL MAAŞI</option>
                           <option value="Diğer">DİĞER GİDER</option>
                        </>
                     )}
                  </select>
               </div>

               {/* Sporcu Seçimi (Sadece Aidat İse) */}
               {entryForm.type === 'income' && entryForm.category === 'Aidat' && (
                  <div className="relative">
                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">SPORCU SEÇİMİ (ZORUNLU)</label>
                     
                     {!entryForm.studentId ? (
                        <>
                           <div className="relative">
                              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                              <input 
                                 type="text" 
                                 placeholder="İsim ile sporcu ara..." 
                                 className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black outline-none focus:border-[#E30613]"
                                 value={studentSearchTerm}
                                 onChange={(e) => {
                                    setStudentSearchTerm(e.target.value);
                                    setIsStudentListVisible(true);
                                 }}
                                 onFocus={() => setIsStudentListVisible(true)}
                              />
                           </div>
                           
                           {isStudentListVisible && (
                              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-60 overflow-y-auto z-50">
                                 {filteredStudents.length > 0 ? filteredStudents.map(s => {
                                    const isDue = checkPaymentDue(s);
                                    return (
                                       <button 
                                          key={s.id} 
                                          onClick={() => selectStudent(s)}
                                          className="w-full text-left p-4 hover:bg-slate-50 border-b border-slate-50 last:border-0 flex justify-between items-center group"
                                       >
                                          <div>
                                             <p className="text-xs font-black text-slate-900 uppercase">{s.name}</p>
                                             <p className="text-[9px] font-bold text-slate-400 uppercase">{s.branchId} • {s.sport}</p>
                                             <p className="text-[8px] text-gray-400 font-bold">Kayıt: {s.registrationDate || 'N/A'}</p>
                                          </div>
                                          {isDue ? (
                                             <span className="text-[8px] font-black bg-red-100 text-red-600 px-2 py-1 rounded uppercase animate-pulse">Ödeme Zamanı</span>
                                          ) : (
                                             <span className="text-[8px] font-black bg-green-100 text-green-600 px-2 py-1 rounded uppercase">Güncel</span>
                                          )}
                                       </button>
                                    );
                                 }) : (
                                    <div className="p-4 text-center text-[10px] font-bold text-slate-400 uppercase">Sporcu bulunamadı</div>
                                 )}
                              </div>
                           )}
                        </>
                     ) : (
                        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-2xl">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-green-700"><CheckCircle2 size={16} /></div>
                              <div>
                                 <p className="text-xs font-black text-green-800 uppercase">{entryForm.studentName}</p>
                                 <p className="text-[9px] font-bold text-green-600 uppercase">SPORCU SEÇİLDİ</p>
                              </div>
                           </div>
                           <button onClick={() => setEntryForm({...entryForm, studentId: '', studentName: '', description: ''})} className="p-2 bg-white rounded-lg text-slate-400 hover:text-red-600"><X size={16} /></button>
                        </div>
                     )}
                  </div>
               )}

               {/* Tutar */}
               <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">TUTAR (TL)</label>
                  <input 
                     type="number" 
                     inputMode="decimal"
                     placeholder="0.00" 
                     className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xl font-black outline-none focus:border-[#E30613]"
                     value={entryForm.amount}
                     onChange={(e) => setEntryForm({...entryForm, amount: parseFloat(e.target.value)})}
                  />
               </div>

               {/* Açıklama */}
               <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">AÇIKLAMA</label>
                  <input 
                     type="text" 
                     placeholder="Örn: Mayıs Ayı Aidatı" 
                     className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-[#E30613]"
                     value={entryForm.description}
                     onChange={(e) => setEntryForm({...entryForm, description: e.target.value})}
                  />
               </div>

               <button 
                  onClick={handleSave} 
                  className="w-full py-5 bg-zinc-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-[#E30613] transition-all flex items-center justify-center gap-3 mt-4 active:scale-95"
               >
                  <Save size={18} /> KAYDET
               </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <div className="flex flex-col items-center justify-center space-y-1 pt-20 opacity-40">
         <p className="text-[7px] font-black text-zinc-400 uppercase tracking-[0.4em] italic">BGB AKADEMİ FİNANS</p>
      </div>
    </div>
  );
};

export default Finance;
