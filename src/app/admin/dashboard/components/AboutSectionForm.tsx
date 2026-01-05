'use client';

import { useState } from 'react';
import { supabase } from '../../../../lib/supabase';
import { toast } from 'sonner';
import { Save, Loader2, Quote } from 'lucide-react';

export default function AboutSectionForm({ initialData, refresh }: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    about_quote: initialData.about_quote || '',
    about_subquote: initialData.about_subquote || '',
    about_text_1: initialData.about_text_1 || '',
    about_text_2: initialData.about_text_2 || '',
    about_author: initialData.about_author || '',
    about_role: initialData.about_role || ''
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Syncing Manifesto...');

    const { error } = await supabase
      .from('site_settings')
      .update(formData)
      .eq('id', initialData.id);

    if (error) {
      toast.error(error.message, { id: toastId });
    } else {
      toast.success('Manifesto Synced', { id: toastId });
      refresh();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-3xl">
      
      {/* QUOTE BLOCK */}
      <div className="p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] relative overflow-hidden">
        <Quote className="absolute top-6 right-6 w-12 h-12 text-white/5 rotate-180" />
        <div className="space-y-6 relative z-10">
          <div className="space-y-3">
             <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-2">Primary Quote</label>
             <input value={formData.about_quote} onChange={e => setFormData({...formData, about_quote: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-[1.5rem] p-5 text-xl font-black italic text-white focus:border-neon outline-none" />
          </div>
          <div className="space-y-3">
             <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-2">Sub Quote (Fade)</label>
             <input value={formData.about_subquote} onChange={e => setFormData({...formData, about_subquote: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-[1.5rem] p-5 text-lg font-medium text-white/50 focus:border-neon outline-none" />
          </div>
        </div>
      </div>

      {/* BODY TEXT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-2">Paragraph 1</label>
          <textarea rows={6} value={formData.about_text_1} onChange={e => setFormData({...formData, about_text_1: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-[2rem] p-6 text-sm leading-relaxed text-white/80 focus:border-neon outline-none resize-none" />
        </div>
        <div className="space-y-3">
          <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-2">Paragraph 2</label>
          <textarea rows={6} value={formData.about_text_2} onChange={e => setFormData({...formData, about_text_2: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-[2rem] p-6 text-sm leading-relaxed text-white/80 focus:border-neon outline-none resize-none" />
        </div>
      </div>

      {/* SIGNATURE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-2">Author Name</label>
          <input value={formData.about_author} onChange={e => setFormData({...formData, about_author: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-[1.5rem] p-5 text-neon font-mono uppercase tracking-widest focus:border-neon outline-none" />
        </div>
        <div className="space-y-3">
          <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-2">Role Title</label>
          <input value={formData.about_role} onChange={e => setFormData({...formData, about_role: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-[1.5rem] p-5 text-xs font-bold uppercase tracking-widest text-white focus:border-neon outline-none" />
        </div>
      </div>

      <div className="pt-6 border-t border-white/5">
        <button type="submit" disabled={loading} className="px-10 py-5 bg-white text-black rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-neon transition-all flex items-center gap-3 shadow-lg disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
          Sync Manifesto
        </button>
      </div>
    </form>
  );
}