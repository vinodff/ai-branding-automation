
import React, { useState, useContext, useRef } from 'react';
import { Mic2, Play, Pause, Loader2, Sparkles, Volume2, Headphones } from 'lucide-react';
import { GeminiService } from '../services/gemini';
import { BrandContextData } from '../App';

const VocalIdentity: React.FC = () => {
  const { context } = useContext(BrandContextData);
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('Kore');
  const [loading, setLoading] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [playing, setPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const voices = [
    { id: 'Kore', label: 'Executive', desc: 'Secure, Professional' },
    { id: 'Puck', label: 'Disruptive', desc: 'Bold, Energetic' },
    { id: 'Charon', label: 'Legacy', desc: 'Deep, Reliable' },
    { id: 'Zephyr', label: 'Minimal', desc: 'Smooth, Airy' },
  ];

  const handleGenerate = async () => {
    if (!text) return;
    setLoading(true);
    setAudioBuffer(null);
    try {
      const gemini = new GeminiService();
      const buffer = await gemini.generateAudio(text, voice);
      setAudioBuffer(buffer);
      playBuffer(buffer);
    } catch (error) {
      console.error(error);
      alert("Vocal synthesis failed.");
    } finally {
      setLoading(false);
    }
  };

  const playBuffer = (buffer: AudioBuffer) => {
    if (sourceRef.current) sourceRef.current.stop();
    if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = audioCtxRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtxRef.current.destination);
    source.onended = () => setPlaying(false);
    source.start(0);
    sourceRef.current = source;
    setPlaying(true);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-brand font-black text-white mb-4 tracking-tighter">Vocal Identity</h2>
        <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">Establish how your brand speaks. High-fidelity neural synthesis for professional brand assets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center"><Mic2 size={24} /></div>
              <div>
                <h3 className="text-xl font-bold text-white">Vocal Studio</h3>
                <p className="text-[10px] text-slate-500 font-brand font-bold uppercase tracking-widest">Active Core: {context?.industry || 'Generic'}</p>
              </div>
            </div>

            <div className="space-y-8">
              <textarea 
                rows={4}
                placeholder="Enter your brand tagline or script to synthesize..."
                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white resize-none transition-all text-sm"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {voices.map(v => (
                  <button key={v.id} onClick={() => setVoice(v.id)} className={`p-4 rounded-2xl border text-left transition-all ${voice === v.id ? 'bg-indigo-600 border-indigo-400 shadow-lg' : 'bg-slate-950/50 border-white/5'}`}>
                    <p className={`text-xs font-brand font-black uppercase mb-1 ${voice === v.id ? 'text-white' : 'text-slate-400'}`}>{v.label}</p>
                    <p className={`text-[10px] ${voice === v.id ? 'text-indigo-100' : 'text-slate-600'}`}>{v.desc}</p>
                  </button>
                ))}
              </div>
              <button onClick={handleGenerate} disabled={loading || !text} className="w-full bg-white text-slate-950 hover:bg-slate-100 disabled:opacity-50 font-brand font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3">
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                {loading ? 'Synthesizing...' : 'Initialize Brand Voice'}
              </button>
            </div>
          </div>

          {audioBuffer && (
            <div className="bg-indigo-600 p-8 rounded-[2.5rem] flex items-center gap-8 shadow-2xl animate-in slide-in-from-bottom-4">
              <button onClick={() => playing ? sourceRef.current?.stop() : playBuffer(audioBuffer)} className="w-16 h-16 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-xl">
                {playing ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
              </button>
              <div className="flex-1">
                <p className="text-white font-brand font-black uppercase tracking-widest text-sm mb-4">Acoustic Preview: {voice}</p>
                <div className="h-12 w-full flex items-center gap-1 opacity-40">
                  {[...Array(24)].map((_, i) => <div key={i} className="w-1 flex-1 bg-white rounded-full h-1/2" />)}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div className="glass-card p-8 rounded-[2rem]">
            <h3 className="text-white font-bold mb-6 flex items-center gap-2"><Volume2 className="text-indigo-400" size={20} /> Sonic DNA</h3>
            <div className="space-y-4 text-sm text-slate-400 italic">
               <div className="p-4 bg-slate-950/50 rounded-2xl">"Target resonance is achieved through measured professional frequency."</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocalIdentity;
