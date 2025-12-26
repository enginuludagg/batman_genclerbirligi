
import React, { useState } from 'react';
import { GraduationCap, Phone, ShieldCheck, Plus, UserPlus, Star, MoreVertical, X } from 'lucide-react';
import { Trainer, AppMode } from '../types';

interface Props {
  trainers: Trainer[];
  setTrainers: React.Dispatch<React.SetStateAction<Trainer[]>>;
  mode?: AppMode;
}

const TrainerManager: React.FC<Props> = ({ trainers, setTrainers, mode }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTrainer, setNewTrainer] = useState<Partial<Trainer>>({
    name: '', specialty: 'Futbol Antrenörü', phone: '', groups: ['U11', 'U12']
  });

  const handleAdd = () => {
    if (!newTrainer.name) return;
    setTrainers([...trainers, { ...newTrainer as Trainer, id: Date.now().toString() }]);
    setIsAddOpen(false);
  };

  if (mode === 'parent') {
    return (
      <div className="bg-white p-12 rounded-[2.5rem] shadow-xl text-center">
        <GraduationCap size={64} className="mx-auto text-gray-200 mb-6" />
        <h2 className="text-2xl font-black uppercase italic">TEKNİK EKİBİMİZ</h2>
        <p className="text-gray-500 mt-2 font-bold italic">Batman Gençlerbirliği'nin lisanslı hocalarını buradan görebilirsiniz.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {trainers.map(t => (
                <div key={t.id} className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <h3 className="font-black uppercase">{t.name}</h3>
                    <p className="text-[10px] text-red-600 font-bold uppercase">{t.specialty}</p>
                </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">ANTRENÖR <span className="text-red-600">PANELİ</span></h2>
          <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mt-1">Teknik Ekip ve Branş Yönetimi</p>
        </div>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="bg-black text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black text-xs hover:bg-red-600 transition-all shadow-xl"
        >
          <UserPlus size={16} /> ANTRENÖR EKLE
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers.map(trainer => (
          <div key={trainer.id} className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden group hover:border-red-600 transition-all">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-white text-2xl font-black italic group-hover:bg-red-600 transition-colors">
                  {trainer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex gap-1 text-yellow-500 mb-1">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                  </div>
                  <span className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1">
                    <ShieldCheck size={12} /> AKTİF HOCA
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-black text-zinc-900 uppercase italic tracking-tighter mb-1">{trainer.name}</h3>
              <p className="text-[10px] text-red-600 font-black uppercase tracking-[0.2em] mb-6">{trainer.specialty}</p>

              <div className="space-y-4 pt-6 border-t border-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SORUMLU GRUPLAR</span>
                  <div className="flex gap-2">
                    {trainer.groups.map(g => (
                      <span key={g} className="bg-zinc-100 text-zinc-600 px-2 py-1 rounded text-[9px] font-black">{g}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">İLETİŞİM</span>
                  <a href={`tel:${trainer.phone}`} className="text-xs font-bold flex items-center gap-2 text-zinc-900 hover:text-red-600 transition-colors">
                    <Phone size={14} /> {trainer.phone}
                  </a>
                </div>
              </div>
            </div>
            
            <div className="px-8 py-4 bg-gray-50 flex justify-between items-center">
               <button className="text-[10px] font-black text-gray-400 hover:text-black uppercase tracking-widest">PROGRAMI DÜZENLE</button>
               <button className="text-gray-300 hover:text-red-600 transition-colors"><MoreVertical size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-6">YENİ <span className="text-red-600">ANTRENÖR</span></h3>
            <div className="space-y-4">
              <input 
                type="text" placeholder="Ad Soyad" 
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none"
                onChange={e => setNewTrainer({...newTrainer, name: e.target.value})}
              />
              <input 
                type="text" placeholder="Uzmanlık (Örn: Kaleci Hocası)" 
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none"
                onChange={e => setNewTrainer({...newTrainer, specialty: e.target.value})}
              />
              <input 
                type="text" placeholder="Telefon" 
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none"
                onChange={e => setNewTrainer({...newTrainer, phone: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4 pt-4">
                <button onClick={() => setIsAddOpen(false)} className="py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest">İPTAL</button>
                <button onClick={handleAdd} className="py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">EKLE</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerManager;
