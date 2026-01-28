import React from 'react';
import { UserProfile, LanguageCode } from '../types';
import { t } from '../translations';

// Mock Data for Dashboard Visualization
const MOCK_TRIBE_ACTIVITY = {
    name: 'Web3 Builders',
    activeUsers: 842,
    topPost: 'Scaling L2 solutions...'
};

interface DashboardProps {
    user: UserProfile;
    onNavigate: (view: string) => void;
    onAddSkill?: (skill: string) => void;
    currentLang: LanguageCode;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, currentLang }) => {
    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto pb-24 font-sans scrollbar-hide touch-pan-y">
            {/* Minimal Header */}
            <header className="mb-6 md:mb-8">
                <h1 className="text-3xl md:text-5xl font-bold font-display text-white tracking-tighter mb-2 kinetic-type">
                    {t('welcome', currentLang)} <span className="text-skillfi-neon text-shadow-neon">{user.username}</span>
                </h1>
                <div className="flex items-center gap-3 text-xs font-mono text-gray-500 uppercase tracking-widest">
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        System Online
                    </span>
                    <span className="text-skillfi-accent">//</span>
                    <span>Lvl {user.level}</span>
                </div>
            </header>

            {/* MAIN COMMAND DECK - Simplified Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
                
                {/* 1. CAREER MISSION (Primary Action) */}
                <div 
                    onClick={() => onNavigate('CAREER')}
                    className="glass-panel p-6 md:p-8 rounded-3xl relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all duration-300 border-l-4 border-l-skillfi-accent"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-skillfi-accent/10 rounded-full blur-[60px] group-hover:bg-skillfi-accent/20 transition-all"></div>
                    
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                             <div className="bg-skillfi-accent/20 text-skillfi-accent px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-skillfi-accent/30">
                                Priority Protocol
                             </div>
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                             </svg>
                        </div>
                        
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 font-display">Web3 Transition</h3>
                        <p className="text-gray-400 text-sm mb-6 max-w-sm">Current Objective: Master Smart Contract auditing protocols to increase market value.</p>
                        
                        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                            <div className="h-full bg-skillfi-accent w-[35%] shadow-[0_0_15px_#ff6600]"></div>
                        </div>
                        <div className="flex justify-between mt-2 text-[10px] font-mono text-gray-500 uppercase">
                            <span>Progress</span>
                            <span>35% Complete</span>
                        </div>
                    </div>
                </div>

                {/* 2. WEALTH OS (Financial Overview) */}
                <div 
                    onClick={() => onNavigate('FINANCE')}
                    className="glass-panel p-6 md:p-8 rounded-3xl relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all duration-300 border-l-4 border-l-green-500"
                >
                    <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-green-500/5 rounded-full blur-[80px] group-hover:bg-green-500/10 transition-all"></div>
                    
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                             <div className="flex justify-between items-start mb-2">
                                <h3 className="text-gray-500 font-bold text-xs uppercase tracking-widest">Liquidity Status</h3>
                                <div className="text-green-400 text-xs font-bold font-mono">▲ 2.4%</div>
                             </div>
                             <div className="text-4xl md:text-5xl font-bold font-display text-white tracking-tighter mb-4">
                                ${user.netWorth.toLocaleString()}
                             </div>
                        </div>

                        {/* Minimalist Bar Chart */}
                        <div className="flex items-end gap-1.5 h-16 opacity-60">
                            {[30, 45, 35, 60, 50, 75, 65, 90, 80, 100].map((h, i) => (
                                <div key={i} className="flex-1 bg-green-500 rounded-t-[2px]" style={{ height: `${h}%`, opacity: (i + 1) / 10 }}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* QUICK STATS GRID - 4 Col on Desktop, 2 on Mobile */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* Stat 1 */}
                <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center group hover:bg-white/5 transition-colors">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">XP Level</span>
                    <span className="text-xl md:text-2xl font-bold text-white group-hover:scale-110 transition-transform">{user.xp.toLocaleString()}</span>
                </div>

                {/* Stat 2 */}
                <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center group hover:bg-white/5 transition-colors">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Skill Vault</span>
                    <span className="text-xl md:text-2xl font-bold text-skillfi-neon group-hover:scale-110 transition-transform">{user.skills.length}</span>
                </div>

                {/* Stat 3 (Action) */}
                <div 
                    onClick={() => onNavigate('TRIBES')}
                    className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-skillfi-neon/10 hover:border-skillfi-neon/50 transition-all"
                >
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Active Tribe</span>
                    <span className="text-lg md:text-xl font-bold text-white truncate max-w-full px-2">{MOCK_TRIBE_ACTIVITY.name}</span>
                </div>

                 {/* Stat 4 (Action) */}
                 <div 
                    onClick={() => onNavigate('SETTINGS')}
                    className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-purple-500/10 hover:border-purple-500/50 transition-all"
                >
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Identity</span>
                    <span className="text-lg md:text-xl font-bold text-white">Config</span>
                </div>

            </div>

            {/* Footer Quote */}
            <div className="mt-8 text-center opacity-40">
                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.2em]">"Consistency is the Code"</p>
            </div>
        </div>
    );
};