'use client';
import { Instagram, Smartphone, Sparkles } from "lucide-react"; 

export default function PreviewHero({ data }: { data: any }) {
  // Fallback data prevents crash if fields are empty
  const d = data || {};
  
  return (
    <div className="flex flex-col items-center text-center pt-14 px-5">
      {/* Profile */}
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 bg-neon/20 blur-2xl rounded-full" />
        <div className="w-full h-full rounded-full p-1 bg-gradient-to-b from-neon/50 to-transparent relative z-10">
           <img src={d.hero_image_url || "/placeholder.jpg"} className="w-full h-full rounded-full object-cover bg-neutral-900" alt="Profile" />
        </div>
      </div>

      {/* Headlines */}
      <h1 className="text-6xl font-black tracking-tighter text-white leading-[0.9] italic uppercase mb-6">
        {d.hero_headline_prefix || "nathans"}
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-emerald-400">
          {d.hero_headline_highlight || "fitsz"}
        </span>
      </h1>
      
      <p className="text-white/70 text-base leading-relaxed font-medium mb-6">
          {d.hero_subheadline || "The elite selection of Gym Wear, Skincare & Wellness."}
      </p>

      {/* Social Proof */}
      <div className="inline-flex items-center gap-2 bg-neon/5 border border-neon/20 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
          <Sparkles className="w-3 h-3 text-neon animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-white/90 uppercase tracking-widest">
            Trusted by <span className="text-neon">{d.hero_follower_count || "12k+"}</span>
          </span>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 w-full">
        <button className="flex items-center justify-center gap-3 bg-neon text-black px-6 py-4 rounded-full font-black uppercase text-xs tracking-widest w-full shadow-[0_0_20px_rgba(57,255,20,0.3)]">
            <Smartphone className="w-4 h-4 fill-current" /> TikTok Shop
        </button>
        <button className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white px-6 py-4 rounded-full font-black uppercase text-xs tracking-widest w-full backdrop-blur-md">
            <Instagram className="w-4 h-4" /> Instagram
        </button>
      </div>
    </div>
  );
}