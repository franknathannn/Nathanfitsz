// src/components/molecules/ProjectCard.tsx
// @ts-nocheck
'use client';

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface ProjectProps {
  title: string;
  category: string;
  year: string;
  index: number;
}

export const ProjectCard = ({ title, category, year, index }: ProjectProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }} // High-end tactile feel on mobile touch
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative cursor-pointer block w-full"
    >
      {/* 1. The Image Container */}
      {/* Aspect ratio [16/10] is the 'Golden Ratio' for mobile cards - balanced height */}
      <div className="relative aspect-[16/10] md:aspect-[4/3] overflow-hidden rounded-2xl bg-surface mb-5 border border-white/5 shadow-2xl">
        
        {/* Subtle Inner Glow - Makes it look like a physical screen/object */}
        <div className="absolute inset-0 z-10 border border-white/10 rounded-2xl pointer-events-none" />

        {/* Dynamic Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface via-neutral-900 to-black group-hover:scale-110 transition-transform duration-1000 ease-out" />
        
        {/* The Index Number - Now semi-visible on mobile to add 'Editorial' intrigue */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-mono text-[10rem] md:text-[12rem] font-bold tracking-tighter text-white/[0.03] group-hover:text-neon/10 transition-colors duration-700 select-none">
            {index + 1 < 10 ? `0${index + 1}` : index + 1}
          </span>
        </div>

        {/* Mobile-First Overlay: Always slightly present to ensure text contrast */}
        <div className="absolute inset-0 bg-black/20 md:bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
        
        {/* "VIEW" Badge - Appears on Mobile to guide the buyer */}
        <div className="absolute bottom-4 right-4 md:hidden flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <span className="text-[10px] font-mono font-bold text-neon uppercase">View Project</span>
          <ArrowUpRight className="w-3 h-3 text-neon" />
        </div>
      </div>

      {/* 2. The Metadata Layout */}
      <div className="flex justify-between items-start px-1">
        <div className="space-y-1">
          <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-neon transition-colors duration-300 tracking-tight">
            {title}
          </h3>
          <div className="flex items-center gap-3">
             <span className="text-xs font-mono text-muted uppercase tracking-wider">
               {category}
             </span>
          </div>
        </div>

        {/* Functional Iconography */}
        <div className="flex flex-col items-end gap-2">
          <span className="text-[10px] font-mono text-muted border border-white/10 px-2 py-0.5 rounded-full bg-white/5">
            {year}
          </span>
          {/* Hidden on mobile card, replaces 'View Project' badge logic for desktop */}
          <div className="hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-white/10 group-hover:border-neon group-hover:bg-neon transition-all duration-300">
             <ArrowUpRight className="w-5 h-5 text-white group-hover:text-black group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};