// @ts-nocheck
'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Instagram, Smartphone, Sparkles, Loader2 } from "lucide-react"; 
import { supabase } from "../../lib/supabase";
import { fadeUp } from "../../lib/animations"; // Utilizing your cinematic animation logic

export default function Hero() {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({
    profileImage: "/me.jpg",
    headlinePrefix: "nathans",
    headlineHighlight: "fitsz",
    subheadline: "The elite selection of Gym Wear, Skincare & Wellness.",
    followerCount: "12,400+",
    tiktokUrl: "https://www.tiktok.com/@nathanfitsz",
    instagramUrl: "https://www.instagram.com/frnk_nthn/", 
  });

  useEffect(() => {
    async function fetchHero() {
      const { data } = await supabase
        .from('site_settings')
        .select(`
          hero_image_url, 
          hero_headline_prefix, 
          hero_headline_highlight, 
          hero_subheadline, 
          hero_follower_count, 
          social_tiktok, 
          social_instagram
        `)
        .limit(1)
        .single();

      if (data) {
        setContent({
          profileImage: data.hero_image_url || "/me.jpg",
          headlinePrefix: data.hero_headline_prefix,
          headlineHighlight: data.hero_headline_highlight,
          subheadline: data.hero_subheadline,
          followerCount: data.hero_follower_count,
          tiktokUrl: data.social_tiktok,
          instagramUrl: data.social_instagram
        });
      }
      setLoading(false);
    }
    fetchHero();
  }, []);

  if (loading) {
    return (
      <section className="min-h-[90vh] flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-neon w-10 h-10" />
      </section>
    );
  }

  return (
    <section className="relative min-h-[95vh] flex flex-col items-center justify-center pt-28 pb-12 px-5 md:px-6 max-w-7xl mx-auto text-center">
      
      {/* --- THE GLASS CARD CONTAINER --- */}
      <motion.div 
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="glass relative z-10 w-full max-w-4xl rounded-[2.5rem] p-8 md:p-16 shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-float"
      >
        
        {/* 1. Profile Image with Aura */}
        <div className="flex justify-center mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative w-36 h-36 md:w-48 md:h-48 rounded-full p-1 bg-gradient-to-b from-neon/50 to-transparent"
          >
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/10 relative">
               <img 
                src={content.profileImage} 
                alt="Profile" 
                className="object-cover w-full h-full bg-neutral-900" 
              /> 
              <div className="absolute inset-0 bg-gradient-to-tr from-neon/10 to-transparent pointer-events-none" />
            </div>
            {/* Ambient Glow behind image */}
            <div className="absolute inset-0 bg-neon/20 blur-3xl rounded-full -z-10" />
          </motion.div>
        </div>

        {/* 2. Headline & Content */}
        <div className="space-y-8">
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white leading-[0.9] drop-shadow-2xl italic uppercase">
            {content.headlinePrefix}
            <br className="md:hidden" /> {/* Ensures clean break on small screens */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-emerald-400">
              {content.headlineHighlight}
            </span>
          </h1>
          
          <div className="flex flex-col items-center gap-6">
            <p className="text-white/70 text-base md:text-xl leading-relaxed max-w-lg mx-auto font-medium tracking-wide">
               {content.subheadline}
            </p>

            {/* Social Proof Badge */}
            <div className="inline-flex items-center gap-2.5 bg-neon/5 border border-neon/20 px-5 py-2 rounded-full backdrop-blur-xl">
              <Sparkles className="w-4 h-4 text-neon animate-pulse" />
              <span className="text-xs md:text-sm font-mono font-bold text-white/90 uppercase tracking-widest">
                Trusted by <span className="text-neon">{content.followerCount}</span>
              </span>
            </div>
          </div>

          {/* 3. High-Conversion CTA Buttons (Optimized for Thumb-reach) */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-10">
            <a 
              href={content.tiktokUrl} 
              target="_blank" 
              className="flex items-center justify-center gap-3 bg-neon text-black px-10 py-5 rounded-full font-black uppercase text-sm tracking-widest hover:scale-105 active:scale-95 transition-all w-full md:w-auto shadow-[0_10px_30px_rgba(204,255,0,0.3)]"
            >
              <Smartphone className="w-5 h-5 fill-current" />
              <span>TikTok Shop</span>
            </a>
            
            <a 
              href={content.instagramUrl} 
              target="_blank" 
              className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white px-10 py-5 rounded-full font-black uppercase text-sm tracking-widest hover:bg-white/10 active:scale-95 transition-all w-full md:w-auto backdrop-blur-md"
            >
              <Instagram className="w-5 h-5" />
              <span>Instagram</span>
            </a>
          </div>
        </div>

      </motion.div>

      {/* Subtle Scroll Indicator for Mobile */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 md:hidden"
      >
        <div className="w-px h-12 bg-gradient-to-b from-neon to-transparent opacity-50" />
      </motion.div>

    </section>
  );
}