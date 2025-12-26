
import React from 'react';
import { Users, Activity, Award, Newspaper, ChevronRight, ArrowUpRight, ShieldAlert, Sparkles, Vote, CalendarCheck, UserPlus, UserCheck, Wallet, MessageSquare } from 'lucide-react';
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
  
  const quickActions = [
    { id: 'students', label: 'ÖĞRENCİ EKLE', icon: UserPlus, color: 'bg-blue-600', view: 'students' },
    { id: 'attendance', label: 'YOKLAMA AL', icon: UserCheck, color: 'bg-green-600', view: 'attendance' },
    { id: 'finance', label: 'AİDAT GİRİŞİ', icon: Wallet, color: 'bg-orange-600', view: 'finance' },
    { id: 'ai-coach', label: 'AI ANALİZ', icon: MessageSquare, color: 'bg-red-600', view: 'ai-coach' }
  ];

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
                <action.icon size={20} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Main Banner */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-slate-950 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden group min-h-[350px] flex flex-col justify-end">
              <div className="absolute inset-0 opacity-40">
                <img src={recentGallery[0]?.imageUrl || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200'} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
              
              <div className="relative z-10 space-y-4">
                 <div className="flex gap-2">
                    <span className="bg-red-600 text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-lg text-white shadow-xl italic inline-block">MANŞET</span>
                    <span className="bg-white/20 backdrop-blur-md text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-lg text-white italic inline-block">BGB MEDYA</span>
                 </div>
                 <h3 className="text-3xl sm:text-5xl font-black text-white uppercase italic tracking-tighter leading-tight max-w-xl">
                   {recentGallery[0]?.title || "AKADEMİ ŞAMPİYONLUK YOLUNDA EMİN ADIMLARLA İLERLİYOR"}
                 </h3>
                 <button 
                   onClick={() => onNavigate('media')}
                   className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-xl w-fit"
                 >
                   HABERİ OKU <ArrowUpRight size={16} />
                 </button>
              </div>
           </div>

           {/* Stats Summary */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'SPORCU', val: context.students.length, icon: Users, color: 'text-red-600', bg: 'bg-red-50' },
                { label: 'VERİM', val: '%94', icon: Activity, color: 'text-green-500', bg: 'bg-green-50' },
                { label: 'GRUP', val: '12', icon: Award, color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: 'MAÇ', val: '28', icon: CalendarCheck, color: 'text-orange-500', bg: 'bg-orange-50' }
              ].map((s, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm flex flex-col items-center text-center">
                   <div className={`w-12 h-12 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center mb-4`}>
                      <s.icon size={24} />
                   </div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                   <h4 className="text-xl font-black italic text-slate-900">{s.val}</h4>
                </div>
              ))}
           </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
           {/* Info Card */}
           <div className="bg-red-600 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
              <ShieldAlert size={120} className="absolute -right-8 -bottom-8 opacity-20 rotate-12 group-hover:scale-110 transition-transform" />
              <h4 className="text-2xl font-black uppercase italic tracking-tighter mb-4">GÜNCEL <br/>DUYURU</h4>
              <p className="text-[11px] font-bold uppercase tracking-widest opacity-90 leading-relaxed mb-6">
                Haftalık antrenman programı güncellendi. Tüm sporcularımızın takvim sekmesini kontrol etmesi rica olunur.
              </p>
              <button 
                onClick={() => onNavigate('schedule')}
                className="bg-white text-red-600 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95"
              >
                TAKİME GİT
              </button>
           </div>

           {/* Training Tips */}
           <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-zinc-900 text-white rounded-2xl rotate-3"><Sparkles size={20} /></div>
                <div>
                  <h4 className="font-black uppercase text-[10px] italic tracking-tighter text-slate-900">AI COACH</h4>
                  <p className="text-[8px] text-slate-400 font-bold uppercase">Günün Önerisi</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 font-bold italic leading-relaxed">
                "Hava sıcaklıkları artıyor. Sporcularımızın antrenman öncesi ve sonrası sıvı alımına (elektrolit takviyeli) dikkat etmesi performanslarını %15 artıracaktır."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
