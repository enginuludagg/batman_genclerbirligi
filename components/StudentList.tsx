
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, UserPlus, ChevronLeft, Save, Plus, ChevronRight, Trash2, CheckCircle2, AlertCircle, X, Upload, Hash, Check
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
  const firstInputRef = useRef<HTMLInputElement>(null);
  
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: '', sport: 'Futbol', activeSports: ['Futbol'], branchId: 'U12', gender: 'Erkek', level: 'Başlangıç', status: 'active', attendance: 100, photoUrl: '',
    stats: { strength: 50, speed: 50, stamina: 50, technique: 50 },
    jerseyNumber: undefined
  });

  useEffect(() => {
    if (onModalStateChange) onModalStateChange(viewState !== 'list');
    if (viewState === 'add' && firstInputRef.current) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [viewState, onModalStateChange]);

  const handleOpenAdd = () => {
    const defaultSport = activeSport === 'Hepsi' ? 'Futbol' : activeSport;
    setNewStudent(prev => ({ 
      ...prev, 
      sport: defaultSport as any,
      activeSports: [defaultSport as any] 
    }));
    setViewState('add');
  };

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
      activeSports: newStudent.activeSports || [newStudent.sport as any],
      lastTraining: 'Yeni Kayıt',
      feeStatus: 'Pending',
      password: '123456',
      badges: [],
      scoutingNotes: []
    };
    setStudents(prev => [...prev, student]);
    setViewState('list');
    setNewStudent({ name: '', sport: 'Futbol', activeSports: ['Futbol'], branchId: 'U12', gender: 'Erkek', level: 'Başlangıç', status: 'active', attendance: 100, photoUrl: '', stats: { strength: 50, speed: 50, stamina: 50, technique: 50 }, jerseyNumber: undefined });
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
    
    // Çoklu branş kontrolü
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
        {filtered.map((s) => {
          // Çoklu branşları listele
          const sports = s.activeSports || [s.sport];
          return (
            <div key={s.id} onClick={() => { setSelectedStudent(s); setViewState('detail'); }} className="bg-white p-4 rounded-[1.5rem] border border-gray-50 shadow-sm flex items-center justify-between hover:border-red-200 transition-all group relative overflow-hidden cursor-pointer">
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getSportColor(sports[0])}`}></div>
              <div className="flex items-center gap-3 overflow-hidden pl-2">
                <div className={`w-12 h-12 ${getSportColor(sports[0])} rounded-2xl flex items-center justify-center text-white text-[10px] font-black italic relative overflow-hidden shadow-sm`}>
                  {s.photoUrl ? <img src={s.photoUrl} className="w-full h-full object-cover" /> : s.name[0]}
                  {s.jerseyNumber && <div className="absolute bottom-0 right-0 bg-zinc-950 text-white text-[7px] px-1 rounded-tl-md font-bold">#{s.jerseyNumber}</div>}
                </div>
                <div className="text-left overflow-hidden">
                  <h4 className="font-black text-gray-900 text-xs uppercase truncate">{s.name}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[8px] font-black uppercase ${s.gender === 'Kız' ? 'text-pink-600' : 'text-blue-600'}`}>{s.gender}</span>
                    <div className="flex gap-1">
                       {sports.map(sp => (
                         <span key={sp} className={`text-[7px] font-black text-white px-1.5 py-0.5 rounded uppercase ${getSportColor(sp)}`}>{sp[0]}</span>
                       ))}
                    </div>
                    <span className="text-[8px] font-black text-red-600 uppercase">{s.branchId}</span>
                  </div>
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
          );
        })}
      </div>

      {viewState === 'add' && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-8 sm:p-12 shadow-2xl relative animate-in zoom-in-95 my-auto">
            <button onClick={() => setViewState('list')} className="absolute top-6 right-6 text-gray-400 hover:text-black"><X size={28} /></button>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8">YENİ <span className="text-red-600">SPORCU EKLE</span></h3>
            
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                 <div onClick={() => document.getElementById('new-photo-up')?.click()} className="w-28 h-28 bg-gray-50 rounded-[2.5rem] border-4 border-dashed border-gray-100 flex items-center justify-center cursor-pointer overflow-hidden relative group hover:border-red-600 transition-all">
                    {newStudent.photoUrl ? <img src={newStudent.photoUrl} className="w-full h-full object-cover" /> : <Upload size={32} className="text-gray-300" />}
                 </div>
                 <input type="file" id="new-photo-up" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                 <p className="text-[9px] font-black text-gray-400 uppercase mt-3">Profil Fotoğrafı</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-3">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">SPORCU AD SOYAD</label>
                    <input 
                      ref={firstInputRef}
                      type="text" 
                      placeholder="Ad Soyad giriniz..." 
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-red-600 focus:bg-white transition-all shadow-sm" 
                      value={newStudent.name} 
                      onChange={e => setNewStudent({...newStudent, name: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">NO</label>
                    <input 
                      type="number" 
                      placeholder="99" 
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-red-600 focus:bg-white transition-all shadow-sm" 
                      value={newStudent.jerseyNumber || ''} 
                      onChange={e => setNewStudent({...newStudent, jerseyNumber: parseInt(e.target.value) || undefined})} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">ANA BRANŞ</label>
                    <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase outline-none focus:border-red-600" value={newStudent.sport} onChange={e => {
                      const sp = e.target.value as any;
                      setNewStudent({...newStudent, sport: sp, activeSports: [sp]});
                    }}>
                      <option value="Futbol">FUTBOL</option>
                      <option value="Voleybol">VOLEYBOL</option>
                      <option value="Cimnastik">CİMNASTİK</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">GRUP</label>
                    <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase outline-none focus:border-red-600" value={newStudent.branchId} onChange={e => setNewStudent({...newStudent, branchId: e.target.value})}>
                      {ACADEMY_GROUPS.filter(g => g !== 'TÜM GRUPLAR').map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleAddStudent} 
                className="w-full py-5 bg-zinc-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-red-600 active:scale-95 transition-all mt-4 flex items-center justify-center gap-3"
              >
                <Save size={18} /> KAYDI TAMAMLA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
