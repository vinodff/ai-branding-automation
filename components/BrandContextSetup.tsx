
import React, { useState, useContext } from 'react';
import { Settings, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { BrandContextData } from '../App';
import { BrandContext } from '../types';

const BrandContextSetup: React.FC = () => {
  const { context, setContext } = useContext(BrandContextData);
  const [formData, setFormData] = useState<BrandContext>(context || {
    industry: '',
    tone: 'professional',
    target_audience: '',
    brand_personality: '',
    keywords: []
  });
  const [keywordInput, setKeywordInput] = useState('');
  const [savedStatus, setSavedStatus] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContext(formData);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData({ ...formData, keywords: [...formData.keywords, keywordInput.trim()] });
      setKeywordInput('');
    }
  };

  const removeKeyword = (kw: string) => {
    setFormData({ ...formData, keywords: formData.keywords.filter(k => k !== kw) });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">Brand DNA Configuration</h2>
        <p className="text-slate-400">Establish the core identity of your brand. These parameters are injected into every AI generation to ensure perfect alignment.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-slate-900 border border-slate-800 p-8 rounded-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Industry</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Sustainable Fintech"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Target Audience</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Gen Z Investors"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              value={formData.target_audience}
              onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Brand Tone</label>
            <select 
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              value={formData.tone}
              onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
            >
              <option value="professional">Professional & Secure</option>
              <option value="disruptive">Disruptive & Bold</option>
              <option value="warm">Warm & Empathetic</option>
              <option value="luxury">Luxury & Exclusive</option>
              <option value="minimalist">Minimalist & Clean</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Primary Personality</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Innovative, Reliable, Playful"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              value={formData.brand_personality}
              onChange={(e) => setFormData({ ...formData, brand_personality: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Core Keywords (max 5)</label>
          <div className="flex gap-2 mb-4">
            <input 
              type="text" 
              placeholder="Add keyword..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
            />
            <button 
              type="button" 
              onClick={addKeyword}
              className="bg-slate-800 hover:bg-slate-700 text-white px-6 rounded-xl border border-slate-700 font-bold"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.keywords.map(kw => (
              <span key={kw} className="bg-indigo-600/20 text-indigo-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-indigo-600/30 flex items-center gap-2">
                {kw}
                <button type="button" onClick={() => removeKeyword(kw)} className="hover:text-white">×</button>
              </span>
            ))}
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          {savedStatus ? <CheckCircle2 size={20} /> : <Save size={20} />}
          {savedStatus ? 'Configuration Synchronized' : 'Persist Brand Context'}
        </button>

        {!context && (
          <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
            <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
            <p className="text-xs text-amber-200 leading-relaxed">
              <strong>Context Missing:</strong> Define your brand DNA now to enable context-aware AI generations. Without context, models will default to generic outputs.
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default BrandContextSetup;
