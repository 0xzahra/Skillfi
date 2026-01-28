
import React, { useState } from 'react';
import { DMConversation } from '../types';

export const Inbox: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [conversations, setConversations] = useState<DMConversation[]>([
        {
            id: 'c1',
            contactName: 'Alice_Web3',
            lastMessage: 'Did you check the new contract?',
            timestamp: '10m ago',
            unread: 2,
            messages: [
                { id: 'm1', text: 'Hey, are you joining the hackathon?', isMe: false, time: '10:00 AM' },
                { id: 'm2', text: 'Yes! I am building a DAO tool.', isMe: true, time: '10:05 AM' },
                { id: 'm3', text: 'Did you check the new contract?', isMe: false, time: '10:15 AM' }
            ]
        },
        {
            id: 'c2',
            contactName: 'CryptoMentor',
            lastMessage: 'Good progress on the portfolio.',
            timestamp: '1h ago',
            unread: 0,
            messages: [
                { id: 'm1', text: 'How is the risk management strategy going?', isMe: false, time: '9:00 AM' },
                { id: 'm2', text: 'Sticking to the 2% rule.', isMe: true, time: '9:10 AM' },
                { id: 'm3', text: 'Good progress on the portfolio.', isMe: false, time: '9:15 AM' }
            ]
        }
    ]);
    const [newMessage, setNewMessage] = useState('');

    // Mock search results for new users
    const [searchResults, setSearchResults] = useState<string[]>([]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        if (term.length > 2) {
            // Mock search
            setSearchResults(['Bob_Builder', 'DesignGuru', 'TechLead_99'].filter(u => u.toLowerCase().includes(term.toLowerCase())));
        } else {
            setSearchResults([]);
        }
    };

    const startChat = (username: string) => {
        const existing = conversations.find(c => c.contactName === username);
        if (existing) {
            setActiveChatId(existing.id);
        } else {
            const newChat: DMConversation = {
                id: Date.now().toString(),
                contactName: username,
                lastMessage: 'Start of conversation',
                timestamp: 'Just now',
                unread: 0,
                messages: []
            };
            setConversations([newChat, ...conversations]);
            setActiveChatId(newChat.id);
        }
        setSearchTerm('');
        setSearchResults([]);
    };

    const handleSendMessage = () => {
        if (!newMessage.trim() || !activeChatId) return;
        
        const updatedConversations = conversations.map(c => {
            if (c.id === activeChatId) {
                return {
                    ...c,
                    lastMessage: newMessage,
                    timestamp: 'Just now',
                    messages: [...c.messages, { id: Date.now().toString(), text: newMessage, isMe: true, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]
                };
            }
            return c;
        });
        
        setConversations(updatedConversations);
        setNewMessage('');
    };

    const activeConversation = conversations.find(c => c.id === activeChatId);

    return (
        <div className="h-full flex flex-col md:flex-row bg-[#050505] font-sans overflow-hidden">
            {/* Sidebar / List */}
            <div className={`w-full md:w-80 border-r border-white/5 flex flex-col ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-white/5">
                    <h2 className="text-xl font-bold font-display text-white mb-4">Inbox</h2>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search username..." 
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-skillfi-neon outline-none"
                        />
                        {searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-[#111] border border-white/10 rounded-xl mt-1 z-20 shadow-xl overflow-hidden">
                                {searchResults.map(user => (
                                    <div 
                                        key={user} 
                                        onClick={() => startChat(user)}
                                        className="p-3 hover:bg-white/5 cursor-pointer text-sm text-gray-300 hover:text-white flex items-center gap-2"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-skillfi-neon/20 flex items-center justify-center text-[10px] text-skillfi-neon font-bold">
                                            {user[0]}
                                        </div>
                                        {user}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    {conversations.map(chat => (
                        <div 
                            key={chat.id} 
                            onClick={() => setActiveChatId(chat.id)}
                            className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${activeChatId === chat.id ? 'bg-white/5 border-l-2 border-l-skillfi-neon' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`font-bold text-sm ${activeChatId === chat.id ? 'text-white' : 'text-gray-300'}`}>{chat.contactName}</span>
                                <span className="text-[10px] text-gray-600">{chat.timestamp}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-xs text-gray-500 truncate max-w-[180px]">{chat.lastMessage}</p>
                                {chat.unread > 0 && (
                                    <span className="bg-skillfi-neon text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">{chat.unread}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col bg-[#080808] ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
                {activeConversation ? (
                    <>
                        <div className="p-4 border-b border-white/5 flex items-center gap-3">
                            <button onClick={() => setActiveChatId(null)} className="md:hidden text-gray-400">←</button>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center text-sm font-bold text-white">
                                {activeConversation.contactName[0]}
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">{activeConversation.contactName}</h3>
                                <span className="text-[10px] text-green-500 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {activeConversation.messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                                        msg.isMe 
                                        ? 'bg-skillfi-neon text-black rounded-tr-none' 
                                        : 'bg-white/10 text-gray-200 rounded-tl-none'
                                    }`}>
                                        {msg.text}
                                        <div className={`text-[9px] mt-1 text-right ${msg.isMe ? 'text-black/60' : 'text-gray-400'}`}>{msg.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t border-white/5 bg-[#050505]">
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-skillfi-neon outline-none text-sm transition-colors"
                                />
                                <button 
                                    onClick={handleSendMessage}
                                    className="bg-skillfi-neon text-black px-4 rounded-xl font-bold hover:bg-white transition-colors"
                                >
                                    ➤
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
                        <div className="text-4xl mb-4 opacity-50">✉️</div>
                        <p className="text-sm">Select a conversation or search for a user</p>
                    </div>
                )}
            </div>
        </div>
    );
};
