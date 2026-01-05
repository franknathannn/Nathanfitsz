// @ts-nocheck
'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Quote, ShieldCheck, Sparkles } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { fadeUp } from "../../lib/animations";

export default function About() {
  const [content, setContent] = useState({
    about_quote: "I don't just sell products.",
    about_subquote: "I curate a lifestyle.",
    about_text_1: "In a world flooded with cheap alternatives and fast fashion, finding quality is exhausted. I've spent years filtering through the noise to bring you only what actually works.",
    about_text_2: "Whether it's the fabric that withstands your heaviest squat or the skincare that actually clears your complexion—if it's on this page, I personally vouch for it.",
    about_author: "Nathan Fitsz",
    about_role: "Founder & Curator"
  });

  useEffect(() => {
    async function fetchAboutContent() {
      const { data } = await supabase
        .from('site_settings')
        .select('about_quote, about_subquote, about_text_1, about_text_2, about_author, about_role')
        .limit(1)
        .single();

      if (data) {
        setContent({
          about_quote: data.about_quote,
          about_subquote: data.about_subquote,
          about_text_1: data.about_text_1,
          about_text_2: data.about_text_2,
          about_author: data.about_author,
          about_role: data.about_role
        });
      }
    }
    fetchAboutContent();

    // Real-time Update Listener for About Content
    const aboutChannel = supabase
      .channel('realtime-about')
      .on('postgres_changes', { event: 'UPDATE', table: 'site_settings', schema: 'public' }, (payload) => {
        setContent(prev => ({ ...prev, ...payload.new }));
      })
      .subscribe();

    return () => { supabase.removeChannel(aboutChannel); };
  }, []);

  return (
    <section id="about" className="py-24 md:py-40 px-6 relative overflow-hidden">
      
      {/* 1. Subtle Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-neon/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-4xl mx-auto text-center space-y-12 relative z-10"
      >
        {/* Iconic Indicator */}
        <div className="flex justify-center items-center gap-4">
          <div className="h-[1px] w-8 md:w-12 bg-white/20" />
          <Quote className="w-8 h-8 text-neon opacity-80" />
          <div className="h-[1px] w-8 md:w-12 bg-white/20" />
        </div>
        
        {/* The Manifesto Headline */}
        <h2 className="text-3xl md:text-6xl font-black text-white tracking-tighter leading-[1.1] uppercase italic">
          "{content.about_quote} <br />
          <span className="text-muted not-italic opacity-50">{content.about_subquote}"</span>
        </h2>

        {/* The Body Copy - Optimized for Mobile Reading */}
        <div className="space-y-8 text-lg md:text-2xl text-white/70 leading-relaxed font-light max-w-3xl mx-auto px-2">
          <p className="relative">
            <span className="text-neon font-bold mr-2 text-xl">//</span>
            {content.about_text_1}
          </p>
          <p className="relative">
            <span className="text-neon font-bold mr-2 text-xl">//</span>
            {content.about_text_2}
          </p>
        </div>

        {/* 3. The Trust Bar - Critical for Affiliate Conversions */}
        <div className="flex flex-wrap justify-center items-center gap-6 pt-6 border-t border-white/5">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted">
            <ShieldCheck className="w-4 h-4 text-neon" />
            Verified Selections
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted">
            <Sparkles className="w-4 h-4 text-neon" />
            Personally Tested
          </div>
        </div>

        {/* 4. Signature Block */}
        <div className="pt-12">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-block"
          >
            <div className="font-mono text-neon text-sm md:text-base tracking-[0.3em] font-black uppercase italic drop-shadow-[0_0_10px_rgba(204,255,0,0.3)]">
              {content.about_author}
            </div>
            <div className="text-[10px] md:text-xs text-muted font-bold uppercase tracking-[0.4em] mt-3 opacity-60">
              {content.about_role}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}