
import React, { useState } from 'react';
import { User } from '../types';
import { api } from '../api';

interface WalletProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

const HC_TIERS = [
  { hc: 500, price: 1000, label: 'Tactical Starter' },
  { hc: 2500, price: 4500, label: 'Pro Pack', bonus: '10%' },
  { hc: 6500, price: 10000, label: 'Major Stash', bonus: '30%' },
  { hc: 15000, price: 20000, label: 'Apex Legends Cache', bonus: '50%' },
];

const WalletSection: React.FC<WalletProps> = ({ user, setUser }) => {
  const [topUpAmount, setTopUpAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [view, setView] = useState<'vault' | 'tokens'>('vault');
  const [provider, setProvider] = useState<'opay' | 'paypal' | 'card'>('opay');

  const handleTopUp = async () => {
    const amount = Number(topUpAmount);
    if (!amount || amount < 500) return alert("Minimum Vault Refill: ₦500");
    
    setIsProcessing(true);
    try {
      const updatedUser = await api.wallet.topUpVault(user.id, amount, provider);
      setUser(updatedUser);
      setTopUpAmount('');
      alert(`Vault Refill Successful via ${provider.toUpperCase()}. Real-time sync complete.`);
    } catch (e) {
      alert("Relay Failure.");
    } finally {
      setIsProcessing(false);
    }
  };

  const buyHC = async (ngn: number, hc: number) => {
    if (user.walletBalance < ngn) return alert("Insufficient Vault Funds. Refill your NGN balance first.");
    
    setIsProcessing(true);
    try {
      const updatedUser = await api.wallet.convertNGNtoHC(user.id, ngn, hc);
      setUser(updatedUser);
      alert(`${hc} Hub Coins deployed to your inventory.`);
    } catch (e) {
      alert("Token deployment failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-[40px] relative overflow-hidden group border border-white/5">
           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-6xl italic">₦</div>
           <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block mb-1">Cash Vault (NGN)</span>
           <p className="text-4xl font-heading font-black text-white italic tracking-tighter">₦{user.walletBalance.toLocaleString()}</p>
           <button onClick={() => setView('vault')} className={`mt-6 text-[9px] font-black uppercase px-6 py-2 rounded-xl border transition-all ${view === 'vault' ? 'bg-cyan-500 border-cyan-400 text-white shadow-lg shadow-cyan-500/20' : 'border-white/10 text-slate-500 hover:text-white'}`}>Refill Vault</button>
        </div>
        <div className="glass p-8 rounded-[40px] relative overflow-hidden group border border-white/5">
           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-6xl italic">HC</div>
           <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block mb-1">Hub Coin Tokens (HC)</span>
           <p className="text-4xl font-heading font-black text-white italic tracking-tighter">{user.hubCoins.toLocaleString()} HC</p>
           <button onClick={() => setView('tokens')} className={`mt-6 text-[9px] font-black uppercase px-6 py-2 rounded-xl border transition-all ${view === 'tokens' ? 'bg-purple-500 border-purple-400 text-white shadow-lg shadow-purple-500/20' : 'border-white/10 text-slate-500 hover:text-white'}`}>Buy Tokens</button>
        </div>
      </div>

      <div className="p-10 glass rounded-[48px] relative overflow-hidden border border-white/5">
        {view === 'vault' ? (
          <div className="space-y-10">
             <div>
                <h3 className="text-2xl font-heading font-black italic text-white uppercase tracking-tighter">Vault Refill Protocol</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1 italic">Secure Multi-Provider Payment Processing</p>
             </div>
             
             <div className="grid grid-cols-3 gap-4">
                {(['opay', 'paypal', 'card'] as const).map(p => (
                  <button 
                    key={p} 
                    onClick={() => setProvider(p)}
                    className={`p-6 rounded-3xl border flex flex-col items-center gap-3 transition-all ${provider === p ? 'bg-white/10 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]' : 'bg-slate-950 border-white/5 opacity-50'}`}
                  >
                    <span className="text-2xl">{p === 'opay' ? '📱' : p === 'paypal' ? '🅿️' : '💳'}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{p}</span>
                  </button>
                ))}
             </div>

             <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-slate-700 group-focus-within:text-cyan-400 transition-colors">₦</span>
                <input 
                  type="text" 
                  value={topUpAmount} 
                  onChange={e => setTopUpAmount(e.target.value)} 
                  placeholder="Enter Amount..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-3xl py-8 pl-14 pr-8 text-4xl font-heading font-black text-white focus:border-cyan-500 outline-none transition-all placeholder:text-slate-900"
                />
             </div>
             <button 
               onClick={handleTopUp}
               disabled={isProcessing}
               className="w-full py-6 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-[0.4em] text-xs rounded-2xl shadow-2xl transition-all shadow-cyan-500/20 disabled:opacity-50"
             >
               {isProcessing ? 'INITIALIZING EXTERNAL RELAY...' : `PAY VIA ${provider.toUpperCase()} ➔`}
             </button>
          </div>
        ) : (
          <div className="space-y-8">
             <div>
                <h3 className="text-2xl font-heading font-black italic text-white uppercase tracking-tighter">Hub Coin Deployment</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1 italic">Convert your Vault NGN into tactical HC tokens</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {HC_TIERS.map(tier => (
                  <button 
                    key={tier.label} 
                    onClick={() => buyHC(tier.price, tier.hc)}
                    disabled={isProcessing}
                    className="p-6 bg-slate-950 border border-white/5 rounded-3xl text-left hover:border-purple-500/50 transition-all group relative overflow-hidden active:scale-95"
                  >
                    {tier.bonus && <span className="absolute top-4 right-4 bg-purple-500 text-white text-[8px] font-black px-2 py-1 rounded">+{tier.bonus} BONUS</span>}
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">{tier.label}</p>
                    <p className="text-2xl font-heading font-black text-white italic tracking-tighter">{tier.hc} HC</p>
                    <p className="text-xs font-bold text-purple-400 mt-2">Cost: ₦{tier.price.toLocaleString()}</p>
                  </button>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletSection;
