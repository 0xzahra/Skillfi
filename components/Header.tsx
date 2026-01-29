import React, { useState } from 'react';
import { LanguageCode, LANGUAGES } from '../types';

interface HeaderProps {
    onShare?: () => void;
    onNewChat: () => void;
    onToggleMenu: () => void;
    isVoiceMode?: boolean;
    onToggleVoice?: () => void;
    currentLang: LanguageCode;
    onLangChange: (lang: LanguageCode) => void;
    onViewNotifications?: () => void;
    onViewInbox?: () => void;
    unreadNotifications?: number;
    unreadMessages?: number;
    onToggleTheme?: () => void;
    theme?: 'dark' | 'light';
}

export const Header: React.FC<HeaderProps> = ({ 
    onToggleMenu, 
    currentLang,
    onLangChange,
    onViewNotifications,
    onViewInbox,
    onToggleTheme,
    theme = 'dark',
    unreadNotifications = 2,
    unreadMessages = 1
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const currentLangData = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  return (
    <>
    <header className="px-4 md:px-6 py-4 glass-panel border-b-0 flex items-center justify-between sticky top-0 z-40 shadow-2xl shrink-0 mx-4 mt-2 rounded-xl">
      <div className="flex items-center gap-6">
        <button 
          onClick={onToggleMenu}
          className="md:hidden p-2 text-skillfi-neon hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-skillfi-neon/30"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        
        <div className="flex items-center gap-3 select-none">
          {/* Consistent System Logo */}
          <div className="w-10 h-10 flex items-center justify-center">
             <svg viewBox="0 0 100 100" className="w-full h-full text-skillfi-neon fill-current">
                <path d="M50 0 L60 20 L40 20 Z" /> {/* Arrow Tip */}
                <path d="M45 20 L55 20 L55 50 C55 65 75 65 75 50 C75 35 55 35 55 20" stroke="currentColor" strokeWidth="8" fill="none" />
                <path d="M45 20 L45 50 C45 65 25 65 25 50 C25 35 45 35 45 20" stroke="currentColor" strokeWidth="8" fill="none" />
                <circle cx="25" cy="50" r="8" fill="currentColor" />
                <circle cx="75" cy="50" r="8" fill="currentColor" />
             </svg>
          </div>
          <h1 className="text-2xl font-bold font-display tracking-[0.2em] dark:text-white text-slate-900 text-shadow-gold">
            SKILLFI
          </h1>
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        
        {/* Inbox Icon - Spaced out */}
        <button 
            onClick={onViewInbox}
            className="p-2 text-gray-400 hover:text-skillfi-neon hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors relative"
            title="Inbox"
        >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
             </svg>
             {unreadMessages > 0 && (
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-skillfi-neon rounded-full border border-black"></span>
             )}
        </button>

        {/* Notifications Icon */}
        <button 
            onClick={onViewNotifications}
            className="p-2 text-gray-400 hover:text-skillfi-neon hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors relative"
            title="Notifications"
        >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
             </svg>
             {unreadNotifications > 0 && (
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-black"></span>
             )}
        </button>

        <div className="w-px h-6 bg-skillfi-neon/20 mx-1 hidden md:block"></div>

        {/* Theme Toggle Button */}
        {onToggleTheme && (
            <button 
                onClick={onToggleTheme}
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg text-gray-400 hover:text-skillfi-neon hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                title="Toggle Theme"
            >
                {theme === 'dark' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                )}
            </button>
        )}

        {/* Language Button */}
        <button 
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="hidden md:flex items-center gap-2 bg-transparent border border-black/10 dark:border-white/10 hover:border-skillfi-neon dark:text-white text-slate-900 text-xs font-bold px-3 py-2 rounded-lg transition-all"
        >
            <span className="text-base">{currentLangData.flag}</span>
        </button>
      </div>
    </header>

    {/* Language Modal */}
    {showLangMenu && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in" onClick={() => setShowLangMenu(false)}>
            <div className="glass-panel border border-skillfi-neon/20 rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-skillfi-neon/10 flex justify-between items-center bg-transparent">
                    <h2 className="text-xl font-bold font-display dark:text-white text-slate-900 tracking-widest">Select Language</h2>
                    <button onClick={() => setShowLangMenu(false)} className="text-gray-400 hover:text-skillfi-neon">✕</button>
                </div>
                <div className="overflow-y-auto p-4 grid grid-cols-2 md:grid-cols-4 gap-3 scrollbar-hide">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                onLangChange(lang.code);
                                setShowLangMenu(false);
                            }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left group ${
                                currentLang === lang.code 
                                ? 'bg-skillfi-neon/10 border-skillfi-neon dark:text-white text-black' 
                                : 'bg-transparent border-black/5 dark:border-white/5 hover:border-skillfi-neon/50 text-gray-400 dark:hover:text-white hover:text-black'
                            }`}
                        >
                            <span className="text-2xl">{lang.flag}</span>
                            <div>
                                <div className={`font-bold text-sm font-display ${currentLang === lang.code ? 'text-skillfi-neon' : 'group-hover:text-skillfi-neon'}`}>{lang.name}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )}
    </>
  );
};