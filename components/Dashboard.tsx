import React, { useState } from 'react';
import { UserProfile, ActivityLog } from '../types';

interface DashboardProps {
    user: UserProfile;
    activities: ActivityLog[];
    onNavigate: (view: string) => void;
    onAddSkill?: (skill: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, activities, onNavigate, onAddSkill }) => {
    const [newSkill, setNewSkill] = useState('');

    const handleAddSkill = () => {
        if (newSkill.trim() && onAddSkill) {
            onAddSkill(newSkill.trim());
            setNewSkill('');
        }
    };

    return (
        <div className="p-6 md:p-8 overflow-y-auto h-full font-sans pb-24 scrollbar-hide">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight flex items-center gap-3 drop-shadow-md">
                        Welcome back, <span className="text-skillfi-neon text-shadow-neon">{user.username}</span>
                        {user.isElite && (
                            <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold shadow-[0_0_15px_rgba(234,179,8,0.2)] animate-pulse">
                                ELITE OPERATOR
                            </span>
                        )}
                    </h1>
                    <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                        <span className="bg-white/5 px-2 py-1 rounded border border-white/10 backdrop-blur-sm">ID: {user.id}</span>
                        <span className="bg-white/5 px-2 py-1 rounded border border-white/10 text-skillfi-accent backdrop-blur-sm">LEVEL: {user.level}</span>
                    </div>
                </div>
                
                {/* Social Badges */}
                <div className="flex gap-2">
                    {user.socials?.twitter && (
                        <div className="p-2 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer" title="Twitter Linked">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </div>
                    )}
                    {user.socials?.linkedin && (
                        <div className="p-2 bg-white/5 border border-white/10 rounded-full text-blue-500 hover:text-blue-400 transition-colors cursor-pointer" title="LinkedIn Linked">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        </div>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Net Worth Card */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/5 p-6 rounded-2xl hover:border-skillfi-neon/30 transition-all shadow-lg group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-skillfi-neon/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2.5 bg-skillfi-neon/10 rounded-xl text-skillfi-neon group-hover:bg-skillfi-neon/20 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.252 9.25 9 9.563 9h4.874c.313 0 .563.252.563.563v4.874c0 .313-.25.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" />
                            </svg>
                        </div>
                        <span className="flex items-center gap-1 text-green-400 text-xs font-bold bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20">
                            +12.4%
                        </span>
                    </div>
                    <div className="text-gray-500 text-sm font-medium mb-1 relative z-10">Tracked Net Worth</div>
                    <div className="text-3xl font-bold text-white tracking-tight relative z-10 text-shadow-sm">${user.netWorth.toLocaleString()}</div>
                </div>

                 {/* USDC Reward Card (Simulated) */}
                 <div className={`bg-black/40 backdrop-blur-xl border p-6 rounded-2xl transition-all shadow-lg group relative overflow-hidden ${user.isElite ? 'border-yellow-500/30' : 'border-white/5'}`}>
                    {user.isElite && <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl -mr-8 -mt-8"></div>}
                     <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className={`p-2.5 rounded-xl transition-colors ${user.isElite ? 'bg-yellow-500/10 text-yellow-500' : 'bg-white/5 text-gray-600'}`}>
                            <span className="text-xl">$</span>
                        </div>
                        {user.isElite ? (
                            <span className="text-[10px] font-bold bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded border border-yellow-500/30">UNLOCKED</span>
                        ) : (
                            <span className="text-[10px] font-bold bg-white/5 text-gray-500 px-2 py-1 rounded border border-white/5">LOCKED</span>
                        )}
                    </div>
                    <div className="text-gray-500 text-sm font-medium mb-1">Elite Sim Allocation (USDC)</div>
                    <div className={`text-2xl font-bold tracking-tight ${user.isElite ? 'text-white' : 'text-gray-600 blur-[2px]'}`}>$10.00</div>
                    {!user.isElite && <div className="text-[10px] text-gray-500 mt-1">Unlock 5 skills to claim</div>}
                </div>

                {/* Quick Tool */}
                <div 
                    onClick={() => onNavigate('TOOLS_CALC')}
                    className="bg-black/40 backdrop-blur-xl border border-white/5 p-6 rounded-2xl cursor-pointer hover:border-skillfi-accent/50 transition-all shadow-lg group relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-skillfi-accent/5 rounded-full -mr-10 -mt-10 blur-xl group-hover:bg-skillfi-accent/10 transition-colors"></div>
                    
                     <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2.5 bg-skillfi-accent/10 rounded-xl text-skillfi-accent group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(255,102,0,0.2)]">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5a2.25 2.25 0 012.25 2.25v1.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-1.5A2.25 2.25 0 018.25 6z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-skillfi-accent text-sm font-bold uppercase tracking-wide mb-1">Quick Access</div>
                    <div className="text-xl font-bold text-white flex items-center gap-2">
                        Finance Tools 
                        <span className="text-gray-500 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                </div>
            </div>

            {/* SKILL VAULT - PROOF OF SKILL */}
            <section className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 mb-10">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <span className="text-skillfi-neon">⚡</span> Skill Vault
                        </h2>
                        <p className="text-gray-500 text-xs mt-1">Proof of Skill Protocol: 1 Verified Skill = 100 x404 Credits.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-skillfi-neon drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">{user.skills.length}/5</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">Progress to Elite</div>
                    </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-gray-800/50 rounded-full overflow-hidden mb-6">
                    <div className="h-full bg-skillfi-neon transition-all duration-500 shadow-[0_0_10px_#00ffff]" style={{ width: `${Math.min((user.skills.length / 5) * 100, 100)}%` }}></div>
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                    {user.skills.length === 0 && <span className="text-gray-600 italic text-sm">No skills vaulted yet.</span>}
                    {user.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-200 flex items-center gap-2 backdrop-blur-sm">
                            {skill}
                            <svg className="w-3 h-3 text-skillfi-neon" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                        </span>
                    ))}
                </div>

                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a new skill (e.g., Solidity, Copywriting)"
                        className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-skillfi-neon outline-none"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                    />
                    <button 
                        onClick={handleAddSkill}
                        className="bg-skillfi-neon hover:bg-white text-black font-bold px-6 py-2 rounded-xl transition-colors shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                    >
                        Vault
                    </button>
                </div>
            </section>

            {/* OpSec & Legal Footer */}
            <footer className="mt-12 pt-6 border-t border-white/5 text-center space-y-2 opacity-60 hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                    <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    OpSec Warning
                </div>
                <p className="text-[10px] text-gray-600 max-w-xl mx-auto leading-relaxed">
                    NEVER share your private keys, seed phrases, or banking passwords. Skillfi will never ask for them. 
                    All data is processed locally where possible.
                </p>
                <p className="text-[10px] text-gray-600 max-w-xl mx-auto leading-relaxed">
                    <strong>Disclaimer:</strong> Content provided by Skillfi AI is for educational purposes only and does not constitute financial or legal advice. 
                    Always Do Your Own Research (DYOR) before making investment decisions.
                </p>
                <div className="text-[10px] text-gray-700 font-mono mt-4">
                    © 2026 Skillfi Systems. All Rights Reserved. User data and generated plans are the intellectual property of the user.
                </div>
            </footer>
        </div>
    );
};