
import React, { useState, useContext } from 'react';
import { FileText, Loader2, Copy, Check, Type, Globe, Users, AlertCircle, Sparkles } from 'lucide-react';
import { GeminiService } from '../services/gemini';
import { BrandContextData } from '../App';
import { Link } from 'react-router-dom';

const ContentGenerator: React.FC = () => {
  const { context } = useContext(BrandContextData);
  const [loading, setLoading] = useState<string | null>(null);
  const [content, setContent] = useState<{ [key: string]: string }>({});
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = async (type: 'tagline' | 'mission' | 'social') => {
    setLoading(type);
    try {
      const gemini = new GeminiService();
      const result = await gemini.generateContent(type, context);
      setContent(prev => ({ ...prev, [type]: result }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Content Stratosphere</h2>
        <p className="text-slate-400 max-w-xl mx-auto">Generate high-converting strategic content tailored to your Brand Context.</p>
      </div>

      {!context ? (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center">
          <AlertCircle className="mx-auto text-amber-500 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">Context Missing</h3>
          <p className="text-slate-400 mb-6">Define your target audience and brand tone to generate relevant content.</p>
          <Link to="/context" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all inline-block">
            Configure Context
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[
            { id: 'tagline', title: 'Tagline Synthesis', icon: <Type size={20} />, desc: 'Catchy high-impact phrases' },
            { id: 'mission', title: 'Mission Statement', icon: <Globe size={20} />, desc: 'Core purpose and vision' },
            { id: 'social', title: 'Social Campaign', icon: <Users size={20} />, desc: 'Channel-specific post ideas' },
          ].map((mod) => (
            <div key={mod.id} className="bg-slate-900 border border-slate-800 rounded-3xl flex flex-col h-full overflow-hidden transition-all hover:border-indigo-500/30">
              <div className="p-6 border-b border-slate-800 bg-slate-800/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                    {mod.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{mod.title}</h4>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{mod.desc}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                {content[mod.id] ? (
                  <div className="relative group flex-1">
                    <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap h-full max-h-[300px] overflow-y-auto pr-2">
                      {content[mod.id]}
                    </div>
                    <button 
                      onClick={() => copy(content[mod.id], mod.id)}
                      className="absolute top-0 right-0 p-2 text-slate-500 hover:text-white transition-colors"
                    >
                      {copied === mod.id ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-10 opacity-50">
                    <FileText className="text-slate-700 mb-2" size={32} />
                    <p className="text-xs text-slate-500 font-medium italic">Ready for generation</p>
                  </div>
                )}
                
                <button 
                  onClick={() => handleGenerate(mod.id as any)}
                  disabled={!!loading}
                  className="mt-6 w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm border border-slate-700"
                >
                  {/* Fix: Use Sparkles icon which is now imported */}
                  {loading === mod.id ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                  {loading === mod.id ? 'Generating...' : 'Craft Contextual Content'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentGenerator;
