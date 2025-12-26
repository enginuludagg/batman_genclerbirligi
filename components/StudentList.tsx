
import React, { useState, useEffect } from 'react';
import { 
  Search, UserPlus, PhoneCall, MoreVertical, 
  ChevronLeft, Save, Shield, User, GraduationCap, 
  Plus, Calendar, ChevronRight, Info, Trash2, CheckCircle2, AlertCircle
} from 'lucide-react';
import { Student, AppMode } from '../types';
import StudentDetail from './StudentDetail';

interface Props {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  mode?: AppMode;
  onModalStateChange?: (isOpen: boolean) => void;
}

type ViewState = 'list' | 'add' | 'detail';

export const ACADEMY_GROUPS = [
  'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'U17', 'U18', 'U19', 'KALECİ'
];

const StudentList: React.FC<Props> = ({ students, setStudents, mode, onModalStateChange }) => {
  const [viewState, setViewState] = useState<ViewState>('list');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [showPassive, setShowPassive] = useState(false);

  useEffect(() => {
    if (onModalStateChange) onModalStateChange(viewState !== 'list');
  }, [viewState, onModalStateChange]);

  const toggleStudentStatus = (id: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'passive' : 'active' } : s));
  };

  const deleteStudent = (id: string) => {
    if (confirm('Kayıt silinecek. Emin misiniz?')) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  const filtered = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = activeCategory === 'Tümü' || s.branchId === activeCategory;
    const matchesStatus = showPassive ? s.status === 'passive' : s.status === 'active';
    return matchesSearch && matchesCat && matchesStatus;
  });

  if (viewState === 'detail' && selectedStudent) {
    return (
      <div className="animate-in slide-in-from-right-10 duration-300">
        <button onClick={() => setViewState('list')} className="flex items-center gap-2 mb-6 text-zinc-500 font-black uppercase text-[10px] tracking-widest hover:text-black px-4"><ChevronLeft size={16} /> GERİ</button>
        <StudentDetail student={selectedStudent} onUpdate={(u) => { setStudents(prev => prev.map(s => s.id === u.id ? u : s)); setViewState('list'); }} onClose={() => setViewState('list')} />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 px-1 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase italic">SPORCU <span className="text-red-600">REHBERİ</span></h2>
          <p className="text-gray-400 font-bold uppercase text-[9px] tracking-widest mt-1">{showPassive ? 'Ödeme Bekleyenler' : 'Aktif Akademi Listesi'}</p>
        </div>
        {mode === 'admin' && (
          <div className="flex gap-2">
            <button onClick={() => setShowPassive(!showPassive)} className={`px-4 py-3 rounded-2xl text-[9px] font-black uppercase border-2 transition-all ${showPassive ? 'bg-orange-600 border-orange-600 text-white' : 'bg-white border-gray-100 text-gray-400'}`}>
              {showPassive ? 'AKTİF LİSTE' : 'ONAY BEKLEYENLER'}
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-3 px-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="İsim ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-11 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none w-full text-xs font-bold shadow-sm" />
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto no-scrollbar gap-1 w-full lg:w-auto mobile-snap">
          {['Tümü', ...ACADEMY_GROUPS].map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2.5 rounded-xl text-[9px] font-black transition-all whitespace-nowrap mobile-snap-item ${activeCategory === cat ? 'bg-zinc-900 text-white shadow-md' : 'text-gray-400'}`}>{cat}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4 px-2">
        {filtered.map((s) => (
          <div key={s.id} className={`bg-white p-4 rounded-[1.5rem] border border-gray-50 shadow-sm flex items-center justify-between hover:border-red-200 transition-all group ${s.status === 'passive' ? 'border-orange-200' : ''}`}>
            <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => { setSelectedStudent(s); setViewState('detail'); }}>
              <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-white text-[10px] font-black italic">{s.name[0]}</div>
              <div className="text-left overflow-hidden">
                <h4 className="font-black text-gray-900 text-xs uppercase truncate">{s.name}</h4>
                <p className="text-[8px] text-red-600 font-black uppercase truncate">{s.branchId} • {s.age} YAŞ</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
               {mode === 'admin' && (
                 <>
                   <button onClick={(e) => { e.stopPropagation(); toggleStudentStatus(s.id); }} className={`p-2 rounded-lg transition-colors ${s.status === 'active' ? 'text-gray-300 hover:text-orange-600' : 'text-orange-600 hover:text-green-600'}`} title={s.status === 'active' ? 'Pasife Al' : 'Onayla/Aktif Et'}>
                     {s.status === 'active' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                   </button>
                   <button onClick={(e) => { e.stopPropagation(); deleteStudent(s.id); }} className="p-2 text-gray-300 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                 </>
               )}
               <ChevronRight size={18} className="text-gray-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentList;
