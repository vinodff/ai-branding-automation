
import React, { useState, useContext } from 'react';
import { CalendarDays, Loader2, Sparkles, CheckCircle, ChevronRight, AlertCircle, ArrowRight } from 'lucide-react';
import { GeminiService } from '../services/gemini';
import { BrandContextData } from '../App';
import { RoadmapStep } from '../types';
import { Link } from 'react-router-dom';

const MarketingRoadmap: React.FC = () => {
  const { context } = useContext(BrandContextData);
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<RoadmapStep[]>([]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const gemini = new GeminiService();
      const result = await gemini.generateRoadmap(context);
      setSteps(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Identity': return 'text-indigo-400 bg-indigo-400/10 border-indigo-500/20';
      case 'Visuals': return 'text-rose-400 bg-rose-400/10 border-rose-500/20';
      case 'Launch': return 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-500/20';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Strategic Brand Roadmap</h2>
        <p className="text-slate-400 max-w-xl mx-auto">An actionable, AI-generated sequence of milestones to build and launch your brand in 7 days.</p>
      </div>

      {!context ? (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center">
          <AlertCircle className="mx-auto text-amber-500 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">Incomplete Profile</h3>
          <p className="text-slate-400 mb-6">A strategic roadmap requires a solid brand context. Please define your DNA first.</p>
          <Link to="/context" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all inline-block">
            Configure Context
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col items-center">
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full max-w-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
              {loading ? 'Synthesizing Roadmap...' : 'Generate 7-Day Strategy'}
            </button>
          </div>

          {steps.length > 0 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6">
              {steps.sort((a,b) => a.day - b.day).map((step, idx) => (
                <div key={idx} className="relative flex gap-6">
                  {idx !== steps.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-slate-800" />
                  )}
                  
                  <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-white font-bold shrink-0 z-10">
                    {step.day}
                  </div>
                  
                  <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/30 transition-all group">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{step.task}</h4>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getPhaseColor(step.phase)}`}>
                        {step.phase}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed italic">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}

              <div className="pt-6 flex justify-center">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 flex items-center gap-4 text-emerald-400">
                  <CheckCircle size={24} />
                  <div>
                    <p className="text-sm font-bold text-emerald-300">Phase 3 Complete</p>
                    <p className="text-xs">Your brand is ready for market deployment.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketingRoadmap;
