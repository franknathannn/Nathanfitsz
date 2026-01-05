'use client';

import { useState, useEffect, memo } from 'react';
import { X, Upload, Loader2, Save, ShoppingBag, Tag, Link2, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- PERFORMANCE: Static Backdrop ---
const GlassBackdrop = memo(({ onClose }: { onClose: () => void }) => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    exit={{ opacity: 0 }} 
    onClick={onClose} 
    className="absolute inset-0 bg-black/80 backdrop-blur-2xl will-change-[opacity] z-0" 
  />
));

export default function ProductModal({ isOpen, onClose, onSave, initialData, categories }: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', price: '', currency: 'PHP', category: '', link: '', is_new: false, image: ''
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
      setPreview(initialData.image || null);
    } else {
      setFormData({ name: '', price: '', currency: 'PHP', category: '', link: '', is_new: false, image: '' });
      setPreview(null);
      setImageFile(null);
    }
  }, [initialData, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) return;
    setLoading(true);
    await onSave(formData, imageFile);
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <GlassBackdrop onClose={onClose} />

          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
            className="relative z-10 w-full max-w-3xl bg-[#090909] border border-white/10 rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('/textures/noise.png')] mix-blend-overlay pointer-events-none" />

            {/* HEADER */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-5">
                <div className="p-3 bg-neon/10 rounded-2xl border border-neon/20 shadow-[0_0_15px_rgba(57,255,20,0.1)]">
                  <ShoppingBag className="w-5 h-5 text-neon" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    {initialData ? 'Edit Asset' : 'New Asset'}
                  </h3>
                  <p className="text-[10px] text-white/40 font-medium uppercase tracking-widest mt-1">Inventory Control</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-3 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FORM BODY */}
            <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto custom-scrollbar relative z-10">
              
              <div className="flex flex-col md:flex-row gap-8">
                
                {/* 1. VISUAL UPLOADER (Left Side) */}
                <div className="w-full md:w-1/3 flex-shrink-0">
                  <label className="group relative w-full aspect-[3/4] bg-white/[0.02] border-2 border-dashed border-white/10 rounded-[2rem] overflow-hidden cursor-pointer hover:border-neon/40 transition-all flex items-center justify-center">
                    {preview ? (
                      <img src={preview} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Preview" />
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-white/20 group-hover:text-neon transition-colors">
                        <Upload className="w-8 h-8" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Add Image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white text-[10px] font-bold uppercase tracking-widest border border-white/20 px-4 py-2 rounded-full">Change</span>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                </div>

                {/* 2. DATA FIELDS (Right Side) */}
                <div className="flex-1 space-y-6">
                  
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Product Name</label>
                    <input 
                      required
                      value={formData.name} 
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g. Essential Oversized Tee"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm font-medium text-white placeholder:text-white/10 focus:border-neon/50 outline-none transition-all" 
                    />
                  </div>

                  {/* Valuation (Compact Row) */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Price & Currency</label>
                    <div className="flex gap-3">
                      {/* Currency Dropdown */}
                      <div className="relative w-28 flex-shrink-0">
                        <select 
                          value={formData.currency} 
                          onChange={(e) => handleInputChange('currency', e.target.value)} 
                          className="w-full h-full bg-white/[0.03] border border-white/10 rounded-2xl pl-4 pr-8 text-xs font-bold text-white outline-none appearance-none cursor-pointer focus:border-neon/50 transition-all"
                        >
                          <option value="PHP">PHP (₱)</option>
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                        </select>
                        <ChevronDown className="w-3 h-3 text-white/30 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      
                      {/* Price Input */}
                      <div className="relative flex-1">
                        <input 
                          required
                          type="number" 
                          value={formData.price} 
                          onChange={(e) => handleInputChange('price', e.target.value)} 
                          placeholder="0.00"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm font-mono font-medium text-white placeholder:text-white/10 outline-none focus:border-neon/50 transition-all" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Classification */}
                  <div className="space-y-3 pt-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Tag className="w-3 h-3 text-neon" /> Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat: string) => (
                        <button
                          key={cat} 
                          type="button" 
                          onClick={() => handleInputChange('category', cat)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wide transition-all border ${
                            formData.category === cat 
                            ? 'bg-neon border-neon text-black shadow-[0_0_15px_rgba(57,255,20,0.3)]' 
                            : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/20'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* 3. FOOTER SECTION: Link & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Affiliate Link</label>
                  <div className="relative group">
                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-neon transition-colors" />
                    <input 
                      required
                      value={formData.link} 
                      onChange={(e) => handleInputChange('link', e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-mono text-white/80 placeholder:text-white/10 focus:border-neon/50 outline-none transition-all" 
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <label className="w-full flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl cursor-pointer group hover:bg-white/[0.04] transition-all">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        checked={formData.is_new} 
                        onChange={(e) => handleInputChange('is_new', e.target.checked)} 
                        className="peer w-5 h-5 opacity-0 absolute cursor-pointer" 
                      />
                      <div className="w-5 h-5 border-2 border-white/20 rounded-md peer-checked:bg-neon peer-checked:border-neon transition-all flex items-center justify-center">
                        {formData.is_new && <Check className="w-3 h-3 text-black stroke-[4px]" />}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-white group-hover:text-neon transition-colors">Mark as New Arrival</div>
                      <div className="text-[9px] text-white/30 font-medium">Adds "New" badge to card</div>
                    </div>
                  </label>
                </div>

              </div>

              {/* ACTIONS */}
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-neon hover:scale-[1.01] transition-all flex items-center justify-center gap-3 uppercase text-[10px] tracking-[0.25em] shadow-lg active:scale-[0.98] disabled:opacity-50 mt-4"
              >
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />} 
                Confirm & Sync
              </button>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}