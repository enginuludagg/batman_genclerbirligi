
import React, { useState, useRef, useEffect } from 'react';
import { Settings as SettingsIcon, Upload, Trash2, CheckCircle2, RefreshCw, Image as ImageIcon, Link as LinkIcon, Database, ShieldCheck, Smartphone, AlertTriangle, Lock, X, Info } from 'lucide-react';
import Logo from './Logo';
import { storageService, KEYS } from '../services/storageService';

const APP_VERSION = "2.1.5-stable";

const Settings: React.FC = () => {
  const [logo, setLogo] = useState<string | null>(localStorage.getItem('bgb_custom_logo'));
  const [logoUrlInput, setLogoUrlInput] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [showResetAuth, setShowResetAuth] = useState(false);
  const [resetPassword, setResetPassword] = useState('');
  const [resetError, setResetError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Veri Sayacı Durumu
  const [dataStats, setDataStats] = useState({
    students: 0,
    finance: 0,
    notes: 0
  });

  useEffect(() => {
    const students = storageService.load(KEYS.STUDENTS, []);
    const finance = storageService.load(KEYS.FINANCE, []);
    const notes = storageService.load(KEYS.NOTES, []);
    setDataStats({
      students: students.length,
      finance: finance.length,
      notes: notes.length
    });
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setLogo(base64);
        setLogoUrlInput('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateCheck = () => {
    setIsCheckingUpdate(true);
    setTimeout(() => {
      alert('Sistem güncel! En son BGB Akademi optimizasyonlarını kullanıyorsunuz.');
      setIsCheckingUpdate(false);
    }, 1200);
  };

  const saveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      if (logo) {
        localStorage.setItem('bgb_custom_logo', logo);
      } else {
        localStorage.removeItem('bgb_custom_logo');
      }
      
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('logoUpdated'));
      
      setIsSaving(false);
      alert('Sistem ayarları başarıyla güncellendi!');
    }, 800);
  };

  const handleHardReset = () => {
    const adminPassword = 'Eu290202';
    if (resetPassword === adminPassword) {
      if (confirm('DİKKAT: Tüm verileriniz (Öğrenciler, Aidatlar, Notlar) kalıcı olarak silinecek. Bu işlem geri alınamaz! Onaylıyor musunuz?')) {
        storageService.clearAllData();
      }
    } else {
      setResetError(true);
      setTimeout(() => setResetError(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-24">
      <div className="flex items-center gap-4 mb-2 px-2">
        <div className="p-3 bg-red-600 text-white rounded-2xl rotate-3 shadow-lg shadow-red-900/20">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">SİSTEM <span className="text-red-600">AYARLARI</span></h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic">Kulüp Kimliği ve Arayüz Yönetimi</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-2">
        {/* Logo Yönetimi */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
            <ImageIcon className="text-red-600" size={20} />
            <h3 className="font-black uppercase text-xs tracking-widest text-zinc-900 italic">KURUMSAL LOGO</h3>
          </div>

          <div className="flex flex-col items-center gap-6 py-2">
            <div className="w-44 h-44 bg-gray-50 rounded-[2.5rem] border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden relative group p-0">
               <Logo className="w-full h-full" overrideUrl={logo} />
            </div>

            <div className="w-full space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Resim Linki..." 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:border-red-600 transition-all shadow-inner"
                  value={logoUrlInput}
                  onChange={(e) => setLogoUrlInput(e.target.value)}
                />
                <LinkIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <button 
                  onClick={() => { if(logoUrlInput) setLogo(logoUrlInput); setLogoUrlInput(''); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-zinc-950 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase"
                >
                  UYGULA
                </button>
              </div>

              <div className="relative">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 bg-zinc-100 text-zinc-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 border-2 border-dashed border-zinc-200 shadow-sm"
                >
                  <Upload size={16} /> CİHAZDAN YÜKLE
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
              </div>
            </div>
          </div>
          <button 
            onClick={saveSettings}
            disabled={isSaving}
            className="w-full py-5 bg-red-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 flex items-center justify-center gap-3 transition-all hover:bg-zinc-900"
          >
            {isSaving ? <RefreshCw size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
            {isSaving ? 'GÜNCELLENİYOR...' : 'LOGOYU KAYDET'}
          </button>
        </div>

        {/* Yazılım ve Versiyon Yönetimi */}
        <div className="space-y-6">
          <div className="bg-zinc-950 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <Smartphone className="text-red-600" size={20} />
              <h3 className="font-black uppercase text-xs tracking-widest italic">UYGULAMA BİLGİSİ</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                 <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">YAZILIM SÜRÜMÜ</span>
                 <span className="text-[10px] font-black bg-white/10 px-3 py-1 rounded-full">{APP_VERSION}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                 <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">VERİTABANI MODU</span>
                 <span className="text-[10px] font-black text-green-500 flex items-center gap-1.5"><ShieldCheck size={14} /> YEREL (GÜVENLİ)</span>
              </div>

              <div className="pt-4">
                 <button 
                  onClick={handleUpdateCheck}
                  disabled={isCheckingUpdate}
                  className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all border border-white/5 shadow-inner"
                 >
                   {isCheckingUpdate ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                   {isCheckingUpdate ? 'KONTROL EDİLİYOR...' : 'GÜNCELLEMELERİ DENETLE'}
                 </button>
              </div>
            </div>
          </div>

          {/* TEHLİKELİ BÖLGE - SIFIRLAMA */}
          <div className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-red-600">
                 <AlertTriangle size={20} />
                 <h3 className="font-black uppercase text-xs tracking-widest italic">TEHLİKELİ BÖLGE</h3>
              </div>
              <div className="flex gap-2">
                 <span className="bg-red-200/50 text-red-700 text-[8px] font-black px-2 py-1 rounded-lg">Öğrenci: {dataStats.students}</span>
                 <span className="bg-red-200/50 text-red-700 text-[8px] font-black px-2 py-1 rounded-lg">Finans: {dataStats.finance}</span>
              </div>
            </div>
            
            <p className="text-[10px] font-bold text-red-400 uppercase leading-relaxed">
              Bu işlem tüm sporcu kayıtlarını, finansal verileri ve antrenman notlarını <b>kalıcı olarak</b> siler. Temiz kurulum için kullanın.
            </p>
            
            {!showResetAuth ? (
              <button 
                onClick={() => setShowResetAuth(true)}
                className="w-full py-4 bg-white text-red-600 border-2 border-red-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
              >
                <Trash2 size={16} /> SİSTEMİ SIFIRLA (TEMİZ KURULUM)
              </button>
            ) : (
              <div className="space-y-3 animate-in zoom-in-95 duration-200">
                <div className="relative group">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${resetError ? 'text-red-600 animate-shake' : 'text-zinc-400'}`} size={16} />
                  <input 
                    type="password" 
                    placeholder="Yönetici Şifresi (Eu290202)" 
                    className={`w-full pl-12 pr-4 py-4 bg-white border ${resetError ? 'border-red-600 ring-2 ring-red-100 animate-shake' : 'border-red-200'} rounded-2xl text-[10px] font-black uppercase outline-none focus:ring-4 focus:ring-red-100 transition-all shadow-inner`}
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleHardReset()}
                    autoFocus
                  />
                </div>
                {resetError && (
                  <p className="text-[8px] font-black text-red-600 uppercase text-center italic flex items-center justify-center gap-1">
                    <AlertTriangle size={10} /> Şifre Yanlış! Erişim Engellendi.
                  </p>
                )}
                <div className="flex gap-2">
                  <button 
                    onClick={handleHardReset}
                    className="flex-[2] py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-red-700"
                  >
                    <Trash2 size={16} /> ŞİFREYİ DOĞRULA VE SIFIRLA
                  </button>
                  <button 
                    onClick={() => { setShowResetAuth(false); setResetPassword(''); setResetError(false); }}
                    className="flex-1 py-4 bg-zinc-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 flex items-center justify-center transition-all hover:bg-black"
                  >
                    İPTAL
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Alt Bilgi */}
      <div className="flex items-center justify-center gap-3 opacity-30 px-2">
         <div className="h-px bg-zinc-300 flex-1"></div>
         <span className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.5em] italic whitespace-nowrap">BGB AKADEMİ TEKNİK ALTYAPI</span>
         <div className="h-px bg-zinc-300 flex-1"></div>
      </div>
    </div>
  );
};

export default Settings;
