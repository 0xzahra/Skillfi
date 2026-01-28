import React, { useState } from 'react';
import { sendMessageToSkillfi } from '../services/geminiService';
import { Message } from '../types';

export const Support: React.FC = () => {
    const [status, setStatus] = useState<'IDLE' | 'CONNECTING' | 'LIVE'>('IDLE');
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleConnect = async () => {
        setStatus('CONNECTING');
        // Simulate handshake
        setTimeout(() => {
            setStatus('LIVE');
            // Initial Support Message
            setMessages([{
                id: 'sys-1',
                role: 'model',
                content: "Agent connected. Secure line established. How can I assist you today, operative?",
                timestamp: Date.now()
            }]);
        }, 1500);
    };

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputText,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        try {
            const { initializeChat, sendMessageToSkillfi } = await import('../services/geminiService');
            const chat = await initializeChat('en'); 
            
            const supportPrompt = `[SYSTEM: ACT AS TECHNICAL SUPPORT AGENT. KEEP ANSWERS SHORT AND TECHNICAL] User Query: ${inputText}`;
            const response = await sendMessageToSkillfi(chat, supportPrompt);

            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'model',
                content: response,
                timestamp: Date.now()
            }]);
        } catch (e) {
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'model',
                content: "Connection interrupted. Please try again.",
                timestamp: Date.now()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="p-6 md:p-8 h-full overflow-y-auto animate-fade-in font-sans flex flex-col items-center justify-center">
            <div className="max-w-3xl w-full bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col min-h-[600px]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-skillfi-neon to-purple-600"></div>
                
                <header className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Live Command Support</h1>
                    <p className="text-gray-500 text-sm">Direct encrypted line to Skillfi Human Operators.</p>
                </header>

                {status === 'IDLE' && (
                    <div className="flex-1 flex flex-col justify-center space-y-6">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-skillfi-neon/30 transition-colors cursor-pointer group" onClick={handleConnect}>
                            <div className="flex items-center gap-4">
                                <div className="text-2xl">🐛</div>
                                <div>
                                    <h3 className="font-bold text-white group-hover:text-skillfi-neon transition-colors">Report Bug / Technical Issue</h3>
                                    <p className="text-xs text-gray-500">System glitches, UI errors, or performance lag.</p>
                                </div>
                            </div>
                        </div>

                         <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-skillfi-neon/30 transition-colors cursor-pointer group" onClick={handleConnect}>
                            <div className="flex items-center gap-4">
                                <div className="text-2xl">🔒</div>
                                <div>
                                    <h3 className="font-bold text-white group-hover:text-skillfi-neon transition-colors">Security & Privacy</h3>
                                    <p className="text-xs text-gray-500">Data requests, account deletion, or OpSec questions.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <button 
                                onClick={handleConnect}
                                className="w-full py-4 bg-skillfi-neon text-black font-bold text-sm tracking-widest uppercase rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,255,0.2)] flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Initiate Live Agent Uplink
                            </button>
                            <p className="text-center text-[10px] text-gray-600 mt-3 uppercase tracking-wider">Agents Online: 4 // Wait Time: Instant</p>
                        </div>
                    </div>
                )}

                {status === 'CONNECTING' && (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="relative w-24 h-24 flex items-center justify-center mb-6">
                            <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-t-skillfi-neon border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                            <div className="text-2xl">📡</div>
                        </div>
                        <h2 className="text-xl font-bold text-white animate-pulse">Establishing Secure Handshake...</h2>
                        <p className="text-xs text-gray-500 mt-2 font-mono">Encrypting Payload // Routing via Mesh Network</p>
                    </div>
                )}

                {status === 'LIVE' && (
                    <div className="flex-1 flex flex-col h-full overflow-hidden">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                             <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-xs font-bold text-green-500 uppercase">Live Connection</span>
                             </div>
                             <button onClick={() => setStatus('IDLE')} className="text-xs text-red-400 hover:text-red-300">End Session</button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 p-2 scrollbar-hide mb-4 bg-black/20 rounded-xl border border-white/5">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-skillfi-neon/10 text-skillfi-neon border border-skillfi-neon/20' : 'bg-white/10 text-gray-200'}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="text-xs text-gray-500 italic animate-pulse">Agent is typing...</div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type your message..."
                                className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-skillfi-neon outline-none text-sm"
                            />
                            <button 
                                onClick={handleSendMessage}
                                className="bg-skillfi-neon text-black px-4 rounded-xl font-bold hover:bg-white transition-colors"
                            >
                                ➤
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-8 flex justify-center w-full max-w-4xl text-center">
                <div className="p-4 rounded-xl border border-white/5 bg-black/20 backdrop-blur-sm w-full max-w-md">
                    <div className="text-gray-400 text-xs font-bold uppercase mb-1">Email Support</div>
                    <div className="text-skillfi-neon text-sm font-mono">ops@skillfi.ai</div>
                </div>
            </div>
        </div>
    );
};