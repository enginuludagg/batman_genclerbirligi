
import React, { useState } from 'react';
import { ClipboardList, Plus, Search, CheckCircle2, AlertCircle, Clock, Trash2, X, Send, Sparkles, BrainCircuit, Filter, Layers } from 'lucide-react';
import { TrainerNote, AppMode } from '../types';

interface Props {
  notes: TrainerNote[];
  setNotes: React.Dispatch<React.SetStateAction<TrainerNote[]>>;
  mode?: AppMode;
}

const SCOPES = ['Genel', 'U10', 'U11', 'U12', 'U14', 'U16', 'U18', 'U19', 'Futbol', 'Voleybol', 'Cimnastik'];

const TrainerNotebook: React.FC<Props> = ({ notes, setNotes, mode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Hepsi');
  const [newNote, setNewNote] = useState<Partial<TrainerNote>>({
    trainerName: '', content: '', priority: 'medium', category: 'Saha Dışı', targetScope: 'Genel'
  });

  const handleSave = () => {
    if (!newNote.content) return;
    const note: TrainerNote = {
      id: Date.now().toString(),
      trainerName: newNote.trainerName || 'BGB Antrenörü',
      content: newNote.content,
      date: new Date().toLocaleDateString('tr-TR'),
      status: 'new',
      priority: newNote.priority as any,
      category: newNote.category as any,
      targetScope: newNote.targetScope || 'Genel'
    };
    setNotes([note, ...notes]);
    setIsModalOpen(false);
    setNewNote({ trainerName: '', content: '', priority: 'medium', category: 'Saha Dışı', targetScope: 'Genel' });
  };

  const markAsRead = (id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, status: 'read' } : n));
  };

  const deleteNote = (id: string) => {
    if (confirm('Bu rapor kaydını silmek istediğinize emin misiniz?')) {
      setNotes(prev => prev.filter(n => n.id !== id));
    }
  };

  const filtered = notes.filter(n => {
    const matchesSearch = n.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         n.trainerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesScope = activeFilter === 'Hepsi' || n.targetScope === activeFilter;
    return matchesSearch && matchesScope;
  });

  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'high': return 'bg-red-600';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  const getScopeColor = (scope: string) => {
    if (scope === 'Genel') return 'bg-zinc-900';
    if (['Futbol', 'Voleybol', 'Cimnastik'].includes(scope)) return 'bg-red-600';
    return 'bg-blue-600';
  };

  if (mode === 'parent') return <div className="p-12 text-center font-black uppercase text-slate-400">YALNIZCA TEKNİK EKİP VE YÖNETİM ERİŞİMİ</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">ANTRENÖR <span className="text-red-600">NOTLARI</span></h2>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest pl-1 mt-1">Branş & Departman Bazlı Raporlama</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 text-white px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase shadow-xl hover:bg-zinc-900 transition-all active:scale-95"
          >
            <Plus size={18} /> RAPOR OLUŞTUR
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 px-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" placeholder="İçerik veya antrenör ara..." 
            className="w-full pl-11 pr-4 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase outline-none focus:border-red-600 transition-all shadow-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto no-scrollbar gap-1">
          {['Hepsi', ...SCOPES.slice(0, 6)].map((s) => (
            <button
              key={s}
              onClick={() => setActiveFilter(s)}
              className={`px-5 py-2.5 rounded-xl text-[9px] font-black transition-all whitespace-nowrap ${activeFilter === s ? 'bg-zinc-900 text-white shadow-lg' : 'text-gray-400 hover:text-zinc-600'}`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 px-2">
        {filtered.map(note => (
          <div key={note.id} className={`bg-white rounded-[2rem] p-6 shadow-sm border-l-8 transition-all hover:shadow-md ${note.status === 'new' ? 'border-zinc-900' : 'border-gray-100 opacity-80'} ${note.priority === 'high' ? 'bg-red-50/20' : ''}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${getPriorityColor(note.priority)}`}>
                   <ClipboardList size={20} />
                 </div>
                 <div>
                   <div className="flex items-center gap-2 flex-wrap">
                     <h4 className="font-black text-zinc-900 text-xs uppercase italic">{note.trainerName}</h4>
                     <span className={`text-[8px] font-black px-2 py-0.5 rounded-lg text-white uppercase tracking-tighter ${getScopeColor(note.targetScope)}`}>
                       {note.targetScope}
                     </span>
                     <span className={`text-[8px] font-black px-2 py-0.5 rounded-lg uppercase border border-gray-200 text-gray-400`}>
                       {note.category}
                     </span>
                   </div>
                   <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{note.date}</p>
                 </div>
              </div>
              
              <div className="flex items-center gap-2">
                {note.status === 'new' ? (
                  <button 
                    onClick={() => markAsRead(note.id)}
                    className="bg-green-600 text-white px-4 py-2.5 rounded-xl text-[9px] font-black uppercase flex items-center gap-1.5 shadow-lg shadow-green-600/20 active:scale-95 transition-all"
                  >
                    <CheckCircle2 size={12} /> OKUDUM
                  </button>
                ) : (
                  <span className="text-zinc-400 text-[9px] font-black uppercase flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 rounded-xl italic">
                    <CheckCircle2 size={12} /> İNCELENDİ
                  </span>
                )}
                <button onClick={() => deleteNote(note.id)} className="p-2.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="mt-4 p-5 bg-gray-50/80 rounded-2xl border border-gray-100 relative">
               <Layers size={40} className="absolute right-4 bottom-4 opacity-5 text-zinc-900" />
               <p className="text-[11px] font-bold text-zinc-800 leading-relaxed italic relative z-10">"{note.content}"</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative overflow-y-auto max-h-[95vh] custom-scrollbar">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black">
                <X size={24} />
              </button>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-6">YÖNETİME <span className="text-red-600">RAPOR YAZ</span></h3>
              
              <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">ANTRENÖR ADI</label>
                      <input 
                        type="text" placeholder="İsminiz" 
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-red-600 shadow-inner"
                        value={newNote.trainerName}
                        onChange={e => setNewNote({...newNote, trainerName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">İLGİLİ BİRİM / GRUP</label>
                      <select 
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase outline-none focus:border-red-600 shadow-inner"
                        value={newNote.targetScope}
                        onChange={e => setNewNote({...newNote, targetScope: e.target.value})}
                      >
                        {SCOPES.map(s => <option key={s} value={s}>{s === 'Genel' ? 'TÜM KULÜP (GENEL)' : s.toUpperCase()}</option>)}
                      </select>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">KATEGORİ</label>
                      <select 
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase outline-none focus:border-red-600 shadow-inner"
                        value={newNote.category}
                        onChange={e => setNewNote({...newNote, category: e.target.value as any})}
                      >
                        <option value="Saha Dışı">SAHA DIŞI</option>
                        <option value="Malzeme">MALZEME</option>
                        <option value="Disiplin">DİSİPLİN</option>
                        <option value="Gelişim">GELİŞİM</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">ÖNCELİK DURUMU</label>
                      <select 
                        className={`w-full p-4 border rounded-2xl text-[10px] font-black uppercase outline-none shadow-inner ${newNote.priority === 'high' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-gray-50 border-gray-100 text-zinc-900'}`}
                        value={newNote.priority}
                        onChange={e => setNewNote({...newNote, priority: e.target.value as any})}
                      >
                        <option value="low">DÜŞÜK (BİLGİ)</option>
                        <option value="medium">ORTA (ÖNEMLİ)</option>
                        <option value="high">YÜKSEK (ACİL)</option>
                      </select>
                    </div>
                 </div>

                 <div>
                   <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">RAPOR İÇERİĞİ</label>
                   <textarea 
                    placeholder="Lütfen rapor detaylarını profesyonel ve açık bir dille buraya yazın..." 
                    className="w-full p-5 bg-gray-50 border border-gray-100 rounded-[2rem] text-xs font-bold outline-none h-40 resize-none focus:border-red-600 shadow-inner"
                    value={newNote.content}
                    onChange={e => setNewNote({...newNote, content: e.target.value})}
                   />
                 </div>

                 <button 
                  onClick={handleSave}
                  className="w-full py-5 bg-zinc-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-red-600 transition-all active:scale-95 flex items-center justify-center gap-3"
                 >
                   RAPORU YÖNETİME İLET <Send size={18} />
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default TrainerNotebook;
