
import React, { useState } from 'react';
import { Mail, Lock, UserPlus, ArrowRight, AlertCircle, Sparkles, CheckCircle2, Info, User } from 'lucide-react';
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
    studentSport: 'Futbol',
    studentGroup: 'U12'
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const inputEmail = email.toLowerCase().trim();
    const adminEmails = ['enginuludagg@gmail.com', 'elitgelisimakademi@gmail.com'];
    const adminPassword = 'Eu290202';

    // 1. Yönetici Kontrolü
    if (adminEmails.includes(inputEmail)) {
      if (password === adminPassword) {
        onLogin('admin');
        return;
      } else {
        setError('Yönetici şifresi hatalı!');
        return;
      }
    }

    // 2. Mevcut Kayıtlı Üye (Veli) Kontrolü
    // App state'indeki students listesinde bu email/şifre var mı?
    const registeredStudent = students.find(s => 
      s.parentEmail?.toLowerCase() === inputEmail || 
      (s.id === '1' && inputEmail === 'veli@bgb.com') // Demo hesap desteği
    );

    if (registeredStudent) {
      // Demo hesap veya kayıtlı hesap şifre kontrolü
      const correctPass = registeredStudent.password || '123456';
      if (password === correctPass) {
        onLogin('parent');
      } else {
        setError('Veli şifresi hatalı!');
      }
    } else {
      // Hiçbir eşleşme yoksa giriş reddedilir
      setError('Bu bilgilere sahip bir üye bulunamadı. Lütfen kayıt olun.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Email daha önce kullanılmış mı kontrolü
    if (students.some(s => s.parentEmail === formData.parentEmail)) {
      setError('Bu e-posta adresi zaten kullanımda!');
      return;
    }

    const newStudent: Student = {
      id: Date.now().toString(),
      name: formData.studentName,
      age: new Date().getFullYear() - parseInt(formData.studentBirthYear),
      birthYear: parseInt(formData.studentBirthYear),
      parentName: formData.parentName,
      parentPhone: formData.parentPhone,
      parentEmail: formData.parentEmail,
      password: formData.parentPassword,
      sport: formData.studentSport as 'Futbol' | 'Voleybol',
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
        
        <div className="bg-[#1D2D4C] p-6 sm:p-10 text-center relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
          
          <div className="relative z-10 mb-4 sm:mb-6 flex justify-center">
            <div className="p-3 sm:p-4 bg-white rounded-full shadow-2xl border-4 border-white">
              <Logo className="w-16 h-16 sm:w-24 sm:h-24" />
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

              {/* Bilgi Kutusu */}
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
                <Info size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                   <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest">DEMO BİLGİLERİ:</p>
                   <div className="grid grid-cols-2 gap-4 mt-2">
                     <div>
                       <p className="text-[8px] font-black text-blue-400 uppercase">YÖNETİCİ</p>
                       <p className="text-[9px] font-bold text-blue-700 italic leading-tight">enginuludagg@gmail.com<br/>Ş: Eu290202</p>
                     </div>
                     <div>
                       <p className="text-[8px] font-black text-blue-400 uppercase">VELİ</p>
                       <p className="text-[9px] font-bold text-blue-700 italic leading-tight">veli@bgb.com<br/>Ş: 123456</p>
                     </div>
                   </div>
                </div>
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

              <div className="pt-6 border-t border-gray-100 flex flex-col items-center gap-4">
                 <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest text-center italic">
                   YENİ SPORCU KAYDI MI YAPACAKSINIZ?
                 </p>
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

              {error && (
                <div className="p-4 bg-red-50 text-[#E30613] text-[11px] font-black uppercase rounded-2xl border border-red-100 flex items-center gap-3">
                  <AlertCircle size={20} className="flex-shrink-0" /> {error}
                </div>
              )}

              <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                <div className="bg-slate-50 p-6 rounded-[2.5rem] space-y-3 border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase italic">VELİ & GİRİŞ BİLGİLERİ</p>
                  <input type="text" placeholder="Ad Soyad" required className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-[#E30613]" value={formData.parentName} onChange={e => setFormData({...formData, parentName: e.target.value})} />
                  <input type="email" placeholder="E-posta (Giriş İçin)" required className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-[#E30613]" value={formData.parentEmail} onChange={e => setFormData({...formData, parentEmail: e.target.value})} />
                  <input type="password" placeholder="Şifre Belirleyin" required className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-[#E30613]" value={formData.parentPassword} onChange={e => setFormData({...formData, parentPassword: e.target.value})} />
                  <input type="tel" placeholder="Telefon" required className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-[#E30613]" value={formData.parentPhone} onChange={e => setFormData({...formData, parentPhone: e.target.value})} />
                </div>

                <div className="bg-slate-50 p-6 rounded-[2.5rem] space-y-3 border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase italic">SPORCU BİLGİLERİ</p>
                  <input type="text" placeholder="Sporcu Ad Soyad" required className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-[#E30613]" value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" placeholder="Doğum Yılı" required className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-[#E30613]" value={formData.studentBirthYear} onChange={e => setFormData({...formData, studentBirthYear: e.target.value})} />
                    <select className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase outline-none focus:border-[#E30613]" value={formData.studentGroup} onChange={e => setFormData({...formData, studentGroup: e.target.value})}>
                      <option value="U10">U10 GRUBU</option>
                      <option value="U12">U12 GRUBU</option>
                      <option value="U14">U14 GRUBU</option>
                      <option value="KALECİ">KALECİ</option>
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
