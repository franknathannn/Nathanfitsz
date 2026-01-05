'use client';

export default function PreviewShop({ data }: { data: any }) {
  const d = data || {};
  return (
    <div className="py-16 px-5 text-center">
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic flex flex-col items-center gap-2">
            <span className="text-neon text-[10px] font-mono tracking-[0.5em] not-italic mb-2 animate-pulse">
            Marketplace
            </span>
            {d.shop_title || 'Curated Picks'}
        </h2>
        <p className="text-white/50 mt-4 text-base font-medium tracking-wide">
            {d.shop_subtitle || 'Essentials for the modern elite.'}
        </p>
        
        {/* Mock Product Grid */}
        <div className="grid grid-cols-2 gap-4 mt-10 opacity-40 pointer-events-none">
            {[1,2,3,4].map(i => (
                <div key={i} className="aspect-[4/5] bg-white/5 rounded-[1.5rem] border border-white/5 flex items-center justify-center">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Item {i}</span>
                </div>
            ))}
        </div>
    </div>
  );
}