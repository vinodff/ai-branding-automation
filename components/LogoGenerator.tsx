
import React, { useState, useContext } from 'react';
import { Palette, Loader2, Download, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';
import { GeminiService } from '../services/gemini';
import { BrandContextData } from '../App';
import { Link } from 'react-router-dom';

const LogoGenerator: React.FC = () => {
  const { context } = useContext(BrandContextData);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const gemini = new GeminiService();
      const url = await gemini.generateLogo(prompt, context);
      setLogoUrl(url);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!logoUrl) return;
    const link = document.createElement('a');
    link.href = logoUrl;
    link.download = `brandcraft-logo-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Logo Visualizer</h2>
        <p className="text-slate-400 max-w-xl mx-auto">Render visual assets that adhere to your brand's core personality and industry tone.</p>
      </div>

      {!context ? (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center">
          <AlertCircle className="mx-auto text-amber-500 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">Context Missing</h3>
          <p className="text-slate-400 mb-6">Setup your Brand DNA to guide the logo generation process.</p>
          <Link to="/context" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all inline-block">
            Configure Context
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-6 p-3 bg-indigo-600/10 rounded-xl border border-indigo-500/20">
              <Sparkles className="text-indigo-400" size={16} />
              <p className="text-xs text-indigo-200">Using {context.tone} aesthetic guidelines</p>
            </div>

            <label className="block text-sm font-medium text-slate-400 mb-4">Design Concept</label>
            <textarea 
              rows={4}
              placeholder="Describe icons or specific imagery you want to include..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white resize-none mb-6"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            
            <button 
              onClick={handleGenerate}
              disabled={loading || !prompt}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
              {loading ? 'Synthesizing Vision...' : 'Generate Branded Asset'}
            </button>
          </div>

          <div className="flex flex-col items-center justify-center bg-slate-900 border border-slate-800 border-dashed rounded-3xl min-h-[400px] p-8 relative overflow-hidden">
            {logoUrl ? (
              <div className="space-y-6 w-full flex flex-col items-center animate-in zoom-in duration-300">
                <img src={logoUrl} alt="Generated Logo" className="w-full aspect-square rounded-2xl shadow-2xl border border-slate-700" />
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl transition-colors font-medium border border-slate-700"
                >
                  <Download size={18} /> Export High-Res
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                  <Palette size={40} />
                </div>
                <p className="text-slate-500 font-medium">Render preview will appear here</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoGenerator;
