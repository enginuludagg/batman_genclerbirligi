
import React, { useState } from 'react';
import { UserCheck, Check, X, Users, Calendar, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Student, AppMode } from '../types';

interface Props {
  students: Student[];
  sessions: any[];
  mode?: AppMode;
  onSaveAttendance?: (presentIds: string[], absentIds: string[], sessionName: string) => void;
}

const Attendance: React.FC<Props> = ({ students, sessions, mode, onSaveAttendance }) => {
  const [selectedSession, setSelectedSession] = useState(sessions[0]?.id);
  const [presents, setPresents] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const activeSession = sessions.find(s => s.id === selectedSession);

  const toggleAttendance = (id: string) => {
    if (mode === 'parent') return;
    setPresents(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    
    // Simüle gecikme (Gerçekçi bir his için)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const absentIds = students
      .filter(s => !presents.includes(s.id))
      .map(s => s.id);

    if (onSaveAttendance) {
      onSaveAttendance(presents, absentIds, activeSession?.title || 'Genel Antrenman');
    }

    setIsSaving(false);
    setShowSuccess(true);
    
    // 3 saniye sonra başarı mesajını kapat
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (mode === 'parent') return <div className="p-8 bg-white rounded-3xl text-center font-bold uppercase italic shadow-xl">Yalnızca Admin Yetkisiyle Erişilebilir.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">ANINDA <span className="text-red-600">YOKLAMA</span></h2>
          <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mt-1">Antrenman Katılım Listesi</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto no-scrollbar w-full md:w-auto">
           {sessions.map(s => (
             <button 
               key={s.id} 
               onClick={() => {
                 setSelectedSession(s.id);
                 setPresents([]); // Grup değişince temizle
               }}
               className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${selectedSession === s.id ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-600'}`}
             >
               {s.group} - {s.title}
             </button>
           ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 relative overflow-hidden">
        {/* Başarı Overlay */}
        {showSuccess && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={48} className="animate-bounce" />
            </div>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-zinc-900">YOKLAMA KAYDEDİLDİ</h3>
            <p className="text-xs font-bold text-gray-500 mt-2 uppercase tracking-widest text-center px-8">
              Gelmeyen {students.length - presents.length} sporcu için velilere bildirim gönderildi.
            </p>
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center gap-6 mb-8 pb-8 border-b border-gray-50">
           <div className="flex-1 text-center md:text-left">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">KATILIM DURUMU</p>
             <div className="flex items-center justify-center md:justify-start gap-2">
               <span className="text-4xl font-black text-zinc-900">{presents.length}</span>
               <span className="text-gray-300 font-black text-2xl">/</span>
               <span className="text-2xl font-black text-gray-400">{students.length}</span>
               <span className="ml-2 text-[10px] font-black bg-gray-100 px-3 py-1 rounded-full text-zinc-500 uppercase italic">
                 %{Math.round((presents.length / students.length) * 100) || 0} VERİM
               </span>
             </div>
           </div>
           
           <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full md:w-auto px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-3 ${
              isSaving ? 'bg-zinc-400 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-black shadow-red-900/20 active:scale-95'
            }`}
           >
             {isSaving ? (
               <><Loader2 size={18} className="animate-spin" /> İŞLENİYOR...</>
             ) : (
               <><UserCheck size={18} /> YOKLAMAYI KAYDET</>
             )}
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map(student => (
            <button 
              key={student.id}
              onClick={() => toggleAttendance(student.id)}
              className={`flex items-center justify-between p-5 rounded-3xl border-2 transition-all group ${
                presents.includes(student.id) 
                  ? 'border-green-500 bg-green-50/20' 
                  : 'border-gray-100 bg-gray-50/50 grayscale hover:grayscale-0'
              }`}
            >
              <div className="flex items-center gap-4 text-left">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm relative transition-all ${
                  presents.includes(student.id) ? 'bg-green-600 text-white rotate-3 shadow-lg' : 'bg-zinc-800 text-white'
                }`}>
                  {student.name.split(' ').map(n => n[0]).join('')}
                  {presents.includes(student.id) && (
                    <div className="absolute -top-1 -right-1 bg-white text-green-600 rounded-full p-0.5 shadow-sm border border-green-200">
                      <Check size={10} strokeWidth={4} />
                    </div>
                  )}
                </div>
                <div>
                  <span className={`text-sm font-black uppercase tracking-tight block ${presents.includes(student.id) ? 'text-green-700' : 'text-zinc-900 opacity-60'}`}>
                    {student.name}
                  </span>
                  <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">{student.sport}</span>
                </div>
              </div>
              
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                presents.includes(student.id) ? 'bg-green-100 text-green-600' : 'bg-white border border-gray-200 text-gray-300 group-hover:text-red-400'
              }`}>
                {presents.includes(student.id) ? <Check size={16} strokeWidth={3} /> : <AlertCircle size={16} />}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
