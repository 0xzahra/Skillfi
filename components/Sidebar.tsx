import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  onModeSelect: (mode: string) => void;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onModeSelect, onClose }) => {
  const modes = [
    { id: 'career', label: 'Career Guidance', desc: 'Web2 & Web3 Paths', icon: '🚀' },
    { id: 'education', label: 'Child & Education', desc: 'Future Streams', icon: '🎓' },
    { id: 'elite', label: 'Elite Refinement', desc: 'High-Value Skills', icon: '🍷' },
    { id: 'finance', label: 'Financial Mastery', desc: 'Wealth Dashboard', icon: '💎' },
    { id: 'trading', label: 'Trading Dojo', desc: 'Crypto & Stocks', icon: '📈' },
    { id: 'hope', label: 'Hope Engine', desc: 'Motivation', icon: '✨' },
    { id: 'safety', label: 'Internet Safety', desc: 'Digital Security', icon: '🛡️' },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <div className={`
        fixed md:static top-0 left-0 h-full w-72 bg-skillfi-surface border-r border-gray-800 
        transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col shadow-2xl
      `}>
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black/20">
          <h2 className="font-mono font-bold text-skillfi-neon tracking-wider">MODULES</h2>
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                onModeSelect(mode.label);
                if (window.innerWidth < 768) onClose();
              }}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-skillfi-neon/50 hover:bg-gray-800 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)] transition-all duration-300 text-left group"
            >
              <div className="text-2xl p-2 bg-black/50 rounded-lg border border-gray-800 group-hover:border-skillfi-neon/30 transition-colors">
                {mode.icon}
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-gray-200 group-hover:text-skillfi-neon font-mono transition-colors">
                  {mode.label}
                </div>
                <div className="text-[10px] text-gray-500 group-hover:text-gray-400 uppercase tracking-wide">
                  {mode.desc}
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-skillfi-neon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-gray-800 text-[10px] text-gray-600 font-mono text-center bg-black/20">
          SELECT A MODULE TO<br/>FOCUS THE SESSION
        </div>
      </div>
    </>
  );
};