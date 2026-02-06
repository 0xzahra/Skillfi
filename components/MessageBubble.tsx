
import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  const renderContent = (content: string) => {
    const cleanContent = content
        .replace(/\*\*/g, '') 
        .replace(/##/g, '')   
        .replace(/-\s/g, '• ') 
        .replace(/\[SFX:.*?\]/g, '') 
        .trim();

    return cleanContent.split('\n').map((line, i) => (
      <div key={i} className={`min-h-[1.4em] text-[15px] leading-7 font-normal ${line.trim() === '' ? 'h-3' : ''}`}>
        {line.includes('[') && line.includes(']') && !line.includes('SFX') ? (
            <span className="text-skillfi-neon font-bold text-xs tracking-wide uppercase bg-blue-50 px-1 rounded">{line}</span>
        ) : (
            line
        )}
      </div>
    ));
  };

  return (
    <div className={`flex w-full mb-6 font-sans ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[95%] md:max-w-[80%] rounded-2xl px-6 py-5 shadow-sm border ${
          isUser 
            ? 'bg-skillfi-neon text-white rounded-tr-sm border-transparent' 
            : 'bg-white text-skillfi-text rounded-tl-sm border-skillfi-border shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
        }`}
      >
        {/* User/System Header Label */}
        <div className={`text-[10px] mb-2 font-bold uppercase tracking-wider flex items-center gap-2 ${isUser ? 'text-blue-100' : 'text-skillfi-dim'}`}>
            {isUser ? 'YOU' : 'SYSTEM RESPONSE'}
        </div>

        {/* Attachment Preview */}
        {message.attachment && (
          <div className="mb-4 rounded-lg overflow-hidden border border-white/20 bg-black/5">
             {message.attachment.mimeType.startsWith('image') ? (
               <img src={`data:${message.attachment.mimeType};base64,${message.attachment.data}`} alt="Content" className="max-w-full h-auto max-h-80 object-contain mx-auto" />
             ) : (
                <div className="flex items-center gap-2 p-3 text-sm font-medium">
                   <span className="text-current">📎 Attached: {message.attachment.mimeType}</span>
                </div>
             )}
          </div>
        )}

        <div className="prose prose-sm max-w-none text-current">
          {isUser ? message.content : renderContent(message.content)}
        </div>
      </div>
    </div>
  );
};
