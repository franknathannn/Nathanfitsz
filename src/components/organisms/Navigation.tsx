// @ts-nocheck
'use client';


import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "../atoms/Logo";
import { cn } from "../../lib/utils";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/#shop" }, // Added Shop for better conversion flow
    { name: "About", href: "/#about" }, 
    { name: "Contact", href: "/email" }, 
];

export default function Navigation() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Optimized Scroll Logic: Smarter thresholds for mobile jitter
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Hide on scroll down
        setIsMobileMenuOpen(false); // Auto-close menu if user scrolls away
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true); // Show on scroll up
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 right-0 z-[60] flex justify-center pt-4 md:pt-6 px-4 pointer-events-none"
          >
            <nav className={cn(
              "pointer-events-auto flex items-center justify-between w-full max-w-5xl",
              "px-5 py-2.5 rounded-full border border-white/10 shadow-2xl transition-all duration-500",
              "bg-black/40 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20",
              isMobileMenuOpen ? "opacity-0 scale-95" : "opacity-100 scale-100"
            )}>
              
              <Logo />

              {/* Desktop Menu */}
              <ul className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-[13px] font-bold text-muted hover:text-neon transition-colors tracking-wide uppercase">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Desktop CTA */}
              <button className="hidden md:block text-[11px] font-black tracking-[0.2em] border border-neon/30 text-neon px-6 py-2.5 rounded-full hover:bg-neon hover:text-black transition-all duration-300">
                LET'S TALK
              </button>

              {/* Mobile Hamburger Button - High Contrast for visibility */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden flex items-center gap-2 bg-white/5 border border-white/10 pl-4 pr-2 py-1.5 rounded-full active:scale-95 transition-transform"
              >
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Menu</span>
                <div className="p-1 bg-neon rounded-full">
                  <Menu className="w-4 h-4 text-black" />
                </div>
              </button>
              
            </nav>
          </motion.header>
        )}
      </AnimatePresence>

      {/* MOBILE FULLSCREEN MENU - REDESIGNED AS CINEMATIC OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-2xl flex flex-col p-8"
          >
            {/* Close Trigger */}
            <div className="flex justify-between items-center mb-16">
              <Logo />
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 bg-white/5 border border-white/10 rounded-full text-white active:bg-neon active:text-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Staggered Links */}
            <div className="flex flex-col gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                  className="group flex items-end justify-between border-b border-white/5 pb-4"
                >
                  <span className="text-5xl font-bold text-white group-active:text-neon tracking-tighter">
                    {link.name}
                  </span>
                  <ArrowRight className="w-8 h-8 text-neon opacity-0 group-active:opacity-100 transition-opacity" />
                </motion.a>
              ))}
            </div>

            {/* Mobile Footer Data - Encourages Immediate Contact */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-auto space-y-6"
            >
              <div className="bg-neon/10 border border-neon/20 p-6 rounded-3xl">
                <span className="text-xs text-neon font-mono uppercase tracking-[0.2em]">Quick Connect</span>
                <p className="text-2xl font-bold text-white mt-2">Instagram: @frnk_nthn</p>
                <p className="text-sm text-muted mt-1 leading-relaxed">Available for curated partnerships and elite digital consulting.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}