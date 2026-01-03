import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, UserPlus, ChevronLeft, Save, Plus, ChevronRight, Trash2, CheckCircle2, AlertCircle, X, Upload, Hash, Check, Calendar
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
  const [isOptimizing, setIsOptimizing] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);
  
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: '', sport: 'Futbol', activeSports: ['Futbol'], branchId: 'U12', gender: 'Erkek', level: 'Başlangıç', status: 'active', attendance: 100, photoUrl: '',
    stats: { strength: 50, speed: 50, stamina: 50, technique: 50 },
    jerseyNumber: undefined,
    registrationDate: new Date().toISOString().split('T')[0],
    age: 10 // Varsayılan yaş
  });

  useEffect(() => {
    if (onModalStateChange) onModalStateChange(viewState !== 'list');
    if (viewState === 'add' && firstInputRef.current) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [viewState, onModalStateChange]);

  const optimizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 600; 
          let width = img.width;
          let height = img.height;
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if(ctx) {
             ctx.drawImage(img, 0, 0, width, height);
             resolve(canvas.toDataURL('image/jpeg', 0.50));
          } else { reject("Canvas error"); }
        };
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleOpenAdd = () => {
    const defaultSport = activeSport === 'Hepsi' ? 'Futbol' : activeSport;
    setNewStudent(prev => ({ 
      ...prev, 
      sport: defaultSport as any,
      activeSports: [defaultSport as any],
      registrationDate: new Date().toISOString().split('T')[0]
    }));
    setViewState('add');
  };

  const handleAddStudent = () => {
    if (!newStudent.name) return;
    const student: Student = {
      ...newStudent as Student,
      id: Date.now().toString(),
      activeSports: newStudent.activeSports || [newStudent.sport as any],
      lastTraining: 'Yeni Kayıt',
      feeStatus: 'Pending',
      password: '123456',
      badges: [],
      scoutingNotes: [],
      age: newStudent.age || 10,
      registrationDate: newStudent.registrationDate || new Date().toISOString().split('T')[0]
    };
    setStudents(prev => [...prev, student]);
    setViewState('list');
    setNewStudent({ name: '', sport: 'Futbol', activeSports: ['Futbol'], branchId: 'U12', gender: 'Erkek', level: 'Başlangıç', status: 'active', attendance: 100, photoUrl: '', stats: { strength: 50, speed: 50, stamina: 50, technique: 50 }, jerseyNumber: undefined, age: 10 });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsOptimizing(true);
      try {
        const optimized = await optimizeImage(file);
        setNewStudent(prev => ({ ...prev, photoUrl: optimized }));
      } catch (err) { alert("Resim yüklenirken hata oluştu."); } finally { setIsOptimizing(false); }
    }
  };

  const filtered = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = activeCategory === 'TÜM GRUPLAR' || s.branchId === activeCategory;
    const studentSports = s.activeSports || [s.sport];
    const matchesSport = activeSport === 'Hepsi' || studentSports.includes(activeSport as any);
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
        <StudentDetail mode={mode} student={selectedStudent} onUpdate={(u) => { setStudents(prev => prev.map(s => s.id === u.id ? u : s)); setViewState('list'); }} onClose={() => setViewState('list')} />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 px-1 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase italic">SPORCU <span className="text-red-600">REHBERİ</span></h2>
          <p className="text-gray-400 font-bold uppercase text-[9px] tracking-widest mt-1">Akademi Branş ve Cinsiyet Yönetimi</p>
        </div>
        {mode === 'admin' && (
          <div className="flex gap-2">
            <button onClick={handleOpenAdd} className="bg-black text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black text-xs hover:bg-red-600 transition-all shadow-xl active:scale-95"><Plus size={18} /> SPORCU EKLE</button>
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4 px-2">
        {filtered.map((s) => {
          const sports = s.activeSports || [s.sport];
          return (
            <div key={s.id} onClick={() => { setSelectedStudent(s); setViewState('detail'); }} className="bg-white p-4 rounded-[1.5rem] border border-gray-50 shadow-sm flex items-center justify-between hover:border-red-200 transition-all group relative overflow-hidden cursor-pointer">
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getSportColor(sports[0])}`}></div>
              <div className="flex items-center gap-3 overflow-hidden pl-2">
                <div className={`w-12 h-12 ${getSportColor(sports[0])} rounded-2xl flex items-center justify-center text-white text-[10px] font-black italic relative overflow-hidden shadow-sm`}>
                  {s.photoUrl ? <img src={s.photoUrl} className="w-full h-full object-cover" /> : s.name[0]}
                </div>
                <div className="text-left overflow-hidden">
                  <h4 className="font-black text-gray-900 text-xs uppercase truncate">{s.name}</h4>
                  <span className="text-[8px] font-black text-red-600 uppercase">{s.branchId}</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </div>
          );
        })}
      </div>

      {viewState === 'add' && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-8 sm:p-12 shadow-2xl relative animate-in zoom-in-95 my-auto max-h-[90vh] overflow-y-auto no-scrollbar">
            <button onClick={() => setViewState('list')} className="absolute top-6 right-6 text-gray-400 hover:text-black"><X size={28} /></button>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8">YENİ <span className="text-red-600">SPORCU EKLE</span></h3>
            
            <div className="space-y-6 pb-8">
              <div className="flex flex-col items-center">
                 <div onClick={() => !isOptimizing && document.getElementById('new-photo-up')?.click()} className={`w-28 h-28 bg-gray-50 rounded-[2.5rem] border-4 border-dashed border-gray-100 flex items-center justify-center cursor-pointer overflow-hidden relative group hover:border-red-600 transition-all ${isOptimizing ? 'opacity-50' : ''}`}>
                    {newStudent.photoUrl ? <img src={newStudent.photoUrl} className="w-full h-full object-cover" /> : <Upload size={32} className={`text-gray-300 ${isOptimizing ? 'animate-bounce' : ''}`} />}
                 </div>
                 <input type="file" id="new-photo-up" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                 <p className="text-[9px] font-black text-gray-400 uppercase mt-3">{isOptimizing ? 'İŞLENİYOR...' : 'PROFİL FOTOĞRAFI'}</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-3">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">SPORCU AD SOYAD</label>
                    <input ref={firstInputRef} type="text" placeholder="Ad Soyad" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-red-600" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">NO</label>
                    <input type="number" placeholder="99" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-red-600" value={newStudent.jerseyNumber || ''} onChange={e => setNewStudent({...newStudent, jerseyNumber: parseInt(e.target.value) || undefined})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">GRUP</label>
                    <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase outline-none focus:border-red-600" value={newStudent.branchId} onChange={e => setNewStudent({...newStudent, branchId: e.target.value})}>
                      {ACADEMY_GROUPS.filter(g => g !== 'TÜM GRUPLAR').map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                   <div>
                   <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">KAYIT TARİHİ</label>
                   <input type="date" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-red-600" value={newStudent.registrationDate} onChange={e => setNewStudent({...newStudent, registrationDate: e.target.value})} />
                </div>
                </div>
              </div>

              <button onClick={handleAddStudent} disabled={isOptimizing} className="w-full py-5 bg-zinc-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-red-600 active:scale-95 transition-all mt-4 mb-4">
                KAYDI TAMAMLA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;