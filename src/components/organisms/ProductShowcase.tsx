// @ts-nocheck
'use client';

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Tag, Sparkles, ExternalLink, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { fadeUp } from "../../lib/animations";
import { useAnalytics } from '../../hooks/useAnalytics'; // Hook Imported

interface Product {
  id: number;
  name: string;
  price: number;
  currency?: string;
  category: string;
  link: string;
  image: string;
  is_new: boolean;
}

interface SiteSettings {
  shop_title: string;
  shop_subtitle: string;
}

const getCurrencySymbol = (code: string = 'USD') => {
  if (code === 'EUR') return '€';
  if (code === 'PHP') return '₱';
  return '$';
};

// --- COLOR ENGINE: Unique Category Colors ---
const getCategoryTheme = (cat: string) => {
  const c = cat.toLowerCase();
  if (c.includes('cloth') || c.includes('wear')) return 'bg-violet-500/90 text-white border-none shadow-[0_0_15px_rgba(139,92,246,0.4)]';
  if (c.includes('fit') || c.includes('gym')) return 'bg-cyan-500/90 text-black font-bold border-none shadow-[0_0_15px_rgba(6,182,212,0.4)]';
  if (c.includes('skin') || c.includes('face')) return 'bg-rose-500/90 text-white border-none shadow-[0_0_15px_rgba(244,63,94,0.4)]';
  if (c.includes('well') || c.includes('health')) return 'bg-emerald-500/90 text-white border-none shadow-[0_0_15px_rgba(16,185,129,0.4)]';
  // Default Style (Fallback)
  return 'bg-black/60 backdrop-blur-xl text-white/90 border border-white/10';
};

export default function ProductShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({ 
    shop_title: 'Curated Picks', 
    shop_subtitle: 'Loading...' 
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      const { data: prodData } = await supabase.from('products').select('*').order('id', { ascending: false });
      const { data: settData } = await supabase.from('site_settings').select('shop_title, shop_subtitle').limit(1).single();

      if (prodData) setProducts(prodData);
      if (settData) setSettings(settData);
      setIsLoading(false);
    };

    fetchData();

    // REAL-TIME ENGINE
    const productChannel = supabase
      .channel('realtime-store-v2')
      .on('postgres_changes', { event: '*', table: 'products', schema: 'public' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setProducts(prev => [payload.new as Product, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setProducts(prev => prev.map(p => p.id === payload.new.id ? payload.new as Product : p));
        } else if (payload.eventType === 'DELETE') {
          setProducts(prev => prev.filter(p => p.id === payload.old.id));
        }
      })
      .on('postgres_changes', { event: 'UPDATE', table: 'site_settings', schema: 'public' }, (payload) => {
        setSettings(payload.new as SiteSettings);
      })
      .subscribe();

    return () => { supabase.removeChannel(productChannel); };
  }, []);

  // Memoized values to prevent unnecessary re-renders during filter clicks
  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map(item => item.category)))], [products]);
  const filteredProducts = useMemo(() => 
    activeCategory === "All" ? products : products.filter(p => p.category === activeCategory),
    [activeCategory, products]
  );

  return (
    <section id="shop" className="w-full py-24 px-5 md:px-10 relative">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* 1. HEADER & CENTERED CATEGORIES */}
        <div className="flex flex-col items-center text-center mb-16 space-y-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible">
            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase italic flex flex-col items-center gap-2">
              <span className="text-neon text-sm font-mono tracking-[0.5em] not-italic mb-2 animate-pulse">
                Marketplace
              </span>
              {settings.shop_title}
            </h2>
            <p className="text-muted mt-4 text-base md:text-lg max-w-xl font-medium tracking-wide">
              {settings.shop_subtitle}
            </p>
          </motion.div>

          {/* WRAPPED & CENTERED FILTERS - NO SIDEBAR SCROLL */}
          <div className="flex flex-wrap justify-center items-center gap-3 max-w-3xl mx-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-6 py-2.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 active:scale-90 ${
                  activeCategory === cat 
                  ? "bg-neon text-black shadow-[0_0_25px_rgba(204,255,0,0.4)]" 
                  : "bg-white/5 text-muted border border-white/10 hover:border-white/40 hover:text-white"
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.div layoutId="activeGlow" className="absolute inset-0 rounded-full bg-neon blur-md -z-10 opacity-30" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 2. PRODUCT GRID - STABILIZED */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <Loader2 className="w-10 h-10 animate-spin text-neon" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-neon uppercase">Syncing Live Data</span>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  // 1. Initialize Analytics Hook
  const { trackBuy } = useAnalytics();

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col w-full"
    >
      {/* Visual Container */}
      <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-surface border border-white/5 mb-4 group-hover:border-neon/50 transition-colors duration-500 shadow-2xl">
        <img 
          src={product.image || "/placeholder.jpg"} 
          alt={product.name} 
          className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700" 
        />
        
        {/* Floating Tags - UPDATED WITH DYNAMIC COLORS */}
        <div className="absolute top-4 left-4 z-10">
          <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter ${getCategoryTheme(product.category)}`}>
            {product.category}
          </div>
        </div>
        
        {product.is_new && (
          <div className="absolute top-4 right-4 z-10 bg-neon text-black px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter animate-pulse shadow-lg">
            New
          </div>
        )}

        {/* Action Overlay (Desktop Only) */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none md:pointer-events-auto">
           <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center scale-50 group-hover:scale-100 transition-transform duration-500">
             <ExternalLink className="w-5 h-5 text-black" />
           </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="px-2 space-y-3">
        <div className="space-y-1">
          {/* UPDATED: Minimized Name (No Uppercase, Lower Opacity) */}
          <h3 className="text-white/70 font-bold text-sm md:text-base tracking-tight group-hover:text-white transition-colors line-clamp-1">
            {product.name}
          </h3>
          
          {/* UPDATED: Big Price */}
          <div className="flex items-center justify-between font-mono">
            <span className="text-neon text-xl md:text-2xl font-black tracking-tighter">
              {getCurrencySymbol(product.currency)}{product.price}
            </span>
          </div>
        </div>

        {/* 2. REPLACED <a> WITH BUTTON ATTACHED TO ANALYTICS */}
        <button 
          onClick={() => trackBuy(product.name, product.price.toString(), product.link)}
          className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white group-hover:bg-white group-hover:text-black transition-all py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] active:scale-95 shadow-xl cursor-pointer"
        >
          Buy Now
        </button>
      </div>
    </motion.div>
  );
}