
import React, { useState } from 'react';

const HOLIDAYS = [
  { date: 'Oct 01', title: 'Independence Day 🇳🇬', type: 'national' },
  { date: 'Dec 25', title: 'Christmas Day', type: 'holiday' },
  { date: 'Jan 01', title: 'New Year Node Reset', type: 'system' }
];

const EventsView: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-3xl font-heading font-black italic text-white uppercase tracking-tighter">Event Board</h2>
          <p className="text-slate-400 text-xs font-black uppercase">Tactical Timeline // Q4 2025</p>
        </div>
        <button className="text-[10px] font-black text-cyan-400 hover:underline uppercase">Sync with System Calendar</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="p-8 gamer-border rounded-[40px] bg-slate-900/40 relative overflow-hidden">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-8">Major Milestones</h3>
              <div className="space-y-6">
                 {[
                   { date: 'Oct 15', title: 'Lagos Hub: COD Mobile Major', info: '₦500,000 Prize Pool' },
                   { date: 'Nov 02', title: 'Abuja Clash: FIFA 26', info: 'VIP Exclusive entry' },
                   { date: 'Nov 20', title: 'Community Anime Night', info: 'Lobby Code: NARUTO_20' }
                 ].map(ev => (
                   <div key={ev.title} className="flex gap-6 items-center group">
                      <div className="h-16 w-16 rounded-2xl bg-slate-950 border border-white/5 flex flex-col items-center justify-center text-center">
                         <span className="text-[8px] font-black text-slate-500 uppercase">{ev.date.split(' ')[0]}</span>
                         <span className="text-xl font-heading font-black text-white italic">{ev.date.split(' ')[1]}</span>
                      </div>
                      <div className="flex-1">
                         <h4 className="font-bold text-white group-hover:text-cyan-400 transition-colors uppercase italic">{ev.title}</h4>
                         <p className="text-[10px] text-slate-500 font-black uppercase">{ev.info}</p>
                      </div>
                      <button className="px-6 py-2 bg-slate-800 text-slate-400 text-[9px] font-black uppercase rounded-lg border border-white/5 hover:bg-slate-700">Set Reminder</button>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="p-8 gamer-border rounded-[40px] bg-red-900/5 border-red-500/10">
              <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-6">Holiday Node Lock</h4>
              <div className="space-y-4">
                 {HOLIDAYS.map(h => (
                   <div key={h.title} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                      <div className="flex flex-col">
                         <span className="text-xs font-bold text-white">{h.title}</span>
                         <span className="text-[8px] font-black text-slate-500 uppercase">{h.date}</span>
                      </div>
                      <span className={`text-[7px] font-black px-1.5 py-0.5 rounded uppercase ${h.type === 'national' ? 'bg-green-500/10 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
                        {h.type}
                      </span>
                   </div>
                 ))}
              </div>
              <p className="mt-8 text-[9px] text-slate-600 font-medium italic">"Node syncs with national holiday frequencies automatically."</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default EventsView;
