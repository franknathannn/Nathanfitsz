'use client';

import { memo } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';

interface LiveMobileViewProps {
  lastUpdate: number;
}

export default memo(function LiveMobileView({ lastUpdate }: LiveMobileViewProps) {
  return (
    <div className="flex justify-center items-center py-4 h-full">
      
      {/* --- iPHONE 15 PRO CHASSIS (Fixed Frame) --- */}
      <div className="relative mx-auto border-[#1a1a1a] bg-[#1a1a1a] border-[12px] rounded-[3.5rem] h-[750px] w-[370px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10 flex flex-col">
        
        {/* Dynamic Island */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 w-[120px] h-[35px] bg-black rounded-b-[1.2rem] flex items-center justify-center">
           <div className="w-16 h-4 bg-black rounded-full flex items-center justify-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-900/50" />
             <div className="w-1.5 h-1.5 rounded-full bg-green-500/20 animate-pulse" />
           </div>
        </div>

        {/* Buttons */}
        <div className="absolute -left-[15px] top-[140px] w-[3px] h-[40px] bg-[#2a2a2a] rounded-l-md" />
        <div className="absolute -left-[15px] top-[190px] w-[3px] h-[40px] bg-[#2a2a2a] rounded-l-md" />
        <div className="absolute -right-[15px] top-[160px] w-[3px] h-[70px] bg-[#2a2a2a] rounded-r-md" />

        {/* SCREEN (IFRAME) */}
        <div className="w-full h-full bg-black rounded-[2.8rem] overflow-hidden relative">
          
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-14 z-40 bg-gradient-to-b from-black/60 to-transparent flex justify-between px-8 pt-4 pointer-events-none">
            <span className="text-[12px] font-bold text-white">9:41</span>
            <div className="flex gap-1.5 items-center">
              <div className="w-4 h-2.5 border border-white/30 rounded-[2px] relative">
                 <div className="absolute inset-0 bg-white/80 w-[80%]" />
              </div>
            </div>
          </div>

          {/* THE IFRAME - Points to Root (/) */}
          {/* We add 'key' to force reload on save, and a timestamp query to bust cache */}
          <iframe
            key={lastUpdate}
            src={`/?preview=${lastUpdate}`}
            className="w-full h-full border-none bg-black"
            title="Mobile Preview"
            loading="lazy"
          />

          {/* Loading Overlay (Fades out when iframe loads) */}
          <div className="absolute inset-0 flex items-center justify-center bg-black pointer-events-none opacity-0 animate-[fadeOut_0.5s_ease-out_1.5s_forwards]">
            <Loader2 className="w-8 h-8 text-neon animate-spin" />
          </div>

          {/* Home Bar */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-1.5 bg-white/40 rounded-full z-50 pointer-events-none backdrop-blur-md" />
        </div>
      </div>
    </div>
  );
});