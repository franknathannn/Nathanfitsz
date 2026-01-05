// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { Eye, MousePointer2, TrendingUp, Zap, Activity, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnalyticsOverview() {
  const [stats, setStats] = useState({ 
    views: 0, 
    clicks: 0, 
    velocity: 0, 
    prevViews: 0,
    history: [] 
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    const now = new Date();
    const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
    const twentyDaysAgo = new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // 1. Total Lifetime Views
    const { count: views } = await supabase
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'page_view');

    // 2. Total Lifetime Clicks
    const { count: clicks } = await supabase
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'click_buy');

    // 3. Velocity: Current 10 Days
    const { count: currentPeriod } = await supabase
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'page_view')
      .gte('created_at', tenDaysAgo.toISOString());

    // 4. Velocity: Previous 10 Days
    const { count: prevPeriod } = await supabase
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'page_view')
      .gte('created_at', twentyDaysAgo.toISOString())
      .lt('created_at', tenDaysAgo.toISOString());

    // 5. GRAPH DATA
    const { data: historyData } = await supabase
      .from('analytics')
      .select('created_at')
      .eq('event_type', 'page_view')
      .gte('created_at', sevenDaysAgo.toISOString());

    // Process Graph Data
    const dailyCounts = new Array(7).fill(0);
    historyData?.forEach(row => {
        const date = new Date(row.created_at);
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 7) {
            dailyCounts[6 - diffDays]++;
        }
    });

    // Velocity %
    const curr = currentPeriod || 0;
    const prev = prevPeriod || 0;
    let velocity = 0;

    if (prev > 0) {
      velocity = ((curr - prev) / prev) * 100;
    } else if (curr > 0) {
      velocity = 100; 
    }

    setStats({ 
      views: views || 0, 
      clicks: clicks || 0, 
      velocity: velocity,
      prevViews: prev,
      history: dailyCounts
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
    const channel = supabase
      .channel('analytics-monitor')
      .on('postgres_changes', { event: 'INSERT', table: 'analytics' }, () => {
        fetchStats(); 
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const conversionRate = stats.views > 0 
    ? ((stats.clicks / stats.views) * 100).toFixed(1) 
    : '0.0';

  const isPositiveVelocity = stats.velocity >= 0;

  const cards = [
    { 
      label: 'Viewer Velocity', 
      value: `${isPositiveVelocity ? '+' : ''}${stats.velocity.toFixed(1)}%`, 
      subtext: '10-Day Monitor',
      icon: Zap, 
      color: isPositiveVelocity ? 'text-neon' : 'text-red-400', 
      bg: isPositiveVelocity ? 'bg-neon/10' : 'bg-red-500/10',
      border: isPositiveVelocity ? 'border-neon/20' : 'border-red-500/20',
      glow: isPositiveVelocity ? 'shadow-[0_0_20px_rgba(57,255,20,0.2)]' : 'shadow-[0_0_20px_rgba(255,50,50,0.2)]'
    },
    { 
      label: 'Total Traffic', 
      value: stats.views.toLocaleString(), 
      subtext: 'Lifetime Views',
      icon: Eye, 
      color: 'text-blue-400', 
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      glow: ''
    },
    { 
      label: 'Buy Clicks', 
      value: stats.clicks.toLocaleString(), 
      subtext: 'Link Taps',
      icon: MousePointer2, 
      color: 'text-amber-400', 
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      glow: ''
    },
    { 
      label: 'Conversion', 
      value: `${conversionRate}%`, 
      subtext: 'Click-Through',
      icon: TrendingUp, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      glow: ''
    },
  ];

  return (
    <div className="space-y-6">
        {/* TOP ROW: CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((stat, i) => (
            <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/[0.02] backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden group hover:bg-white/[0.04] hover:border-white/20 transition-all duration-500"
            >
            <div className="flex justify-between items-start mb-8 relative z-10">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} border ${stat.border} ${stat.glow} group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon className="w-5 h-5 stroke-[2.5px]" />
                </div>
                {stat.label === 'Viewer Velocity' && (
                <div className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${stat.border} ${stat.bg} ${stat.color} animate-pulse`}>
                    {isPositiveVelocity ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isPositiveVelocity ? 'Surge' : 'Drag'}
                </div>
                )}
                {stat.label !== 'Viewer Velocity' && (
                <Activity className="w-4 h-4 text-white/10 group-hover:text-white/30 transition-colors" />
                )}
            </div>
            <div className="relative z-10">
                <h3 className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-2 group-hover:text-white/60 transition-colors">
                {stat.label}
                </h3>
                <p className="text-4xl xl:text-5xl font-black text-white italic tracking-tighter leading-none mb-2">
                {loading ? <span className="opacity-20 animate-pulse">--</span> : stat.value}
                </p>
                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                {stat.subtext}
                </p>
            </div>
            <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${stat.bg} blur-[60px] rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none`} />
            </motion.div>
        ))}
        </div>

        {/* BOTTOM ROW: THE FIXED GRAPH */}
        <VelocityGraph data={stats.history} />
    </div>
  );
}

// --- CURVE ALGORITHM HELPERS ---
const getControlPoint = (current: number[], previous: number[], next: number[], reverse?: boolean) => {
    const p = previous || current;
    const n = next || current;
    const smoothing = 0.2;
    const oLineLengthX = n[0] - p[0];
    const oLineLengthY = n[1] - p[1];
    const angle = Math.atan2(oLineLengthY, oLineLengthX) + (reverse ? Math.PI : 0);
    const length = Math.sqrt(Math.pow(oLineLengthX, 2) + Math.pow(oLineLengthY, 2)) * smoothing;
    const x = current[0] + Math.cos(angle) * length;
    const y = current[1] + Math.sin(angle) * length;
    return [x, y];
};

const getSmoothPath = (points: number[][]) => {
    if (points.length === 0) return "";
    return points.reduce((acc, e, i, a) => {
        if (i === 0) return `M ${e[0]},${e[1]}`;
        const [cpsX, cpsY] = getControlPoint(a[i - 1], a[i - 2], e);
        const [cpeX, cpeY] = getControlPoint(e, a[i - 1], a[i + 1], true);
        return `${acc} C ${cpsX},${cpsY} ${cpeX},${cpeY} ${e[0]},${e[1]}`;
    }, "");
};

// --- SUB-COMPONENT: The Professional Graph ---
function VelocityGraph({ data }: { data: number[] }) {
    if (!data || data.length === 0) return null;

    const max = Math.max(...data, 5); 
    
    // Labels
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const dayLabels = Array.from({length: 7}, (_, i) => {
        const d = new Date();
        d.setDate(today.getDate() - (6 - i));
        return days[d.getDay()];
    });

    // Normalize Points (0-100 coordinate space)
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - (val / max) * 100; 
        return [x, y];
    });

    // Create Paths
    const pathLine = getSmoothPath(points);
    // Create Area Fill Path (Closed loop at bottom)
    const pathArea = `${pathLine} L 100,100 L 0,100 Z`;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden"
        >
             {/* Header */}
             <div className="flex justify-between items-center mb-12 relative z-10">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-neon/10 rounded-2xl border border-neon/20 shadow-[0_0_20px_rgba(57,255,20,0.1)]">
                        <Activity className="w-6 h-6 text-neon" />
                    </div>
                    <div>
                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Traffic Pulse</h3>
                        <p className="text-xs font-bold text-white uppercase tracking-widest mt-1">
                            7 Day Overview
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-neon/5 border border-neon/10 px-4 py-2 rounded-full">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neon"></span>
                    </span>
                    <span className="text-[9px] font-black text-neon uppercase tracking-widest">Live</span>
                </div>
            </div>

            {/* CHART LAYOUT */}
            <div className="flex h-[300px] gap-8 relative z-10">
                
                {/* Y-Axis (Fixed Numbers) */}
                <div className="flex flex-col justify-between h-full text-[11px] font-mono font-bold text-white/30 text-right w-6 py-2">
                    <span>{max}</span>
                    <span>{Math.round(max * 0.75)}</span>
                    <span>{Math.round(max * 0.5)}</span>
                    <span>{Math.round(max * 0.25)}</span>
                    <span>0</span>
                </div>

                {/* Graph Container */}
                <div className="flex-1 relative flex flex-col justify-between">
                    
                    {/* Horizontal Grid Lines */}
                    <div className="absolute top-0 w-full border-t border-white/5" />
                    <div className="absolute top-[25%] w-full border-t border-white/5 border-dashed" />
                    <div className="absolute top-[50%] w-full border-t border-white/5 border-dashed" />
                    <div className="absolute top-[75%] w-full border-t border-white/5 border-dashed" />
                    <div className="absolute bottom-0 w-full border-t border-white/5" />

                    {/* SVG GRAPH LAYER */}
                    <div className="absolute inset-0 z-20">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#39FF14" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#39FF14" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            {/* Area Fill */}
                            <motion.path
                                d={pathArea}
                                fill="url(#areaGradient)"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1 }}
                            />

                            {/* The Line - Thinner on Desktop using Responsive Tailwind Logic won't work inside SVG attributes directly, so we use a smaller fixed width that looks good on both */}
                            <motion.path
                                d={pathLine}
                                fill="none"
                                stroke="#39FF14"
                                strokeWidth="1.5" // Reduced from 2 to 1.5 for a cleaner desktop look
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                filter="drop-shadow(0 0 10px rgba(57,255,20,0.5))"
                            />
                        </svg>

                        {/* HTML OVERLAY DOTS - Smaller on Desktop */}
                        {points.map(([x, y], i) => (
                             <motion.div
                                key={i}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 1 + (i * 0.1) }}
                                // Changed: w-3 h-3 (Mobile) -> md:w-2 md:h-2 (Desktop) for a thinner feel
                                className="absolute w-3 h-3 md:w-2 md:h-2 bg-[#020202] border-[2px] border-neon rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(57,255,20,0.5)] z-30 group"
                                style={{ left: `${x}%`, top: `${y}%` }}
                             >
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {data[i]} Views
                                </div>
                             </motion.div>
                        ))}
                    </div>

                    {/* X-Axis Labels */}
                    <div className="absolute -bottom-10 left-0 w-full flex justify-between text-[10px] font-mono font-bold text-white/30 uppercase tracking-widest px-2">
                        {dayLabels.map((day, i) => (
                            <div key={i} className="flex-1 text-center">{day}</div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}