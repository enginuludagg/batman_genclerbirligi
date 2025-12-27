
import React from 'react';
import { Users, Activity, Award, Newspaper, ChevronRight, ArrowUpRight, ShieldAlert, Sparkles, Image as ImageIcon, CalendarCheck, UserPlus, UserCheck, Wallet, MessageSquare } from 'lucide-react';
import { AppContextData, AppMode, ViewType } from '../types';
import Logo from './Logo';

interface DashboardProps {
  context: AppContextData;
  appMode: AppMode;
  onNavigate: (view: ViewType, subTab?: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ context, appMode, onNavigate }) => {
  const publishedMedia = context.media.filter(m => m.status === 'published');
  const recentBulletins = publishedMedia.filter(m => m.type === 'bulletin').slice(0, 3);
  const recentGallery = publishedMedia.filter(m => m.type === 'gallery').slice(0, 4);
  
  const quickActions = [
    { id: 'students', label: 'ÖĞRENCİ EKLE', icon: UserPlus, color: 'bg-blue-600', view: 'students' },
    { id: 'attendance', label: 'YOKLAMA AL', icon: UserCheck, color: 'bg-green-600', view: 'attendance' },
    { id: 'finance', label: 'AİDAT GİRİŞİ', icon: Wallet, color: 'bg-orange-600', view: 'finance' },
    { id: 'ai-coach', label: 'AI ANALİZ', icon: MessageSquare, color: 'bg-red-600', view: 'ai-coach' }
  ];

  return (
    <div className="space-y-8 w-full animate-in fade-in duration-700 pb-20">
      {/* Club Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white p-0.5 rounded-2xl shadow-xl border-2 border-red-600 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
             <Logo className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
              BATMAN <span className="text-red-600">GENÇLERBİRLİĞİ</span>
            </h2>
            <p className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-1 italic">AKADEMİ YÖNETİM MERKEZİ</p>
          </div>
        </div>
      </div>

      {/* Admin Quick Actions */}
      {appMode === 'admin' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map(action => (
            <button
              key={action.id}
              onClick={() => onNavigate(action.view as ViewType)}
              className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center gap-3 hover:border-red-600 transition-all group active:scale-95"
            >
              <div className={`${action.color} text-white p-3 rounded-2xl group-hover:rotate-6 transition-transform`}>
                <action.icon size={18} />
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Media Feed Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* En Son Bültenler ve Haberler */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-slate-950 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden group min-h-[300px] flex flex-col justify-end">
              <div className="absolute inset-0 opacity-40">
                <img src={publishedMedia[0]?.imageUrl || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200'} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
              
              <div className="relative z-10 space-y-4">
                 <div className="flex gap-2">
                    <span className="bg-red-600 text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-lg text-white shadow-xl italic">SON HABER</span>
                 </div>
                 <h3 className="text-2xl sm:text-4xl font-black text-white uppercase italic tracking-tighter leading-tight max-w-xl">
                   {publishedMedia[0]?.title || "YENİ DÖNEM KAYITLARIMIZ VE ANTRENMAN PROGRAMIMIZ YAYINLANDI"}
                 </h3>
                 <button onClick={() => onNavigate('media')} className="bg-white text-slate-950 px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all">
                   TÜM HABERLER <ArrowUpRight size={14} />
                 </button>
              </div>
           </div>

           {/* Haber Listesi */}
           <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                 <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 italic flex items-center gap-2">
                   <Newspaper size={14} className="text-red-600" /> SON BÜLTENLER
                 </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {recentBulletins.length > 0 ? recentBulletins.map(post => (
                   <div key={post.id} className="bg-white p-5 rounded-[2rem] border border-slate-50 shadow-sm flex flex-col gap-3 group hover:border-red-200 transition-all cursor-pointer" onClick={() => onNavigate('media')}>
                      {post.imageUrl && (
                        <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100">
                           <img src={post.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                      )}
                      <div>
                        <h5 className="font-black text-xs uppercase italic line-clamp-1">{post.title}</h5>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 line-clamp-2">{post.content}</p>
                      </div>
                   </div>
                 )) : (
                   <p className="text-[10px] font-black text-slate-300 uppercase p-8 italic bg-white rounded-[2rem] border border-dashed text-center md:col-span-2">Henüz bülten yayınlanmadı.</p>
                 )}
              </div>
           </div>
        </div>

        {/* Sidebar: Galeri ve Duyurular */}
        <div className="space-y-8">
           <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-slate-50">
              <div className="flex items-center justify-between mb-6">
                 <h4 className="font-black uppercase text-[10px] italic text-slate-900 flex items-center gap-2">
                   <ImageIcon size={14} className="text-red-600" /> AKADEMİ GALERİ
                 </h4>
                 <button onClick={() => onNavigate('media', 'gallery')} className="text-[8px] font-black text-red-600 uppercase">TÜMÜ</button>
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

           <div className="bg-red-600 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
              <ShieldAlert size={100} className="absolute -right-4 -bottom-4 opacity-20 rotate-12" />
              <h4 className="text-xl font-black uppercase italic tracking-tighter mb-4">HAFTALIK <br/>HATIRLATMA</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-90 leading-relaxed mb-6">
                Antrenmanlara 15 dakika önce gelmeniz gelişim disiplini için kritiktir. 
              </p>
              <button onClick={() => onNavigate('schedule')} className="bg-zinc-950 text-white px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl active:scale-95">TAKİME GİT</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
