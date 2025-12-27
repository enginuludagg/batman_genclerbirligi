
import React, { useState } from 'react';
import { Mail, Lock, UserPlus, ArrowRight, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
    const adminEmails = ['enginuludagg@gmail.com', 'elitgelisimakademi@gmail.com'];
    const adminPassword = 'Eu290202';

    // Admin Giriş Kontrolü
    if (adminEmails.includes(inputEmail)) {
      if (password === adminPassword) {
        onLogin('admin');
        return;
      } else {
        setError('Yönetici şifresi hatalı!');
        return;
      }
    }

    // Veli Giriş Kontrolü - Sadece sistemdeki gerçek sporculara göre
    const registeredStudent = students.find(s => 
      s.parentEmail?.toLowerCase() === inputEmail
    );

    if (registeredStudent) {
      const correctPass = registeredStudent.password || '123456';
      if (password === correctPass) {
        onLogin('parent');
      } else {
        setError('Veli şifresi hatalı!');
      }
    } else {
      setError('Bu bilgilere sahip bir üye bulunamadı. Lütfen kayıt olun.');
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
      branchId: formData.studentGroup,
      level: 'Başlangıç',
      status: 'passive',
      attendance: 0,
      lastTraining: 'Yeni Kayıt',
      feeStatus: 'Pending',
      stats: { strength: 50, speed: 50, stamina: 50, technique: 50 }
    };

    onRegisterStudent(newStudent);
    onLogin('parent');
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#f3f4f6] flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="w-full max-w-2xl bg-white rounded-[3rem] sm:rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-500 max-h-full sm:max-h-[95vh] flex flex-col border border-gray-100">
        
        <div className="bg-[#1D2D4C] p-8 sm:p-12 text-center relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
          
          <div className="relative z-10 mb-6 sm:mb-8 flex justify-center">
            <div className="p-0 bg-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-4 border-[#E30613] overflow-hidden flex items-center justify-center w-32 h-32 sm:w-44 sm:h-44 transition-transform duration-700 hover:scale-105">
              <Logo className="w-full h-full scale-[1.15] transform-gpu" />
            </div>
          </div>

          <h1 className="text-white text-2xl sm:text-4xl font-black italic uppercase tracking-tighter relative z-10 leading-none">
            BATMAN <span className="text-[#E30613]">GENÇLERBİRLİĞİ</span>
          </h1>
          <p className="text-slate-400 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.4em] mt-3 italic relative z-10 opacity-70">AKADEMİ PORTALI</p>
        </div>

        <div className="p-8 sm:p-12 overflow-y-auto no-scrollbar flex-1 bg-white">
          {view === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-6 sm:space-y-8 h-full flex flex-col justify-center">
              <div className="space-y-1 text-center">
                <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">SİSTEME <span className="text-[#E30613]">GİRİŞ</span></h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Resmi üye erişim paneli.</p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-[#E30613] text-[11px] font-black uppercase rounded-2xl border border-red-100 flex items-center gap-3 animate-shake">
                  <AlertCircle size={20} className="flex-shrink-0" /> {error}
                </div>
              )}

              <div className="space-y-3 sm:space-y-4">
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#E30613] transition-colors" size={20} />
                  <input 
                    type="email" 
                    placeholder="E-posta" 
                    className="w-full pl-16 pr-8 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] text-sm font-black outline-none focus:border-[#E30613] focus:bg-white transition-all shadow-inner" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#E30613] transition-colors" size={20} />
                  <input 
                    type="password" 
                    placeholder="Şifre" 
                    className="w-full pl-16 pr-8 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] text-sm font-black outline-none focus:border-[#E30613] focus:bg-white transition-all shadow-inner" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-5 sm:py-6 bg-[#1D2D4C] text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.25em] shadow-2xl flex items-center justify-center gap-3 hover:bg-[#E30613] transition-all active:scale-[0.97] group">
                OTURUM AÇ <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
              </button>

              <div className="pt-4 flex flex-col items-center gap-4">
                 <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 bg-slate-50 px-4 py-2 rounded-full uppercase tracking-widest border border-slate-100">
                   <ShieldCheck size={14} className="text-red-600" /> Ayarlar için Admin Girişi Gerekir
                 </div>
                 <button type="button" onClick={() => setView('register')} className="text-[10px] font-black text-[#E30613] uppercase tracking-[0.2em] flex items-center gap-2 hover:scale-105 transition-transform bg-red-50 px-8 py-4 rounded-full border border-red-100">
                    <UserPlus size={18} /> HEMEN KAYIT OL
                 </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-6 sm:space-y-8">
              <div className="space-y-1">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">YENİ <span className="text-[#E30613]">KAYIT</span></h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Akademi ailesine katılın.</p>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                <div className="bg-slate-50 p-6 rounded-[2.5rem] space-y-3 border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase italic">VELİ & GİRİŞ BİLGİLERİ</p>
                  <input type="text" placeholder="Veli Ad Soyad" required className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-[#E30613]" value={formData.parentName} onChange={e => setFormData({...formData, parentName: e.target.value})} />
                  <input type="email" placeholder="E-posta (Giriş İçin)" required className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-[#E30613]" value={formData.parentEmail} onChange={e => setFormData({...formData, parentEmail: e.target.value})} />
                  <input type="password" placeholder="Şifre Belirleyin" required className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-[#E30613]" value={formData.parentPassword} onChange={e => setFormData({...formData, parentPassword: e.target.value})} />
                  <input type="tel" placeholder="Veli Telefon" required className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-[#E30613]" value={formData.parentPhone} onChange={e => setFormData({...formData, parentPhone: e.target.value})} />
                </div>

                <div className="bg-slate-50 p-6 rounded-[2.5rem] space-y-3 border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase italic">SPORCU BİLGİLERİ</p>
                  <input type="text" placeholder="Sporcu Ad Soyad" required className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-[#E30613]" value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} />
                  <div className="grid grid-cols-2 gap-3">
                    <select className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase outline-none focus:border-[#E30613]" value={formData.studentGender} onChange={e => setFormData({...formData, studentGender: e.target.value})}>
                      <option value="Erkek">♂ ERKEK</option>
                      <option value="Kız">♀ KIZ</option>
                    </select>
                    <input type="number" placeholder="Doğum Yılı" required className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-[#E30613]" value={formData.studentBirthYear} onChange={e => setFormData({...formData, studentBirthYear: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <select className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase outline-none focus:border-[#E30613]" value={formData.studentSport} onChange={e => setFormData({...formData, studentSport: e.target.value})}>
                      <option value="Futbol">FUTBOL</option>
                      <option value="Voleybol">VOLEYBOL</option>
                      <option value="Cimnastik">CİMNASTİK</option>
                    </select>
                    <select className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase outline-none focus:border-[#E30613]" value={formData.studentGroup} onChange={e => setFormData({...formData, studentGroup: e.target.value})}>
                      <option value="U10">U10 GRUBU</option>
                      <option value="U12">U12 GRUBU</option>
                      <option value="U14">U14 GRUBU</option>
                      <option value="KALECİ">KALECİ</option>
                      <option value="MİNİKLER">MİNİKLER</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button type="submit" className="w-full py-5 bg-[#E30613] text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 hover:bg-[#1D2D4C] transition-all active:scale-[0.97]">
                  KAYDI TAMAMLA VE GİRİŞ YAP <CheckCircle2 size={20} />
                </button>
                <button type="button" onClick={() => setView('login')} className="w-full text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] text-center">GİRİŞ EKRANINA DÖN</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
