
import React, { useState, useRef } from 'react';
import { Settings as SettingsIcon, Upload, Trash2, CheckCircle2, RefreshCw, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import Logo from './Logo';

const Settings: React.FC = () => {
  const [logo, setLogo] = useState<string | null>(localStorage.getItem('bgb_custom_logo'));
  const [logoUrlInput, setLogoUrlInput] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setLogo(base64);
        setLogoUrlInput(''); // Dosya yüklenirse URL'yi temizle
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = () => {
    if (logoUrlInput.trim()) {
      setLogo(logoUrlInput.trim());
      setLogoUrlInput('');
    }
  };

  const saveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      if (logo) {
        localStorage.setItem('bgb_custom_logo', logo);
      } else {
        localStorage.removeItem('bgb_custom_logo');
      }
      
      // Tüm sisteme değişikliği duyur
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('logoUpdated'));
      
      setIsSaving(false);
      alert('Sistem ayarları başarıyla güncellendi!');
    }, 800);
  };

  const resetLogo = () => {
    if (confirm('Özel logoyu kaldırıp varsayılan kulüp logosuna dönmek istiyor musunuz?')) {
      setLogo(null);
    }
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
            <div className="w-40 h-40 bg-gray-50 rounded-[2.5rem] border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden relative group">
              {logo ? (
                <img src={logo.includes('drive.google.com') ? logo.replace('file/d/', 'uc?export=view&id=').split('/view')[0] : logo} alt="Önizleme" className="w-full h-full object-contain p-2" />
              ) : (
                <Logo className="w-24 h-24" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-[10px] text-white font-black uppercase tracking-widest">Logo Önizleme</p>
              </div>
            </div>

            <div className="w-full space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Google Drive veya Resim Linki Yapıştır..." 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:border-red-600 transition-all"
                  value={logoUrlInput}
                  onChange={(e) => setLogoUrlInput(e.target.value)}
                />
                <LinkIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <button 
                  onClick={handleUrlSubmit}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-zinc-900 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase"
                >
                  UYGULA
                </button>
              </div>

              <div className="relative">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 bg-zinc-100 text-zinc-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 border-2 border-dashed border-zinc-200"
                >
                  <Upload size={16} /> CİHAZDAN LOGO YÜKLE
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
              </div>
            </div>
          </div>

          {logo && (
            <button 
              onClick={resetLogo}
              className="w-full py-3 text-red-600 font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-50 rounded-xl transition-all"
            >
              <Trash2 size={14} /> VARSAYILAN LOGOYA DÖN
            </button>
          )}
        </div>

        {/* Bilgi ve İpuçları */}
        <div className="bg-zinc-950 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-center border-4 border-red-600/20">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <SettingsIcon size={150} className="rotate-12" />
          </div>
          <div className="relative z-10">
            <h4 className="text-2xl font-black uppercase italic tracking-tighter mb-4 leading-none">PROFESYONEL <br/><span className="text-red-600">GÖRÜNÜM</span></h4>
            <ul className="space-y-4 mb-8">
              {[
                "Logonuz otomatik olarak doğrudan resim linkine dönüştürülür.",
                "Google Drive linklerini olduğu gibi yapıştırabilirsiniz.",
                "Değişiklikler kaydedildiği an tüm veli ve sporcu panellerinde güncellenir.",
                "Resmi oyuncu kartları yeni logonuzla oluşturulur."
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1"><CheckCircle2 size={14} className="text-red-600" /></div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
            
            <button 
              onClick={saveSettings}
              disabled={isSaving}
              className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-red-900/40 hover:bg-white hover:text-red-600 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              {isSaving ? <RefreshCw size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
              {isSaving ? 'GÜNCELLENİYOR...' : 'SİSTEMİ GÜNCELLE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
