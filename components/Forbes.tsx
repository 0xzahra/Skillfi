import React, { useState } from 'react';

interface IconProfile {
    id: string;
    name: string;
    title: string;
    netWorth: string;
    summary: string;
    image: string;
    coverColor: string;
    superpower: string;
}

export const Forbes: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'COVERS' | 'BOARDROOM' | 'ARCHIVES'>('COVERS');
    const [activeIcon, setActiveIcon] = useState<IconProfile | null>(null);

    // Mock Data
    const forumTopics = [
        { id: 1, title: "The Future of AI Regulation", author: "TechTitan_01", replies: 142, active: true },
        { id: 2, title: "Sustainable Energy: Hydrogen vs Electric", author: "GreenBull", replies: 89, active: false },
        { id: 3, title: "Space Mining: Feasibility Study", author: "StarLord", replies: 256, active: true },
        { id: 4, title: "Biotech: Extending Human Lifespan", author: "GeneHack", replies: 67, active: false }
    ];

    const archives = [
        { year: 1999, title: "The Internet Age", img: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80" },
        { year: 2008, title: "Financial Crisis", img: "https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&w=600&q=80" },
        { year: 2012, title: "Social Media Boom", img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80" },
        { year: 2020, title: "Pandemic Shift", img: "https://images.unsplash.com/photo-1584036561566-b93a50208c3c?auto=format&fit=crop&w=600&q=80" }
    ];

    const icons: IconProfile[] = [
        {
            id: '1',
            name: 'Elon Musk',
            title: 'Technoking of Tesla',
            netWorth: '$250B+',
            summary: "Elon Musk (born June 28, 1971) is a business magnate and investor. He is the founder, CEO, and Chief Engineer at SpaceX; angel investor, CEO, and Product Architect of Tesla, Inc.; owner and CTO of Twitter (now X); founder of The Boring Company and xAI; and co-founder of Neuralink and OpenAI.",
            image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=800&q=80",
            coverColor: "from-blue-900 to-black",
            superpower: "First Principles Thinking"
        },
        {
            id: '2',
            name: 'Oprah Winfrey',
            title: 'Media Mogul',
            netWorth: '$2.8B',
            summary: "Oprah Gail Winfrey (born January 29, 1954) is an American talk show host, television producer, actress, author, and media proprietor. She overcame poverty and trauma to become the first black multi-billionaire in North America.",
            image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=800&q=80",
            coverColor: "from-purple-900 to-black",
            superpower: "Radical Empathy"
        },
        {
            id: '3',
            name: 'Bernard Arnault',
            title: 'Chairman of LVMH',
            netWorth: '$190B',
            summary: "Bernard Jean Étienne Arnault (born 5 March 1949) is a French business magnate, investor, and art collector. He is the co-founder, chairman, and chief executive officer of LVMH Moët Hennessy – Louis Vuitton SE.",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
            coverColor: "from-yellow-900 to-black",
            superpower: "Luxury Brand Architecture"
        },
        {
            id: '4',
            name: 'Jay-Z',
            title: 'Hip-Hop Billionaire',
            netWorth: '$2.5B',
            summary: "Shawn Corey Carter (born December 4, 1969), known professionally as Jay-Z, is an American rapper, record executive, and media proprietor. Regarded as one of the greatest rappers of all time.",
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
            coverColor: "from-gray-900 to-black",
            superpower: "Cultural Capital Monetization"
        }
    ];

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 font-sans pb-24 touch-pan-y animate-fade-in relative">
            <header className="mb-8 border-b border-skillfi-neon/20 pb-6 flex items-end justify-between">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black font-display text-white tracking-tighter uppercase">
                        Forbes <span className="text-skillfi-neon">&</span> Icons
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-mono">The Billionaire Biography Database</p>
                </div>
                <div className="hidden md:block text-right">
                    <div className="text-3xl">🏛️</div>
                </div>
            </header>

            {/* Navigation Tabs - Sticky */}
            <div className="sticky top-0 z-30 bg-skillfi-bg/95 backdrop-blur-xl py-4 -mx-4 px-4 border-b border-white/5 mb-8">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    <button 
                        onClick={() => setActiveTab('COVERS')}
                        className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'COVERS' ? 'bg-skillfi-neon text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                        Cover Stories
                    </button>
                    <button 
                        onClick={() => setActiveTab('BOARDROOM')}
                        className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'BOARDROOM' ? 'bg-skillfi-neon text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                        The Boardroom
                    </button>
                    <button 
                        onClick={() => setActiveTab('ARCHIVES')}
                        className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'ARCHIVES' ? 'bg-skillfi-neon text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                        Archives
                    </button>
                </div>
            </div>

            {/* Modal for Details */}
            {activeIcon && (
                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl p-4 flex flex-col items-center justify-center animate-fade-in overflow-y-auto">
                    <div className="glass-panel w-full max-w-4xl rounded-2xl p-0 relative overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setActiveIcon(null)} className="absolute top-4 right-4 z-20 bg-black/50 p-2 rounded-full text-white hover:text-skillfi-neon transition-colors">✕</button>
                        
                        {/* Image Side */}
                        <div className="w-full md:w-1/3 h-64 md:h-auto relative">
                            <img src={activeIcon.image} alt={activeIcon.name} className="w-full h-full object-cover filter brightness-75 grayscale contrast-125" />
                            <div className={`absolute inset-0 bg-gradient-to-t ${activeIcon.coverColor} opacity-60 mix-blend-multiply`}></div>
                            <div className="absolute bottom-4 left-4">
                                <h2 className="text-3xl font-black font-display text-white uppercase leading-none">{activeIcon.name}</h2>
                                <p className="text-skillfi-neon font-bold text-xs uppercase tracking-widest mt-1">{activeIcon.title}</p>
                            </div>
                        </div>

                        {/* Content Side */}
                        <div className="w-full md:w-2/3 p-8 bg-black/80">
                            <div className="grid grid-cols-2 gap-4 mb-8 border-b border-white/10 pb-6">
                                <div>
                                    <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Estimated Net Worth</span>
                                    <div className="text-3xl font-mono text-green-400 font-bold">{activeIcon.netWorth}</div>
                                </div>
                                <div>
                                    <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Superpower</span>
                                    <div className="text-xl font-display text-white">{activeIcon.superpower}</div>
                                </div>
                            </div>
                            
                            <h3 className="text-white font-bold uppercase text-sm mb-4">Biography & Impact</h3>
                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-serif">
                                {activeIcon.summary}
                            </p>

                            <div className="mt-8 flex gap-4">
                                <button className="px-6 py-3 bg-white text-black font-bold uppercase text-xs tracking-widest rounded hover:bg-skillfi-neon transition-colors">
                                    Read Full Profile
                                </button>
                                <button className="px-6 py-3 border border-white/20 text-white font-bold uppercase text-xs tracking-widest rounded hover:bg-white/10 transition-colors">
                                    View Assets
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* COVERS TAB */}
            {activeTab === 'COVERS' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
                    {icons.map((icon) => (
                        <div 
                            key={icon.id}
                            onClick={() => setActiveIcon(icon)}
                            className="group relative aspect-[3/4] bg-gray-900 rounded-xl overflow-hidden cursor-pointer shadow-2xl transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:-translate-y-2"
                        >
                            <img 
                                src={icon.image} 
                                alt={icon.name} 
                                className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125 transition-transform duration-700 group-hover:scale-110 group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 opacity-90"></div>
                            <div className="absolute top-4 left-0 w-full text-center">
                                <h2 className="text-4xl font-black font-display text-white tracking-tighter drop-shadow-lg opacity-90 group-hover:text-skillfi-neon transition-colors">FORBES</h2>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent">
                                <div className="w-10 h-1 bg-skillfi-neon mb-4"></div>
                                <h3 className="text-2xl font-bold text-white uppercase leading-none mb-1 font-display">{icon.name}</h3>
                                <p className="text-gray-300 text-xs font-bold uppercase tracking-wider">{icon.title}</p>
                                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 text-skillfi-neon text-xs font-bold uppercase tracking-widest">
                                    <span>Read Bio</span>
                                    <span>→</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* BOARDROOM TAB */}
            {activeTab === 'BOARDROOM' && (
                <div className="animate-fade-in max-w-4xl mx-auto">
                    <div className="glass-panel p-6 rounded-2xl mb-6 flex justify-between items-center bg-skillfi-neon/5 border-skillfi-neon/20">
                        <div>
                            <h2 className="text-xl font-bold text-white">The Boardroom</h2>
                            <p className="text-gray-400 text-xs mt-1">Join the conversation with industry leaders.</p>
                        </div>
                        <button className="bg-skillfi-neon text-black px-6 py-2 rounded-lg font-bold text-xs uppercase hover:bg-white transition-colors">
                            Start Thread
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        {forumTopics.map((topic) => (
                            <div key={topic.id} className="bg-white/5 border border-white/5 hover:border-skillfi-neon/30 p-5 rounded-xl transition-all cursor-pointer group">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-bold text-gray-200 group-hover:text-skillfi-neon transition-colors">{topic.title}</h3>
                                    {topic.active && (
                                        <span className="flex items-center gap-1 text-[10px] text-green-400 uppercase font-bold tracking-wider">
                                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                            Live
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        👤 {topic.author}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        💬 {topic.replies} Replies
                                    </span>
                                    <button className="ml-auto text-skillfi-neon hover:underline">Join Discussion →</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ARCHIVES TAB */}
            {activeTab === 'ARCHIVES' && (
                <div className="animate-fade-in">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {archives.map((issue, idx) => (
                            <div key={idx} className="group cursor-pointer">
                                <div className="aspect-[3/4] bg-gray-800 rounded-lg overflow-hidden border border-white/10 relative">
                                    <img src={issue.img} alt={issue.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" />
                                    <div className="absolute top-2 left-0 w-full text-center">
                                        <span className="font-display font-black text-white text-xl tracking-tighter drop-shadow-md">FORBES</span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-full bg-black/80 p-2 text-center">
                                        <span className="text-white text-xs font-bold uppercase">{issue.year}</span>
                                    </div>
                                </div>
                                <h4 className="text-white font-bold text-xs mt-3 text-center uppercase tracking-wide group-hover:text-skillfi-neon">{issue.title}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};