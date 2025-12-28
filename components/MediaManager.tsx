
import React, { useState, useRef, useEffect } from 'react';
import { Newspaper, Image as ImageIcon, Vote, Plus, X, Upload, Trash2, CheckCircle2, Clock, AlertCircle, ListPlus, Map as MapIcon, Trophy, Star } from 'lucide-react';
import { MediaPost, AppMode } from '../types';
import Logo from './Logo';

interface Props {
  media: MediaPost[];
  setMedia: React.Dispatch<React.SetStateAction<MediaPost[]>>;
  mode?: AppMode;
  activeTabOverride?: 'all' | 'bulletin' | 'gallery' | 'poll' | 'lineup' | 'pending';
  setActiveTabOverride?: (tab: any) => void;
}

const MediaManager: React.FC<Props> = ({ media, setMedia, mode, activeTabOverride, setActiveTabOverride }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'bulletin' | 'gallery' | 'poll' | 'lineup' | 'pending'>(activeTabOverride || 'all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Partial<MediaPost>>({ 
    title: '', 
    type: 'bulletin', 
    content: '', 
    imageUrl: '', 
    pollOptions: ['Seçenek 1', 'Seçenek 2'] 
  });

  useEffect(() => { if (activeTabOverride) setActiveTab(activeTabOverride); }, [activeTabOverride]);

  const optimizeImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          let width = img.width;
          let height = img.height;
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
      };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsOptimizing(true);
      const optimizedBase64 = await optimizeImage(file);
      setForm(prev => ({ ...prev, imageUrl: optimizedBase64 }));
      setIsOptimizing(false);
    }
  };

  const addPollOption = () => {
    setForm(prev => ({ ...prev, pollOptions: [...(prev.pollOptions || []), `Seçenek ${(prev.pollOptions?.length || 0) + 1}`] }));
  };

  const handleSave = () => {
    if (!form.title) return;
    const newPost: MediaPost = { 
      ...form as MediaPost, 
      id: Date.now().toString(), 
      date: new Date().toLocaleDateString('tr-TR'), 
      status: mode === 'admin' ? 'published' : 'pending', 
      likes: 0 
    };
    setMedia([newPost, ...media]);
    setIsModalOpen(false);
    setForm({ title: '', type: 'bulletin', content: '', imageUrl: '', pollOptions: ['Seçenek 1', 'Seçenek 2'] });
  };

  const deletePost = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); e.stopPropagation();
    if (window.confirm('Bu içeriği kalıcı olarak silmek istediğinize emin misiniz?')) {
      setMedia(prev => prev.filter(m => m.id !== id));
    }
  };

  const approvePost = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); e.stopPropagation();
    setMedia(prev => prev.map(m => m.id === id ? { ...m, status: 'published' } : m));
  };

  const filteredMedia = media.filter(m => {
    if (activeTab === 'pending') return m.status === 'pending';
    if (activeTab === 'all') return m.status === 'published';
    return m.type === activeTab && m.status === 'published';
  });

  return (
    <div className="w-full space-y-6 px-1 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 px-2">
        <div className="w-full">
          <h2 className="text-2xl md:text-4xl font-black text-gray-900 uppercase italic leading-none">MEDYA <span className="text-red-600">MERKEZİ</span></h2>
          <p className="text-gray-500 font-bold text-[9px] uppercase tracking-widest mt-2 italic">Duyuru, Galeri ve Anket Paneli</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto bg-zinc-950 text-white px-8 py-4 rounded-[2rem] flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest shadow-xl hover:bg-red-600 transition-all active:scale-95"><Plus size={18} /> İÇERİK EKLE</button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-2 px-4">
        {[
          { id: 'all', label: 'TÜMÜ', icon: Newspaper }, 
          { id: 'bulletin', label: 'BÜLTENLER', icon: Newspaper }, 
          { id: 'lineup', label: 'KADROLAR', icon: MapIcon }, 
          { id: 'gallery', label: 'GALERİ', icon: ImageIcon }, 
          { id: 'poll', label: 'ANKETLER', icon: Vote }, 
          ...(mode === 'admin' ? [{ id: 'pending', label: 'ONAYDA', icon: Clock }] : [])
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-red-600 text-white shadow-xl' : 'bg-white text-gray-400 border border-gray-100'}`}><tab.icon size={14} /> {tab.label}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
        {filteredMedia.length > 0 ? filteredMedia.map(post => (
          <div key={post.id} className="bg-white rounded-[2.5rem] shadow-xl border border-gray-50 overflow-hidden flex flex-col h-full group relative animate-in zoom-in-95">
            {post.status === 'pending' && (
              <div className="absolute top-4 left-4 z-[20] bg-orange-500 text-white text-[7px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1 italic">
                <Clock size={10} /> ONAY BEKLİYOR
              </div>
            )}
            
            {/* KADRO GÖRSELİ (Profesyonel Lineup Render) */}
            {post.type === 'lineup' && post.lineupData && (
              <div className="flex flex-col">
                <div className={`relative aspect-[3/4] overflow-hidden ${post.lineupData.sport === 'Futbol' ? 'bg-emerald-900' : 'bg-[#c68c53] bg-[url("https://www.transparenttextures.com/patterns/wood-pattern.png")]'}`}>
                  <div className="absolute inset-0 bg-black/40"></div>
                  
                  {/* Saha Çizgileri */}
                  <div className="absolute inset-4 border border-white/20">
                    {post.lineupData.sport === 'Futbol' ? (
                      <div className="absolute inset-0">
                        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-white/20 rounded-full"></div>
                      </div>
                    ) : (
                      <div className="absolute inset-0">
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/40"></div>
                        <div className="absolute top-[35%] bottom-[35%] left-0 right-0 bg-orange-500/10 border-y border-white/20"></div>
                      </div>
                    )}
                  </div>

                  {/* Oyuncular - Minimal Saha Yerleşimi */}
                  <div className="absolute inset-6 grid grid-cols-3 gap-2 z-10">
                    {post.lineupData.players.map((p, i) => (
                      <div key={i} className="flex flex-col items-center justify-center">
                        <div className="w-8 h-8 rounded-full border-2 border-white/80 bg-zinc-800 overflow-hidden shadow-lg">
                          {p.photo ? <img src={p.photo} className="w-full h-full object-cover" /> : <div className="text-[7px] text-white flex items-center justify-center h-full">{p.name[0]}</div>}
                        </div>
                        <div className="bg-black/60 px-1.5 py-0.5 rounded-md mt-1 border border-white/10">
                          <p className="text-[5px] font-black text-white uppercase truncate max-w-[45px]">{p.number ? `${p.number}. ` : ''}{p.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Logo Filigran - Bülten İçin Belirgin */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.08]">
                    <Logo className="w-48 h-48 grayscale invert" />
                  </div>

                  <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-[6px] font-black italic uppercase tracking-widest">{post.lineupData.mode}</div>
                </div>

                {/* ESAME LİSTESİ - SAHANIN ALTINDA/YANINDA */}
                <div className="bg-zinc-950 p-6 space-y-4">
                  <div>
                    <h5 className="text-[8px] font-black text-red-600 uppercase tracking-[0.3em] mb-3 flex items-center gap-2 italic">
                       <Trophy size={12} /> ESAME LİSTESİ (İLK {post.lineupData.players.length})
                    </h5>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                      {post.lineupData.players.map((p, idx) => (
                        <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-1">
                          <span className="text-[9px] font-black text-white uppercase italic">{idx + 1}. {p.name}</span>
                          <span className="text-[8px] font-black text-zinc-500">#{p.number || '--'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {post.lineupData.subs.length > 0 && (
                    <div className="pt-2 border-t border-white/5">
                      <h5 className="text-[7px] font-black text-blue-500 uppercase tracking-[0.3em] mb-2 italic">YEDEK KULÜBESİ</h5>
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {post.lineupData.subs.map((p, idx) => (
                          <span key={idx} className="text-[8px] font-bold text-zinc-400 uppercase italic">🔄 {p.name}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {(post.imageUrl || post.type === 'gallery') && post.type !== 'lineup' && (
              <div className="relative aspect-video bg-zinc-950 overflow-hidden">
                <img src={post.imageUrl || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={post.title} />
              </div>
            )}

            <div className="p-8 flex-1 flex flex-col relative">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[7px] font-black px-3 py-1.5 rounded-lg uppercase italic ${post.type === 'lineup' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>{post.type.toUpperCase()}</span>
                <p className="text-[8px] font-black text-gray-300 uppercase italic">{post.date}</p>
              </div>
              
              <h4 className="font-black text-lg text-zinc-900 mb-3 uppercase italic leading-tight line-clamp-2">{post.title}</h4>
              
              {post.type === 'poll' ? (
                <div className="space-y-2 mt-2">
                  {post.pollOptions?.map((opt, i) => (
                    <button key={i} className="w-full py-3 px-4 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black uppercase text-left hover:border-red-600 transition-all flex justify-between items-center group">
                      {opt} <div className="w-2 h-2 rounded-full bg-gray-200 group-hover:bg-red-600"></div>
                    </button>
                  ))}
                </div>
              ) : post.type !== 'lineup' ? (
                <p className="text-gray-500 text-[10px] font-bold mb-6 flex-grow italic line-clamp-4 leading-relaxed whitespace-pre-wrap">{post.content}</p>
              ) : null}

              {mode === 'admin' && (
                <div className="flex gap-3 pt-6 border-t border-gray-50 mt-auto">
                  {post.status === 'pending' && (
                    <button onClick={(e) => approvePost(e, post.id)} className="flex-1 bg-zinc-950 text-white py-3.5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl hover:bg-green-600 transition-all active:scale-95"><CheckCircle2 size={14} /> ONAYLA</button>
                  )}
                  <button onClick={(e) => deletePost(e, post.id)} className="flex-1 sm:flex-none p-3.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95" title="İçeriği Sil"><Trash2 size={18} /></button>
                </div>
              )}
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center">
            <AlertCircle className="text-gray-200 mb-4" size={48} />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">BU SEKMEDE HENÜZ İÇERİK BULUNMUYOR.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-8 sm:p-12 shadow-2xl overflow-y-auto max-h-[90dvh] animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">İÇERİK <span className="text-red-600">OLUŞTUR</span></h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                {['bulletin', 'gallery', 'poll'].map(t => (
                  <button key={t} onClick={() => setForm({...form, type: t as any})} className={`py-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${form.type === t ? 'bg-zinc-950 text-white shadow-xl' : 'text-gray-400'}`}>
                    {t === 'bulletin' ? 'BÜLTEN' : t === 'gallery' ? 'GALERİ' : 'ANKET'}
                  </button>
                ))}
              </div>
              
              <input type="text" placeholder="İçerik Başlığı" value={form.title} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none focus:border-red-600" onChange={e => setForm({...form, title: e.target.value})} />
              
              {form.type === 'bulletin' && (
                <textarea placeholder="Bülten detayı..." value={form.content} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none h-32 resize-none" onChange={e => setForm({...form, content: e.target.value})} />
              )}

              {form.type === 'poll' && (
                <div className="space-y-3">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">ANKET SEÇENEKLERİ</p>
                  {form.pollOptions?.map((opt, i) => (
                    <input key={i} type="text" value={opt} onChange={(e) => {
                      const newOpts = [...(form.pollOptions || [])];
                      newOpts[i] = e.target.value;
                      setForm({...form, pollOptions: newOpts});
                    }} className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black uppercase outline-none focus:border-red-600" />
                  ))}
                  <button onClick={addPollOption} className="w-full py-3 bg-gray-100 text-gray-500 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2 hover:bg-zinc-900 hover:text-white transition-all"><ListPlus size={14} /> SEÇENEK EKLE</button>
                </div>
              )}

              {(form.type !== 'poll') && (
                <div onClick={() => !isOptimizing && fileInputRef.current?.click()} className={`w-full aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group hover:border-red-600 ${isOptimizing ? 'cursor-wait opacity-50' : ''}`}>
                  {form.imageUrl ? (
                    <img src={form.imageUrl} className="w-full h-full object-cover" alt="Yüklenen" />
                  ) : (
                    <>
                      <Upload className={`text-gray-300 mb-3 ${isOptimizing ? 'animate-bounce' : ''}`} size={40} />
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isOptimizing ? 'RESİM İŞLENİYOR...' : 'RESİM YÜKLE'}</p>
                    </>
                  )}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                </div>
              )}

              <button onClick={handleSave} disabled={isOptimizing} className="w-full py-6 bg-zinc-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-red-600 transition-all disabled:opacity-50 active:scale-95">
                {mode === 'admin' ? 'HEMEN YAYINLA' : 'ONAYA GÖNDER'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaManager;
