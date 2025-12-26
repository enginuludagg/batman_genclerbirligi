
import React from 'react';
import { Users, Activity, Award, Newspaper, ChevronRight, ArrowUpRight, ShieldAlert, Sparkles, Vote, CalendarCheck } from 'lucide-react';
import { AppContextData, AppMode, ViewType } from '../types';
import Logo from './Logo';

interface DashboardProps {
  context: AppContextData;
  appMode: AppMode;
  onNavigate: (view: ViewType, subTab?: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ context, appMode, onNavigate }) => {
  const publishedMedia = context.media.filter(m => m.status === 'published');
  const recentGallery = publishedMedia.filter(m => m.type === 'gallery').slice(0, 3);
  const latestBulletin = publishedMedia.find(m => m.type === 'bulletin');

  return (
    <div className="space-y-6 sm:space-y-8 w-full animate-in fade-in duration-700">
      {/* Club Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white p-1 rounded-2xl shadow-xl border-2 border-red-600 flex items-center justify-center flex-shrink-0 rotate-2">
             <Logo className="w-full h-full" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
              BATMAN <span className="text-red-600">GENÇLERBİRLİĞİ</span>
            </h2>
            <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-1 italic">RESMİ AKADEMİ SİSTEMİ</p>
          </div>
        </div>
        
        {appMode === 'parent' && (
           <div className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl flex items-center gap-3 shadow-xl border border-red-600/20">
             <Sparkles size={16} className="text-red-600" />
             <p className="text-[10px] font-black uppercase italic tracking-widest">VELİ ERİŞİMİ</p>
           </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Main Banner */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-slate-950 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden group min-h-[300px] flex flex-col justify-end">
              <div className="absolute inset-0 opacity-30">
                {recentGallery[0] && <img src={recentGallery[0].imageUrl} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" />}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
              
              <div className="relative z-10 space-y-3">
                 <span className="bg-red-600 text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-lg text-white shadow-xl italic inline-block">GÜNCEL</span>
                 <h3 className="text-2xl sm:text-4xl font-black text-white uppercase italic tracking-tighter leading-none line-clamp-2">
                   {recentGallery[0]?.title || "YENİ SEZON KAYITLARI DEVAM EDİYOR"}
                 </h3>
                 <button 
                   onClick={() => onNavigate('media', 'gallery')}
                   className="bg-white text-slate-950 px-6 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-xl w-fit"
                 >
                   DETAYLAR <ArrowUpRight size={16} />
                 </button>
              </div>
           </div>

           {/* Stats Summary */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'SPORCU', val: context.students.length, icon: Users, color: 'text-red-600', bg: 'bg-red-50' },
                { label: 'KATILIM', val: '%92', icon: Activity, color: 'text-green-500', bg: 'bg-green-50' },
                { label: 'PROGRAM', val: context.sessions.length, icon: CalendarCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: 'HABER', val: publishedMedia.length, icon: Newspaper, color: 'text-orange-500', bg: 'bg-orange-50' }
              ].map((s, i) => (
                <div key={i} className="bg-white p-5 rounded-[2rem] border border-slate-50 shadow-sm flex flex-col items-center text-center">
                   <div className={`w-10 h-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center mb-3`}>
                      <s.icon size={18} />
                   </div>
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                   <h4 className="text-lg font-black italic text-slate-900">{s.val}</h4>
                </div>
              ))}
           </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
           {/* Latest News */}
           <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-slate-50 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-red-50 text-red-600 rounded-xl"><Newspaper size={18} /></div>
                <h4 className="font-black uppercase text-[10px] italic tracking-tighter text-slate-900">DUYURULAR</h4>
              </div>
              
              <div className="space-y-4">
                 {latestBulletin ? (
                   <div className="space-y-3">
                      <h5 className="text-sm font-black uppercase italic text-slate-900 leading-tight">{latestBulletin.title}</h5>
                      <p className="text-[10px] text-slate-400 font-bold line-clamp-3">{latestBulletin.content}</p>
                      <button 
                        onClick={() => onNavigate('media', 'bulletin')}
                        className="text-red-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        OKU <ChevronRight size={12} />
                      </button>
                   </div>
                 ) : (
                   <p className="text-[10px] text-slate-300 font-black uppercase italic py-8 text-center">Yeni duyuru yok</p>
                 )}
              </div>
           </div>

           {/* Access Alert */}
           {appMode === 'parent' && (
             <div className="bg-red-600 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                <ShieldAlert size={80} className="absolute -right-4 -bottom-4 opacity-20 rotate-12" />
                <h4 className="text-xl font-black uppercase italic tracking-tighter mb-2">DİKKAT</h4>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 leading-relaxed">
                  Ödemeleriniz ve sporcu gelişimi hakkında detaylı bilgi için profil sekmesine göz atın.
                </p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
