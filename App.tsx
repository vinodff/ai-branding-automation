
import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Tag, Palette, FileText, BarChart3, MessageSquare, 
  Sparkles, Menu, Settings as SettingsIcon, Search, CalendarDays, 
  Clapperboard, Mic2, X, Zap, Key, ExternalLink, LogOut, Megaphone
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import BrandContextSetup from './components/BrandContextSetup';
import BrandNameGenerator from './components/BrandNameGenerator';
import LogoGenerator from './components/LogoGenerator';
import PromotionForge from './components/PromotionForge';
import ContentGenerator from './components/ContentGenerator';
import SentimentAnalyzer from './components/SentimentAnalyzer';
import BrandingAssistant from './components/BrandingAssistant';
import BrandResearch from './components/BrandResearch';
import MarketingRoadmap from './components/MarketingRoadmap';
import NeuralMotion from './components/NeuralMotion';
import VocalIdentity from './components/VocalIdentity';
import Auth from './components/Auth';
import { AppRoute, BrandContext } from './types';

interface BrandContextType {
  context: BrandContext | null;
  setContext: (ctx: BrandContext) => void;
  user: { name: string; token: string } | null;
  logout: () => void;
}

export const BrandContextData = createContext<BrandContextType>({
  context: null,
  setContext: () => {},
  user: null,
  logout: () => {}
});

const Sidebar = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => {
  const location = useLocation();
  const { context, logout } = useContext(BrandContextData);
  
  const navGroups = [
    {
      title: 'Strategy',
      items: [
        { id: AppRoute.DASHBOARD, label: 'Orchestrator', icon: <LayoutDashboard size={18} />, path: '/' },
        { id: AppRoute.CONTEXT, label: 'Brand DNA', icon: <SettingsIcon size={18} />, path: '/context' },
        { id: AppRoute.RESEARCH, label: 'Intelligence', icon: <Search size={18} />, path: '/research' },
        { id: AppRoute.ROADMAP, label: 'Roadmap', icon: <CalendarDays size={18} />, path: '/roadmap' },
      ]
    },
    {
      title: 'Synthesis',
      items: [
        { id: AppRoute.NAME_GEN, label: 'Identity', icon: <Tag size={18} />, path: '/names' },
        { id: AppRoute.LOGO_GEN, label: 'Visual Forge', icon: <Palette size={18} />, path: '/logos' },
        { id: AppRoute.PROMOTION, label: 'Promotion Forge', icon: <Megaphone size={18} />, path: '/promotion' },
        { id: AppRoute.CONTENT_GEN, label: 'Content Lab', icon: <FileText size={18} />, path: '/content' },
      ]
    },
    {
      title: 'Media Lab',
      items: [
        { id: 'video-gen', label: 'Neural Motion', icon: <Clapperboard size={18} />, path: '/video' },
        { id: 'voice-gen', label: 'Vocal Identity', icon: <Mic2 size={18} />, path: '/voice' },
      ]
    }
  ];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-xl transition-opacity duration-500" onClick={toggle} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#020617]/80 backdrop-blur-3xl border-r border-white/5 transform transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          <div className="p-8 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-indigo-600 p-2 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Sparkles className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-brand font-black tracking-tighter text-white group-hover:tracking-normal transition-all duration-300">BRANDCRAFT</h1>
            </Link>
          </div>
          
          <nav className="flex-1 px-6 space-y-8 overflow-y-auto py-4">
            {navGroups.map((group) => (
              <div key={group.title}>
                <h3 className="px-4 text-[10px] font-brand font-black text-slate-500 uppercase tracking-[0.3em] mb-4 opacity-50">{group.title}</h3>
                <div className="space-y-1.5">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.path || (item.path === '/' && (location.pathname === '' || location.pathname === '/dashboard'));
                    return (
                      <Link
                        key={item.id}
                        to={item.path}
                        onClick={() => isOpen && toggle()}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all group active:scale-95 ${isActive ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-600/30 shadow-[0_0_15px_rgba(79,70,229,0.1)]' : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-indigo-400 group-hover:scale-110'} transition-all duration-300`}>{item.icon}</span>
                          <span className="font-bold text-sm tracking-tight">{item.label}</span>
                        </div>
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
          
          <div className="p-6 mt-auto space-y-4">
            <div className="p-4 glass-card rounded-2xl border border-white/5 hover:scale-[1.02] transition-transform">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-[12px] font-brand font-bold shadow-lg">
                  {context?.industry ? context.industry.substring(0, 1).toUpperCase() : '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-100 truncate">{context?.industry || 'New Identity'}</p>
                  <p className="text-[10px] text-indigo-400 font-brand font-bold uppercase tracking-widest">{context?.tone || 'Pending DNA'}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all text-xs font-bold uppercase tracking-widest"
            >
              <LogOut size={14} /> Log Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const Header = ({ toggle }: { toggle: () => void }) => {
  const { user } = useContext(BrandContextData);
  return (
    <header className="h-20 border-b border-white/5 bg-[#020617]/40 backdrop-blur-3xl flex items-center justify-between px-8 sticky top-0 z-40 transition-all duration-300">
      <button onClick={toggle} className="p-2 text-slate-400 lg:hidden hover:text-white transition-colors active:scale-90"><Menu size={24} /></button>
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-end mr-4">
          <span className="text-[10px] font-brand font-bold text-slate-500 uppercase tracking-widest">Operator</span>
          <span className="text-xs font-black text-indigo-400">{user?.name.toUpperCase() || 'ANONYMOUS'}</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-2 hover:bg-white/10 transition-colors cursor-default">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-brand font-bold text-slate-500 uppercase tracking-widest">Neural Status</span>
            <span className="text-xs font-black text-indigo-400">ACTIVE ALPHA</span>
          </div>
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_12px_rgba(99,102,241,1)]" />
        </div>
      </div>
    </header>
  );
};

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState<{name: string, token: string} | null>(() => {
    const savedToken = localStorage.getItem('brand_token');
    const savedName = localStorage.getItem('brand_name');
    return savedToken ? { token: savedToken, name: savedName || 'User' } : null;
  });

  const [context, setContextState] = useState<BrandContext | null>(() => {
    const saved = localStorage.getItem('brand_craft_context');
    return saved ? JSON.parse(saved) : null;
  });

  const setContext = (ctx: BrandContext) => {
    setContextState(ctx);
    localStorage.setItem('brand_craft_context', JSON.stringify(ctx));
  };

  const handleAuthSuccess = (token: string, name: string) => {
    setUser({ token, name });
    localStorage.setItem('brand_token', token);
    localStorage.setItem('brand_name', name);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('brand_token');
    localStorage.removeItem('brand_name');
  };

  if (!user) {
    return <Auth onSuccess={handleAuthSuccess} />;
  }

  return (
    <BrandContextData.Provider value={{ context, setContext, user, logout }}>
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 flex flex-col min-w-0">
          <Header toggle={() => setSidebarOpen(true)} />
          <main className="flex-1 p-8 lg:p-12 overflow-x-hidden">
            <div key={location.pathname} className="page-transition min-h-full">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/context" element={<BrandContextSetup />} />
                <Route path="/research" element={<BrandResearch />} />
                <Route path="/names" element={<BrandNameGenerator />} />
                <Route path="/logos" element={<LogoGenerator />} />
                <Route path="/promotion" element={<PromotionForge />} />
                <Route path="/content" element={<ContentGenerator />} />
                <Route path="/roadmap" element={<MarketingRoadmap />} />
                <Route path="/video" element={<NeuralMotion />} />
                <Route path="/voice" element={<VocalIdentity />} />
                <Route path="/sentiment" element={<SentimentAnalyzer />} />
                <Route path="/assistant" element={<BrandingAssistant />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </BrandContextData.Provider>
  );
};

const AppWrapper = () => (
  <HashRouter>
    <App />
  </HashRouter>
);

export default AppWrapper;
