
import React, { useState, useRef, useEffect } from 'react';
import { Settings as SettingsIcon, Upload, Trash2, CheckCircle2, RefreshCw, Image as ImageIcon, Smartphone, ShieldCheck, X, Save } from 'lucide-react';
import Logo from './Logo';

const APP_VERSION = "V.1.2";

const Settings: React.FC = () => {
  const [logo, setLogo] = useState<string | null>(localStorage.getItem('bgb_custom_logo'));
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      if (logo) localStorage.setItem('bgb_custom_logo', logo);
      window.dispatchEvent(new Event('logoUpdated'));
      setIsSaving(false);
      alert('Sistem ayarları başarıyla güncellendi!');
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-24 px-2">
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-red-600 text-white rounded-2xl rotate-3 shadow-lg"><SettingsIcon size={24} /></div>
        <div>
          <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">SİSTEM <span className="text-red-600">AYARLARI</span></h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic">Vercel & Mobil Optimizasyon Modu</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-50"><ImageIcon className="text-red-600" size={20} /><h3 className="font-black uppercase text-xs tracking-widest italic">KURUMSAL LOGO</h3></div>
          <div className="flex flex-col items-center gap-6 py-2">
            <div className="w-44 h-44 bg-gray-50 rounded-[2.5rem] border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden"><Logo className="w-full h-full" overrideUrl={logo} /></div>
            <button onClick={() => fileInputRef.current?.click()} className="w-full py-4 bg-zinc-100 text-zinc-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 border-2 border-dashed border-zinc-200 shadow-sm">
               <Upload size={16} /> CİHAZDAN YÜKLE
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
               const file = e.target.files?.[0];
               if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setLogo(reader.result as string);
                  reader.readAsDataURL(file);
               }
            }} />
          </div>
          <button onClick={saveSettings} disabled={isSaving} className="w-full py-5 bg-red-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-zinc-900 transition-all">
             {isSaving ? 'GÜNCELLENİYOR...' : 'LOGOYU KAYDET'}
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-950 text-white p-8 rounded-[2.5rem] shadow-2xl">
             <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4"><Smartphone className="text-red-600" size={20} /><h3 className="font-black uppercase text-xs tracking-widest italic">SİSTEM DURUMU</h3></div>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl"><span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">YAZILIM SÜRÜMÜ</span><span className="text-[10px] font-black bg-white/10 px-3 py-1 rounded-full">{APP_VERSION}</span></div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl"><span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">HOSTİNG</span><span className="text-[10px] font-black text-blue-400 flex items-center gap-1.5"><ShieldCheck size={14} /> VERCEL AKTİF</span></div>
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-1 pt-20">
         <p className="text-[7px] font-black text-zinc-300 uppercase tracking-[0.4em] italic leading-none">BGB AKADEMİ YAZILIM ALTYAPISI</p>
         <div className="flex items-center gap-4 w-full max-w-xs">
            <div className="h-px bg-zinc-200 flex-1"></div>
            <h5 className="text-[11px] font-black text-zinc-900 uppercase tracking-[0.3em] italic whitespace-nowrap">
               powered by <span className="text-red-600">Engin Uludağ</span>
            </h5>
            <div className="h-px bg-zinc-200 flex-1"></div>
         </div>
      </div>
    </div>
  );
};

export default Settings;
