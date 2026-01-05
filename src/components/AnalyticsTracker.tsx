'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { supabase } from '../lib/supabase';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasFired = useRef(false);

  useEffect(() => {
    hasFired.current = false;
  }, [pathname, searchParams]);

  useEffect(() => {
    if (hasFired.current) return;

    const trackView = async () => {
      hasFired.current = true;

      // --- 1. THE SECURITY CHECK ---
      // Check if a user session exists (meaning YOU are logged in)
      const { data: { session } } = await supabase.auth.getSession();
      
      // If you are logged in, STOP here. Do not count this view.
      if (session) {
        console.log("Analytics: Admin detected. View ignored.");
        return;
      }

      // --- 2. LOG THE VIEW (Only for guests) ---
      try {
        await supabase.from('analytics').insert([
          { 
            event_type: 'page_view',
            metadata: { 
              path: pathname,
              referrer: document.referrer || 'direct',
              screen: `${window.innerWidth}x${window.innerHeight}`
            } 
          }
        ]);
        // console.log("Analytics: Visitor Tracked");
      } catch (err) {
        console.error("Analytics Error:", err);
      }
    };

    const timer = setTimeout(trackView, 1000);
    return () => clearTimeout(timer);

  }, [pathname, searchParams]);

  return null;
}