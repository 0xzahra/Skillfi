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
import { Tribes } from './components/Tribes';
import { Support } from './components/Support'; 
import { initializeChat, sendMessageToSkillfi, generateSpeech, generateCareerAvatar } from './services/geminiService';
import { AudioService } from './services/audioService';
import { Message, ViewMode, UserProfile, ActivityLog, ChatSession, LanguageCode } from './types';
import { INITIAL_GREETING } from './constants';

const App: React.FC = () => {
  // --- STATE ---
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>('AUTH');
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  
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
        // Migration check for old user objects that might lack new fields
        const parsed = JSON.parse(savedUser);
        const migratedUser: UserProfile = {
            ...parsed,
            skills: parsed.skills || [],
            credits: parsed.credits || 0,
            isElite: parsed.isElite || false
        };
        setUser(migratedUser);
    }
    
    // Load Chat History
    const savedSessions = localStorage.getItem('skillfi_sessions');
    if (savedSessions) {
        setSessions(JSON.parse(savedSessions));
    }

    // Init Chat with default lang
    initChat('en');
  }, []);

  // Re-initialize chat if language changes
  useEffect(() => {
      if (user) {
          initChat(currentLang);
      }
  }, [currentLang]);

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

  const handleSplashComplete = (selectedLang: LanguageCode) => {
      setCurrentLang(selectedLang);
      setShowSplash(false);
      // If user was found during initial load, go to dashboard, else Auth
      if (localStorage.getItem('skillfi_user')) {
          setCurrentView('DASHBOARD');
      } else {
          setCurrentView('AUTH');
      }
  };

  const initChat = async (lang: LanguageCode) => {
    try {
      chatSessionRef.current = await initializeChat(lang);
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
      const uWithDefaults = {
          ...loggedInUser,
          skills: [],
          credits: 0,
          isElite: false
      };
      setUser(uWithDefaults);
      setCurrentView('DASHBOARD');
      AudioService.playSuccess();
      initChat(currentLang);
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

  const handleAddSkill = (skill: string) => {
      if (!user) return;
      
      const updatedSkills = [...user.skills, skill];
      const newCredits = user.credits + 100;
      const eliteStatus = updatedSkills.length >= 5;

      const updatedUser: UserProfile = {
          ...user,
          skills: updatedSkills,
          credits: newCredits,
          isElite: user.isElite || eliteStatus // Once elite, always elite? or dynamic? Let's say dynamic but sticky.
      };

      if (eliteStatus && !user.isElite) {
          AudioService.playSuccess();
          alert("ELITE STATUS UNLOCKED! USDC SIMULATION ACTIVATED.");
      } else {
          AudioService.playSuccess(); // Credit earned sound
      }

      handleUpdateUser(updatedUser);
      setActivities(prev => [{
        id: Date.now().toString(),
        title: 'Skill Verified',
        desc: `Added ${skill} (+100 x404)`,
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
      initChat(currentLang);
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
      } else if (view === 'DASHBOARD' || view === 'PROFILE' || view === 'SETTINGS' || view === 'HISTORY' || view === 'TRIBES' || view === 'SUPPORT') {
          setCurrentView(view as ViewMode);
      } else if (view === 'LOGOUT') {
          localStorage.removeItem('skillfi_user');
          setUser(null);
          setCurrentView('AUTH');
      } 
      // Specific Chat Modes
      else if (view === 'RIGHTS') {
          setCurrentView('CHAT');
          handleSendMessage("Explain Marriage Rights (Protected by Divine/Universal Law) in detail.");
      }
      else if (view === 'DUTIES') {
          setCurrentView('CHAT');
          handleSendMessage("Outline the detailed Duties & Obligations in a standard marriage contract.");
      }
      else if (view === 'CRITERIA') {
          setCurrentView('CHAT');
          handleSendMessage("What are the recommended Criteria for selecting a spouse for long-term success?");
      }
      // General Chat Modes
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

    // Check for Image Generation Intent ("imagine me", "visualize", "create avatar")
    const isImageGenIntent = attachment && attachment.mimeType.startsWith('image/') && 
                             (text.toLowerCase().includes('imagine') || text.toLowerCase().includes('visualize') || text.toLowerCase().includes('avatar'));

    if (isImageGenIntent) {
        try {
            // Add a temporary loading message for image gen
            const loadingId = Date.now().toString() + '-gen';
            setMessages(prev => [...prev, {
                id: loadingId,
                role: 'model',
                content: "[PROCESSING IMAGE MATRIX] Analyzing biometric data... Generating future self projection...",
                timestamp: Date.now()
            }]);

            // Construct role description from user profile and text
            const skills = user?.skills.join(', ') || 'General Tech';
            const roleContext = `${text}. Skills: ${skills}. Level: ${user?.level}.`;
            
            const generatedImageBase64 = await generateCareerAvatar(attachment.data, roleContext);

            // Remove loading message
            setMessages(prev => prev.filter(m => m.id !== loadingId));

            if (generatedImageBase64) {
                const imgMsg: Message = {
                    id: Date.now().toString(),
                    role: 'model',
                    content: "Identity Projection Complete. Here is your visualized career avatar.",
                    attachment: {
                        data: generatedImageBase64,
                        mimeType: 'image/jpeg'
                    },
                    timestamp: Date.now()
                };
                setMessages(prev => [...prev, imgMsg]);
                AudioService.playSuccess();
                setIsLoading(false);
                return; // Exit early as we handled it
            } else {
                 throw new Error("Failed to generate image");
            }

        } catch (e) {
            console.error("Avatar Gen Failed", e);
             setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'model',
                content: "Visual matrix failed. Please try uploading a clearer photo.",
                timestamp: Date.now()
            }]);
            setIsLoading(false);
            return;
        }
    }

    try {
      if (!chatSessionRef.current) {
        chatSessionRef.current = await initializeChat(currentLang);
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

  // --- RENDERING ---

  // Determine if we should show the intro video
  // Video persists during Splash AND Auth (Login) screens
  const isIntroOrAuth = showSplash || currentView === 'AUTH';

  return (
    <div className="relative h-screen overflow-hidden bg-skillfi-bg text-white font-sans selection:bg-skillfi-neon selection:text-black">
      
      {/* Persistent Background Video for Intro/Auth */}
      {isIntroOrAuth && (
          <div className="fixed inset-0 z-0">
               {/* Diverse city crowd / busy market vibe - Represents 'Everyone and Everything' */}
              <video 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                  className="w-full h-full object-cover filter grayscale contrast-110 brightness-[0.6] opacity-60"
              >
                  {/* Using Pexels video as placeholder for the user's specific video content */}
                  <source src="https://videos.pexels.com/video-files/3252573/3252573-uhd_2560_1440_25fps.mp4" type="video/mp4" />
                  <div className="w-full h-full bg-neutral-900"></div>
              </video>
              
              {/* Tech Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 z-10"></div>
              
              {/* Scanline effect */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-50"></div>
              
              {/* Grain */}
              <div className="absolute inset-0 opacity-20 pointer-events-none z-10 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
          </div>
      )}

      {/* Intro Overlay */}
      {showSplash && (
          <IntroSplash onComplete={handleSplashComplete} />
      )}

      {/* Auth Screen (Overlaying Video) */}
      {!showSplash && currentView === 'AUTH' && (
          <div className="relative z-10 h-full overflow-y-auto">
              <Auth onLogin={handleLogin} currentLang={currentLang} />
          </div>
      )}

      {/* Main App (Dashboard/Chat/etc) */}
      {!showSplash && currentView !== 'AUTH' && (
          <div className="flex h-screen overflow-hidden bg-skillfi-bg relative z-20">
              <Sidebar 
                isOpen={isSidebarOpen} 
                onModeSelect={handleNavigate}
                onClose={() => setIsSidebarOpen(false)}
                credits={user?.credits || 0}
                currentLang={currentLang}
              />

              <div className="flex-1 flex flex-col h-full relative w-full">
                <Header 
                    onNewChat={handleNewChat}
                    onToggleMenu={() => setIsSidebarOpen(!isSidebarOpen)}
                    isVoiceMode={isVoiceMode}
                    onToggleVoice={toggleVoiceMode}
                    currentLang={currentLang}
                    onLangChange={(l) => setCurrentLang(l)}
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
                        onAddSkill={handleAddSkill}
                        currentLang={currentLang}
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
                                System v2.5 Online
                            </div>
                        </div>
                      </div>
                    </>
                  )}

                  {currentView === 'TOOLS_CALC' && <FinanceTools onAnalyze={handleAnalyzeFinance} />}
                  
                  {currentView === 'TRIBES' && <Tribes userCredits={user?.credits || 0} />}

                  {currentView === 'SUPPORT' && <Support />}

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
      )}
    </div>
  );
};

export default App;