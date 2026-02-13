
import React, { useState, useContext } from 'react';
import { Clapperboard, Sparkles, Loader2, Play, Download, Film } from 'lucide-react';
import { GeminiService } from '../services/gemini';
import { BrandContextData } from '../App';

const NeuralMotion: React.FC = () => {
  const { context } = useContext(BrandContextData);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setVideoUrl(null);
    try {
      const gemini = new GeminiService();
      setStatus('Analyzing brand DNA...');
      setTimeout(() => setStatus('Synthesizing cinematic script...'), 3000);
      setTimeout(() => setStatus('Rendering neural frames (Veo 3.1)...'), 8000);
      const url = await gemini.generateVideo(prompt, context);
      setVideoUrl(url);
    } catch (error: any) {
      console.error(error);
      alert("Video generation failed.");
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-brand font-black text-white mb-4 tracking-tighter">Neural Motion</h2>
        <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">Synthesize cinematic brand commercials using the world's most advanced video engine.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          <div className="glass-card p-10 rounded-[2.5rem] border border-white/5">
            <label className="block text-[10px] font-brand font-black text-slate-500 uppercase tracking-widest mb-4">Teaser Vision</label>
            <textarea 
              rows={5}
              placeholder="A sleek minimalist office space with golden hour light, showing our logo on a floating display..."
              className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white resize-none transition-all text-sm leading-relaxed"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button 
              onClick={handleGenerate}
              disabled={loading || !prompt}
              className="w-full mt-8 bg-white text-slate-950 hover:bg-slate-100 disabled:opacity-50 font-brand font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Film size={20} />}
              {loading ? 'Synthesizing...' : 'Execute Rendering'}
            </button>
          </div>
        </div>

        <div className="flex flex-col glass-card rounded-[2.5rem] min-h-[500px] relative overflow-hidden group">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
              <div className="relative mb-8">
                <div className="w-24 h-24 border-4 border-indigo-500/20 rounded-full border-t-indigo-500 animate-spin" />
                <Clapperboard className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400" size={32} />
              </div>
              <p className="text-xl font-brand font-black text-white mb-2">{status}</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest">Veo Engine Active</p>
            </div>
          ) : videoUrl ? (
            <div className="flex-1 flex flex-col h-full">
              <video src={videoUrl} autoPlay loop className="flex-1 w-full object-cover rounded-[2.5rem]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent flex flex-col justify-end p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-black text-lg">Teaser Alpha_1</h4>
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">720p • Cinema Scale</p>
                  </div>
                  <a href={videoUrl} download className="p-4 bg-white text-black rounded-2xl hover:scale-105 transition-all shadow-xl"><Download size={20} /></a>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-30">
              <Clapperboard size={64} className="text-slate-600 mb-6" />
              <h3 className="text-xl font-bold text-slate-400">Rendering Ready</h3>
              <p className="text-sm text-slate-600 max-w-xs mx-auto">Asset preview will appear here upon neural synthesis completion.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NeuralMotion;
