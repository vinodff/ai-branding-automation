
import React, { useState, useRef, useEffect, useContext } from 'react';
import { Send, User, Sparkles, Loader2, Bot, AlertCircle } from 'lucide-react';
import { GeminiService } from '../services/gemini';
import { ChatMessage } from '../types';
import { BrandContextData } from '../App';

const BrandingAssistant: React.FC = () => {
  const { context } = useContext(BrandContextData);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hello! I'm your BrandCraft Strategic Assistant. I've analyzed your current brand DNA. How can I assist with your strategy today?",
      timestamp: new Date()
    }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input || loading) return;
    
    const userMessage: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const gemini = new GeminiService();
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      const response = await gemini.chat(history as any, input, context);
      
      const botMessage: ChatMessage = {
        role: 'model',
        text: response || "I'm sorry, I couldn't process that request.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Strategic Assistant</h2>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">
            {context ? `Context Aware: ${context.industry}` : 'Generic Advisor Mode'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-500 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          Neural Link: {context ? 'Established' : 'Generic'}
        </div>
      </div>

      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {!context && (
            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-200 text-xs">
                <AlertCircle size={14} />
                <span>Advisor is in generic mode. Define context for better insights.</span>
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  m.role === 'user' ? 'bg-indigo-600' : 'bg-slate-800 text-indigo-400 border border-slate-700'
                }`}>
                  {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-slate-800/50 text-slate-200 border border-slate-800 rounded-tl-none shadow-lg'
                }`}>
                  {m.text}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-4 max-w-[85%]">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400 border border-slate-700">
                  <Loader2 size={16} className="animate-spin" />
                </div>
                <div className="p-4 rounded-2xl bg-slate-800/50 text-slate-500 border border-slate-800 rounded-tl-none flex items-center gap-2">
                  <span className="text-xs font-bold animate-pulse">Computing strategic response...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="relative">
            <input 
              type="text"
              placeholder="Ask anything about your brand strategy..."
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-6 py-4 pr-16 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              disabled={!input || loading}
              className="absolute right-3 top-3 p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl transition-all shadow-lg"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-slate-500 text-center mt-3 uppercase font-bold tracking-[0.2em]">
            BrandCraft Intelligence Layer v4.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrandingAssistant;
