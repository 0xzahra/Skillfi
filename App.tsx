import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
import { InputArea } from './components/InputArea';
import { initializeChat, sendMessageToSkillfi } from './services/geminiService';
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
  const [userState, setUserState] = useState<UserState>({
    hasInteracted: false
  });

  const chatSessionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize the Gemini Chat Session on mount
    const init = async () => {
      try {
        chatSessionRef.current = await initializeChat();
      } catch (error) {
        console.error("Failed to initialize chat", error);
        setMessages(prev => [...prev, {
            id: 'err-init',
            role: 'model',
            content: "System Alert: Connection unstable. Please check API configuration.",
            timestamp: Date.now()
        }]);
      }
    };
    init();
  }, []);

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
    setUserState({ hasInteracted: true });

    try {
      if (!chatSessionRef.current) {
        // Retry init if failed previously or race condition
        chatSessionRef.current = await initializeChat();
      }

      const responseText = await sendMessageToSkillfi(chatSessionRef.current, text, attachment);

      const newBotMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, newBotMsg]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: "[Soft alert tone] Connection interrupted. Please retry your transmission.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-skillfi-bg border-x border-gray-900 shadow-2xl relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-skillfi-neon to-skillfi-accent z-50"></div>
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-skillfi-neon/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-40 -right-20 w-96 h-96 bg-skillfi-accent/5 rounded-full blur-3xl pointer-events-none"></div>

      <Header />
      
      <main className="flex-1 overflow-hidden relative flex flex-col">
        <ChatInterface messages={messages} isLoading={isLoading} />
      </main>
      
      <footer className="p-4 bg-skillfi-bg/95 backdrop-blur-sm border-t border-gray-800 z-10">
        <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
      </footer>
    </div>
  );
};

export default App;