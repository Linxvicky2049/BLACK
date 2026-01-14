
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { User } from '../types';

type ChatMode = 'fast' | 'thinking' | 'search';

interface AIAssistantProps {
  user: User;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string, sources?: any[] }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState<ChatMode>('fast');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const modelName = mode === 'thinking' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
      
      const config: any = {};
      if (mode === 'thinking') config.thinkingConfig = { thinkingBudget: 32768 };
      if (mode === 'search') config.tools = [{ googleSearch: {} }];

      const response = await ai.models.generateContent({
        model: modelName,
        contents: `You are a pro gaming assistant for Gaming Hub Africa. The user is ${user.username} (Rank: ${user.rank}). Help them with gaming strategies, tournament info, or account help. Question: ${userMsg}`,
        config
      });

      const aiText = response.text || "I'm having trouble connecting to the Hub. Please try again later.";
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      
      setMessages(prev => [...prev, { role: 'ai', text: aiText, sources }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "Error: AI Signal Interrupted. Check your API uplink." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
      {isOpen && (
        <div className="w-[400px] h-[600px] bg-slate-900/90 backdrop-blur-2xl rounded-[40px] border border-cyan-500/30 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-800/20">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-cyan-500 rounded-lg flex items-center justify-center text-xl shadow-lg pro-shadow">🤖</div>
              <div>
                <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Hub Tactical AI</h4>
                <p className="text-[8px] font-bold text-slate-500 uppercase">Operational Status: Optimal</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">✕</button>
          </div>

          <div className="p-3 bg-slate-950 flex gap-2">
            {(['fast', 'thinking', 'search'] as ChatMode[]).map(m => (
              <button 
                key={m} 
                onClick={() => setMode(m)}
                className={`flex-1 py-1.5 rounded-xl text-[8px] font-black uppercase transition-all ${mode === m ? 'bg-cyan-500 text-white' : 'bg-slate-900 text-slate-500'}`}
              >
                {m}
              </button>
            ))}
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-30">
                <span className="text-4xl mb-4">🛸</span>
                <p className="text-xs font-black uppercase tracking-widest">Standing by for strategic queries, {user.username}.</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-sm ${
                  m.role === 'user' ? 'bg-cyan-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none border border-white/5'
                }`}>
                  {m.text}
                </div>
                {m.sources && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {m.sources.map((s, idx) => s.web && (
                      <a key={idx} href={s.web.uri} target="_blank" className="text-[8px] bg-slate-800 px-2 py-1 rounded-lg text-cyan-400 hover:text-white transition-colors">
                        Ref: {s.web.title || 'Link'}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2 p-3 bg-slate-800 rounded-2xl w-fit animate-pulse">
                <div className="h-1.5 w-1.5 bg-cyan-400 rounded-full"></div>
                <div className="h-1.5 w-1.5 bg-cyan-400 rounded-full"></div>
                <div className="h-1.5 w-1.5 bg-cyan-400 rounded-full"></div>
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-950 border-t border-white/5">
            <div className="relative">
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Query AI..."
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-6 pr-14 text-sm text-white focus:border-cyan-500 outline-none transition-all"
              />
              <button onClick={handleSend} className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 bg-cyan-500 rounded-xl text-white shadow-lg pro-shadow flex items-center justify-center">➔</button>
            </div>
          </div>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-16 w-16 bg-cyan-500 rounded-2xl flex items-center justify-center text-3xl shadow-2xl pro-shadow hover:scale-110 active:scale-95 transition-all text-white relative group"
      >
        <div className="absolute inset-0 bg-cyan-400 rounded-2xl animate-ping opacity-20"></div>
        {isOpen ? '✕' : '🤖'}
      </button>
    </div>
  );
};

export default AIAssistant;
