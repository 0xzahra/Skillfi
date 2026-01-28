import React, { useState } from 'react';
import { UserProfile, ActivityLog, LanguageCode } from '../types';
import { t } from '../translations';

interface DashboardProps {
    user: UserProfile;
    activities: ActivityLog[];
    onNavigate: (view: string) => void;
    onAddSkill?: (skill: string) => void;
    currentLang: LanguageCode;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, activities, onNavigate, onAddSkill, currentLang }) => {
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
                    <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-2 tracking-tight flex items-center gap-3 drop-shadow-md kinetic-type">
                        {t('welcome', currentLang)} <span className="text-skillfi-neon text-shadow-neon">{user.username}</span>
                        {user.isElite && (
                            <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold shadow-[0_0_15px_rgba(234,179,8,0.2)] animate-pulse">
                                ELITE
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
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5V5c0-2.761-2.239-5-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z"/></svg>
                        </div>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Stats Card */}
                <div className="glass-panel lg:col-span-2 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-skillfi-neon/10 rounded-full blur-[80px] group-hover:bg-skillfi-neon/20 transition-colors duration-700"></div>
                    
                    <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1 relative z-10">{t('net_worth', currentLang)}</h3>
                    <div className="text-5xl md:text-7xl font-bold font-display text-white tracking-tighter mb-6 relative z-10 drop-shadow-lg kinetic-type" style={{ animationDelay: '0.1s' }}>
                        ${user.netWorth.toLocaleString()}
                    </div>

                    <div className="grid grid-cols-2 gap-4 relative z-10">
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-skillfi-neon/30 transition-colors backdrop-blur-sm">
                            <div className="text-skillfi-neon text-2xl font-bold mb-1 font-display">{user.xp.toLocaleString()}</div>
                            <div className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">XP Earned</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-skillfi-neon/30 transition-colors backdrop-blur-sm">
                            <div className="text-white text-2xl font-bold mb-1 font-display">{user.credits.toLocaleString()}</div>
                            <div className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">x404 Credits</div>
                        </div>
                    </div>
                </div>

                {/* Skill Vault */}
                <div className="glass-panel rounded-2xl p-6 flex flex-col">
                    <h3 className="text-white font-bold font-display text-lg mb-4 flex items-center gap-2">
                        <span className="text-skillfi-neon">❖</span> {t('skill_vault', currentLang)}
                    </h3>
                    
                    <div className="flex-1 space-y-2 mb-4 overflow-y-auto max-h-[150px] scrollbar-hide">
                        {user.skills.length > 0 ? user.skills.map((skill, i) => (
                            <div key={i} className="flex items-center justify-between bg-white/5 px-3 py-2 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                                <span className="text-sm text-gray-300 font-medium">{skill}</span>
                                <span className="text-[10px] text-skillfi-neon font-bold">Lvl 1</span>
                            </div>
                        )) : (
                            <div className="text-gray-600 text-sm italic text-center py-4">No skills indexed yet.</div>
                        )}
                    </div>

                    <div className="mt-auto">
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                                placeholder={t('add_skill', currentLang)}
                                className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-skillfi-neon outline-none transition-colors"
                            />
                            <button 
                                onClick={handleAddSkill}
                                className="bg-white/10 hover:bg-skillfi-neon hover:text-black text-white px-3 py-2 rounded-lg text-xs font-bold transition-all uppercase"
                            >
                                {t('vault_btn', currentLang)}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {[
                    { label: t('career', currentLang), icon: '🚀', action: 'CAREER', color: 'text-blue-400', bg: 'bg-blue-900/10', border: 'border-blue-500/20' },
                    { label: t('finance', currentLang), icon: '📊', action: 'FINANCE', color: 'text-green-400', bg: 'bg-green-900/10', border: 'border-green-500/20' },
                    { label: t('tribes', currentLang), icon: '✊', action: 'TRIBES', color: 'text-purple-400', bg: 'bg-purple-900/10', border: 'border-purple-500/20' },
                    { label: t('settings', currentLang), icon: '⚙️', action: 'SETTINGS', color: 'text-gray-400', bg: 'bg-gray-800/20', border: 'border-white/10' }
                ].map((item, i) => (
                    <button 
                        key={i}
                        onClick={() => onNavigate(item.action)}
                        className={`glass-panel border-transparent p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:scale-[1.02] transition-transform duration-200 group hover:border-white/20`}
                    >
                        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                        <span className={`text-xs font-bold uppercase tracking-wide ${item.color} group-hover:text-white transition-colors`}>{item.label}</span>
                    </button>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
                <h3 className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-4 pl-1 kinetic-type" style={{ animationDelay: '0.2s' }}>System Logs</h3>
                <div className="space-y-3">
                    {activities.map((act) => (
                        <div key={act.id} className="glass-panel flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group">
                            <div className={`w-2 h-2 rounded-full ${act.type === 'SYSTEM' ? 'bg-skillfi-neon' : 'bg-skillfi-accent'} group-hover:animate-pulse`}></div>
                            <div className="flex-1">
                                <div className="text-white font-bold text-sm">{act.title}</div>
                                <div className="text-gray-500 text-xs">{act.desc}</div>
                            </div>
                            <div className="text-gray-600 text-[10px] font-mono">{act.time}</div>
                        </div>
                    ))}
                    {activities.length === 0 && (
                        <div className="text-gray-700 text-sm text-center py-6">System Idle. No logs recorded.</div>
                    )}
                </div>
            </div>
        </div>
    );
};