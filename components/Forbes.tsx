
import React, { useState, useEffect } from 'react';
import { fetchForbesRealTime, ForbesProfile } from '../services/geminiService';

// High-quality, reliable imagery for magazine covers
const MAGAZINE_COVERS = [
    {
        id: 'tech',
        category: 'Consumer Technology',
        image: 'https://images.pexels.com/photos/2566581/pexels-photo-2566581.jpeg?auto=compress&cs=tinysrgb&w=800',
        title: '30 UNDER 30: TECH',
        issue: '2025 PREVIEW',
        mainStory: 'The Architects of the New Internet',
        color: 'text-blue-400'
    },
    {
        id: 'finance',
        category: 'Finance',
        image: 'https://images.pexels.com/photos/837140/pexels-photo-837140.jpeg?auto=compress&cs=tinysrgb&w=800',
        title: '30 UNDER 30: FINANCE',
        issue: 'WALL STREET 2.0',
        mainStory: 'DeFi & The Death of Traditional Banking',
        color: 'text-green-400'
    },
    {
        id: 'art',
        category: 'Art & Style',
        image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
        title: '30 UNDER 30: STYLE',
        issue: 'THE CREATOR ECONOMY',
        mainStory: 'How Taste is Monetized',
        color: 'text-pink-400'
    },
    {
        id: 'science',
        category: 'Science',
        image: 'https://images.pexels.com/photos/3735709/pexels-photo-3735709.jpeg?auto=compress&cs=tinysrgb&w=800',
        title: '30 UNDER 30: SCIENCE',
        issue: 'LONGEVITY REVOLUTION',
        mainStory: 'Cheating Death',
        color: 'text-teal-400'
    }
];

export const Forbes: React.FC<{ lastSync?: number }> = ({ lastSync }) => {
    const [activeTab, setActiveTab] = useState<'ISSUES' | 'HALL_OF_FAME' | 'NETWORK'>('ISSUES');
    const [profiles, setProfiles] = useState<ForbesProfile[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Reader State
    const [readingIssue, setReadingIssue] = useState<any | null>(null);
    const [currentPage, setCurrentPage] = useState(0);

    // Fetch Real Data on Mount to populate stories
    useEffect(() => {
        const loadForbes = async () => {
            setLoading(true);
            try {
                const data = await fetchForbesRealTime();
                setProfiles(data);
            } catch (e) {
                console.error("Forbes load failed", e);
            } finally {
                setLoading(false);
            }
        };
        loadForbes();
    }, [lastSync]);

    const openMagazine = (coverData: any) => {
        // Find a matching profile for this category if available, otherwise generic
        const relevantProfile = profiles.find(p => p.category.toLowerCase().includes(coverData.category.toLowerCase())) || profiles[0];
        
        setReadingIssue({
            ...coverData,
            content: relevantProfile
        });
        setCurrentPage(0);
    };

    const handleNextPage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentPage < 3) setCurrentPage(prev => prev + 1);
    };

    const handlePrevPage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentPage > 0) setCurrentPage(prev => prev - 1);
    };

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 font-sans pb-24 touch-pan-y animate-fade-in relative">
            <header className="mb-8 border-b border-skillfi-neon/20 pb-6 flex items-end justify-between">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black font-display text-white tracking-tighter uppercase">
                        Forbes <span className="text-skillfi-neon">30</span> Under <span className="text-skillfi-neon">30</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-mono">The definitive list of young disruptors (Live Data).</p>
                </div>
                <div className="hidden md:block text-right">
                    <div className="text-3xl">🏆</div>
                </div>
            </header>

            {/* Navigation Tabs - Sticky */}
            <div className="sticky top-0 z-30 bg-skillfi-bg/95 backdrop-blur-xl py-4 -mx-4 px-4 border-b border-white/5 mb-8">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    <button 
                        onClick={() => setActiveTab('ISSUES')}
                        className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'ISSUES' ? 'bg-skillfi-neon text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                        Current Issues
                    </button>
                    <button 
                        onClick={() => setActiveTab('HALL_OF_FAME')}
                        className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'HALL_OF_FAME' ? 'bg-skillfi-neon text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                        Hall of Fame
                    </button>
                    <button 
                        onClick={() => setActiveTab('NETWORK')}
                        className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'NETWORK' ? 'bg-skillfi-neon text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                        The Network
                    </button>
                </div>
            </div>

            {/* MAGAZINE READER MODAL */}
            {readingIssue && (
                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center animate-fade-in p-2 md:p-8" onClick={() => setReadingIssue(null)}>
                    <div className="relative w-full max-w-4xl h-full max-h-[85vh] flex flex-col md:flex-row shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden bg-[#111]" onClick={e => e.stopPropagation()}>
                        
                        {/* Close Button */}
                        <button onClick={() => setReadingIssue(null)} className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white text-white hover:text-black p-2 rounded-full transition-colors backdrop-blur-md">✕</button>

                        {/* Page Content Container */}
                        <div className="w-full h-full flex flex-col relative transition-all duration-500 ease-in-out">
                            
                            {/* PAGE 0: COVER */}
                            {currentPage === 0 && (
                                <div className="w-full h-full relative">
                                    <img src={readingIssue.image} alt="Cover" className="w-full h-full object-cover filter brightness-[0.7]" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>
                                    
                                    <div className="absolute top-8 left-0 w-full text-center">
                                        <h2 className="text-6xl md:text-8xl font-black font-display text-white tracking-tighter drop-shadow-2xl">FORBES</h2>
                                    </div>

                                    <div className="absolute bottom-12 left-8 md:left-12 right-12">
                                        <div className="bg-skillfi-neon text-black font-bold text-xs px-3 py-1 inline-block uppercase tracking-widest mb-4 transform -skew-x-12">
                                            {readingIssue.title}
                                        </div>
                                        <h1 className="text-4xl md:text-6xl font-black text-white uppercase leading-[0.9] mb-4 font-display">
                                            {readingIssue.content?.headline || readingIssue.mainStory}
                                        </h1>
                                        <p className="text-gray-300 text-sm md:text-lg font-medium max-w-lg border-l-4 border-skillfi-neon pl-4">
                                            {readingIssue.content?.description || "Exclusive insights into the future of this industry."}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* PAGE 1: INTRO / TOC */}
                            {currentPage === 1 && (
                                <div className="w-full h-full bg-[#0a0a0a] p-8 md:p-16 flex flex-col relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-display font-black text-white select-none">30</div>
                                    
                                    <div className="border-b border-white/20 pb-6 mb-8">
                                        <h3 className="text-skillfi-neon font-bold uppercase tracking-[0.2em] text-sm">Letter from the Editor</h3>
                                        <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 font-display">The Year of the Builder</h2>
                                    </div>

                                    <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide">
                                        <p className="text-gray-400 text-sm leading-relaxed mb-8 font-serif">
                                            Welcome to the {readingIssue.issue} edition of Forbes 30 Under 30. In this issue, we profile the architects of tomorrow. 
                                            From {readingIssue.category} to global infrastructure, these are the minds reshaping our reality.
                                        </p>

                                        <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-4 border-b border-white/10 pb-2">Inside This Issue</h4>
                                        <ul className="space-y-4">
                                            <li className="flex justify-between items-baseline group cursor-pointer">
                                                <span className="text-gray-300 group-hover:text-skillfi-neon transition-colors">01. The New Vanguard</span>
                                                <span className="text-gray-600 text-xs">pg. 3</span>
                                            </li>
                                            <li className="flex justify-between items-baseline group cursor-pointer">
                                                <span className="text-gray-300 group-hover:text-skillfi-neon transition-colors">02. {readingIssue.content?.name || 'Featured Profile'}</span>
                                                <span className="text-gray-600 text-xs">pg. 4</span>
                                            </li>
                                            <li className="flex justify-between items-baseline group cursor-pointer">
                                                <span className="text-gray-300 group-hover:text-skillfi-neon transition-colors">03. Market Trends 2025</span>
                                                <span className="text-gray-600 text-xs">pg. 8</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* PAGE 2: FEATURE STORY */}
                            {currentPage === 2 && (
                                <div className="w-full h-full bg-white text-black p-0 flex flex-col md:flex-row">
                                    <div className="w-full md:w-1/2 h-64 md:h-full relative">
                                        <img src={readingIssue.image} className="w-full h-full object-cover filter grayscale contrast-125" />
                                        <div className="absolute bottom-4 right-4 bg-black text-white text-[10px] px-2 py-1 font-bold uppercase">
                                            {readingIssue.content?.name || 'Visionary'}
                                        </div>
                                    </div>
                                    <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
                                        <span className="text-red-600 font-black text-xs uppercase tracking-widest mb-2 block">Cover Story</span>
                                        <h2 className="text-4xl font-black font-display mb-6 leading-none">
                                            {readingIssue.content?.headline || "Building The Future"}
                                        </h2>
                                        <p className="font-serif text-lg leading-relaxed mb-6 first-letter:text-5xl first-letter:font-bold first-letter:mr-2 first-letter:float-left">
                                            {readingIssue.content?.description || "In a world of constant change, true visionaries don't just adapt—they build. This feature explores the journey of resilience, innovation, and sheer willpower."}
                                        </p>
                                        <p className="font-serif text-sm text-gray-600 leading-relaxed mb-4">
                                            "I never looked at the competition," says {readingIssue.content?.name?.split(' ')[0] || 'the founder'}. "I looked at the problem." This mindset has driven a valuation that defies market trends.
                                        </p>
                                        <div className="border-t border-black/10 pt-4 mt-8">
                                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                                <span>Net Worth: Confidential</span>
                                                <span>Age: Under 30</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* PAGE 3: STATS / BACK COVER */}
                            {currentPage === 3 && (
                                <div className="w-full h-full bg-[#111] p-8 md:p-16 flex flex-col justify-center items-center text-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                                    
                                    <h2 className="text-3xl font-bold text-white font-display mb-12 relative z-10">By The Numbers</h2>
                                    
                                    <div className="grid grid-cols-2 gap-8 w-full max-w-2xl relative z-10">
                                        <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                                            <div className="text-4xl font-black text-skillfi-neon mb-2">600</div>
                                            <div className="text-xs text-gray-400 uppercase tracking-widest">Nominees</div>
                                        </div>
                                        <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                                            <div className="text-4xl font-black text-blue-400 mb-2">$1B+</div>
                                            <div className="text-xs text-gray-400 uppercase tracking-widest">Total Funding</div>
                                        </div>
                                        <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                                            <div className="text-4xl font-black text-pink-400 mb-2">24</div>
                                            <div className="text-xs text-gray-400 uppercase tracking-widest">Avg Age</div>
                                        </div>
                                        <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                                            <div className="text-4xl font-black text-green-400 mb-2">15</div>
                                            <div className="text-xs text-gray-400 uppercase tracking-widest">Industries</div>
                                        </div>
                                    </div>

                                    <div className="mt-16 opacity-50">
                                        <h1 className="text-4xl font-black font-display text-white tracking-widest">FORBES</h1>
                                        <p className="text-[10px] text-gray-600 mt-2 uppercase">© 2025 Forbes Media LLC. All Rights Reserved.</p>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Controls */}
                            <div className="absolute bottom-4 left-0 w-full flex justify-center gap-4 z-50">
                                <button 
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 0}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-all ${currentPage === 0 ? 'opacity-20 cursor-not-allowed bg-black/20' : 'bg-black/50 hover:bg-skillfi-neon hover:text-black text-white'}`}
                                >
                                    ←
                                </button>
                                <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-xs font-mono text-white border border-white/10">
                                    Page {currentPage + 1} / 4
                                </div>
                                <button 
                                    onClick={handleNextPage}
                                    disabled={currentPage === 3}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-all ${currentPage === 3 ? 'opacity-20 cursor-not-allowed bg-black/20' : 'bg-black/50 hover:bg-skillfi-neon hover:text-black text-white'}`}
                                >
                                    →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* LIVE ISSUES LIST */}
            {activeTab === 'ISSUES' && (
                <div className="min-h-[400px]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-fade-in">
                        {MAGAZINE_COVERS.map((issue, idx) => (
                            <div 
                                key={idx}
                                onClick={() => openMagazine(issue)}
                                className="group relative aspect-[3/4] rounded-sm cursor-pointer transition-all duration-500 hover:-translate-y-3 hover:rotate-1"
                                style={{
                                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
                                }}
                            >
                                {/* Spine Effect */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20 z-20"></div>
                                
                                <img 
                                    src={issue.image} 
                                    alt="Cover" 
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-[0.8] contrast-110"
                                />
                                
                                {/* Glossy Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent z-10 pointer-events-none group-hover:opacity-100 opacity-50"></div>
                                
                                {/* Forbes Header */}
                                <div className="absolute top-4 left-0 w-full text-center z-20">
                                    <h2 className="text-3xl font-black font-display text-white tracking-tighter drop-shadow-lg group-hover:text-skillfi-neon transition-colors">FORBES</h2>
                                </div>

                                {/* Cover Content */}
                                <div className="absolute bottom-0 left-0 w-full p-5 z-20">
                                    <div className="inline-block bg-skillfi-neon text-black text-[9px] font-bold px-2 py-0.5 uppercase tracking-wide mb-2">
                                        {issue.issue}
                                    </div>
                                    <h3 className="text-xl font-black text-white uppercase leading-[0.9] mb-2 font-display drop-shadow-md">
                                        {issue.title}
                                    </h3>
                                    <div className="w-8 h-1 bg-white mb-2"></div>
                                    <p className="text-white text-[10px] font-bold uppercase tracking-wider line-clamp-2 drop-shadow-md">
                                        {issue.mainStory}
                                    </p>
                                </div>
                                
                                {/* Shadow/Depth */}
                                <div className="absolute -bottom-2 -right-2 w-full h-full bg-black/50 -z-10 rounded-sm blur-md group-hover:blur-lg transition-all"></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* HALL OF FAME (Static for now, can be upgraded later) */}
            {activeTab === 'HALL_OF_FAME' && (
                <div className="animate-fade-in text-center py-20">
                    <div className="text-6xl mb-4 opacity-20">🏛️</div>
                    <h3 className="text-xl font-bold text-white">Legacy Archives</h3>
                    <p className="text-gray-500 text-sm mt-2">Accessing historical data... (Coming Soon)</p>
                </div>
            )}

            {/* NETWORK TAB */}
            {activeTab === 'NETWORK' && (
                <div className="animate-fade-in max-w-4xl mx-auto">
                    <div className="glass-panel p-8 rounded-2xl mb-8 flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-skillfi-neon/10 to-transparent border border-skillfi-neon/20">
                        <div className="mb-4 md:mb-0">
                            <h2 className="text-2xl font-bold text-white font-display">The 30u30 Community</h2>
                            <p className="text-gray-400 text-sm mt-1">Connect with nominees, listers, and judges.</p>
                        </div>
                        <button className="bg-skillfi-neon text-black px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors shadow-lg">
                            Apply for Nomination
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        {[1,2,3].map((i) => (
                            <div key={i} className="bg-white/5 border border-white/5 hover:border-skillfi-neon/30 p-5 rounded-xl transition-all cursor-pointer group flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300 font-bold uppercase tracking-wide border border-white/5">Networking</span>
                                        <span className="text-[10px] text-gray-500">by @Founder_{i}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-200 group-hover:text-skillfi-neon transition-colors">Nomination Tips for 2025 Class</h3>
                                </div>
                                <div className="text-right pl-4 border-l border-white/5 ml-4">
                                    <div className="text-xl font-bold text-white">42</div>
                                    <div className="text-[10px] text-gray-500 uppercase">Replies</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
