'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Lock, Mail, Fingerprint, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error('Access Denied: Invalid Credentials');
      setLoading(false);
    } else {
      toast.success('Identity Verified. Initializing Console...');
      // Small delay for effect before redirecting
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-neon selection:text-black">
      
      {/* --- CINEMATIC BACKGROUND --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.15] bg-[url('/textures/noise.png')] mix-blend-overlay animate-grain" />
        <div className="absolute top-[-50%] left-[-20%] w-[1000px] h-[1000px] bg-neon/5 blur-[250px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-50%] right-[-20%] w-[1000px] h-[1000px] bg-blue-600/10 blur-[250px] rounded-full mix-blend-screen" />
      </div>

      {/* --- LOGIN VAULT CARD --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Decorative Glow Line */}
        <div className="absolute -top-px left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-neon to-transparent opacity-50" />

        <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-[0_0_100px_rgba(0,0,0,0.8)]">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-12 space-y-4">
            <div className="p-5 bg-neon/10 rounded-3xl border border-neon/20 shadow-[0_0_30px_rgba(57,255,20,0.15)] relative group">
              <Lock className="w-8 h-8 text-neon group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-neon/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter text-white">System Access</h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <ShieldCheck className="w-3 h-3 text-neon" />
                <p className="text-[9px] font-black tracking-[0.4em] text-white/30">Secure Protocol v9.0</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] ml-4">Identity</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-neon transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER ID..."
                  className="w-full bg-black/40 border border-white/10 rounded-[2rem] py-5 pl-14 pr-6 text-xs font-bold text-white placeholder:text-white/10 focus:border-neon outline-none transition-all tracking-widest"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] ml-4">Passkey</label>
              <div className="relative group">
                <Fingerprint className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-neon transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-black/40 border border-white/10 rounded-[2rem] py-5 pl-14 pr-6 text-xs font-bold text-white placeholder:text-white/10 focus:border-neon outline-none transition-all tracking-widest"
                />
              </div>
            </div>

            {/* Action Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full group relative overflow-hidden bg-white text-black py-6 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.4em] hover:bg-neon transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(57,255,20,0.3)] disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.22,1,0.36,1]" />
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    Authorize <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>

          </form>

        </div>
        
        {/* Footer Text */}
        <p className="text-center text-[9px] font-black uppercase tracking-[0.3em] text-white/10 mt-8">
          Restricted Area • Authorized Personnel Only
        </p>

      </motion.div>
    </div>
  );
}