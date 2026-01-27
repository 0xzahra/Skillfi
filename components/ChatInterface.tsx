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

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 scroll-smooth">
        {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
        ))}
        
        {isLoading && (
            <div className="flex justify-start mb-6">
                <div className="bg-transparent border-l-2 border-skillfi-accent pl-6 py-2">
                    <div className="flex items-center gap-2 text-skillfi-accent font-mono text-sm animate-pulse">
                        Analyzing... Feel free to explore the Finance tools while I think.
                    </div>
                </div>
            </div>
        )}
        
        <div ref={bottomRef} className="h-4" />
    </div>
  );
};