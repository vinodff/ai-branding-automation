
import React, { useState, useContext } from 'react';
import { Search, Loader2, Sparkles, AlertCircle, ExternalLink, Globe, BarChart } from 'lucide-react';
import { GeminiService } from '../services/gemini';
import { BrandContextData } from '../App';
import { Link } from 'react-router-dom';

const BrandResearch: React.FC = () => {
  const { context } = useContext(BrandContextData);
  const [loading, setLoading] = useState(false);
  const [research, setResearch] = useState<{ text: string; sources: any[] } | null>(null);

  const handleResearch = async () => {
    setLoading(true);
    try {
      const gemini = new GeminiService();
      const results = await gemini.researchIndustry(context);
      setResearch(results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">Industry Intelligence</h2>
        <p className="text-slate-400">Deep-dive research into your market using real-time search data and trend analysis.</p>
      </div>

      {!context ? (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center">
          <AlertCircle className="mx-auto text-amber-500 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">Context Required</h3>
          <p className="text-slate-400 mb-6">We need your brand context to perform relevant market research.</p>
          <Link to="/context" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all inline-block">
            Setup DNA
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 shrink-0">
                <Globe size={32} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-white mb-1">Live Market Scan</h3>
                <p className="text-sm text-slate-400">Scanning competitors and consumer trends in the {context.industry} industry.</p>
              </div>
              <button 
                onClick={handleResearch}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
                {loading ? 'Performing Neural Search...' : 'Launch Intelligence Scan'}
              </button>
            </div>

            {research && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="prose prose-invert max-w-none bg-slate-950 p-6 rounded-2xl border border-slate-800 leading-relaxed text-slate-300">
                  <div className="flex items-center gap-2 mb-4 text-indigo-400 font-bold uppercase tracking-widest text-xs">
                    <BarChart size={14} /> AI Synthesis Report
                  </div>
                  {research.text.split('\n').map((line, i) => (
                    <p key={i} className="mb-4">{line}</p>
                  ))}
                </div>

                {research.sources.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Grounded Sources</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {research.sources.map((src, i) => (
                        <a 
                          key={i} 
                          href={src.web?.uri} 
                          target="_blank" 
                          rel="noreferrer"
                          className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl hover:bg-slate-800 hover:border-indigo-500/50 transition-all flex items-center justify-between group"
                        >
                          <div className="flex-1 min-w-0 pr-4">
                            <p className="text-xs font-bold text-white truncate">{src.web?.title || 'External Report'}</p>
                            <p className="text-[10px] text-slate-500 truncate">{src.web?.uri}</p>
                          </div>
                          <ExternalLink size={14} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandResearch;
