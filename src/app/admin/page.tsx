'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AdminGateway() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // User is logged in -> Go to Dashboard
        router.replace('/admin/dashboard');
      } else {
        // User is guest -> Go to Login
        router.replace('/admin/login');
      }
    };

    checkSession();
  }, [router]);

  // Render a simple loading screen while we decide where to go
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-neon animate-spin" />
    </div>
  );
}
