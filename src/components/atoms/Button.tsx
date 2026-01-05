'use client';

import { motion, useAnimationControls } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

export const MagneticButton = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const controls = useAnimationControls();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || !ref.current) return;
    
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    
    setPosition({ x: x / 5, y: y / 5 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const MotionButton = motion.button as any;
  const MotionDiv = motion.div as any;

  return (
    <MotionButton
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.1 }}
      className="relative px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-md overflow-hidden group transition-colors duration-300 active:border-neon"
    >
      <MotionDiv
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{ 
          repeat: Infinity, 
          duration: 3, 
          ease: "linear", 
          repeatDelay: 2 
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
      />

      <span className="relative z-10 font-bold tracking-[0.1em] uppercase text-xs md:text-sm text-white group-hover:text-black group-active:text-black transition-colors duration-300">
        {children}
      </span>

      <div className="absolute inset-0 bg-neon translate-y-[101%] group-hover:translate-y-0 group-active:translate-y-0 transition-transform duration-400 ease-[0.22, 1, 0.36, 1] -z-0" />
    </MotionButton>
  );
};