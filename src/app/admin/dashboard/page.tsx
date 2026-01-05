'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner'; 
import { 
  LogOut, Plus, Search, LayoutDashboard, Box, Layers, Settings, Loader2, Activity, TrendingUp, TrendingDown 
} from 'lucide-react';

// --- LOCAL COMPONENT IMPORTS ---
import AnalyticsOverview from './components/AnalyticsOverview';
import CategoryManager from './components/CategoryManager';
import ProductModal from './components/ProductModal';
import { LiveStudio } from './components/LiveStudio';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // --- DATA STATE ---
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- ANALYTICS STATE ---
  const [velocity, setVelocity] = useState({ value: 0, trend: 'neutral', label: 'Stable' });

  // --- UI STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryHubOpen, setIsCategoryHubOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // --- GOD MODE DATA FETCHING ---
  const fetchAllData = async () => {
    try {
      // 1. Calculate Date Ranges for Velocity
      const now = new Date();
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(now.getDate() - 10);
      const twentyDaysAgo = new Date();
      twentyDaysAgo.setDate(now.getDate() - 20);

      // 2. Parallel Fetching
      const [prodRes, catRes, setRes, currentTraffic, prevTraffic] = await Promise.all([
        supabase.from('products').select('*').order('id', { ascending: false }),
        supabase.from('categories').select('name').order('name'),
        supabase.from('site_settings').select('*').single(),
        // Current 10 Days
        supabase.from('analytics').select('*', { count: 'exact', head: true })
          .eq('event_type', 'page_view')
          .gte('created_at', tenDaysAgo.toISOString()),
        // Previous 10 Days
        supabase.from('analytics').select('*', { count: 'exact', head: true })
          .eq('event_type', 'page_view')
          .gte('created_at', twentyDaysAgo.toISOString())
          .lt('created_at', tenDaysAgo.toISOString())
      ]);

      // 3. Set Core Data
      if (prodRes.data) setProducts(prodRes.data);
      if (catRes.data) setCategories(catRes.data.map((c: any) => c.name));
      if (setRes.data) setSiteSettings(setRes.data);

      // 4. Calculate Velocity Logic
      const currentCount = currentTraffic.count || 0;
      const prevCount = prevTraffic.count || 0;
      let percentChange = 0;
      
      if (prevCount > 0) {
        percentChange = ((currentCount - prevCount) / prevCount) * 100;
      } else if (currentCount > 0) {
        percentChange = 100; // Infinite growth (from 0 to something)
      }

      setVelocity({
        value: Math.abs(parseFloat(percentChange.toFixed(1))),
        trend: percentChange >= 0 ? 'positive' : 'negative',
        label: percentChange >= 0 ? 'Velocity' : 'Drag'
      });

    } catch (error) {
      toast.error('System Sync Failed');
      console.error(error);
    }
  };

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/admin'); return; }
      
      await fetchAllData();
      setLoading(false);
    };
    init();
  }, [router]);

  // --- INVENTORY ACTIONS ---
  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm("CRITICAL: Permanently delete this asset?")) return;
    
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      toast.error('Deletion Failed');
    } else {
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Asset Removed from Vault');
    }
  };

  const handleSaveProduct = async (formData: any, imageFile: File | null) => {
    const toastId = toast.loading('Syncing Asset...');
    
    try {
      let imageUrl = formData.image || ''; 
      
      // Handle Image Upload
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: upErr } = await supabase.storage.from('product-images').upload(`public/${fileName}`, imageFile);
        
        if (upErr) throw upErr;
        
        const { data } = supabase.storage.from('product-images').getPublicUrl(`public/${fileName}`);
        imageUrl = data.publicUrl;
      }

      const payload = { ...formData, image: imageUrl };

      if (editingProduct) {
        await supabase.from('products').update(payload).eq('id', editingProduct.id);
      } else {
        await supabase.from('products').insert([payload]);
      }
      
      await fetchAllData(); 
      setIsModalOpen(false);
      setEditingProduct(null);
      toast.success('Asset Successfully Synced', { id: toastId });
      
    } catch (err: any) {
      toast.error('Sync Error: ' + err.message, { id: toastId });
    }
  };

  // --- HELPER: Category Colors ---
  const getCategoryTheme = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('fit')) return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';
    if (c.includes('cloth')) return 'bg-violet-500/10 text-violet-300 border-violet-500/20';
    if (c.includes('skin')) return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
    if (c.includes('well')) return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
    return 'bg-neon/10 text-neon border-neon/20';
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-neon w-12 h-12" />
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Establishing Secure Uplink...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-neon selection:text-black font-sans overflow-x-hidden">
      
      {/* --- CINEMATIC AMBIENCE --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.12] bg-[url('/textures/noise.png')] mix-blend-overlay" />
        <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-blue-600/10 blur-[200px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-neon/5 blur-[200px]" />
      </div>

      <div className={`relative z-10 max-w-[1800px] mx-auto p-6 md:p-10 space-y-12 pb-40 transition-all duration-500 ${isModalOpen || isCategoryHubOpen ? 'blur-sm scale-[0.99] opacity-50 pointer-events-none' : ''}`}>
        
        {/* --- 1. HEADER (CYBERNETIC VELOCITY) --- */}
        <header className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
          
          {/* Subtle Scanline Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 opacity-20 pointer-events-none" />

          <div className="flex items-center gap-6 relative z-10">
            <div className="p-4 bg-black border border-white/10 rounded-[1.5rem] shadow-lg group">
              <LayoutDashboard className="w-6 h-6 text-neon group-hover:rotate-180 transition-transform duration-700" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase italic text-white leading-none">Console</h1>
              
              {/* VELOCITY METER */}
              <div className="flex items-center gap-3 mt-2">
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border ${
                  velocity.trend === 'positive' ? 'bg-neon/10 border-neon/30 text-neon' : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                  {velocity.trend === 'positive' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span className="text-[10px] font-mono font-bold tracking-tight">{velocity.value}%</span>
                </div>
                <span className="text-[9px] text-white/30 font-bold uppercase tracking-[0.2em]">10-Day {velocity.label}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={async () => { await supabase.auth.signOut(); router.push('/admin'); }} 
            className="px-8 py-4 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all active:scale-95 relative z-10"
          >
            Term <span className="hidden md:inline">Session</span>
          </button>
        </header>

        {/* --- 2. ANALYTICS ENGINE --- */}
        <AnalyticsOverview />

        {/* --- 3. INVENTORY COMMAND HUB --- */}
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[3.5rem] p-10 shadow-2xl">
          <div className="flex flex-col xl:flex-row justify-between items-center gap-8 mb-10">
            <div className="flex items-center gap-6">
               <div className="p-4 bg-neon/10 rounded-[1.5rem] border border-neon/20 shadow-[0_0_20px_rgba(57,255,20,0.1)]">
                 <Box className="w-6 h-6 text-neon" />
               </div>
               <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Inventory</h2>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 w-full xl:w-auto">
              <div className="relative w-full md:w-auto min-w-[300px] group">
                <Search className="w-4 h-4 absolute left-6 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-neon transition-colors" />
                <input 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  placeholder="SEARCH ASSETS..." 
                  className="w-full bg-black/40 border border-white/10 rounded-[2rem] pl-14 pr-6 py-4 text-[11px] font-bold uppercase text-white focus:border-neon outline-none transition-all placeholder:text-white/20" 
                />
              </div>
              <button 
                onClick={() => setIsCategoryHubOpen(true)} 
                className="flex items-center gap-3 bg-white/5 border border-white/10 px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 hover:border-neon/50 transition-all active:scale-95"
              >
                <Layers className="w-4 h-4 text-neon" /> Categories
              </button>
              <button 
                onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} 
                className="flex items-center gap-3 bg-white text-black px-10 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-neon hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all shadow-lg active:scale-95 group"
              >
                <Plus className="w-4 h-4 stroke-[3px] group-hover:rotate-90 transition-transform" /> Add Asset
              </button>
            </div>
          </div>

          {/* ASSET TABLE */}
          <div className="overflow-x-auto custom-scrollbar pb-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-white/30 text-[9px] font-black uppercase tracking-[0.4em] border-b border-white/10">
                  <th className="px-8 py-6 text-center">Visual</th>
                  <th className="px-8 py-6">Identity</th>
                  <th className="px-8 py-6">Classification</th>
                  <th className="px-8 py-6">Valuation</th>
                  <th className="px-8 py-6 text-right">Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map(p => (
                  <tr key={p.id} className="group hover:bg-white/[0.02] transition-colors duration-300">
                    <td className="px-8 py-5">
                      <div className="w-16 h-20 bg-black rounded-2xl overflow-hidden border border-white/10 mx-auto shadow-lg group-hover:border-neon/30 transition-all">
                        {p.image ? (
                          <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-white/20 font-black">N/A</div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="font-bold text-sm tracking-tight text-white group-hover:text-neon transition-colors">{p.name}</div>
                      {p.is_new ? (
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse shadow-[0_0_8px_#39FF14]" />
                            <span className="text-[9px] text-white/40 font-black uppercase tracking-widest">New Arrival</span>
                          </div>
                      ) : (
                        <div className="mt-1.5 text-[9px] text-white/20 font-black uppercase tracking-widest">Standard</div>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase border tracking-widest inline-flex items-center gap-2 ${getCategoryTheme(p.category)}`}>
                        <div className="w-1 h-1 rounded-full bg-current" />
                        {p.category}
                      </span>
                    </td>
                    
                    {/* --- UPDATED VALUATION COLUMN --- */}
                    <td className="px-8 py-5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-mono text-2xl font-black text-white group-hover:text-neon transition-colors tracking-tighter">
                          {p.price}
                        </span>
                        <span className="font-mono text-xs font-bold text-white/40 uppercase">
                          {p.currency}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => { setEditingProduct(p); setIsModalOpen(true); }} 
                          className="px-5 py-2.5 bg-white/5 hover:bg-white hover:text-black border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(p.id)} 
                          className="px-5 py-2.5 bg-red-500/5 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-red-500/70 transition-all active:scale-95"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredProducts.length === 0 && (
              <div className="p-12 text-center text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
                No Assets Found in Registry
              </div>
            )}
          </div>
        </div>

        {/* --- 4. LIVE STUDIO --- */}
        <div className="pt-20">
          <div className="flex items-center gap-6 mb-12">
              <div className="p-5 bg-white/5 rounded-[2rem] border border-white/10 shadow-xl">
                <Settings className="w-8 h-8 text-neon" />
              </div>
              <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">Live Studio</h2>
          </div>
          
          <LiveStudio settings={siteSettings} refresh={fetchAllData} />
        </div>

      </div>

      {/* --- 5. OVERLAYS (God Mode Layering) --- */}
      <CategoryManager 
        isOpen={isCategoryHubOpen} 
        setIsOpen={setIsCategoryHubOpen} 
        categories={categories} 
        setCategories={setCategories} 
      />

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveProduct} 
        initialData={editingProduct} 
        categories={categories} 
      />
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #39FF14; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
}