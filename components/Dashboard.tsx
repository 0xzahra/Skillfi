import React from 'react';
import { UserProfile, ActivityLog } from '../types';

interface DashboardProps {
    user: UserProfile;
    activities: ActivityLog[];
    onNavigate: (view: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, activities, onNavigate }) => {
    return (
        <div className="p-6 md:p-8 overflow-y-auto h-full font-sans">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                        Welcome back, <span className="text-skillfi-neon">{user.username}</span>
                    </h1>
                    <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                        <span className="bg-[#1a1a1a] px-2 py-1 rounded border border-gray-800">ID: {user.id}</span>
                        <span className="bg-[#1a1a1a] px-2 py-1 rounded border border-gray-800 text-skillfi-accent">LEVEL: {user.level}</span>
                    </div>
                </div>
                
                {/* Social Badges */}
                <div className="flex gap-2">
                    {user.socials?.twitter && (
                        <div className="p-2 bg-[#1a1a1a] border border-gray-800 rounded-full text-gray-400" title="Twitter Linked">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </div>
                    )}
                    {user.socials?.linkedin && (
                        <div className="p-2 bg-[#1a1a1a] border border-gray-800 rounded-full text-blue-500" title="LinkedIn Linked">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        </div>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Net Worth Card */}
                <div className="bg-[#111] border border-gray-800 p-6 rounded-2xl hover:border-skillfi-neon/30 transition-all shadow-lg group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 bg-skillfi-neon/10 rounded-xl text-skillfi-neon group-hover:bg-skillfi-neon/20 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.252 9.25 9 9.563 9h4.874c.313 0 .563.252.563.563v4.874c0 .313-.25.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" />
                            </svg>
                        </div>
                        <span className="flex items-center gap-1 text-green-400 text-xs font-bold bg-green-400/10 px-2 py-1 rounded-full">
                            +12.4%
                        </span>
                    </div>
                    <div className="text-gray-500 text-sm font-medium mb-1">Tracked Net Worth</div>
                    <div className="text-3xl font-bold text-white tracking-tight">${user.netWorth.toLocaleString()}</div>
                </div>

                {/* Status Card */}
                <div className="bg-[#111] border border-gray-800 p-6 rounded-2xl hover:border-purple-500/30 transition-all shadow-lg group">
                     <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-gray-500 text-sm font-medium mb-1">System Status</div>
                    <div className="text-2xl font-bold text-white tracking-tight">OPTIMAL</div>
                    <div className="w-full bg-gray-800 h-1.5 mt-3 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
                    </div>
                </div>

                {/* Quick Tool */}
                <div 
                    onClick={() => onNavigate('TOOLS_CALC')}
                    className="bg-gradient-to-br from-[#111] to-[#161616] border border-gray-800 p-6 rounded-2xl cursor-pointer hover:border-skillfi-accent/50 transition-all shadow-lg group relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-skillfi-accent/5 rounded-full -mr-10 -mt-10 blur-xl group-hover:bg-skillfi-accent/10 transition-colors"></div>
                    
                     <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2.5 bg-skillfi-accent/10 rounded-xl text-skillfi-accent group-hover:scale-110 transition-transform duration-300">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5a2.25 2.25 0 012.25 2.25v1.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-1.5A2.25 2.25 0 018.25 6z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-skillfi-accent text-sm font-bold uppercase tracking-wide mb-1">Quick Access</div>
                    <div className="text-xl font-bold text-white flex items-center gap-2">
                        Interest Calculator 
                        <span className="text-gray-500 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                </div>
            </div>

            <h2 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest border-b border-gray-800 pb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                Recent Activity Log
            </h2>
            <div className="space-y-3">
                {activities.length === 0 ? (
                    <div className="text-gray-600 text-sm text-center py-4 italic">No recent activity detected.</div>
                ) : (
                    activities.map((act) => (
                        <div key={act.id} className="flex items-center gap-4 p-4 bg-[#111] border border-gray-800/50 rounded-xl hover:bg-[#161616] transition-colors">
                            <div className="w-2 h-2 bg-skillfi-neon rounded-full shadow-[0_0_8px_rgba(0,255,255,0.5)]"></div>
                            <div className="flex-1">
                                <div className="text-gray-200 text-sm font-medium">{act.title}</div>
                                <div className="text-gray-500 text-xs mt-0.5">{act.desc} • {act.time}</div>
                            </div>
                            <div className="text-gray-600 font-mono text-xs bg-gray-900 px-2 py-1 rounded">{act.type}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};