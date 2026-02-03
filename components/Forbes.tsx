import React, { useState, useEffect } from 'react';
import { fetchForbesRealTime, ForbesProfile } from '../services/geminiService';

export const Forbes: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'ISSUES' | 'HALL_OF_FAME' | 'NETWORK'>('ISSUES');
    const [profiles, setProfiles] = useState<ForbesProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProfile, setSelectedProfile] = useState<ForbesProfile | null>(null);

    // Fetch Real Data on Mount
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
    }, []);

    // Placeholder images for dynamic content since we can't easily get real images of people without more advanced scraping
    const placeholderImages = [
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80"
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
                        Current Class
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

            {/* PROFILE DETAIL MODAL */}
            {selectedProfile && (
                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl p-4 flex flex-col items-center justify-center animate-fade-in overflow-y-auto">
                    <div className="glass-panel w-full max-w-4xl rounded-2xl p-0 relative overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedProfile(null)} className="absolute top-4 right-4 z-20 bg-black/50 p-2 rounded-full text-white hover:text-skillfi-neon transition-colors">✕</button>
                        
                        {/* Image Side */}
                        <div className="w-full md:w-2/5 h-80 md:h-auto relative bg-gray-900">
                            {/* Using generic abstract or silhouette since real images are protected */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-20 text-9xl">👤</div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                            <div className="absolute bottom-4 left-4">
                                <div className="bg-skillfi-neon text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide mb-1 inline-block">Featured</div>
                                <h2 className="text-3xl font-black font-display text-white uppercase leading-none">{selectedProfile.name}</h2>
                                <p className="text-gray-300 font-bold text-xs uppercase tracking-widest mt-1">{selectedProfile.category}</p>
                            </div>
                        </div>

                        {/* Content Side */}
                        <div className="w-full md:w-3/5 p-8 bg-black/80 flex flex-col justify-center">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-skillfi-neon mb-2 font-display">"{selectedProfile.headline}"</h3>
                                <div className="h-1 w-12 bg-white/20 mb-4"></div>
                                <p className="text-gray-200 leading-relaxed text-sm">
                                    {selectedProfile.description}
                                </p>
                            </div>
                            
                            <div className="flex gap-4">
                                <button className="px-6 py-3 bg-white text-black font-bold uppercase text-xs tracking-widest rounded hover:bg-skillfi-neon transition-colors w-full">
                                    Search Full Bio
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* LIVE ISSUES LIST */}
            {activeTab === 'ISSUES' && (
                <div className="min-h-[400px]">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="aspect-[3/4] bg-white/5 rounded-xl animate-pulse flex items-center justify-center border border-white/5">
                                    <span className="text-gray-600 font-mono text-xs">Loading Live Data...</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                            {profiles.length > 0 ? profiles.map((profile, idx) => (
                                <div 
                                    key={idx}
                                    onClick={() => setSelectedProfile(profile)}
                                    className="group relative aspect-[3/4] bg-gray-900 rounded-xl overflow-hidden cursor-pointer shadow-2xl transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:-translate-y-2 border border-white/5"
                                >
                                    <img 
                                        src={placeholderImages[idx % placeholderImages.length]} 
                                        alt="Cover" 
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-[0.6] contrast-125 grayscale group-hover:grayscale-0"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 opacity-90"></div>
                                    
                                    {/* Forbes Header */}
                                    <div className="absolute top-4 left-0 w-full text-center">
                                        <h2 className="text-2xl font-black font-display text-white tracking-tighter drop-shadow-lg group-hover:text-skillfi-neon transition-colors">FORBES</h2>
                                    </div>

                                    {/* Cover Content */}
                                    <div className="absolute bottom-0 left-0 w-full p-5">
                                        <div className="inline-block bg-white text-black text-[9px] font-bold px-2 py-0.5 uppercase tracking-wide mb-2 transform -skew-x-12">
                                            {profile.category}
                                        </div>
                                        <h3 className="text-xl font-black text-white uppercase leading-none mb-1 font-display drop-shadow-md">
                                            {profile.name}
                                        </h3>
                                        <div className="h-px w-10 bg-skillfi-neon my-2"></div>
                                        <p className="text-gray-300 text-[10px] font-bold uppercase tracking-wider line-clamp-2">
                                            {profile.headline}
                                        </p>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full text-center py-20 opacity-50">
                                    <div className="text-4xl mb-4">📡</div>
                                    <p>Unable to sync with Forbes Live Feed.</p>
                                </div>
                            )}
                        </div>
                    )}
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