
import React, { useState } from 'react';
import { db } from '../db';
import { api } from '../api';

const AdminHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'security' | 'economy' | 'users'>('security');
  const [searchId, setSearchId] = useState('');
  const [adjAmount, setAdjAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleAdminAdj = async (type: 'add' | 'sub', currency: 'NGN' | 'HC') => {
    if (!searchId || !adjAmount) return alert("Search ID and Amount Required.");
    setIsProcessing(true);
    try {
      await api.admin.modifyBalance(searchId, Number(adjAmount), type, currency);
      alert(`System Adjusted: ${type === 'add' ? '+' : '-'}${adjAmount} ${currency} for node ${searchId}`);
      setAdjAmount('');
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-6">
        <div>
           <h2 className="text-4xl font-heading font-black italic text-white uppercase tracking-tighter">Command Center</h2>
           <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em] mt-2 italic flex items-center gap-2">
             <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
             RESTRICTED ACCESS // SEC_LEVEL_04
           </p>
        </div>
        <div className="flex gap-2 bg-slate-950 p-1.5 rounded-2xl border border-white/5">
           {(['security', 'economy', 'users'] as const).map(tab => (
             <button 
               key={tab} 
               onClick={() => setActiveTab(tab)}
               className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-red-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'security' && (
            <div className="p-8 glass rounded-[40px] relative overflow-hidden group border border-white/5">
               <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none rotate-12 text-9xl font-black italic">WAF</div>
               <h3 className="text-xs font-black text-cyan-400 uppercase tracking-[0.3em] mb-8 italic">Hub Firewall Activity</h3>
               <div className="space-y-4 font-mono text-[10px] text-green-500/80 p-6 bg-black rounded-3xl border border-white/5 h-64 overflow-y-auto scrollbar-thin">
                  <p className="animate-pulse">>> [INFO] Intrusion Detection System Active...</p>
                  <p>>> [LOG] Real-time synchronization active for Payment Nodes.</p>
                  <p>>> [LOG] PayPal Gateway uplink validated.</p>
                  <p>>> [LOG] OPay wallet relay established for Region: Lagos.</p>
                  <p>>> [SEC] Node encryption enforced on all Clan Key transactions.</p>
                  <p className="text-red-500">>> [ALERT] 100 NGN purchase initiated for Clan Foundership.</p>
                  <p>>> [SEC] Data Encryption: AES-256 Enabled.</p>
                  <p>>> [SEC] Admin Authority: FULL CLEARANCE.</p>
               </div>
               <button className="w-full mt-6 py-4 bg-red-600/20 border border-red-500/30 text-red-500 font-black text-[10px] uppercase rounded-xl hover:bg-red-600 hover:text-white transition-all">FLUSH SECURITY LOGS</button>
            </div>
          )}

          {activeTab === 'economy' && (
             <div className="p-8 glass rounded-[40px] border border-white/5">
                <h3 className="text-xs font-black text-purple-400 uppercase tracking-[0.3em] mb-8 italic">Token Flow Dynamics</h3>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-6 bg-slate-950 rounded-3xl border border-white/5">
                      <p className="text-[8px] font-black text-slate-500 uppercase mb-2">Total System Hub Coins</p>
                      <p className="text-2xl font-heading font-black text-white italic">4.2M HC</p>
                   </div>
                   <div className="p-6 bg-slate-950 rounded-3xl border border-white/5">
                      <p className="text-[8px] font-black text-slate-500 uppercase mb-2">Admin Vault Balance (Verified)</p>
                      <p className="text-2xl font-heading font-black text-green-400 italic">₦{db.get().users.reduce((acc, u) => acc + u.walletBalance, 0).toLocaleString()}</p>
                   </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-white/5 space-y-6">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Manual Node Override</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input 
                        placeholder="Operative ID (e.g. user_01)" 
                        value={searchId}
                        onChange={e => setSearchId(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-red-500" 
                      />
                      <input 
                        type="number"
                        placeholder="Amount..." 
                        value={adjAmount}
                        onChange={e => setAdjAmount(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-red-500" 
                      />
                   </div>
                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <button onClick={() => handleAdminAdj('add', 'NGN')} disabled={isProcessing} className="py-3 bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 text-[9px] font-black uppercase rounded-xl hover:bg-cyan-600 hover:text-white transition-all">Add NGN</button>
                      <button onClick={() => handleAdminAdj('sub', 'NGN')} disabled={isProcessing} className="py-3 bg-red-600/20 border border-red-500/30 text-red-400 text-[9px] font-black uppercase rounded-xl hover:bg-red-600 hover:text-white transition-all">Sub NGN</button>
                      <button onClick={() => handleAdminAdj('add', 'HC')} disabled={isProcessing} className="py-3 bg-purple-600/20 border border-purple-500/30 text-purple-400 text-[9px] font-black uppercase rounded-xl hover:bg-purple-600 hover:text-white transition-all">Add HC</button>
                      <button onClick={() => handleAdminAdj('sub', 'HC')} disabled={isProcessing} className="py-3 bg-orange-600/20 border border-orange-500/30 text-orange-400 text-[9px] font-black uppercase rounded-xl hover:bg-orange-600 hover:text-white transition-all">Sub HC</button>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'users' && (
            <div className="p-8 glass rounded-[40px] border border-white/5">
               <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-8 italic">Operative Database</h3>
               <div className="space-y-4">
                  {db.get().users.map(u => (
                    <div key={u.id} className="p-4 bg-slate-950/50 border border-white/5 rounded-2xl flex justify-between items-center group hover:border-red-500/40 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-slate-800 rounded-xl flex items-center justify-center font-black">
                             {u.username.charAt(0)}
                          </div>
                          <div>
                             <p className="text-xs font-bold text-white">{u.username}</p>
                             <p className="text-[8px] font-black text-slate-600 uppercase">ID: {u.id}</p>
                          </div>
                       </div>
                       <div className="flex flex-col items-end">
                          <p className="text-[9px] font-black text-cyan-400">₦{u.walletBalance.toLocaleString()}</p>
                          <p className="text-[9px] font-black text-purple-400">{u.hubCoins.toLocaleString()} HC</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
           <div className="p-8 glass rounded-[40px] border border-red-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl"></div>
              <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-6">Holiday Protocols</h4>
              <div className="space-y-4">
                 {[
                   { name: 'Independence Day', date: 'Oct 01', type: 'National' },
                   { name: 'Christmas Day', date: 'Dec 25', type: 'Public' },
                   { name: 'Node Reset Day', date: 'Jan 01', type: 'System' }
                 ].map(h => (
                   <div key={h.name} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">{h.name}</span>
                        <span className="text-[7px] font-black text-slate-600 uppercase">{h.type}</span>
                      </div>
                      <span className="text-[9px] font-black text-cyan-400 uppercase">{h.date}</span>
                   </div>
                 ))}
                 <button className="w-full mt-4 py-2.5 bg-slate-800 text-slate-300 text-[9px] font-black uppercase rounded-lg border border-white/5 hover:bg-slate-700 transition-colors">+ Mark New Timeline Event</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHub;
