
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
}

export const Header: React.FC<HeaderProps> = ({ 
    onShare, 
    onNewChat, 
    onToggleMenu, 
    isVoiceMode, 
    onToggleVoice,
    currentLang,
    onLangChange,
    onViewNotifications,
    onViewInbox,
    unreadNotifications = 2,
    unreadMessages = 1
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const currentLangData = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  return (
    <>
    <header className="px-4 md:px-6 py-4 glass-panel border-b-0 border-white/5 flex items-center justify-between sticky top-0 z-40 shadow-lg shrink-0 font-sans mx-4 mt-2 rounded-2xl">
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleMenu}
          className="md:hidden p-2 text-skillfi-neon hover:bg-gray-800 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        
        <div className="flex items-center gap-2.5">
          <div className="w-3.5 h-3.5 bg-skillfi-neon rounded-full shadow-[0_0_12px_#00ffff]"></div>
          <h1 className="text-xl font-bold font-display tracking-tight text-white">
            Skillfi<span className="text-skillfi-neon">.</span>
          </h1>
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-3">
        
        {/* Inbox Icon */}
        <button 
            onClick={onViewInbox}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors relative"
            title="Inbox"
        >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
             </svg>
             {unreadMessages > 0 && (
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-skillfi-neon rounded-full border border-black"></span>
             )}
        </button>

        {/* Notifications Icon */}
        <button 
            onClick={onViewNotifications}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors relative"
            title="Notifications"
        >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
             </svg>
             {unreadNotifications > 0 && (
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-black"></span>
             )}
        </button>

        <div className="w-px h-6 bg-white/10 mx-1"></div>

        {/* Custom Language Button */}
        <button 
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-skillfi-neon text-white text-xs font-bold px-3 py-2 rounded-lg transition-all"
        >
            <span className="text-base">{currentLangData.flag}</span>
            <span className="hidden md:inline">{currentLangData.name}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
        </button>

        {onToggleVoice && (
            <button
                onClick={onToggleVoice}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold border transition-all duration-300 ${
                    isVoiceMode 
                    ? 'bg-skillfi-neon text-black border-skillfi-neon shadow-[0_0_15px_rgba(0,255,255,0.4)]' 
                    : 'bg-white/5 text-gray-400 border-white/10 hover:border-gray-500'
                }`}
                title={isVoiceMode ? "Disable Voice Output" : "Enable Voice Output"}
            >
                {isVoiceMode ? (
                    <>
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 animate-pulse">
                            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 2.485.554 4.84 1.54 6.913.253.518.598.988 1.019 1.39l.17.16c.365.347.852.537 1.356.537h1.415l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                        </svg>
                        <span className="hidden md:inline">ON</span>
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 2.485.554 4.84 1.54 6.913.253.518.598.988 1.019 1.39l.17.16c.365.347.852.537 1.356.537h1.415l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 101.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 10-1.06-1.06l-1.72 1.72-1.72-1.72z" />
                        </svg>
                        <span className="hidden md:inline">OFF</span>
                    </>
                )}
            </button>
        )}

        <button 
          onClick={onNewChat}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/10"
          title="New Chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
    </header>

    {/* Language Selection Modal */}
    {showLangMenu && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setShowLangMenu(false)}>
            <div className="glass-panel border border-white/10 rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-transparent">
                    <h2 className="text-xl font-bold font-display text-white">Select Protocol Language</h2>
                    <button onClick={() => setShowLangMenu(false)} className="text-gray-400 hover:text-white">✕</button>
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
                                ? 'bg-skillfi-neon/10 border-skillfi-neon text-white' 
                                : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10 text-gray-300'
                            }`}
                        >
                            <span className="text-2xl">{lang.flag}</span>
                            <div>
                                <div className={`font-bold text-sm ${currentLang === lang.code ? 'text-skillfi-neon' : 'group-hover:text-white'}`}>{lang.name}</div>
                                <div className="text-[10px] opacity-50 uppercase tracking-wider">{lang.code}</div>
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
