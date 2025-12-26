
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, BrainCircuit, BellRing, CheckCircle2 } from 'lucide-react';
import { getAICoachResponse } from '../services/geminiService';
import { Message, AppContextData } from '../types';
import Logo from './Logo';

interface Props {
  context: AppContextData;
}

const AICoach: React.FC<Props> = ({ context }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Merhaba! Ben BGB AI. Batman Gençlerbirliği akademi verilerini analiz ederek size teknik ve idari konularda yardımcı olabilirim.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notifStatus, setNotifStatus] = useState<{count: number, msg: string} | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, notifStatus]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const result = await getAICoachResponse(input, context);
    
    if (result.functionCalls && result.functionCalls.length > 0) {
      for (const fc of result.functionCalls) {
        if (fc.name === 'sendNotification') {
          const { studentIds, message } = fc.args as any;
          setNotifStatus({ count: studentIds.length, msg: message });
          setTimeout(() => setNotifStatus(null), 5000);
        }
      }
    }

    const aiMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: result.text || "İşlem tamamlandı hocam." };
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
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
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">Akademi Akıllı Asistanı</p>
          </div>
        </div>
        <div className="flex gap-2">
            <span className="bg-red-900/30 text-red-500 text-[9px] font-black px-3 py-1.5 rounded-full uppercase flex items-center gap-1.5 animate-pulse">
                <Sparkles size={10} /> ÇEVRİMİÇİ
            </span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 custom-scrollbar">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-md ${m.role === 'assistant' ? 'bg-white p-1' : 'bg-slate-900 text-white'}`}>
                {m.role === 'assistant' ? <Logo className="w-full h-full" /> : <User size={20} />}
              </div>
              <div className={`p-5 rounded-3xl text-sm font-bold leading-relaxed shadow-sm ${m.role === 'assistant' ? 'bg-white text-slate-800' : 'bg-slate-900 text-white'}`}>
                {m.content}
              </div>
            </div>
          </div>
        ))}

        {notifStatus && (
          <div className="flex justify-center animate-bounce">
            <div className="bg-green-600 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4">
              <div className="bg-white/20 p-2 rounded-lg"><BellRing size={20} className="animate-ring" /></div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest">{notifStatus.count} VELİYE BİLDİRİM GÖNDERİLDİ</p>
                <p className="text-[10px] opacity-80 font-bold italic line-clamp-1">"{notifStatus.msg}"</p>
              </div>
              <CheckCircle2 size={24} />
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl flex items-center gap-3 shadow-sm border border-gray-100">
              <Loader2 size={16} className="animate-spin text-red-600" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">BGB AI Verileri İşliyor...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-gray-50">
        <div className="max-w-4xl mx-auto relative flex gap-2">
          <input 
            type="text" value={input} onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="BGB AI'a sorun: 'U14 grubundaki eksikleri listele'..."
            className="flex-1 pl-6 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-600 outline-none font-bold text-sm shadow-inner transition-all"
          />
          <button 
            onClick={handleSend} disabled={isLoading || !input.trim()}
            className="p-4 bg-red-600 text-white rounded-2xl hover:bg-slate-900 transition-all shadow-lg active:scale-95"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
