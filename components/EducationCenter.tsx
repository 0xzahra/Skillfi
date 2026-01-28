import React, { useState, useEffect } from 'react';
import { AudioService } from '../services/audioService';

export const EducationCenter: React.FC = () => {
    const [scanning, setScanning] = useState(true);
    const [matches, setMatches] = useState<any[]>([]);
    
    // Simulate Background Scanning
    useEffect(() => {
        const timer = setTimeout(() => {
            setScanning(false);
            setMatches([
                {
                    id: 1,
                    title: "Tech-Future Grant 2024",
                    amount: "$5,000",
                    source: "Global STEM Initiative",
                    matchScore: 98,
                    deadline: "2 Days Left"
                }
            ]);
            // Haptic Alert
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
            // Audio Alert
            AudioService.playSuccess();
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const handleApply = (id: number) => {
        setMatches(matches.map(m => m.id === id ? { ...m, applied: true } : m));
    };

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 font-sans pb-24 touch-pan-y animate-fade-in">
             <header className="mb-8">
                <h1 className="text-3xl font-bold font-display text-white tracking-tight kinetic-type">Scholarship Sniper</h1>
                <p className="text-gray-500 text-sm mt-1">Autonomous Education Funding Agent</p>
            </header>

            {/* SCANNER STATUS */}
            <div className="mb-8">
                {scanning ? (
                    <div className="glass-panel p-6 rounded-2xl flex items-center gap-6 animate-pulse">
                        <div className="relative w-16 h-16 flex items-center justify-center">
                            <div className="absolute inset-0 border-4 border-t-green-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                            <span className="text-2xl">📡</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Scanning Global Databases...</h2>
                            <p className="text-xs text-green-500 font-mono mt-1">TARGET: STEM GRANTS // REGION: GLOBAL</p>
                        </div>
                    </div>
                ) : (
                    <div className="glass-panel p-6 rounded-2xl flex items-center gap-6 border border-green-500/30 bg-green-900/10">
                         <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-2xl text-green-400">
                             ✓
                         </div>
                         <div>
                            <h2 className="text-xl font-bold text-white">Scan Complete</h2>
                            <p className="text-xs text-gray-400 font-mono mt-1">1 HIGH-PROBABILITY MATCH FOUND</p>
                        </div>
                    </div>
                )}
            </div>

            {/* MATCHES */}
            <div className="space-y-4">
                {matches.map(match => (
                    <div key={match.id} className="glass-panel p-6 rounded-2xl border-l-4 border-l-green-500 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl group-hover:opacity-20 transition-opacity select-none pointer-events-none text-green-500">$</div>
                        
                        <div className="flex justify-between items-start relative z-10 mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-green-500 text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide animate-pulse">98% Match</span>
                                    <span className="text-red-400 text-[10px] font-bold uppercase tracking-wide border border-red-400/30 px-2 py-0.5 rounded">{match.deadline}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white font-display">{match.title}</h3>
                                <p className="text-sm text-gray-400">{match.source}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-green-400 tracking-tight">{match.amount}</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest">Grant Value</div>
                            </div>
                        </div>

                        <div className="relative z-10 pt-4 border-t border-white/5 flex gap-3">
                            <button 
                                onClick={() => handleApply(match.id)}
                                disabled={match.applied}
                                className={`flex-1 py-3 rounded-xl font-bold uppercase tracking-widest transition-all ${
                                    match.applied 
                                    ? 'bg-white/10 text-gray-500 cursor-not-allowed' 
                                    : 'bg-green-500 text-black hover:bg-white hover:shadow-[0_0_20px_#00ff00]'
                                }`}
                            >
                                {match.applied ? 'Application Sent' : 'One-Tap Apply'}
                            </button>
                            <button className="px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white transition-colors font-bold text-xs uppercase">
                                Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Education Roadmap (Static for now) */}
            <div className="mt-8 grid grid-cols-2 gap-4 opacity-50">
                 <div className="glass-panel p-4 rounded-xl">
                     <h3 className="text-gray-400 text-xs font-bold uppercase mb-2">Course Progress</h3>
                     <div className="text-2xl font-bold text-white">12%</div>
                 </div>
                 <div className="glass-panel p-4 rounded-xl">
                     <h3 className="text-gray-400 text-xs font-bold uppercase mb-2">Certifications</h3>
                     <div className="text-2xl font-bold text-white">0</div>
                 </div>
            </div>
        </div>
    );
};