import React, { useState } from 'react';
import { ChatSession } from '../types';

interface ChatHistoryProps {
    sessions: ChatSession[];
    onSelectSession: (id: string) => void;
    onDeleteSession: (id: string) => void;
    onRenameSession: (id: string, newTitle: string) => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ sessions, onSelectSession, onDeleteSession, onRenameSession }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const startEditing = (session: ChatSession, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingId(session.id);
        setEditTitle(session.title);
    };

    const saveEditing = (id: string) => {
        if (editTitle.trim()) {
            onRenameSession(id, editTitle);
        }
        setEditingId(null);
    };

    const handleShare = (session: ChatSession, e: React.MouseEvent) => {
        e.stopPropagation();
        const transcript = session.messages
            .map(m => `[${m.role.toUpperCase()}]\n${m.content}\n`)
            .join('\n-------------------\n');
        
        navigator.clipboard.writeText(transcript).then(() => {
            alert('Chat transcript copied to clipboard!');
        });
    };

    const filteredSessions = sessions
        .filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.preview.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => b.lastModified - a.lastModified);

    return (
        <div className="p-6 max-w-5xl mx-auto font-sans animate-fade-in h-full overflow-y-auto pb-20">
            <header className="mb-8 border-b border-gray-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-display text-white tracking-tight kinetic-type">Mission Logs</h1>
                    <p className="text-gray-500 text-sm mt-1">Access and manage archived strategic sessions.</p>
                </div>
                <div className="relative w-full md:w-64">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 absolute left-3 top-3.5 text-gray-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input 
                        type="text" 
                        placeholder="Search logs..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#111] border border-gray-800 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white focus:border-skillfi-neon outline-none transition-colors"
                    />
                </div>
            </header>

            {filteredSessions.length === 0 ? (
                <div className="text-center py-20 bg-[#111] rounded-2xl border border-dashed border-gray-800 glass-panel">
                    <div className="text-gray-600 text-5xl mb-4">📜</div>
                    <h3 className="text-gray-400 font-bold mb-1">No Archives Found</h3>
                    <p className="text-gray-600 text-sm">Start a new chat to build your history.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredSessions.map((session) => (
                        <div 
                            key={session.id}
                            onClick={() => onSelectSession(session.id)}
                            className="group relative glass-panel hover:bg-white/5 border border-white/5 hover:border-skillfi-neon/30 p-5 rounded-xl cursor-pointer transition-all duration-200 shadow-md flex items-center justify-between overflow-hidden"
                        >
                            {/* Content Layer (z-0) */}
                            <div className="flex-1 min-w-0 pr-4 relative z-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="w-2 h-2 rounded-full bg-skillfi-neon/50"></span>
                                    {editingId === session.id ? (
                                        <input 
                                            type="text" 
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            onBlur={() => saveEditing(session.id)}
                                            onKeyDown={(e) => e.key === 'Enter' && saveEditing(session.id)}
                                            autoFocus
                                            className="bg-[#080808] border border-skillfi-neon text-white text-sm px-2 py-1 rounded w-full max-w-xs outline-none relative z-20"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    ) : (
                                        <h3 className="font-bold font-display text-gray-200 truncate">{session.title}</h3>
                                    )}
                                </div>
                                <p className="text-gray-500 text-xs truncate font-medium pl-5">{session.preview}</p>
                                <p className="text-gray-600 text-[10px] mt-2 pl-5">
                                    {new Date(session.lastModified).toLocaleDateString()} • {new Date(session.lastModified).toLocaleTimeString()}
                                </p>
                            </div>

                            {/* Action Layer (z-10) - Ensures buttons are on top of the card click area */}
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                                <button 
                                    onClick={(e) => startEditing(session, e)}
                                    className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                                    title="Rename"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                    </svg>
                                </button>
                                <button 
                                    onClick={(e) => handleShare(session, e)}
                                    className="p-2 text-gray-500 hover:text-skillfi-neon hover:bg-skillfi-neon/10 rounded-lg transition-colors"
                                    title="Copy Transcript"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                                    </svg>
                                </button>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (window.confirm('Delete this log permanently?')) onDeleteSession(session.id);
                                    }}
                                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};