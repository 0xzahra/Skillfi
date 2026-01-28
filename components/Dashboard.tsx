import React, { useState } from 'react';
import { UserProfile, LanguageCode } from '../types';
import { t } from '../translations';

// Mock Data for Dashboard Visualization
const MOCK_NOTIFS = [
    { id: 1, text: 'CryptoKing liked your post', time: '2m', type: 'LIKE' },
    { id: 2, text: 'System Update v2.5', time: '1h', type: 'SYSTEM' },
    { id: 3, text: 'New Tribe Invite', time: '3h', type: 'INVITE' }
];

const MOCK_MESSAGES = [
    { id: 1, user: 'Alice_Web3', msg: 'Did you check the contract?', time: '10m', unread: true },
    { id: 2, user: 'Mentor_AI', msg: 'Portfolio looks green.', time: '2h', unread: false }
];

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

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, onAddSkill, currentLang }) => {
    const [newSkill, setNewSkill] = useState('');

    const handleAddSkill = () => {
        if (newSkill.trim() && onAddSkill) {
            onAddSkill(newSkill.trim());
            setNewSkill('');
        }
    };

    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto pb-24 font-sans scrollbar-hide">
            {/* Header */}
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl md:text-6xl font-bold font-display text-white tracking-tighter mb-2 kinetic-type">
                        {t('welcome', currentLang)} <span className="text-skillfi-neon text-shadow-neon">{user.username}</span>
                    </h1>
                    <div className="flex items-center gap-3 text-xs md:text-sm font-mono text-gray-500 uppercase tracking-widest">
                        <span>Level: {user.level}</span>
                        <span className="text-skillfi-accent">//</span>
                        <span>XP: {user.xp.toLocaleString()}</span>
                        {user.isElite && <span className="text-yellow-500 font-bold border border-yellow-500/30 px-2 rounded-full bg-yellow-500/5 shadow-[0_0_10px_rgba(234,179,8,0.2)]">ELITE STATUS</span>}
                    </div>
                </div>
                <div className="flex gap-2">
                     <button onClick={() => onNavigate('SETTINGS')} className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:text-skillfi-neon transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.1-.463 1.112h-6.25a1.125 1.125 0 01-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125h-4.25a1.125 1.125 0 01-1.125-1.125v-1.5c.621 0 1.125.504 1.125 1.125h6.25c.621 0 1.125.504 1.125 1.125h-4.25a1.125 1.125 0 01-1.125-1.125v-1.5a.625.625 0 01.625-.625h4.25a.625.625 0 01.625.625v1.5a.625.625 0 01-.625.625h-4.25a.625.625 0 01-.625-.625v-1.5a.625.625 0 01.625-.625h4.25c.621 0 1.125.504 1.125 1.125z" />
                        </svg>
                     </button>
                </div>
            </header>

            {/* BENTOS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                
                {/* 1. NET WORTH / FINANCE (Large) */}
                <div 
                    onClick={() => onNavigate('FINANCE')}
                    className="col-span-1 md:col-span-2 row-span-2 glass-panel p-6 rounded-3xl relative overflow-hidden group cursor-pointer hover:border-skillfi-neon/30 transition-all duration-500"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-[80px] group-hover:bg-green-500/10 transition-all"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start">
                             <div>
                                <h3 className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-1">Total Liquidity</h3>
                                <div className="text-5xl md:text-6xl font-bold font-display text-white tracking-tighter drop-shadow-lg">
                                    ${user.netWorth.toLocaleString()}
                                </div>
                             </div>
                             <div className="bg-green-500/10 text-green-400 px-2 py-1 rounded text-xs font-bold font-mono">+2.4%</div>
                        </div>

                        {/* Abstract Chart Visualization */}
                        <div className="h-32 w-full flex items-end gap-1 opacity-50 group-hover:opacity-80 transition-opacity">
                            {[40, 60, 45, 70, 65, 85, 80, 95, 90, 100, 85, 95, 110, 105, 120].map((h, i) => (
                                <div key={i} className="flex-1 bg-gradient-to-t from-green-500/20 to-green-500/80 rounded-t-sm transition-all duration-300 group-hover:scale-y-105" style={{ height: `${h}%` }}></div>
                            ))}
                        </div>

                        <div className="flex gap-4 mt-4">
                            <div className="bg-black/30 p-3 rounded-xl border border-white/5 backdrop-blur-md flex-1">
                                <div className="text-[10px] text-gray-500 uppercase">x404 Credits</div>
                                <div className="text-xl font-bold text-skillfi-neon">{user.credits.toLocaleString()}</div>
                            </div>
                            <div className="bg-black/30 p-3 rounded-xl border border-white/5 backdrop-blur-md flex-1">
                                <div className="text-[10px] text-gray-500 uppercase">Monthly Burn</div>
                                <div className="text-xl font-bold text-red-400">$1,200</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. NOTIFICATIONS (Tall) */}
                <div 
                    onClick={() => onNavigate('NOTIFICATIONS')}
                    className="col-span-1 md:col-span-1 row-span-2 glass-panel p-5 rounded-3xl relative group cursor-pointer hover:border-white/20"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <span>🔔</span> Alerts
                        </h3>
                        <span className="bg-red-500 text-black text-[10px] font-bold px-1.5 rounded-full">3</span>
                    </div>
                    <div className="space-y-3">
                        {MOCK_NOTIFS.map(n => (
                            <div key={n.id} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-[10px] font-bold uppercase ${n.type === 'SYSTEM' ? 'text-skillfi-neon' : 'text-blue-400'}`}>{n.type}</span>
                                    <span className="text-[10px] text-gray-600">{n.time}</span>
                                </div>
                                <p className="text-sm text-gray-300 leading-tight">{n.text}</p>
                            </div>
                        ))}
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5 opacity-50 text-center text-xs text-gray-500">
                            View All History
                        </div>
                    </div>
                </div>

                {/* 3. TRIBES / ACTIVE OPS */}
                <div 
                    onClick={() => onNavigate('TRIBES')}
                    className="col-span-1 md:col-span-1 glass-panel p-5 rounded-3xl relative group cursor-pointer hover:border-purple-500/30"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] group-hover:bg-purple-500/20 transition-all"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                             <h3 className="font-bold text-white flex items-center gap-2">
                                <span>✊</span> Tribes
                            </h3>
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-[10px] text-green-500 uppercase font-bold">Live</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="text-2xl font-bold text-white font-display">{MOCK_TRIBE_ACTIVITY.name}</div>
                            <div className="text-xs text-gray-500 font-mono mb-3">{MOCK_TRIBE_ACTIVITY.activeUsers} Operatives Online</div>
                            <div className="bg-black/30 p-2 rounded-lg border border-white/5 text-xs text-gray-300 truncate">
                                "{MOCK_TRIBE_ACTIVITY.topPost}"
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. INBOX PREVIEW */}
                <div 
                    onClick={() => onNavigate('INBOX')}
                    className="col-span-1 md:col-span-1 glass-panel p-5 rounded-3xl relative group cursor-pointer hover:border-blue-500/30"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <span>✉️</span> Comms
                        </h3>
                    </div>
                    <div className="space-y-2">
                         {MOCK_MESSAGES.map(m => (
                            <div key={m.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-black flex items-center justify-center text-[10px] font-bold border border-white/10">
                                    {m.user[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-white truncate">{m.user}</span>
                                        <span className="text-[9px] text-gray-500">{m.time}</span>
                                    </div>
                                    <div className="text-[10px] text-gray-400 truncate">{m.msg}</div>
                                </div>
                                {m.unread && <div className="w-1.5 h-1.5 bg-skillfi-neon rounded-full"></div>}
                            </div>
                         ))}
                    </div>
                </div>

                {/* 5. SKILL VAULT (Wide) */}
                <div className="col-span-1 md:col-span-2 glass-panel p-6 rounded-3xl relative">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <span className="text-skillfi-neon">❖</span> Skill Vault
                        </h3>
                        <span className="text-xs text-gray-500 font-mono">{user.skills.length} Indexed</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                        {user.skills.slice(0, 8).map((skill, i) => (
                            <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300 hover:text-white hover:border-white/30 transition-all cursor-default">
                                {skill}
                            </span>
                        ))}
                        {user.skills.length === 0 && <span className="text-gray-600 text-sm italic">System waiting for input...</span>}
                    </div>

                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                            placeholder="Add new capability..."
                            className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-skillfi-neon outline-none transition-colors"
                        />
                        <button 
                            onClick={handleAddSkill}
                            className="bg-white/10 hover:bg-skillfi-neon hover:text-black text-white px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase"
                        >
                            Add
                        </button>
                    </div>
                </div>

                {/* 6. CAREER / MISSION */}
                <div 
                    onClick={() => onNavigate('CAREER')}
                    className="col-span-1 md:col-span-2 glass-panel p-6 rounded-3xl relative overflow-hidden group cursor-pointer hover:border-skillfi-accent/40"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-skillfi-accent to-purple-600"></div>
                     <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <span>🚀</span> Active Mission
                        </h3>
                        <div className="text-[10px] bg-skillfi-accent/10 text-skillfi-accent px-2 py-1 rounded border border-skillfi-accent/20">IN PROGRESS</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-2 border-skillfi-accent/30 flex items-center justify-center bg-skillfi-accent/10 text-skillfi-accent">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-lg">Web3 Transition Protocol</h4>
                            <p className="text-sm text-gray-500">Milestone 2: Smart Contract Auditing</p>
                        </div>
                    </div>
                    <div className="mt-4 w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-skillfi-accent w-1/3 shadow-[0_0_10px_#ff6600]"></div>
                    </div>
                </div>

            </div>

            {/* Support / Footer Widget */}
            <div className="mt-6 glass-panel p-4 rounded-2xl flex items-center justify-between border-skillfi-neon/10">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-400 uppercase tracking-widest">System Status: Operational</span>
                </div>
                <button onClick={() => onNavigate('SUPPORT')} className="text-xs text-skillfi-neon hover:text-white transition-colors uppercase font-bold">
                    Contact Command &rarr;
                </button>
            </div>
        </div>
    );
};