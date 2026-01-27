import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
import { InputArea } from './components/InputArea';
import { Sidebar } from './components/Sidebar';
import { FinanceTools } from './components/FinanceTools';
import { Dashboard } from './components/Dashboard';
import { Auth } from './components/Auth';
import { Settings } from './components/Settings';
import { ChatHistory } from './components/ChatHistory';
import { IntroSplash } from './components/IntroSplash';
import { initializeChat, sendMessageToSkillfi, generateSpeech } from './services/geminiService';
import { AudioService } from './services/audioService';
import { Message, ViewMode, UserProfile, ActivityLog, ChatSession } from './types';
import { INITIAL_GREETING } from './constants';

const App: React.FC = () => {
  // --- STATE ---
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>('AUTH');
  const [activities, setActivities] = useState<ActivityLog[]>([
      { id: '1', title: 'System Initialization', desc: 'User logged in', time: 'Just now', type: 'SYSTEM' },
      { id: '2', title: 'Market Scan', desc: 'Analyzed Web3 trends', time: '2h ago', type: 'SYSTEM' },
      { id: '3', title: 'Portfolio Update', desc: 'Net worth recalculated', time: '5h ago', type: 'USER' }
  ]);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'model',
      content: INITIAL_GREETING,
      timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  
  // History State
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const chatSessionRef = useRef<any>(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    // Check local storage for auth logic, but don't set view until splash is done
    const savedUser = localStorage.getItem('skillfi_user');
    if (savedUser) {
        setUser(JSON.parse(savedUser));
        initChat();
    }
    
    // Load Chat History
    const savedSessions = localStorage.getItem('skillfi_sessions');
    if (savedSessions) {
        setSessions(JSON.parse(savedSessions));
    }
  }, []);

  // Save Sessions to LocalStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
        localStorage.setItem('skillfi_sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  // Auto-save current chat to history
  useEffect(() => {
    // Only save if we have meaningful messages (more than just the initial greeting)
    if (messages.length > 1) {
        saveCurrentSession();
    }
  }, [messages]);

  const handleSplashComplete = () => {
      setShowSplash(false);
      // If user was found during initial load, go to dashboard, else Auth
      if (localStorage.getItem('skillfi_user')) {
          setCurrentView('DASHBOARD');
      } else {
          setCurrentView('AUTH');
      }
  };

  const initChat = async () => {
    try {
      chatSessionRef.current = await initializeChat();
    } catch (error) {
      console.error("Failed to initialize chat", error);
    }
  };

  const saveCurrentSession = () => {
      const title = messages[1]?.content?.substring(0, 30) + (messages[1]?.content?.length > 30 ? '...' : '') || 'New Session';
      const preview = messages[messages.length - 1]?.content?.substring(0, 50) + '...' || 'No content';
      
      const sessionData: ChatSession = {
          id: currentSessionId || Date.now().toString(),
          title: currentSessionId ? (sessions.find(s => s.id === currentSessionId)?.title || title) : title,
          messages: messages,
          lastModified: Date.now(),
          preview: preview
      };

      setSessions(prev => {
          const exists = prev.find(s => s.id === sessionData.id);
          if (exists) {
              return prev.map(s => s.id === sessionData.id ? sessionData : s);
          } else {
              setCurrentSessionId(sessionData.id);
              return [sessionData, ...prev];
          }
      });
  };

  // --- HANDLERS ---

  const handleLogin = (loggedInUser: UserProfile) => {
      setUser(loggedInUser);
      setCurrentView('DASHBOARD');
      AudioService.playSuccess();
      initChat();
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
      setUser(updatedUser);
      localStorage.setItem('skillfi_user', JSON.stringify(updatedUser));
      setActivities(prev => [{
          id: Date.now().toString(),
          title: 'Profile Updated',
          desc: 'User settings modified',
          time: 'Just now',
          type: 'USER'
      }, ...prev]);
  };

  const handleClearActivity = () => {
      setActivities([]);
      AudioService.playProcessing();
  };

  const handleDeleteAccount = () => {
      if (confirm("WARNING: Are you sure you want to delete your account? This action is irreversible.")) {
          localStorage.removeItem('skillfi_user');
          localStorage.removeItem('skillfi_sessions');
          setUser(null);
          setSessions([]);
          setCurrentView('AUTH');
          setMessages([{ id: Date.now().toString(), role: 'model', content: INITIAL_GREETING, timestamp: Date.now() }]);
          AudioService.playAlert();
      }
  };

  const handleNewChat = () => {
      setMessages([{ id: Date.now().toString(), role: 'model', content: INITIAL_GREETING, timestamp: Date.now() }]);
      setCurrentSessionId(null);
      setCurrentView('CHAT');
      initChat();
  };

  const handleSelectSession = (id: string) => {
      const session = sessions.find(s => s.id === id);
      if (session) {
          setMessages(session.messages);
          setCurrentSessionId(session.id);
          setCurrentView('CHAT');
      }
  };

  const handleDeleteSession = (id: string) => {
      setSessions(prev => prev.filter(s => s.id !== id));
      if (currentSessionId === id) {
          handleNewChat();
      }
  };

  const handleRenameSession = (id: string, newTitle: string) => {
      setSessions(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
  };

  const handleNavigate = (view: string) => {
      // Direct Navigation Views (No Chat Trigger)
      if (view === 'FINANCE' || view === 'TOOLS_CALC') {
          setCurrentView('TOOLS_CALC');
      } else if (view === 'DASHBOARD' || view === 'PROFILE' || view === 'SETTINGS' || view === 'HISTORY') {
          setCurrentView(view as ViewMode);
      } else if (view === 'LOGOUT') {
          localStorage.removeItem('skillfi_user');
          setUser(null);
          setCurrentView('AUTH');
      } 
      // Chat Modes (Triggers Context Switch)
      else {
          setCurrentView('CHAT');
          handleSendMessage(`ACTIVATE MODE: ${view}`);
      }
      setIsSidebarOpen(false);
  };

  // Triggered by Finance Tools
  const handleAnalyzeFinance = (dataContext: string) => {
      setCurrentView('CHAT');
      handleSendMessage(`[SYSTEM AUDIT REQUEST]\nDATA PACKAGE:\n${dataContext}\n\nTASK: Analyze this financial data. Provide a ruthless, optimized strategy to maximize wealth and efficiency. Spot leaks and suggest improvements.`);
  };

  const handleSendMessage = async (text: string, attachment?: { data: string; mimeType: string }) => {
    if (!text.trim() && !attachment) return;

    if (currentView !== 'CHAT') setCurrentView('CHAT');

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      attachment: attachment,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);
    AudioService.playProcessing();

    try {
      if (!chatSessionRef.current) {
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
      
      // Voice Output Logic
      if (isVoiceMode) {
          // Attempt High-Fidelity TTS first
          const speechData = await generateSpeech(responseText);
          if (speechData) {
              AudioService.playPCM(speechData);
          } else {
              // Fallback to browser TTS if API fails/limits
              AudioService.speak(responseText);
          }
      } else {
          AudioService.playSuccess(); // Just a beep if voice off
      }

    } catch (error) {
      console.error("Chat Error", error);
      const errorMsg: Message = {
          id: Date.now().toString(),
          role: 'model',
          content: "System Error: Unable to process request. Please retry.",
          timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
      AudioService.playAlert();
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceMode = () => {
      setIsVoiceMode(!isVoiceMode);
      if (!isVoiceMode) {
          AudioService.speak("Voice interface activated.");
      } else {
          AudioService.stopSpeech();
      }
  };

  if (showSplash) {
      return <IntroSplash onComplete={handleSplashComplete} />;
  }

  if (currentView === 'AUTH') {
      return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-skillfi-bg text-white font-sans selection:bg-skillfi-neon selection:text-black">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onModeSelect={handleNavigate}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col h-full relative w-full">
        <Header 
            onNewChat={handleNewChat}
            onToggleMenu={() => setIsSidebarOpen(!isSidebarOpen)}
            isVoiceMode={isVoiceMode}
            onToggleVoice={toggleVoiceMode}
            onShare={() => {
                const transcript = messages.map(m => `[${m.role.toUpperCase()}]: ${m.content}`).join('\n');
                navigator.clipboard.writeText(transcript);
                alert("Session transcript copied to clipboard.");
            }}
        />

        <main className="flex-1 overflow-hidden relative flex flex-col">
          {currentView === 'DASHBOARD' && (
              <Dashboard 
                user={user!} 
                activities={activities}
                onNavigate={handleNavigate}
              />
          )}
          
          {currentView === 'CHAT' && (
            <>
              <ChatInterface messages={messages} isLoading={isLoading} />
              <div className="p-4 md:p-6 bg-skillfi-bg/95 backdrop-blur border-t border-gray-800">
                <div className="max-w-4xl mx-auto">
                    <InputArea 
                        onSendMessage={handleSendMessage} 
                        onStop={() => setIsLoading(false)}
                        isLoading={isLoading} 
                    />
                    <div className="text-center mt-3 text-[10px] text-gray-600 font-mono">
                        Vibe coded by arewa.base.eth © 2026
                    </div>
                </div>
              </div>
            </>
          )}

          {currentView === 'TOOLS_CALC' && <FinanceTools onAnalyze={handleAnalyzeFinance} />}
          
          {currentView === 'SETTINGS' && (
              <Settings 
                user={user!}
                onUpdateUser={handleUpdateUser}
                onClearActivity={handleClearActivity}
                onDeleteAccount={handleDeleteAccount}
              />
          )}

          {currentView === 'HISTORY' && (
              <ChatHistory 
                sessions={sessions}
                onSelectSession={handleSelectSession}
                onDeleteSession={handleDeleteSession}
                onRenameSession={handleRenameSession}
              />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;