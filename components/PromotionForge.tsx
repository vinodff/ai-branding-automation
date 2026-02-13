
import React, { useState, useContext } from 'react';
import { Image as ImageIcon, Loader2, Download, Sparkles, AlertCircle, Zap, Layers, Megaphone, Star } from 'lucide-react';
import { GeminiService } from '../services/gemini';
import { BrandContextData } from '../App';
import { Link } from 'react-router-dom';

const PromotionForge: React.FC = () => {
  const { context } = useContext(BrandContextData);
  const [style, setStyle] = useState<'luxury' | 'cinematic' | 'bold'>('luxury');
  const [loading, setLoading] = useState(false);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);

  const campaignStyles = [
    { 
      id: 'luxury', 
      label: 'Luxury Collection', 
      desc: 'Soft lighting, serif fonts, elegant icons',
      icon: <Star size={20} className="text-amber-400" />
    },
    { 
      id: 'cinematic', 
      label: 'Signature Series', 
      desc: 'Dramatic grades, motion blur, centered logo',
      icon: <Layers size={20} className="text-indigo-400" />
    },
    { 
      id: 'bold', 
      label: 'Elite Drop', 
      desc: 'Dynamic pose, gold particles, powerful crest',
      icon: <Zap size={20} className="text-fuchsia-400" />
    },
  ];

  const handleGenerate = async () => {
    setLoading(true);
    setPosterUrl(null);
    try {
      const gemini = new GeminiService();
      const url = await gemini.generatePromotionPoster(style as any, context);
      setPosterUrl(url);
    } catch (error) {
      console.error(error);
      alert("Promotion synthesis failed. Check your neural connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-full mb-6">
          <Megaphone size={14} className="text-fuchsia-400" />
          <span className="text-[10px] font-brand font-black text-fuchsia-300 uppercase tracking-widest">Promotion Forge Alpha</span>
        </div>
        <h2 className="text-5xl font-brand font-black text-white mb-6 tracking-tighter">Campaign <span className="text-fuchsia-500">Forge.</span></h2>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">Synthesize high-end advertisement posters tailored to your brand's elite presence.</p>
      </div>

      {!context ? (
        <div className="glass-card p-20 rounded-[3rem] text-center border border-white/5">
          <AlertCircle className="mx-auto text-amber-500 mb-6" size={64} />
          <h3 className="text-2xl font-brand font-black text-white mb-4">DNA Signature Required</h3>
          <p className="text-slate-400 mb-10 max-w-md mx-auto">We need your brand context to synthesize dynamic campaign assets. Initialize your DNA sequence first.</p>
          <Link to="/context" className="bg-white text-slate-950 px-10 py-5 rounded-2xl font-brand font-black uppercase tracking-widest text-sm hover:bg-indigo-50 transition-all shadow-2xl">
            Configure DNA
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          <div className="xl:col-span-4 space-y-10">
            <div className="glass-card p-8 rounded-[2.5rem] border border-white/5">
              <label className="block text-[10px] font-brand font-black text-slate-500 uppercase tracking-widest mb-6">Campaign Aesthetic</label>
              <div className="space-y-4">
                {campaignStyles.map((s) => (
                  <button 
                    key={s.id} 
                    onClick={() => setStyle(s.id as any)}
                    className={`w-full p-6 rounded-2xl border text-left transition-all relative group overflow-hidden ${style === s.id ? 'bg-indigo-600 border-indigo-400 shadow-xl' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={`p-3 rounded-xl ${style === s.id ? 'bg-white/20' : 'bg-slate-900'}`}>
                        {s.icon}
                      </div>
                      <div>
                        <p className={`text-sm font-brand font-black uppercase tracking-tight ${style === s.id ? 'text-white' : 'text-slate-200'}`}>{s.label}</p>
                        <p className={`text-[10px] leading-tight ${style === s.id ? 'text-indigo-100' : 'text-slate-500'}`}>{s.desc}</p>
                      </div>
                    </div>
                    {style === s.id && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-white/10 animate-pulse pointer-events-none" />}
                  </button>
                ))}
              </div>

              <div className="mt-10 p-6 bg-slate-950/50 rounded-2xl border border-white/5">
                <p className="text-[10px] font-brand font-black text-slate-500 uppercase tracking-widest mb-2">Active DNA Injection</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-bold text-indigo-400">{context.industry}</span>
                  <span className="px-3 py-1 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-full text-[10px] font-bold text-fuchsia-400">{context.tone}</span>
                </div>
              </div>

              <button 
                onClick={handleGenerate} 
                disabled={loading} 
                className="w-full mt-10 bg-white text-slate-950 hover:bg-indigo-50 disabled:opacity-50 font-brand font-black py-5 rounded-2xl transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98] btn-glow"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                {loading ? 'Synthesizing Poster...' : 'Execute Synthesis'}
              </button>
            </div>
          </div>

          <div className="xl:col-span-8">
            <div className="glass-card rounded-[3rem] p-4 min-h-[700px] flex flex-col relative overflow-hidden group">
              <div className="flex-1 glass-card bg-slate-950/50 rounded-[2.5rem] border border-white/5 flex items-center justify-center relative overflow-hidden">
                {loading ? (
                  <div className="flex flex-col items-center">
                    <div className="relative mb-8">
                       <div className="w-24 h-24 border-4 border-fuchsia-500/20 rounded-full border-t-fuchsia-500 animate-spin" />
                       <Megaphone className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-fuchsia-400" size={32} />
                    </div>
                    <p className="text-xl font-brand font-black text-white animate-pulse">Rendering Campaign Asset...</p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mt-2">Neural Frame Synthesis Active</p>
                  </div>
                ) : posterUrl ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 animate-in zoom-in duration-700">
                     <img src={posterUrl} className="max-h-[80vh] rounded-[2rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10" alt="Synthesized Campaign Poster" />
                     <div className="absolute top-10 right-10 flex gap-4">
                        <a href={posterUrl} download={`BrandCraft_${style}_Poster.png`} className="p-4 bg-white/10 backdrop-blur-xl border border-white/10 text-white rounded-2xl hover:bg-white/20 transition-all shadow-2xl flex items-center gap-2 group">
                          <Download size={20} className="group-hover:translate-y-1 transition-transform" />
                          <span className="text-xs font-bold uppercase tracking-widest">Store Asset</span>
                        </a>
                     </div>
                  </div>
                ) : (
                  <div className="text-center opacity-20 group-hover:opacity-30 transition-opacity duration-1000">
                    <ImageIcon size={80} className="text-slate-400 mb-6 mx-auto" />
                    <p className="text-2xl font-brand font-black text-slate-400">Awaiting Campaign Directive</p>
                    <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">Select a campaign style and initialize the neural forge to generate your brand's promotional presence.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionForge;
