
import React, { useState, useRef, useEffect } from 'react';
import { Mail, Lock, ArrowRight, AlertCircle, ShieldCheck, Loader2, Upload, ShieldAlert, Globe, HelpCircle } from 'lucide-react';
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
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ortam ve Protokol Kontrolü
  useEffect(() => {
    const checkEnvironment = async () => {
      const protocol = window.location.protocol;
      const isLocalFile = protocol === 'file:';
      
      // 1. Protokol Kontrolü
      if (isLocalFile) {
        setEnvStatus({ 
          isValid: false, 
          reason: 'Uygulama yerel bir dosya (file://) olarak açılmış. Sosyal girişlerin çalışması için uygulamayı bir sunucu (localhost veya https) üzerinden çalıştırmalısınız.' 
        });
        return;
      }

      // 2. Web Storage (localStorage) Kontrolü
      try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
      } catch (e) {
        setEnvStatus({ 
          isValid: false, 
          reason: 'Tarayıcınızın "Yerel Depolama" erişimi engellenmiş. Lütfen üçüncü taraf çerezlere izin verin veya gizli sekmeyi kapatın.' 
        });
        return;
      }

      // 3. Firebase Redirect Sonucu Kontrolü
      try {
        const result = await firebase.auth().getRedirectResult();
        if (result && result.user) {
          runAthleteMatchingLogic(result.user);
        }
      } catch (err: any) {
        handleAuthError(err, 'redirect');
      }
    };

    checkEnvironment();
  }, []);

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
      setError(`Bu e-posta (${inputEmail}) ile sistemde kayıtlı bir sporcu/veli bulunamadı.`);
      await firebase.auth().signOut();
    }
  };

  const handleAuthError = (err: any, type: 'popup' | 'redirect') => {
    const errorCode = err.code;
    console.error(`Firebase Auth Hatası (${type}):`, errorCode, err.message);

    let userFacingError = "Giriş işlemi başarısız.";

    switch (errorCode) {
      case 'auth/operation-not-supported-in-this-environment':
        userFacingError = "Bulunduğunuz ortam sosyal girişi desteklemiyor. Lütfen uygulamayı Chrome veya Safari gibi standart bir tarayıcıda, doğrudan bir web adresi üzerinden açın.";
        break;
      case 'auth/popup-closed-by-user':
        userFacingError = "Giriş penceresi kapatıldı.";
        break;
      case 'auth/web-storage-unsupported':
        userFacingError = "Tarayıcı depolama alanı erişilemez durumda. Lütfen çerezlere izin verin.";
        break;
      case 'auth/unauthorized-domain':
        userFacingError = "Bu alan adı Firebase üzerinde yetkilendirilmemiş. Lütfen yöneticiye başvurun.";
        break;
      default:
        userFacingError = `Hata oluştu: ${err.message}`;
    }
    setError(userFacingError);
  };

  const handleSocialLogin = async () => {
    if (!envStatus.isValid) {
      setError(envStatus.reason || 'Geçersiz ortam.');
      return;
    }

    setIsLoadingSocial(true);
    setError('');
    
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
      // Önce kalıcılığı zorla
      await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      
      // Popup dene, hata verirse redirect'e düşecek
      const result = await firebase.auth().signInWithPopup(provider);
      if (result.user) {
        await runAthleteMatchingLogic(result.user);
      }
    } catch (err: any) {
      // Eğer ortam popup desteklemiyorsa otomatik Redirect dene
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
            {!envStatus.isValid && (
              <div className="mb-6 p-4 bg-orange-500/20 border border-orange-500/50 rounded-2xl flex flex-col gap-3 text-orange-100 animate-in fade-in duration-300">
                <div className="flex items-start gap-3">
                  <ShieldAlert size={20} className="shrink-0 mt-0.5 text-orange-400" /> 
                  <p className="text-[10px] font-bold leading-relaxed">{envStatus.reason}</p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-orange-500/20">
                  <Globe size={12} className="text-orange-400" />
                  <span className="text-[8px] font-black uppercase tracking-widest">ÇÖZÜM: HTTP/HTTPS ÜZERİNDEN ÇALIŞTIRIN</span>
                </div>
              </div>
            )}

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
                    disabled={isLoadingSocial || !envStatus.isValid}
                    onClick={() => handleSocialLogin()} 
                    className={`w-full flex items-center justify-center gap-3 py-4 bg-white rounded-2xl transition-all active:scale-95 disabled:opacity-50 shadow-xl ${!envStatus.isValid ? 'cursor-not-allowed grayscale opacity-50' : 'hover:bg-gray-100'}`}
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
                  <div className="flex items-center gap-1.5 text-[8px] font-bold text-white/30 uppercase tracking-tight mt-2">
                    <HelpCircle size={10} /> Sorun yaşıyorsanız bir web tarayıcısı kullanın
                  </div>
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
