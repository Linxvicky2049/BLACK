
import React, { useState } from 'react';
import { User } from '../types';

interface PodcastViewProps {
  user: User;
}

const PodcastView: React.FC<PodcastViewProps> = ({ user }) => {
  const [isLive, setIsLive] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<{user: string, text: string}[]>([
    { user: 'AbujaSniper', text: 'This strategy is gold!' },
    { user: 'LagosGamer', text: 'Next week invite the Apex team!' }
  ]);

  const isAdmin = user.role === 'admin';

  const handleGoLive = () => {
    if (!isAdmin) return;
    setIsLive(!isLive);
  };

  const postComment = () => {
    if (!comment.trim()) return;
    setComments([...comments, { user: user.username, text: comment }]);
    setComment('');
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row items-end justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <h2 className="text-3xl font-heading font-black italic text-white uppercase tracking-tighter">The Hub Radio</h2>
          <p className="text-slate-400">Global insights, local frequencies.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={handleGoLive}
            className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all ${isLive ? 'bg-red-600 text-white' : 'bg-white text-slate-950 hover:bg-cyan-400'}`}
          >
            {isLive ? '🛑 END BROADCAST' : '🎙️ START STUDIO UPLINK'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className={`relative aspect-video rounded-[40px] overflow-hidden bg-slate-950 border-2 transition-all duration-700 ${isLive ? 'border-red-500/40 shadow-2xl' : 'border-white/5'}`}>
             {isLive ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900">
                  <div className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center animate-pulse mb-6">🎙️</div>
                  <h3 className="text-2xl font-heading font-black text-white italic uppercase tracking-tighter animate-pulse">ON AIR: LIVE STUDIO</h3>
               </div>
             ) : (
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="h-20 w-20 bg-slate-800 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 opacity-20">🔇</div>
                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">Studio Offline // Next Uplink: 18:00 WAT</p>
                  </div>
               </div>
             )}
          </div>

          <div className="p-8 gamer-border rounded-[40px] bg-slate-900/40">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 italic">Tactical Chat Feed</h3>
            <div className="h-64 overflow-y-auto space-y-4 pr-2 mb-6 scrollbar-thin">
              {comments.map((c, i) => (
                <div key={i} className="flex gap-4 p-3 bg-slate-950/50 rounded-2xl border border-white/5">
                  <span className="text-cyan-400 font-black text-[10px] uppercase">{c.user}:</span>
                  <span className="text-slate-300 text-xs font-medium">{c.text}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Send signal to studio..." className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-bold focus:border-cyan-500 outline-none transition-all" />
              <button onClick={postComment} className="h-12 w-12 bg-cyan-500 text-white rounded-xl shadow-lg flex items-center justify-center hover:scale-105 transition-transform">➔</button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 gamer-border rounded-[40px] bg-slate-900/40">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Upcoming Studio Logs</h4>
            <div className="space-y-4">
              {[
                { time: 'TUE 18:00', title: 'Road to Lagos Major', host: 'Admin' },
                { time: 'THU 20:00', title: 'Anime Night: Naruto Rewatch', host: 'VIP_Host' },
                { time: 'SAT 14:00', title: 'Esports Monetization 101', host: 'Tunde_B' }
              ].map(event => (
                <div key={event.title} className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer">
                  <p className="text-[8px] font-black text-purple-400 uppercase mb-1">{event.time}</p>
                  <p className="text-xs font-bold text-white mb-1">{event.title}</p>
                  <p className="text-[9px] text-slate-600 font-black uppercase">Host: {event.host}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastView;
