
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Tournament, User } from '../types';

interface TournamentsListProps {
  user: User;
}

const TournamentsList: React.FC<TournamentsListProps> = ({ user }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [isProcessingReg, setIsProcessingReg] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '', game: '', prizePool: '', entryFee: '', date: '', time: '', region: 'Africa West', lobbyId: '', accessPin: '', maxParticipants: 64
  });

  useEffect(() => {
    setTournaments(db.getTournaments());
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newT: Tournament = {
      id: `t_${Date.now()}`,
      title: formData.title,
      game: formData.game,
      prizePool: formData.prizePool,
      entryFee: formData.entryFee,
      date: formData.date,
      time: formData.time,
      location: formData.region,
      status: 'upcoming',
      participants: 0,
      maxParticipants: Number(formData.maxParticipants),
      lobby: {
        lobbyId: formData.lobbyId,
        accessPin: formData.accessPin,
        region: formData.region,
        lobbyType: 'Public'
      }
    };
    db.addTournament(newT);
    setTournaments(db.getTournaments());
    setShowCreate(false);
  };

  const handleEnlistClick = (t: Tournament) => {
    setSelectedTournament(t);
  };

  const confirmEnlistment = async () => {
    if (!selectedTournament) return;
    
    setIsProcessingReg(true);
    // Simulate network delay for tactical feel
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const success = db.registerForTournament(selectedTournament.id, user.id);
    
    if (success) {
      alert(`ENLISTMENT CONFIRMED: You are now synced to the ${selectedTournament.title} arena.`);
      setTournaments(db.getTournaments());
    } else {
      alert("SYSTEM CONFLICT: Operative already registered or arena is at max capacity.");
    }
    
    setIsProcessingReg(false);
    setSelectedTournament(null);
  };

  const launchLobby = (t: Tournament) => {
    if (!t.lobby) return;
    alert(`LAUNCHING PROTOCOL: Opening ${t.game}...\nRedirecting to Lobby: ${t.lobby.lobbyId}\nAccess Key: ${t.lobby.accessPin || 'NOT REQUIRED'}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-heading font-black italic text-white uppercase tracking-tighter">Combat <span className="text-cyan-400">Arenas</span></h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Verify Lobby ID & Infiltrate Private Battles</p>
        </div>
        {user.role === 'admin' && (
          <button 
            onClick={() => setShowCreate(true)} 
            className="px-8 py-4 bg-white text-slate-950 font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:scale-105 transition-all"
          >
            + DEPLOY TOURNAMENT
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tournaments.map(t => (
          <div key={t.id} className="glass rounded-[2.5rem] p-8 relative group overflow-hidden border border-white/5 hover:border-cyan-400/30 transition-all duration-500 hologram-card">
             <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-400/10 px-3 py-1 rounded-lg">{t.game}</span>
                <span className="text-[9px] font-black text-slate-500 bg-slate-950/50 px-3 py-1 rounded-lg uppercase">{t.location}</span>
             </div>
             <h3 className="text-2xl font-heading font-black italic text-white uppercase mb-8 leading-none tracking-tighter group-hover:text-cyan-400 transition-colors">{t.title}</h3>
             
             <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Prize Pool</span>
                  <span className="text-sm font-black text-white italic">{t.prizePool}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Entry Protocol</span>
                  <span className="text-sm font-black text-purple-400 italic">{t.entryFee}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Timeline</span>
                  <span className="text-xs font-bold text-slate-300">{t.date} @ {t.time}</span>
                </div>
             </div>

             <div className="mb-8">
                <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase mb-2">
                  <span>Infiltration Progress</span>
                  <span className="text-white">{t.participants} / {t.maxParticipants}</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-1000"
                    style={{ width: `${(t.participants / t.maxParticipants) * 100}%` }}
                  ></div>
                </div>
             </div>

             {t.lobby && t.participants > 0 && (
               <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 mb-6 group-hover:bg-slate-950 transition-all">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] font-black text-slate-600 uppercase">Secure Lobby Key</span>
                    <span className="text-xs font-black text-cyan-400 tracking-widest">SYNCED</span>
                  </div>
                  <button onClick={() => launchLobby(t)} className="w-full py-3 bg-slate-800 text-white text-[10px] font-black uppercase rounded-xl hover:bg-slate-700 transition-all border border-white/5">ACCESS PRIVATE LOBBY</button>
               </div>
             )}

             <button 
                onClick={() => handleEnlistClick(t)}
                className="w-full py-5 bg-cyan-500 text-white font-black uppercase text-xs tracking-[0.3em] rounded-2xl shadow-[0_10px_20px_rgba(6,182,212,0.2)] hover:bg-cyan-400 hover:scale-[1.02] active:scale-95 transition-all"
             >
                ENLIST NOW
             </button>
          </div>
        ))}
      </div>

      {/* ENLISTMENT CONFIRMATION MODAL */}
      {selectedTournament && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="w-full max-w-xl glass rounded-[4rem] p-12 border border-cyan-400/30 shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative overflow-hidden animate-in zoom-in-95 duration-500">
              {/* Tribal Patterns */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none -translate-y-10 translate-x-10 rotate-45">
                 <svg viewBox="0 0 100 100" className="fill-cyan-400"><path d="M0 0 L100 0 L100 100 L0 100 Z" strokeWidth="2" stroke="currentColor" fill="none"/></svg>
              </div>

              <div className="text-center mb-10">
                <div className="h-20 w-20 bg-cyan-500/20 rounded-3xl mx-auto flex items-center justify-center text-4xl mb-6 border border-cyan-400/30">⚔️</div>
                <h3 className="text-4xl font-heading font-black italic text-white uppercase tracking-tighter mb-2">INITIATE ENLISTMENT</h3>
                <p className="text-[10px] font-black text-cyan-400/60 uppercase tracking-[0.4em]">Review Tactical Assignment</p>
              </div>

              <div className="space-y-6 mb-10 p-8 glass-bright rounded-[2.5rem] border border-white/5">
                 <div className="flex justify-between items-end border-b border-white/5 pb-4">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-slate-500 uppercase mb-1">Assigned Arena</span>
                       <span className="text-xl font-heading font-black text-white italic uppercase tracking-tighter leading-none">{selectedTournament.title}</span>
                    </div>
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{selectedTournament.game}</span>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-8 pt-2">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-slate-500 uppercase mb-1">Deployment Fee</span>
                       <span className="text-lg font-heading font-black text-purple-400 italic tracking-tighter leading-none">{selectedTournament.entryFee}</span>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-slate-500 uppercase mb-1">Target Bounty</span>
                       <span className="text-lg font-heading font-black text-green-400 italic tracking-tighter leading-none">{selectedTournament.prizePool}</span>
                    </div>
                 </div>

                 <div className="pt-4 flex flex-col">
                    <span className="text-[9px] font-black text-slate-500 uppercase mb-1">Arena Schedule</span>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{selectedTournament.date} @ {selectedTournament.time} (WAT)</span>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <button 
                    onClick={() => setSelectedTournament(null)}
                    disabled={isProcessingReg}
                    className="py-5 bg-slate-900 border border-white/5 text-slate-500 font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl hover:bg-slate-800 transition-all disabled:opacity-50"
                 >
                    ABORT
                 </button>
                 <button 
                    onClick={confirmEnlistment}
                    disabled={isProcessingReg}
                    className="py-5 bg-gradient-to-r from-cyan-600 to-cyan-400 text-white font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl shadow-2xl pro-shadow hover:scale-105 active:scale-95 transition-all relative overflow-hidden"
                 >
                    {isProcessingReg ? (
                      <div className="flex items-center justify-center gap-2">
                         <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                         <span>SYNCING...</span>
                      </div>
                    ) : 'CONFIRM ENLISTMENT'}
                 </button>
              </div>
           </div>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-3xl glass rounded-[4rem] p-12 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar border border-white/10">
            <h3 className="text-4xl font-heading font-black italic text-white uppercase mb-10 tracking-tighter">Deploy New Arena</h3>
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="md:col-span-2 space-y-3">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Arena Designation</label>
                 <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full glass-bright border border-white/5 rounded-2xl p-5 text-white text-sm outline-none focus:border-cyan-400/50 transition-all" placeholder="E.g. LAGOS SUPREME" />
               </div>
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Target Software</label>
                 <input required value={formData.game} onChange={e => setFormData({...formData, game: e.target.value})} placeholder="e.g. COD Mobile" className="w-full glass-bright border border-white/5 rounded-2xl p-5 text-white text-sm outline-none focus:border-cyan-400/50 transition-all" />
               </div>
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Bounty Pool</label>
                 <input required value={formData.prizePool} onChange={e => setFormData({...formData, prizePool: e.target.value})} className="w-full glass-bright border border-white/5 rounded-2xl p-5 text-white text-sm outline-none focus:border-cyan-400/50 transition-all" placeholder="₦500,000" />
               </div>
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Entry Fee</label>
                 <input required value={formData.entryFee} onChange={e => setFormData({...formData, entryFee: e.target.value})} className="w-full glass-bright border border-white/5 rounded-2xl p-5 text-white text-sm outline-none focus:border-cyan-400/50 transition-all" placeholder="₦2,500" />
               </div>
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Max Capacity</label>
                 <input type="number" required value={formData.maxParticipants} onChange={e => setFormData({...formData, maxParticipants: Number(e.target.value)})} className="w-full glass-bright border border-white/5 rounded-2xl p-5 text-white text-sm outline-none focus:border-cyan-400/50 transition-all" />
               </div>
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Lobby ID (Optional)</label>
                 <input value={formData.lobbyId} onChange={e => setFormData({...formData, lobbyId: e.target.value})} className="w-full glass-bright border border-white/5 rounded-2xl p-5 text-white text-sm outline-none focus:border-cyan-400/50 transition-all" />
               </div>
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Access PIN (Optional)</label>
                 <input value={formData.accessPin} onChange={e => setFormData({...formData, accessPin: e.target.value})} className="w-full glass-bright border border-white/5 rounded-2xl p-5 text-white text-sm outline-none focus:border-cyan-400/50 transition-all" />
               </div>
               <div className="md:col-span-2 pt-10 flex gap-6">
                  <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-5 bg-slate-900 text-slate-500 font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl border border-white/5">ABORT MISSION</button>
                  <button type="submit" className="flex-1 py-5 bg-white text-slate-950 font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl shadow-2xl transition-all hover:bg-cyan-400 hover:text-white">DEPLOY ARENA</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentsList;
