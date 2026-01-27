import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="px-6 py-4 bg-skillfi-bg/80 backdrop-blur-md border-b border-gray-800 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-skillfi-neon rounded-full shadow-[0_0_10px_#00ffff]"></div>
        <h1 className="text-xl font-bold tracking-wider font-mono text-white">
          SKILLFI<span className="text-skillfi-neon">.</span>
        </h1>
      </div>
      <div className="text-xs font-mono text-skillfi-dim tracking-widest uppercase">
        Career & Financial Guidance
      </div>
    </header>
  );
};