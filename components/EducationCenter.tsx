import React, { useState, useEffect } from 'react';
import { AudioService } from '../services/audioService';
import { fetchLiveScholarships, RealScholarship } from '../services/geminiService';

export const EducationCenter: React.FC = () => {
    const [scanning, setScanning] = useState(true);
    const [matches, setMatches] = useState<RealScholarship[]>([]);
    const [showCurriculum, setShowCurriculum] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<number>(Date.now());
    
    // Real-Time Scanning
    useEffect(() => {
        const loadScholarships = async () => {
            setScanning(true);
            try {
                const data = await fetchLiveScholarships();
                setMatches(data);
                setLastUpdated(Date.now());
                if (data.length > 0) {
                    // Only play sound on initial load to avoid annoyance on refresh
                    if (scanning) AudioService.playSuccess();
                } 
            } catch (e) {
                console.error("Failed to load scholarships");
            } finally {
                setScanning(false);
            }
        };

        loadScholarships();

        // Auto Refresh every 60s
        const interval = setInterval(loadScholarships, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleApply = (index: number) => {
        // Just visual feedback since we don't have real application backends
        const newMatches = [...matches];
        // @ts-ignore
        newMatches[index].applied = true;
        setMatches(newMatches);
        AudioService.playSuccess();
    };

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 font-sans pb-24 touch-pan-y animate-fade-in relative">
             <header className="mb-8">
                <h1 className="text-3xl font-bold font-display text-white tracking-tight kinetic-type">Scholarship Sniper</h1>
                <p className="text-gray-500 text-sm mt-1">Autonomous Education Funding Agent (Live Data)</p>
            </header>

            {showCurriculum && (
                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl p-4 flex flex-col items-center justify-center animate-fade-in">
                    <div className="glass-panel w-full max-w-2xl rounded-2xl p-6 relative max-h-[80vh] overflow-y-auto">
                        <button onClick={() => setShowCurriculum(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>
                        <h2 className="text-2xl font-bold font-display text-white mb-6">Active Curriculum</h2>
                        
                        <div className="space-y-4">
                            {[
                                { title: "Financial Literacy 101", status: "In Progress", progress: 65, color: "text-green-400", border: "border-green-500" },
                                { title: "Web3 Security Basics", status: "Pending", progress: 0, color: "text-blue-400", border: "border-blue-500" },
                                { title: "AI Prompt Engineering", status: "Locked", progress: 0, color: "text-gray-500", border: "border-gray-700" }
                            ].map((course, i) => (
                                <div key={i} className={`bg-white/5 border-l-4 ${course.border} p-4 rounded-r-xl flex justify-between items-center`}>
                                    <div>
                                        <h3 className="font-bold text-white">{course.title}</h3>
                                        <span className={`text-xs uppercase tracking-wide ${course.color}`}>{course.status}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-white">{course.progress}%</div>
                                        <button className="text-[10px] underline text-gray-400 hover:text-white">
                                            {course.status === 'Locked' ? 'Unlock' : 'Continue'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* SCANNER STATUS */}
            <div className="mb-8">
                {scanning && matches.length === 0 ? (
                    <div className="glass-panel p-6 rounded-2xl flex items-center gap-6 animate-pulse">
                        <div className="relative w-16 h-16 flex items-center justify-center">
                            <div className="absolute inset-0 border-4 border-t-green-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                            <span className="text-2xl">📡</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Scanning Global Databases...</h2>
                            <p className="text-xs text-green-500 font-mono mt-1">TARGET: LIVE SCHOLARSHIPS // REGION: GLOBAL</p>
                        </div>
                    </div>
                ) : (
                    <div className="glass-panel p-6 rounded-2xl flex items-center justify-between border border-green-500/30 bg-green-900/10">
                         <div className="flex items-center gap-6">
                             <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-2xl text-green-400">
                                 ✓
                             </div>
                             <div>
                                <h2 className="text-xl font-bold text-white">Scan Complete</h2>
                                <p className="text-xs text-gray-400 font-mono mt-1">{matches.length} OPPORTUNITIES IDENTIFIED</p>
                            </div>
                         </div>
                         <div className="text-right hidden md:block">
                             <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Last Updated</p>
                             <p className="text-xs text-white font-mono">{new Date(lastUpdated).toLocaleTimeString()}</p>
                             {scanning && <span className="text-[9px] text-green-400 animate-pulse block mt-1">Refreshing...</span>}
                         </div>
                    </div>
                )}
            </div>

            {/* MATCHES */}
            <div className="space-y-4">
                {matches.map((match, idx) => (
                    <div key={idx} className="glass-panel p-6 rounded-2xl border-l-4 border-l-green-500 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl group-hover:opacity-20 transition-opacity select-none pointer-events-none text-green-500">$</div>
                        
                        <div className="flex justify-between items-start relative z-10 mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-green-500 text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide animate-pulse">Live Match</span>
                                    <span className="text-red-400 text-[10px] font-bold uppercase tracking-wide border border-red-400/30 px-2 py-0.5 rounded">{match.deadline}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white font-display">{match.title}</h3>
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">{match.source}</p>
                                {match.description && <p className="text-xs text-gray-500 mt-2 max-w-xl italic">"{match.description}"</p>}
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-green-400 tracking-tight">{match.amount}</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest">Est. Value</div>
                            </div>
                        </div>

                        <div className="relative z-10 pt-4 border-t border-white/5 flex gap-3">
                            <button 
                                onClick={() => handleApply(idx)}
                                // @ts-ignore
                                disabled={match.applied}
                                className={`flex-1 py-3 rounded-xl font-bold uppercase tracking-widest transition-all ${
                                    // @ts-ignore
                                    match.applied 
                                    ? 'bg-white/10 text-gray-500 cursor-not-allowed' 
                                    : 'bg-green-500 text-black hover:bg-white hover:shadow-[0_0_20px_#00ff00]'
                                }`}
                            >
                                {/* @ts-ignore */}
                                {match.applied ? 'Application Sent' : 'Start Application'}
                            </button>
                            <button className="px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white transition-colors font-bold text-xs uppercase">
                                Details
                            </button>
                        </div>
                    </div>
                ))}
                
                {!scanning && matches.length === 0 && (
                    <div className="text-center py-20 opacity-50">
                        <div className="text-4xl mb-4">🔭</div>
                        <p className="text-sm font-mono">NO ACTIVE SIGNALS FOUND IN SECTOR.</p>
                        <button onClick={() => window.location.reload()} className="mt-4 text-xs underline hover:text-white">Retry Scan</button>
                    </div>
                )}
            </div>

            {/* Education Roadmap (Interactive) */}
            <div className="mt-8 grid grid-cols-2 gap-4">
                 <div 
                    onClick={() => setShowCurriculum(true)}
                    className="glass-panel p-4 rounded-xl cursor-pointer hover:bg-white/10 hover:border-skillfi-neon/30 transition-all group"
                 >
                     <h3 className="text-gray-400 text-xs font-bold uppercase mb-2 group-hover:text-skillfi-neon">Course Progress</h3>
                     <div className="text-2xl font-bold text-white">12%</div>
                     <div className="w-full bg-gray-800 h-1 mt-2 rounded-full overflow-hidden">
                         <div className="h-full bg-skillfi-neon w-[12%]"></div>
                     </div>
                 </div>
                 <div 
                    onClick={() => setShowCurriculum(true)}
                    className="glass-panel p-4 rounded-xl cursor-pointer hover:bg-white/10 hover:border-skillfi-neon/30 transition-all group"
                 >
                     <h3 className="text-gray-400 text-xs font-bold uppercase mb-2 group-hover:text-skillfi-neon">Certifications</h3>
                     <div className="text-2xl font-bold text-white">0</div>
                     <span className="text-[10px] text-gray-500">Click to view roadmap</span>
                 </div>
            </div>
        </div>
    );
};