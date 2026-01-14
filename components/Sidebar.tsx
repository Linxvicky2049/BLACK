
import React from 'react';
import { NavSection, User } from '../types';

interface SidebarProps {
  activeSection: NavSection;
  setActiveSection: (section: NavSection) => void;
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, user, onLogout }) => {
  const menuItems = [
    { id: NavSection.Dashboard, label: 'Central Hub', icon: '💎' },
    { id: NavSection.Tournaments, label: 'Combat Arena', icon: '⚡' },
    { id: NavSection.Leaderboard, label: 'Dynasty Rank', icon: '🏆' },
    { id: NavSection.Streaming, label: 'Direct Feed', icon: '📡' },
    { id: NavSection.Events, label: 'Nexus Events', icon: '🏮' },
    { id: NavSection.Community, label: 'Great Clans', icon: '🛡️' },
    { id: NavSection.Marketplace, label: 'Tek Armory', icon: '⚔️' },
    { id: NavSection.Wallet, label: 'Vault', icon: '💰' },
    { id: NavSection.Podcast, label: 'Frequency', icon: '🎙️' },
    { id: NavSection.Profile, label: 'Identity', icon: '👤' },
  ];

  if (user.role === 'admin') {
    menuItems.push({ id: NavSection.Admin, label: 'Core Command', icon: '🔐' });
  }

  return (
    <aside className="w-24 md:w-72 h-[calc(100vh-2rem)] m-4 glass rounded-[2.5rem] flex flex-col transition-all duration-500 relative z-40 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      {/* Branding */}
      <div className="p-8 mb-4">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="h-12 w-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center font-black text-2xl rotate-12 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-transform group-hover:rotate-0 duration-500">
            <span className="-rotate-12 group-hover:rotate-0 transition-transform text-white">G</span>
          </div>
          <div className="hidden md:flex flex-col">
            <span className="font-heading font-black text-2xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-white to-purple-400 tracking-tighter italic">
              HUB AFRICA
            </span>
            <span className="text-[10px] font-black tracking-[0.5em] text-cyan-400/60 uppercase">NEO-TERRA UNIT</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-none pb-8">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full group relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 overflow-hidden ${
              activeSection === item.id
                ? 'bg-gradient-to-r from-cyan-500/20 to-transparent text-white border-l-4 border-cyan-400 shadow-[inset_10px_0_20px_rgba(34,211,238,0.1)]'
                : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <span className={`text-2xl transition-all duration-500 ${activeSection === item.id ? 'scale-125 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'group-hover:scale-110'}`}>
              {item.icon}
            </span>
            <span className={`hidden md:block font-bold text-sm uppercase tracking-widest transition-all ${activeSection === item.id ? 'translate-x-1' : ''}`}>
              {item.label}
            </span>
            {activeSection === item.id && (
              <div className="absolute right-4 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee] animate-pulse"></div>
            )}
          </button>
        ))}
      </nav>

      {/* Footer / User Profile Summary */}
      <div className="p-6 mt-auto space-y-4">
        <div className="hidden md:block glass-bright rounded-3xl p-5 border border-purple-500/20 group hover:border-purple-500/50 transition-all cursor-pointer">
           <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-800 border border-purple-500/30 overflow-hidden p-0.5">
                 <img src={user.avatarUrl} className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="flex flex-col">
                 <span className="text-xs font-black text-white uppercase truncate max-w-[120px]">{user.username}</span>
                 <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest">{user.rank}</span>
              </div>
           </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all group"
        >
          <span className="text-xl group-hover:rotate-12 transition-transform">🔌</span>
          <span className="hidden md:block font-bold text-sm uppercase tracking-widest">Disconnect</span>
        </button>
      </div>
      
      {/* Decorative Tribal Pattern Overlay */}
      <div className="absolute bottom-0 right-0 w-32 h-32 opacity-5 pointer-events-none rotate-45 translate-x-10 translate-y-10">
         <svg viewBox="0 0 100 100" className="fill-cyan-400">
            <path d="M0 0 L100 0 L100 100 L0 100 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
         </svg>
      </div>
    </aside>
  );
};

export default Sidebar;
