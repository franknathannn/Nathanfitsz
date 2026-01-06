'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import Router
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Lock, Loader2, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter(); // Initialize Router
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Access Granted');
      
      // --- THE FIX: FORCE NAVIGATION TO DASHBOARD ---
      router.refresh(); // Refreshes server components (like middleware)
      router.push('/admin/dashboard'); 

    } catch (err: any) {
      toast.error(err.message || 'Authentication Failed');
      setLoading(false); // Only stop loading on error, keep loading on success while redirecting
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('/textures/noise.png')] opacity-[0.15] mix-blend-overlay pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-neon/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] relative z-10 shadow-2xl">
        
        <div className="flex flex-col items-center mb-8 gap-4">
          <div className="p-4 bg-neon/10 rounded-2xl border border-neon/20 shadow-[0_0_15px_rgba(57,255,20,0.2)]">
            <Lock className="w-6 h-6 text-neon" />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-widest">System Entry</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2">Command ID</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-neon focus:outline-none transition-colors text-sm font-mono"
              placeholder="admin@nathanfitsz.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2">Passcode</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-neon focus:outline-none transition-colors text-sm font-mono"
              placeholder="••••••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black font-black uppercase tracking-widest py-4 rounded-xl mt-4 hover:bg-neon hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Initialize <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
