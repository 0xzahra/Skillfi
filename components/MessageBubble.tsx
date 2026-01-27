import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  // Clean text renderer
  const renderContent = (content: string) => {
    const cleanContent = content
        .replace(/\*\*/g, '') 
        .replace(/##/g, '')   
        .replace(/-\s/g, '• ');

    return cleanContent.split('\n').map((line, i) => (
      <div key={i} className={`min-h-[1.5em] ${line.trim() === '' ? 'h-2' : ''}`}>
        {line.includes('[') && line.includes(']') ? (
            <span className="text-skillfi-accent italic text-sm">{line}</span>
        ) : (
            line
        )}
      </div>
    ));
  };

  const shareImage = async (base64Data: string, mimeType: string) => {
      try {
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: mimeType });
          const file = new File([blob], "skillfi-vision.png", { type: mimeType });
          
          if (navigator.share && navigator.canShare({ files: [file] })) {
              await navigator.share({
                  files: [file],
                  title: 'My Skillfi Vision Board',
                  text: 'Check out my career path visualization by Skillfi!'
              });
          } else {
              // Fallback download
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = "skillfi-vision.png";
              link.click();
          }
      } catch (e) {
          console.error("Share failed", e);
      }
  };

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[90%] md:max-w-[80%] rounded-2xl p-5 md:p-6 shadow-lg ${
          isUser 
            ? 'bg-skillfi-surface border border-gray-700 rounded-br-none' 
            : 'bg-gradient-to-br from-gray-900 to-black border-l-2 border-skillfi-neon rounded-bl-none pl-6'
        }`}
      >
        {/* Attachment Preview */}
        {message.attachment && (
          <div className="mb-4 rounded-lg overflow-hidden border border-gray-700 bg-black/50 relative group">
             {message.attachment.mimeType.startsWith('image') ? (
               <>
                   <img src={`data:${message.attachment.mimeType};base64,${message.attachment.data}`} alt="Content" className="max-w-full h-auto max-h-80 object-contain mx-auto" />
                   {/* Overlay Share Button for Images */}
                   <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                         onClick={() => shareImage(message.attachment!.data, message.attachment!.mimeType)}
                         className="bg-black/70 hover:bg-skillfi-neon/90 text-white hover:text-black p-2 rounded-full backdrop-blur-sm transition-all"
                         title="Share Image"
                       >
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                           </svg>
                       </button>
                   </div>
               </>
             ) : (
                <div className="p-4 flex items-center gap-2 text-skillfi-neon font-mono text-sm">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                   Attached File ({message.attachment.mimeType})
                </div>
             )}
          </div>
        )}

        <div className={`text-base md:text-lg leading-relaxed font-sans tracking-wide ${isUser ? 'text-gray-200' : 'text-gray-100'}`}>
          {isUser ? message.content : renderContent(message.content)}
        </div>
        
        {/* Footer for Bot Messages */}
        {!isUser && (
            <div className="mt-6 pt-3 border-t border-gray-800 flex justify-between items-center">
                <div className="text-[10px] text-skillfi-dim font-mono uppercase tracking-widest">
                    Skillfi Guidance System
                </div>
            </div>
        )}
      </div>
    </div>
  );
};