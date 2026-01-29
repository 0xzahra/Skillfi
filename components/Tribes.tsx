import React, { useState } from 'react';
import { Tribe, FeedPost, TribeMember } from '../types';

interface TribesProps {
    userCredits: number;
    onNavigate: (view: string) => void;
}

export const Tribes: React.FC<TribesProps> = ({ userCredits, onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'DISCOVER' | 'MY_TRIBES'>('DISCOVER');
    const [viewMode, setViewMode] = useState<'FEED' | 'MEMBERS'>('FEED');
    const [activeTribeId, setActiveTribeId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newTribeName, setNewTribeName] = useState('');
    const [newTribeCat, setNewTribeCat] = useState('TECH');

    // Data
    const [tribes, setTribes] = useState<Tribe[]>([
        { id: '1', name: 'DeSci Pioneers', description: 'Decentralized Science revolution.', members: 1240, category: 'SCIENCE', isJoined: false },
        { id: '2', name: 'Web3 Builders', description: 'Smart contracts and dApps.', members: 8500, category: 'TECH', isJoined: true },
        { id: '3', name: 'Digital Artists', description: 'NFTs and Generative Art.', members: 3200, category: 'ART', isJoined: false },
        { id: '4', name: 'Quant Traders', description: 'Algo trading and risk mgmt.', members: 1500, category: 'FINANCE', isJoined: true },
        { id: '5', name: 'Biohackers', description: 'Longevity and performance.', members: 900, category: 'HEALTH', isJoined: false },
    ]);

    const [feed, setFeed] = useState<FeedPost[]>([
        { id: '101', author: 'CryptoKing', content: 'Just deployed my first smart contract on Base! 🚀', likes: 45, timestamp: '2m ago' },
        { id: '102', author: 'AiArtist', content: 'Midjourney v6 is changing the game. Check this render.', likes: 128, timestamp: '15m ago' },
        { id: '103', author: 'DevOps_Dan', content: 'Remember to audit your code. Security first.', likes: 89, timestamp: '1h ago' },
        { id: '104', author: 'Satoshi_N', content: 'The mempool is congested today. Fees are high.', likes: 21, timestamp: '2h ago' },
        { id: '105', author: 'Alice_Web3', content: 'Anyone going to ETH Denver next month?', likes: 56, timestamp: '4h ago' },
    ]);

    const [members, setMembers] = useState<TribeMember[]>([
        { id: 'm1', username: 'CryptoKing', role: 'ADMIN', isFollowing: false, avatar: 'CK' },
        { id: 'm2', username: 'AiArtist', role: 'MEMBER', isFollowing: true, avatar: 'AA' },
        { id: 'm3', username: 'DevOps_Dan', role: 'MEMBER', isFollowing: false, avatar: 'DD' },
        { id: 'm4', username: 'Alice_Web3', role: 'MEMBER', isFollowing: false, avatar: 'AW' },
        { id: 'm5', username: 'Satoshi_N', role: 'MEMBER', isFollowing: false, avatar: 'SN' },
    ]);

    const [postText, setPostText] = useState('');

    // Actions
    const handleJoin = (id: string) => {
        // Toggle join state
        setTribes(prev => prev.map(t => t.id === id ? { ...t, isJoined: !t.isJoined } : t));
        // Force view mode to FEED so they see messages immediately
        setViewMode('FEED');
    };

    const handleCreate = () => {
        if (!newTribeName) return;
        const newTribe: Tribe = {
            id: Date.now().toString(),
            name: newTribeName,
            description: 'Community created tribe.',
            members: 1,
            category: newTribeCat as any,
            isJoined: true
        };
        setTribes([newTribe, ...tribes]);
        setIsCreating(false);
        setNewTribeName('');
        setActiveTab('MY_TRIBES');
        setActiveTribeId(newTribe.id);
        setViewMode('FEED');
    };

    const handlePost = () => {
        if (!postText) return;
        const newPost: FeedPost = {
            id: Date.now().toString(),
            author: 'You',
            content: postText,
            likes: 0,
            timestamp: 'Just now',
            isUser: true
        };
        setFeed([newPost, ...feed]);
        setPostText('');
    };

    const toggleFollow = (memberId: string) => {
        setMembers(members.map(m => m.id === memberId ? { ...m, isFollowing: !m.isFollowing } : m));
    };

    // Filters
    const visibleTribes = activeTab === 'MY_TRIBES' 
        ? tribes.filter(t => t.isJoined)
        : tribes;

    const activeTribe = tribes.find(t => t.id === activeTribeId);

    return (
        <div className="p-4 md:p-6 h-full overflow-y-auto pb-24 font-sans animate-fade-in scrollbar-hide">
            <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-display text-white tracking-tight drop-shadow-md kinetic-type">Career Tribes</h1>
                    <p className="text-gray-500 text-sm mt-1">Join elite circles or forge your own path.</p>
                </div>
                <div className="flex gap-2">
                     <div className="bg-white/5 rounded-lg p-1 flex">
                        <button 
                            onClick={() => setActiveTab('DISCOVER')}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${activeTab === 'DISCOVER' ? 'bg-skillfi-neon text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                            Discover
                        </button>
                        <button 
                            onClick={() => setActiveTab('MY_TRIBES')}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${activeTab === 'MY_TRIBES' ? 'bg-skillfi-neon text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                            My Tribes
                        </button>
                     </div>
                     <button 
                        onClick={() => setIsCreating(true)}
                        className="bg-skillfi-neon/10 border border-skillfi-neon/50 text-skillfi-neon px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-skillfi-neon hover:text-black transition-all shadow-[0_0_15px_rgba(0,255,255,0.2)]"
                    >
                        + Create
                    </button>
                </div>
            </header>

            {isCreating && (
                <div className="glass-panel mb-8 p-6 rounded-2xl animate-fade-in shadow-xl">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-skillfi-neon rounded-full animate-pulse"></span>
                        Launch New Tribe
                    </h3>
                    <div className="flex flex-col gap-4">
                        <input 
                            type="text" 
                            placeholder="Tribe Name" 
                            value={newTribeName}
                            onChange={(e) => setNewTribeName(e.target.value)}
                            className="bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-skillfi-neon/50 placeholder-gray-600 transition-colors"
                        />
                        <select 
                            value={newTribeCat}
                            onChange={(e) => setNewTribeCat(e.target.value)}
                            className="bg-black/40 border border-white/10 p-4 rounded-xl text-white outline-none cursor-pointer"
                        >
                            <option value="TECH">Technology</option>
                            <option value="ART">Art & Design</option>
                            <option value="FINANCE">Finance</option>
                            <option value="SCIENCE">Science</option>
                            <option value="HEALTH">Health</option>
                        </select>
                        <div className="flex gap-3 mt-2">
                            <button onClick={handleCreate} className="bg-skillfi-neon text-black px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide hover:shadow-[0_0_15px_#00ffff]">Launch</button>
                            <button onClick={() => setIsCreating(false)} className="text-gray-400 px-6 py-3 text-sm font-bold uppercase hover:text-white">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                {/* Tribe List */}
                <div className="md:col-span-1 space-y-4 overflow-y-auto max-h-[600px] scrollbar-hide pr-2">
                    {visibleTribes.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <p>No tribes found.</p>
                            {activeTab === 'MY_TRIBES' && <button onClick={() => setActiveTab('DISCOVER')} className="text-skillfi-neon underline mt-2 text-sm">Discover Tribes</button>}
                        </div>
                    ) : visibleTribes.map(tribe => (
                        <div 
                            key={tribe.id} 
                            onClick={() => {
                                setActiveTribeId(tribe.id);
                                if (tribe.isJoined) setViewMode('FEED');
                            }}
                            className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden group glass-panel ${
                                activeTribeId === tribe.id 
                                ? 'bg-skillfi-neon/10 border-skillfi-neon/50 shadow-glow' 
                                : 'hover:border-white/20 hover:bg-white/5'
                            }`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-skillfi-neon/0 via-skillfi-neon/5 to-skillfi-neon/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                            <div className="flex justify-between items-start mb-3 relative z-10">
                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide border ${
                                    tribe.category === 'TECH' ? 'bg-blue-900/20 border-blue-500/30 text-blue-400' :
                                    tribe.category === 'FINANCE' ? 'bg-green-900/20 border-green-500/30 text-green-400' :
                                    tribe.category === 'ART' ? 'bg-purple-900/20 border-purple-500/30 text-purple-400' :
                                    'bg-gray-800/50 border-gray-700 text-gray-400'
                                }`}>
                                    {tribe.category}
                                </span>
                                {tribe.isJoined && <span className="text-skillfi-neon text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><span className="w-1.5 h-1.5 bg-skillfi-neon rounded-full"></span> Joined</span>}
                            </div>
                            <h3 className="text-lg font-bold font-display text-white relative z-10 group-hover:text-skillfi-neon transition-colors">{tribe.name}</h3>
                            <p className="text-gray-500 text-xs mt-1 mb-4 relative z-10 font-medium leading-relaxed">{tribe.description}</p>
                            <div className="flex justify-between items-center relative z-10">
                                <span className="text-[10px] text-gray-600 font-mono">{tribe.members.toLocaleString()} OPERATIVES</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tribe Feed / Members Area - Sticky Header */}
                <div className="md:col-span-2 glass-panel rounded-2xl p-0 flex flex-col h-[600px] shadow-2xl relative overflow-hidden">
                    {activeTribe ? (
                        <>
                            <div className="p-6 pb-4 border-b border-white/10 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-skillfi-bg/95 backdrop-blur-xl">
                                <h2 className="text-xl font-bold font-display text-white flex items-center gap-3">
                                    {activeTribe.name}
                                    {activeTribe.isJoined && (
                                        <span className="flex items-center gap-1 text-[10px] font-normal text-green-500 bg-green-900/20 px-2 py-0.5 rounded-full border border-green-500/20">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                            LIVE
                                        </span>
                                    )}
                                </h2>

                                {activeTribe.isJoined && (
                                    <div className="flex bg-black/40 p-1 rounded-lg">
                                        <button 
                                            onClick={() => setViewMode('FEED')}
                                            className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${viewMode === 'FEED' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                                        >
                                            Feed
                                        </button>
                                        <button 
                                            onClick={() => setViewMode('MEMBERS')}
                                            className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${viewMode === 'MEMBERS' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                                        >
                                            Members
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-6 pt-2 flex-1 overflow-y-auto scrollbar-hide">
                            {activeTribe.isJoined ? (
                                viewMode === 'FEED' ? (
                                    <>
                                        <div className="space-y-4 relative z-10">
                                            {feed.map(post => (
                                                <div key={post.id} className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors animate-fade-in">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-black border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                                                                {post.author[0]}
                                                            </div>
                                                            <span className="font-bold text-white text-sm hover:text-skillfi-neon cursor-pointer transition-colors">@{post.author}</span>
                                                            {post.isUser && <span className="text-[10px] bg-white/10 px-1.5 rounded text-gray-400">YOU</span>}
                                                        </div>
                                                        <span className="text-[10px] text-gray-500 font-mono">{post.timestamp}</span>
                                                    </div>
                                                    <p className="text-gray-300 text-sm leading-relaxed pl-10">{post.content}</p>
                                                    <div className="mt-4 pl-10 flex items-center gap-6 text-xs text-gray-500 font-bold">
                                                        <button className="hover:text-red-400 flex items-center gap-1.5 transition-colors group">
                                                            <span className="group-hover:scale-125 transition-transform">❤️</span> {post.likes}
                                                        </button>
                                                        <button className="hover:text-skillfi-neon flex items-center gap-1.5 transition-colors">
                                                            💬 Reply
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-4 flex gap-3 relative z-10 sticky bottom-0 pt-2 bg-skillfi-bg/95 backdrop-blur-md pb-2">
                                            <input 
                                                type="text" 
                                                value={postText}
                                                onChange={(e) => setPostText(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handlePost()}
                                                placeholder={`Post to ${activeTribe.name}...`}
                                                className="flex-1 bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-skillfi-neon/50 outline-none transition-all placeholder-gray-600 text-sm"
                                            />
                                            <button 
                                                onClick={handlePost}
                                                className="bg-skillfi-neon text-black px-8 rounded-xl font-bold uppercase tracking-wider hover:bg-white hover:shadow-[0_0_15px_#00ffff] transition-all"
                                            >
                                                SEND
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-2 relative z-10">
                                        {members.map(member => (
                                            <div key={member.id} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/5 transition-all animate-fade-in">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center font-bold text-white">
                                                        {member.avatar}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white text-sm">@{member.username}</div>
                                                        <div className="text-[10px] text-gray-500 font-mono uppercase">{member.role}</div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); onNavigate('INBOX'); }}
                                                        className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/5 hover:bg-white/20 text-white transition-all border border-white/10"
                                                    >
                                                        Message
                                                    </button>
                                                    <button 
                                                        onClick={() => toggleFollow(member.id)}
                                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                                                            member.isFollowing 
                                                            ? 'bg-transparent text-gray-400 border border-white/10' 
                                                            : 'bg-skillfi-neon/10 text-skillfi-neon border border-skillfi-neon/30 hover:bg-skillfi-neon hover:text-black'
                                                        }`}
                                                    >
                                                        {member.isFollowing ? 'Following' : 'Follow'}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            ) : (
                                // LOCKED STATE
                                <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-8 text-center animate-fade-in">
                                    <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                                        <span className="text-5xl">🔒</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
                                    <p className="text-gray-400 text-sm max-w-md mb-8">
                                        This tribe's communications are encrypted. You must be an operative to view the feed and member list.
                                    </p>
                                    <button 
                                        onClick={() => handleJoin(activeTribe.id)}
                                        className="bg-skillfi-neon text-black px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-white hover:shadow-[0_0_30px_#00ffff] transition-all transform hover:scale-105"
                                    >
                                        Join Tribe
                                    </button>
                                </div>
                            )}
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-600 relative z-10">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/5 animate-pulse">
                                <span className="text-4xl">📡</span>
                            </div>
                            <p className="font-mono text-xs uppercase tracking-widest">Select a tribe to access feed & operatives</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};