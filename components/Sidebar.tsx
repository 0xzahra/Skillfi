import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  onModeSelect: (mode: string) => void;
  onClose: () => void;
  credits: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onModeSelect, onClose, credits }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', desc: 'Overview & Stats', icon: '⚡', action: 'DASHBOARD' },
    { id: 'tribes', label: 'Career Tribes', desc: 'Join Groups', icon: '✊', action: 'TRIBES' }, // New Item
    { id: 'career', label: 'Career Path', desc: 'Web3 & Tech', icon: '🚀', action: 'CAREER' },
    { id: 'finance', label: 'Financial Tools', desc: 'Calculator & Wealth', icon: '📊', action: 'FINANCE' },
    { id: 'elite', label: 'High Class', desc: 'Refinement Skills', icon: '🎩', action: 'ELITE' },
    { id: 'relationships', label: 'Relationships', desc: 'Marriage & Conflict', icon: '❤️', action: 'RELATIONSHIPS' },
    { id: 'education', label: 'Education', desc: 'Academic Guidance', icon: '🧠', action: 'EDUCATION' },
    { id: 'safety', label: 'Digital Safety', desc: 'Security Protocol', icon: '🛡️', action: 'SAFETY' },
    { id: 'history', label: 'Chat History', desc: 'Archives & Logs', icon: '📜', action: 'HISTORY' },
    { id: 'settings', label: 'Settings', desc: 'Profile & Config', icon: '⚙️', action: 'SETTINGS' },
    { id: 'logout', label: 'Logout', desc: 'End Session', icon: '❌', action: 'LOGOUT' },
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
        fixed md:static top-0 left-0 h-full w-72 bg-[#080808] border-r border-gray-800 
        transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col shadow-2xl font-sans
      `}>
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-skillfi-surface">
          <div>
              <h2 className="font-bold text-white text-xl tracking-tight">Command Center</h2>
              <div className="text-xs text-gray-500 font-medium mt-1">v2.5 // ONLINE</div>
          </div>
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* x404 Balance Display */}
        <div className="p-4 border-b border-gray-800 bg-[#0c0c0c]">
             <div className="bg-[#151515] border border-gray-800 p-3 rounded-lg shadow-inner flex justify-between items-center">
                 <div>
                    <span className="text-[10px] font-bold text-gray-500 tracking-wider block">x404 BALANCE</span>
                    <span className="text-xl font-bold text-skillfi-neon tracking-tighter shadow-skillfi-neon/20 drop-shadow-sm">{credits.toLocaleString()}</span>
                 </div>
                 <div className="w-8 h-8 rounded-full bg-skillfi-neon/10 flex items-center justify-center text-skillfi-neon">
                    💎
                 </div>
             </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onModeSelect(item.action);
                if (window.innerWidth < 768) onClose();
              }}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 group ${
                  item.id === 'logout' 
                  ? 'bg-red-500/5 border-transparent hover:bg-red-500/10 text-red-400' 
                  : 'bg-[#111] border-gray-800 hover:border-skillfi-neon/50 hover:bg-[#161616] text-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                  <span className="text-lg group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                  <div className="flex flex-col items-start text-left">
                    <span className={`text-sm font-semibold tracking-wide ${item.id === 'logout' ? 'text-red-400' : 'text-gray-200 group-hover:text-white'}`}>
                        {item.label}
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium group-hover:text-skillfi-neon/80 transition-colors">
                        {item.desc}
                    </span>
                  </div>
              </div>
              {item.id !== 'logout' && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-skillfi-neon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
              )}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-gray-800 bg-[#0c0c0c]">
            <div className="bg-[#151515] border border-gray-800 p-3 rounded-lg shadow-inner">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-gray-500 tracking-wider">SYSTEM HEALTH</span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-500">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        OPERATIONAL
                    </span>
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-skillfi-neon to-blue-500 h-full w-[98%]"></div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};