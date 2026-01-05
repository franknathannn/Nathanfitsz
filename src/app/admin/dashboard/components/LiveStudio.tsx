'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutTemplate, ShoppingBag, User, Smartphone, Eye, Radio } from 'lucide-react';

// Sub-components
import HeroSectionForm from './HeroSectionForm';
import ShopSectionForm from './ShopSectionForm';
import AboutSectionForm from './AboutSectionForm';
import LiveMobileView from './LiveMobileView';

interface LiveStudioProps {
  settings: any;
  refresh: () => void;
}

// Named Export
export function LiveStudio({ settings, refresh }: LiveStudioProps) {
  const [activeTab, setActiveTab] = useState<'hero' | 'shop' | 'about'>('hero');
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  if (!settings) return null;

  // Wrapper to refresh the phone whenever a form saves
  const handleRefresh = () => {
    refresh(); // Update the main dashboard data
    setLastUpdate(Date.now()); // Force the iPhone to reload
  };

  const tabs = [
    { id: 'hero', label: 'Hero Identity', icon: LayoutTemplate },
    { id: 'shop', label: 'Marketplace', icon: ShoppingBag },
    { id: 'about', label: 'Manifesto', icon: User },
  ];

  return (
    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col xl:flex-row relative">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <div className="w-full xl:w-64 border-b xl:border-b-0 xl:border-r border-white/5 bg-black/20 p-4 flex flex-row xl:flex-col gap-2 overflow-x-auto xl:overflow-visible flex-shrink-0 z-20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-4 px-6 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap group ${
              activeTab === tab.id 
                ? 'bg-white/10 text-neon shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/10' 
                : 'text-white/30 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <tab.icon className={`w-4 h-4 transition-colors ${activeTab === tab.id ? 'text-neon' : 'group-hover:text-white'}`} />
            {tab.label}
          </button>
        ))}
        
        {/* Visual Indicator */}
        <div className="hidden xl:flex mt-auto mb-6 px-6 gap-3 items-center opacity-40">
            <Eye className="w-4 h-4 text-neon animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-neon">Live Preview</span>
        </div>
      </div>

      {/* 2. SPLIT WORKSPACE */}
      <div className="flex-1 flex flex-col xl:flex-row relative">
         
         {/* Background Texture */}
         <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] bg-[url('/textures/noise.png')] mix-blend-overlay pointer-events-none" />

         {/* LEFT: FORM ENGINE (Scrollable) */}
         <div className="flex-1 p-8 md:p-12 relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
              >
                  {/* Pass handleRefresh to trigger both Data Fetch & Phone Reload */}
                  {activeTab === 'hero' && <HeroSectionForm initialData={settings} refresh={handleRefresh} />}
                  {activeTab === 'shop' && <ShopSectionForm initialData={settings} refresh={handleRefresh} />}
                  {activeTab === 'about' && <AboutSectionForm initialData={settings} refresh={handleRefresh} />}
              </motion.div>
            </AnimatePresence>
         </div>

         {/* RIGHT: DIGITAL TWIN (Sticky & Fixed) */}
         <div className="w-full xl:w-[480px] bg-[#020202]/40 border-l border-white/5 flex flex-col items-center pt-8 relative z-10 shadow-[inset_10px_0_30px_rgba(0,0,0,0.5)]">
            
            {/* Sticky Container */}
            <div className="sticky top-8 flex flex-col items-center gap-6">
                
                {/* Status Badge */}
                <div className="flex flex-col items-center gap-2">
                    <span className="flex items-center gap-2 text-[9px] font-black text-neon uppercase tracking-[0.3em] bg-neon/5 px-4 py-2 rounded-full border border-neon/20 shadow-[0_0_15px_rgba(57,255,20,0.1)]">
                        <Radio className="w-3 h-3 animate-pulse" /> Realtime Uplink
                    </span>
                    <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">
                        Buyer Perspective (Mobile)
                    </p>
                </div>

                {/* The Phone */}
                <div className="origin-top scale-[0.9] xl:scale-100 transition-transform duration-500">
                    <LiveMobileView lastUpdate={lastUpdate} />
                </div>
            </div>

         </div>
      </div>
    </div>
  );
}