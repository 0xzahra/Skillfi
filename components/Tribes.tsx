import React, { useState } from 'react';
import { Tribe, FeedPost } from '../types';

interface TribesProps {
    userCredits: number;
}

export const Tribes: React.FC<TribesProps> = ({ userCredits }) => {
    const [activeTribeId, setActiveTribeId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newTribeName, setNewTribeName] = useState('');
    const [newTribeCat, setNewTribeCat] = useState('TECH');

    const [tribes, setTribes] = useState<Tribe[]>([
        { id: '1', name: 'DeSci Pioneers', description: 'Decentralized Science revolution.', members: 1240, category: 'SCIENCE', isJoined: false },
        { id: '2', name: 'Web3 Builders', description: 'Smart contracts and dApps.', members: 8500, category: 'TECH', isJoined: true },
        { id: '3', name: 'Digital Artists', description: 'NFTs and Generative Art.', members: 3200, category: 'ART', isJoined: false },
        { id: '4', name: 'Quant Traders', description: 'Algo trading and risk mgmt.', members: 1500, category: 'FINANCE', isJoined: false },
        { id: '5', name: 'Biohackers', description: 'Longevity and performance.', members: 900, category: 'HEALTH', isJoined: false },
    ]);

    const [feed, setFeed] = useState<FeedPost[]>([
        { id: '101', author: 'CryptoKing', content: 'Just deployed my first smart contract on Base! 🚀', likes: 45, timestamp: '2m ago' },
        { id: '102', author: 'AiArtist', content: 'Midjourney v6 is changing the game. Check this render.', likes: 128, timestamp: '15m ago' },
        { id: '103', author: 'DevOps_Dan', content: 'Remember to audit your code. Security first.', likes: 89, timestamp: '1h ago' },
    ]);

    const [postText, setPostText] = useState('');

    const handleJoin = (id: string) => {
        setTribes(tribes.map(t => t.id === id ? { ...t, isJoined: !t.isJoined } : t));
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
    };

    const handlePost = () => {
        if (!postText) return;
        const newPost: FeedPost = {
            id: Date.now().toString(),
            author: 'You',
            content: postText,
            likes: 0,
            timestamp: 'Just now'
        };
        setFeed([newPost, ...feed]);
        setPostText('');
    };

    return (
        <div className="p-4 md:p-6 h-full overflow-y-auto pb-24 font-sans animate-fade-in scrollbar-hide">
            <header className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">Career Tribes</h1>
                    <p className="text-gray-500 text-sm mt-1">Join elite circles or forge your own path.</p>
                </div>
                <button 
                    onClick={() => setIsCreating(true)}
                    className="bg-skillfi-neon/10 border border-skillfi-neon/50 text-skillfi-neon px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-skillfi-neon hover:text-black transition-all shadow-[0_0_15px_rgba(0,255,255,0.2)]"
                >
                    + Create Tribe
                </button>
            </header>

            {isCreating && (
                <div className="mb-8 p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl animate-fade-in shadow-xl">
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
                    {tribes.map(tribe => (
                        <div 
                            key={tribe.id} 
                            onClick={() => setActiveTribeId(tribe.id)}
                            className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                                activeTribeId === tribe.id 
                                ? 'bg-skillfi-neon/5 border-skillfi-neon/50 shadow-[0_0_20px_rgba(0,255,255,0.1)]' 
                                : 'bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/5'
                            }`}
                        >
                            {/* Hover Gradient */}
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
                            <h3 className="text-lg font-bold text-white relative z-10 group-hover:text-skillfi-neon transition-colors">{tribe.name}</h3>
                            <p className="text-gray-500 text-xs mt-1 mb-4 relative z-10 font-medium leading-relaxed">{tribe.description}</p>
                            <div className="flex justify-between items-center relative z-10">
                                <span className="text-[10px] text-gray-600 font-mono">{tribe.members.toLocaleString()} OPERATIVES</span>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleJoin(tribe.id); }}
                                    className={`text-[10px] px-4 py-2 rounded-lg font-bold uppercase tracking-wider transition-all ${
                                        tribe.isJoined 
                                        ? 'border border-white/10 text-gray-400 hover:text-white' 
                                        : 'bg-white text-black hover:bg-skillfi-neon hover:shadow-[0_0_10px_#00ffff]'
                                    }`}
                                >
                                    {tribe.isJoined ? 'Leave' : 'Join'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tribe Feed */}
                <div className="md:col-span-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col h-[600px] shadow-2xl relative overflow-hidden">
                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                    {activeTribeId ? (
                        <>
                            <div className="mb-4 pb-4 border-b border-white/10 relative z-10">
                                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                    {tribes.find(t => t.id === activeTribeId)?.name} Feed
                                    <span className="flex items-center gap-1 text-[10px] font-normal text-green-500 bg-green-900/20 px-2 py-0.5 rounded-full border border-green-500/20">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                        LIVE
                                    </span>
                                </h2>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto space-y-4 pr-2 relative z-10 scrollbar-hide">
                                {feed.map(post => (
                                    <div key={post.id} className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-black border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                                                    {post.author[0]}
                                                </div>
                                                <span className="font-bold text-white text-sm hover:text-skillfi-neon cursor-pointer transition-colors">@{post.author}</span>
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
                                            <button className="hover:text-white transition-colors ml-auto">
                                                Share
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex gap-3 relative z-10">
                                <input 
                                    type="text" 
                                    value={postText}
                                    onChange={(e) => setPostText(e.target.value)}
                                    placeholder={`Post to ${tribes.find(t => t.id === activeTribeId)?.name}...`}
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
                        <div className="h-full flex flex-col items-center justify-center text-gray-600 relative z-10">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/5 animate-pulse">
                                <span className="text-4xl">📡</span>
                            </div>
                            <p className="font-mono text-xs uppercase tracking-widest">Select a frequency to intercept transmissions</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};