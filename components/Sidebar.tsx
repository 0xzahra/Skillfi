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
    { id: 'dashboard', label: t('dashboard', currentLang), desc: 'Overview', icon: '☗', action: 'DASHBOARD' },
    { id: 'career', label: t('career', currentLang), desc: 'Ascension', icon: '⚜️', action: 'CAREER' },
    { id: 'education', label: t('education', currentLang), desc: 'Knowledge', icon: '✒️', action: 'EDUCATION' },
    { id: 'finance', label: t('finance', currentLang), desc: 'Capital', icon: '🏛️', action: 'FINANCE' },
    { id: 'forbes', label: 'Forbes & Icons', desc: 'Billionaire Biographies', icon: '💰', action: 'FORBES' },
    { id: 'trauma', label: 'Wellness', desc: 'Fortitude', icon: '☘️', action: 'MENTAL_HEALTH' },
    { id: 'relationships', label: t('relationships', currentLang), desc: 'Harmony', icon: '❤', action: 'RELATIONSHIPS_DASH' },
    { id: 'tribes', label: t('tribes', currentLang), desc: 'Network', icon: '⚔', action: 'TRIBES' },
    { id: 'settings', label: t('settings', currentLang), desc: 'System', icon: '⚙', action: 'SETTINGS' },
    { id: 'logout', label: t('logout', currentLang), desc: 'Exit', icon: '⏎', action: 'LOGOUT' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 dark:bg-black/95 z-40 md:hidden backdrop-blur-md"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed md:static top-0 left-0 h-full w-72 glass-panel border-r-0 md:border-r border-skillfi-neon/10 
        transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col shadow-2xl font-sans bg-white/95 dark:bg-[#020409]/90
      `}>
        <div className="p-8 border-b border-skillfi-neon/10 flex justify-between items-center bg-transparent">
          <div>
              <h2 className="font-bold font-display dark:text-white text-slate-900 text-2xl tracking-[0.2em] text-shadow-gold">{t('menu', currentLang)}</h2>
          </div>
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-black dark:hover:text-white transition-colors">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
          {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                    onModeSelect(item.action);
                    if (window.innerWidth < 768) onClose();
                }}
                className={`w-full flex items-center justify-between p-4 rounded-none border-b border-black/5 dark:border-white/5 transition-all duration-300 group relative overflow-hidden ${
                    item.id === 'logout' 
                    ? 'hover:bg-red-900/10 text-red-500 mt-8 border-none' 
                    : 'hover:bg-black/5 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-skillfi-neon dark:hover:text-skillfi-neon'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-skillfi-neon/0 to-skillfi-neon/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                
                <div className="flex items-center gap-4 relative z-10">
                    <span className={`text-lg opacity-70 group-hover:opacity-100 transition-opacity font-serif`}>{item.icon}</span>
                    <div className="flex flex-col items-start text-left">
                      <span className={`text-sm font-bold tracking-[0.15em] uppercase font-display ${item.id === 'logout' ? 'text-red-500' : 'text-gray-700 dark:text-gray-200 group-hover:text-skillfi-neon'}`}>
                          {item.label}
                      </span>
                    </div>
                </div>
              </button>
            )
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-skillfi-neon/10 text-center">
            <p className="text-[9px] text-skillfi-neon/50 font-display uppercase tracking-[0.3em]">
                System v4.2
            </p>
        </div>
      </div>
    </>
  );
};