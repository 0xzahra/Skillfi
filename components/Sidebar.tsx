
import React from 'react';
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
  // Simplified Menu Order
  const navItems = [
    { id: 'dashboard', label: t('dashboard', currentLang), desc: 'Overview', icon: '☗', action: 'DASHBOARD' },
    { id: 'career', label: t('career', currentLang), desc: 'Ascension', icon: '⚜️', action: 'CAREER' },
    { id: 'education', label: t('education', currentLang), desc: 'Knowledge', icon: '✒️', action: 'EDUCATION' },
    { id: 'finance', label: t('finance', currentLang), desc: 'Capital', icon: '🏛️', action: 'FINANCE' },
    { id: 'trauma', label: 'Wellness', desc: 'Fortitude', icon: '☘️', action: 'MENTAL_HEALTH' },
    { id: 'tribes', label: t('tribes', currentLang), desc: 'Network', icon: '⚔', action: 'TRIBES' },
    { id: 'support', label: t('support', currentLang), desc: 'Assistance', icon: '🛟', action: 'SUPPORT' },
    { id: 'settings', label: t('settings', currentLang), desc: 'System', icon: '⚙', action: 'SETTINGS' },
    { id: 'logout', label: t('logout', currentLang), desc: 'Exit', icon: '⏎', action: 'LOGOUT' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed md:static top-0 left-0 h-full w-72 bg-white border-r border-skillfi-border
        transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col shadow-2xl md:shadow-none font-sans
      `}>
        <div className="p-8 border-b border-skillfi-border flex justify-between items-center bg-white">
          <div>
              <h2 className="font-extrabold text-skillfi-accent text-2xl tracking-tight">MENU</h2>
          </div>
          <button onClick={onClose} className="md:hidden text-skillfi-dim hover:text-skillfi-accent transition-colors p-2 rounded-full hover:bg-gray-100">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide bg-white">
          {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                    onModeSelect(item.action);
                    if (window.innerWidth < 768) onClose();
                }}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                    item.id === 'logout' 
                    ? 'hover:bg-red-50 text-red-500 mt-8' 
                    : 'hover:bg-skillfi-bg text-skillfi-text hover:text-skillfi-neon'
                }`}
              >
                <div className="flex items-center gap-4 relative z-10">
                    <span className={`text-xl opacity-70 group-hover:opacity-100 transition-opacity`}>{item.icon}</span>
                    <div className="flex flex-col items-start text-left">
                      <span className={`text-sm font-bold tracking-wide uppercase ${item.id === 'logout' ? 'text-red-500' : 'text-skillfi-text group-hover:text-skillfi-neon'}`}>
                          {item.label}
                      </span>
                    </div>
                </div>
              </button>
            )
          )}
        </div>
        
        {/* Credits Footer */}
        <div className="p-6 border-t border-skillfi-border bg-gray-50">
            <div className="flex items-center justify-between text-xs font-bold text-skillfi-dim uppercase tracking-wider">
                <span>System Credits</span>
                <span className="text-skillfi-accent">{credits}</span>
            </div>
        </div>
      </div>
    </>
  );
};
