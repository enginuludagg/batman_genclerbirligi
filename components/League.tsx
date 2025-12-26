
import React, { useState } from 'react';
import { 
  Trophy, 
  Calendar, 
  Hash, 
  Settings2, 
  Save, 
  X, 
  ChevronRight, 
  Target, 
  Zap, 
  UserCircle,
  LayoutTemplate
} from 'lucide-react';
import { LeagueTeam, MatchResult, Student } from '../types';
import LineupBuilder from './LineupBuilder';

interface Props {
  students: Student[];
}

const initialStandings: Record<string, LeagueTeam[]> = {
  'U14': [
    { rank: 1, name: 'Batman Gençlerbirliği', played: 12, won: 10, drawn: 1, lost: 1, gf: 34, ga: 8, gd: 26, points: 31, form: ['W', 'W', 'D', 'W', 'W'], isUserTeam: true },
    { rank: 2, name: 'Batman Petrolspor', played: 12, won: 9, drawn: 2, lost: 1, gf: 28, ga: 10, gd: 18, points: 29, form: ['W', 'L', 'W', 'W', 'W'] },
    { rank: 3, name: 'Siirt İl Özel İdare', played: 12, won: 7, drawn: 3, lost: 2, gf: 22, ga: 14, gd: 8, points: 24, form: ['L', 'W', 'D', 'W', 'L'] },
  ],
  'U19': [
    { rank: 1, name: 'Batman Petrolspor', played: 10, won: 8, drawn: 1, lost: 1, gf: 25, ga: 10, gd: 15, points: 25, form: ['W', 'W', 'W', 'W', 'W'] },
    { rank: 2, name: 'Batman Gençlerbirliği', played: 10, won: 7, drawn: 2, lost: 1, gf: 22, ga: 8, gd: 14, points: 23, form: ['W', 'D', 'W', 'D', 'W'], isUserTeam: true },
  ]
};

const League: React.FC<Props> = ({ students }) => {
  const [activeTab, setActiveTab] = useState<'standings' | 'fixtures' | 'lineup'>('standings');
  const [activeCategory, setActiveCategory] = useState('U14');
  const [showLineupBuilder, setShowLineupBuilder] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 px-2">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">LİG <span className="text-red-600">TAKİBİ</span></h2>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest pl-1">Akademi Ligleri Canlı Skorlar</p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto no-scrollbar mobile-snap">
          {['U11', 'U12', 'U14', 'U16', 'U19'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap mobile-snap-item ${activeCategory === cat ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 border-b border-gray-200 overflow-x-auto no-scrollbar px-2">
        {[
          { id: 'standings', label: 'Puan Durumu' },
          { id: 'fixtures', label: 'Fikstür' },
          { id: 'lineup', label: 'Maç Kadrosu' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 px-2 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-black' : 'text-gray-400'}`}
          >
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 rounded-full" />}
          </button>
        ))}
      </div>

      {activeTab === 'standings' && (
        <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden mx-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-900 text-white uppercase text-[9px] font-black tracking-widest">
                  <th className="px-6 py-5 text-center">#</th>
                  <th className="px-6 py-5">TAKIM</th>
                  <th className="px-4 py-5 text-center">O</th>
                  <th className="px-4 py-5 text-center">AV</th>
                  <th className="px-6 py-5 text-center bg-red-600">PUAN</th>
                </tr>
              </thead>
              <tbody>
                {(initialStandings[activeCategory] || []).map((team, idx) => (
                  <tr key={team.name} className={`border-b border-gray-50 ${team.isUserTeam ? 'bg-red-50/50' : ''}`}>
                    <td className="px-6 py-5 text-center">
                       <span className={`w-7 h-7 flex items-center justify-center rounded-lg font-black text-xs ${idx < 3 ? 'bg-black text-white' : 'bg-gray-100'}`}>
                        {team.rank}
                       </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-sm font-black uppercase ${team.isUserTeam ? 'text-red-700' : 'text-zinc-800'}`}>{team.name}</span>
                    </td>
                    <td className="px-4 py-5 text-center text-sm font-bold text-gray-500">{team.played}</td>
                    <td className="px-4 py-5 text-center text-sm font-black">{team.gd}</td>
                    <td className="px-6 py-5 text-center text-base font-black text-red-600 bg-red-50/20">{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'lineup' && (
        <div className="p-4 mx-2">
           <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl text-center space-y-6">
              <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <LayoutTemplate size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">MAÇ <span className="text-red-600">DİZİLİMİ</span></h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 max-w-xs mx-auto">
                  Bugünkü maç için {activeCategory} grubundan ilk 11'i seçin ve profesyonel saha dizilimini oluşturun.
                </p>
              </div>
              <button 
                onClick={() => setShowLineupBuilder(true)}
                className="px-10 py-5 bg-zinc-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-red-600 transition-all active:scale-95"
              >
                KADRO OLUŞTURUCUYU AÇ
              </button>
           </div>
        </div>
      )}

      {showLineupBuilder && (
        <LineupBuilder 
          students={students.filter(s => s.branchId === activeCategory || activeCategory === 'Tümü')} 
          onClose={() => setShowLineupBuilder(false)} 
        />
      )}
    </div>
  );
};

export default League;
