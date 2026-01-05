'use client';

import { useState } from 'react';
import { supabase } from '../../../../lib/supabase';
import { toast } from 'sonner';
import { Save, Loader2, Upload, Sparkles } from 'lucide-react';

export default function HeroSectionForm({ initialData, refresh }: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    hero_headline_prefix: initialData.hero_headline_prefix || '',
    hero_headline_highlight: initialData.hero_headline_highlight || '',
    hero_subheadline: initialData.hero_subheadline || '',
    hero_follower_count: initialData.hero_follower_count || '',
    social_tiktok: initialData.social_tiktok || '',
    social_instagram: initialData.social_instagram || ''
  });
  const [preview, setPreview] = useState<string>(initialData.hero_image_url || '');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Updating Identity...');

    try {
      let finalImageUrl = initialData.hero_image_url;

      if (imageFile) {
        const fileName = `hero-${Date.now()}.${imageFile.name.split('.').pop()}`;
        const { error: upErr } = await supabase.storage.from('product-images').upload(`public/${fileName}`, imageFile);
        if (upErr) throw upErr;
        const { data } = supabase.storage.from('product-images').getPublicUrl(`public/${fileName}`);
        finalImageUrl = data.publicUrl;
      }

      const { error } = await supabase
        .from('site_settings')
        .update({ ...formData, hero_image_url: finalImageUrl })
        .eq('id', initialData.id);

      if (error) throw error;

      toast.success('Hero Section Live', { id: toastId });
      refresh();
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-10 max-w-3xl">
      
      {/* IMAGE UPLOADER */}
      <div className="flex items-center gap-8">
        <div className="relative w-32 h-32 rounded-full p-1 bg-gradient-to-b from-neon/50 to-transparent">
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/10 bg-black">
            <img src={preview || '/placeholder.jpg'} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="flex-1">
          <label className="inline-flex items-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[1.5rem] cursor-pointer transition-all group">
            <Upload className="w-4 h-4 text-neon" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 group-hover:text-white">Upload New Profile</span>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
          <p className="mt-3 text-[9px] text-white/20 uppercase tracking-widest font-bold">Recommended: 500x500px (1:1 Aspect)</p>
        </div>
      </div>

      {/* HEADLINE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-2">Headline Prefix</label>
          <input 
            value={formData.hero_headline_prefix} 
            onChange={e => setFormData({...formData, hero_headline_prefix: e.target.value})} 
            className="w-full bg-black/40 border border-white/10 rounded-[1.5rem] p-5 text-white font-bold focus:border-neon outline-none" 
            placeholder="e.g. nathans"
          />
        </div>
        <div className="space-y-3">
          <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-2 flex items-center gap-2">
            Highlight <Sparkles className="w-3 h-3 text-neon" />
          </label>
          <input 
            value={formData.hero_headline_highlight} 
            onChange={e => setFormData({...formData, hero_headline_highlight: e.target.value})} 
            className="w-full bg-black/40 border border-white/10 rounded-[1.5rem] p-5 text-neon font-bold focus:border-neon outline-none" 
            placeholder="e.g. fitsz"
          />
        </div>
      </div>

      {/* SUBHEADLINE */}
      <div className="space-y-3">
        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-2">Subheadline Mission Statement</label>
        <textarea 
          rows={3} 
          value={formData.hero_subheadline} 
          onChange={e => setFormData({...formData, hero_subheadline: e.target.value})} 
          className="w-full bg-black/40 border border-white/10 rounded-[1.5rem] p-5 text-white/80 focus:border-neon outline-none resize-none leading-relaxed" 
        />
      </div>

      {/* SOCIALS */}
      <div className="space-y-3">
        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-2">Social Ecosystem</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input value={formData.hero_follower_count} onChange={e => setFormData({...formData, hero_follower_count: e.target.value})} placeholder="Followers (e.g. 12k+)" className="bg-black/40 border border-white/10 rounded-[1.5rem] p-5 text-xs text-white focus:border-neon outline-none" />
          <input value={formData.social_tiktok} onChange={e => setFormData({...formData, social_tiktok: e.target.value})} placeholder="TikTok URL" className="bg-black/40 border border-white/10 rounded-[1.5rem] p-5 text-xs text-white focus:border-neon outline-none font-mono" />
          <input value={formData.social_instagram} onChange={e => setFormData({...formData, social_instagram: e.target.value})} placeholder="Instagram URL" className="bg-black/40 border border-white/10 rounded-[1.5rem] p-5 text-xs text-white focus:border-neon outline-none font-mono" />
        </div>
      </div>

      <div className="pt-6 border-t border-white/5">
        <button type="submit" disabled={loading} className="px-10 py-5 bg-white text-black rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-neon transition-all flex items-center gap-3 shadow-lg disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
          Update Identity
        </button>
      </div>
    </form>
  );
}