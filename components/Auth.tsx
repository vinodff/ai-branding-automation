
import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Sparkles, Loader2, AlertCircle, CheckCircle2, ChevronLeft, Github, Chrome } from 'lucide-react';
import { BrandCraftAPI } from '../services/api_client';

interface AuthProps {
  onSuccess: (token: string, name: string) => void;
}

type AuthMode = 'login' | 'register' | 'forgot' | 'reset';

const Auth: React.FC<AuthProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    resetToken: '',
    newPassword: ''
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (mode === 'forgot') {
      if (!emailRegex.test(formData.email)) return "Please provide a valid neural email node.";
      return null;
    }
    
    if (mode === 'reset') {
      if (!formData.resetToken.trim()) return "Verification token is required for sequence.";
      if (formData.newPassword.length < 8) return "New secret cipher must be at least 8 bits.";
      return null;
    }
    
    if (!emailRegex.test(formData.email)) return "Invalid email address format.";
    if (formData.password.length < 8) return "Secret cipher must be at least 8 characters.";
    if (mode === 'register' && !formData.full_name.trim()) return "Full operator identity is required.";
    
    return null;
  };

  const handleModeSwitch = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setSuccess(null);
    setShowPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await BrandCraftAPI.jsonLogin({
          email: formData.email,
          password: formData.password
        });
        
        let data;
        try {
          data = await res.json();
        } catch (jsonErr) {
          console.error("Failed to parse login response:", jsonErr);
          data = { detail: "Neural response was not in a valid data format." };
        }
        
        if (res.ok) {
          if (rememberMe) {
            localStorage.setItem('remembered_email', formData.email);
          } else {
            localStorage.removeItem('remembered_email');
          }
          onSuccess(data.access_token, data.full_name);
        } else {
          setError(data.detail || "Authentication sequence failed. Verify credentials.");
        }
      } 
      else if (mode === 'register') {
        const res = await BrandCraftAPI.register({
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name
        });
        
        if (res.ok) {
          setSuccess("Identity forged successfully. Initializing session...");
          setTimeout(() => handleModeSwitch('login'), 1500);
        } else {
          const data = await res.json().catch(() => ({ detail: "Synthesis aborted." }));
          setError(data.detail || "Synthesis aborted. Node already occupied.");
        }
      } 
      else if (mode === 'forgot') {
        const res = await BrandCraftAPI.forgotPassword(formData.email);
        const data = await res.json().catch(() => ({ message: "Connection error." }));
        
        if (res.ok) {
          setSuccess("Recovery signal broadcasted. Syncing...");
          if (data.dev_token) {
            setFormData(prev => ({ ...prev, resetToken: data.dev_token }));
            setTimeout(() => handleModeSwitch('reset'), 1500);
          }
        } else {
          setError("Unable to broadcast recovery signal.");
        }
      } 
      else if (mode === 'reset') {
        const res = await BrandCraftAPI.resetPassword(formData.resetToken, formData.newPassword);
        const data = await res.json().catch(() => ({ detail: "Token sync error." }));
        if (res.ok) {
          setSuccess("Cipher recalibrated. Identity restored.");
          setTimeout(() => handleModeSwitch('login'), 2000);
        } else {
          setError(data.detail || "Invalid security token.");
        }
      }
    } catch (err) {
      console.error("Auth Nexus Error:", err);
      setError("Network nexus unstable. Identity session failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617] relative">
      <div className="neural-bg absolute inset-0 opacity-30 pointer-events-none"></div>
      
      <div className="glass-card w-full max-w-md p-10 rounded-[3rem] relative overflow-hidden animate-in fade-in zoom-in duration-700 shadow-[0_0_80px_rgba(79,70,229,0.15)] border border-white/10 z-10">
        <div className="absolute -top-10 -right-10 p-10 opacity-5 rotate-12 pointer-events-none">
          <Sparkles size={220} className="text-indigo-400" />
        </div>
        
        <div className="text-center mb-10 relative">
          {mode !== 'login' && (
            <button 
              onClick={() => handleModeSwitch('login')}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-indigo-400 transition-colors"
              aria-label="Back to login"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <div className="w-20 h-20 bg-indigo-600/20 text-indigo-400 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-indigo-500/20 shadow-inner">
            <Lock className="animate-pulse" size={32} />
          </div>
          <h2 className="text-3xl font-brand font-black text-white tracking-tighter mb-2">
            {mode === 'login' ? 'Neural Link' : 
             mode === 'register' ? 'Forge DNA' : 
             mode === 'forgot' ? 'Recovery' : 'Recalibrate'}
          </h2>
          <p className="text-slate-400 text-sm font-medium opacity-80">
            {mode === 'login' && 'Establish identity to command the orchestrator.'}
            {mode === 'register' && 'Forge your unique branding genetic sequence.'}
            {mode === 'forgot' && 'Identify your node for restoration.'}
            {mode === 'reset' && 'Provide your security link to reset ciphers.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-sm animate-in slide-in-from-top-4">
            <AlertCircle size={18} className="shrink-0" />
            <p className="font-bold">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-400 text-sm animate-in slide-in-from-top-4">
            <CheckCircle2 size={18} className="shrink-0" />
            <p className="font-bold">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-1.5 group">
              <label className="text-[10px] font-brand font-black text-slate-500 uppercase tracking-widest ml-3 group-focus-within:text-indigo-400 transition-colors">Identity Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-950/60 border border-white/5 rounded-2xl px-12 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-700 shadow-inner"
                  placeholder="E.g., Neural Architect"
                  value={formData.full_name}
                  onChange={e => setFormData({...formData, full_name: e.target.value})}
                />
              </div>
            </div>
          )}

          {mode !== 'reset' && (
            <div className="space-y-1.5 group">
              <label className="text-[10px] font-brand font-black text-slate-500 uppercase tracking-widest ml-3 group-focus-within:text-indigo-400 transition-colors">Email Node</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  required
                  className="w-full bg-slate-950/60 border border-white/5 rounded-2xl px-12 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-700 shadow-inner"
                  placeholder="nexus@brandcraft.ai"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
          )}

          {mode === 'reset' && (
             <div className="space-y-1.5 group">
               <label className="text-[10px] font-brand font-black text-slate-500 uppercase tracking-widest ml-3 group-focus-within:text-indigo-400 transition-colors">Neural Token</label>
               <div className="relative">
                 <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                 <input 
                   type="text" 
                   required
                   className="w-full bg-slate-950/60 border border-white/5 rounded-2xl px-12 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-700 shadow-inner"
                   placeholder="BC-XXXX-XXXX"
                   value={formData.resetToken}
                   onChange={e => setFormData({...formData, resetToken: e.target.value})}
                 />
               </div>
             </div>
          )}

          {(mode === 'login' || mode === 'register' || mode === 'reset') && (
            <div className="space-y-1.5 group">
              <div className="flex justify-between items-center px-3">
                <label className="text-[10px] font-brand font-black text-slate-500 uppercase tracking-widest group-focus-within:text-indigo-400">Secret Cipher</label>
                {mode === 'login' && (
                  <button 
                    type="button" 
                    onClick={() => handleModeSwitch('forgot')}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-widest"
                  >
                    Lost Link?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  className="w-full bg-slate-950/60 border border-white/5 rounded-2xl px-12 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-700 shadow-inner"
                  placeholder="••••••••"
                  value={mode === 'reset' ? formData.newPassword : formData.password}
                  onChange={e => {
                    const val = e.target.value;
                    if (mode === 'reset') setFormData({...formData, newPassword: val});
                    else setFormData({...formData, password: val});
                  }}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="flex items-center px-2 py-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="sr-only"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all ${rememberMe ? 'bg-indigo-600 border-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'border-slate-800 bg-slate-950 group-hover:border-slate-600'}`}>
                  {rememberMe && <CheckCircle2 size={14} className="text-white" />}
                </div>
                <span className="text-xs font-bold text-slate-400 group-hover:text-slate-200 transition-colors">Persist identity</span>
              </label>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-slate-950 font-brand font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-indigo-50 transition-all active:scale-[0.98] mt-4 btn-glow disabled:opacity-50 shadow-xl"
          >
            {loading ? <Loader2 className="animate-spin" size={22} /> : (
              <>
                <Sparkles size={20} className="text-indigo-600" /> 
                {mode === 'login' ? 'Establish Session' : 
                 mode === 'register' ? 'Forge Identity' : 
                 mode === 'forgot' ? 'Sync Recovery' : 'Restore Identity'}
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-slate-400 text-xs font-bold">
            {mode === 'login' ? "New to the nexus?" : "Already part of the network?"}
            <button 
              onClick={() => {
                if (mode === 'login') handleModeSwitch('register');
                else handleModeSwitch('login');
              }}
              className="ml-2 text-indigo-400 hover:text-indigo-300 transition-colors border-b border-indigo-500/0 hover:border-indigo-400/100"
            >
              {mode === 'login' ? 'Forge DNA' : 'Back to Link'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
