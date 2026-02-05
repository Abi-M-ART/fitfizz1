
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import BmiCalculator from './components/BmiCalculator';
import Chatbot from './components/Chatbot';
import ReportCheck from './components/ReportCheck';
import FeedbackHub from './components/FeedbackHub';
import { User as UserType, View } from './types';
import { User, Calculator, MessageSquare, FileSearch, Activity, Lock, ChevronRight, Play, AlertCircle, CheckCircle2, Bot, Mail } from 'lucide-react';
import { authService } from './services/authService';

const FullGradientBg = () => (
  <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#00ffd5] via-[#2cc3ff] to-[#3033ff] pointer-events-none"></div>
);

export const FitFizzLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl', className?: string }> = ({ size = 'md', className = '' }) => {
  const dimensions = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };

  return (
    <div className={`${dimensions[size]} relative flex items-center justify-center bg-transparent ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,255,213,0.5)]">
        <defs>
          <linearGradient id="cloverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f7fee7" />
            <stop offset="50%" stopColor="#00ffd5" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <g fill="url(#cloverGrad)" filter="url(#glow)">
          <circle cx="50" cy="35" r="18" />
          <circle cx="65" cy="50" r="18" />
          <circle cx="50" cy="65" r="18" />
          <circle cx="35" cy="50" r="18" />
          <rect x="46" y="46" width="8" height="8" rx="2" fill="#ffffff" />
        </g>
        <path 
          d="M50,75 Q50,90 35,95" 
          fill="none" 
          stroke="#00ffd5" 
          strokeWidth="5" 
          strokeLinecap="round" 
        />
      </svg>
    </div>
  );
};

export const FitFizzText: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl', className?: string }> = ({ size = 'md', className = '' }) => {
  const textSizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-5xl',
    xl: 'text-7xl'
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`font-black tracking-tighter ${textSizes[size]} transition-all duration-300 drop-shadow-md`}>
        <span className="text-white">fit</span>
        <span className="text-[#00ffd5]">fizz</span>
      </div>
    </div>
  );
};

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#00ffd5] via-[#2cc3ff] to-[#3033ff]">
      <div className="animate-pulse flex flex-col items-center">
        <FitFizzLogo size="xl" className="mb-6" />
        <FitFizzText size="xl" />
      </div>
      <p className="mt-8 text-white/60 font-black uppercase tracking-[0.5em] text-xs">Pure Health 2026</p>
    </div>
  );
};

const LoginPage: React.FC<{ onLoginSuccess: (user: UserType) => void, onSwitch: () => void }> = ({ onLoginSuccess, onSwitch }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isFormValid = useMemo(() => {
    return username.length >= 3 && password.length >= 6;
  }, [username, password]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    const result = authService.login(username, password);
    if (result.success && result.user) {
      onLoginSuccess(result.user);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#00ffd5] via-[#2cc3ff] to-[#3033ff]">
      <div className="bg-white/10 backdrop-blur-md rounded-[3rem] p-12 w-full max-w-sm flex flex-col items-center shadow-2xl border border-white/20">
        <FitFizzLogo size="md" className="mb-4" />
        <FitFizzText size="md" className="mb-8" />
        
        <form onSubmit={handleLogin} className="w-full space-y-5">
          {error && (
            <div className="text-rose-200 bg-rose-500/20 border border-rose-500/30 p-3 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-white/70 text-[10px] font-black uppercase ml-1 tracking-widest">
              <span>username</span>
              <User className={`w-3 h-3 ${username.length >= 3 ? 'text-[#00ffd5]' : 'opacity-40'}`} />
            </div>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full bg-white/20 border ${username.length > 0 && username.length < 3 ? 'border-rose-500' : 'border-white/10'} text-white px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#00ffd5] transition-all placeholder:text-white/30`}
              placeholder="Your handle"
            />
            {username.length > 0 && username.length < 3 && (
              <p className="text-[10px] text-rose-300 font-bold ml-1">Username too short (min 3)</p>
            )}
          </div>
          <div className="space-y-1">
             <div className="flex justify-between items-center text-white/70 text-[10px] font-black uppercase ml-1 tracking-widest">
              <span>password</span>
              <Lock className={`w-3 h-3 ${password.length >= 6 ? 'text-[#00ffd5]' : 'opacity-40'}`} />
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-white/20 border ${password.length > 0 && password.length < 6 ? 'border-rose-500' : 'border-white/10'} text-white px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#00ffd5] transition-all placeholder:text-white/30`}
              placeholder="••••••••"
            />
            {password.length > 0 && password.length < 6 && (
              <p className="text-[10px] text-rose-300 font-bold ml-1">Password too short (min 6)</p>
            )}
          </div>
          
          <button 
            type="submit"
            disabled={!isFormValid}
            className={`w-full ${isFormValid ? 'bg-[#00ffd5] text-black' : 'bg-white/10 text-white/40 cursor-not-allowed'} font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-all hover:brightness-110 uppercase tracking-tighter text-sm`}
          >
            Enter Portal
          </button>
        </form>

        <div className="text-center mt-8 space-y-3">
          <p className="text-white/60 text-[10px] font-bold">New member? <span onClick={onSwitch} className="text-white underline cursor-pointer hover:text-[#00ffd5]">Join us</span></p>
          <p className="text-white/40 text-[10px] font-bold italic cursor-pointer hover:text-white transition-colors">forgot password?</p>
        </div>
      </div>
    </div>
  );
};

const SignupPage: React.FC<{ onSignupSuccess: () => void, onSwitch: () => void }> = ({ onSignupSuccess, onSwitch }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const validation = useMemo(() => ({
    usernameValid: username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username),
    passwordValid: password.length >= 6,
    confirmValid: confirmPassword.length > 0 && confirmPassword === password
  }), [username, password, confirmPassword]);

  const isFormValid = validation.usernameValid && validation.passwordValid && validation.confirmValid;

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    const result = authService.register(username, password);
    if (result.success) {
      onSignupSuccess();
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#00ffd5] via-[#2cc3ff] to-[#3033ff]">
      <div className="bg-white/10 backdrop-blur-md rounded-[3rem] p-12 w-full max-sm flex flex-col items-center shadow-2xl border border-white/20">
        <FitFizzLogo size="md" className="mb-4" />
        <FitFizzText size="md" className="mb-8" />
        
        <form onSubmit={handleSignup} className="w-full space-y-5">
          {error && (
            <div className="text-rose-200 bg-rose-500/20 border border-rose-500/30 p-3 text-xs font-bold rounded-xl text-center shadow-sm">
              {error}
            </div>
          )}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-white/70 text-[10px] font-black uppercase ml-1 tracking-widest">
              <span>username</span>
              {validation.usernameValid ? <CheckCircle2 className="w-3 h-3 text-[#00ffd5]" /> : <User className="w-3 h-3 opacity-40" />}
            </div>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full bg-white/20 border ${username.length > 0 && !validation.usernameValid ? 'border-rose-500' : 'border-white/10'} text-white px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#00ffd5] transition-all`}
              placeholder="Min 3 chars"
            />
            {username.length > 0 && !validation.usernameValid && (
              <p className="text-[10px] text-rose-300 font-bold ml-1">3+ chars, alphanumeric only</p>
            )}
          </div>
          <div className="space-y-1">
             <div className="flex justify-between items-center text-white/70 text-[10px] font-black uppercase ml-1 tracking-widest">
              <span>password</span>
              {validation.passwordValid ? <CheckCircle2 className="w-3 h-3 text-[#00ffd5]" /> : <Lock className="w-3 h-3 opacity-40" />}
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-white/20 border ${password.length > 0 && !validation.passwordValid ? 'border-rose-500' : 'border-white/10'} text-white px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#00ffd5] transition-all`}
              placeholder="Min 6 chars"
            />
          </div>
          <div className="space-y-1">
             <div className="flex justify-between items-center text-white/70 text-[10px] font-black uppercase ml-1 tracking-widest">
              <span>confirm password</span>
              {validation.confirmValid ? <CheckCircle2 className="w-3 h-3 text-[#00ffd5]" /> : <Activity className="w-3 h-3 opacity-40" />}
            </div>
            <input 
              type="password" 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full bg-white/20 border ${confirmPassword.length > 0 && !validation.confirmValid ? 'border-rose-500' : 'border-white/10'} text-white px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#00ffd5] transition-all`}
              placeholder="Match password"
            />
            {confirmPassword.length > 0 && !validation.confirmValid && (
              <p className="text-[10px] text-rose-300 font-bold ml-1">Passwords must match</p>
            )}
          </div>
          
          <button 
            type="submit"
            disabled={!isFormValid}
            className={`w-full ${isFormValid ? 'bg-[#00ffd5] text-black' : 'bg-white/10 text-white/40 cursor-not-allowed'} font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-all hover:brightness-110 uppercase tracking-tighter text-sm`}
          >
            Create Account
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-white/60 text-[10px] font-bold">Already a member? <span onClick={onSwitch} className="text-white underline cursor-pointer hover:text-[#00ffd5]">Login</span></p>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<{ onSelectView: (view: View) => void }> = ({ onSelectView }) => {
  const items = [
    { 
      id: 'BMI', 
      title: 'fit check', 
      img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=400&auto=format&fit=crop',
      icon: <Calculator className="w-4 h-4 text-white" />
    },
    { 
      id: 'REPORT', 
      title: 'report check', 
      img: 'https://images.unsplash.com/photo-1624727828489-a1e03b79bba8?q=80&w=400&auto=format&fit=crop', 
      icon: <FileSearch className="w-4 h-4 text-white" />
    },
    { 
      id: 'CHAT', 
      title: 'robo coach', 
      img: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?q=80&w=400&auto=format&fit=crop', 
      icon: <Bot className="w-4 h-4 text-white" />
    },
    { 
      id: 'FEEDBACK', 
      title: 'update hub', 
      img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop',
      icon: <Mail className="w-4 h-4 text-white" />
    }
  ];

  return (
    <div className="max-w-md mx-auto p-4 pb-20 space-y-6">
      <div className="flex items-center gap-4 py-8">
        <FitFizzLogo size="md" />
        <FitFizzText size="md" />
      </div>

      <div className="space-y-6">
        {items.map((item) => (
          <div 
            key={item.id}
            onClick={() => onSelectView(item.id as View)}
            className="bg-white/10 backdrop-blur-md overflow-hidden rounded-[2rem] shadow-xl cursor-pointer group hover:scale-[1.02] transition-all border border-white/5"
          >
            <div className="h-44 relative">
               <img src={item.img} alt={item.title} className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 transition-all duration-500" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
               <div className="absolute bottom-4 left-6 flex items-center gap-2 bg-[#00ffd5] text-black px-4 py-2 rounded-xl shadow-lg">
                 <Play className="w-3 h-3 fill-current" />
                 <span className="text-[10px] font-black uppercase tracking-widest">{item.title}</span>
               </div>
               <div className="absolute right-6 bottom-4 p-3 bg-white/20 backdrop-blur-md rounded-2xl group-hover:bg-[#00ffd5] group-hover:text-black transition-all">
                  <ChevronRight className="w-5 h-5" />
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<View>('SPLASH');
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const savedUser = authService.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
      if (['SPLASH', 'LOGIN', 'SIGNIN'].includes(view)) {
        setView('DASHBOARD');
      }
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setView('LOGIN');
  };

  const handleLoginSuccess = (loggedInUser: UserType) => {
    setUser(loggedInUser);
    setView('DASHBOARD');
  };

  if (view === 'SPLASH') return <SplashScreen onComplete={() => setView(user ? 'DASHBOARD' : 'LOGIN')} />;
  if (view === 'LOGIN') return <LoginPage onLoginSuccess={handleLoginSuccess} onSwitch={() => setView('SIGNIN')} />;
  if (view === 'SIGNIN') return <SignupPage onSignupSuccess={() => setView('LOGIN')} onSwitch={() => setView('LOGIN')} />;

  return (
    <div className="min-h-screen bg-transparent text-white font-['Inter'] relative overflow-x-hidden">
      <FullGradientBg />
      {view !== 'DASHBOARD' && (
        <Header 
          currentView={view} 
          onNavigate={setView} 
          onLogout={handleLogout} 
          showBack={true} 
        />
      )}

      <main className="relative z-10">
        {view === 'DASHBOARD' && <Dashboard onSelectView={setView} />}
        {view === 'BMI' && <BmiCalculator />}
        {view === 'CHAT' && <Chatbot />}
        {view === 'REPORT' && <ReportCheck />}
        {view === 'FEEDBACK' && <FeedbackHub />}
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default App;
