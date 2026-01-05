'use client';
import { Quote } from "lucide-react";

export default function PreviewAbout({ data }: { data: any }) {
  const d = data || {};
  return (
    <div className="py-16 px-6 relative overflow-hidden bg-black">
      <div className="relative z-10 text-center space-y-8">
        
        <div className="flex justify-center items-center gap-4 opacity-50">
          <div className="h-[1px] w-8 bg-white/20" />
          <Quote className="w-6 h-6 text-neon" />
          <div className="h-[1px] w-8 bg-white/20" />
        </div>
        
        <h2 className="text-3xl font-black text-white tracking-tighter leading-[1.1] uppercase italic">
          "{d.about_quote || 'Quote'}" <br />
          <span className="text-white/40 not-italic">"{d.about_subquote || 'Sub'}"</span>
        </h2>

        <div className="space-y-6 text-base text-white/70 leading-relaxed font-light text-left max-w-sm mx-auto">
          <p><span className="text-neon font-bold mr-2">//</span>{d.about_text_1 || "Sample text..."}</p>
          <p><span className="text-neon font-bold mr-2">//</span>{d.about_text_2 || "Sample text..."}</p>
        </div>

        <div className="pt-10">
            <div className="font-mono text-neon text-sm tracking-[0.3em] font-black uppercase italic">
                {d.about_author || "AUTHOR"}
            </div>
            <div className="text-[10px] text-white/40 font-bold uppercase tracking-[0.4em] mt-2">
                {d.about_role || "ROLE"}
            </div>
        </div>
      </div>
    </div>
  );
}