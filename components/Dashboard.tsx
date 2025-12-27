
import React, { useState } from 'react';
import { Users, Activity, Award, Newspaper, ChevronRight, ArrowUpRight, ShieldAlert, Sparkles, Image as ImageIcon, CalendarCheck, UserPlus, UserCheck, Wallet, MessageSquare, QrCode, ScanLine, X, ShieldCheck, MessageCircle } from 'lucide-react';
import { AppContextData, AppMode, ViewType, Student } from '../types';
import Logo from './Logo';

interface DashboardProps {
  context: AppContextData;
  appMode: AppMode;
  onNavigate: (view: ViewType, subTab?: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ context, appMode, onNavigate }) => {
  const [showIdCard, setShowIdCard] = useState(false);
  const publishedMedia = context.media.filter(m => m.status === 'published');
  const recentBulletins = publishedMedia.filter(m => m.type === 'bulletin').slice(0, 3);
  const recentGallery = publishedMedia.filter(m => m.type === 'gallery').slice(0, 4);
  
  const currentStudent = context.students[0];

  const quickActions = [
    { id: 'students', label: 'ÖĞRENCİ EKLE', icon: UserPlus, color: 'bg-blue-600', view: 'students' },
    { id: 'qr-scan', label: 'QR OKUT', icon: ScanLine, color: 'bg-zinc-900', view: 'attendance' },
    { id: 'finance', label: 'AİDAT GİRİŞİ', icon: Wallet, color: 'bg-orange-600', view: 'finance' },
    { id: 'ai-coach', label: 'AI ANALİZ', icon: MessageSquare, color: 'bg-red-600', view: 'ai-coach' }
  ];

  const contactAdmin = () => {
    const text = encodeURIComponent("Merhaba Engin Hocam, BGB Akademi hakkında bir sorum olacaktı.");
    window.open(`https://wa.me/905053401101?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-8 w-full animate-in fade-in duration-700 pb-20">
      
      {/* Borç Uyarı Bandı (Sadece Veliler İçin) - Buton İsmi Güncellendi */}
      {appMode === 'parent' && currentStudent?.feeStatus !== 'Paid' && (
        <div className="bg-[#E30613] text-white p-5 rounded-[2rem] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse border-2 border-white/20">
          <div className="flex items-center gap-4 text-center sm:text-left">
             <div className="p-3 bg-white/20 rounded-2xl"><ShieldAlert size={24} /></div>
             <div>
               <h4 className="font-black text-xs uppercase italic tracking-widest">ÖDEME HATIRLATMASI</h4>
               <p className="text-[10px] font-bold opacity-90 uppercase">Sayın Velimiz, sporcumuzun aidat ödemesi beklemektedir. Lütfen yönetime bilgi veriniz.</p>
             </div>
          </div>
          <button onClick={contactAdmin} className="px-8 py-3 bg-white text-[#E30613] rounded-xl font-black text-[10px] uppercase shadow-lg active:scale-95 flex items-center gap-2">
            <MessageCircle size={14} /> BİLGİ AL
          </button>
        </div>
      )}

      {/* Club Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white p-0.5 rounded-2xl shadow-xl border-2 border-[#E30613] flex items-center justify-center flex-shrink-0 overflow-hidden relative">
             <Logo className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
              BATMAN <span className="text-[#E30613]">GENÇLERBİRLİĞİ</span>
            </h2>
            <p className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-1 italic tracking-[0.4em]">AKADEMİ YÖNETİM MERKEZİ</p>
          </div>
        </div>
        
        {/* Veli Dashboard Butonları - 'Hocaya Yaz' ismi 'İLETİŞİM & DESTEK' yapıldı */}
        {appMode === 'parent' && (
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={() => setShowIdCard(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-zinc-950 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all hover:bg-[#E30613]"
            >
              <QrCode size={20} /> DİJİTAL KİMLİK
            </button>
            <button 
              onClick={contactAdmin}
              className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-green-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
            >
              <MessageCircle size={20} /> İLETİŞİM & DESTEK
            </button>
          </div>
        )}
      </div>

      {/* Admin Quick Actions */}
      {appMode === 'admin' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map(action => (
            <button
              key={action.id}
              onClick={() => onNavigate(action.view as ViewType)}
              className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center gap-3 hover:border-[#E30613] transition-all group active:scale-95"
            >
              <div className={`${action.color} text-white p-3 rounded-2xl group-hover:rotate-6 transition-transform shadow-lg`}>
                <action.icon size={18} />
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Media Feed Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-slate-950 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden group min-h-[350px] flex flex-col justify-end border-2 border-white/5">
              <div className="absolute inset-0 opacity-40">
                <img src={publishedMedia[0]?.imageUrl || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200'} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
              
              <div className="relative z-10 space-y-4">
                 <div className="flex gap-2">
                    <span className="bg-[#E30613] text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-lg text-white shadow-xl italic">SON HABER</span>
                    {appMode === 'parent' && (
                      <span className="bg-zinc-800 text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-lg text-white italic border border-white/10 flex items-center gap-1.5">
                        <Award size={10} className="text-yellow-500" /> {currentStudent?.badges?.length || 0} BAŞARI
                      </span>
                    )}
                 </div>
                 <h3 className="text-2xl sm:text-5xl font-black text-white uppercase italic tracking-tighter leading-tight max-w-xl">
                   {publishedMedia[0]?.title || "YENİ DÖNEM KAYITLARIMIZ VE ANTRENMAN PROGRAMIMIZ YAYINLANDI"}
                 </h3>
                 <button onClick={() => onNavigate('media')} className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center gap-3 hover:bg-[#E30613] hover:text-white transition-all shadow-2xl active:scale-95">
                   HABERİN DEVAMI <ArrowUpRight size={14} />
                 </button>
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                 <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 italic flex items-center gap-2">
                   <Newspaper size={14} className="text-[#E30613]" /> AKADEMİ BÜLTENİ
                 </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {recentBulletins.length > 0 ? recentBulletins.map(post => (
                   <div key={post.id} className="bg-white p-5 rounded-[2rem] border border-slate-50 shadow-sm flex flex-col gap-3 group hover:border-red-200 transition-all cursor-pointer" onClick={() => onNavigate('media')}>
                      {post.imageUrl && (
                        <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 relative">
                           <img src={post.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                      )}
                      <div className="px-2">
                        <h5 className="font-black text-xs uppercase italic line-clamp-1 group-hover:text-[#E30613] transition-colors">{post.title}</h5>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 line-clamp-2 italic">{post.content}</p>
                      </div>
                   </div>
                 )) : (
                   <p className="text-[10px] font-black text-slate-300 uppercase p-8 italic bg-white rounded-[2rem] border border-dashed text-center md:col-span-2">Henüz bülten yayınlanmadı.</p>
                 )}
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-50">
              <div className="flex items-center justify-between mb-6">
                 <h4 className="font-black uppercase text-[10px] italic text-slate-900 flex items-center gap-2">
                   <ImageIcon size={14} className="text-[#E30613]" /> AKADEMİ GALERİ
                 </h4>
                 <button onClick={() => onNavigate('media', 'gallery')} className="text-[8px] font-black text-[#E30613] uppercase">TÜMÜ</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                 {recentGallery.length > 0 ? recentGallery.map(img => (
                   <div key={img.id} className="aspect-square rounded-2xl overflow-hidden bg-slate-100 relative group cursor-pointer" onClick={() => onNavigate('media', 'gallery')}>
                      <img src={img.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                   </div>
                 )) : (
                   <div className="col-span-2 aspect-video bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-100">
                      <p className="text-[8px] font-black text-slate-300 uppercase">Fotoğraf Yok</p>
                   </div>
                 )}
              </div>
           </div>

           <div className="bg-[#E30613] text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
              <ShieldAlert size={100} className="absolute -right-4 -bottom-4 opacity-20 rotate-12" />
              <h4 className="text-xl font-black uppercase italic tracking-tighter mb-4 leading-tight">GELİŞİM <br/>DİSİPLİNİ</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-90 leading-relaxed mb-6 italic">
                Antrenmanlara 15 dakika önce gelmeniz saha içi konsantrasyon için hayati önem taşır. 
              </p>
              <button onClick={() => onNavigate('schedule')} className="bg-zinc-950 text-white px-8 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl active:scale-95 hover:bg-white hover:text-[#E30613] transition-all">PROGRAMI İNCELE</button>
           </div>
        </div>
      </div>

      {/* Dijital Kimlik Modal */}
      {showIdCard && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
           <div className="relative w-full max-w-sm">
             <button onClick={() => setShowIdCard(false)} className="absolute -top-12 right-0 text-white flex items-center gap-2 font-black text-[10px] uppercase">KAPAT <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center"><X size={16}/></div></button>
             
             <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
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
                      <QrCode size={140} className="text-zinc-900 group-hover:scale-110 transition-transform" />
                      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm opacity-0 group-active:opacity-100 flex items-center justify-center transition-opacity">
                         <span className="text-[8px] font-black uppercase text-zinc-900">GEÇERLİ KOD</span>
                      </div>
                      <p className="mt-4 text-[7px] font-black text-zinc-300 uppercase tracking-widest italic">TESİS GİRİŞİNDE OKUTUNUZ</p>
                   </div>

                   <div className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-50 rounded-2xl border border-green-100">
                      <ShieldCheck size={14} className="text-green-600" />
                      <span className="text-[9px] font-black text-green-700 uppercase tracking-widest">RESMİ SPORCU LİSANSI AKTİF</span>
                   </div>
                </div>
                
                <div className="bg-gray-50 p-4 text-center">
                   <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em]">BATMAN GENÇLERBİRLİĞİ SK</p>
                </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
