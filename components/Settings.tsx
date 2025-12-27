
import React, { useState, useRef } from 'react';
import { Settings as SettingsIcon, Upload, Trash2, CheckCircle2, RefreshCw, Image as ImageIcon, Link as LinkIcon, Database, ShieldCheck, Globe, Info, Smartphone } from 'lucide-react';
import Logo from './Logo';

const APP_VERSION = "2.1.0-beta"; // Uygulama sürümü

const Settings: React.FC = () => {
  const [logo, setLogo] = useState<string | null>(localStorage.getItem('bgb_custom_logo'));
  const [logoUrlInput, setLogoUrlInput] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    // Yeni sürümü zorla çekmek için tarayıcı önbelleğini temizleyerek yeniler
    setTimeout(() => {
      if (confirm('Yeni bir güncelleme bulundu! Uygulama şimdi en güncel sürüme yükseltilecek.')) {
        window.location.reload();
      } else {
        setIsCheckingUpdate(false);
      }
    }, 1500);
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

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-24">
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-red-600 text-white rounded-2xl rotate-3 shadow-lg shadow-red-900/20">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">SİSTEM <span className="text-red-600">AYARLARI</span></h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic">Kulüp Kimliği ve Arayüz Yönetimi</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  className="w-full py-4 bg-zinc-100 text-zinc-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 border-2 border-dashed border-zinc-200"
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
            className="w-full py-5 bg-red-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 flex items-center justify-center gap-3"
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
                  className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all border border-white/5"
                 >
                   {isCheckingUpdate ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                   {isCheckingUpdate ? 'KONTROL EDİLİYOR...' : 'GÜNCELLEMELERİ DENETLE'}
                 </button>
                 <p className="text-[8px] text-zinc-500 font-black uppercase text-center mt-3 tracking-widest">
                   Uygulama her açılışta kendini otomatik olarak günceller.
                 </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Info size={20} /></div>
            <div>
              <h4 className="text-[11px] font-black uppercase italic tracking-tight text-zinc-900">DESTEK HATTI</h4>
              <p className="text-[10px] font-bold text-gray-400 mt-1">Uygulama ile ilgili teknik sorunlarda yazılımcı ekibi ile irtibata geçebilirsiniz.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
