import React, { useState, useRef } from 'react';
import { sendMessageToSkillfi, initializeChat } from '../services/geminiService';
import { Message } from '../types';

export const Support: React.FC = () => {
    const [status, setStatus] = useState<'IDLE' | 'CONNECTING' | 'LIVE'>('IDLE');
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatRef = useRef<any>(null);

    const handleConnect = async () => {
        setStatus('CONNECTING');
        
        // Initialize the specific support chat session
        try {
            chatRef.current = await initializeChat('en');
        } catch (e) {
            console.error("Failed to init chat", e);
        }

        // Simulate handshake
        setTimeout(() => {
            setStatus('LIVE');
            // Initial Support Message - Human Persona
            setMessages([{
                id: 'sys-1',
                role: 'model',
                content: "Concierge Desk here. This is Senior Agent Vance. I see your file. How can I assist you with your account or system access today?",
                timestamp: Date.now()
            }]);
        }, 2000);
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
            // Initialize if not ready (fallback)
            if (!chatRef.current) {
                chatRef.current = await initializeChat('en');
            }
            
            // Context injection for the specific persona
            const supportContext = `[SYSTEM: ACT AS A SENIOR HUMAN SUPPORT AGENT NAMED VANCE. BE PROFESSIONAL, CRISP, AND HELPFUL. DO NOT SOUND LIKE A ROBOT. YOUR GOAL IS TO SOLVE TECHNICAL ISSUES IMMEDIATELY.]`;
            
            // Send message to the persistent chat session
            const response = await sendMessageToSkillfi(chatRef.current, `${supportContext} ${inputText}`);

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
                content: "Signal lost. Re-establishing secure link...",
                timestamp: Date.now()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="p-6 md:p-8 h-full overflow-y-auto animate-fade-in font-sans flex flex-col items-center justify-center">
            <div className="glass-panel max-w-3xl w-full rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col min-h-[600px]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-skillfi-neon to-purple-600"></div>
                
                <header className="text-center mb-6">
                    <h1 className="text-3xl font-bold font-display text-white tracking-tight mb-2 kinetic-type">Live Expert Concierge</h1>
                    <p className="text-gray-500 text-sm">Direct encrypted line to Senior Specialists.</p>
                </header>

                {status === 'IDLE' && (
                    <div className="flex-1 flex flex-col justify-center space-y-6">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-skillfi-neon/30 transition-colors cursor-pointer group" onClick={handleConnect}>
                            <div className="flex items-center gap-4">
                                <div className="text-2xl">🐛</div>
                                <div>
                                    <h3 className="font-bold text-white group-hover:text-skillfi-neon transition-colors">Technical Anomalies</h3>
                                    <p className="text-xs text-gray-500">Report system lag or UI glitches for immediate patch.</p>
                                </div>
                            </div>
                        </div>

                         <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-skillfi-neon/30 transition-colors cursor-pointer group" onClick={handleConnect}>
                            <div className="flex items-center gap-4">
                                <div className="text-2xl">🔒</div>
                                <div>
                                    <h3 className="font-bold text-white group-hover:text-skillfi-neon transition-colors">Security & Privacy Protocol</h3>
                                    <p className="text-xs text-gray-500">Data scrub requests or access recovery.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <button 
                                onClick={handleConnect}
                                className="w-full py-4 bg-skillfi-neon text-black font-bold text-sm tracking-widest uppercase rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,255,0.2)] flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12.375m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                                </svg>
                                Connect to Agent
                            </button>
                            <p className="text-center text-[10px] text-gray-600 mt-3 uppercase tracking-wider">Agents Online: 3 // Wait Time: &lt;1 min</p>
                        </div>
                    </div>
                )}

                {status === 'CONNECTING' && (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="relative w-24 h-24 flex items-center justify-center mb-6">
                            <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-t-skillfi-neon border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                            <div className="text-2xl">👤</div>
                        </div>
                        <h2 className="text-xl font-bold text-white animate-pulse">Routing to Senior Specialist...</h2>
                        <p className="text-xs text-gray-500 mt-2 font-mono">Verifying Credentials // Establishing Secure Channel</p>
                    </div>
                )}

                {status === 'LIVE' && (
                    <div className="flex-1 flex flex-col h-full overflow-hidden">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                             <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-xs font-bold text-green-500 uppercase">Agent Vance (Live)</span>
                             </div>
                             <button onClick={() => setStatus('IDLE')} className="text-xs text-red-400 hover:text-red-300 border border-red-900/50 px-3 py-1 rounded bg-red-900/10">End Session</button>
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
                <div className="glass-panel p-4 rounded-xl w-full max-w-md">
                    <div className="text-gray-400 text-xs font-bold uppercase mb-1">Direct Email</div>
                    <div className="text-skillfi-neon text-sm font-mono">usmanzahra19@gmail.com</div>
                </div>
            </div>
        </div>
    );
};