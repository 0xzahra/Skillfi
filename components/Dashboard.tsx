import React, { useState, useEffect } from 'react';
import { UserProfile, LanguageCode } from '../types';
import { t } from '../translations';

interface DashboardProps {
    user: UserProfile;
    onNavigate: (view: string) => void;
    onAddSkill?: (skill: string) => void;
    currentLang: LanguageCode;
}

const MOTIVATIONS = [
    { text: "Consistency is the hallmark of the elite.", action: "Execute one task." },
    { text: "Wealth is quiet. Rich is loud.", action: "Review your assets." },
    { text: "Knowledge is the only currency that appreciates.", action: "Learn something new." },
    { text: "Your network defines your net worth.", action: "Connect with a peer." },
    { text: "Discipline weighs ounces, regret weighs tons.", action: "Plan your day." }
];

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, currentLang }) => {
    const [greeting, setGreeting] = useState('Welcome');
    const [dailyMotivation, setDailyMotivation] = useState(MOTIVATIONS[0]);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good Morning");
        else if (hour < 18) setGreeting("Good Afternoon");
        else setGreeting("Good Evening");

        setDailyMotivation(MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]);
    }, []);

    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto pb-24 font-sans scrollbar-hide touch-pan-y">
            {/* Header */}
            <header className="mb-10 text-center md:text-left border-b border-skillfi-neon/10 pb-6">
                <h1 className="text-3xl md:text-5xl font-bold font-display dark:text-white text-slate-900 tracking-widest mb-2 kinetic-type">
                    {greeting}, <span className="text-skillfi-neon text-shadow-gold">{user.username}</span>
                </h1>
                <p className="text-gray-500 text-sm font-display tracking-widest uppercase">Legacy . Wealth . Future</p>
            </header>

            {/* Wisdom Card */}
            <div className="glass-panel p-8 rounded-xl mb-10 border border-skillfi-neon/20 relative overflow-hidden bg-gradient-to-r from-skillfi-neon/5 to-transparent">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-8xl font-serif text-skillfi-neon select-none">❝</div>
                <h3 className="text-skillfi-neon font-bold text-xs uppercase tracking-[0.2em] mb-3">Daily Wisdom</h3>
                <p className="text-xl md:text-3xl font-serif dark:text-white text-slate-800 mb-6 leading-tight italic">"{dailyMotivation.text}"</p>
                <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-skillfi-neon"></span>
                    <span className="text-gray-500 dark:text-gray-300 text-xs font-bold uppercase tracking-wider">{dailyMotivation.action}</span>
                </div>
            </div>

            {/* Influencer Spotlight Widget (New) */}
            <div className="mb-10 w-full" onClick={() => onNavigate('FORBES')}>
                 <div className="glass-panel rounded-2xl overflow-hidden cursor-pointer group relative border border-white/10 hover:border-skillfi-neon/50 transition-all">
                    <div className="flex flex-col md:flex-row">
                        {/* Magazine Cover Section */}
                        <div className="w-full md:w-1/3 relative h-64 md:h-auto overflow-hidden bg-gray-900">
                             <img 
                                src="https://images.pexels.com/photos/11831618/pexels-photo-11831618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                                alt="Person of the Year" 
                                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 grayscale contrast-125"
                             />
                             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                             <div className="absolute top-4 left-0 w-full text-center">
                                 <h2 className="text-4xl font-black font-display text-white tracking-tighter opacity-90 drop-shadow-xl">FORBES</h2>
                             </div>
                             <div className="absolute bottom-4 left-4">
                                 <span className="bg-skillfi-neon text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide mb-1 inline-block">Person of the Year</span>
                                 <h3 className="text-white font-bold text-xl font-display leading-none">Elon Musk</h3>
                             </div>
                        </div>
                        
                        {/* Text / CTA Section */}
                        <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col justify-center bg-gradient-to-r from-black via-[#0a0a0a] to-transparent">
                             <h3 className="text-skillfi-neon font-bold text-xs uppercase tracking-[0.2em] mb-2">Editor's Pick</h3>
                             <h2 className="text-2xl font-bold text-white mb-3">The Architect of Tomorrow</h2>
                             <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                 Dive into the psychology of the world's wealthiest man. Learn how First Principles Thinking can restructure your career path.
                             </p>
                             <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest group-hover:text-skillfi-neon transition-colors">
                                 <span>Read Biography</span>
                                 <span className="group-hover:translate-x-1 transition-transform">→</span>
                             </div>
                        </div>
                    </div>
                 </div>
            </div>

            {/* Main Navigation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                
                {/* CAREER */}
                <div 
                    onClick={() => onNavigate('CAREER')}
                    className="glass-panel p-8 rounded-xl relative overflow-hidden group cursor-pointer transition-all duration-500 hover:border-skillfi-neon/50 hover:bg-skillfi-neon/5"
                >
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                             <h3 className="text-2xl font-bold dark:text-white text-slate-900 font-display tracking-wide">Career Path</h3>
                             <span className="text-3xl group-hover:scale-110 transition-transform duration-500">⚜️</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 font-light leading-relaxed">Strategic guidance for professional ascension. Access high-value skills toolkit.</p>
                        <span className="text-skillfi-neon text-xs font-bold uppercase tracking-[0.2em] border-b border-skillfi-neon/30 pb-1 group-hover:border-skillfi-neon transition-all">Enter Module</span>
                    </div>
                </div>

                {/* FINANCE */}
                <div 
                    onClick={() => onNavigate('FINANCE')}
                    className="glass-panel p-8 rounded-xl relative overflow-hidden group cursor-pointer transition-all duration-500 hover:border-green-500/50 hover:bg-green-500/5"
                >
                    <div className="relative z-10">
                         <div className="flex justify-between items-start mb-6">
                             <h3 className="text-2xl font-bold dark:text-white text-slate-900 font-display tracking-wide">Wealth</h3>
                             <span className="text-3xl group-hover:scale-110 transition-transform duration-500">🏛️</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 font-light leading-relaxed">Asset allocation, tax efficiency, and capital preservation strategies.</p>
                        <span className="text-green-500 dark:text-green-400 text-xs font-bold uppercase tracking-[0.2em] border-b border-green-500/30 pb-1 group-hover:border-green-500 transition-all">Manage Assets</span>
                    </div>
                </div>

                {/* RELATIONSHIPS */}
                <div 
                    onClick={() => onNavigate('RELATIONSHIPS_DASH')}
                    className="glass-panel p-8 rounded-xl relative overflow-hidden group cursor-pointer transition-all duration-500 hover:border-red-500/50 hover:bg-red-500/5"
                >
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                             <h3 className="text-2xl font-bold dark:text-white text-slate-900 font-display tracking-wide">Dynamics</h3>
                             <span className="text-3xl group-hover:scale-110 transition-transform duration-500">❤️</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 font-light leading-relaxed">Interpersonal harmony, rights, and conflict resolution protocols.</p>
                        <span className="text-red-500 dark:text-red-400 text-xs font-bold uppercase tracking-[0.2em] border-b border-red-500/30 pb-1 group-hover:border-red-500 transition-all">View Dynamics</span>
                    </div>
                </div>

                {/* MENTAL HEALTH */}
                <div 
                    onClick={() => onNavigate('MENTAL_HEALTH')}
                    className="glass-panel p-8 rounded-xl relative overflow-hidden group cursor-pointer transition-all duration-500 hover:border-blue-500/50 hover:bg-blue-500/5"
                >
                    <div className="relative z-10">
                         <div className="flex justify-between items-start mb-6">
                             <h3 className="text-2xl font-bold dark:text-white text-slate-900 font-display tracking-wide">Clarity</h3>
                             <span className="text-3xl group-hover:scale-110 transition-transform duration-500">🧠</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 font-light leading-relaxed">Cognitive processing, trauma release, and mental fortitude.</p>
                        <span className="text-blue-500 dark:text-blue-400 text-xs font-bold uppercase tracking-[0.2em] border-b border-blue-500/30 pb-1 group-hover:border-blue-500 transition-all">Clear Mind</span>
                    </div>
                </div>
            </div>
        </div>
    );
};