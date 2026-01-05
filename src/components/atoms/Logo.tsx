'use client';

import Link from "next/link";
import { motion } from "framer-motion";

export const Logo = () => {
  const MotionPath = motion.path as any;

  return (
    <Link href="/" className="group flex items-center gap-3 select-none">
      {/* Premium Iconic Mark */}
      <div className="relative h-10 w-10 flex items-center justify-center">
        {/* Outer Glow Ring */}
        <div className="absolute inset-0 bg-neon/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* The SVG Mark - Sharp, Aggressive, Minimal */}
        <svg 
          viewBox="0 0 40 40" 
          className="w-full h-full fill-none stroke-white group-hover:stroke-neon transition-colors duration-300 stroke-[2.5]"
        >
          <MotionPath
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            d="M12 30V10L28 30V10" // A sharp, angular 'N'
            strokeLinecap="square"
          />
        </svg>

        {/* Corner Accents */}
        <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-neon/50 group-hover:border-neon transition-colors" />
        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-neon/50 group-hover:border-neon transition-colors" />
      </div>

      {/* The Typography */}
      <div className="flex flex-col -space-y-1">
        <span className="font-black text-xl tracking-[0.15em] text-white uppercase italic">
          NATH<span className="text-neon">AN</span>
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-muted uppercase tracking-[0.3em]">
            Curated
          </span>
          {/* Real-time Status Indicator */}
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-neon"></span>
          </span>
        </div>
      </div>
    </Link>
  );
};