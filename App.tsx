import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
import { InputArea } from './components/InputArea';
import { Sidebar } from './components/Sidebar';
import { initializeChat, sendMessageToSkillfi, generateVisionBoard } from './services/geminiService';
import { Message, UserState } from './types';
import { INITIAL_GREETING } from './constants';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'model',
      content: INITIAL_GREETING,
      timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const chatSessionRef = useRef<any>(null);

  // Initialization
  const initChat = async () => {
    try {
      chatSessionRef.current = await initializeChat();
    } catch (error) {
      console.error("Failed to initialize chat", error);
    }
  };

  useEffect(() => {
    initChat();
  }, []);

  const handleNewChat = async () => {
    setMessages([{
        id: Date.now().toString(),
        role: 'model',
        content: INITIAL_GREETING,
        timestamp: Date.now()
    }]);
    await initChat();
  };

  const handleSendMessage = async (text: string, attachment?: { data: string; mimeType: string }) => {
    if (!text.trim() && !attachment) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      attachment: attachment,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) {
        chatSessionRef.current = await initializeChat();
      }

      const responseText = await sendMessageToSkillfi(chatSessionRef.current, text, attachment);

      // Check if we were "stopped" (component state reset) before setting message
      // We can check this by seeing if isLoading is still true. 
      // However, React state updates are async, so checking the ref inside the loop is hard.
      // But since we await, if the user clicked Stop, we can enforce logic here.
      // For this simple implementation, we update state, but if user cancelled,
      // they might have triggered 'handleStop' which sets isLoading to false.
      // We will check isLoading in the setter callback to be safe-ish, 
      // but 'handleStop' is the primary UI interrupter.
      
      const newBotMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: Date.now()
      };
      
      setMessages(prev => {
          // If the user cleared/stopped, we might not want to add it? 
          // But usually showing the response is fine even if stopped late.
          return [...prev, newBotMsg]
      });
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: "[Soft alert tone] Connection interrupted. Please retry.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = () => {
      setIsLoading(false);
      setIsGeneratingImage(false);
      // We can't easily abort the request in-flight without AbortController support in the service
      // But we can reset the UI so the user can interact again.
      // Optional: Add a system message saying "Stopped".
      setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'model',
          content: "[Operation paused by user]",
          timestamp: Date.now()
      }]);
  };

  const handleModeSelect = (modeLabel: string) => {
    const prompt = `Activate ${modeLabel} mode. Analyze my profile specifically for this.`;
    handleSendMessage(prompt);
  };

  const handleGenerateImage = async () => {
    const lastBotMessage = [...messages].reverse().find(m => m.role === 'model');
    if (!lastBotMessage) return;

    setIsGeneratingImage(true);
    try {
        const imageData = await generateVisionBoard(lastBotMessage.content);
        if (imageData) {
            const imageMsg: Message = {
                id: Date.now().toString(),
                role: 'model',
                content: "Here is your visual result.",
                attachment: {
                    mimeType: 'image/png',
                    data: imageData
                },
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, imageMsg]);
        }
    } catch (e) {
        console.error("Vision board failed", e);
    } finally {
        setIsGeneratingImage(false);
    }
  };

  const handleShare = async () => {
    // 1. Prepare Text
    const textToShare = messages
        .filter(m => m.id !== 'init-1')
        .map(m => `${m.role === 'user' ? 'ME' : 'SKILLFI'}: ${m.content}`)
        .join('\n\n') + "\n\nVibe coded by arewa.base.eth";

    // 2. Prepare Image (if available)
    // Find the latest image from the model
    const lastImageMsg = [...messages].reverse().find(
        m => m.role === 'model' && m.attachment && m.attachment.mimeType.startsWith('image')
    );

    let fileToShare: File | undefined;
    
    if (lastImageMsg && lastImageMsg.attachment) {
        try {
            // Convert base64 to Blob/File
            const byteCharacters = atob(lastImageMsg.attachment.data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: lastImageMsg.attachment.mimeType });
            
            fileToShare = new File([blob], "skillfi-vision-board.png", { 
                type: lastImageMsg.attachment.mimeType,
                lastModified: Date.now() 
            });
        } catch (e) {
            console.error("Failed to prepare image for sharing", e);
        }
    }

    // 3. Trigger Share
    if (navigator.share && navigator.canShare) {
        const shareData: ShareData = {
            title: 'Skillfi - My Career Path',
            text: textToShare,
            url: window.location.href
        };

        if (fileToShare && navigator.canShare({ files: [fileToShare] })) {
            shareData.files = [fileToShare];
        }

        try {
            await navigator.share(shareData);
        } catch (err) {
            console.log('Native share failed or cancelled:', err);
        }
    } else {
        // Fallback
        navigator.clipboard.writeText(textToShare + "\n" + window.location.href).then(() => {
            alert("Results copied to clipboard! \n(Native social sharing is supported on mobile devices)");
        });
    }
  };

  return (
    <div className="flex h-screen bg-skillfi-bg overflow-hidden font-sans">
      {/* Sidebar for Desktop / Mobile Drawer */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        onModeSelect={handleModeSelect}
      />

      <div className="flex-1 flex flex-col h-full relative">
        {/* Decorative Background for Main Area */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-skillfi-neon to-skillfi-accent z-30"></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-skillfi-neon/5 rounded-full blur-3xl"></div>
            <div className="absolute top-40 right-0 w-96 h-96 bg-skillfi-accent/5 rounded-full blur-3xl"></div>
        </div>

        <Header 
            onShare={handleShare} 
            onNewChat={handleNewChat}
            onToggleMenu={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      
        <main className="flex-1 overflow-hidden relative flex flex-col z-10">
            <ChatInterface messages={messages} isLoading={isLoading} />
            
            {/* Vision Board Button */}
            {messages.length > 2 && !isLoading && !isGeneratingImage && (
                <div className="absolute bottom-4 right-4 z-20">
                    <button 
                        onClick={handleGenerateImage}
                        className="flex items-center gap-2 px-4 py-2 bg-skillfi-surface/90 backdrop-blur border border-skillfi-neon text-skillfi-neon text-xs font-bold rounded-full shadow-[0_0_15px_rgba(0,255,255,0.15)] hover:bg-skillfi-neon hover:text-black transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        GENERATE VISION BOARD
                    </button>
                </div>
            )}
            {isGeneratingImage && (
             <div className="absolute bottom-4 right-4 z-20">
                <div className="px-4 py-2 bg-skillfi-surface/80 backdrop-blur border border-skillfi-accent text-skillfi-accent text-xs font-bold rounded-full animate-pulse">
                    RENDERING VISUALS...
                </div>
             </div>
            )}
        </main>
      
        <footer className="bg-skillfi-bg/95 backdrop-blur-sm border-t border-gray-800 z-20 flex flex-col">
            <div className="p-4">
                <InputArea 
                    onSendMessage={handleSendMessage} 
                    onStop={handleStop}
                    isLoading={isLoading || isGeneratingImage} 
                />
            </div>
            {/* Branding Footer */}
            <div className="w-full text-center py-2 bg-black text-[10px] text-gray-500 font-mono tracking-widest border-t border-gray-900">
                Vibe coded by arewa.base.eth
            </div>
        </footer>
      </div>
    </div>
  );
};

export default App;