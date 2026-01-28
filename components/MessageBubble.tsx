import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  const renderContent = (content: string) => {
    // Keep clean formatting but allow more natural text
    const cleanContent = content
        .replace(/\*\*/g, '') 
        .replace(/##/g, '')   
        .replace(/-\s/g, '• ') // Use bullet point instead of arrow for modern look
        .replace(/\[SFX:.*?\]/g, '') // Remove SFX brackets
        .trim();

    return cleanContent.split('\n').map((line, i) => (
      <div key={i} className={`min-h-[1.2em] text-[15px] leading-relaxed ${line.trim() === '' ? 'h-3' : ''}`}>
        {line.includes('[') && line.includes(']') && !line.includes('SFX') ? (
            <span className="text-skillfi-accent font-bold text-xs tracking-wide">{line}</span>
        ) : (
            line
        )}
      </div>
    ));
  };

  return (
    <div className={`flex w-full mb-6 font-sans ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[95%] md:max-w-[85%] rounded-2xl px-5 py-4 shadow-sm backdrop-blur-md ${
          isUser 
            ? 'glass-panel rounded-tr-none border-skillfi-neon/20' 
            : 'bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-tl-none shadow-md'
        }`}
      >
        {/* User/System Header Label */}
        <div className="text-[10px] text-gray-500 mb-2 font-bold uppercase tracking-wider flex items-center gap-2">
            {isUser ? 'YOU' : 'SKILLFI SYSTEM'}
            {!isUser && <span className="w-1.5 h-1.5 bg-skillfi-neon rounded-full animate-pulse"></span>}
        </div>

        {/* Attachment Preview */}
        {message.attachment && (
          <div className="mb-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
             {message.attachment.mimeType.startsWith('image') ? (
               <img src={`data:${message.attachment.mimeType};base64,${message.attachment.data}`} alt="Content" className="max-w-full h-auto max-h-80 object-contain mx-auto" />
             ) : (
                <div className="flex items-center gap-2 p-3 text-skillfi-neon text-sm font-medium">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                   </svg>
                   Attached: {message.attachment.mimeType}
                </div>
             )}
          </div>
        )}

        <div className={`${isUser ? 'text-slate-800 dark:text-gray-200' : 'text-slate-700 dark:text-gray-300'}`}>
          {isUser ? message.content : renderContent(message.content)}
        </div>
      </div>
    </div>
  );
};