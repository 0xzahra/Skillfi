
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

  const navItems = [
    { id: 'dashboard', label: t('dashboard', currentLang), desc: 'Overview & Stats', icon: '⚡', action: 'DASHBOARD' },
    { id: 'inbox', label: 'Inbox', desc: 'Secure Messaging', icon: '✉️', action: 'INBOX' },
    { id: 'tribes', label: t('tribes', currentLang), desc: 'Join Communities', icon: '✊', action: 'TRIBES' },
    { id: 'career', label: t('career', currentLang), desc: 'Web3 & Tech Strategy', icon: '🚀', action: 'CAREER' },
    { id: 'finance', label: t('finance', currentLang), desc: 'Wealth Tools', icon: '📊', action: 'FINANCE' },
    
    // Expanded Relationships Category
    { id: 'rel_general', label: t('relationships', currentLang), desc: 'General Guidance', icon: '❤️', action: 'RELATIONSHIPS' },
    { id: 'rel_rights', label: t('rights', currentLang), desc: 'Protected Rights', icon: '⚖️', action: 'RIGHTS' },
    { id: 'rel_duties', label: t('duties', currentLang), desc: 'Roles & Responsibilities', icon: '🤝', action: 'DUTIES' },
    { id: 'rel_criteria', label: t('criteria', currentLang), desc: 'Selection Standards', icon: '🔍', action: 'CRITERIA' },
    
    { id: 'elite', label: t('elite', currentLang), desc: 'Etiquette & Class', icon: '🎩', action: 'ELITE' },
    { id: 'education', label: t('education', currentLang), desc: 'Academic Guidance', icon: '🧠', action: 'EDUCATION' },
    { id: 'safety', label: t('safety', currentLang), desc: 'Digital Security', icon: '🛡️', action: 'SAFETY' },
    { id: 'support', label: t('support', currentLang), desc: 'Human Agent Uplink', icon: '🎧', action: 'SUPPORT' },
    { id: 'history', label: t('history', currentLang), desc: 'Archives', icon: '📜', action: 'HISTORY' },
    { id: 'settings', label: t('settings', currentLang), desc: 'Configuration', icon: '⚙️', action: 'SETTINGS' },
    { id: 'logout', label: t('logout', currentLang), desc: 'End Session', icon: '❌', action: 'LOGOUT' },
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

        {/* x404 Balance Display */}
        <div className="p-4 border-b border-white/5 bg-transparent">
             <div className="bg-white/5 border border-white/5 p-3 rounded-lg shadow-inner flex justify-between items-center backdrop-blur-md">
                 <div>
                    <span className="text-[10px] font-bold text-gray-400 tracking-wider block">x404 BALANCE</span>
                    <span className="text-xl font-bold font-display text-skillfi-neon tracking-tighter shadow-skillfi-neon/20 drop-shadow-sm">{credits.toLocaleString()}</span>
                 </div>
                 <div className="w-8 h-8 rounded-full bg-skillfi-neon/10 flex items-center justify-center text-skillfi-neon shadow-[0_0_10px_rgba(0,255,255,0.2)]">
                    💎
                 </div>
             </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
          {navItems.map((item) => {
            const isChild = ['rel_rights', 'rel_duties', 'rel_criteria'].includes(item.id);
            const isParent = item.id === 'rel_general';

            // Hide children if not expanded
            if (isChild && !isRelExpanded) return null;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (isParent) {
                      setIsRelExpanded(!isRelExpanded);
                      onModeSelect(item.action);
                  } else {
                      onModeSelect(item.action);
                      if (window.innerWidth < 768) onClose();
                  }
                }}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 group relative ${
                    item.id === 'logout' 
                    ? 'bg-red-500/5 border-transparent hover:bg-red-500/10 text-red-400 mt-4' 
                    : item.id === 'support'
                    ? 'bg-skillfi-neon/5 border-skillfi-neon/20 hover:bg-skillfi-neon/10 text-skillfi-neon'
                    : isChild
                    ? 'bg-white/5 border-transparent hover:bg-white/10 text-gray-400 hover:text-white pl-8 ml-2 w-[95%] border-l-2 border-l-skillfi-neon/20' 
                    : 'bg-transparent border-transparent hover:border-white/10 hover:bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-4">
                    <span className={`text-lg group-hover:scale-110 transition-transform duration-300 drop-shadow-md ${isChild ? 'scale-75' : ''}`}>{item.icon}</span>
                    <div className="flex flex-col items-start text-left">
                      <span className={`text-sm font-semibold tracking-wide ${item.id === 'logout' ? 'text-red-400' : 'text-gray-300 group-hover:text-white'}`}>
                          {item.label}
                      </span>
                      <span className="text-[10px] text-gray-500 font-medium group-hover:text-skillfi-neon/80 transition-colors">
                          {item.desc}
                      </span>
                    </div>
                </div>
                
                {isParent && (
                    <div className={`transition-transform duration-300 text-gray-500 ${isRelExpanded ? 'rotate-90 text-skillfi-neon' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </div>
                )}

                {item.id !== 'logout' && !isParent && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-skillfi-neon shadow-[0_0_8px_rgba(0,255,255,0.5)]">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
