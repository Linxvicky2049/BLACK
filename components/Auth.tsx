
import React, { useState } from 'react';
import { AuthMode, User } from '../types';
import { api } from '../api';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (mode === 'login') {
        const { user } = await api.auth.login(email);
        onLogin(user);
      } else {
        // Sign Up Mode: Register and login immediately. 
        // Verification is deferred to the Profile page to avoid authentication roadblocks.
        const user = await api.auth.register(username, email);
        onLogin(user);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex items-center justify-center p-6 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[50%] h-[50%] bg-cyan-600/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%'}}></div>
      </div>

      <div className="w-full max-w-xl relative z-10 animate-in zoom-in-95 fade-in duration-1000">
        <div className="glass rounded-[4rem] p-12 md:p-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden border border-white/10 group">
          {/* Decorative Tribal Corners */}
          <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-cyan-400/30 rounded-tl-[4rem] pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-purple-500/30 rounded-br-[4rem] pointer-events-none"></div>

          <div className="text-center mb-16">
            <div className="h-24 w-24 bg-gradient-to-br from-cyan-400 via-purple-500 to-orange-500 rounded-3xl mx-auto flex items-center justify-center font-black text-5xl rotate-12 mb-10 shadow-[0_0_50px_rgba(6,182,212,0.4)] transition-transform hover:rotate-0 duration-700">
              <span className="-rotate-12 transition-transform text-white">G</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-black uppercase italic text-white tracking-tighter leading-none mb-4">
              {mode === 'login' ? 'IDENTITY SYNC' : 'INITIATE UPLINK'}
            </h2>
            <p className="text-cyan-400/60 text-xs font-black tracking-[0.5em] uppercase">
              HUB AFRICA // PROTOCOL v3.2
            </p>
          </div>

          {error && (
            <div className="mb-10 p-5 bg-red-500/10 border border-red-500/30 rounded-3xl text-red-400 text-center text-xs font-black uppercase tracking-widest animate-bounce">
              ⚠️ ACCESS_DENIED: {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {mode === 'signup' && (
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] ml-6">OPERATIVE CODENAME</label>
                <div className="relative">
                   <div className="absolute left-6 top-1/2 -translate-y-1/2 text-cyan-400/40 font-black text-lg">@</div>
                   <input type="text" required value={username} onChange={e => setUsername(e.target.value)} className="w-full glass-bright border border-white/5 rounded-3xl py-6 pl-14 pr-8 text-sm text-white focus:border-cyan-400/50 outline-none transition-all placeholder:text-white/10" placeholder="GhostInLagos" />
                </div>
              </div>
            )}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] ml-6">UPLINK CHANNEL (EMAIL)</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full glass-bright border border-white/5 rounded-3xl py-6 px-8 text-sm text-white focus:border-cyan-400/50 outline-none transition-all placeholder:text-white/10" placeholder="operative@nexus.af" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] ml-6">DECRYPTION KEY</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full glass-bright border border-white/5 rounded-3xl py-6 px-8 text-sm text-white focus:border-cyan-400/50 outline-none transition-all placeholder:text-white/10" placeholder="••••••••" />
            </div>
            
            <button type="submit" disabled={loading} className="w-full py-6 rounded-3xl font-black uppercase tracking-[0.5em] text-xs text-white bg-gradient-to-r from-cyan-600 via-purple-600 to-indigo-600 shadow-[0_20px_40px_rgba(34,211,238,0.2)] hover:scale-[1.03] active:scale-95 transition-all relative overflow-hidden group/btn">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
              {loading ? 'SYNCHRONIZING...' : mode === 'login' ? 'INITIALIZE SYSTEM' : 'ESTABLISH UPLINK'}
            </button>
          </form>

          <div className="mt-16 text-center">
            <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-[10px] font-black text-slate-500 hover:text-cyan-400 uppercase tracking-[0.4em] transition-all group">
              <span className="opacity-40 group-hover:opacity-100 transition-opacity">{mode === 'login' ? "NO IDENTITY?" : "ALREADY IDENTIFIED?"}</span> 
              <span className="ml-2 text-white group-hover:neon-text-cyan">{mode === 'login' ? "INITIATE UPLINK" : "IDENTITY SYNC"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
