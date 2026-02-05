
import React from 'react';
import { LogOut, ChevronLeft, Activity } from 'lucide-react';
import { FitFizzLogo } from '../App';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: any) => void;
  onLogout: () => void;
  showBack?: boolean;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onLogout, showBack }) => {
  // Use light colors for dark views and vice versa
  const isDarkView = currentView === 'CHAT';
  const textColor = isDarkView ? 'text-white' : 'text-black';
  const iconColor = isDarkView ? 'text-white/50' : 'text-black/50';

  return (
    <header className={`bg-transparent sticky top-0 z-50 py-4 px-6 flex items-center justify-between`}>
      <div className="flex items-center gap-3">
        {showBack && (
          <button 
            onClick={() => onNavigate('DASHBOARD')}
            className={`p-2 rounded-full transition-all active:scale-90`}
          >
            <ChevronLeft className={`w-6 h-6 ${textColor}`} />
          </button>
        )}
        <div 
          onClick={() => onNavigate('DASHBOARD')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <FitFizzLogo size="sm" />
          <h1 className={`text-xl font-black tracking-tighter uppercase ${textColor}`}>
            fitfizz
          </h1>
        </div>
      </div>
      
      <button 
        onClick={onLogout}
        className={`flex items-center gap-2 ${iconColor} hover:${textColor} transition-colors px-4 py-2 rounded-xl`}
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline font-bold text-[10px] uppercase tracking-widest">Logout</span>
      </button>
    </header>
  );
};

export default Header;
