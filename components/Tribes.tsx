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
        <div className="p-4 md:p-6 h-full overflow-y-auto pb-24 font-sans animate-fade-in">
            <header className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Career Tribes</h1>
                    <p className="text-gray-500 text-sm">Join elite circles or forge your own path.</p>
                </div>
                <button 
                    onClick={() => setIsCreating(true)}
                    className="bg-skillfi-neon text-black px-4 py-2 rounded-xl font-bold text-sm hover:bg-white transition-colors"
                >
                    + Create Tribe
                </button>
            </header>

            {isCreating && (
                <div className="mb-8 p-4 bg-[#111] border border-gray-800 rounded-xl animate-fade-in">
                    <h3 className="text-white font-bold mb-4">Launch New Tribe</h3>
                    <div className="flex flex-col gap-4">
                        <input 
                            type="text" 
                            placeholder="Tribe Name" 
                            value={newTribeName}
                            onChange={(e) => setNewTribeName(e.target.value)}
                            className="bg-[#080808] border border-gray-700 p-3 rounded-lg text-white outline-none focus:border-skillfi-neon"
                        />
                        <select 
                            value={newTribeCat}
                            onChange={(e) => setNewTribeCat(e.target.value)}
                            className="bg-[#080808] border border-gray-700 p-3 rounded-lg text-white outline-none"
                        >
                            <option value="TECH">Technology</option>
                            <option value="ART">Art & Design</option>
                            <option value="FINANCE">Finance</option>
                            <option value="SCIENCE">Science</option>
                            <option value="HEALTH">Health</option>
                        </select>
                        <div className="flex gap-2">
                            <button onClick={handleCreate} className="bg-skillfi-neon text-black px-4 py-2 rounded-lg font-bold">Launch</button>
                            <button onClick={() => setIsCreating(false)} className="text-gray-400 px-4 py-2">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                {/* Tribe List */}
                <div className="md:col-span-1 space-y-4 overflow-y-auto max-h-[600px]">
                    {tribes.map(tribe => (
                        <div 
                            key={tribe.id} 
                            onClick={() => setActiveTribeId(tribe.id)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${activeTribeId === tribe.id ? 'bg-[#1a1a1a] border-skillfi-neon' : 'bg-[#111] border-gray-800 hover:border-gray-600'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                    tribe.category === 'TECH' ? 'bg-blue-900/30 text-blue-400' :
                                    tribe.category === 'FINANCE' ? 'bg-green-900/30 text-green-400' :
                                    tribe.category === 'ART' ? 'bg-purple-900/30 text-purple-400' :
                                    'bg-gray-800 text-gray-400'
                                }`}>
                                    {tribe.category}
                                </span>
                                {tribe.isJoined && <span className="text-skillfi-neon text-xs">● Joined</span>}
                            </div>
                            <h3 className="text-lg font-bold text-white">{tribe.name}</h3>
                            <p className="text-gray-500 text-xs mt-1 mb-3">{tribe.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">{tribe.members.toLocaleString()} Members</span>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleJoin(tribe.id); }}
                                    className={`text-xs px-3 py-1.5 rounded-lg font-bold border ${tribe.isJoined ? 'border-gray-700 text-gray-400' : 'bg-white text-black border-white hover:bg-skillfi-neon hover:border-skillfi-neon'}`}
                                >
                                    {tribe.isJoined ? 'Leave' : 'Join'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tribe Feed */}
                <div className="md:col-span-2 bg-[#080808] border border-gray-800 rounded-2xl p-6 flex flex-col h-[600px]">
                    {activeTribeId ? (
                        <>
                            <div className="mb-4 pb-4 border-b border-gray-800">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    {tribes.find(t => t.id === activeTribeId)?.name} Feed
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                </h2>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                                {feed.map(post => (
                                    <div key={post.id} className="bg-[#111] p-4 rounded-xl border border-gray-800">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-skillfi-neon text-sm">@{post.author}</span>
                                            <span className="text-xs text-gray-600">{post.timestamp}</span>
                                        </div>
                                        <p className="text-gray-300 text-sm leading-relaxed">{post.content}</p>
                                        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                                            <button className="hover:text-white flex items-center gap-1">❤️ {post.likes}</button>
                                            <button className="hover:text-white">💬 Reply</button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex gap-2">
                                <input 
                                    type="text" 
                                    value={postText}
                                    onChange={(e) => setPostText(e.target.value)}
                                    placeholder={`Post to ${tribes.find(t => t.id === activeTribeId)?.name}...`}
                                    className="flex-1 bg-[#111] border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-skillfi-neon outline-none"
                                />
                                <button 
                                    onClick={handlePost}
                                    className="bg-skillfi-neon text-black px-6 rounded-xl font-bold hover:opacity-90"
                                >
                                    SEND
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-600">
                            <span className="text-4xl mb-4">📡</span>
                            <p>Select a tribe to access the encrypted feed.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};