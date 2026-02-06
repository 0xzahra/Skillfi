
import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import { MessageBubble } from './MessageBubble';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isLoading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const displayMessages = messages.filter(msg => !msg.content.startsWith('ACTIVATE MODE:'));

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 scroll-smooth bg-skillfi-bg">
        {displayMessages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
        ))}
        
        {isLoading && (
            <div className="flex justify-start mb-6">
                <div className="bg-white/80 border border-skillfi-border rounded-xl px-6 py-4 shadow-sm inline-block">
                    <div className="flex items-center gap-3">
                        <span className="flex gap-1">
                            <span className="w-2 h-2 bg-skillfi-neon rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-skillfi-neon rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                            <span className="w-2 h-2 bg-skillfi-neon rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                        </span>
                        <span className="text-sm font-medium text-skillfi-text">Analyzing Request...</span>
                    </div>
                </div>
            </div>
        )}
        
        <div ref={bottomRef} className="h-4" />
    </div>
  );
};
