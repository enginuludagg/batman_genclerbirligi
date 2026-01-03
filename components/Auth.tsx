import React, { useState } from 'react';
import { Mail, Lock, Loader2, UserPlus, ArrowLeft, User } from 'lucide-react';
import { AppMode, Student } from '../types';
import Logo from './Logo';
import { auth } from '../services/firebaseConfig';
import firebase from 'firebase/compat/app';

interface AuthProps {
  onLogin: (mode: AppMode, student?: Student) => void;
  onRegisterStudent: (student: Student) => Promise<void>;
  students: Student[];
}

const Auth: React.FC<AuthProps> = ({ onLogin, onRegisterStudent, students }) => {
  const [view, setView] = useState<'login' | 'register'>('login');
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regSport, setRegSport] = useState<'Futbol' | 'Voleybol' | 'Cimnastik'>('Futbol');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const isLocalFile = window.location.protocol === 'file:';

  const runAthleteMatchingLogic = async (user: any) => {
    const inputEmail = user.email?.toLowerCase().trim();
    if (!inputEmail) return;

    const adminEmails = ['enginuludagg@gmail.com', 'elitgelisimakademi@gmail.com', 'admin@bgb.com'];

    if (adminEmails.includes(inputEmail)) {
      onLogin('admin');
      return;
    }

    const registeredStudent = students.find(s => s.parentEmail?.toLowerCase() === inputEmail);
    if (registeredStudent) {
      onLogin('parent', registeredStudent);
    } else {
      setError(`Bu e-posta (${inputEmail}) ile kayıtlı sporcu bulunamadı. Lütfen önce kayıt olun.`);
      await auth.signOut();
    }
  };

  const handleSocialLogin = async () => {
    if (isLocalFile) return;
    setIsLoading(true);
    setError('');
    
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      const result = await auth.signInWithPopup(provider);
      if (result.user) await runAthleteMatchingLogic(result.user);
    } catch (err: any) {
      setError("Google girişi başarısız oldu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const inputEmail = email.toLowerCase().trim();
    const adminEmails = ['enginuludagg@gmail.com', 'elitgelisimakademi@gmail.com', 'admin@bgb.com'];
    const adminPassword = 'Eu290202';

    if (adminEmails.includes(inputEmail)) {
      if (password === adminPassword) { onLogin('admin'); return; } 
      else { setError('Yönetici şifresi hatalı!'); return; }
    }

    const registeredStudent = students.find(s => s.parentEmail?.toLowerCase() === inputEmail);
    if (registeredStudent) {
      if (password === (registeredStudent.password || '123456')) onLogin('parent', registeredStudent);
      else setError('Şifre hatalı!');
    } else { setError('Kullanıcı bulunamadı. Lütfen kayıt olun.'); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        if (!regName || !regEmail || !regPassword) throw new Error("Tüm alanları doldurunuz.");
        if (students.some(s => s.parentEmail?.toLowerCase() === regEmail.toLowerCase())) {
            throw new Error("Bu e-posta adresi zaten kayıtlı.");
        }

        const newStudent: Student = {
            id: Date.now().toString(),
            name: regName,
            parentEmail: regEmail.toLowerCase().trim(),
            password: regPassword,
            sport: regSport,
            activeSports: [regSport],
            branchId: 'U12', // Varsayılan Başlangıç Grubu
            gender: 'Erkek', // Varsayılan
            age: 10, // Varsayılan yaş
            level: 'Başlangıç',
            status: 'active', // Otomatik aktif
            attendance: 0,
            lastTraining: 'Yeni Kayıt',
            feeStatus: 'Pending',
            registrationDate: new Date().toISOString().split('T')[0],
            stats: { strength: 50, speed: 50, stamina: 50, technique: 50 },
            badges: [],
            scoutingNotes: []
        };

        await onRegisterStudent(newStudent);
        // Kayıt sonrası otomatik giriş
        onLogin('parent', newStudent);

    } catch (err: any) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#111]">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2500&auto=format&fit=crop" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D2D4C] to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[3rem] p-8 text-center space-y-6 animate-in zoom-in duration-300">
          <div className="w-20 h-20 mx-auto bg-white rounded-3xl p-1 shadow-xl"><Logo className="w-full h-full" /></div>
          
          <h1 className="text-3xl font-black italic uppercase text-white leading-none">
            BATMAN <span className="text-[#E30613]">GB</span>
          </h1>
          
          {error && <div className="p-3 bg-red-500/20 text-red-100 text-[10px] font-bold rounded-xl border border-red-500/20">{error}</div>}

          {view === 'login' ? (
            <>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                        <input type="email" placeholder="E-posta" className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-2xl text-white outline-none placeholder:text-white/30 focus:border-[#E30613] transition-colors" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                        <input type="password" placeholder="Şifre" className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-2xl text-white outline-none placeholder:text-white/30 focus:border-[#E30613] transition-colors" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="w-full py-4 bg-[#E30613] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-900/20">GİRİŞ YAP</button>
                </form>

                <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                    <div className="relative flex justify-center text-[8px] uppercase font-black"><span className="bg-[#1D2D4C]/50 backdrop-blur-md px-4 text-white/40 italic rounded-full">VEYA</span></div>
                </div>

                <div className="space-y-3">
                    <button 
                        disabled={isLoading} 
                        onClick={handleSocialLogin} 
                        className="w-full flex items-center justify-center gap-3 py-4 bg-white rounded-2xl hover:bg-gray-100 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="animate-spin text-zinc-900" /> : <><img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" /> <span className="text-[10px] font-black uppercase text-zinc-900">GOOGLE İLE GİRİŞ</span></>}
                    </button>

                    <button 
                        onClick={() => setView('register')}
                        className="w-full py-4 bg-zinc-900 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-xl"
                    >
                        <UserPlus size={16} /> YENİ ÜYELİK OLUŞTUR
                    </button>
                </div>
            </>
          ) : (
            <>
                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                        <input type="text" placeholder="Sporcu Ad Soyad" className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-2xl text-white outline-none placeholder:text-white/30 focus:border-[#E30613] transition-colors" value={regName} onChange={e => setRegName(e.target.value)} />
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                        <input type="email" placeholder="Veli E-posta" className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-2xl text-white outline-none placeholder:text-white/30 focus:border-[#E30613] transition-colors" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                        <input type="password" placeholder="Şifre Belirle" className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-2xl text-white outline-none placeholder:text-white/30 focus:border-[#E30613] transition-colors" value={regPassword} onChange={e => setRegPassword(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {['Futbol', 'Voleybol', 'Cimnastik'].map((sport) => (
                            <button 
                                key={sport}
                                type="button"
                                onClick={() => setRegSport(sport as any)}
                                className={`py-3 rounded-xl text-[9px] font-black uppercase border transition-all ${regSport === sport ? 'bg-white text-black border-white' : 'bg-transparent text-white/50 border-white/10'}`}
                            >
                                {sport}
                            </button>
                        ))}
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full py-4 bg-[#E30613] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2">
                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'KAYDI TAMAMLA'}
                    </button>
                </form>

                <button 
                    onClick={() => setView('login')}
                    className="flex items-center justify-center gap-2 text-white/50 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors mt-4"
                >
                    <ArrowLeft size={14} /> GİRİŞ EKRANINA DÖN
                </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Auth;