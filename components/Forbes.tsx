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
    const [activeIcon, setActiveIcon] = useState<IconProfile | null>(null);

    const icons: IconProfile[] = [
        {
            id: '1',
            name: 'Elon Musk',
            title: 'Technoking of Tesla',
            netWorth: '$250B+',
            summary: "Elon Musk (born June 28, 1971) is a business magnate and investor. He is the founder, CEO, and Chief Engineer at SpaceX; angel investor, CEO, and Product Architect of Tesla, Inc.; owner and CTO of Twitter (now X); founder of The Boring Company and xAI; and co-founder of Neuralink and OpenAI. He is the wealthiest person in the world.\n\nHis vision is centered on solving problems that affect the future of humanity: transitioning to sustainable energy (Tesla), multi-planetary existence (SpaceX), and safe AI.",
            image: "https://images.pexels.com/photos/11831618/pexels-photo-11831618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            coverColor: "from-blue-900 to-black",
            superpower: "First Principles Thinking"
        },
        {
            id: '2',
            name: 'Oprah Winfrey',
            title: 'Media Mogul',
            netWorth: '$2.8B',
            summary: "Oprah Gail Winfrey (born January 29, 1954) is an American talk show host, television producer, actress, author, and media proprietor. She is best known for her talk show, The Oprah Winfrey Show, broadcast from Chicago, which was the highest-rated television program of its kind in history and ran in national syndication for 25 years.\n\nShe overcame poverty and trauma to become the first black multi-billionaire in North America and has been ranked the greatest black philanthropist in American history.",
            image: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            coverColor: "from-purple-900 to-black",
            superpower: "Radical Empathy"
        },
        {
            id: '3',
            name: 'Bernard Arnault',
            title: 'Chairman of LVMH',
            netWorth: '$190B',
            summary: "Bernard Jean Étienne Arnault (born 5 March 1949) is a French business magnate, investor, and art collector. He is the co-founder, chairman, and chief executive officer of LVMH Moët Hennessy – Louis Vuitton SE, the world's largest luxury goods company.\n\nHis empire includes 75 fashion and cosmetics brands, including Louis Vuitton and Sephora. He is known for his ruthless attention to detail and ability to revitalize heritage brands while maintaining their aura of exclusivity.",
            image: "https://images.pexels.com/photos/3778603/pexels-photo-3778603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            coverColor: "from-yellow-900 to-black",
            superpower: "Luxury Brand Architecture"
        },
        {
            id: '4',
            name: 'Jay-Z',
            title: 'Hip-Hop Billionaire',
            netWorth: '$2.5B',
            summary: "Shawn Corey Carter (born December 4, 1969), known professionally as Jay-Z, is an American rapper, record executive, and media proprietor. Regarded as one of the greatest rappers of all time, he has been central to the creative and commercial success of artists including Kanye West, Rihanna, and J. Cole.\n\nBeyond music, his business acumen spans clothing lines (Rocawear), beverages (Armand de Brignac), sports agencies (Roc Nation Sports), and tech investments (Uber, Square).",
            image: "https://images.pexels.com/photos/2092450/pexels-photo-2092450.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
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

            {/* Latest Issues / Covers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {icons.map((icon) => (
                    <div 
                        key={icon.id}
                        onClick={() => setActiveIcon(icon)}
                        className="group relative aspect-[3/4] bg-gray-900 rounded-xl overflow-hidden cursor-pointer shadow-2xl transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:-translate-y-2"
                    >
                        {/* Background Image */}
                        <img 
                            src={icon.image} 
                            alt={icon.name} 
                            className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125 transition-transform duration-700 group-hover:scale-110 group-hover:grayscale-0"
                        />
                        
                        {/* Magazine Overlay Styling */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 opacity-90"></div>
                        
                        {/* Forbes Header Placement */}
                        <div className="absolute top-4 left-0 w-full text-center">
                            <h2 className="text-4xl font-black font-display text-white tracking-tighter drop-shadow-lg opacity-90 group-hover:text-skillfi-neon transition-colors">FORBES</h2>
                        </div>

                        {/* Text Content */}
                        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent">
                            <div className="w-10 h-1 bg-skillfi-neon mb-4"></div>
                            <h3 className="text-2xl font-bold text-white uppercase leading-none mb-1 font-display">{icon.name}</h3>
                            <p className="text-gray-300 text-xs font-bold uppercase tracking-wider">{icon.title}</p>
                            
                            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 text-skillfi-neon text-xs font-bold uppercase tracking-widest">
                                <span>Read Bio</span>
                                <span>→</span>
                            </div>
                        </div>

                        {/* Barcode Decal */}
                        <div className="absolute bottom-4 right-4 bg-white px-1 py-0.5 opacity-70">
                            <div className="flex gap-[1px] h-6 items-end">
                                {[...Array(20)].map((_,i) => (
                                    <div key={i} className="bg-black w-[1px]" style={{height: `${Math.random() * 100}%`}}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Historical Archive Section */}
            <div className="mt-16">
                <h3 className="text-2xl font-bold font-display text-white mb-6 border-b border-white/10 pb-2">Historical Archives</h3>
                <div className="bg-white/5 border border-white/10 rounded-xl p-8 flex flex-col md:flex-row items-center gap-8">
                     <div className="w-full md:w-1/4 aspect-[3/4] bg-gray-800 rounded relative overflow-hidden shadow-lg rotate-[-2deg] border-4 border-white/10">
                        <img src="https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" className="w-full h-full object-cover grayscale" alt="Historical" />
                        <div className="absolute top-2 left-0 w-full text-center text-white font-black font-display text-xl">FORBES</div>
                     </div>
                     <div className="flex-1">
                        <h4 className="text-xl font-bold text-white mb-2">The Titans of Industry (1900-1950)</h4>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Explore the biographies of Rockefeller, Carnegie, Ford, and J.P. Morgan. Understand how the foundations of modern capitalism were built through steel, oil, and rail.
                        </p>
                        <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded uppercase font-bold text-xs tracking-widest border border-white/10 transition-colors">
                            Access Vault
                        </button>
                     </div>
                </div>
            </div>
        </div>
    );
};
