
import React, { useState, useEffect } from 'react';
import { Users, Activity, Award, Newspaper, ChevronRight, ArrowUpRight, ShieldAlert, Sparkles, Image as ImageIcon, CalendarCheck, UserPlus, UserCheck, Wallet, MessageSquare, QrCode, ScanLine, X, ShieldCheck, MessageCircle, CloudSun, Timer, MapPin, Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import { AppContextData, AppMode, ViewType, Student, TrainingSession } from '../types';
import Logo from './Logo';

interface DashboardProps {
  context: AppContextData;
  appMode: AppMode;
  onNavigate: (view: ViewType, subTab?: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ context, appMode, onNavigate }) => {
  const [showIdCard, setShowIdCard] = useState(false);
  const [nextSession, setNextSession] = useState<TrainingSession | null>(null);
  
  const publishedMedia = context.media.filter(m => m.status === 'published');
  const recentBulletins = publishedMedia.filter(m => m.type === 'bulletin').slice(0, 3);
  const recentGallery = publishedMedia.filter(m => m.type === 'gallery').slice(0, 4);
  const currentStudent = context.students[0];

  // İstatistikler
  const activeStudentCount = context.students.filter(s => s.status === 'active').length;
  const totalBalance = context.finance.reduce((acc, curr) => curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0);
  const nextMatch = context.fixtures.filter(f => f.status === 'scheduled')[0];

  useEffect(() => {
    if (context.sessions.length > 0) {
      // Basit mantık: İlk seansı göster (Gelişmiş tarih kontrolü eklenebilir)
      setNextSession(context.sessions[0]);
    }
  }, [context.sessions]);

  const quickActions = [
    { id: 'students', label: 'SPORCU EKLE', icon: UserPlus, color: 'bg-blue-600', view: 'students' },
    { id: 'qr-scan', label: 'QR OKUT', icon: ScanLine, color: 'bg-zinc-900', view: 'attendance' },
    { id: 'finance', label: 'AİDAT AL', icon: Wallet, color: 'bg-orange-600', view: 'finance' },
    { id: 'ai-coach', label: 'AI ANALİZ', icon: MessageSquare, color: 'bg-red-600', view: 'ai-coach' }
  ];

  const contactAdmin = () => {
    const text = encodeURIComponent("Merhaba Engin Hocam, BGB Akademi hakkında bir sorum olacaktı.");
    window.open(`https://wa.me/905053401101?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-700 pb-24">
      
      {/* Header & Karşılama */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white p-0.5 rounded-2xl shadow-xl border-2 border-[#E30613] flex items-center justify-center flex-shrink-0 overflow-hidden relative">
             <Logo className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
              BATMAN <span className="text-[#E30613]">GENÇLERBİRLİĞİ<sup>®</sup></span>
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">AKADEMİ YÖNETİM PANELİ</p>
            </div>
          </div>
        </div>
      </div>

      {/* CANLI İSTATİSTİK KARTLARI (YENİ) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-white p-6 rounded-[2rem] border border-blue-50 shadow-sm flex items-center gap-4 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Users size={64} className="text-blue-600" /></div>
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><Users size={24} /></div>
            <div>
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">KAYITLI SPORCU</p>
               <h3 className="text-2xl font-black text-slate-900 italic">{activeStudentCount} <span className="text-sm text-gray-400 not-italic font-bold">/ {context.students.length}</span></h3>
            </div>
         </div>

         <div onClick={() => onNavigate('finance')} className="bg-white p-6 rounded-[2rem] border border-green-50 shadow-sm flex items-center gap-4 relative overflow-hidden group cursor-pointer hover:border-green-200 transition-all">
            <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Wallet size={64} className="text-green-600" /></div>
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600"><Wallet size={24} /></div>
            <div>
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">KASA DURUMU</p>
               <h3 className={`text-2xl font-black italic ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>₺{totalBalance.toLocaleString()}</h3>
            </div>
         </div>

         <div onClick={() => onNavigate('league')} className="bg-zinc-900 p-6 rounded-[2rem] shadow-xl flex items-center gap-4 relative overflow-hidden group cursor-pointer">
            <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Trophy size={64} className="text-white" /></div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-orange-500"><Trophy size={24} /></div>
            <div className="relative z-10 flex-1">
               <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">SIRADAKİ MAÇ</p>
               {nextMatch ? (
                 <>
                   <h3 className="text-lg font-black text-white italic uppercase truncate leading-none">{nextMatch.awayTeam}</h3>
                   <p className="text-[10px] font-bold text-zinc-400 uppercase mt-1 flex items-center gap-1"><CalendarCheck size={12} /> {nextMatch.date} • {nextMatch.time}</p>
                 </>
               ) : (
                 <p className="text-xs font-black text-zinc-500 italic">FİKSTÜR YOK</p>
               )}
            </div>
         </div>
      </div>

      {/* Veli Modu Aksiyonları */}
      {appMode === 'parent' && (
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setShowIdCard(true)}
            className="flex flex-col items-center justify-center gap-2 bg-zinc-900 text-white p-5 rounded-[1.5rem] shadow-xl active:scale-95 transition-all relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <QrCode size={24} className="mb-1" />
            <span className="font-black text-[10px] uppercase tracking-widest">DİJİTAL KİMLİK</span>
          </button>
          <button 
            onClick={contactAdmin}
            className="flex flex-col items-center justify-center gap-2 bg-[#E30613] text-white p-5 rounded-[1.5rem] shadow-xl active:scale-95 transition-all"
          >
            <MessageCircle size={24} className="mb-1" />
            <span className="font-black text-[10px] uppercase tracking-widest">HOCAYA YAZ</span>
          </button>
        </div>
      )}

      {/* Admin Hızlı İşlemler */}
      {appMode === 'admin' && (
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map(action => (
            <button
              key={action.id}
              onClick={() => onNavigate(action.view as ViewType)}
              className="bg-white p-3 py-4 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col items-center gap-2 hover:border-[#E30613] transition-all group active:scale-95"
            >
              <div className={`${action.color} text-white p-2.5 rounded-xl group-hover:scale-110 transition-transform shadow-lg`}>
                <action.icon size={16} />
              </div>
              <span className="text-[7px] font-black uppercase tracking-widest text-slate-600 text-center leading-tight">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Haber Manşet */}
      <div className="bg-zinc-950 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden group min-h-[300px] flex flex-col justify-end border border-white/10 cursor-pointer" onClick={() => onNavigate('media')}>
          <div className="absolute inset-0 opacity-50">
            <img src={publishedMedia[0]?.imageUrl || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200'} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          
          <div className="relative z-10 space-y-3">
              <span className="bg-[#E30613] w-fit text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-lg text-white shadow-lg flex items-center gap-1.5">
                <Sparkles size={10} /> AKADEMİ GÜNDEMİ
              </span>
              <h3 className="text-2xl sm:text-4xl font-black text-white uppercase italic tracking-tighter leading-none max-w-xl">
                {publishedMedia[0]?.title || "YENİ DÖNEM KAYITLARIMIZ VE ANTRENMAN PROGRAMIMIZ YAYINLANDI"}
              </h3>
              <p className="text-[10px] text-gray-300 font-bold line-clamp-2 max-w-lg">
                {publishedMedia[0]?.content || "Batman Gençlerbirliği olarak yeni sezonda şampiyonluk parolasıyla sahaya çıkıyoruz. Detaylar için tıklayınız."}
              </p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Bülten Listesi */}
         <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
               <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 italic flex items-center gap-2">
                 <Newspaper size={14} className="text-[#E30613]" /> SON DUYURULAR
               </h4>
               <button onClick={() => onNavigate('media')} className="text-[9px] font-black text-[#E30613] uppercase">TÜMÜ</button>
            </div>
            <div className="space-y-3">
               {recentBulletins.length > 0 ? recentBulletins.map(post => (
                 <div key={post.id} onClick={() => onNavigate('media')} className="bg-white p-4 rounded-[1.5rem] border border-slate-50 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex-shrink-0 overflow-hidden">
                       {post.imageUrl ? <img src={post.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={20} /></div>}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-black text-[10px] uppercase text-zinc-900 italic line-clamp-1">{post.title}</h5>
                      <p className="text-[9px] text-slate-400 font-bold mt-1 line-clamp-2">{post.content}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300" />
                 </div>
               )) : (
                 <div className="p-6 bg-white border border-dashed rounded-[1.5rem] text-center text-[9px] font-black text-gray-300 uppercase">Duyuru bulunmuyor</div>
               )}
            </div>
         </div>

         {/* Galeri Grid */}
         <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
               <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 italic flex items-center gap-2">
                 <ImageIcon size={14} className="text-[#E30613]" /> GALERİ
               </h4>
               <button onClick={() => onNavigate('media', 'gallery')} className="text-[9px] font-black text-[#E30613] uppercase">TÜMÜ</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
               {recentGallery.length > 0 ? recentGallery.map(img => (
                 <div key={img.id} onClick={() => onNavigate('media', 'gallery')} className="aspect-square rounded-[1.5rem] overflow-hidden bg-gray-100 relative">
                    <img src={img.imageUrl} className="w-full h-full object-cover" />
                 </div>
               )) : (
                 <div className="col-span-2 p-6 bg-white border border-dashed rounded-[1.5rem] text-center text-[9px] font-black text-gray-300 uppercase">Fotoğraf yok</div>
               )}
            </div>
         </div>
      </div>

      {/* Dijital Kimlik Modal */}
      {showIdCard && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
           <div className="relative w-full max-w-sm animate-in zoom-in-95 duration-300">
             <button onClick={() => setShowIdCard(false)} className="absolute -top-12 right-0 text-white flex items-center gap-2 font-black text-[10px] uppercase">KAPAT <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center"><X size={16}/></div></button>
             
             <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="bg-zinc-950 p-8 text-center relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                   <Logo className="w-16 h-16 mx-auto mb-4 relative z-10" />
                   <h3 className="text-white font-black italic uppercase tracking-tighter text-xl leading-none relative z-10">BGB AKADEMİ <br/><span className="text-[#E30613]">DİJİTAL KİMLİK</span></h3>
                </div>

                <div className="p-8 space-y-8 flex flex-col items-center">
                   <div className="w-32 h-32 bg-gray-50 rounded-[2.5rem] border-4 border-gray-100 overflow-hidden shadow-xl">
                      {currentStudent?.photoUrl ? <img src={currentStudent.photoUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl font-black italic">{currentStudent?.name[0]}</div>}
                   </div>
                   
                   <div className="text-center">
                      <h4 className="text-xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">{currentStudent?.name}</h4>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2">{currentStudent?.branchId} - {currentStudent?.sport}</p>
                   </div>

                   <div className="w-full aspect-square bg-white border-2 border-gray-100 rounded-[2.5rem] p-6 flex flex-col items-center justify-center shadow-inner relative group">
                      <QrCode size={140} className="text-zinc-900" />
                      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm opacity-0 group-active:opacity-100 flex items-center justify-center transition-opacity">
                         <span className="text-[8px] font-black uppercase text-zinc-900">GEÇERLİ KOD</span>
                      </div>
                      <p className="mt-4 text-[7px] font-black text-zinc-300 uppercase tracking-widest italic">TESİS GİRİŞİNDE OKUTUNUZ</p>
                   </div>

                   <div className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-50 rounded-2xl border border-green-100">
                      <ShieldCheck size={14} className="text-green-600" />
                      <span className="text-[9px] font-black text-green-700 uppercase tracking-widest">LİSANS AKTİF</span>
                   </div>
                </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
