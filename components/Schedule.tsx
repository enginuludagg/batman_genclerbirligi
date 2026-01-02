
import React, { useState, useRef, useEffect } from 'react';
import { Clock, MapPin, Users as GroupIcon, Calendar, Plus, Trash2, Edit3, X, ChevronDown, Save } from 'lucide-react';
import { TrainingSession, AppMode } from '../types';

interface Props {
  sessions: TrainingSession[];
  setSessions: (sessions: TrainingSession[]) => void;
  mode?: AppMode;
}

const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
const availableGroups = ['U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'U17', 'U18', 'U19', 'KALECİ GRUBU', 'MİNİKLER'];

const Schedule: React.FC<Props> = ({ sessions, setSessions, mode }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<TrainingSession | null>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  
  const [newSession, setNewSession] = useState<Partial<TrainingSession>>({
    day: 'Pazartesi', title: '', group: 'U14', time: '18:00 - 19:30', location: ''
  });

  useEffect(() => {
    if ((isAddOpen || editingSession) && firstInputRef.current) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isAddOpen, editingSession]);

  const handleAdd = () => {
    if (!newSession.title || !newSession.group) return;
    const session = { ...newSession as TrainingSession, id: Date.now().toString() };
    setSessions([...sessions, session]);
    setIsAddOpen(false);
    setNewSession({ day: 'Pazartesi', title: '', group: 'U14', time: '18:00 - 19:30', location: '' });
  };

  const handleUpdate = () => {
    if (!editingSession) return;
    const updated = sessions.map(s => s.id === editingSession.id ? editingSession : s);
    setSessions(updated);
    setEditingSession(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">HAFTALIK <span className="text-red-600">PROGRAM</span></h2>
        </div>
        {mode === 'admin' && (
          <button onClick={() => setIsAddOpen(true)} className="bg-black text-white px-5 py-3 rounded-xl flex items-center gap-2 font-black text-xs hover:bg-red-600 transition-all shadow-xl active:scale-95">
            <Plus size={18} /> EKLE
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 px-2 pb-24">
        {days.map(day => (
          <div key={day} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-50">
            <div className="bg-zinc-900 text-white px-8 py-4 flex items-center justify-between">
              <h3 className="font-black uppercase text-xs tracking-[0.2em] flex items-center gap-3 italic">
                <Calendar size={16} className="text-red-600" /> {day.toUpperCase()}
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.filter(s => s.day === day).map(s => (
                <div key={s.id} className="relative p-6 rounded-[1.5rem] border-2 border-gray-50 bg-gray-50/50 hover:bg-white hover:border-red-600 transition-all group">
                  {mode === 'admin' && (
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button onClick={() => setEditingSession(s)} className="p-2 bg-zinc-100 rounded-lg text-gray-400 hover:text-black"><Edit3 size={14} /></button>
                      <button onClick={() => setSessions(sessions.filter(x => x.id !== s.id))} className="p-2 bg-red-50 rounded-lg text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                    </div>
                  )}
                  <span className="bg-red-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase italic tracking-widest">{s.group}</span>
                  <h4 className="font-black text-zinc-900 text-base mt-3 uppercase italic truncate">{s.title}</h4>
                  <div className="flex items-center gap-3 text-[10px] text-gray-500 font-black uppercase mt-3">
                    <Clock size={14} className="text-red-600" /> <span>{s.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {(isAddOpen || editingSession) && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-8 sm:p-10 shadow-2xl animate-in zoom-in-95 my-auto max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">ANTRENMAN <span className="text-red-600">{editingSession ? 'DÜZENLE' : 'PLANLA'}</span></h3>
              <button onClick={() => { setIsAddOpen(false); setEditingSession(null); }} className="text-gray-400 hover:text-black"><X size={28} /></button>
            </div>
            
            <div className="space-y-5 pb-8">
              <input ref={firstInputRef} type="text" placeholder="Antrenman Adı" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-red-600" value={editingSession ? editingSession.title : newSession.title} onChange={e => editingSession ? setEditingSession({...editingSession, title: e.target.value}) : setNewSession({...newSession, title: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <select className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase outline-none" value={editingSession ? editingSession.day : newSession.day} onChange={e => editingSession ? setEditingSession({...editingSession, day: e.target.value}) : setNewSession({...newSession, day: e.target.value})}>
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase outline-none" value={editingSession ? editingSession.group : newSession.group} onChange={e => editingSession ? setEditingSession({...editingSession, group: e.target.value}) : setNewSession({...newSession, group: e.target.value})}>
                  {availableGroups.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <input type="text" placeholder="18:00 - 19:30" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-red-600" value={editingSession ? editingSession.time : newSession.time} onChange={e => editingSession ? setEditingSession({...editingSession, time: e.target.value}) : setNewSession({...newSession, time: e.target.value})} />
              <button onClick={editingSession ? handleUpdate : handleAdd} className="w-full py-5 bg-zinc-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-red-600 active:scale-95 transition-all mt-4 mb-4">
                <Save size={18} className="inline mr-2" /> {editingSession ? 'GÜNCELLE' : 'EKLE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
