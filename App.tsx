
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Tag, 
  Palette, 
  FileText, 
  BarChart3, 
  MessageSquare,
  Sparkles,
  Menu,
  Settings as SettingsIcon,
  Search,
  CalendarDays
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import BrandContextSetup from './components/BrandContextSetup';
import BrandNameGenerator from './components/BrandNameGenerator';
import LogoGenerator from './components/LogoGenerator';
import ContentGenerator from './components/ContentGenerator';
import SentimentAnalyzer from './components/SentimentAnalyzer';
import BrandingAssistant from './components/BrandingAssistant';
import BrandResearch from './components/BrandResearch';
import MarketingRoadmap from './components/MarketingRoadmap';
import { AppRoute, BrandContext } from './types';

interface BrandContextType {
  context: BrandContext | null;
  setContext: (ctx: BrandContext) => void;
}

export const BrandContextData = createContext<BrandContextType>({
  context: null,
  setContext: () => {},
});

const Sidebar = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => {
  const location = useLocation();
  const { context } = useContext(BrandContextData);
  
  const navItems = [
    { id: AppRoute.DASHBOARD, label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { id: AppRoute.CONTEXT, label: 'Brand Context', icon: <SettingsIcon size={20} />, path: '/context' },
    { id: AppRoute.RESEARCH, label: 'Industry Intelligence', icon: <Search size={20} />, path: '/research' },
    { id: AppRoute.NAME_GEN, label: 'Name Generator', icon: <Tag size={20} />, path: '/names' },
    { id: AppRoute.LOGO_GEN, label: 'Logo Designer', icon: <Palette size={20} />, path: '/logos' },
    { id: AppRoute.CONTENT_GEN, label: 'Content Creator', icon: <FileText size={20} />, path: '/content' },
    { id: AppRoute.ROADMAP, label: 'Brand Roadmap', icon: <CalendarDays size={20} />, path: '/roadmap' },
    { id: AppRoute.SENTIMENT, label: 'Sentiment AI', icon: <BarChart3 size={20} />, path: '/sentiment' },
    { id: AppRoute.ASSISTANT, label: 'Branding Assistant', icon: <MessageSquare size={20} />, path: '/assistant' },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={toggle}
        />
      )}
      
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-slate-900 border-r border-slate-800
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Sparkles className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">BrandCraft</h1>
          </div>
          
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '');
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => isOpen && toggle()}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}
                  `}
                >
                  {item.icon}
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-slate-800">
            <div className="flex flex-col gap-2 p-3 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-[10px] font-bold">
                  {context?.industry ? context.industry.substring(0, 2).toUpperCase() : 'BC'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-200 truncate">
                    {context?.industry || 'No Project'}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    {context?.tone ? `${context.tone} tone` : 'Configure context'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const Header = ({ toggle }: { toggle: () => void }) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
      <button 
        onClick={toggle}
        className="p-2 text-slate-400 hover:text-white lg:hidden"
      >
        <Menu size={24} />
      </button>
      <div className="flex-1" />
      <div className="hidden sm:flex items-center bg-slate-800 rounded-full px-3 py-1 border border-slate-700">
        <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">System Ready</span>
      </div>
    </header>
  );
};

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [context, setContextState] = useState<BrandContext | null>(() => {
    const saved = localStorage.getItem('brand_craft_context');
    return saved ? JSON.parse(saved) : null;
  });

  const setContext = (ctx: BrandContext) => {
    setContextState(ctx);
    localStorage.setItem('brand_craft_context', JSON.stringify(ctx));
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <BrandContextData.Provider value={{ context, setContext }}>
      <HashRouter>
        <div className="flex min-h-screen bg-slate-950 text-slate-200">
          <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
          
          <div className="flex-1 flex flex-col min-w-0">
            <Header toggle={toggleSidebar} />
            
            <main className="flex-1 p-6 lg:p-10 overflow-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/context" element={<BrandContextSetup />} />
                <Route path="/research" element={<BrandResearch />} />
                <Route path="/names" element={<BrandNameGenerator />} />
                <Route path="/logos" element={<LogoGenerator />} />
                <Route path="/content" element={<ContentGenerator />} />
                <Route path="/roadmap" element={<MarketingRoadmap />} />
                <Route path="/sentiment" element={<SentimentAnalyzer />} />
                <Route path="/assistant" element={<BrandingAssistant />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </div>
      </HashRouter>
    </BrandContextData.Provider>
  );
};

export default App;
