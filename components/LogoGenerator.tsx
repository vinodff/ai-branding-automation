
import React, { useState, useContext } from 'react';
import { Palette, Loader2, Download, Image as ImageIcon, Sparkles, AlertCircle, Zap, Eye } from 'lucide-react';
import { GeminiService } from '../services/gemini';
import { BrandContextData } from '../App';

const LogoGenerator: React.FC = () => {
  const { context } = useContext(BrandContextData);
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('minimalist');
  const [loading, setLoading] = useState(false);
  const [logos, setLogos] = useState<string[]>([]);
  const [activeLogo, setActiveLogo] = useState<string | null>(null);

  const styles = [
    { id: 'minimalist', label: 'Tech Minimal', desc: 'Clean, Modern' },
    { id: 'futuristic', label: 'Cyber Pulse', desc: 'Neon, Glass' },
    { id: 'heritage', label: 'Legacy Core', desc: 'Premium, Stable' },
  ];

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setLogos([]);
    try {
      const gemini = new GeminiService();
      const url = await gemini.generateLogo(`${style} style: ${prompt}`, context);
      setLogos([url]);
      setActiveLogo(url);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
          <Zap size={14} className="text-indigo-400" />
          <span className="text-[10px] font-brand font-bold text-indigo-300 uppercase tracking-widest">Visual Forge Alpha</span>
        </div>
        <h2 className="text-5xl font-brand font-black text-white mb-6 tracking-tighter">Visual Identity <span className="text-indigo-500">Forge.</span></h2>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">Synthesize high-fidelity brand marks using the latest neural rendering cores.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        <div className="xl:col-span-5 space-y-10">
          <div className="glass-card p-10 rounded-[2.5rem] border border-white/5">
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-brand font-black text-slate-500 uppercase tracking-widest mb-4">Aesthetic Style</label>
                <div className="grid grid-cols-3 gap-4">
                  {styles.map(s => (
                    <button key={s.id} onClick={() => setStyle(s.id)} className={`p-4 rounded-2xl border text-left transition-all ${style === s.id ? 'bg-indigo-600 border-indigo-400 shadow-lg' : 'bg-white/5 border-white/5'}`}>
                      <p className={`text-xs font-brand font-black uppercase mb-1 ${style === s.id ? 'text-white' : 'text-slate-400'}`}>{s.label}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-brand font-black text-slate-500 uppercase tracking-widest mb-4">Creative Directive</label>
                <textarea rows={4} placeholder="A minimalist geometric mark merging with digital patterns..." className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white resize-none text-sm" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
              </div>
              <button onClick={handleGenerate} disabled={loading || !prompt} className="w-full bg-white text-slate-950 hover:bg-slate-100 disabled:opacity-50 font-brand font-black py-5 rounded-2xl transition-all shadow-2xl">
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                {loading ? 'Executing...' : 'Execute Synthesis'}
              </button>
            </div>
          </div>
        </div>

        <div className="xl:col-span-7">
          <div className="glass-card rounded-[3rem] p-4 min-h-[500px] flex flex-col">
            <div className="flex-1 glass-card bg-slate-950/50 rounded-[2.5rem] border border-white/5 flex items-center justify-center relative overflow-hidden">
              {loading ? (
                <div className="flex flex-col items-center animate-pulse">
                  <Palette size={64} className="text-indigo-400 mb-6" />
                  <p className="text-xl font-brand font-black text-white">Synthesizing Visual Core...</p>
                </div>
              ) : activeLogo ? (
                <div className="p-12 animate-in zoom-in duration-500">
                   <img src={activeLogo} className="max-w-full rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)]" alt="Synthesized Logo" />
                </div>
              ) : (
                <div className="text-center opacity-20">
                  <ImageIcon size={64} className="text-slate-400 mb-6 mx-auto" />
                  <p className="text-xl font-brand font-black text-slate-400">Awaiting Neural Directive</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoGenerator;
