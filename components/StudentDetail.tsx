
import React, { useState, useRef } from 'react';
import { 
  X, Phone, User, Activity, Trophy, GraduationCap, 
  Shield, ChevronRight, Save, Edit2, CheckCircle2,
  Droplets, Target, Calendar, UserPlus, School, Info,
  Zap, Dumbbell, Timer, Brain, LayoutTemplate, Mail, Lock, Upload,
  Medal, Star, Eye, History, Trash2, Plus, Check
} from 'lucide-react';
import { Student, Badge, ScoutingNote, AppMode } from '../types';
import { ACADEMY_GROUPS } from './StudentList';
import PlayerCard from './PlayerCard';

interface Props {
  student: Student;
  mode?: AppMode;
  onUpdate?: (updatedStudent: Student) => void;
  onClose: () => void;
}

const AVAILABLE_BADGES = [
  { name: 'Devamlılık Rozeti', icon: 'History', color: 'text-blue-600', bg: 'bg-blue-50' },
  { name: 'Rüzgarın Oğlu', icon: 'Zap', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { name: 'Centilmen Sporcu', icon: 'Shield', color: 'text-green-600', bg: 'bg-green-50' },
  { name: 'Altın Ayak', icon: 'Target', color: 'text-orange-600', bg: 'bg-orange-50' },
  { name: 'Takım Kaptanı', icon: 'Medal', color: 'text-red-600', bg: 'bg-red-50' }
];

const StudentDetail: React.FC<Props> = ({ student, mode, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'genel' | 'performans' | 'scouting' | 'basari'>('genel');
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Student>({ 
    ...student, 
    activeSports: student.activeSports || [student.sport],
    badges: student.badges || [],
    scoutingNotes: student.scoutingNotes || []
  });
  const [showPlayerCard, setShowPlayerCard] = useState(false);
  const [newScoutNote, setNewScoutNote] = useState('');
  const [scoutPotential, setScoutPotential] = useState(3);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    // Branş değişikliği yapıldıysa ilk branşı 'sport' (ana branş) olarak ata
    const finalData = {
      ...editedData,
      sport: editedData.activeSports[0] || 'Futbol'
    };
    if (onUpdate) onUpdate(finalData);
    setIsEditing(false);
  };

  const toggleSport = (sp: 'Futbol' | 'Voleybol' | 'Cimnastik') => {
    const current = editedData.activeSports || [editedData.sport];
    if (current.includes(sp)) {
      if (current.length === 1) return; // En az bir branş kalmalı
      setEditedData({ ...editedData, activeSports: current.filter(s => s !== sp) });
    } else {
      setEditedData({ ...editedData, activeSports: [...current, sp] });
    }
  };

  const addBadge = (badge: typeof AVAILABLE_BADGES[0]) => {
    if (editedData.badges.some(b => b.name === badge.name)) return;
    const newBadge: Badge = {
      id: Date.now().toString(),
      name: badge.name,
      icon: badge.icon,
      type: 'success',
      date: new Date().toLocaleDateString('tr-TR')
    };
    setEditedData({ ...editedData, badges: [...editedData.badges, newBadge] });
  };

  const removeBadge = (id: string) => {
    setEditedData({ ...editedData, badges: editedData.badges.filter(b => b.id !== id) });
  };

  const addScoutNote = () => {
    if (!newScoutNote.trim()) return;
    const note: ScoutingNote = {
      id: Date.now().toString(),
      content: newScoutNote,
      date: new Date().toLocaleDateString('tr-TR'),
      potential: scoutPotential,
      scoutName: 'Baş Antrenör'
    };
    setEditedData({ ...editedData, scoutingNotes: [note, ...editedData.scoutingNotes] });
    setNewScoutNote('');
  };

  const tabs = [
    { id: 'genel', label: 'BİLGİLER', icon: User },
    { id: 'performans', label: 'ANALİZ', icon: Activity },
    ...(mode === 'admin' ? [{ id: 'scouting', label: 'SCOUTING', icon: Eye }] : []),
    { id: 'basari', label: 'BAŞARILAR', icon: Medal }
  ];

  return (
    <div className="max-w-4xl mx-auto pb-32 space-y-6 px-2">
      <div className="bg-zinc-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative group">
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-zinc-900 rounded-[3rem] overflow-hidden border-4 border-zinc-800 shadow-2xl">
              {editedData.photoUrl ? <img src={editedData.photoUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-5xl font-black italic">{editedData.name[0]}</div>}
            </div>
            {mode === 'admin' && (
              <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/60 rounded-[3rem] opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all">
                <Upload size={24} /><span className="text-[8px] font-black mt-1">GÜNCELLE</span>
              </button>
            )}
            <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
               const file = e.target.files?.[0];
               if (file) {
                 const reader = new FileReader();
                 reader.onloadend = () => setEditedData({ ...editedData, photoUrl: reader.result as string });
                 reader.readAsDataURL(file);
               }
            }} />
          </div>
          <div className="text-center md:text-left flex-1">
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
              {editedData.badges.map(b => (
                <div key={b.id} className="bg-white/10 px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/5" title={b.name}>
                  <Medal size={12} className="text-yellow-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest">{b.name}</span>
                </div>
              ))}
            </div>
            <h2 className="text-3xl sm:text-5xl font-black italic uppercase tracking-tighter leading-none">{editedData.name}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
               {(editedData.activeSports || [editedData.sport]).map(sp => (
                 <span key={sp} className="bg-red-600 text-white px-4 py-2 rounded-full font-black text-[9px] uppercase tracking-widest flex items-center gap-2 border border-white/10 shadow-lg">
                   <Shield size={12} /> {sp}
                 </span>
               ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto no-scrollbar sticky top-4 z-20 gap-1">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-[9px] font-black uppercase rounded-xl transition-all px-4 ${activeTab === tab.id ? 'bg-zinc-950 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}>
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'genel' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
              
              {/* BRANŞ YÖNETİMİ - ÇOKLU BRANŞ DESTEĞİ */}
              {mode === 'admin' && (
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-[#E30613] uppercase tracking-widest italic">BRANŞ YÖNETİMİ (ÇOKLU SEÇİM)</p>
                  <div className="grid grid-cols-3 gap-3">
                    {['Futbol', 'Voleybol', 'Cimnastik'].map(sp => {
                      const isActive = (editedData.activeSports || []).includes(sp as any);
                      return (
                        <button 
                          key={sp} 
                          onClick={() => toggleSport(sp as any)}
                          className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${isActive ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                        >
                          {isActive ? <CheckCircle2 size={18} /> : <div className="w-[18px] h-[18px] rounded-full border border-gray-300" />}
                          <span className="text-[10px] font-black uppercase tracking-widest">{sp}</span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[8px] font-bold text-gray-400 uppercase italic">* Seçtiğiniz tüm branşların listesinde bu sporcu görünür.</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-50">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">KİŞİSEL VERİLER</p>
                  <div><label className="text-[9px] font-black text-gray-400 uppercase">VELİ ADI</label><p className="font-black text-zinc-900 text-sm italic">{editedData.parentName}</p></div>
                  <div><label className="text-[9px] font-black text-gray-400 uppercase">İLETİŞİM</label><p className="font-black text-zinc-900 text-sm italic">{editedData.parentPhone}</p></div>
                  <div><label className="text-[9px] font-black text-gray-400 uppercase">OKUL</label><p className="font-black text-zinc-900 text-sm italic">{editedData.schoolName || 'BATMAN MERKEZ OKULLARI'}</p></div>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">AKADEMİ DURUMU</p>
                  <div className={`p-4 rounded-2xl flex items-center justify-between ${editedData.feeStatus === 'Paid' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-[#E30613] animate-pulse'}`}>
                    <span className="text-[10px] font-black uppercase">AİDAT DURUMU</span>
                    <span className="text-xs font-black italic">{editedData.feeStatus === 'Paid' ? 'ÖDENDİ' : 'ÖDEME BEKLİYOR'}</span>
                  </div>
                  <div><label className="text-[9px] font-black text-gray-400 uppercase">GRUP</label><p className="font-black text-zinc-900 text-sm italic">{editedData.branchId}</p></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performans' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in zoom-in-95">
             {Object.entries(editedData.stats).map(([key, val]) => (
               <div key={key} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase">{key.toUpperCase()}</span>
                    <span className="text-xl font-black italic">{val}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-[#E30613] transition-all duration-1000" style={{width: `${val}%`}} /></div>
               </div>
             ))}
          </div>
        )}

        {activeTab === 'scouting' && mode === 'admin' && (
          <div className="space-y-6 animate-in fade-in">
             <div className="bg-zinc-900 text-white p-8 rounded-[2.5rem] shadow-xl">
                <h4 className="text-xs font-black uppercase italic tracking-widest mb-6 flex items-center gap-2">
                  <Eye className="text-[#E30613]" /> TEKNİK GÖZLEMCİ (SCOUT) RAPORU
                </h4>
                <div className="space-y-4">
                   <div className="flex items-center gap-4 mb-2">
                      <span className="text-[10px] font-black uppercase text-zinc-500">POTANSİYEL:</span>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} size={20} className={star <= scoutPotential ? 'text-yellow-500 fill-current' : 'text-zinc-700'} onClick={() => setScoutPotential(star)} />
                        ))}
                      </div>
                   </div>
                   <textarea 
                    value={newScoutNote} onChange={(e) => setNewScoutNote(e.target.value)}
                    placeholder="Profesyonel gelişim notu, transfer potansiyeli veya teknik eksiklikler..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-bold outline-none focus:border-[#E30613] h-32 resize-none"
                   />
                   <button onClick={addScoutNote} className="w-full py-4 bg-[#E30613] text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                     RAPORU ARŞİVE EKLE
                   </button>
                </div>
             </div>

             <div className="space-y-4">
                {editedData.scoutingNotes.map(note => (
                  <div key={note.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
                     <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-zinc-950 text-white rounded-lg"><User size={14} /></div>
                           <div><p className="text-[10px] font-black uppercase text-zinc-900">{note.scoutName}</p><p className="text-[8px] font-black text-gray-400 uppercase">{note.date}</p></div>
                        </div>
                        <div className="flex gap-0.5">
                           {[1,2,3,4,5].map(s => <Star key={s} size={10} className={s <= note.potential ? 'text-yellow-500 fill-current' : 'text-gray-200'} />)}
                        </div>
                     </div>
                     <p className="text-xs font-bold text-gray-600 italic leading-relaxed">"{note.content}"</p>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'basari' && (
          <div className="space-y-8 animate-in fade-in">
             {mode === 'admin' && (
               <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <h4 className="text-[10px] font-black uppercase italic tracking-widest text-zinc-400 mb-6 flex items-center gap-2"><Medal className="text-[#E30613]" /> ROZET ÖDÜL KÜTÜPHANESİ</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                     {AVAILABLE_BADGES.map(badge => {
                       const isOwned = editedData.badges.some(b => b.name === badge.name);
                       return (
                         <button 
                          key={badge.name} onClick={() => addBadge(badge)}
                          disabled={isOwned}
                          className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 text-center ${isOwned ? 'border-green-100 bg-green-50 opacity-50' : 'border-gray-50 bg-white hover:border-[#E30613]'}`}
                         >
                           <div className={`p-4 rounded-2xl ${badge.bg} ${badge.color}`}><Trophy size={24} /></div>
                           <span className="text-[9px] font-black uppercase tracking-tight">{badge.name}</span>
                           {isOwned && <span className="text-[7px] font-black text-green-600 flex items-center gap-1"><CheckCircle2 size={10} /> ELDE EDİLDİ</span>}
                         </button>
                       );
                     })}
                  </div>
               </div>
             )}

             <div className="bg-zinc-950 p-8 rounded-[2.5rem] shadow-2xl">
                <h4 className="text-[10px] font-black uppercase italic tracking-widest text-zinc-500 mb-6">SPORCUNUN ROZETLERİ</h4>
                <div className="flex flex-wrap gap-4">
                   {editedData.badges.length > 0 ? editedData.badges.map(b => (
                     <div key={b.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4 group">
                        <Medal className="text-yellow-500" size={20} />
                        <div><p className="text-white text-[10px] font-black uppercase tracking-widest leading-none">{b.name}</p><p className="text-[8px] font-black text-zinc-500 uppercase mt-1">{b.date}</p></div>
                        {mode === 'admin' && <button onClick={() => removeBadge(b.id)} className="p-2 text-zinc-700 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>}
                     </div>
                   )) : (
                     <p className="text-[10px] font-black text-zinc-600 uppercase italic">Henüz bir rozet kazanılmadı.</p>
                   )}
                </div>
             </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white/95 backdrop-blur-xl border-t border-gray-100 p-6 flex flex-col sm:flex-row gap-4 z-[100] shadow-2xl">
        <div className="flex-1 flex gap-2">
          <button onClick={onClose} className="flex-1 py-4 bg-zinc-100 text-zinc-900 rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all">GERİ DÖN</button>
          <button onClick={() => setShowPlayerCard(true)} className="flex-[2] py-4 bg-zinc-950 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-xl hover:bg-[#E30613] transition-all"><LayoutTemplate size={16} /> OYUNCU KARTI</button>
        </div>
        {mode === 'admin' && <button onClick={handleSave} className="flex-1 py-4 bg-[#E30613] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95"><Save size={18} /> TÜMÜNÜ KAYDET</button>}
      </div>

      {showPlayerCard && <PlayerCard student={student} onClose={() => setShowPlayerCard(false)} />}
    </div>
  );
};

export default StudentDetail;
