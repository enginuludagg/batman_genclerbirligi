
import React, { useState, useRef } from 'react';
import { Settings as SettingsIcon, Upload, AlertTriangle, Image as ImageIcon, Smartphone, ShieldCheck, Trash2, Terminal, CheckCircle2, Rocket } from 'lucide-react';
import Logo from './Logo';

const APP_VERSION = "V.1.5.0 (STABLE)";

const Settings: React.FC = () => {
  const [logo, setLogo] = useState<string | null>(localStorage.getItem('bgb_custom_logo'));
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const optimizeLogo = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 300; // Logo için küçük boyut yeterli
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/png', 0.7));
        };
      };
    });
  };

  const saveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      try {
        if (logo) {
            localStorage.setItem('bgb_custom_logo', logo);
        }
        window.dispatchEvent(new Event('logoUpdated'));
        alert('Sistem ayarları başarıyla güncellendi!');
      } catch (e) {
        console.error(e);
        alert("HATA: Resim boyutu çok büyük! Lütfen daha küçük veya düşük çözünürlüklü bir logo deneyin.");
      } finally {
        setIsSaving(false);
      }
    }, 800);
  };

  const handleFactoryReset = () => {
    const password = prompt("DİKKAT: Tüm verileri silmek üzeresiniz!\nDevam etmek için yönetici şifresini giriniz:");
    
    if (password === "Eu290202") {
      if (window.confirm("EMİN MİSİNİZ? Bu işlem tüm sporcu, antrenman ve finans kayıtlarını temizleyecek ve uygulamayı en başa döndürecektir.")) {
        localStorage.clear();
        alert("Sistem başarıyla sıfırlandı. Sayfa yenileniyor...");
        window.location.reload();
      }
    } else if (password !== null) {
      alert("Hatalı şifre! İşlem güvenlik nedeniyle engellendi.");
    }
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
        <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-50"><ImageIcon className="text-red-600" size={20} /><h3 className="font-black uppercase text-xs tracking-widest italic">KURUMSAL LOGO</h3></div>
            <div className="flex flex-col items-center gap-6 py-2">
                <div className="w-44 h-44 bg-gray-50 rounded-[2.5rem] border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden"><Logo className="w-full h-full" overrideUrl={logo} /></div>
                <button onClick={() => fileInputRef.current?.click()} className="w-full py-4 bg-zinc-100 text-zinc-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 border-2 border-dashed border-zinc-200 shadow-sm">
                <Upload size={16} /> CİHAZDAN YÜKLE
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                      const optimized = await optimizeLogo(file);
                      setLogo(optimized);
                  }
                }} />
            </div>
            <button onClick={saveSettings} disabled={isSaving} className="w-full py-5 bg-red-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-zinc-900 transition-all">
                {isSaving ? 'GÜNCELLENİYOR...' : 'LOGOYU KAYDET'}
            </button>
            </div>
            
            {/* YAYINA ALMA REHBERİ KARTI */}
            <div className="bg-zinc-900 text-white p-8 rounded-[2.5rem] shadow-2xl border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><Terminal size={80} /></div>
                
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4 relative z-10">
                    <Terminal className="text-green-500" size={20} />
                    <h3 className="font-black uppercase text-xs tracking-widest italic">SİTEYİ YAYINA ALMA REHBERİ</h3>
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="space-y-4 text-[10px] font-bold text-zinc-400">
                        <p>Sorun çözüldü! .firebaserc dosyası eklendi. Artık terminale sadece şunu yazman yeterli:</p>
                        
                        <div className="bg-black/50 p-5 rounded-2xl border border-white/5 font-mono text-green-400 space-y-5 select-text shadow-inner">
                            <div className="space-y-1 opacity-50">
                                <p className="text-[8px] text-zinc-500 uppercase font-black flex items-center gap-2"><CheckCircle2 size={10} /> 1. ADIM: KURULUM</p>
                                <div className="flex gap-3 items-center">
                                    <span className="bg-white/5 px-2 py-1.5 rounded w-full border border-green-500/20 text-green-300 line-through decoration-white/30">npm install</span>
                                </div>
                            </div>

                            <div className="space-y-1 opacity-50">
                                <p className="text-[8px] text-zinc-500 uppercase font-black flex items-center gap-2"><CheckCircle2 size={10} /> 2. ADIM: OLUŞTUR</p>
                                <div className="flex gap-3 items-center">
                                    <span className="bg-white/5 px-2 py-1.5 rounded w-full line-through decoration-white/30">npm run build</span>
                                </div>
                            </div>

                            <div className="space-y-1 opacity-50">
                                <p className="text-[8px] text-zinc-500 uppercase font-black flex items-center gap-2"><CheckCircle2 size={10} /> 3. ADIM: GİRİŞ</p>
                                <div className="flex gap-3 items-center">
                                    <span className="bg-white/5 px-2 py-1.5 rounded w-full text-green-300 line-through decoration-white/30">npx firebase-tools login</span>
                                </div>
                            </div>

                            <div className="space-y-1 p-2 bg-green-900/20 rounded-lg border border-green-700/30 animate-pulse">
                                <p className="text-[8px] text-green-400 uppercase font-black flex items-center gap-2"><Rocket size={10} /> 4. SON ADIM: YAYINLA!</p>
                                <p className="text-[8px] text-zinc-400 italic mb-1.5">Artık proje seçmene gerek yok, otomatik tanıyacak:</p>
                                <div className="flex gap-3 items-center">
                                    <span className="bg-black/40 px-2 py-1.5 rounded w-full text-green-300 font-bold border border-green-500/30">npx firebase-tools deploy</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-950 text-white p-8 rounded-[2.5rem] shadow-2xl">
             <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4"><Smartphone className="text-red-600" size={20} /><h3 className="font-black uppercase text-xs tracking-widest italic">SİSTEM DURUMU</h3></div>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl"><span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">YAZILIM SÜRÜMÜ</span><span className="text-[10px] font-black bg-white/10 px-3 py-1 rounded-full text-green-400">{APP_VERSION}</span></div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl"><span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">HOSTİNG</span><span className="text-[10px] font-black text-blue-400 flex items-center gap-1.5"><ShieldCheck size={14} /> FIREBASE AKTİF</span></div>
             </div>
          </div>

          <div className="bg-red-50 border-2 border-red-100 p-6 rounded-[2.5rem] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10"><AlertTriangle size={64} className="text-red-600" /></div>
             <h4 className="text-[#E30613] font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2"><AlertTriangle size={14} /> TEHLİKELİ BÖLGE</h4>
             <p className="text-[10px] text-red-400 font-bold mb-6 max-w-xs leading-relaxed uppercase">
               Bu işlem tüm verileri (öğrenciler, finans, antrenmanlar) yerel hafızadan siler.
             </p>
             <button 
               onClick={handleFactoryReset}
               className="w-full py-4 bg-white border-2 border-red-200 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm flex items-center justify-center gap-2"
             >
               <Trash2 size={16} /> TÜM VERİLERİ SIFIRLA
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
