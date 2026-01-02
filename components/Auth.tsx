
import React, { useState, useRef, useEffect } from 'react';
import { Mail, Lock, ArrowRight, AlertCircle, ShieldCheck, Loader2, ShieldAlert, Globe, HelpCircle, Terminal, RefreshCw } from 'lucide-react';
import { AppMode, Student } from '../types';
import Logo from './Logo';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

interface AuthProps {
  onLogin: (mode: AppMode, student?: Student) => void;
  onRegisterStudent: (student: Student) => Promise<void>;
  students: Student[];
}

const Auth: React.FC<AuthProps> = ({ onLogin, onRegisterStudent, students }) => {
  const [view, setView] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoadingSocial, setIsLoadingSocial] = useState(false);
  const [envStatus, setEnvStatus] = useState<{
    isValid: boolean;
    reason: string | null;
  }>({ isValid: true, reason: null });
  
  const isLocalFile = window.location.protocol === 'file:';

  useEffect(() => {
    const checkEnvironment = async () => {
      // 1. Protokol Kontrolü (Hata fırlatmadan önce yakala)
      if (isLocalFile) {
        setEnvStatus({ 
          isValid: false, 
          reason: 'Uygulama bir web sunucusu üzerinden çalışmıyor.' 
        });
        return;
      }

      // 2. Web Storage Kontrolü
      try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
      } catch (e) {
        setEnvStatus({ 
          isValid: false, 
          reason: 'Tarayıcı depolama alanı (LocalStorage) erişilemez durumda.' 
        });
        return;
      }

      // 3. Redirect Sonucu Kontrolü (Sadece geçerli protokoldeysek)
      try {
        const result = await firebase.auth().getRedirectResult();
        if (result && result.user) {
          runAthleteMatchingLogic(result.user);
        }
      } catch (err: any) {
        // Çevresel hataları sessizce logla, UI'da göster
        if (err.code !== 'auth/operation-not-supported-in-this-environment') {
           handleAuthError(err, 'redirect');
        }
      }
    };

    checkEnvironment();
  }, [isLocalFile]);

  const runAthleteMatchingLogic = async (user: firebase.User) => {
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
      await firebase.auth().signOut();
    }
  };

  const handleAuthError = (err: any, type: 'popup' | 'redirect') => {
    console.error(`Firebase Auth Hatası (${type}):`, err.code);
    let msg = "Giriş işlemi başarısız.";
    if (err.code === 'auth/operation-not-supported-in-this-environment') {
      msg = "Bu ortam sosyal girişi desteklemiyor. Lütfen uygulamayı bir sunucu üzerinden açın.";
    } else if (err.code === 'auth/popup-blocked') {
      msg = "Açılır pencere engellendi. Lütfen izin verin.";
    }
    setError(msg);
  };

  const handleSocialLogin = async () => {
    if (isLocalFile) return;
    setIsLoadingSocial(true);
    setError('');
    
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      const result = await firebase.auth().signInWithPopup(provider);
      if (result.user) await runAthleteMatchingLogic(result.user);
    } catch (err: any) {
      if (err.code === 'auth/operation-not-supported-in-this-environment' || err.code === 'auth/popup-blocked') {
        try {
          await firebase.auth().signInWithRedirect(provider);
        } catch (redirectErr: any) {
          handleAuthError(redirectErr, 'redirect');
        }
      } else {
        handleAuthError(err, 'popup');
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
      else { setError('Yönetici şifresi hatalı!'); return; }
    }

    const registeredStudent = students.find(s => s.parentEmail?.toLowerCase() === inputEmail);
    if (registeredStudent) {
      const correctPass = registeredStudent.password || '123456';
      if (password === correctPass) onLogin('parent', registeredStudent);
      else setError('Veli şifresi hatalı!');
    } else { setError('Kayıtlı kullanıcı bulunamadı.'); }
  };

  // KRİTİK: file:// Protokolü için Engelleyici Ekran
  if (isLocalFile) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#111] flex items-center justify-center p-6 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="relative w-full max-w-lg bg-zinc-900 border border-red-900/30 rounded-[3rem] p-10 sm:p-14 shadow-2xl text-center space-y-8 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-red-600/10 rounded-[2rem] flex items-center justify-center mx-auto border border-red-600/20 text-red-600 shadow-lg">
            <ShieldAlert size={48} className="animate-pulse" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">GEÇERSİZ <span className="text-red-600">ORTAM</span></h1>
            <p className="text-zinc-400 text-sm font-bold leading-relaxed uppercase">
              Uygulama şu anda bir "Dosya" olarak açılmış. Firebase güvenlik politikaları gereği sosyal girişler sadece bir web sunucusu üzerinde çalışır.
            </p>
          </div>

          <div className="bg-black/40 rounded-3xl p-6 text-left border border-white/5 space-y-4">
            <p className="text-[10px] font-black text-red-600 uppercase tracking-widest flex items-center gap-2 italic">
               <Terminal size={14} /> ÇÖZÜM ADIMLARI
            </p>
            <ul className="space-y-3 text-xs font-bold text-zinc-500 uppercase italic">
              <li className="flex items-center gap-3"><div className="w-5 h-5 bg-white/5 rounded flex items-center justify-center text-[10px] text-white">1</div> Uygulamayı Vite (npm run dev) ile başlatın.</li>
              <li className="flex items-center gap-3"><div className="w-5 h-5 bg-white/5 rounded flex items-center justify-center text-[10px] text-white">2</div> Tarayıcıda http://localhost:3000 adresini açın.</li>
              <li className="flex items-center gap-3"><div className="w-5 h-5 bg-white/5 rounded flex items-center justify-center text-[10px] text-white">3</div> Veya Vercel/Firebase Hosting'e yükleyin.</li>
            </ul>
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="w-full py-5 bg-zinc-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-600 transition-all shadow-xl active:scale-95"
          >
            <RefreshCw size={18} /> SAYFAYI YENİLE
          </button>
          
          <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">BGB AKADEMİ GÜVENLİK PROTOKOLÜ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#111]">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2500&auto=format&fit=crop" className="w-full h-full object-cover opacity-40" alt="Stadium" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D2D4C] via-[#1D2D4C]/80 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6 max-h-[95vh] overflow-y-auto no-scrollbar py-8">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
          
          <div className="pt-10 pb-6 text-center">
            <div className="w-20 h-20 mx-auto bg-white rounded-3xl p-1 shadow-2xl mb-4"><Logo className="w-full h-full" /></div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none">BATMAN <span className="text-[#E30613]">GB</span></h1>
            <p className="text-white/60 text-[9px] font-black uppercase tracking-[0.4em] mt-2">AKADEMİ YÖNETİM SİSTEMİ</p>
          </div>

          <div className="px-8 pb-10">
            {view === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-5">
                {error && (
                  <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-2xl flex items-start gap-3 text-red-100 text-[10px] font-bold leading-relaxed">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" /> 
                    <span>{error}</span>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="group relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-white" size={20} />
                    <input type="email" placeholder="E-posta Adresi" className="w-full pl-14 pr-6 py-4 bg-black/20 border border-white/10 rounded-2xl text-white placeholder:text-white/30 text-sm font-bold outline-none focus:border-[#E30613]" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                  <div className="group relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-white" size={20} />
                    <input type="password" placeholder="Şifre" className="w-full pl-14 pr-6 py-4 bg-black/20 border border-white/10 rounded-2xl text-white placeholder:text-white/30 text-sm font-bold outline-none focus:border-[#E30613]" value={password} onChange={e => setPassword(e.target.value)} required />
                  </div>
                </div>

                <button type="submit" disabled={isLoadingSocial} className="w-full py-4 bg-[#E30613] hover:bg-red-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50">
                  GİRİŞ YAP <ArrowRight size={18} />
                </button>

                <div className="relative py-2">
                   <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                   <div className="relative flex justify-center text-[8px] uppercase font-black"><span className="bg-[#1D2D4C] px-4 text-white/30 tracking-widest italic">VEYA GOOGLE İLE BAĞLAN</span></div>
                </div>

                <div className="flex justify-center">
                   <button 
                    type="button" 
                    disabled={isLoadingSocial}
                    onClick={() => handleSocialLogin()} 
                    className="w-full flex items-center justify-center gap-3 py-4 bg-white rounded-2xl transition-all active:scale-95 disabled:opacity-50 shadow-xl hover:bg-gray-100"
                   >
                      {isLoadingSocial ? <Loader2 size={18} className="animate-spin text-zinc-900" /> : (
                        <>
                          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="22" height="22" />
                          <span className="text-[10px] font-black uppercase text-zinc-900 tracking-widest">GOOGLE HESABI İLE GİRİŞ</span>
                        </>
                      )}
                   </button>
                </div>

                <div className="flex flex-col items-center justify-center gap-3 pt-2">
                  <button type="button" onClick={() => setView('register')} className="text-[10px] font-black text-white/60 hover:text-white uppercase tracking-widest transition-colors border-b border-transparent hover:border-white/40 pb-0.5">
                    YENİ SPORCU KAYDI
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 text-center">
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">Sporcu kayıt sistemi aktif.</p>
                <button onClick={() => setView('login')} className="text-white font-black text-[10px] uppercase border-b border-white/20 pb-1">Giriş Ekranına Dön</button>
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 text-center space-y-2">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <ShieldCheck size={12} className="text-[#E30613]" />
              <span className="text-[8px] font-black text-white/60 uppercase tracking-widest italic">FIREBASE SECURE AUTH</span>
           </div>
           <p className="text-[8px] text-white/20 font-black uppercase tracking-[0.3em]">POWERED BY ENGIN ULUDAG</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
