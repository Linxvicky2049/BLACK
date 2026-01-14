
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MarketplaceItem } from '../types';

const Marketplace: React.FC = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [isSniping, setIsSniping] = useState(false);
  const [geo, setGeo] = useState<string>('Detecting Hub...');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setGeo(`Lat: ${pos.coords.latitude.toFixed(2)}, Lng: ${pos.coords.longitude.toFixed(2)}`),
      () => setGeo('Lagos, Nigeria (Default)')
    );
  }, []);

  const snipeGlobalMarket = async () => {
    setIsSniping(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // 🔥 AI Sniping: Scans global metadata to simulate real item fetching
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Find 4 high-performance gaming peripherals (Headsets, Keyboards, Mice) currently trending on Jumia, AliExpress, and Temu. 
        Prices must be in Hub Coins (1 HC = 2 NGN). 
        Format as JSON array: [{name, price, imageUrl, source, rarity, origin}].`,
        config: { responseMimeType: "application/json" }
      });
      
      const sniped = JSON.parse(response.text || "[]");
      setItems(sniped.map((i: any) => ({ ...i, id: `sniped_${Math.random()}` })));
    } catch (e) {
      alert("AI Sniping Relay Error. Check API Uplink.");
    } finally {
      setIsSniping(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-end justify-between border-b border-slate-800 pb-6 gap-6">
        <div>
          <h2 className="text-4xl font-heading font-black italic text-white uppercase tracking-tighter leading-none">The Armory</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-ping"></span>
            Global Signal Detected // {geo}
          </p>
        </div>
        <button 
          onClick={snipeGlobalMarket}
          disabled={isSniping}
          className="px-10 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-2xl pro-shadow hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {isSniping ? '📡 SNIPING GLOBAL FEEDS...' : '🔍 SNIPE NEW DROPS'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.length === 0 ? (
          <div className="lg:col-span-4 py-32 text-center opacity-20">
             <div className="text-8xl mb-6">🛸</div>
             <p className="text-sm font-black uppercase tracking-[0.4em]">Initialize Sniping to populate inventory</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="gamer-border group bg-slate-900/40 rounded-[32px] overflow-hidden hover:border-cyan-500/50 transition-all duration-500 hover:-translate-y-2">
               <div className="aspect-square bg-slate-950 relative overflow-hidden">
                  <img src={item.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" alt={item.name} />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl">
                     <span className="text-[9px] font-black text-cyan-400 uppercase">{item.source}</span>
                  </div>
               </div>
               <div className="p-6">
                  <h3 className="text-lg font-heading font-black italic text-white uppercase mb-4 leading-none tracking-tighter">{item.name}</h3>
                  <div className="flex justify-between items-center pt-6 border-t border-white/5">
                     <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-500 uppercase">Vault Price</span>
                        <span className="text-xl font-heading font-black text-cyan-400 tracking-tighter">{item.price} <span className="text-[10px]">HC</span></span>
                     </div>
                     <button className="h-12 w-12 bg-slate-800 hover:bg-cyan-500 text-white rounded-2xl shadow-xl transition-all hover:scale-110 active:scale-90 flex items-center justify-center border border-white/5">
                        🛒
                     </button>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Marketplace;
