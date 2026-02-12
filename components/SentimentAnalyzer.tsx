
import React, { useState } from 'react';
import { BarChart3, Loader2, TrendingUp, AlertCircle, Smile, Meh, Frown } from 'lucide-react';
import { GeminiService } from '../services/gemini';
import { SentimentResult } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const SentimentAnalyzer: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SentimentResult | null>(null);

  const handleAnalyze = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const gemini = new GeminiService();
      const analysis = await gemini.analyzeSentiment(text);
      setResult(analysis);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Smile size={48} className="text-emerald-500" />;
      case 'negative': return <Frown size={48} className="text-rose-500" />;
      default: return <Meh size={48} className="text-amber-500" />;
    }
  };

  const chartData = result ? [
    { name: 'Trust', score: result.breakdown.trust },
    { name: 'Excitement', score: result.breakdown.excitement },
    { name: 'Reliability', score: result.breakdown.reliability },
  ] : [];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Sentiment Intelligence</h2>
        <p className="text-slate-400 max-w-xl mx-auto">Paste reviews, social feedback, or customer comments to perform an AI-driven emotional audit of your brand's perception.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl mb-10">
        <label className="block text-sm font-medium text-slate-400 mb-4">Input Data for Analysis</label>
        <textarea 
          rows={6}
          placeholder="Paste customer reviews, brand mentions, or feedback here..."
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white resize-none mb-6 font-mono text-sm"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button 
          onClick={handleAnalyze}
          disabled={loading || !text}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          {loading ? <Loader2 className="animate-spin" /> : <BarChart3 size={20} />}
          {loading ? 'Analyzing Neural Patterns...' : 'Run Audit'}
        </button>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
            <div className="flex items-center gap-6 mb-8">
              {getSentimentIcon(result.sentiment)}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Overall Sentiment</h4>
                <p className="text-3xl font-black text-white capitalize">{result.sentiment}</p>
              </div>
              <div className="ml-auto text-right">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Score</h4>
                <p className="text-3xl font-black text-indigo-400">{result.score}%</p>
              </div>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip 
                    cursor={{ fill: '#1e293b' }}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                  />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#6366f1' : index === 1 ? '#f43f5e' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="text-indigo-400" /> Strategic Summary
            </h4>
            <p className="text-slate-400 leading-relaxed mb-6">
              {result.summary}
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                <AlertCircle size={20} className="text-indigo-400 mt-0.5 shrink-0" />
                <p className="text-sm text-slate-300">
                  <strong className="text-white block mb-1">Insight</strong>
                  Your brand's <span className="text-indigo-400 font-bold">{chartData.sort((a,b) => b.score - a.score)[0].name}</span> is currently your strongest competitive advantage based on these samples.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentimentAnalyzer;
