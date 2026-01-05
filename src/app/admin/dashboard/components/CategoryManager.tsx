'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { Plus, Search, Tag, Trash2, Edit2, PackageOpen, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import ProductModal from './ProductModal';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  link: string;
  is_new: boolean;
}

export default function CategoryManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Fetch Data
  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete Handler
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete');
    } else {
      toast.success('Product deleted');
      fetchProducts();
    }
  };

  // Filter Logic
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="w-full space-y-8">
      
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Inventory</h2>
           <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Manage your products</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
           {/* Category Pills */}
           <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-[300px] md:max-w-none pb-2 md:pb-0">
             {categories.map(cat => (
               <button
                 key={cat}
                 onClick={() => setActiveCategory(cat)}
                 className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                   activeCategory === cat 
                     ? 'bg-white text-black border-white' 
                     : 'bg-transparent text-white/40 border-white/10 hover:border-white/30 hover:text-white'
                 }`}
               >
                 {cat}
               </button>
             ))}
           </div>

           {/* Add Button */}
           <button 
             onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
             className="flex items-center gap-2 bg-neon text-black px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)] ml-auto"
           >
             <Plus className="w-4 h-4" /> Add Item
           </button>
        </div>
      </div>

      {/* PRODUCT GRID */}
      {loading ? (
        <div className="text-center py-20 text-white/20 animate-pulse text-xs font-mono uppercase tracking-widest">Loading Inventory...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-white/[0.02] border border-white/10 rounded-[2rem] p-4 hover:bg-white/[0.04] transition-colors"
              >
                 {/* Image Area */}
                 <div className="relative aspect-square rounded-[1.5rem] bg-black/50 overflow-hidden mb-4 border border-white/5">
                    {product.image ? (
                      <img src={product.image} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/10">
                        <PackageOpen className="w-8 h-8" />
                      </div>
                    )}
                    
                    {/* Floating Badge */}
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                       <span className="text-[9px] font-black text-white/80 uppercase tracking-widest">{product.category}</span>
                    </div>

                    {/* Action Buttons (Hover) */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                       <button 
                         onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                         className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform"
                       >
                         <Edit2 className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => handleDelete(product.id)}
                         className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                 </div>

                 {/* Info Area */}
                 <div className="px-2 pb-2">
                    <div className="flex flex-col gap-1">
                        
                        {/* 1. Name: Normal casing (removed uppercase) */}
                        <h3 className="text-white font-bold text-sm leading-tight line-clamp-2">
                          {product.name}
                        </h3>

                        {/* 2. Price: BIG & Raw Format with PHP */}
                        <div className="flex items-baseline gap-1.5 mt-1">
                            <span className="text-xs font-black text-neon/50">PHP</span>
                            <span className="text-2xl font-mono font-black text-neon tracking-tight">
                                {product.price}
                            </span>
                        </div>

                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-[10px] text-white/30 font-mono">
                       <Tag className="w-3 h-3" />
                       <span className="truncate max-w-[150px]">{product.link}</span>
                    </div>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal Injection */}
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchProducts}
        productToEdit={editingProduct}
      />
    </div>
  );
}