import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  // Basic formatter for bold text and newlines to avoid heavy markdown library
  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="text-skillfi-neon">{part.slice(2, -2)}</strong>;
          }
          // Highlight sound effects
          if (part.startsWith('[') && part.endsWith(']')) {
             return <span key={j} className="text-skillfi-accent italic text-sm">{part}</span>;
          }
          return part;
        })}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 md:p-6 ${
          isUser 
            ? 'bg-skillfi-surface border border-gray-700 rounded-br-none' 
            : 'bg-transparent border-l-2 border-skillfi-neon rounded-bl-none pl-6'
        }`}
      >
        {/* Attachment Preview */}
        {message.attachment && (
          <div className="mb-3 rounded-lg overflow-hidden border border-gray-700 bg-black/50">
             {message.attachment.mimeType.startsWith('image') ? (
               <img src={`data:${message.attachment.mimeType};base64,${message.attachment.data}`} alt="User upload" className="max-w-full h-auto max-h-60 object-contain" />
             ) : (
                <div className="p-4 flex items-center gap-2 text-skillfi-neon font-mono text-sm">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                   Attached File ({message.attachment.mimeType})
                </div>
             )}
          </div>
        )}

        <div className={`text-sm md:text-base leading-relaxed whitespace-pre-wrap font-sans ${isUser ? 'text-gray-200' : 'text-gray-100'}`}>
          {isUser ? message.content : formatContent(message.content)}
        </div>
        
        {/* Footer for Bot Messages */}
        {!isUser && (
            <div className="mt-4 pt-2 border-t border-gray-800 text-[10px] text-skillfi-dim font-mono text-right">
                SKILLFI AI
            </div>
        )}
      </div>
    </div>
  );
};