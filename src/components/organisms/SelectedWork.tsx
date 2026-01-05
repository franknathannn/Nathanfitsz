// src/components/organisms/SelectedWork.tsx
'use client';

import { ProjectCard } from "@/components/molecules/ProjectCard";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "@/lib/animations";

const projects = [
  {
    title: "Vortex Finance",
    category: "Fintech / Web3 Interface",
    year: "2025"
  },
  {
    title: "Lumina Gallery",
    category: "Immersive Commerce",
    year: "2024"
  },
  {
    title: "Carbon OS",
    category: "Design System Architecture",
    year: "2024"
  },
  {
    title: "Echo Spatial",
    category: "3D Audio Visualization",
    year: "2023"
  }
];

export default function SelectedWork() {
  return (
    <section id="work" className="py-24 md:py-40 px-5 md:px-20 max-w-7xl mx-auto overflow-hidden">
      
      {/* 1. Section Header - Bold & Precise */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-32 gap-10">
        <motion.div 
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-neon rounded-full animate-pulse shadow-[0_0_10px_rgba(204,255,0,1)]" />
            <span className="text-neon font-mono text-[10px] md:text-xs tracking-[0.4em] uppercase font-black">
              Digital Artifacts ({projects.length.toString().padStart(2, '0')})
            </span>
          </div>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-[0.85]">
            Selected <br /> <span className="text-muted/30">Works</span>
          </h2>
        </motion.div>
        
        <motion.p 
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-xs md:max-w-md text-muted text-base md:text-xl leading-relaxed font-medium border-l border-white/10 pl-6"
        >
          A curated collection of interfaces designed for extreme scalability, motion-first interaction, and timeless aesthetics.
        </motion.p>
      </div>

      {/* 2. The Interactive Grid */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20 md:gap-y-40"
      >
        {projects.map((project, index) => (
          <div 
            key={index} 
            className={`w-full ${
              index % 2 === 1 ? 'md:mt-32' : '' // Controlled Offset for Desktop only
            }`}
          >
            <ProjectCard 
              index={index}
              {...project}
            />
          </div>
        ))}
      </motion.div>

      {/* 3. Bottom Decorative Line for Flow */}
      <div className="mt-32 md:mt-60 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
    </section>
  );
}