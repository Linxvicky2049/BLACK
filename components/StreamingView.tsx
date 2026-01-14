
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';

interface StreamingViewProps {
  user: User;
}

const StreamingView: React.FC<StreamingViewProps> = ({ user }) => {
  const [isSettingUp, setIsSettingUp] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [streamConfig, setStreamConfig] = useState({
    title: '',
    category: 'Call of Duty Mobile',
    privacy: 'Public' as 'Public' | 'Subscribers' | 'Clan Only'
  });
  
  const [comments, setComments] = useState<{user: string, text: string}[]>([
    { user: 'Abuja_Sniper', text: 'LETS GOOO! 🔥' },
    { user: 'Lagos_Queen', text: 'Clutch that lobby! 🎮' }
  ]);
  const [hearts, setHearts] = useState<{id: number, left: number}[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startSetup = () => setIsSettingUp(true);

  const toggleLive = async () => {
    if (!isLive) {
      if (!streamConfig.title) return alert("System requires a Broadcast Designation (Title).");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsLive(true);
        setIsSettingUp(false);
      } catch (e) {
        alert("Camera Access Denied. TikTok Protocol requires visual uplink.");
      }
    } else {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      setIsLive(false);
      setIsMinimized(false);
      setIsSettingUp(true);
    }
  };

  const addHeart = () => {
    const id = Date.now();
    setHearts(prev => [...prev, { id, left: Math.random() * 80 }]);
    setTimeout(() => setHearts(prev => prev.filter(h => h.id !== id)), 2000);
  };

  if (isSettingUp && !isLive) {
    return (
      <div className="h-screen -mt-24 md:-mt-32 -mx-4 md:-mx-8 bg-slate-950 flex justify-center items-center p-6">
        <div className="w-full max-w-lg glass rounded-[3rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">
           <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 blur-3xl"></div>
           <div className="text-center mb-10">
              <div className="h-20 w-20 bg-slate-900 rounded-3xl mx-auto flex items-center justify-center text-4xl mb-6 shadow-inner border border-white/5">📸</div>
              <h3 className="text-3xl font-heading font-black italic text-white uppercase tracking-tighter">Stream Configuration</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1">Readying Vertical Studio Uplink</p>
           </div>
           
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Broadcast Title</label>
                 <input 
                   required 
                   value={streamConfig.title} 
                   onChange={e => setStreamConfig({...streamConfig, title: e.target.value})}
                   className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-cyan-400/50" 
                   placeholder="Road to Lagos Major..." 
                 />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Category</label>
                    <select 
                      value={streamConfig.category} 
                      onChange={e => setStreamConfig({...streamConfig, category: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-cyan-400/50 appearance-none"
                    >
                      <option>Call of Duty Mobile</option>
                      <option>Free Fire</option>
                      <option>FIFA 26</option>
                      <option>Tekken 8</option>
                      <option>Just Chatting</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Privacy</label>
                    <select 
                      value={streamConfig.privacy} 
                      onChange={e => setStreamConfig({...streamConfig, privacy: e.target.value as any})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-cyan-400/50 appearance-none"
                    >
                      <option>Public</option>
                      <option>Subscribers</option>
                      <option>Clan Only</option>
                    </select>
                 </div>
              </div>

              <button 
                onClick={toggleLive}
                className="w-full py-6 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-[0.4em] text-xs rounded-2xl shadow-2xl transition-all shadow-red-600/20 mt-4 active:scale-95"
              >
                INITIALIZE BROADCAST ➔
              </button>
           </div>
        </div>
      </div>
    );
  }

  if (isMinimized && isLive) {
    return (
      <div 
        className="fixed bottom-24 right-8 z-[200] w-32 h-56 bg-slate-900 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.5)] border-2 border-cyan-400 cursor-pointer animate-in zoom-in-75 duration-300"
        onClick={() => setIsMinimized(false)}
      >
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-red-600 text-[8px] font-black text-white rounded animate-pulse">LIVE</div>
      </div>
    );
  }

  return (
    <div className="h-screen -mt-24 md:-mt-32 -mx-4 md:-mx-8 bg-black flex justify-center items-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1),transparent)]"></div>

      <div className="w-full max-w-[420px] h-[90vh] bg-slate-950 md:rounded-[40px] shadow-2xl relative border border-white/10 overflow-hidden flex flex-col">
        <div className="flex-1 relative bg-slate-900 overflow-hidden group">
          {isLive && (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          )}

          <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
               <div className="flex items-center gap-3 bg-black/30 backdrop-blur-md p-1 pr-4 rounded-full border border-white/10 pointer-events-auto">
                  <div className="h-9 w-9 rounded-full bg-slate-800 overflow-hidden border border-white/20">
                     <img src={user.avatarUrl} className="w-full h-full object-cover" alt="Host" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[10px] font-bold text-white">{user.username}</span>
                     <span className="text-[8px] font-black text-cyan-400">{streamConfig.category.toUpperCase()} // LIVE</span>
                  </div>
               </div>
               <div className="pointer-events-auto flex gap-2">
                  <button onClick={() => setIsMinimized(true)} className="h-9 w-9 bg-black/30 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10 hover:bg-black/60 transition-all">◪</button>
                  <button onClick={toggleLive} className="h-9 w-9 bg-red-600/30 backdrop-blur-md rounded-xl flex items-center justify-center text-red-500 border border-red-500/20 hover:bg-red-600 hover:text-white transition-all">✕</button>
               </div>
            </div>

            <div className="space-y-4 pointer-events-auto">
               <div className="bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/5 mb-2">
                  <h4 className="text-sm font-black text-white italic tracking-tighter uppercase">{streamConfig.title}</h4>
               </div>
               <div className="max-h-[160px] overflow-hidden mask-fade-top flex flex-col justify-end gap-2 pr-10">
                  {comments.map((c, i) => (
                    <div key={i} className="flex gap-2 items-start animate-in slide-in-from-left-2 duration-300">
                       <span className="text-[10px] font-black text-cyan-400 whitespace-nowrap">{c.user}:</span>
                       <span className="text-[11px] text-white font-medium drop-shadow-md">{c.text}</span>
                    </div>
                  ))}
               </div>
               
               <div className="flex gap-3 items-center">
                  <div className="flex-1 bg-black/40 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 flex items-center">
                     <input placeholder="Add signal..." className="w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-500" />
                  </div>
                  <button onClick={addHeart} className="h-12 w-12 bg-rose-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all">❤️</button>
                  <button className="h-12 w-12 bg-amber-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all">🎁</button>
               </div>
            </div>

            <div className="absolute right-6 bottom-24 h-64 w-20 overflow-hidden pointer-events-none">
               {hearts.map(h => (
                 <div 
                   key={h.id} 
                   className="absolute bottom-0 text-rose-500 text-2xl animate-[floatUp_2s_ease-out_forwards]"
                   style={{ left: `${h.left}%` }}
                 >
                   ❤️
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-300px) scale(1.5); opacity: 0; }
        }
        .mask-fade-top {
          mask-image: linear-gradient(to top, black 80%, transparent);
        }
      `}</style>
    </div>
  );
};

export default StreamingView;
