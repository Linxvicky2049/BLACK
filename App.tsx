
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TournamentsList from './components/TournamentsList';
import WalletSection from './components/WalletSection';
import PodcastView from './components/PodcastView';
import CommunityHub from './components/CommunityHub';
import Marketplace from './components/Marketplace';
import AIAssistant from './components/AIAssistant';
import ProfilePage from './components/ProfilePage';
import Auth from './components/Auth';
import AdminHub from './components/AdminHub';
import EventsView from './components/EventsView';
import StreamingView from './components/StreamingView';
import Leaderboard from './components/Leaderboard';
import { NavSection, User } from './types';
import { db } from './db';
import { socket } from './socket';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<NavSection>(NavSection.Dashboard);
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('gh_active_session_id');
    if (session) {
      const foundUser = db.getUser(session);
      if (foundUser) setUser(foundUser);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!user) return;
    const cleanupWallet = socket.on('WALLET_SYNC', (data) => {
      if (data.userId === user.id) {
        setUser(prev => prev ? { ...prev, walletBalance: data.newBalance, hubCoins: data.hcBalance } : null);
      }
    });
    const cleanupUser = socket.on('USER_UPDATE', (updatedUser) => {
      if (updatedUser.id === user.id) setUser(updatedUser);
    });
    return () => {
      cleanupWallet();
      cleanupUser();
    };
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('gh_active_session_id');
    localStorage.removeItem('gh_token');
    setUser(null);
    setActiveSection(NavSection.Dashboard);
  };

  const handleLogin = (newUser: User) => {
    localStorage.setItem('gh_active_session_id', newUser.id);
    setUser(newUser);
  };

  if (!initialized) return (
    <div className="h-screen w-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="h-16 w-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(6,182,212,0.5)]"></div>
    </div>
  );

  if (!user) return <Auth onLogin={handleLogin} />;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-50 overflow-hidden relative selection:bg-cyan-500/30">
      {/* Immersive Dynamic Background Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[50%] bg-cyan-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full"></div>
      </div>

      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} user={user} onLogout={handleLogout} />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10 scroll-smooth custom-scrollbar">
        <header className="flex justify-between items-center mb-10 sticky top-0 z-50 glass rounded-[2rem] px-8 py-4 border border-white/5 shadow-2xl transition-all duration-300">
          <div className="hidden md:flex flex-col">
            <h1 className="text-3xl font-heading font-black uppercase tracking-tighter text-white italic leading-none group cursor-default">
              {activeSection.toUpperCase()} <span className="text-cyan-400 group-hover:animate-pulse">_</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-slate-500 text-[9px] font-black tracking-[0.5em] uppercase">SYSTEM.STATUS_OPTIMAL</span>
               <div className="h-1 w-1 bg-cyan-400 rounded-full"></div>
               <span className="text-slate-500 text-[9px] font-black tracking-[0.5em] uppercase">LINK_AFRICA_01</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-4 glass-bright px-6 py-2 rounded-2xl border border-white/5 group hover:border-cyan-400/30 transition-all cursor-pointer">
              <div className="flex flex-col items-end pr-4 border-r border-white/10">
                 <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">{user.hubCoins.toLocaleString()} HC</span>
                 <span className="text-lg font-heading font-black text-white italic tracking-tighter leading-none">₦{user.walletBalance.toLocaleString()}</span>
              </div>
              <div className="h-10 w-10 bg-slate-800 rounded-xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                💳
              </div>
            </div>

            <div 
              onClick={() => setActiveSection(NavSection.Profile)} 
              className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 p-[2px] cursor-pointer hover:scale-110 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] active:scale-95 group"
            >
              <div className="h-full w-full bg-slate-900 rounded-[14px] overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="User Avatar" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center font-black text-xl">{user.username.charAt(0)}</div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="pb-32 max-w-[1400px] mx-auto">
          {activeSection === NavSection.Dashboard && <Dashboard user={user} />}
          {activeSection === NavSection.Tournaments && <TournamentsList user={user} />}
          {activeSection === NavSection.Leaderboard && <Leaderboard />}
          {activeSection === NavSection.Streaming && <StreamingView user={user} />}
          {activeSection === NavSection.Events && <EventsView />}
          {activeSection === NavSection.Marketplace && <Marketplace />}
          {activeSection === NavSection.Wallet && <WalletSection user={user} setUser={setUser} />}
          {activeSection === NavSection.Podcast && <PodcastView user={user} />}
          {activeSection === NavSection.Community && <CommunityHub user={user} setUser={setUser} />}
          {activeSection === NavSection.Profile && <ProfilePage user={user} setUser={setUser} />}
          {activeSection === NavSection.Admin && (user.role === 'admin' ? <AdminHub /> : <Dashboard user={user} />)}
        </div>
        
        <AIAssistant user={user} />
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
        
        /* Subtle afro-tribal pattern animation */
        body::before {
          content: "";
          position: fixed;
          inset: 0;
          background-image: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 40px 40px;
          z-index: -1;
        }
      `}</style>
    </div>
  );
};

export default App;
