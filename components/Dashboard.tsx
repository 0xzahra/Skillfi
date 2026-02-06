
import React, { useState, useEffect } from 'react';
import { UserProfile, LanguageCode } from '../types';
import { t } from '../translations';

interface DashboardProps {
    user: UserProfile;
    onNavigate: (view: string) => void;
    onAddSkill?: (skill: string) => void;
    currentLang: LanguageCode;
    onScout?: (hobbies: string) => void;
}

const MOTIVATIONS = [
    { text: "Consistency is the hallmark of the elite.", action: "Execute one task." },
    { text: "Wealth is quiet. Rich is loud.", action: "Review your assets." },
    { text: "Knowledge is the only currency that appreciates.", action: "Learn something new." },
    { text: "Your network defines your net worth.", action: "Connect with a peer." },
    { text: "Discipline weighs ounces, regret weighs tons.", action: "Plan your day." }
];

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, currentLang, onScout }) => {
    const [greeting, setGreeting] = useState('Welcome');
    const [dailyMotivation, setDailyMotivation] = useState(MOTIVATIONS[0]);
    const [hobbyInput, setHobbyInput] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good Morning");
        else if (hour < 18) setGreeting("Good Afternoon");
        else setGreeting("Good Evening");

        setDailyMotivation(MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]);
    }, []);

    const handleScoutSubmit = () => {
        if (hobbyInput.trim() && onScout) {
            onScout(hobbyInput);
        }
    };

    return (
        <div className="p-6 md:p-12 h-full overflow-y-auto pb-24 font-sans scrollbar-hide touch-pan-y bg-skillfi-bg">
            {/* Header */}
            <header className="mb-12 text-center md:text-left border-b border-skillfi-border pb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-skillfi-accent tracking-tight mb-2 animate-slide-up">
                    {greeting}, <span className="text-skillfi-neon">{user.username}</span>
                </h1>
                <p className="text-skillfi-dim text-sm font-medium tracking-wide uppercase mt-2">The Career and Financial Guidance Counselor</p>
            </header>

            {/* Wisdom Card */}
            <div className="glass-panel p-8 rounded-2xl mb-12 relative overflow-hidden group hover:shadow-lg transition-all duration-500">
                <div className="absolute top-0 right-0 p-6 opacity-5 text-9xl font-serif text-skillfi-neon select-none">❝</div>
                <h3 className="text-skillfi-neon font-bold text-xs uppercase tracking-widest mb-4">Daily Wisdom</h3>
                <p className="text-xl md:text-3xl font-serif text-skillfi-text mb-8 leading-snug italic">"{dailyMotivation.text}"</p>
                <div className="flex items-center gap-3">
                    <span className="h-px w-12 bg-skillfi-neon"></span>
                    <span className="text-skillfi-dim text-xs font-bold uppercase tracking-widest">{dailyMotivation.action}</span>
                </div>
            </div>

            {/* INSTANT ROLE SCOUT */}
            <div className="mb-12 glass-panel p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-skillfi-border shadow-sm">
                <h3 className="text-skillfi-accent font-bold text-xl mb-3 flex items-center gap-3">
                    <span className="text-2xl p-2 bg-skillfi-bg rounded-full shadow-sm">🎯</span> Instant Role Scout
                </h3>
                <p className="text-skillfi-text text-sm mb-6 max-w-2xl leading-relaxed">Drop your hobbies or passions below. We'll instantly assign a tailored Web2 and Web3 role that fits your personality.</p>
                <div className="flex gap-3">
                    <input 
                        type="text" 
                        value={hobbyInput}
                        onChange={(e) => setHobbyInput(e.target.value)}
                        placeholder="e.g. I love gaming, solving puzzles, and drawing..." 
                        onKeyDown={(e) => e.key === 'Enter' && handleScoutSubmit()}
                        className="flex-1 bg-white border border-skillfi-border rounded-xl px-6 py-4 text-skillfi-text focus:border-skillfi-neon focus:ring-2 focus:ring-skillfi-neon/10 outline-none text-base placeholder-skillfi-dim transition-all shadow-inner"
                    />
                    <button 
                        onClick={handleScoutSubmit}
                        className="bg-skillfi-neon text-white px-8 rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform active:scale-95"
                    >
                        Analyze
                    </button>
                </div>
            </div>

            {/* Main Navigation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                
                {/* CAREER */}
                <div 
                    onClick={() => onNavigate('CAREER')}
                    className="glass-panel-interactive bg-white p-8 rounded-2xl cursor-pointer relative overflow-hidden group border border-skillfi-border"
                >
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                             <h3 className="text-2xl font-bold text-skillfi-accent tracking-tight">Career Path</h3>
                             <span className="text-3xl text-skillfi-neon bg-skillfi-bg p-3 rounded-full">⚜️</span>
                        </div>
                        <p className="text-skillfi-text text-sm mb-8 font-medium leading-relaxed opacity-80">Strategic guidance for professional ascension. Access high-value skills toolkit.</p>
                        <span className="text-skillfi-neon text-xs font-bold uppercase tracking-widest border-b-2 border-transparent group-hover:border-skillfi-neon pb-1 transition-all">Enter Module &rarr;</span>
                    </div>
                </div>

                {/* FINANCE */}
                <div 
                    onClick={() => onNavigate('FINANCE')}
                    className="glass-panel-interactive bg-white p-8 rounded-2xl cursor-pointer relative overflow-hidden group border border-skillfi-border"
                >
                    <div className="relative z-10">
                         <div className="flex justify-between items-start mb-6">
                             <h3 className="text-2xl font-bold text-skillfi-accent tracking-tight">Wealth</h3>
                             <span className="text-3xl text-skillfi-success bg-skillfi-bg p-3 rounded-full">🏛️</span>
                        </div>
                        <p className="text-skillfi-text text-sm mb-8 font-medium leading-relaxed opacity-80">Asset allocation, tax efficiency, and capital preservation strategies.</p>
                        <span className="text-skillfi-success text-xs font-bold uppercase tracking-widest border-b-2 border-transparent group-hover:border-skillfi-success pb-1 transition-all">Manage Assets &rarr;</span>
                    </div>
                </div>

                {/* MENTAL HEALTH */}
                <div 
                    onClick={() => onNavigate('MENTAL_HEALTH')}
                    className="glass-panel-interactive bg-white p-8 rounded-2xl cursor-pointer relative overflow-hidden group border border-skillfi-border md:col-span-2 lg:col-span-1"
                >
                    <div className="relative z-10">
                         <div className="flex justify-between items-start mb-6">
                             <h3 className="text-2xl font-bold text-skillfi-accent tracking-tight">Clarity</h3>
                             <span className="text-3xl text-blue-400 bg-skillfi-bg p-3 rounded-full">🧠</span>
                        </div>
                        <p className="text-skillfi-text text-sm mb-8 font-medium leading-relaxed opacity-80">Cognitive processing, trauma release, and mental fortitude.</p>
                        <span className="text-blue-400 text-xs font-bold uppercase tracking-widest border-b-2 border-transparent group-hover:border-blue-400 pb-1 transition-all">Clear Mind &rarr;</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
