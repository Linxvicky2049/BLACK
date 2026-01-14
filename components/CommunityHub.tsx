
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { api } from '../api';
import { Clan, User } from '../types';

interface CommunityHubProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

const CommunityHub: React.FC<CommunityHubProps> = ({ user, setUser }) => {
  const [clans, setClans] = useState<Clan[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [clanName, setClanName] = useState('');
  const [clanTag, setClanTag] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setClans(db.getClans());
  }, []);

  const handlePurchaseKey = async () => {
    setLoading(true);
    try {
      const updatedUser = await api.clans.purchaseKey(user.id);
      setUser(updatedUser);
      alert(`CLAN ACCESS KEY GENERATED: ${updatedUser.clanKey}. Your node is now authorized for founding protocols.`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { clan, user: updatedUser } = await api.clans.create(user.id, clanName, clanTag);
      setUser(updatedUser);
      setClans(db.getClans());
      setShowCreate(false);
      alert(`Clan "${clanName}" Founded. You have been granted leader clearance.`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const hasAccess = user.role === 'admin' || !!user.clanKey;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-3xl font-heading font-black italic text-white uppercase tracking-tighter">Clan HQ</h2>
          <p className="text-slate-400 text-xs font-black uppercase">Unite. Strategize. Conquer.</p>
        </div>
        {!hasAccess ? (
          <button 
            onClick={handlePurchaseKey}
            disabled={loading}
            className="px-8 py-3 bg-cyan-600 text-white font-black text-xs uppercase rounded-2xl shadow-xl hover:bg-cyan-500 transition-all flex items-center gap-3 border border-cyan-400/30"
          >
            {loading ? 'GENERATING...' : '🔑 PURCHASE CLAN KEY (₦100)'}
          </button>
        ) : (
          <button 
            onClick={() => setShowCreate(true)} 
            className="px-8 py-3 bg-white text-slate-950 font-black text-xs uppercase rounded-2xl shadow-xl hover:bg-cyan-400 transition-all"
          >
            FOUND NEW CLAN
          </button>
        )}
      </div>

      {user.clanKey && (
        <div className="p-4 glass rounded-2xl border border-cyan-400/20 flex items-center justify-between">
           <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest italic">ACTIVE CLAN KEY: {user.clanKey}</p>
           <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {clans.map(clan => (
          <div key={clan.id} className="glass p-6 rounded-[32px] text-center relative overflow-hidden group border border-white/5">
             <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 border border-white/5 shadow-inner group-hover:scale-110 transition-transform">🛡️</div>
             <h3 className="text-xl font-heading font-black italic text-white uppercase leading-none mb-1 tracking-tighter">{clan.name}</h3>
             <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-4">[{clan.tag}] • {clan.tier} TIER</p>
             <div className="grid grid-cols-2 gap-2 mb-6">
                <div className="bg-slate-950 p-2 rounded-xl border border-white/5">
                   <p className="text-[8px] font-black text-slate-600 uppercase">Members</p>
                   <p className="text-xs font-bold text-white">{clan.members.length}</p>
                </div>
                <div className="bg-slate-950 p-2 rounded-xl border border-white/5">
                   <p className="text-[8px] font-black text-slate-600 uppercase">XP</p>
                   <p className="text-xs font-bold text-purple-400">{clan.xp.toLocaleString()}</p>
                </div>
             </div>
             <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">Request Uplink</button>
          </div>
        ))}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
           <div className="w-full max-w-md glass border border-white/10 rounded-[40px] p-10 shadow-2xl">
              <h3 className="text-3xl font-heading font-black italic text-white uppercase mb-4 tracking-tighter">Foundation Protocol</h3>
              <form onSubmit={handleCreateClan} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-4">Clan Name</label>
                    <input required value={clanName} onChange={e => setClanName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-cyan-400/50" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-4">Tactical Tag (3 chars)</label>
                    <input required maxLength={3} value={clanTag} onChange={e => setClanTag(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-white font-bold uppercase outline-none focus:border-cyan-400/50" />
                 </div>
                 <button disabled={loading} className="w-full py-5 bg-cyan-600 text-white font-black uppercase tracking-[0.4em] text-xs rounded-2xl shadow-2xl transition-all hover:bg-cyan-500 active:scale-95">
                    {loading ? 'FOUNDING...' : 'CONFIRM DEPLOYMENT ➔'}
                 </button>
                 <button type="button" onClick={() => setShowCreate(false)} className="w-full text-[10px] font-black text-slate-500 uppercase hover:text-white transition-colors">Abort Mission</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default CommunityHub;
