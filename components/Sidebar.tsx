import React, { useState } from 'react';
import { LanguageCode } from '../types';
import { t } from '../translations';

interface SidebarProps {
  isOpen: boolean;
  onModeSelect: (mode: string) => void;
  onClose: () => void;
  credits: number;
  currentLang: LanguageCode;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onModeSelect, onClose, credits, currentLang }) => {
  const [isRelExpanded, setIsRelExpanded] = useState(false);

  // Simplified Menu Order
  const navItems = [
    { id: 'dashboard', label: t('dashboard', currentLang), desc: 'Home Base', icon: '🏠', action: 'DASHBOARD' },
    
    // 1. Career (Includes High Class Skills now)
    { id: 'career', label: t('career', currentLang), desc: 'Pathfinder & Toolkit', icon: '🚀', action: 'CAREER' },
    
    // 2. Education
    { id: 'education', label: t('education', currentLang), desc: 'Schools & Grants', icon: '📚', action: 'EDUCATION' },
    
    // 3. Finance
    { id: 'finance', label: t('finance', currentLang), desc: 'Assets vs Liabilities', icon: '💰', action: 'FINANCE' },
    
    // 4. Mental Health (New)
    { id: 'trauma', label: 'Mental Wellness', desc: 'Process & Heal', icon: '🧠', action: 'MENTAL_HEALTH' },

    // 5. Relationships (Dashboard)
    { id: 'relationships', label: t('relationships', currentLang), desc: 'Love & Dynamics', icon: '❤️', action: 'RELATIONSHIPS_DASH' },
    
    // 6. Tribes
    { id: 'tribes', label: t('tribes', currentLang), desc: 'Join Groups', icon: '🌍', action: 'TRIBES' },

    // Utilities
    { id: 'safety', label: t('safety', currentLang), desc: 'Stay Safe', icon: '🛡️', action: 'SAFETY' },
    { id: 'settings', label: t('settings', currentLang), desc: 'Preferences', icon: '⚙️', action: 'SETTINGS' },
    { id: 'logout', label: t('logout', currentLang), desc: 'Exit App', icon: '👋', action: 'LOGOUT' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed md:static top-0 left-0 h-full w-72 glass-panel border-r-0 md:border-r border-white/5 
        transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col shadow-2xl font-sans
      `}>
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-transparent">
          <div>
              <h2 className="font-bold font-display text-white text-xl tracking-tight kinetic-type">{t('menu', currentLang)}</h2>
          </div>
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
          {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                    onModeSelect(item.action);
                    if (window.innerWidth < 768) onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 group relative ${
                    item.id === 'logout' 
                    ? 'bg-red-500/5 border-transparent hover:bg-red-500/10 text-red-400 mt-4' 
                    : item.id === 'trauma'
                    ? 'bg-teal-500/5 border-transparent hover:bg-teal-500/10 text-teal-400'
                    : 'bg-transparent border-transparent hover:border-white/10 hover:bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-4">
                    <span className={`text-lg group-hover:scale-110 transition-transform duration-300 drop-shadow-md`}>{item.icon}</span>
                    <div className="flex flex-col items-start text-left">
                      <span className={`text-sm font-semibold tracking-wide ${item.id === 'logout' ? 'text-red-400' : 'text-gray-300 group-hover:text-white'}`}>
                          {item.label}
                      </span>
                      <span className="text-[10px] text-gray-500 font-medium group-hover:text-skillfi-neon/80 transition-colors">
                          {item.desc}
                      </span>
                    </div>
                </div>
              </button>
            )
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 text-center">
            <p className="text-[10px] text-gray-600 font-mono flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse"></span>
                Vibe coded by Zahra Usman
            </p>
        </div>
      </div>
    </>
  );
};