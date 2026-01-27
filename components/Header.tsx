import React from 'react';

interface HeaderProps {
    onShare?: () => void;
    onNewChat: () => void;
    onToggleMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onShare, onNewChat, onToggleMenu }) => {
  return (
    <header className="px-4 md:px-6 py-4 bg-skillfi-bg/90 backdrop-blur-md border-b border-gray-800 flex items-center justify-between sticky top-0 z-40 shadow-lg shrink-0">
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleMenu}
          className="md:hidden p-2 text-skillfi-neon hover:bg-gray-800 rounded"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-skillfi-neon rounded-full shadow-[0_0_10px_#00ffff]"></div>
          <h1 className="text-lg md:text-xl font-bold tracking-wider font-mono text-white">
            SKILLFI<span className="text-skillfi-neon">.</span>
          </h1>
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <button 
            onClick={onNewChat}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-mono rounded border border-gray-700 transition-all"
            title="Start fresh"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            <span className="hidden md:inline">NEW CHAT</span>
        </button>

        {onShare && (
            <button 
                onClick={onShare}
                className="flex items-center gap-2 px-3 py-1.5 bg-skillfi-neon/10 hover:bg-skillfi-neon/20 text-skillfi-neon text-xs font-mono rounded border border-skillfi-neon/50 transition-all"
                title="Share results"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
                <span className="hidden md:inline">SHARE</span>
            </button>
        )}
      </div>
    </header>
  );
};