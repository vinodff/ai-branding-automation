
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, Zap, Target, ArrowRight, Search, CalendarDays, MessageSquare } from 'lucide-react';

const StatCard = ({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: color.replace('bg-', 'text-') }) : icon}
      </div>
      <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Active</span>
    </div>
    <h3 className="text-slate-400 text-sm font-medium mb-1">{label}</h3>
    <p className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">{value}</p>
  </div>
);

const FeatureCard = ({ title, desc, path, icon, isNew }: { title: string; desc: string; path: string; icon: React.ReactNode, isNew?: boolean }) => (
  <Link to={path} className="flex flex-col p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:bg-slate-800/50 transition-all hover:-translate-y-1 relative group overflow-hidden">
    {isNew && (
      <div className="absolute top-0 right-0 px-3 py-1 bg-indigo-600 text-[10px] font-black uppercase text-white rounded-bl-xl tracking-widest">
        New
      </div>
    )}
    <div className="text-indigo-500 mb-4 group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm mb-6 flex-1 line-clamp-3">{desc}</p>
    <div className="flex items-center text-indigo-400 text-sm font-semibold">
      Explore Module <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
    </div>
  </Link>
);

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <section>
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Brand Orchestrator</h2>
            <p className="text-slate-400 text-lg">Centralize your brand strategy through advanced neural synthesis.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 border border-slate-800 px-4 py-2 rounded-full uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            V4.2.0 Stable
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Brand Equity" value="$2.4M" icon={<TrendingUp />} color="bg-indigo-500" />
          <StatCard label="Synthesized Assets" value="284" icon={<Zap />} color="bg-rose-500" />
          <StatCard label="Global Awareness" value="High" icon={<Target />} color="bg-emerald-500" />
          <StatCard label="Market Alignment" value="98%" icon={<Sparkles />} color="bg-amber-500" />
        </div>
      </section>

      <section>
        <div className="flex items-center gap-4 mb-8">
          <h3 className="text-2xl font-bold text-white">Strategy & Research</h3>
          <div className="h-px flex-1 bg-slate-800" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard 
            title="Industry Intelligence" 
            desc="Real-time market scanning for trends, news, and competitor movements using search grounding."
            path="/research"
            icon={<Search size={32} />}
            isNew
          />
          <FeatureCard 
            title="Launch Roadmap" 
            desc="Step-by-step 7-day execution guide to take your brand from concept to live deployment."
            path="/roadmap"
            icon={<CalendarDays size={32} />}
            isNew
          />
        </div>
      </section>

      <section>
        <div className="flex items-center gap-4 mb-8">
          <h3 className="text-2xl font-bold text-white">Identity Modules</h3>
          <div className="h-px flex-1 bg-slate-800" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            title="Name Synthesis" 
            desc="Context-aware brainstorming for high-potential, memorable brand names."
            path="/names"
            icon={<Target size={32} />}
          />
          <FeatureCard 
            title="Visual Identity" 
            desc="Advanced logo design generation and visual asset rendering."
            path="/logos"
            icon={<Zap size={32} />}
          />
          <FeatureCard 
            title="Strategic Content" 
            desc="Copywriting suite for taglines, mission statements, and social presence."
            path="/content"
            icon={<Sparkles size={32} />}
          />
        </div>
      </section>
      
      <section className="bg-indigo-600 rounded-3xl p-10 flex flex-col items-center text-center relative overflow-hidden group">
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-3xl font-black text-white mb-4">Neural Branding Assistant</h3>
          <p className="text-indigo-100 text-lg mb-8 opacity-90 leading-relaxed">
            Need a second opinion on your positioning? Our strategic assistant is trained on top-tier marketing playbooks.
          </p>
          <Link to="/assistant" className="bg-white text-indigo-600 px-10 py-4 rounded-full font-black uppercase tracking-widest text-sm hover:bg-slate-100 transition-all shadow-xl hover:shadow-2xl">
            Start Consultation
          </Link>
        </div>
        {/* Fixed: MessageSquare added to imports on line 3 */}
        <MessageSquare size={300} className="absolute -right-20 -bottom-20 text-indigo-500/30 rotate-12 group-hover:rotate-6 transition-transform duration-700 pointer-events-none" />
      </section>
    </div>
  );
};

export default Dashboard;
