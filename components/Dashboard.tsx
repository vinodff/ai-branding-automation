
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, Zap, Target, ArrowRight } from 'lucide-react';

const StatCard = ({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        {/* Fix: Ensure the icon is a valid React element before cloning and cast to React.ReactElement<any> to allow the className prop */}
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: color.replace('bg-', 'text-') }) : icon}
      </div>
      <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Active</span>
    </div>
    <h3 className="text-slate-400 text-sm font-medium mb-1">{label}</h3>
    <p className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">{value}</p>
  </div>
);

const FeatureCard = ({ title, desc, path, icon }: { title: string; desc: string; path: string; icon: React.ReactNode }) => (
  <Link to={path} className="flex flex-col p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:bg-slate-800/50 transition-all hover:-translate-y-1">
    <div className="text-indigo-500 mb-4">{icon}</div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm mb-6 flex-1">{desc}</p>
    <div className="flex items-center text-indigo-400 text-sm font-semibold">
      Try now <ArrowRight size={16} className="ml-2" />
    </div>
  </Link>
);

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back, Strategist.</h2>
          <p className="text-slate-400">Everything you need to orchestrate a world-class brand presence.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Total Projects" value="12" icon={<Target />} color="bg-indigo-500" />
          <StatCard label="AI Generations" value="1,248" icon={<Sparkles />} color="bg-rose-500" />
          <StatCard label="Avg. Brand Sentiment" value="94%" icon={<TrendingUp />} color="bg-emerald-500" />
          <StatCard label="Processing Speed" value="0.8s" icon={<Zap />} color="bg-amber-500" />
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold text-white mb-6">Core Branding Modules</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            title="Name Synthesis" 
            desc="Use generative AI to brainstorm hundreds of unique, high-potential brand names tailored to your industry."
            path="/names"
            icon={<Target size={32} />}
          />
          <FeatureCard 
            title="Visual Identity" 
            desc="Generate stunning logo concepts and color palettes using our advanced vision models."
            path="/logos"
            icon={<Zap size={32} />}
          />
          <FeatureCard 
            title="Strategic Content" 
            desc="Craft taglines, mission statements, and social campaigns that resonate with your target audience."
            path="/content"
            icon={<Sparkles size={32} />}
          />
        </div>
      </section>
      
      <section className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">Ready for a brand audit?</h3>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            Our Sentiment AI can analyze thousands of reviews and social mentions to give you an objective look at how your brand is perceived globally.
          </p>
          <Link to="/sentiment" className="inline-flex items-center bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-slate-100 transition-colors shadow-xl">
            Audit your brand <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <TrendingUp size={400} />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
