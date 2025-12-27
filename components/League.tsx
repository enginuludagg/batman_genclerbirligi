
import React, { useState } from 'react';
import { Trophy, X, MapPin, Plus, Trash2, LayoutTemplate } from 'lucide-react';
import { LeagueTeam, MatchResult, Student, AppMode } from '../types';
import LineupBuilder from './LineupBuilder';

interface Props {
  students: Student[];
  mode?: AppMode;
}

const initialStandings: Record<string, LeagueTeam[]> = {
  'U14': [
    { rank: 1, name: 'Batman Gençlerbirliği', played: 12, won: 10, drawn: 1, lost: 1, gf: 34, ga: 8, gd: 26, points: 31, form: ['W', 'W', 'D', 'W', 'W'], isUserTeam: true },
    { rank: 2, name: 'Batman Petrolspor', played: 12, won: 9, drawn: 2, lost: 1, gf: 28, ga: 10, gd: 18, points: 29, form: ['W', 'L', 'W', 'W', 'W'] },
  ]
};

const League: React.FC<Props> = ({ students, mode }) => {
  const [activeTab, setActiveTab] = useState<'standings' | 'fixtures' | 'lineup'>('standings');
  const [activeCategory, setActiveCategory] = useState('U14');
  const [showLineupBuilder, setShowLineupBuilder] = useState(false);
  const [showFixtureModal, setShowFixtureModal] = useState(false);
  
  const [fixtures, setFixtures] = useState<MatchResult[]>([
    { id: '1', homeTeam: 'Batman Gençlerbirliği', awayTeam: 'Batman Petrolspor', date: '25.05.2024', time: '14:00', location: '19 Mayıs Stadı', status: 'scheduled', category: 'U14' }
  ]);

  const [newFixture, setNewFixture] = useState<Partial<MatchResult>>({
    homeTeam: 'Batman Gençlerbirliği', awayTeam: '', date: '', time: '', location: '', category: 'U14', status: 'scheduled'
  });

  const handleAddFixture = () => {
    if (!newFixture.awayTeam || !newFixture.date) return;
    const match: MatchResult = { ...newFixture as MatchResult, id: Date.now().toString(), category: activeCategory };
    setFixtures([match, ...fixtures]);
    setShowFixtureModal(false);
    setNewFixture({ homeTeam: 'Batman Gençlerbirliği', awayTeam: '', date: '', time: '', location: '', category: activeCategory, status: 'scheduled' });
  };

  const deleteFixture = (id: string) => {
    if (confirm('Maç fikstürden kaldırılacak?')) setFixtures(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 px-2">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">LİG <span className="text-red-600">TAKİBİ</span></h2>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest pl-1 mt-2">Canlı Skorlar & Fikstür</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto no-scrollbar">
          {['U11', 'U12', 'U14', 'U16', 'U19'].map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeCategory === cat ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400'}`}>{cat}</button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 border-b border-gray-200 overflow-x-auto no-scrollbar px-2">
        {[{ id: 'standings', label: 'Puan Durumu' }, { id: 'fixtures', label: 'Fikstür' }, { id: 'lineup', label: 'Maç Kadrosu' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`pb-4 px-2 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-black' : 'text-gray-400'}`}>{tab.label}{activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 rounded-full" />}</button>
        ))}
      </div>

      {activeTab === 'standings' && (
        <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden mx-2 animate-in fade-in">
          <table className="w-full text-left">
            <thead><tr className="bg-zinc-900 text-white uppercase text-[9px] font-black"><th className="px-6 py-5">TAKIM</th><th className="px-4 py-5 text-center">O</th><th className="px-6 py-5 text-center bg-red-600">P</th></tr></thead>
            <tbody>{(initialStandings[activeCategory] || initialStandings['U14']).map((team, idx) => (<tr key={team.name} className={`border-b border-gray-50 ${team.isUserTeam ? 'bg-red-50/50' : ''}`}><td className="px-6 py-5 text-sm font-black uppercase">{team.name}</td><td className="px-4 py-5 text-center font-bold text-gray-500">{team.played}</td><td className="px-6 py-5 text-center text-base font-black text-red-600">{team.points}</td></tr>))}</tbody>
          </table>
        </div>
      )}

      {activeTab === 'fixtures' && (
        <div className="space-y-4 px-2 animate-in fade-in">
          {mode === 'admin' && <button onClick={() => setShowFixtureModal(true)} className="w-full py-5 bg-zinc-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl"><Plus size={18} /> YENİ MAÇ EKLE</button>}
          {fixtures.filter(f => f.category === activeCategory).map(match => (
            <div key={match.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 group">
               <div className="flex-1 text-center md:text-right font-black uppercase italic">{match.homeTeam}</div>
               <div className="bg-red-600 text-white px-5 py-1.5 rounded-xl text-[10px] font-black uppercase italic">VS</div>
               <div className="flex-1 text-center md:text-left font-black uppercase italic">{match.awayTeam}</div>
               <div className="flex items-center gap-4"><MapPin size={10} className="text-red-600" /><p className="text-[8px] font-black uppercase">{match.date}</p>{mode === 'admin' && <button onClick={() => deleteFixture(match.id)} className="p-3 text-red-600"><Trash2 size={16} /></button>}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'lineup' && (
        <div className="p-4 mx-2 animate-in fade-in">
           <div className="bg-white p-10 sm:p-20 rounded-[3rem] border border-gray-100 shadow-xl text-center space-y-6">
              <div className="w-24 h-24 bg-red-600 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl"><LayoutTemplate size={48} /></div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter">MAÇ <span className="text-red-600">DİZİLİMİ</span></h3>
              <button onClick={() => setShowLineupBuilder(true)} className="px-10 py-5 bg-zinc-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95">KADRO OLUŞTURUCUYU AÇ</button>
           </div>
        </div>
      )}

      {showLineupBuilder && <LineupBuilder students={students.filter(s => s.branchId === activeCategory || activeCategory === 'TÜM GRUPLAR')} onClose={() => setShowLineupBuilder(false)} />}
      
      {showFixtureModal && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
           <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
              <button onClick={() => setShowFixtureModal(false)} className="absolute top-6 right-6 text-gray-400"><X size={24} /></button>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-6">YENİ <span className="text-red-600">MAÇ EKLE</span></h3>
              <div className="space-y-4">
                 <input type="text" placeholder="Rakip Takım" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-red-600" value={newFixture.awayTeam} onChange={e => setNewFixture({...newFixture, awayTeam: e.target.value})} />
                 <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="25.05.2024" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none" value={newFixture.date} onChange={e => setNewFixture({...newFixture, date: e.target.value})} />
                    <input type="text" placeholder="14:00" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none" value={newFixture.time} onChange={e => setNewFixture({...newFixture, time: e.target.value})} />
                 </div>
                 <input type="text" placeholder="Saha / Konum" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none" value={newFixture.location} onChange={e => setNewFixture({...newFixture, location: e.target.value})} />
                 <button onClick={handleAddFixture} className="w-full py-5 bg-black text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl mt-4">FİKSTÜRE KAYDET</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default League;
