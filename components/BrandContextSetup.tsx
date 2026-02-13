
import React, { useState, useContext } from 'react';
import { Settings, Save, AlertCircle, CheckCircle2, Loader2, Zap } from 'lucide-react';
import { BrandContextData } from '../App';
import { BrandContext } from '../types';
import { BrandCraftAPI } from '../services/api_client';

const BrandContextSetup: React.FC = () => {
  const { context, setContext } = useContext(BrandContextData);
  const [formData, setFormData] = useState<BrandContext>(context || {
    industry: '',
    tone: 'professional',
    target_audience: '',
    brand_personality: '',
    keywords: []
  });
  const [loading, setLoading] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await BrandCraftAPI.createContext(formData);
      const updatedContext = { ...formData, id: result.context_id };
      setContext(updatedContext);
      setSavedStatus(true);
      setTimeout(() => setSavedStatus(false), 3000);
    } catch (error) {
      console.error("Context sync failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-12 text-center animate-in fade-in duration-700">
        <h2 className="text-4xl font-brand font-black text-white mb-4 tracking-tighter">Identity Core</h2>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">Calibrate the neural engine with your brand's unique genetic markers.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-10 lg:p-16 rounded-[3rem] space-y-10 relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all duration-1000"><Zap size={100} /></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-2 group/field">
            <label className="text-[10px] font-brand font-black text-slate-500 group-focus-within/field:text-indigo-400 uppercase tracking-widest px-1 transition-colors">Market Industry</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. Neo-Fintech" 
              className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/30 text-white transition-all hover:bg-slate-950/70" 
              value={formData.industry} 
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })} 
            />
          </div>
          <div className="space-y-2 group/field">
            <label className="text-[10px] font-brand font-black text-slate-500 group-focus-within/field:text-indigo-400 uppercase tracking-widest px-1 transition-colors">Target Archetype</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. Early Adopters" 
              className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/30 text-white transition-all hover:bg-slate-950/70" 
              value={formData.target_audience} 
              onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })} 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-2 group/field">
            <label className="text-[10px] font-brand font-black text-slate-500 group-focus-within/field:text-indigo-400 uppercase tracking-widest px-1 transition-colors">Acoustic Tone</label>
            <div className="relative">
              <select 
                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/30 text-white appearance-none cursor-pointer transition-all hover:bg-slate-950/70" 
                value={formData.tone} 
                onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
              >
                <option value="professional">Professional Alpha</option>
                <option value="disruptive">Disruptive Core</option>
                <option value="luxury">Luxury Elite</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-focus-within/field:opacity-100 transition-opacity">
                <div className="flex gap-0.5">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-1 h-3 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2 group/field">
            <label className="text-[10px] font-brand font-black text-slate-500 group-focus-within/field:text-indigo-400 uppercase tracking-widest px-1 transition-colors">Brand Personality</label>
            <input 
              type="text" 
              required 
              placeholder="Innovative, Reliable" 
              className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/30 text-white transition-all hover:bg-slate-950/70" 
              value={formData.brand_personality} 
              onChange={(e) => setFormData({ ...formData, brand_personality: e.target.value })} 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-white text-slate-950 hover:bg-indigo-50 disabled:opacity-50 font-brand font-black py-5 rounded-2xl transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98] btn-glow"
        >
          {loading ? <Loader2 className="animate-spin" /> : savedStatus ? <CheckCircle2 size={24} className="text-emerald-600 animate-bounce" /> : <Save size={24} />}
          {loading ? 'Synthesizing...' : savedStatus ? 'Identity Stored' : 'Persist Brand DNA'}
        </button>
      </form>
    </div>
  );
};

export default BrandContextSetup;
