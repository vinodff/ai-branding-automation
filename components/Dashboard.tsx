
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, TrendingUp, Zap, Target, ArrowRight, 
  Search, CalendarDays, MessageSquare, ShieldCheck, Cpu,
  Palette, Clapperboard, Mic2
} from 'lucide-react';

const StatCard = ({ label, value, icon, color, delay }: { label: string; value: string; icon: React.ReactNode; color: string, delay: string }) => (
  <div className={`glass-card p-8 rounded-[2rem] hover:border-white/20 transition-all group animate-in slide-in-from-bottom-4 duration-500 ${delay} hover:-translate-y-2`}>
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-white shadow-inner group-hover:scale-110 transition-transform duration-500`}>
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 24 }) : icon}
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
        <span className="text-[10px] font-brand font-bold text-slate-400 uppercase tracking-tighter">Live</span>
      </div>
    </div>
    <h3 className="text-slate-500 text-xs font-brand font-bold uppercase tracking-widest mb-2 group-hover:text-slate-400 transition-colors">{label}</h3>
    <p className="text-3xl font-black text-white group-hover:text-indigo-400 transition-colors tracking-tight">{value}</p>
  </div>
);

const ModuleCard = ({ title, desc, path, icon, isNew }: { title: string; desc: string; path: string; icon: React.ReactNode, isNew?: boolean }) => (
  <Link to={path} className="flex flex-col p-8 glass-card rounded-[2.5rem] hover:bg-white/5 transition-all hover:-translate-y-2 relative group overflow-hidden border border-white/5 active:scale-95">
    {isNew && (
      <div className="absolute top-0 right-0 px-4 py-1.5 bg-indigo-600 text-[10px] font-brand font-black uppercase text-white rounded-bl-2xl tracking-[0.2em] shadow-lg group-hover:bg-indigo-500 transition-colors">
        Alpha
      </div>
    )}
    <div className="w-14 h-14 bg-indigo-600/10 text-indigo-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] transition-all duration-500">
      {icon}
    </div>
    <h3 className="text-xl font-black text-white mb-3 tracking-tight group-hover:text-indigo-300 transition-colors">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1 opacity-80 group-hover:opacity-100 transition-opacity">{desc}</p>
    <div className="flex items-center text-indigo-400 text-sm font-bold uppercase tracking-widest">
      Initialize Lab <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
    </div>
    
    {/* Subtle sweep effect on hover */}
    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-indigo-500/0 to-indigo-500/0 group-hover:via-indigo-500/5 transition-all duration-700 pointer-events-none" />
  </Link>
);

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-20 pb-20">
      <section>
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6 hover:bg-indigo-500/15 transition-colors">
              <Cpu size={14} className="text-indigo-400" />
              <span className="text-[10px] font-brand font-bold text-indigo-300 uppercase tracking-widest">Neural Orchestrator V4.5</span>
            </div>
            <h2 className="text-5xl font-black text-white mb-4 tracking-tighter leading-none">Your Brand, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400">Synthesized.</span></h2>
            <p className="text-slate-400 text-xl font-medium max-w-2xl leading-relaxed">The command center for your brand's evolution. Monitor equity, synthesize assets, and command your narrative.</p>
          </div>
          <div className="flex gap-4 animate-in fade-in duration-1000">
             <div className="p-4 glass-card rounded-3xl flex flex-col items-center hover:scale-110 transition-transform">
                <ShieldCheck className="text-emerald-500 mb-2" size={20} />
                <span className="text-[10px] font-brand font-bold text-slate-500 uppercase">Trust Core</span>
             </div>
             <div className="p-4 glass-card rounded-3xl flex flex-col items-center hover:scale-110 transition-transform">
                <Zap className="text-amber-500 mb-2" size={20} />
                <span className="text-[10px] font-brand font-bold text-slate-500 uppercase">Neural Speed</span>
             </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard label="Predicted Equity" value="$3.82M" icon={<TrendingUp />} color="bg-indigo-500" delay="delay-0" />
          <StatCard label="Synthesis Count" value="1,492" icon={<Zap />} color="bg-rose-500" delay="delay-75" />
          <StatCard label="Brand Resonance" value="Optimal" icon={<Target />} color="bg-emerald-500" delay="delay-150" />
          <StatCard label="Market Fit" value="99.2%" icon={<Sparkles />} color="bg-fuchsia-500" delay="delay-300" />
        </div>
      </section>

      <section>
        <div className="flex items-center gap-6 mb-12">
          <h3 className="text-2xl font-black text-white tracking-tight">Advanced Directives</h3>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ModuleCard title="Industry Pulse" desc="Market scanning engine that monitors live disruptions and competitor shifts." path="/research" icon={<Search size={28} />} />
          <ModuleCard title="Identity Forge" desc="Synthesize context-aware brand names using next-gen linguistic models." path="/names" icon={<Target size={28} />} />
          <ModuleCard title="Visual Foundry" desc="Render high-fidelity logos and visual assets that adhere to your core brand DNA." path="/logos" icon={<Palette size={28} />} isNew />
          <ModuleCard title="Motion Studio" desc="Cinematic brand teasers rendered by the world's leading video engine." path="/video" icon={<Clapperboard size={28} />} isNew />
          <ModuleCard title="Strategic Roadmap" desc="A detailed tactical execution plan to launch your brand into the stratosphere." path="/roadmap" icon={<CalendarDays size={28} />} />
          <ModuleCard title="Vocal Identity" desc="Establish your brand's voice profile with high-quality neural speech synthesis." path="/voice" icon={<Mic2 size={28} />} isNew />
        </div>
      </section>
      
      <section className="relative rounded-[3rem] p-12 lg:p-20 overflow-hidden group shadow-2xl">
        <div className="absolute inset-0 bg-indigo-600/10 group-hover:bg-indigo-600/15 transition-colors duration-700" />
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full animate-pulse group-hover:bg-indigo-500/30 transition-colors duration-1000" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-in slide-in-from-left-8 duration-700">
            <h3 className="text-4xl font-black text-white mb-6 tracking-tighter">Strategic Assistant</h3>
            <p className="text-slate-400 text-xl mb-10 leading-relaxed max-w-lg">
              Collaborate with a neural branding expert trained on global marketing playbooks.
            </p>
            <Link to="/assistant" className="inline-flex items-center gap-4 bg-white text-slate-950 px-10 py-5 rounded-2xl font-brand font-black uppercase tracking-widest text-sm hover:bg-indigo-50 transition-all active:scale-95 shadow-2xl btn-glow">
              Start Session <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-md aspect-square glass-card rounded-[3rem] p-10 flex items-center justify-center animate-float relative group-hover:border-indigo-500/30 transition-all">
               <MessageSquare size={160} className="text-indigo-500/40 relative z-10 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-700" />
               <div className="absolute inset-0 bg-indigo-600/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-full" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
