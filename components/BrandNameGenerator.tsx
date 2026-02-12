
import React, { useState, useContext } from 'react';
import { Tag, Loader2, ClipboardCheck, Sparkles, AlertCircle } from 'lucide-react';
import { GeminiService } from '../services/gemini';
import { GeneratedBrandName } from '../types';
import { BrandContextData } from '../App';
import { Link } from 'react-router-dom';

const BrandNameGenerator: React.FC = () => {
  const { context } = useContext(BrandContextData);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GeneratedBrandName[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const gemini = new GeminiService();
      const names = await gemini.generateBrandNames(context);
      setResults(names);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Brand Name Synthesis</h2>
        <p className="text-slate-400 max-w-xl mx-auto">Generate names perfectly aligned with your established Brand DNA.</p>
      </div>

      {!context ? (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center">
          <AlertCircle className="mx-auto text-amber-500 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">Context Missing</h3>
          <p className="text-slate-400 mb-6">You need to set up your brand context before generating names.</p>
          <Link to="/context" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all inline-block">
            Configure Context
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl mb-10">
            <div className="flex items-center justify-between mb-8 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                  <Tag size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Active Context</p>
                  <p className="text-sm text-slate-200 font-medium">{context.industry} • {context.tone}</p>
                </div>
              </div>
              <Link to="/context" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider">
                Change
              </Link>
            </div>
            
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
              {loading ? 'Synthesizing...' : 'Generate Context-Aware Names'}
            </button>
          </div>

          {results.length > 0 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-bold text-white mb-6">Generated Identities</h3>
              <div className="grid grid-cols-1 gap-4">
                {results.map((res, i) => (
                  <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-bold text-indigo-400">{res.name}</h4>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold tracking-widest uppercase">ID {1000 + i}</span>
                      </div>
                      <p className="text-slate-400 text-sm italic">"{res.meaning}"</p>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(res.name)}
                      className="p-3 text-slate-500 hover:text-white transition-colors"
                    >
                      {copied === res.name ? <ClipboardCheck className="text-green-500" /> : <Tag size={20} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BrandNameGenerator;
