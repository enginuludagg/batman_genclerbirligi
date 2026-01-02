
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Loader2, Globe, ExternalLink } from 'lucide-react';
import { getAICoachResponse } from '../services/geminiService';
import { Message, AppContextData, AppMode, Student } from '../types';
import Logo from './Logo';

interface ExtendedMessage extends Message {
  sources?: string[];
}

interface Props {
  context: AppContextData;
  mode: AppMode;
  currentUser?: Student | null;
}

const AICoach: React.FC<Props> = ({ context, mode, currentUser }) => {
  const [messages, setMessages] = useState<ExtendedMessage[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: mode === 'admin' 
        ? 'Hoş geldiniz hocam! Tüm kulüp verilerine ve güncel spor dünyasına erişimim var. Nasıl yardımcı olabilirim?' 
        : `Hoş geldiniz! ${currentUser ? `${currentUser.name} ve kulübümüz` : 'Kulübümüz'} hakkındaki sorularınızı yanıtlayabilirim.` 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: ExtendedMessage = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await getAICoachResponse(input, context, mode, currentUser);
      
      const aiMessage: ExtendedMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: result.text,
        sources: result.sources
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'assistant', 
        content: "Bağlantı sorunu oluştu. Lütfen tekrar deneyin." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden relative">
      <div className="bg-slate-900 p-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg border-2 border-red-600/20 p-1">
            <Logo className="w-full h-full" />
          </div>
          <div>
            <h3 className="text-white font-black uppercase tracking-tighter italic">BGB <span className="text-red-600">AI</span></h3>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">
              {mode === 'admin' ? 'Yönetici Asistanı' : 'Veli Bilgilendirme'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
            <span className="bg-red-900/30 text-red-500 text-[9px] font-black px-3 py-1.5 rounded-full uppercase flex items-center gap-1.5">
                <Globe size={10} /> GOOGLE SEARCH AKTİF
            </span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-md ${m.role === 'assistant' ? 'bg-white p-1' : 'bg-slate-900 text-white'}`}>
                {m.role === 'assistant' ? <Logo className="w-full h-full" /> : <User size={20} />}
              </div>
              <div className="space-y-2">
                <div className={`p-5 rounded-3xl text-sm font-bold leading-relaxed shadow-sm ${m.role === 'assistant' ? 'bg-white text-slate-800 border border-gray-100' : 'bg-slate-900 text-white'}`}>
                  {m.content}
                </div>
                {m.sources && m.sources.length > 0 && (
                  <div className="flex flex-wrap gap-2 px-2">
                    {m.sources.map((url, idx) => (
                      <a 
                        key={idx} 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-100 rounded-full text-[8px] font-black text-blue-600 hover:bg-blue-50 transition-colors uppercase tracking-widest shadow-sm"
                      >
                        <ExternalLink size={10} /> Kaynak {idx + 1}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl flex items-center gap-3 shadow-sm border border-gray-100">
              <Loader2 size={16} className="animate-spin text-red-600" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yanıt hazırlanıyor...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-gray-50">
        <div className="max-w-4xl mx-auto relative flex gap-2">
          <input 
            type="text" value={input} onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Sorunuzu buraya yazın..."
            className="flex-1 pl-6 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-600 outline-none font-bold text-sm shadow-inner transition-all"
          />
          <button 
            onClick={handleSend} disabled={isLoading || !input.trim()}
            className="p-4 bg-red-600 text-white rounded-2xl hover:bg-slate-900 transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
