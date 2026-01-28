import React, { useState } from 'react';
import { initializeChat, sendMessageToSkillfi } from '../services/geminiService';

export const RelationshipsDash: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'ADVICE' | 'RIGHTS' | 'DUTIES' | 'MATCH'>('ADVICE');
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

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
        <div className="h-full overflow-y-auto p-4 md:p-8 font-sans pb-24 touch-pan-y animate-fade-in">
            <header className="mb-8">
                <h1 className="text-3xl font-bold font-display text-white tracking-tight">Relationship Dynamics</h1>
                <p className="text-gray-500 text-sm mt-1">Wisdom for love, family, and harmony.</p>
            </header>

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

                {/* Static Educational Content based on Tab */}
                {!response && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 opacity-60">
                        <div className="bg-white/5 p-4 rounded-xl">
                            <h4 className="font-bold text-white text-xs uppercase mb-2">Tip 1</h4>
                            <p className="text-xs text-gray-400">Communication is not just talking, it's listening to understand, not to reply.</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl">
                            <h4 className="font-bold text-white text-xs uppercase mb-2">Tip 2</h4>
                            <p className="text-xs text-gray-400">Respect is the foundation of love. Without it, the structure collapses.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};