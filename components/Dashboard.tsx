
import React from 'react';
import { NEWS, TOURNAMENTS } from '../constants';
import { User } from '../types';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Immersive Hero Section */}
      <div className="relative h-[28rem] rounded-[3.5rem] overflow-hidden glass shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] group">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1600" 
            alt="Hero Background" 
            className="w-full h-full object-cover transition-transform duration-2000 group-hover:scale-110 opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
        </div>

        {/* Floating Geometric Elements (Afro-Futuristic) */}
        <div className="absolute top-10 right-20 w-40 h-40 border border-cyan-400/20 rounded-full float opacity-30 pointer-events-none"></div>
        <div className="absolute bottom-10 right-40 w-24 h-24 border border-purple-500/20 rotate-45 float opacity-30 pointer-events-none" style={{animationDelay: '-2s'}}></div>

        <div className="relative z-10 h-full flex flex-col justify-end p-10 md:p-16 max-w-3xl">
          <div className="flex items-center gap-4 mb-6">
             <div className="px-4 py-1 bg-cyan-500/20 backdrop-blur-md border border-cyan-400/50 text-cyan-400 text-[10px] font-black rounded-full uppercase tracking-[0.3em] animate-pulse">
               CRITICAL FREQUENCY
             </div>
             <div className="flex items-center gap-2 text-[10px] font-black text-white/60 uppercase tracking-widest">
               <span className="h-2 w-2 bg-red-500 rounded-full animate-ping"></span>
               Lagos Node Active
             </div>
          </div>
          <h2 className="text-5xl md:text-7xl font-heading font-black mb-6 italic tracking-tighter uppercase leading-[0.9] text-white">
            WAKANDA <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">DIGITAL</span> ARENA
          </h2>
          <p className="text-slate-300 text-lg mb-8 font-medium max-w-xl leading-relaxed opacity-80">
            The nexus of African competitive gaming. Step into the arena where tradition meets the cyber-frontier.
          </p>
          <div className="flex flex-wrap gap-6">
            <button className="px-10 py-4 bg-white text-slate-950 font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:bg-cyan-400 hover:text-white transition-all hover:scale-110 active:scale-95 shadow-[0_10px_30px_rgba(255,255,255,0.2)]">
              ENTER NUCLEUS
            </button>
            <button className="px-10 py-4 glass-bright border border-white/10 text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:border-cyan-400 hover:bg-white/5 transition-all">
              BROADCASTS
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* News & Intel Feed */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-center px-4">
            <div>
              <h3 className="text-3xl font-heading font-black text-white uppercase italic tracking-tighter">GLOBAL INTEL</h3>
              <p className="text-[10px] font-black text-cyan-400/60 uppercase tracking-[0.4em] mt-1">Satellite Feed // Active</p>
            </div>
            <button className="text-[10px] text-white/40 font-black hover:text-cyan-400 uppercase tracking-widest transition-all">View Database ➔</button>
          </div>
          
          <div className="grid gap-6">
            {NEWS.map((news) => (
              <div key={news.id} className="glass group rounded-[2.5rem] p-6 flex flex-col md:flex-row gap-8 hover:border-cyan-400/40 transition-all duration-500 cursor-pointer relative overflow-hidden hologram-card">
                <div className="w-full md:w-56 h-40 rounded-[2rem] overflow-hidden shrink-0 relative border border-white/5">
                  <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000 opacity-80 group-hover:opacity-100" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black uppercase text-purple-400 tracking-[0.3em]">
                        {news.category}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-950/50 px-3 py-1 rounded-full">{news.date}</span>
                    </div>
                    <h4 className="font-heading font-black text-2xl leading-tight mb-3 group-hover:text-cyan-400 transition-colors uppercase italic tracking-tighter">
                      {news.title}
                    </h4>
                    <p className="text-slate-400 text-sm font-medium line-clamp-2 leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                      {news.summary}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-3 pt-4 border-t border-white/5">
                    <div className="h-6 w-6 rounded-lg bg-cyan-400/20 flex items-center justify-center text-[10px]">👤</div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Operative: {news.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Data Modules */}
        <div className="space-y-10">
          {/* Active Arena Module */}
          <div className="glass rounded-[3rem] p-8 relative overflow-hidden border border-cyan-400/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 blur-3xl rounded-full"></div>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-heading font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                <span className="text-cyan-400">⚡</span> ACTIVE ARENAS
              </h3>
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
            </div>
            <div className="space-y-6">
              {TOURNAMENTS.filter(t => t.status === 'active').slice(0, 2).map((t) => (
                <div key={t.id} className="glass-bright p-6 rounded-[2rem] border border-white/5 group hover:border-cyan-400/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">{t.game}</span>
                    <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest">LIVE</span>
                  </div>
                  <h5 className="font-heading font-black text-lg mb-6 leading-tight group-hover:text-cyan-400 transition-colors uppercase italic tracking-tighter">{t.title}</h5>
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-500 uppercase">Pool Contribution</span>
                      <span className="text-xl font-heading font-black text-cyan-400 italic tracking-tighter">{t.prizePool}</span>
                    </div>
                    <button className="h-12 w-12 bg-white text-slate-950 rounded-2xl shadow-xl flex items-center justify-center hover:bg-cyan-400 hover:text-white transition-all hover:rotate-12">
                      ⚔️
                    </button>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full rounded-full" 
                      style={{ width: `${(t.participants / t.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-3 flex justify-between text-[9px] font-black text-slate-500 uppercase">
                    <span>Infiltration</span>
                    <span>{t.participants}/{t.maxParticipants} Units</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 glass-bright border border-white/10 rounded-[1.5rem] text-[10px] font-black text-white uppercase tracking-[0.4em] hover:bg-white/5 transition-all">
              FULL ARENA DIRECTORY
            </button>
          </div>

          {/* Cultural Frequency Promo */}
          <div className="glass rounded-[3rem] p-8 bg-gradient-to-br from-purple-900/40 via-transparent to-slate-950/80 border-purple-500/20 relative overflow-hidden group hover:border-purple-400/40 transition-all duration-700">
            <div className="absolute -top-10 -right-10 h-32 w-32 bg-purple-500/10 blur-3xl rounded-full"></div>
            <h3 className="text-xl font-heading font-black text-white italic uppercase tracking-tighter mb-4 flex items-center gap-3">
              <span className="text-purple-400 text-2xl animate-pulse">📻</span> NEXUS RADIO
            </h3>
            <p className="text-xs text-slate-400 mb-8 font-medium italic opacity-70">"Decrypting the Afro-Gaming future."</p>
            
            <div className="glass-bright p-5 rounded-[2rem] flex items-center gap-5 border border-white/5 cursor-pointer group/item hover:bg-purple-500/10 transition-all">
              <div className="h-14 w-14 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-xl shadow-2xl group-hover/item:scale-110 transition-transform duration-500">
                🎧
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-white truncate uppercase tracking-tighter">Episode 88: Lagos-Cyber City 2050</p>
                <div className="flex items-center gap-2 mt-2">
                   <div className="flex gap-1 items-end h-3">
                      <div className="w-1 bg-purple-400 h-full animate-bounce" style={{animationDuration: '0.8s'}}></div>
                      <div className="w-1 bg-purple-400 h-2/3 animate-bounce" style={{animationDuration: '1.2s'}}></div>
                      <div className="w-1 bg-purple-400 h-full animate-bounce" style={{animationDuration: '0.6s'}}></div>
                   </div>
                   <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">LIVE STREAM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
