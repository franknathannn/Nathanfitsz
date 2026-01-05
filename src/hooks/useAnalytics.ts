import { supabase } from '../lib/supabase';

export const useAnalytics = () => {
  
  const trackBuy = async (productName: string, price: string, link: string) => {
    // 1. Security Check: Don't track if YOU are logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      console.log(`Analytics: Admin click on "${productName}" ignored.`);
      
      // OPTIONAL: Still open the link for you so testing works
      window.open(link, '_blank');
      return;
    }

    // 2. Fire the Signal
    try {
      // Non-blocking insert (we don't await the result to keep UI snappy)
      supabase.from('analytics').insert([
        { 
          event_type: 'click_buy',
          metadata: { 
            product: productName,
            price: price,
            destination: link,
            referrer: document.referrer
          } 
        }
      ]).then(() => console.log("Analytics: Buy Signal Sent"));

      // 3. Open the Affiliate Link
      window.open(link, '_blank');

    } catch (err) {
      console.error("Tracking Error:", err);
      // Even if tracking fails, ensure the user gets to the link
      window.open(link, '_blank');
    }
  };

  return { trackBuy };
};