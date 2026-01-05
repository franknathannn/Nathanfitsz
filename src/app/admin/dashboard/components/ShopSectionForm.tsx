'use client';

import { useState } from 'react';
import { supabase } from '../../../../lib/supabase';
import { toast } from 'sonner';
import { Save, Loader2, Tag } from 'lucide-react';

export default function ShopSectionForm({ initialData, refresh }: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shop_title: initialData.shop_title || '',
    shop_subtitle: initialData.shop_subtitle || '',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Updating Storefront...');

    const { error } = await supabase
      .from('site_settings')
      .update(formData)
      .eq('id', initialData.id);

    if (error) {
      toast.error(error.message, { id: toastId });
    } else {
      toast.success('Storefront Updated', { id: toastId });
      refresh();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-neon/10 rounded-xl">
           <Tag className="w-5 h-5 text-neon" />
        </div>
        <div>
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Marketplace Config</h3>
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Customize the product header</p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-2">Section Title</label>
        <input 
          value={formData.shop_title} 
          onChange={e => setFormData({...formData, shop_title: e.target.value})} 
          className="w-full bg-black/40 border border-white/10 rounded-[1.5rem] p-6 text-2xl font-black italic uppercase text-white focus:border-neon outline-none" 
          placeholder="e.g. Curated Picks"
        />
      </div>

      <div className="space-y-3">
        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-2">Section Subtitle</label>
        <input 
          value={formData.shop_subtitle} 
          onChange={e => setFormData({...formData, shop_subtitle: e.target.value})} 
          className="w-full bg-black/40 border border-white/10 rounded-[1.5rem] p-6 text-sm font-medium text-white/70 focus:border-neon outline-none" 
          placeholder="e.g. Essentials for the modern elite."
        />
      </div>

      <div className="pt-6">
        <button type="submit" disabled={loading} className="px-10 py-5 bg-white text-black rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-neon transition-all flex items-center gap-3 shadow-lg disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
          Save Configuration
        </button>
      </div>
    </form>
  );
}