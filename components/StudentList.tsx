
import React, { useState, useEffect } from 'react';
import { 
  Search, UserPlus, ChevronLeft, Save, Plus, ChevronRight, Trash2, CheckCircle2, AlertCircle, X, Upload
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
  'TÜM GRUPLAR', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'U17', 'U18', 'U19', 'KALECİ', 'MİNİKLER'
];

const StudentList: React.FC<Props> = ({ students, setStudents, mode, onModalStateChange }) => {
  const [viewState, setViewState] = useState<ViewState>('list');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('TÜM GRUPLAR');
  const [activeSport, setActiveSport] = useState<'Hepsi' | 'Futbol' | 'Voleybol' | 'Cimnastik'>('Hepsi');
  const [showPassive, setShowPassive] = useState(false);
  
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: '', sport: 'Futbol', branchId: 'U12', gender: 'Erkek', level: 'Başlangıç', status: 'active', attendance: 100, photoUrl: '',
    stats: { strength: 50, speed: 50, stamina: 50, technique: 50 }
  });

  useEffect(() => {
    if (onModalStateChange) onModalStateChange(viewState !== 'list');
  }, [viewState, onModalStateChange]);

  const toggleStudentStatus = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'passive' : 'active' } : s));
  };

  const deleteStudent = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Bu sporcu kaydını kalıcı olarak silmek istediğinize emin misiniz?')) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleAddStudent = () => {
    if (!newStudent.name) return;
    const student: Student = {
      ...newStudent as Student,
      id: Date.now().toString(),
      lastTraining: 'Yeni Kayıt',
      feeStatus: 'Pending',
      password: '123456'
    };
    setStudents(prev => [...prev, student]);
    setViewState('list');
    setNewStudent({ name: '', sport: 'Futbol', branchId: 'U12', gender: 'Erkek', level: 'Başlangıç', status: 'active', attendance: 100, photoUrl: '', stats: { strength: 50, speed: 50, stamina: 50, technique: 50 } });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewStudent(prev => ({ ...prev, photoUrl: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const filtered = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = activeCategory === 'TÜM GRUPLAR' || s.branchId === activeCategory;
    const matchesSport = activeSport === 'Hepsi' || s.sport === activeSport;
    const matchesStatus = showPassive ? s.status === 'passive' : s.status === 'active';
    return matchesSearch && matchesCat && matchesSport && matchesStatus;
  });

  const getSportColor = (sport: string) => {
    switch(sport) {
      case 'Futbol': return 'bg-blue-600';
      case 'Voleybol': return 'bg-orange-500';
      case 'Cimnastik': return 'bg-fuchsia-600';
      default: return 'bg-zinc-900';
    }
  };

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
          <p className="text-gray-400 font-bold uppercase text-[9px] tracking-widest mt-1">Akademi Branş ve Cinsiyet Yönetimi</p>
        </div>
        {mode === 'admin' && (
          <div className="flex gap-2">
            <button onClick={() => setViewState('add')} className="bg-black text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black text-xs hover:bg-red-600 transition-all shadow-xl active:scale-95"><Plus size={18} /> SPORCU EKLE</button>
            <button onClick={() => setShowPassive(!showPassive)} className={`px-4 py-3 rounded-2xl text-[9px] font-black uppercase border-2 transition-all ${showPassive ? 'bg-orange-600 border-orange-600 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400'}`}>{showPassive ? 'ONAY BEKLEYENLER' : 'AKTİF LİSTE'}</button>
          </div>
        )}
      </div>

      <div className="space-y-4 px-2">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="İsim ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-11 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none w-full text-xs font-bold shadow-sm" />
          </div>
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto no-scrollbar gap-1 mobile-snap">
            {['Hepsi', 'Futbol', 'Voleybol', 'Cimnastik'].map(sport => (
              <button key={sport} onClick={() => setActiveSport(sport as any)} className={`px-5 py-2.5 rounded-xl text-[9px] font-black transition-all whitespace-nowrap mobile-snap-item ${activeSport === sport ? 'bg-red-600 text-white shadow-md' : 'text-gray-400'}`}>{sport.toUpperCase()}</button>
            ))}
          </div>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto no-scrollbar gap-1 w-full mobile-snap">
          {ACADEMY_GROUPS.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2.5 rounded-xl text-[9px] font-black transition-all whitespace-nowrap mobile-snap-item ${activeCategory === cat ? 'bg-zinc-900 text-white shadow-md' : 'text-gray-400'}`}>{cat}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4 px-2">
        {filtered.map((s) => (
          <div key={s.id} onClick={() => { setSelectedStudent(s); setViewState('detail'); }} className="bg-white p-4 rounded-[1.5rem] border border-gray-50 shadow-sm flex items-center justify-between hover:border-red-200 transition-all group relative overflow-hidden cursor-pointer">
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getSportColor(s.sport)}`}></div>
            <div className="flex items-center gap-3 overflow-hidden pl-2">
              <div className={`w-12 h-12 ${getSportColor(s.sport)} rounded-2xl flex items-center justify-center text-white text-[10px] font-black italic relative overflow-hidden shadow-sm`}>
                {s.photoUrl ? <img src={s.photoUrl} className="w-full h-full object-cover" /> : s.name[0]}
              </div>
              <div className="text-left overflow-hidden">
                <h4 className="font-black text-gray-900 text-xs uppercase truncate">{s.name}</h4>
                <p className="text-[8px] font-black uppercase truncate flex items-center gap-1.5">
                  <span className={s.gender === 'Kız' ? 'text-pink-600' : 'text-blue-600'}>{s.gender}</span>
                  <span className="text-zinc-500">{s.sport}</span>
                  <span className="text-red-600">{s.branchId}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 relative z-10">
               {mode === 'admin' && (
                 <>
                   <button onClick={(e) => toggleStudentStatus(e, s.id)} className={`p-2 transition-colors ${s.status === 'active' ? 'text-gray-300 hover:text-orange-600' : 'text-orange-600 hover:text-green-600'}`} title={s.status === 'active' ? 'Pasife Al' : 'Aktif Et'}>
                     {s.status === 'active' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                   </button>
                   <button onClick={(e) => deleteStudent(e, s.id)} className="p-2 text-gray-300 hover:text-red-600" title="Sil">
                     <Trash2 size={18} />
                   </button>
                 </>
               )}
               <ChevronRight size={18} className="text-gray-300" />
            </div>
          </div>
        ))}
      </div>

      {viewState === 'add' && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative animate-in zoom-in-95">
            <button onClick={() => setViewState('list')} className="absolute top-6 right-6 text-gray-400 hover:text-black"><X size={24} /></button>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-6">YENİ <span className="text-red-600">SPORCU EKLE</span></h3>
            <div className="space-y-4">
              <div className="flex flex-col items-center mb-6">
                 <div onClick={() => document.getElementById('new-photo-up')?.click()} className="w-24 h-24 bg-gray-50 rounded-[1.5rem] border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer overflow-hidden relative group">
                    {newStudent.photoUrl ? <img src={newStudent.photoUrl} className="w-full h-full object-cover" /> : <Upload size={24} className="text-gray-300" />}
                 </div>
                 <input type="file" id="new-photo-up" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                 <p className="text-[9px] font-black text-gray-400 uppercase mt-2">Profil Fotoğrafı</p>
              </div>
              <input type="text" placeholder="Sporcu Ad Soyad" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-red-600" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase outline-none" value={newStudent.sport} onChange={e => setNewStudent({...newStudent, sport: e.target.value as any})}>
                  <option value="Futbol">FUTBOL</option><option value="Voleybol">VOLEYBOL</option><option value="Cimnastik">CİMNASTİK</option>
                </select>
                <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase outline-none" value={newStudent.branchId} onChange={e => setNewStudent({...newStudent, branchId: e.target.value})}>
                  {ACADEMY_GROUPS.filter(g => g !== 'TÜM GRUPLAR').map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <button onClick={handleAddStudent} className="w-full py-5 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-red-600 active:scale-95 transition-all mt-4">KAYDI TAMAMLA</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
