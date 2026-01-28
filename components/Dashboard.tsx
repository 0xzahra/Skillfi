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
    { text: "Be consistent. Small steps every day add up to massive results.", action: "Do one small task for your career right now." },
    { text: "Discipline is choosing what you want most over what you want now.", action: "Say no to one distraction today." },
    { text: "Learn something new today. Knowledge is the only asset that cannot be stolen.", action: "Read one article about your industry." },
    { text: "Your network is your net worth.", action: "Send a message to a mentor or peer today." },
    { text: "Don't just dream, do.", action: "Write down your 3 goals for the day." }
];

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, currentLang }) => {
    const [greeting, setGreeting] = useState('Hello');
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
            <header className="mb-8">
                <h1 className="text-3xl md:text-5xl font-bold font-display text-white tracking-tighter mb-2 kinetic-type">
                    {greeting}, <span className="text-skillfi-neon text-shadow-neon">{user.username}</span>
                </h1>
                <p className="text-gray-400 text-sm">Let's build your future today.</p>
            </header>

            {/* Motivation Card */}
            <div className="glass-panel p-6 rounded-2xl mb-8 border-l-4 border-l-pink-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl select-none">🔥</div>
                <h3 className="text-pink-500 font-bold text-xs uppercase tracking-widest mb-2">Daily Wisdom</h3>
                <p className="text-xl md:text-2xl font-bold text-white mb-4 leading-tight">"{dailyMotivation.text}"</p>
                <div className="bg-white/5 p-3 rounded-lg inline-block">
                    <span className="text-gray-400 text-xs font-mono uppercase">Action Item:</span>
                    <span className="text-white text-xs font-bold ml-2">{dailyMotivation.action}</span>
                </div>
            </div>

            {/* Main Navigation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                
                {/* CAREER */}
                <div 
                    onClick={() => onNavigate('CAREER')}
                    className="glass-panel p-6 md:p-8 rounded-3xl relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all duration-300 hover:border-skillfi-neon/30"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-skillfi-neon/10 rounded-full blur-[40px] group-hover:bg-skillfi-neon/20 transition-all"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">🚀</span>
                            <h3 className="text-2xl font-bold text-white font-display">Career Path</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">Get guidance, build your toolkit, and master high-class skills.</p>
                        <span className="text-skillfi-neon text-xs font-bold uppercase tracking-wider group-hover:underline">Open Toolkit →</span>
                    </div>
                </div>

                {/* FINANCE */}
                <div 
                    onClick={() => onNavigate('FINANCE')}
                    className="glass-panel p-6 md:p-8 rounded-3xl relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all duration-300 hover:border-green-500/30"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-[40px] group-hover:bg-green-500/20 transition-all"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">💰</span>
                            <h3 className="text-2xl font-bold text-white font-display">Money Mastery</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">Assets, Liabilities, and Luxury. Learn where your money goes.</p>
                        <span className="text-green-400 text-xs font-bold uppercase tracking-wider group-hover:underline">Manage Wealth →</span>
                    </div>
                </div>

                {/* RELATIONSHIPS */}
                <div 
                    onClick={() => onNavigate('RELATIONSHIPS_DASH')}
                    className="glass-panel p-6 md:p-8 rounded-3xl relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all duration-300 hover:border-red-500/30"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[40px] group-hover:bg-red-500/20 transition-all"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">❤️</span>
                            <h3 className="text-2xl font-bold text-white font-display">Relationships</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">Understand rights, duties, and find harmony.</p>
                        <span className="text-red-400 text-xs font-bold uppercase tracking-wider group-hover:underline">Explore Dynamics →</span>
                    </div>
                </div>

                {/* MENTAL HEALTH */}
                <div 
                    onClick={() => onNavigate('MENTAL_HEALTH')}
                    className="glass-panel p-6 md:p-8 rounded-3xl relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all duration-300 hover:border-teal-500/30"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-[40px] group-hover:bg-teal-500/20 transition-all"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">🧠</span>
                            <h3 className="text-2xl font-bold text-white font-display">Mental Wellness</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">Process trauma and clear your mind for growth.</p>
                        <span className="text-teal-400 text-xs font-bold uppercase tracking-wider group-hover:underline">Enter Safe Space →</span>
                    </div>
                </div>
            </div>
        </div>
    );
};