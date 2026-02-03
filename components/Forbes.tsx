import React, { useState } from 'react';

interface MagazineCover {
    id: string;
    category: string;
    year: string;
    headline: string;
    featuredPerson: string;
    image: string;
    color: string;
}

interface AlumniProfile {
    id: string;
    name: string;
    listYear: string;
    category: string;
    company: string;
    netWorth?: string;
    bio: string;
    image: string;
    quote: string;
}

export const Forbes: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'ISSUES' | 'HALL_OF_FAME' | 'NETWORK'>('ISSUES');
    const [selectedAlumni, setSelectedAlumni] = useState<AlumniProfile | null>(null);

    // Mock Data: Magazine Covers (Categories)
    const covers: MagazineCover[] = [
        {
            id: '1',
            category: 'Consumer Tech',
            year: '2024',
            headline: "Building The Future",
            featuredPerson: "Alexandr Wang",
            image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
            color: "from-blue-600 to-black"
        },
        {
            id: '2',
            category: 'Finance',
            year: '2024',
            headline: "The New Capitalists",
            featuredPerson: "Henrique Dubugras",
            image: "https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&w=800&q=80",
            color: "from-green-600 to-black"
        },
        {
            id: '3',
            category: 'Art & Style',
            year: '2024',
            headline: "Designing Culture",
            featuredPerson: "Zendaya",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
            color: "from-purple-600 to-black"
        },
        {
            id: '4',
            category: 'Enterprise Tech',
            year: '2024',
            headline: "Cloud Architects",
            featuredPerson: "Dylan Field",
            image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
            color: "from-indigo-600 to-black"
        },
        {
            id: '5',
            category: 'Music',
            year: '2024',
            headline: "Sonic Boom",
            featuredPerson: "Bad Bunny",
            image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
            color: "from-pink-600 to-black"
        },
        {
            id: '6',
            category: 'Science',
            year: '2024',
            headline: "Solving Impossible",
            featuredPerson: "Boyan Slat",
            image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
            color: "from-teal-600 to-black"
        },
        {
            id: '7',
            category: 'Social Impact',
            year: '2024',
            headline: "Change Makers",
            featuredPerson: "Malala",
            image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=800&q=80",
            color: "from-yellow-600 to-black"
        },
        {
            id: '8',
            category: 'Sports',
            year: '2024',
            headline: "Game Changers",
            featuredPerson: "Naomi Osaka",
            image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80",
            color: "from-orange-600 to-black"
        }
    ];

    // Mock Data: Hall of Fame
    const alumni: AlumniProfile[] = [
        {
            id: 'a1',
            name: 'Vitalik Buterin',
            listYear: '2018',
            category: 'Finance',
            company: 'Ethereum',
            netWorth: '$1B+',
            image: "https://images.unsplash.com/photo-1621504450168-38f647319665?auto=format&fit=crop&w=800&q=80",
            bio: "Co-founder of Ethereum. Vitalik's vision for a decentralized world computer revolutionized blockchain technology and spawned the DeFi and NFT ecosystems.",
            quote: "I happily played World of Warcraft during 2007-2010, but one day Blizzard removed the damage component from my beloved warlock's Siphon Life spell. I cried myself to sleep, and on that day I realized what horrors centralized services can bring."
        },
        {
            id: 'a2',
            name: 'Melanie Perkins',
            listYear: '2016',
            category: 'Consumer Tech',
            company: 'Canva',
            netWorth: '$6.5B',
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
            bio: "Co-founder and CEO of Canva. Started in her mother's living room, she democratized design for the world, building one of the most valuable private software companies.",
            quote: "Solve a problem that affects a lot of people."
        },
        {
            id: 'a3',
            name: 'Dylan Field',
            listYear: '2015',
            category: 'Enterprise Tech',
            company: 'Figma',
            netWorth: '$2B+',
            image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=800&q=80",
            bio: "Co-founder of Figma. A Thiel Fellow who dropped out of Brown University to create a design tool that allows for real-time collaboration in the browser.",
            quote: "Design is not just about making things look good. It's about how things work."
        },
        {
            id: 'a4',
            name: 'Rihanna',
            listYear: '2012',
            category: 'Music',
            company: 'Fenty Beauty',
            netWorth: '$1.4B',
            image: "https://images.unsplash.com/photo-1616787383679-b700f7356263?auto=format&fit=crop&w=800&q=80",
            bio: "Musician turned billionaire entrepreneur. Revolutionized the beauty industry with Fenty Beauty by prioritizing inclusivity and diversity.",
            quote: "It's not about the money. It's about the freedom to create."
        }
    ];

    const forumTopics = [
        { id: 1, title: "Scaling to Series A in 2024", author: "Founder_Jane", replies: 42, tag: "Startup" },
        { id: 2, title: "Applying for 30u30: Tips?", author: "NextGen_Dev", replies: 156, tag: "Nomination" },
        { id: 3, title: "DeepTech vs SaaS for new founders", author: "TechLead_99", replies: 89, tag: "Strategy" },
        { id: 4, title: "Mental Health for High Performers", author: "WellnessCoach", replies: 203, tag: "Wellness" }
    ];

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 font-sans pb-24 touch-pan-y animate-fade-in relative">
            <header className="mb-8 border-b border-skillfi-neon/20 pb-6 flex items-end justify-between">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black font-display text-white tracking-tighter uppercase">
                        Forbes <span className="text-skillfi-neon">30</span> Under <span className="text-skillfi-neon">30</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-mono">The definitive list of young disruptors.</p>
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
                        2024 Lists
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

            {/* ALUMNI PROFILE MODAL */}
            {selectedAlumni && (
                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl p-4 flex flex-col items-center justify-center animate-fade-in overflow-y-auto">
                    <div className="glass-panel w-full max-w-4xl rounded-2xl p-0 relative overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedAlumni(null)} className="absolute top-4 right-4 z-20 bg-black/50 p-2 rounded-full text-white hover:text-skillfi-neon transition-colors">✕</button>
                        
                        {/* Image Side */}
                        <div className="w-full md:w-2/5 h-80 md:h-auto relative">
                            <img src={selectedAlumni.image} alt={selectedAlumni.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                            <div className="absolute bottom-4 left-4">
                                <div className="bg-skillfi-neon text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide mb-1 inline-block">Class of {selectedAlumni.listYear}</div>
                                <h2 className="text-3xl font-black font-display text-white uppercase leading-none">{selectedAlumni.name}</h2>
                                <p className="text-gray-300 font-bold text-xs uppercase tracking-widest mt-1">{selectedAlumni.company}</p>
                            </div>
                        </div>

                        {/* Content Side */}
                        <div className="w-full md:w-3/5 p-8 bg-black/80 flex flex-col justify-center">
                            <div className="mb-6">
                                <span className="text-7xl font-serif text-skillfi-neon/20 absolute -mt-8 -ml-4">“</span>
                                <p className="text-lg font-serif text-white italic relative z-10 leading-relaxed">
                                    {selectedAlumni.quote}
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-6 border-y border-white/10 py-4">
                                <div>
                                    <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Category</span>
                                    <div className="text-sm font-bold text-white">{selectedAlumni.category}</div>
                                </div>
                                <div>
                                    <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Net Worth</span>
                                    <div className="text-sm font-bold text-green-400">{selectedAlumni.netWorth || 'Undisclosed'}</div>
                                </div>
                            </div>
                            
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                {selectedAlumni.bio}
                            </p>

                            <div className="flex gap-4">
                                <button className="px-6 py-3 bg-white text-black font-bold uppercase text-xs tracking-widest rounded hover:bg-skillfi-neon transition-colors w-full">
                                    View Full Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MAGAZINE ISSUES (CATEGORIES) */}
            {activeTab === 'ISSUES' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                    {covers.map((cover) => (
                        <div 
                            key={cover.id}
                            className="group relative aspect-[3/4] bg-gray-900 rounded-xl overflow-hidden cursor-pointer shadow-2xl transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:-translate-y-2 border border-white/5"
                        >
                            <img 
                                src={cover.image} 
                                alt={cover.category} 
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-[0.8] contrast-125"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-t ${cover.color} opacity-60 mix-blend-multiply`}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 opacity-90"></div>
                            
                            {/* Forbes Header */}
                            <div className="absolute top-4 left-0 w-full text-center">
                                <h2 className="text-3xl font-black font-display text-white tracking-tighter drop-shadow-lg group-hover:text-skillfi-neon transition-colors">FORBES</h2>
                                <div className="flex justify-between px-6 mt-1 text-[8px] font-bold text-white/80 uppercase tracking-widest border-b border-white/20 pb-1 mx-4">
                                    <span>30 Under 30</span>
                                    <span>{cover.year}</span>
                                </div>
                            </div>

                            {/* Cover Content */}
                            <div className="absolute bottom-0 left-0 w-full p-5">
                                <div className="inline-block bg-white text-black text-[9px] font-bold px-2 py-0.5 uppercase tracking-wide mb-2 transform -skew-x-12">
                                    {cover.category}
                                </div>
                                <h3 className="text-2xl font-black text-white uppercase leading-none mb-1 font-display drop-shadow-md">
                                    {cover.headline}
                                </h3>
                                <div className="h-px w-10 bg-skillfi-neon my-2"></div>
                                <p className="text-gray-200 text-xs font-bold uppercase tracking-wider">
                                    Feat. {cover.featuredPerson}
                                </p>
                                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 text-skillfi-neon text-[10px] font-bold uppercase tracking-widest">
                                    <span>Open List</span>
                                    <span>→</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* HALL OF FAME */}
            {activeTab === 'HALL_OF_FAME' && (
                <div className="animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {alumni.map((alum) => (
                            <div 
                                key={alum.id} 
                                onClick={() => setSelectedAlumni(alum)}
                                className="bg-white/5 border border-white/5 hover:border-skillfi-neon/50 p-4 rounded-xl cursor-pointer group transition-all"
                            >
                                <div className="aspect-square rounded-lg overflow-hidden mb-4 relative">
                                    <img src={alum.image} alt={alum.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-skillfi-neon border border-skillfi-neon/20">
                                        {alum.listYear}
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-white font-display group-hover:text-skillfi-neon transition-colors">{alum.name}</h3>
                                <p className="text-xs text-gray-400 font-mono uppercase mt-1">{alum.company}</p>
                                <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-500 border-t border-white/5 pt-2">
                                    <span className="w-2 h-2 bg-skillfi-neon rounded-full"></span>
                                    {alum.category}
                                </div>
                            </div>
                        ))}
                    </div>
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
                        {forumTopics.map((topic) => (
                            <div key={topic.id} className="bg-white/5 border border-white/5 hover:border-skillfi-neon/30 p-5 rounded-xl transition-all cursor-pointer group flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300 font-bold uppercase tracking-wide border border-white/5">{topic.tag}</span>
                                        <span className="text-[10px] text-gray-500">by @{topic.author}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-200 group-hover:text-skillfi-neon transition-colors">{topic.title}</h3>
                                </div>
                                <div className="text-right pl-4 border-l border-white/5 ml-4">
                                    <div className="text-xl font-bold text-white">{topic.replies}</div>
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