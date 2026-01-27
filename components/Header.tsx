import React from 'react';

interface HeaderProps {
    onShare?: () => void;
    onNewChat: () => void;
    onToggleMenu: () => void;
    isVoiceMode?: boolean;
    onToggleVoice?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onShare, onNewChat, onToggleMenu, isVoiceMode, onToggleVoice }) => {
  return (
    <header className="px-4 md:px-6 py-4 bg-skillfi-bg/90 backdrop-blur-md border-b border-gray-800 flex items-center justify-between sticky top-0 z-40 shadow-lg shrink-0 font-sans">
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
          <h1 className="text-xl font-bold tracking-tight text-white">
            Skillfi<span className="text-skillfi-neon">.</span>
          </h1>
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-3">
        {onToggleVoice && (
            <button
                onClick={onToggleVoice}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                    isVoiceMode 
                    ? 'bg-skillfi-neon text-black border-skillfi-neon shadow-[0_0_15px_rgba(0,255,255,0.4)]' 
                    : 'bg-[#1a1a1a] text-gray-400 border-gray-700 hover:border-gray-500'
                }`}
                title="Toggle Voice Output"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
                <span className="hidden md:inline">{isVoiceMode ? 'VOICE ON' : 'MUTED'}</span>
            </button>
        )}

        <button 
            onClick={onNewChat}
            className="flex items-center gap-2 px-3 py-2 bg-[#1a1a1a] hover:bg-[#252525] text-white text-xs font-bold rounded-lg border border-gray-700 transition-all"
            title="Start fresh"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            <span className="hidden md:inline">RESET</span>
        </button>

        {onShare && (
            <button 
                onClick={onShare}
                className="flex items-center gap-2 px-3 py-2 bg-skillfi-neon/5 hover:bg-skillfi-neon/10 text-skillfi-neon text-xs font-bold rounded-lg border border-skillfi-neon/30 transition-all"
                title="Share results"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
                <span className="hidden md:inline">SHARE</span>
            </button>
        )}
      </div>
    </header>
  );
};