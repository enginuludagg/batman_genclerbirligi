
import React, { useState, useRef, useEffect } from 'react';
import { Newspaper, Image as ImageIcon, Vote, Plus, Heart, Share2, ShieldCheck, MoreVertical, X, Upload, Trash2, Edit3, CheckCircle2, Clock } from 'lucide-react';
import { MediaPost, AppMode } from '../types';

interface Props {
  media: MediaPost[];
  setMedia: React.Dispatch<React.SetStateAction<MediaPost[]>>;
  mode?: AppMode;
  activeTabOverride?: 'all' | 'bulletin' | 'gallery' | 'poll' | 'pending';
  setActiveTabOverride?: (tab: any) => void;
}

const MediaManager: React.FC<Props> = ({ media, setMedia, mode, activeTabOverride, setActiveTabOverride }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'bulletin' | 'gallery' | 'poll' | 'pending'>(activeTabOverride || 'all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Partial<MediaPost>>({
    title: '', type: 'bulletin', content: '', imageUrl: '', pollOptions: ['', '']
  });

  // Deep linking logic from Dashboard
  useEffect(() => {
    if (activeTabOverride) {
      setActiveTab(activeTabOverride);
    }
  }, [activeTabOverride]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm(prev => ({ ...prev, imageUrl: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!form.title) return;
    const newPost: MediaPost = {
      ...form as MediaPost,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('tr-TR'),
      status: mode === 'admin' ? 'published' : 'pending',
      likes: 0,
      pollOptions: form.type === 'poll' ? form.pollOptions?.filter(o => o.trim() !== '') : undefined
    };
    setMedia([newPost, ...media]);
    setIsModalOpen(false);
  };

  const deletePost = (id: string) => {
    if (confirm('Bu içeriği (galeri/anket/bülten) kalıcı olarak silmek istediğinize emin misiniz?')) {
      setMedia(prev => prev.filter(m => m.id !== id));
    }
  };

  const approvePost = (id: string) => {
    setMedia(prev => prev.map(m => m.id === id ? { ...m, status: 'published' } : m));
  };

  const filteredMedia = media.filter(m => {
    if (activeTab === 'pending') return m.status === 'pending';
    if (activeTab === 'all') return m.status === 'published';
    return m.type === activeTab && m.status === 'published';
  });

  const changeTab = (tab: any) => {
    setActiveTab(tab);
    if (setActiveTabOverride) setActiveTabOverride(tab);
  };

  return (
    <div className="w-full space-y-6 px-1 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 px-2">
        <div className="w-full min-w-0">
          <h2 className="text-2xl md:text-4xl font-black text-gray-900 uppercase italic truncate">
            MEDYA <span className="text-red-600">MERKEZİ</span>
          </h2>
          <p className="text-gray-500 font-bold text-[8px] sm:text-[9px] uppercase tracking-widest mt-1 truncate">Yayın & Etkileşim Yönetimi</p>
        </div>
        <button 
          onClick={() => { setForm({title:'', type:'bulletin', content:'', imageUrl:'', pollOptions:['','']}); setIsModalOpen(true); }} 
          className="w-full sm:w-auto bg-black text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] sm:text-xs hover:bg-red-600 transition-all shadow-xl active:scale-95"
        >
          <Plus size={18} /> İÇERİK EKLE
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-2 px-4 mobile-snap">
        {[
          { id: 'all', label: 'TÜMÜ', icon: Newspaper },
          { id: 'bulletin', label: 'BÜLTENLER', icon: Newspaper },
          { id: 'gallery', label: 'GALERİ', icon: ImageIcon },
          { id: 'poll', label: 'ANKET', icon: Vote },
          ...(mode === 'admin' ? [{ id: 'pending', label: 'ONAYDA', icon: Clock }] : [])
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => changeTab(tab.id as any)} 
            className={`flex items-center gap-2 px-5 sm:px-6 py-3 rounded-xl sm:rounded-2xl text-[8px] sm:text-[9px] font-black transition-all whitespace-nowrap flex-shrink-0 ${activeTab === tab.id ? 'bg-red-600 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'}`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2">
        {filteredMedia.length > 0 ? filteredMedia.map(post => (
          <div key={post.id} className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-xl border border-gray-50 overflow-hidden flex flex-col h-full group relative animate-in zoom-in-95 duration-300">
            {post.status === 'pending' && (
              <div className="absolute top-4 left-4 z-10 bg-orange-500 text-white text-[7px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg uppercase tracking-widest">
                <Clock size={10} /> ONAY BEKLİYOR
              </div>
            )}
            {post.type === 'gallery' ? (
              <div className="relative aspect-square bg-zinc-950 flex-shrink-0 overflow-hidden">
                <img src={post.imageUrl || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800'} className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent p-6 flex flex-col justify-end">
                   <h4 className="text-white font-black text-lg sm:text-xl italic uppercase tracking-tighter leading-tight line-clamp-2">{post.title}</h4>
                </div>
              </div>
            ) : (
              <div className="p-6 sm:p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[7px] sm:text-[8px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest bg-zinc-100 text-zinc-600">
                    {post.type.toUpperCase()}
                  </span>
                  <p className="text-[8px] font-black text-gray-300 uppercase italic">{post.date}</p>
                </div>
                <h4 className="font-black text-lg sm:text-xl text-zinc-900 mb-3 uppercase italic leading-tight tracking-tighter line-clamp-2">{post.title}</h4>
                <p className="text-gray-500 text-[10px] sm:text-xs font-bold mb-6 flex-grow italic line-clamp-4">{post.content}</p>
                {post.type === 'poll' && post.pollOptions && (
                  <div className="space-y-2 mb-6 w-full">
                    {post.pollOptions.map((opt, i) => (
                      <div key={i} className="w-full p-3.5 bg-gray-50 rounded-xl text-[9px] font-black uppercase border border-gray-100 truncate italic">
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {mode === 'admin' && (
              <div className="p-4 border-t border-gray-50 flex gap-2 mt-auto bg-gray-50/30">
                {post.status === 'pending' && (
                  <button onClick={() => approvePost(post.id)} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 active:scale-95 transition-all">
                    <CheckCircle2 size={14} /> ONAYLA
                  </button>
                )}
                <button 
                  onClick={() => deletePost(post.id)} 
                  className="flex-shrink-0 p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
                  title="Sil"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        )) : (
          <div className="col-span-full py-20 text-center">
             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                <ImageIcon size={24} className="text-gray-400" />
             </div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Bu kategoride henüz yayın bulunmuyor.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-2xl overflow-y-auto max-h-[90dvh] animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl sm:text-2xl font-black italic uppercase tracking-tighter">İÇERİK <span className="text-red-600">OLUŞTUR</span></h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
            </div>
            
            <div className="space-y-5 sm:space-y-6">
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-gray-100 rounded-2xl">
                {['bulletin', 'gallery', 'poll'].map(t => (
                  <button 
                    key={t} 
                    onClick={() => setForm({...form, type: t as any})} 
                    className={`py-3 rounded-xl text-[8px] sm:text-[9px] font-black uppercase transition-all ${form.type === t ? 'bg-white text-black shadow-sm' : 'text-gray-400'}`}
                  >
                    {t === 'bulletin' ? 'BÜLTEN' : t === 'gallery' ? 'GALERİ' : 'ANKET'}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="İçerik Başlığı" 
                  value={form.title} 
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs sm:text-sm font-bold outline-none focus:border-red-600 transition-all shadow-inner" 
                  onChange={e => setForm({...form, title: e.target.value})} 
                />
                <textarea 
                  placeholder="İçerik Detayları..." 
                  value={form.content} 
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs sm:text-sm font-bold outline-none h-32 resize-none focus:border-red-600 transition-all shadow-inner" 
                  onChange={e => setForm({...form, content: e.target.value})} 
                />
              </div>

              {form.type !== 'poll' && (
                <div 
                  onClick={() => fileInputRef.current?.click()} 
                  className="w-full aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group hover:border-red-600 transition-all"
                >
                  {form.imageUrl ? (
                    <img src={form.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <>
                      <Upload className="text-gray-300 mb-2 group-hover:text-red-600 transition-colors" size={32} />
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:text-red-600 transition-colors">RESİM / VİDEO YÜKLE</p>
                    </>
                  )}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                </div>
              )}

              {form.type === 'poll' && (
                <div className="space-y-2">
                   {form.pollOptions?.map((opt, i) => (
                     <div key={i} className="relative">
                        <input 
                          type="text" 
                          placeholder={`Seçenek ${i+1}`} 
                          value={opt} 
                          className="w-full px-6 py-3.5 bg-zinc-900 text-white rounded-xl text-[10px] font-black uppercase italic outline-none focus:ring-2 focus:ring-red-600"
                          onChange={e => {
                            const n = [...(form.pollOptions || [])]; n[i] = e.target.value; setForm({...form, pollOptions: n});
                          }} 
                        />
                     </div>
                   ))}
                   <button 
                    onClick={() => setForm({...form, pollOptions: [...(form.pollOptions || []), '']})} 
                    className="flex items-center gap-1.5 text-[8px] font-black text-red-600 uppercase tracking-widest pl-2"
                   >
                     <Plus size={14} /> YENİ SEÇENEK EKLE
                   </button>
                </div>
              )}

              <button 
                onClick={handleSave} 
                className="w-full py-5 bg-black text-white rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-2xl shadow-red-900/10 active:scale-95 transition-all hover:bg-red-600"
              >
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
