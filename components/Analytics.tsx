
import React, { useState, useEffect } from 'react';
import { 
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { Target, TrendingUp, Zap, Users as UsersIcon, Ruler, Weight, Activity, Timer, ChevronRight, Save, Edit3, X, FileText, Send, ShieldAlert } from 'lucide-react';
import { Student, AppMode } from '../types';
import ReportCard from './ReportCard';

interface AnalyticsProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  mode?: AppMode;
  onSendKarne?: (name: string) => void;
  onModalStateChange?: (isOpen: boolean) => void;
}

const teamStats = [
  { subject: 'Teknik', A: 120, B: 110, fullMark: 150 },
  { subject: 'Hız', A: 98, B: 130, fullMark: 150 },
  { subject: 'Güç', A: 86, B: 130, fullMark: 150 },
  { subject: 'Dayanıklılık', A: 99, B: 100, fullMark: 150 },
];

const Analytics: React.FC<AnalyticsProps> = ({ students, setStudents, mode, onSendKarne, onModalStateChange }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingKarne, setViewingKarne] = useState<Student | null>(null);

  if (mode === 'parent') {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-[3rem] shadow-xl text-center space-y-6">
        <div className="w-20 h-20 bg-zinc-950 text-white rounded-[1.5rem] flex items-center justify-center rotate-3 shadow-2xl">
          <ShieldAlert size={40} className="text-red-600" />
        </div>
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">GELİŞİM <span className="text-red-600">KARNESİ</span></h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2 max-w-sm">
            Çocuğunuzun fiziksel ölçüm sonuçları ve antrenör notları yayınlandığında burada görünecektir.
          </p>
        </div>
        <button onClick={() => alert('Gelişim karnesi henüz hazır değil.')} className="px-10 py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all">ŞİMDİ KONTROL ET</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-gray-900 uppercase italic">GELİŞİM <span className="text-red-600">ANALİZİ</span></h2>
          <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mt-1">Ölçüm & Kapasite Takibi</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 overflow-hidden">
            <h4 className="font-black mb-8 uppercase text-xs tracking-tight flex items-center gap-2 italic">
                <Zap size={18} className="text-red-600" /> TAKIM RADARI
            </h4>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={teamStats}>
                        <PolarGrid stroke="#f3f4f6" />
                        <PolarAngleAxis dataKey="subject" tick={{fontSize: 10, fontWeight: 700}} />
                        <Radar name="Akademi" dataKey="A" stroke="#dc2626" fill="#dc2626" fillOpacity={0.6} />
                        <Tooltip />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
        
        <div className="bg-zinc-900 text-white p-8 rounded-[2rem] flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-6">
                <Activity className="text-red-600" size={32} />
                <h3 className="text-2xl font-black italic uppercase">FİZİKSEL KAPASİTE</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-800 p-4 rounded-2xl">
                    <p className="text-[10px] text-zinc-500 font-black uppercase">ORT. BOY</p>
                    <p className="text-xl font-black">154.2 cm</p>
                </div>
                <div className="bg-zinc-800 p-4 rounded-2xl">
                    <p className="text-[10px] text-zinc-500 font-black uppercase">ORT. HIZ</p>
                    <p className="text-xl font-black">3.12 sn</p>
                </div>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[9px] font-black text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">SPORCU</th>
                <th className="px-4 py-5 text-center">HIZ (SN)</th>
                <th className="px-4 py-5 text-center">BOY/KİLO</th>
                <th className="px-8 py-5 text-right">KARNE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.map(s => (
                <tr key={s.id}>
                  <td className="px-8 py-5">
                    <p className="font-black text-xs uppercase italic">{s.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{s.branchId}</p>
                  </td>
                  <td className="px-4 py-5 text-center font-black text-red-600 italic">{s.physicalStats?.speed20m || '-'}</td>
                  <td className="px-4 py-5 text-center text-[10px] font-black text-gray-500">{s.physicalStats?.height || '-'} / {s.physicalStats?.weight || '-'}</td>
                  <td className="px-8 py-5 text-right">
                    <button onClick={() => setViewingKarne(s)} className="p-2.5 bg-red-600 text-white rounded-xl shadow-lg"><FileText size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewingKarne && <ReportCard student={viewingKarne} onClose={() => setViewingKarne(null)} />}
    </div>
  );
};

export default Analytics;
