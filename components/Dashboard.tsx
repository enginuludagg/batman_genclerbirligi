
import React, { useState, useEffect } from 'react';
import { Users, Activity, Award, Newspaper, ChevronRight, ArrowUpRight, ShieldAlert, Sparkles, Image as ImageIcon, CalendarCheck, UserPlus, UserCheck, Wallet, MessageSquare, QrCode, ScanLine, X, ShieldCheck, MessageCircle, CloudSun, Timer, MapPin, Trophy, TrendingUp, TrendingDown, CloudRain, Sun, Cloud } from 'lucide-react';
import { AppContextData, AppMode, ViewType, Student, TrainingSession } from '../types';
import Logo from './Logo';

interface DashboardProps {
  context: AppContextData;
  appMode: AppMode;
  onNavigate: (view: ViewType, subTab?: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ context, appMode, onNavigate }) => {
  const [showIdCard, setShowIdCard] = useState(false);
  const [weather, setWeather] = useState<{ temp: number; icon: any; desc: string } | null>(null);
  
  const publishedMedia = context.media.filter(m => m.status === 'published');
  const recentBulletins = publishedMedia.filter(m => m.type === 'bulletin').slice(0, 3);
  const currentStudent = context.students[0];

  const activeStudentCount = context.students.filter(s => s.status === 'active').length;
  const totalBalance = context.finance.reduce((acc, curr) => curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0);
  const nextMatch = context.fixtures.filter(f => f.status === 'scheduled')[0];

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Batman Koordinatları
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=37.8874&longitude=41.1322&current_weather=true");
        const data = await res.json();
        const code = data.current_weather.weathercode;
        let icon = <Sun size={14} className="text-yellow-500" />;
        let desc = "Güneşli";
        if (code > 50) { icon = <CloudRain size={14} className="text-blue-500" />; desc = "Yağmurlu"; }
        else if (code > 0) { icon = <Cloud size={14} className="text-gray-400" />; desc = "Parçalı Bulutlu"; }
        setWeather({ temp: Math.round(data.current_weather.temperature), icon, desc });
      } catch {
        setWeather({ temp: 24, icon: <Sun size={14} />, desc: "Batman" });
      }
    };
    fetchWeather();
  }, []);

  const quickActions = [
    { id: 'students', label: 'SPORCU EKLE', icon: UserPlus, color: 'bg-blue-600', view: 'students' },
    { id: 'qr-scan', label: 'QR OKUT', icon: ScanLine, color: 'bg-zinc-900', view: 'attendance' },
    { id: 'finance', label: 'AİDAT AL', icon: Wallet, color: 'bg-orange-600', view: 'finance' },
    { id: 'ai-coach', label: 'AI ANALİZ', icon: MessageSquare, color: 'bg-red-600', view: 'ai-coach' }
  ];

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white p-0.5 rounded-2xl shadow-xl border-2 border-[#E30613] flex items-center justify-center">
             <Logo className="w-full h-full" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
              BATMAN <span className="text-[#E30613]">GENÇLERBİRLİĞİ<sup>®</sup></span>
            </h2>
            <div className="flex items-center gap-2 mt-1">
              {weather && (
                <div className="flex items-center gap-1.5 bg-white px-2 py-0.5 rounded-full border shadow-sm">
                  {weather.icon}
                  <span className="text-[9px] font-black text-slate-700">{weather.temp}°C {weather.desc}</span>
                </div>
              )}
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">AKADEMİ PANELİ</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-white p-6 rounded-[2rem] border border-blue-50 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><Users size={24} /></div>
            <div>
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">KAYITLI SPORCU</p>
               <h3 className="text-2xl font-black text-slate-900 italic">{activeStudentCount}</h3>
            </div>
         </div>
         <div onClick={() => onNavigate('finance')} className="bg-white p-6 rounded-[2rem] border border-green-50 shadow-sm flex items-center gap-4 cursor-pointer hover:border-green-200">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600"><Wallet size={24} /></div>
            <div>
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">KASA DURUMU</p>
               <h3 className={`text-2xl font-black italic ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>₺{totalBalance.toLocaleString()}</h3>
            </div>
         </div>
         <div onClick={() => onNavigate('league')} className="bg-zinc-900 p-6 rounded-[2rem] shadow-xl flex items-center gap-4 cursor-pointer">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-orange-500"><Trophy size={24} /></div>
            <div className="flex-1">
               <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">SIRADAKİ MAÇ</p>
               <h3 className="text-lg font-black text-white italic truncate leading-none">{nextMatch?.awayTeam || 'YOK'}</h3>
            </div>
         </div>
      </div>

      {appMode === 'admin' && (
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map(action => (
            <button key={action.id} onClick={() => onNavigate(action.view as ViewType)} className="bg-white p-3 py-4 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col items-center gap-2 hover:border-[#E30613] transition-all">
              <div className={`${action.color} text-white p-2.5 rounded-xl shadow-lg`}><action.icon size={16} /></div>
              <span className="text-[7px] font-black uppercase text-slate-600 text-center leading-tight">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="bg-zinc-950 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden group min-h-[300px] flex flex-col justify-end border border-white/10">
          <div className="absolute inset-0 opacity-50">
            <img src={publishedMedia[0]?.imageUrl || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200'} className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="relative z-10 space-y-3">
              <span className="bg-[#E30613] w-fit text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-lg text-white">SON HABERLER</span>
              <h3 className="text-2xl sm:text-4xl font-black text-white uppercase italic tracking-tighter leading-none">{publishedMedia[0]?.title || "YENİ DÖNEM KAYITLARI BAŞLADI"}</h3>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
