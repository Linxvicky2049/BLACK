
import React, { useState, useEffect } from 'react';

const MOCK_DATA = [
  { username: 'Lagos_Sniper', country: 'Nigeria', wins: 450, kd: '3.12', xp: 54000, type: 'global' },
  { username: 'CapeTown_King', country: 'South Africa', wins: 420, kd: '2.95', xp: 48000, type: 'global' },
  { username: 'NaijaWarrior_X', country: 'Nigeria', wins: 1420, kd: '2.45', xp: 12500, type: 'national' },
  { username: 'Eko_Warrior', country: 'Nigeria', wins: 280, kd: '2.10', xp: 15000, type: 'national' },
];

const Leaderboard: React.FC = () => {
  const [tier, setTier] = useState<'global' | 'national' | 'social'>('global');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [tier]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-heading font-black italic text-white uppercase tracking-tighter">Combat <span className="text-cyan-400">Standings</span></h2>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2 italic">Multi-Tier Operative Synchronization</p>
        </div>
        
        <div className="flex gap-2 bg-slate-950 p-1.5 rounded-2xl border border-white/5">
          {(['global', 'national', 'social'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tier === t ? 'bg-cyan-500 text-white shadow-xl pro-shadow' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="gamer-border rounded-[40px] bg-slate-900/40 overflow-hidden shadow-2xl min-h-[500px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
             <div className="h-10 w-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest animate-pulse">Filtering Signal Data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-slate-950/50 border-b border-white/5">
                   <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase">Rank</th>
                   <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase">Operative</th>
                   <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase">Territory</th>
                   <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase text-right">Wins</th>
                   <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase text-right">K/D</th>
                   <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase text-right">XP</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {MOCK_DATA.filter(d => tier === 'global' ? true : d.type === tier).map((p, idx) => (
                   <tr key={p.username} className="hover:bg-white/5 transition-colors group">
                     <td className="px-8 py-6 font-heading font-black italic text-xl text-slate-600 group-hover:text-cyan-400">#{(idx+1).toString().padStart(2,'0')}</td>
                     <td className="px-8 py-6 font-bold text-white">{p.username}</td>
                     <td className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase">{p.country}</td>
                     <td className="px-8 py-6 text-right font-black text-white">{p.wins}</td>
                     <td className="px-8 py-6 text-right font-black text-cyan-500">{p.kd}</td>
                     <td className="px-8 py-6 text-right font-black text-purple-400">{p.xp.toLocaleString()}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
