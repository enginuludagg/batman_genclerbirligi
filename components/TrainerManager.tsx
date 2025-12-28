
import React, { useState, useRef, useEffect } from 'react';
import { Phone, ShieldCheck, UserPlus, Star, X, Save, Edit3, Trash2, Upload, Hash, GraduationCap, Users } from 'lucide-react';
import { Trainer, AppMode } from '../types';

interface Props {
  trainers: Trainer[];
  setTrainers: React.Dispatch<React.SetStateAction<Trainer[]>>;
  mode?: AppMode;
}

const TrainerManager: React.FC<Props> = ({ trainers, setTrainers, mode }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [newTrainer, setNewTrainer] = useState<Partial<Trainer>>({ 
    name: '', 
    specialty: 'Futbol Antrenörü', 
    phone: '', 
    groups: ['U11'], 
    photoUrl: '',
    biography: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if ((isAddOpen || editingTrainer) && firstInputRef.current) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isAddOpen, editingTrainer]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (editingTrainer) setEditingTrainer({...editingTrainer, photoUrl: base64});
        else setNewTrainer({...newTrainer, photoUrl: base64});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    if (!newTrainer.name) return;
    setTrainers([...trainers, { ...newTrainer as Trainer, id: Date.now().toString() }]);
    setIsAddOpen(false);
    setNewTrainer({ name: '', specialty: 'Futbol Antrenörü', phone: '', groups: ['U11'], photoUrl: '', biography: '' });
  };

  const handleUpdate = () => {
    if (!editingTrainer || !editingTrainer.name) return;
    setTrainers(prev => prev.map(t => t.id === editingTrainer.id ? editingTrainer : t));
    setEditingTrainer(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-2">
        <div>
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">TEKNİK <span className="text-red-600">EKİP</span></h2>
          <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mt-2 italic">Antrenör ve Branş Yönetimi</p>
        </div>
        {mode === 'admin' && (
          <button 
            onClick={() => setIsAddOpen(true)} 
            className="bg-zinc-950 text-white px-8 py-4 rounded-[2rem] flex items-center gap-2 font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl active:scale-95"
          >
            <UserPlus size={18} /> HOCA EKLE
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
        {trainers.map(trainer => (
          <div key={trainer.id} className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden group hover:border-red-600 transition-all flex flex-col h-full animate-in fade-in">
            <div className="p-8 flex-1">
              <div className="flex justify-between items-start mb-6">
                <div className="w-20 h-20 bg-zinc-950 rounded-[1.5rem] flex items-center justify-center text-white text-3xl font-black italic overflow-hidden shadow-lg border-2 border-zinc-900">
                  {trainer.photoUrl ? <img src={trainer.photoUrl} className="w-full h-full object-cover" alt={trainer.name} /> : trainer.name[0]}
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex gap-1 text-yellow-500 mb-1">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                  </div>
                  <span className="text-[10px] font-black text-green-600 uppercase tracking-widest italic flex items-center gap-1">
                    <ShieldCheck size={12} /> AKTİF BGB HOCASI
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-black text-zinc-900 uppercase italic tracking-tighter mb-1 truncate">{trainer.name}</h3>
              <p className="text-[10px] text-red-600 font-black uppercase tracking-[0.2em] mb-6 italic">{trainer.specialty}</p>
              
              <div className="space-y-4 pt-6 border-t border-gray-50">
                <p className="text-[9px] font-bold text-gray-500 italic line-clamp-3">{trainer.biography || "Özgeçmiş bilgisi girilmemiş."}</p>
                <div className="flex items-center justify-between font-black text-[9px] text-gray-400 uppercase">
                  <span>SORUMLU GRUPLAR</span>
                  <div className="flex flex-wrap gap-1 justify-end max-w-[150px]">
                    {trainer.groups.map(g => (
                      <span key={g} className="bg-zinc-100 text-zinc-600 px-2 py-1 rounded text-[8px] whitespace-nowrap">{g}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {mode === 'admin' && (
              <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                 <button 
                  onClick={() => setEditingTrainer(trainer)} 
                  className="text-[10px] font-black text-slate-500 hover:text-red-600 uppercase flex items-center gap-2 transition-colors"
                 >
                   <Edit3 size={16} /> DÜZENLE
                 </button>
                 <button 
                  onClick={() => { if(window.confirm('Emin misiniz?')) setTrainers(prev => prev.filter(t => t.id !== trainer.id)) }} 
                  className="text-gray-300 hover:text-red-600 transition-all p-2"
                 >
                   <Trash2 size={18} />
                 </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {(isAddOpen || editingTrainer) && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-8 sm:p-12 shadow-2xl animate-in zoom-in-95 my-auto">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">
                HOCA <span className="text-red-600">{editingTrainer ? 'DÜZENLE' : 'EKLE'}</span>
              </h3>
              <button onClick={() => { setIsAddOpen(false); setEditingTrainer(null); }} className="text-gray-400 hover:text-black transition-colors"><X size={28} /></button>
            </div>
            
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                 <div onClick={() => fileInputRef.current?.click()} className="w-28 h-28 bg-gray-50 rounded-[2.5rem] border-4 border-dashed border-gray-100 flex items-center justify-center cursor-pointer overflow-hidden relative group hover:border-red-600 transition-all">
                    {(editingTrainer?.photoUrl || newTrainer.photoUrl) ? (
                      <img src={editingTrainer?.photoUrl || newTrainer.photoUrl} className="w-full h-full object-cover" alt="Hoca" />
                    ) : (
                      <Upload size={32} className="text-gray-300 group-hover:text-red-600" />
                    )}
                 </div>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                 <p className="text-[9px] font-black text-gray-400 uppercase mt-3 tracking-widest">Antrenör Fotoğrafı</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">ANTRENÖR AD SOYAD</label>
                  <input 
                    ref={firstInputRef}
                    type="text" 
                    placeholder="Ad Soyad giriniz..." 
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-red-600 focus:bg-white transition-all shadow-sm" 
                    value={editingTrainer ? editingTrainer.name : newTrainer.name} 
                    onChange={e => editingTrainer ? setEditingTrainer({...editingTrainer, name: e.target.value}) : setNewTrainer({...newTrainer, name: e.target.value})} 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">UZMANLIK ALANI</label>
                    <input 
                      type="text" 
                      placeholder="Örn: Kaleci Antrenörü" 
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-red-600 focus:bg-white transition-all shadow-sm" 
                      value={editingTrainer ? editingTrainer.specialty : newTrainer.specialty} 
                      onChange={e => editingTrainer ? setEditingTrainer({...editingTrainer, specialty: e.target.value}) : setNewTrainer({...newTrainer, specialty: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">TELEFON</label>
                    <input 
                      type="tel" 
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-red-600" 
                      value={editingTrainer ? editingTrainer.phone : newTrainer.phone} 
                      onChange={e => editingTrainer ? setEditingTrainer({...editingTrainer, phone: e.target.value}) : setNewTrainer({...newTrainer, phone: e.target.value})} 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">KISA ÖZGEÇMİŞ</label>
                  <textarea 
                    placeholder="Eğitim, kariyer ve başarı notları..." 
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold outline-none h-24 resize-none focus:border-red-600 shadow-inner"
                    value={editingTrainer ? editingTrainer.biography : newTrainer.biography}
                    onChange={e => editingTrainer ? setEditingTrainer({...editingTrainer, biography: e.target.value}) : setNewTrainer({...newTrainer, biography: e.target.value})}
                  />
                </div>
              </div>

              <button 
                onClick={editingTrainer ? handleUpdate : handleAdd} 
                className="w-full py-5 bg-zinc-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-red-600 transition-all active:scale-95 flex items-center justify-center gap-3 mt-4"
              >
                <Save size={18} /> {editingTrainer ? 'DEĞİŞİKLİKLERİ KAYDET' : 'ANTRENÖRÜ EKLE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerManager;
