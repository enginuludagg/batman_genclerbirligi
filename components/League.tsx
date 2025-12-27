
import React, { useState, useRef, useEffect } from 'react';
import { Trophy, X, MapPin, Plus, Trash2, LayoutTemplate, Calendar, Clock as ClockIcon, Save } from 'lucide-react';
import { LeagueTeam, MatchResult, Student, AppMode } from '../types';
import LineupBuilder from './LineupBuilder';

interface Props {
  students: Student[];
  mode?: AppMode;
}

const initialStandings: Record<string, LeagueTeam[]> = {
  'U11': [],
  'U12': [],
  'U14': [],
  'U16': [],
  'U19': []
};

const League: React.FC<Props> = ({ students, mode }) => {
  const [activeTab, setActiveTab] = useState<'standings' | 'fixtures' | 'lineup'>('standings');
  const [activeCategory, setActiveCategory] = useState('U14');
  const [showLineupBuilder, setShowLineupBuilder] = useState(false);
  const [showFixtureModal, setShowFixtureModal] = useState(false);
  const [fixtures, setFixtures] = useState<MatchResult[]>([]);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const [newFixture, setNewFixture] = useState<Partial<MatchResult>>({
    homeTeam: 'Batman Gençlerbirliği', awayTeam: '', date: '', time: '', location: '', category: 'U14', status: 'scheduled'
  });

  useEffect(() => {
    if (showFixtureModal && firstInputRef.current) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [showFixtureModal]);

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
            <tbody>
              {(initialStandings[activeCategory] || []).length > 0 ? (initialStandings[activeCategory]).map((team, idx) => (
                <tr key={team.name} className={`border-b border-gray-50 ${team.isUserTeam ? 'bg-red-50/50' : ''}`}><td className="px-6 py-5 text-sm font-black uppercase">{team.name}</td><td className="px-4 py-5 text-center font-bold text-gray-500">{team.played}</td><td className="px-6 py-5 text-center text-base font-black text-red-600">{team.points}</td></tr>
              )) : (
                <tr><td colSpan={3} className="p-10 text-center text-[10px] font-black text-gray-300 uppercase italic">Henüz bu kategori için puan tablosu oluşturulmadı.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'fixtures' && (
        <div className="space-y-4 px-2 animate-in fade-in">
          {mode === 'admin' && (
            <button 
              onClick={() => setShowFixtureModal(true)} 
              className="w-full py-5 bg-zinc-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-red-600 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <Plus size={18} /> YENİ MAÇ EKLE
            </button>
          )}
          {fixtures.filter(f => f.category === activeCategory).length > 0 ? fixtures.filter(f => f.category === activeCategory).map(match => (
            <div key={match.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-red-600 transition-all">
               <div className="flex-1 text-center md:text-right font-black uppercase italic text-zinc-900">{match.homeTeam}</div>
               <div className="bg-red-600 text-white px-5 py-1.5 rounded-xl text-[10px] font-black uppercase italic shadow-lg shadow-red-600/20">VS</div>
               <div className="flex-1 text-center md:text-left font-black uppercase italic text-zinc-900">{match.awayTeam}</div>
               <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-xl">
                 <div className="flex items-center gap-2">
                   <Calendar size={12} className="text-red-600" />
                   <p className="text-[9px] font-black uppercase text-zinc-500">{match.date}</p>
                 </div>
                 {mode === 'admin' && (
                  <button onClick={() => deleteFixture(match.id)} className="p-2 text-gray-300 hover:text-red-600 transition-colors">
                    <Trash2 size={16} />
                  </button>
                 )}
               </div>
            </div>
          )) : (
            <div className="bg-white p-16 rounded-[2.5rem] text-center border-2 border-dashed border-gray-100 flex flex-col items-center">
               <Trophy size={48} className="text-gray-100 mb-4" />
               <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">BU KATEGORİDE HENÜZ FİKSTÜR KAYDI YOK.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'lineup' && (
        <div className="p-4 mx-2 animate-in fade-in">
           <div className="bg-white p-10 sm:p-20 rounded-[3rem] border border-gray-100 shadow-xl text-center space-y-6">
              <div className="w-24 h-24 bg-red-600 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl"><LayoutTemplate size={48} /></div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter">MAÇ <span className="text-red-600">DİZİLİMİ</span></h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest max-w-xs mx-auto italic">Kadronu kur, taktiğini belirle ve sahaya çıkış stratejini oluştur.</p>
              <button onClick={() => setShowLineupBuilder(true)} className="px-10 py-5 bg-zinc-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 hover:bg-red-600 transition-all">KADRO OLUŞTURUCUYU AÇ</button>
           </div>
        </div>
      )}

      {showLineupBuilder && <LineupBuilder students={students.filter(s => s.branchId === activeCategory || activeCategory === 'TÜM GRUPLAR')} onClose={() => setShowLineupBuilder(false)} />}
      
      {showFixtureModal && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto">
           <div className="bg-white w-full max-w-md rounded-[3rem] p-8 sm:p-10 shadow-2xl relative animate-in zoom-in-95 my-auto">
              <button onClick={() => setShowFixtureModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"><X size={28} /></button>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8">YENİ <span className="text-red-600">MAÇ EKLE</span></h3>
              
              <div className="space-y-5">
                 <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">RAKİP TAKIM ADI</label>
                    <input 
                      ref={firstInputRef}
                      type="text" 
                      placeholder="Örn: Batman Petrolspor" 
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-red-600 focus:bg-white transition-all shadow-sm" 
                      value={newFixture.awayTeam} 
                      onChange={e => setNewFixture({...newFixture, awayTeam: e.target.value})} 
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">MAÇ TARİHİ</label>
                      <input 
                        type="text" 
                        placeholder="GG.AA.YYYY" 
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-red-600" 
                        value={newFixture.date} 
                        onChange={e => setNewFixture({...newFixture, date: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">SAAT</label>
                      <input 
                        type="text" 
                        placeholder="14:00" 
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-red-600" 
                        value={newFixture.time} 
                        onChange={e => setNewFixture({...newFixture, time: e.target.value})} 
                      />
                    </div>
                 </div>

                 <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">SAHA / KONUM</label>
                    <input 
                      type="text" 
                      placeholder="Örn: BGB Akademi Tesisleri" 
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-red-600" 
                      value={newFixture.location} 
                      onChange={e => setNewFixture({...newFixture, location: e.target.value})} 
                    />
                 </div>

                 <button 
                  onClick={handleAddFixture} 
                  className="w-full py-5 bg-zinc-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-red-600 transition-all active:scale-95 mt-4 flex items-center justify-center gap-3"
                 >
                   <Save size={18} /> FİKSTÜRE KAYDET
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default League;
