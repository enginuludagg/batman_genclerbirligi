
import React, { useRef, useState } from 'react';
import { Shield, Star, Award, Quote, Medal, Trophy, Activity, Zap, Phone, School, History, GraduationCap, Camera, Milestone, CheckCircle2, Loader2 } from 'lucide-react';
import { Trainer, AppMode } from '../types';
import Logo from './Logo';

interface Props {
  trainers: Trainer[];
  mode?: AppMode;
  onUpdateFounderPhoto?: (photoUrl: string) => void;
}

const AboutUs: React.FC<Props> = ({ trainers, mode, onUpdateFounderPhoto }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  const founder = trainers.find(t => t.name.toLowerCase().includes('engin')) || {
    id: 'founder-default',
    name: 'Engin Uludağ',
    specialty: 'Teknik Direktör ve Antrenör',
    phone: '0505 340 11 01',
    biography: '14 yıllık mesleki birikimiyle; TFF Futbol C, TVF Voleybol 2. Kademe ve TCF Artistik Cimnastik 2. Kademe lisanslarına sahip profesyonel bir teknik adamdır.',
    photoUrl: '',
    groups: ['Tüm Branşlar']
  };

  const optimizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.size > 20 * 1024 * 1024) {
        alert("Dosya çok büyük.");
        reject("File too large");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800; 
          let width = img.width;
          let height = img.height;
          
          if (width > MAX_WIDTH) { 
            height *= MAX_WIDTH / width; 
            width = MAX_WIDTH; 
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.60);
            resolve(dataUrl);
          } else {
            reject("Canvas error");
          }
        };
        img.onerror = () => reject("Image load error");
      };
      reader.onerror = () => reject("File read error");
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateFounderPhoto) {
      setIsOptimizing(true);
      try {
        const optimizedUrl = await optimizeImage(file);
        await onUpdateFounderPhoto(optimizedUrl);
      } catch (err) {
        console.error(err);
      } finally {
        setIsOptimizing(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 sm:space-y-24 animate-in fade-in duration-700 pb-32 px-2">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-zinc-950 rounded-[3rem] sm:rounded-[4rem] shadow-2xl border border-white/5">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/10 blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 p-8 sm:p-24 flex flex-col items-center text-center space-y-8 sm:space-y-12">
          <div className="w-24 h-24 sm:w-36 sm:h-36 bg-white rounded-[2rem] sm:rounded-[3rem] p-3 shadow-2xl border-4 border-red-600 animate-in zoom-in duration-1000">
             <Logo className="w-full h-full" />
          </div>
          
          <div className="space-y-4 sm:space-y-6 max-w-4xl">
            <h1 className="text-4xl sm:text-8xl font-black italic uppercase tracking-tighter leading-none text-white">
              BATMAN <span className="text-red-600">GENÇLERBİRLİĞİ<sup>®</sup></span>
            </h1>
            <div className="flex items-center justify-center gap-4">
               <div className="h-px bg-red-600 w-10 sm:w-16"></div>
               <p className="text-red-500 font-black uppercase text-[10px] sm:text-sm tracking-[0.3em] sm:tracking-[0.5em] italic leading-none whitespace-nowrap">PROFESYONEL SPOR AKADEMİSİ</p>
               <div className="h-px bg-red-600 w-10 sm:w-16"></div>
            </div>
            <p className="text-zinc-400 text-sm sm:text-2xl font-medium leading-relaxed italic max-w-3xl mx-auto px-2">
              14 yıllık mesleki tecrübe ve akademik disiplinle, Batman'ın gelecekteki yıldızlarını bilimsel metotlarla yetiştiriyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* 2. TEKNİK DİREKTÖR PROFİLİ */}
      <section className="space-y-8 sm:space-y-12">
        <div className="flex flex-col items-center text-center space-y-4">
           <span className="bg-zinc-100 text-zinc-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-zinc-200">TEKNİK YÖNETİM</span>
           <h2 className="text-3xl sm:text-6xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">
             TEKNİK DİREKTÖR <span className="text-red-600"><br className="sm:hidden"/>VE ANTRENÖR</span>
           </h2>
        </div>

        <div className="bg-white rounded-[3rem] sm:rounded-[4rem] overflow-hidden shadow-2xl border border-gray-100 flex flex-col lg:flex-row relative group">
           
           {/* FOTOĞRAF ALANI */}
           <div className="lg:w-2/5 relative h-[400px] sm:h-[600px] bg-zinc-950 overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
              
              {founder.photoUrl ? (
                <img src={founder.photoUrl} className="w-full h-full object-cover object-top relative z-0" alt={founder.name} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white/5 relative z-0">
                  <span className="text-[8rem] sm:text-[12rem] font-black italic leading-none select-none">BGB</span>
                </div>
              )}

              {/* GÜNCELLEME BUTONU - Z-INDEX VE POZİSYON İYİLEŞTİRİLDİ */}
              {mode === 'admin' && (
                <div className="absolute bottom-6 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-auto">
                  <button 
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    disabled={isOptimizing}
                    className="bg-white text-zinc-900 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:bg-red-600 hover:text-white transition-all active:scale-95 disabled:opacity-70 cursor-pointer border-2 border-transparent hover:border-white"
                  >
                    {isOptimizing ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                    {isOptimizing ? 'YÜKLENİYOR...' : 'RESMİ GÜNCELLE'}
                  </button>
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />

              <div className="absolute top-6 left-6 z-30">
                 <div className="p-3 bg-zinc-900 text-white rounded-2xl shadow-2xl border-2 border-red-600">
                    <GraduationCap size={24} />
                 </div>
              </div>
           </div>

           {/* DETAYLAR */}
           <div className="lg:w-3/5 p-8 sm:p-20 flex flex-col justify-center space-y-8 sm:space-y-10 relative">
              <div className="space-y-4 sm:space-y-6">
                 <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-zinc-900 text-white px-4 py-2 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest italic shadow-lg">AKADEMİK LİYAKAT</span>
                    <div className="flex gap-1 text-red-600">
                       {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                    </div>
                 </div>
                 <h3 className="text-4xl sm:text-7xl font-black italic uppercase tracking-tighter text-zinc-950 leading-none">{founder.name}</h3>
                 
                 <div className="flex flex-wrap gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 sm:px-5 sm:py-3 rounded-2xl shadow-xl"><Trophy size={14} className="text-red-500" /> <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-widest">TFF Futbol C</span></div>
                    <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 sm:px-5 sm:py-3 rounded-2xl shadow-xl"><Activity size={14} className="text-red-500" /> <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-widest">TVF Voleybol 2.K</span></div>
                 </div>
              </div>

              <div className="space-y-6 sm:space-y-8">
                 <p className="text-sm sm:text-2xl text-zinc-700 font-bold italic leading-relaxed">
                    14 yılı aşkın saha tecrübesi ve resmi federasyon lisanslarıyla; çocuklarımızın fiziksel kapasitelerini ve sporcu ahlaklarını en üst seviyeye çıkarmayı hedefliyoruz.
                 </p>
              </div>

              <div className="pt-8 sm:pt-10 flex flex-col sm:flex-row items-center justify-between border-t border-zinc-100 gap-6">
                 <button 
                  onClick={() => window.open(`https://wa.me/905053401101`, '_blank')}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-zinc-950 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-2xl active:scale-95"
                 >
                    <Phone size={18} /> TEKNİK DİREKTÖR İLE İLETİŞİM
                 </button>
              </div>
           </div>
        </div>
      </section>

      {/* 3. DİĞER ANTRENÖRLER */}
      <section className="space-y-8 sm:space-y-12">
        <div className="flex flex-col items-center text-center space-y-4">
           <h2 className="text-2xl sm:text-5xl font-black italic uppercase tracking-tighter text-zinc-900">
             ANTRENÖR <span className="text-red-600">KADROMUZ</span>
           </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
           {trainers.filter(t => !t.name.toLowerCase().includes('engin')).map(trainer => (
             <div key={trainer.id} className="bg-white p-6 sm:p-8 rounded-[2.5rem] sm:rounded-[3rem] border border-zinc-100 shadow-xl flex items-center gap-4 sm:gap-6 group hover:border-red-600 transition-all">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-zinc-950 rounded-[2rem] flex-shrink-0 overflow-hidden relative border-2 border-zinc-900 shadow-lg">
                   {trainer.photoUrl ? (
                     <img src={trainer.photoUrl} className="w-full h-full object-cover" alt={trainer.name} />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-white text-3xl font-black italic">{trainer.name[0]}</div>
                   )}
                </div>
                <div>
                   <h4 className="text-lg sm:text-xl font-black italic uppercase text-zinc-900 leading-none mb-2">{trainer.name}</h4>
                   <p className="text-[9px] sm:text-[10px] font-black text-red-600 uppercase tracking-widest mb-3 sm:mb-4 italic">{trainer.specialty}</p>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* 4. FOOTER */}
      <section className="text-center space-y-10 py-16 sm:py-24 bg-zinc-950 rounded-[3rem] sm:rounded-[4rem] text-white relative overflow-hidden">
         <div className="flex justify-center gap-6 relative z-10">
            <Shield size={48} className="text-red-600" />
            <Award size={48} className="text-white/20" />
            <CheckCircle2 size={48} className="text-white/20" />
         </div>
         <div className="space-y-6 max-w-2xl mx-auto px-6 relative z-10">
            <h3 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter">BGB <span className="text-red-600">GELİŞİM VİZYONU</span></h3>
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
               Disiplinli eğitim ve sporcu ahlakıyla, her öğrencimizi geleceğe en güçlü şekilde hazırlamaya söz veriyoruz.
            </p>
         </div>
      </section>
    </div>
  );
};

export default AboutUs;
