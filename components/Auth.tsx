
import React, { useState } from 'react';
import { Mail, Lock, UserPlus, ArrowRight, AlertCircle, ShieldCheck, CheckCircle2, Users, Trophy } from 'lucide-react';
import { AppMode, Student } from '../types';
import Logo from './Logo';

interface AuthProps {
  onLogin: (mode: AppMode) => void;
  onRegisterStudent: (student: Student) => void;
  students: Student[];
}

const Auth: React.FC<AuthProps> = ({ onLogin, onRegisterStudent, students }) => {
  const [view, setView] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    parentPassword: '',
    studentName: '',
    studentBirthYear: '2012',
    studentGender: 'Erkek',
    studentSport: 'Futbol',
    studentGroup: 'U12'
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const inputEmail = email.toLowerCase().trim();
    const adminEmails = ['enginuludagg@gmail.com', 'elitgelisimakademi@gmail.com', 'admin@bgb.com'];
    const adminPassword = 'Eu290202';

    if (adminEmails.includes(inputEmail)) {
      if (password === adminPassword) {
        onLogin('admin');
        return;
      } else {
        setError('Yönetici şifresi hatalı!');
        return;
      }
    }

    const registeredStudent = students.find(s => s.parentEmail?.toLowerCase() === inputEmail);
    if (registeredStudent) {
      const correctPass = registeredStudent.password || '123456';
      if (password === correctPass) onLogin('parent');
      else setError('Veli şifresi hatalı! Lütfen kontrol ediniz.');
    } else {
      setError('Bu e-posta ile kayıtlı sporcu bulunamadı.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (students.some(s => s.parentEmail === formData.parentEmail)) {
      setError('Bu e-posta adresi zaten kullanımda!');
      return;
    }

    const newStudent: Student = {
      id: Date.now().toString(),
      name: formData.studentName,
      age: new Date().getFullYear() - parseInt(formData.studentBirthYear),
      birthYear: parseInt(formData.studentBirthYear),
      gender: formData.studentGender as 'Erkek' | 'Kız',
      parentName: formData.parentName,
      parentPhone: formData.parentPhone,
      parentEmail: formData.parentEmail,
      password: formData.parentPassword,
      sport: formData.studentSport as 'Futbol' | 'Voleybol' | 'Cimnastik',
      activeSports: [formData.studentSport as 'Futbol' | 'Voleybol' | 'Cimnastik'],
      branchId: formData.studentGroup,
      level: 'Başlangıç',
      status: 'passive',
      attendance: 0,
      lastTraining: 'Yeni Kayıt',
      feeStatus: 'Pending',
      stats: { strength: 50, speed: 50, stamina: 50, technique: 50 },
      badges: [],
      scoutingNotes: []
    };

    onRegisterStudent(newStudent);
    onLogin('parent');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#111]">
      {/* Arka Plan Görseli */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2500&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-40"
          alt="Stadium"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D2D4C] via-[#1D2D4C]/80 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
          
          {/* Header */}
          <div className="pt-10 pb-6 text-center relative">
            <div className="w-24 h-24 mx-auto bg-white rounded-3xl p-1 shadow-2xl mb-4 border-2 border-transparent">
              <Logo className="w-full h-full" />
            </div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none">
              BATMAN <span className="text-[#E30613]">GB</span>
            </h1>
            <p className="text-white/60 text-[9px] font-black uppercase tracking-[0.4em] mt-2">AKADEMİ YÖNETİM SİSTEMİ</p>
          </div>

          <div className="px-8 pb-10">
            {view === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-5">
                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-2xl flex items-center gap-3 text-red-200 text-xs font-bold animate-pulse">
                    <AlertCircle size={16} /> {error}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="group relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors" size={20} />
                    <input 
                      type="email" 
                      placeholder="E-posta Adresi" 
                      className="w-full pl-14 pr-6 py-4 bg-black/20 border border-white/10 rounded-2xl text-white placeholder:text-white/30 text-sm font-bold outline-none focus:border-[#E30613] focus:bg-black/40 transition-all"
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="group relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors" size={20} />
                    <input 
                      type="password" 
                      placeholder="Şifre" 
                      className="w-full pl-14 pr-6 py-4 bg-black/20 border border-white/10 rounded-2xl text-white placeholder:text-white/30 text-sm font-bold outline-none focus:border-[#E30613] focus:bg-black/40 transition-all"
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <button type="submit" className="w-full py-4 bg-[#E30613] hover:bg-red-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-red-900/40 flex items-center justify-center gap-3 transition-all active:scale-[0.98]">
                  GİRİŞ YAP <ArrowRight size={18} />
                </button>

                <div className="flex items-center justify-center gap-2 pt-2">
                  <button type="button" onClick={() => setView('register')} className="text-[10px] font-black text-white/60 hover:text-white uppercase tracking-widest transition-colors border-b border-transparent hover:border-white/40 pb-0.5">
                    YENİ SPORCU KAYDI
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-4 pr-1">
                  <div className="space-y-3">
                    <p className="text-[9px] font-black text-[#E30613] uppercase tracking-widest">VELİ BİLGİLERİ</p>
                    <input type="text" placeholder="Veli Ad Soyad" required className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white text-xs font-bold outline-none focus:border-[#E30613]" value={formData.parentName} onChange={e => setFormData({...formData, parentName: e.target.value})} />
                    <input type="email" placeholder="E-posta (Giriş için)" required className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white text-xs font-bold outline-none focus:border-[#E30613]" value={formData.parentEmail} onChange={e => setFormData({...formData, parentEmail: e.target.value})} />
                    <input type="password" placeholder="Şifre Belirleyin" required className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white text-xs font-bold outline-none focus:border-[#E30613]" value={formData.parentPassword} onChange={e => setFormData({...formData, parentPassword: e.target.value})} />
                    <input type="tel" placeholder="Telefon" required className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white text-xs font-bold outline-none focus:border-[#E30613]" value={formData.parentPhone} onChange={e => setFormData({...formData, parentPhone: e.target.value})} />
                  </div>
                  <div className="space-y-3">
                    <p className="text-[9px] font-black text-[#E30613] uppercase tracking-widest">SPORCU BİLGİLERİ</p>
                    <input type="text" placeholder="Sporcu Ad Soyad" required className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white text-xs font-bold outline-none focus:border-[#E30613]" value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} />
                    <div className="grid grid-cols-2 gap-2">
                       <select className="bg-black/20 border border-white/10 rounded-xl text-white text-[10px] font-bold p-3 outline-none" value={formData.studentGender} onChange={e => setFormData({...formData, studentGender: e.target.value})}>
                          <option value="Erkek" className="bg-zinc-900">ERKEK</option>
                          <option value="Kız" className="bg-zinc-900">KIZ</option>
                       </select>
                       <input type="number" placeholder="Yıl (2012)" required className="bg-black/20 border border-white/10 rounded-xl text-white text-xs font-bold p-3 outline-none" value={formData.studentBirthYear} onChange={e => setFormData({...formData, studentBirthYear: e.target.value})} />
                    </div>
                  </div>
                </div>
                
                <button type="submit" className="w-full py-4 bg-white text-zinc-900 hover:bg-gray-100 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]">
                  KAYDI TAMAMLA <CheckCircle2 size={16} />
                </button>
                <button type="button" onClick={() => setView('login')} className="w-full text-[9px] font-black text-white/40 hover:text-white uppercase tracking-widest">
                  GİRİŞ EKRANINA DÖN
                </button>
              </form>
            )}
          </div>
        </div>
        
        {/* Footer Info */}
        <div className="mt-8 text-center space-y-2">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <ShieldCheck size={12} className="text-[#E30613]" />
              <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">GÜVENLİ SSL BAĞLANTISI</span>
           </div>
           <p className="text-[8px] text-white/20 font-black uppercase tracking-[0.3em]">POWERED BY ENGIN ULUDAG</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
