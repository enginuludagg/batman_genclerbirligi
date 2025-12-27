
import React, { useState, useRef } from 'react';
import { 
  X, Phone, User, Activity, Trophy, GraduationCap, 
  Shield, ChevronRight, Save, Edit2, CheckCircle2,
  Droplets, Target, Calendar, UserPlus, School, Info,
  Zap, Dumbbell, Timer, Brain, LayoutTemplate, Mail, Lock, Upload
} from 'lucide-react';
import { Student } from '../types';
import { ACADEMY_GROUPS } from './StudentList';
import PlayerCard from './PlayerCard';

interface Props {
  student: Student;
  onUpdate?: (updatedStudent: Student) => void;
  onClose: () => void;
}

const StudentDetail: React.FC<Props> = ({ student, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'genel' | 'performans' | 'maclar'>('genel');
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Student>({ ...student });
  const [showCriteria, setShowCriteria] = useState(false);
  const [showPlayerCard, setShowPlayerCard] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedData);
    }
    setIsEditing(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData({ ...editedData, photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateStat = (key: keyof Student['stats'], value: number) => {
    setEditedData({
      ...editedData,
      stats: {
        ...editedData.stats,
        [key]: value
      }
    });
  };

  const statsConfig = [
    { key: 'strength', label: 'GÜÇ', icon: Dumbbell, color: 'accent-red-600', desc: 'Şınav, Mekik ve İkili Mücadele' },
    { key: 'speed', label: 'HIZ', icon: Zap, color: 'accent-blue-600', desc: '20m Sprint ve Reaksiyon' },
    { key: 'stamina', label: 'DİRENÇ', icon: Timer, color: 'accent-green-600', desc: '1500m Koşu ve Devamlılık' },
    { key: 'technique', label: 'TEKNİK', icon: Brain, color: 'accent-yellow-500', desc: 'Top Kontrolü ve Pas Kalitesi' },
  ] as const;

  return (
    <div className="max-w-3xl mx-auto pb-32 space-y-6 px-2">
      
      {/* Profil Header */}
      <div className="bg-zinc-950 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex flex-col items-center text-center gap-4 sm:gap-6">
          <div 
            onClick={() => isEditing && fileInputRef.current?.click()}
            className={`w-24 h-24 sm:w-32 sm:h-32 bg-zinc-900 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden border-4 border-zinc-900 shadow-xl relative z-10 transition-all ${isEditing ? 'cursor-pointer hover:border-red-600 group' : ''}`}
          >
            {editedData.photoUrl ? (
              <img src={editedData.photoUrl} alt={editedData.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl sm:text-5xl font-black italic text-white/90">
                {editedData.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
            {isEditing && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
                <Upload size={24} className="text-white mb-1" />
                <span className="text-[8px] font-black uppercase">FOTO YÜKLE</span>
              </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
          </div>

          <div className="relative z-10 w-full">
            <span className="bg-red-600 text-[8px] sm:text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest italic mb-3 inline-block">AKADEMİ LİSANSLI</span>
            {isEditing ? (
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={editedData.name} 
                  onChange={e => setEditedData({...editedData, name: e.target.value})}
                  className="bg-zinc-900 border-2 border-red-600 rounded-xl px-4 py-3 text-lg sm:text-2xl font-black italic uppercase text-white w-full text-center outline-none"
                />
              </div>
            ) : (
              <>
                <h2 className="text-xl sm:text-4xl font-black italic uppercase tracking-tighter leading-none">{student.name}</h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-4 text-zinc-500 font-black uppercase text-[10px] sm:text-xs tracking-widest">
                  <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${student.gender === 'Kız' ? 'bg-pink-900/40 text-pink-500' : 'bg-blue-900/40 text-blue-500'}`}>
                    {student.gender === 'Kız' ? '♀ KIZ' : '♂ ERKEK'}
                  </span>
                  <span className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 rounded-full"><Shield size={14} className="text-red-600" /> {student.sport}</span>
                  <span className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 rounded-full"><Calendar size={14} className="text-red-600" /> {student.age} YAŞ</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Menü Sekmeleri */}
      <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto no-scrollbar sticky top-4 z-20 gap-1">
        {[
          { id: 'genel', label: 'BİLGİLER', icon: User },
          { id: 'performans', label: 'ANALİZ', icon: Activity },
          { id: 'maclar', label: 'SKORLAR', icon: Trophy }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all rounded-xl whitespace-nowrap px-4 ${
              activeTab === tab.id ? 'bg-zinc-900 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'
            }`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'genel' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2 italic"><UserPlus size={14} className="text-red-600" /> VELİ İLETİŞİM & ERİŞİM</p>
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase">VELİ ADI</label>
                  {isEditing ? (
                    <input type="text" value={editedData.parentName || ''} onChange={e => setEditedData({...editedData, parentName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-black outline-none focus:border-red-600" />
                  ) : (
                    <p className="font-black text-zinc-900 text-sm uppercase italic">{student.parentName || 'MEHMET YILMAZ'}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase">TELEFON</label>
                  {isEditing ? (
                    <input type="text" value={editedData.parentPhone || ''} onChange={e => setEditedData({...editedData, parentPhone: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-black outline-none focus:border-red-600" />
                  ) : (
                    <a href={`tel:${student.parentPhone}`} className="text-red-600 font-black text-sm italic flex items-center gap-2"><Phone size={14} /> {student.parentPhone}</a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performans' && (
          <div className="space-y-6 animate-in zoom-in-95 duration-500">
            <div className="grid grid-cols-1 gap-4">
              {statsConfig.map(stat => (
                <div key={stat.key} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-gray-50 rounded-xl text-zinc-900 group-hover:bg-red-600 group-hover:text-white transition-colors">
                        <stat.icon size={18} />
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-zinc-900 uppercase italic">{stat.label}</p>
                      </div>
                    </div>
                    <div className="text-2xl font-black italic text-zinc-900">
                      {isEditing ? editedData.stats[stat.key] : student.stats[stat.key]}
                    </div>
                  </div>
                  {isEditing ? (
                    <input type="range" min="0" max="100" value={editedData.stats[stat.key]} onChange={(e) => updateStat(stat.key, parseInt(e.target.value))} className={`w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer ${stat.color}`} />
                  ) : (
                    <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden border border-gray-100">
                      <div className={`h-full ${stat.color.replace('accent-', 'bg-')} transition-all duration-1000`} style={{width: `${student.stats[stat.key]}%`}} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white/95 backdrop-blur-xl border-t border-gray-100 p-4 sm:p-6 flex flex-col sm:flex-row gap-3 sm:gap-4 z-[100] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        {isEditing ? (
           <>
            <button onClick={() => { setIsEditing(false); setEditedData({...student}); }} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase text-[10px] tracking-widest">VAZGEÇ</button>
            <button onClick={handleSave} className="flex-[2] py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-xl"><Save size={18} /> KAYDET</button>
           </>
        ) : (
          <>
            <div className="flex gap-2 w-full">
                <button onClick={onClose} className="flex-1 py-4 bg-zinc-100 text-zinc-900 rounded-2xl font-black uppercase text-[10px] tracking-widest">GERİ</button>
                <button onClick={() => setShowPlayerCard(true)} className="flex-[2] py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"><LayoutTemplate size={16} /> OYUNCU KARTI</button>
            </div>
            <button onClick={() => setIsEditing(true)} className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2"><Edit2 size={16} /> BİLGİLERİ DÜZENLE</button>
          </>
        )}
      </div>

      {showPlayerCard && <PlayerCard student={student} onClose={() => setShowPlayerCard(false)} />}
    </div>
  );
};

export default StudentDetail;
