import React, { useState } from 'react';
import { initializeChat, sendMessageToSkillfi } from '../services/geminiService';

export const RelationshipsDash: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'ADVICE' | 'RIGHTS' | 'DUTIES' | 'MATCH'>('ADVICE');
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Tip Modal State
    const [activeTip, setActiveTip] = useState<{title: string, content: string} | null>(null);

    const handleAsk = async (mode: string) => {
        if (!input.trim()) return;
        setLoading(true);
        try {
            const chat = await initializeChat('en');
            const prompt = `Mode: RELATIONSHIPS (${mode}). User Input: ${input}. Provide wise, traditional, and balanced advice. Keep it under 60 words.`;
            const text = await sendMessageToSkillfi(chat, prompt);
            setResponse(text);
        } catch (e) {
            setResponse("System offline. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 font-sans pb-24 touch-pan-y animate-fade-in relative">
            <header className="mb-8">
                <h1 className="text-3xl font-bold font-display text-white tracking-tight">Relationship Dynamics</h1>
                <p className="text-gray-500 text-sm mt-1">Wisdom for love, family, and harmony.</p>
            </header>

            {/* Deep Dive Modal */}
            {activeTip && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in" onClick={() => setActiveTip(null)}>
                    <div className="glass-panel p-8 rounded-2xl max-w-lg w-full relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setActiveTip(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>
                        <h2 className="text-2xl font-bold font-display text-red-400 mb-4">{activeTip.title}</h2>
                        <div className="text-gray-200 leading-relaxed text-sm whitespace-pre-line">
                            {activeTip.content}
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-white/10 pb-1 overflow-x-auto scrollbar-hide">
                {[
                    { id: 'ADVICE', label: 'General Advice' },
                    { id: 'RIGHTS', label: 'Your Rights' },
                    { id: 'DUTIES', label: 'Duties' },
                    { id: 'MATCH', label: 'Compatibility' }
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id as any); setResponse(''); setInput(''); }}
                        className={`px-6 py-3 text-[10px] font-bold tracking-[0.15em] rounded-t-lg uppercase transition-all whitespace-nowrap ${
                            activeTab === tab.id 
                            ? 'bg-red-500 text-white shadow-[0_-5px_20px_rgba(239,68,68,0.2)]' 
                            : 'bg-white/5 text-gray-500 hover:text-white'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="glass-panel p-6 rounded-2xl min-h-[400px]">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-2">
                        {activeTab === 'ADVICE' && 'Ask for Wisdom'}
                        {activeTab === 'RIGHTS' && 'Know Your Rights'}
                        {activeTab === 'DUTIES' && 'Understand Responsibilities'}
                        {activeTab === 'MATCH' && 'Check Compatibility'}
                    </h2>
                    <p className="text-gray-400 text-xs mb-4">
                        {activeTab === 'ADVICE' && 'Describe a conflict or situation.'}
                        {activeTab === 'RIGHTS' && 'Ask about legal or traditional rights in marriage.'}
                        {activeTab === 'DUTIES' && 'What is expected of you in a partnership?'}
                        {activeTab === 'MATCH' && 'List traits of you and your partner.'}
                    </p>

                    <div className="flex gap-4">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type here..."
                            className="flex-1 bg-black/40 border border-white/10 p-4 rounded-xl text-white focus:border-red-500 outline-none"
                        />
                        <button 
                            onClick={() => handleAsk(activeTab)}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-500 text-white px-6 rounded-xl font-bold uppercase text-xs tracking-wide"
                        >
                            {loading ? '...' : 'ASK'}
                        </button>
                    </div>
                </div>

                {response && (
                    <div className="bg-white/5 p-6 rounded-xl border border-red-500/20 animate-fade-in">
                        <div className="flex items-start gap-4">
                            <div className="text-3xl">🕊️</div>
                            <div>
                                <h3 className="font-bold text-red-400 text-sm mb-1 uppercase">Guidance</h3>
                                <p className="text-gray-200 text-sm leading-relaxed">{response}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Interactive Educational Content */}
                {!response && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                        <div 
                            onClick={() => setActiveTip({
                                title: "Active Listening",
                                content: "Most people do not listen with the intent to understand; they listen with the intent to reply. \n\n**The Technique:**\n1. Let them finish completely.\n2. Pause for 2 seconds.\n3. Repeat back what they said ('So what you're saying is...').\n4. Validate their emotion ('That must feel frustrating').\n\nOnly then do you offer a solution."
                            })}
                            className="bg-white/5 p-4 rounded-xl hover:bg-red-900/10 cursor-pointer border border-transparent hover:border-red-500/30 transition-all group"
                        >
                            <h4 className="font-bold text-white text-xs uppercase mb-2 group-hover:text-red-400">Communication Mastery</h4>
                            <p className="text-xs text-gray-400">Communication is not just talking, it's listening to understand, not to reply. (Click to learn)</p>
                        </div>
                        <div 
                            onClick={() => setActiveTip({
                                title: "The Foundation of Respect",
                                content: "Love without respect is just attachment. Respect means honoring boundaries, speaking without contempt, and valuing their autonomy.\n\n**Red Flags of Disrespect:**\n- Eye rolling\n- Interrupting\n- 'You always' or 'You never' statements.\n\nRespect is built in the small moments, not the grand gestures."
                            })}
                            className="bg-white/5 p-4 rounded-xl hover:bg-red-900/10 cursor-pointer border border-transparent hover:border-red-500/30 transition-all group"
                        >
                            <h4 className="font-bold text-white text-xs uppercase mb-2 group-hover:text-red-400">Respect Protocol</h4>
                            <p className="text-xs text-gray-400">Respect is the foundation of love. Without it, the structure collapses. (Click to learn)</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};