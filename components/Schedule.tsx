
import React, { useState } from 'react';
import { Clock, MapPin, Users as GroupIcon, Calendar, Plus, Trash2, Edit3, X, ChevronDown } from 'lucide-react';
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
  const [newSession, setNewSession] = useState<Partial<TrainingSession>>({
    day: 'Pazartesi', title: '', group: 'U14', time: '18:00 - 19:30', location: ''
  });

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

  const removeSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Bu antrenman programdan kaldırılacak. Emin misiniz?')) {
      setSessions(sessions.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">HAFTALIK <span className="text-red-600">PROGRAM</span></h2>
          <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mt-1">Akademi Çalışma Takvimi Düzenleme</p>
        </div>
        {mode === 'admin' && (
          <button 
            onClick={() => setIsAddOpen(true)}
            className="bg-black text-white px-5 py-3 rounded-xl flex items-center gap-2 font-black text-xs hover:bg-red-600 transition-all shadow-xl active:scale-95"
          >
            <Plus size={18} /> EKLE
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 px-2">
        {days.map(day => (
          <div key={day} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-50 animate-in fade-in">
            <div className="bg-zinc-900 text-white px-8 py-4 flex items-center justify-between">
              <h3 className="font-black uppercase text-xs tracking-[0.2em] flex items-center gap-3 italic">
                <Calendar size={16} className="text-red-600" />
                {day.toUpperCase()}
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.filter(s => s.day === day).length > 0 ? (
                sessions.filter(s => s.day === day).map(s => (
                  <div key={s.id} className="relative p-6 rounded-[1.5rem] border-2 border-gray-50 bg-gray-50/50 hover:bg-white hover:border-red-600 transition-all group">
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      {mode === 'admin' && (
                        <>
                          <button onClick={() => setEditingSession(s)} className="p-2 bg-zinc-100 rounded-lg text-gray-400 hover:text-black hover:bg-zinc-200 transition-colors"><Edit3 size={14} /></button>
                          <button onClick={(e) => removeSession(e, s.id)} className="p-2 bg-red-50 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-100 transition-colors"><Trash2 size={14} /></button>
                        </>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <span className="bg-red-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase italic tracking-widest shadow-lg shadow-red-600/20">{s.group}</span>
                      <h4 className="font-black text-zinc-900 text-base mt-3 uppercase italic tracking-tight truncate">{s.title}</h4>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-[10px] text-gray-500 font-black uppercase tracking-widest">
                        <Clock size={14} className="text-red-600" />
                        <span>{s.time}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-gray-500 font-black uppercase tracking-widest">
                        <MapPin size={14} className="text-red-600" />
                        <span className="truncate">{s.location || 'Saha Belirtilmedi'}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest py-4 px-2 italic opacity-50">Resmi Antrenman Yok</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {(isAddOpen || editingSession) && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-6">ANTRENMAN <span className="text-red-600">{editingSession ? 'DÜZENLE' : 'PLANLA'}</span></h3>
            
            <div className="space-y-5">
              <input 
                type="text" placeholder="Antrenman Adı" 
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-red-600 transition-colors"
                value={editingSession ? editingSession.title : newSession.title}
                onChange={e => editingSession ? setEditingSession({...editingSession, title: e.target.value}) : setNewSession({...newSession, title: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <select 
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:border-red-600"
                  value={editingSession ? editingSession.day : newSession.day}
                  onChange={e => editingSession ? setEditingSession({...editingSession, day: e.target.value}) : setNewSession({...newSession, day: e.target.value})}
                >
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select 
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:border-red-600"
                  value={editingSession ? editingSession.group : newSession.group}
                  onChange={e => editingSession ? setEditingSession({...editingSession, group: e.target.value}) : setNewSession({...newSession, group: e.target.value})}
                >
                  {availableGroups.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <input 
                type="text" placeholder="Saat (Örn: 17:00 - 18:30)" 
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-red-600"
                value={editingSession ? editingSession.time : newSession.time}
                onChange={e => editingSession ? setEditingSession({...editingSession, time: e.target.value}) : setNewSession({...newSession, time: e.target.value})}
              />
              <input 
                type="text" placeholder="Saha/Konum" 
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-red-600"
                value={editingSession ? editingSession.location : newSession.location}
                onChange={e => editingSession ? setEditingSession({...editingSession, location: e.target.value}) : setNewSession({...newSession, location: e.target.value})}
              />
              <button onClick={editingSession ? handleUpdate : handleAdd} className="w-full py-5 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all mt-4">
                {editingSession ? 'KAYDET' : 'PROGRAMA EKLE'}
              </button>
              <button onClick={() => {setIsAddOpen(false); setEditingSession(null)}} className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest">KAPAT</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
