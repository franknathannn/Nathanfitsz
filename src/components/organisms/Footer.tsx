// @ts-nocheck
'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Instagram, Facebook, Smartphone } from "lucide-react";
import { fadeUp } from "../../lib/animations";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { 
      name: "Instagram", 
      href: "https://www.instagram.com/frnk_nthn/", 
      icon: <Instagram className="w-4 h-4" /> 
    },
    { 
      name: "TikTok", 
      href: "https://www.tiktok.com/@nathanfitsz", 
      icon: <Smartphone className="w-4 h-4" /> 
    },
    { 
      name: "Facebook", 
      href: "https://www.facebook.com/Frank.Sterilyz", 
      icon: <Facebook className="w-4 h-4" /> 
    }
  ];

  return (
    <footer className="relative bg-black pt-20 pb-10 px-6 md:px-20 overflow-hidden border-t border-white/5">
      
      {/* 1. THE REFINED CTA - CENTERED ON MOBILE & DESKTOP */}
      {/* UPDATED: Removed 'md:' prefix so it centers on all screens */}
      <div className="flex flex-col gap-8 mb-20 items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Whiter base with a Green Glow shadow */}
          <h2 className="text-[12vw] md:text-[8vw] font-black tracking-[0.02em] leading-none text-white/10 select-none pointer-events-none italic drop-shadow-[0_0_20px_rgba(204,255,0,0.3)]">
            Let's Work!
          </h2>
          <h2 className="absolute inset-0 text-[12vw] md:text-[8vw] font-black tracking-tighter leading-none text-transparent stroke-text transition-all duration-700 hover:text-white/20 hover:stroke-neon cursor-default italic">
            Let's Work!
          </h2>
        </motion.div>
        
        {/* THE SOFT GMAIL LINK - REMOVED UNDERLINE */}
        <Link href="/email">
          <motion.div 
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            className="group flex items-center gap-4 md:gap-6 transition-all w-fit active:scale-95 cursor-pointer"
          >
            {/* "Soft" Typography: font-extralight, italic, no-underline */}
            <span className="text-xl md:text-3xl text-white/80 font-extralight italic tracking-tight group-hover:text-neon group-hover:opacity-100 transition-all duration-500">
              Franknathan12@gmail.com
            </span>
            <div className="p-2 md:p-4 bg-neon rounded-full text-black rotate-45 group-hover:rotate-0 transition-transform duration-500 shadow-[0_0_20px_rgba(204,255,0,0.3)]">
              <ArrowUpRight className="w-5 h-5 md:w-7 md:h-7" />
            </div>
          </motion.div>
        </Link>
      </div>

      {/* 2. NAVIGATION & INFO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 relative z-10">
        
        {/* Brand Column */}
        <div className="space-y-6">
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
              NATHAN<span className="text-neon">FITSZ</span>
            </span>
            <span className="text-[10px] font-mono text-muted uppercase tracking-[0.4em] mt-1 font-bold">
              Curator & Entrepreneur
            </span>
          </div>
          <p className="text-muted text-sm leading-relaxed max-w-xs font-medium opacity-60 italic">
            Defining the elite standard in fitness and wellness through curated digital excellence.
          </p>
        </div>

        {/* Socials - Clean Grid */}
        <div className="col-span-1 md:col-span-2">
          <h4 className="font-mono text-[9px] text-neon uppercase tracking-[0.5em] mb-8 font-black">
            Social Channels
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {socialLinks.map((link) => (
              <li key={link.name}>
                <a 
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between md:justify-start gap-3 text-white/50 bg-white/[0.02] border border-white/5 px-5 py-4 rounded-2xl hover:bg-neon hover:text-black hover:border-neon transition-all duration-500 active:scale-95 group"
                >
                  <div className="flex items-center gap-3">
                    {link.icon}
                    <span className="text-[11px] font-black uppercase tracking-widest">{link.name}</span>
                  </div>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal / Copyright */}
        <div className="flex flex-col justify-end items-start md:items-end">
          <div className="text-left md:text-right space-y-1 opacity-30">
            <span className="text-[9px] text-white font-mono uppercase tracking-[0.2em]">
              © {currentYear} NATHANFITSZ
            </span>
            <p className="text-[8px] text-white font-mono uppercase tracking-widest">
              Standard of Excellence
            </p>
          </div>
        </div>
      </div>
      
      {/* Background Glow Overlay - Clipped to prevent overflow space */}
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-neon/5 blur-[100px] rounded-full pointer-events-none -z-10 translate-y-1/2 translate-x-1/2" />
    </footer>
  );
}