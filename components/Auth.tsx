import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, AlertCircle, ShieldCheck, Loader2, ShieldAlert } from 'lucide-react';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoadingSocial, setIsLoadingSocial] = useState(false);
  
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
      setError(`Bu e-posta (${inputEmail}) ile kayıtlı sporcu bulunamadı.`);
      await auth.signOut();
    }
  };

  const handleSocialLogin = async () => {
    if (isLocalFile) return;
    setIsLoadingSocial(true);
    setError('');
    
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      const result = await auth.signInWithPopup(provider);
      if (result.user) await runAthleteMatchingLogic(result.user);
    } catch (err: any) {
      if (err.code === 'auth/operation-not-supported-in-this-environment') {
        try {
            await auth.signInWithRedirect(provider);
        } catch (redirErr) {
            setError("Giriş yapılamadı.");
        }
      } else {
        setError("Giriş başarısız.");
      }
    } finally {
      setIsLoadingSocial(false);
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
      else { setError('Şifre hatalı!'); return; }
    }

    const registeredStudent = students.find(s => s.parentEmail?.toLowerCase() === inputEmail);
    if (registeredStudent) {
      if (password === (registeredStudent.password || '123456')) onLogin('parent', registeredStudent);
      else setError('Veli şifresi hatalı!');
    } else { setError('Kullanıcı bulunamadı.'); }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#111]">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2500&auto=format&fit=crop" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D2D4C] to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[3rem] p-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-white rounded-3xl p-1 shadow-xl"><Logo className="w-full h-full" /></div>
          <h1 className="text-3xl font-black italic uppercase text-white leading-none">BATMAN <span className="text-[#E30613]">GB</span></h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="p-3 bg-red-500/20 text-red-100 text-[10px] font-bold rounded-xl">{error}</div>}
            <input type="email" placeholder="E-posta" className="w-full p-4 bg-black/20 border border-white/10 rounded-2xl text-white outline-none" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Şifre" className="w-full p-4 bg-black/20 border border-white/10 rounded-2xl text-white outline-none" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit" className="w-full py-4 bg-[#E30613] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all">GİRİŞ YAP</button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center text-[8px] uppercase font-black"><span className="bg-[#1D2D4C] px-4 text-white/30 italic">VEYA GOOGLE İLE DEVAM ET</span></div>
          </div>

          <button 
            disabled={isLoadingSocial} 
            onClick={handleSocialLogin} 
            className="w-full flex items-center justify-center gap-3 py-4 bg-white rounded-2xl hover:bg-gray-100 transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoadingSocial ? <Loader2 className="animate-spin text-zinc-900" /> : <><img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" /> <span className="text-[10px] font-black uppercase text-zinc-900">GOOGLE HESABI</span></>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;