
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
import { LanguageSelector } from './components/LanguageSelector';
import { Tribes } from './components/Tribes';
import { Support } from './components/Support'; 
import { Inbox } from './components/Inbox';
import { Notifications } from './components/Notifications';
import { CareerArsenal } from './components/CareerArsenal'; 
import { EducationCenter } from './components/EducationCenter'; 
import { MentalHealth } from './components/MentalHealth';
import { OnboardingTour } from './components/OnboardingTour';
import { initializeChat, sendMessageToSkillfi, generateSpeech, generateCareerAvatar } from './services/geminiService';
import { AudioService } from './services/audioService';
import { Message, ViewMode, UserProfile, ActivityLog, ChatSession, LanguageCode } from './types';
import { INITIAL_GREETING } from './constants';

const App: React.FC = () => {
  // --- STATE ---
  const [showSplash, setShowSplash] = useState(true);
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>('AUTH');
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [theme, setTheme] = useState<'dark' | 'light'>('light'); // Default to Light Mode for Academic Look
  const [lastSync, setLastSync] = useState<number>(Date.now());
  
  const [scoutPrompt, setScoutPrompt] = useState<string | null>(null);

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
  
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const chatSessionRef = useRef<any>(null);
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  // --- INITIALIZATION ---
  
  useEffect(() => {
      // Check Theme Preference - Defaulting to light if not set
      const savedTheme = localStorage.getItem('skillfi_theme') as 'dark' | 'light' | null;
      if (savedTheme) {
          setTheme(savedTheme);
      } else {
          setTheme('light');
      }
  }, []);

  useEffect(() => {
      if (theme === 'dark') {
          document.documentElement.classList.add('dark');
      } else {
          document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('skillfi_theme', theme);
  }, [theme]);

  useEffect(() => {
    // @ts-ignore
    if (window.Lenis) {
        // @ts-ignore
        const lenis = new window.Lenis({
            duration: 1.0,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        return () => { lenis.destroy(); };
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('skillfi_user');
    if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const migratedUser: UserProfile = {
            ...parsed,
            skills: parsed.skills || [],
            credits: parsed.credits || 0,
            isElite: parsed.isElite || false
        };
        setUser(migratedUser);
    }
    
    const savedSessions = localStorage.getItem('skillfi_sessions');
    if (savedSessions) {
        setSessions(JSON.parse(savedSessions));
    }

    initChat('en');
  }, []);

  useEffect(() => {
      if (user) initChat(currentLang);
  }, [currentLang]);

  useEffect(() => {
    if (sessions.length > 0) {
        localStorage.setItem('skillfi_sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    if (messages.length > 1) {
        saveCurrentSession();
    }
  }, [messages]);

  const handleSplashComplete = () => {
      setShowSplash(false);
      setShowLanguageSelect(true);
  };

  const handleLanguageSelect = (selectedLang: LanguageCode) => {
      setCurrentLang(selectedLang);
      setShowLanguageSelect(false);
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
      if (!localStorage.getItem('skillfi_tour_seen')) {
          setShowTour(true);
          localStorage.setItem('skillfi_tour_seen', 'true');
      }
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
          isElite: user.isElite || eliteStatus
      };

      if (eliteStatus && !user.isElite) {
          AudioService.playSuccess();
          alert("ELITE STATUS UNLOCKED.");
      } else {
          AudioService.playSuccess(); 
      }

      handleUpdateUser(updatedUser);
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
      if (navigator.vibrate) navigator.vibrate(10);

      if (view === 'FINANCE' || view === 'TOOLS_CALC') {
          setCurrentView('TOOLS_CALC');
      } 
      else if (view === 'CAREER') {
          setCurrentView('CAREER');
      }
      else if (view === 'EDUCATION') {
          setCurrentView('EDUCATION');
      }
      else if (['DASHBOARD', 'PROFILE', 'SETTINGS', 'HISTORY', 'TRIBES', 'SUPPORT', 'INBOX', 'NOTIFICATIONS', 'MENTAL_HEALTH'].includes(view)) {
          setCurrentView(view as any);
      } else if (view === 'LOGOUT') {
          localStorage.removeItem('skillfi_user');
          setUser(null);
          setCurrentView('AUTH');
      } 
      else if (view === 'TRADING') {
          setCurrentView('CHAT');
          handleSendMessage("ACTIVATE MODE: TRADING DOJO. Focus on risk management, technical analysis, and psychology.");
      }
      else {
          setCurrentView('CHAT');
          handleSendMessage(`ACTIVATE MODE: ${view}`);
      }
      setIsSidebarOpen(false);
  };

  const handleInstantScout = (hobbies: string) => {
      setScoutPrompt(hobbies);
      setCurrentView('CAREER');
  };

  const handleAnalyzeFinance = (dataContext: string) => {
      setCurrentView('CHAT');
      handleSendMessage(`[SYSTEM AUDIT REQUEST]\nDATA PACKAGE:\n${dataContext}\n\nTASK: Analyze this financial data. Provide a ruthless, optimized strategy to maximize wealth and efficiency. Spot leaks and suggest improvements.`);
  };

  const handleGlobalSync = () => {
      setLastSync(Date.now());
      AudioService.playProcessing();
      setTimeout(() => AudioService.playSuccess(), 500);
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

    const isImageGenIntent = attachment && attachment.mimeType.startsWith('image/') && 
                             (text.toLowerCase().includes('imagine') || text.toLowerCase().includes('visualize') || text.toLowerCase().includes('avatar'));

    if (isImageGenIntent) {
        try {
            const loadingId = Date.now().toString() + '-gen';
            setMessages(prev => [...prev, {
                id: loadingId,
                role: 'model',
                content: "Generating visualization...",
                timestamp: Date.now()
            }]);

            const skills = user?.skills.join(', ') || 'General Tech';
            const roleContext = `${text}. Skills: ${skills}. Level: ${user?.level}.`;
            const generatedImageBase64 = await generateCareerAvatar(attachment.data, roleContext);

            setMessages(prev => prev.filter(m => m.id !== loadingId));

            if (generatedImageBase64) {
                const imgMsg: Message = {
                    id: Date.now().toString(),
                    role: 'model',
                    content: "Visualization Complete.",
                    attachment: {
                        data: generatedImageBase64,
                        mimeType: 'image/jpeg'
                    },
                    timestamp: Date.now()
                };
                setMessages(prev => [...prev, imgMsg]);
                AudioService.playSuccess();
                setIsLoading(false);
                return;
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
      
      if (isVoiceMode) {
          const speechData = await generateSpeech(responseText);
          if (speechData) {
              AudioService.playPCM(speechData);
          } else {
              AudioService.speak(responseText);
          }
      } else {
          AudioService.playSuccess();
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

  // --- GESTURE LOGIC ---
  const handleTouchStart = (e: React.TouchEvent) => {
      touchStart.current = e.targetTouches[0].clientX;
      touchEnd.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
      touchEnd.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
      if (!touchStart.current || !touchEnd.current) return;
      const distance = touchStart.current - touchEnd.current;
      const isLeftSwipe = distance > 70; 
      const isRightSwipe = distance < -70;

      if (isRightSwipe && touchStart.current < 50) {
          setIsSidebarOpen(true);
      }
      
      if (isLeftSwipe && isSidebarOpen) {
          setIsSidebarOpen(false);
      }
  };

  const isIntroOrAuth = showSplash || showLanguageSelect || currentView === 'AUTH';

  return (
    <div 
        className="relative h-screen w-full overflow-hidden font-sans selection:bg-skillfi-neon selection:text-white dark:text-white text-gray-900 bg-skillfi-bg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
    >
      {/* Intro Overlay */}
      {showSplash && (
          <IntroSplash onComplete={handleSplashComplete} />
      )}

      {/* Language Selection */}
      {!showSplash && showLanguageSelect && (
          <LanguageSelector onSelect={handleLanguageSelect} />
      )}

      {/* Auth Screen */}
      {!showSplash && !showLanguageSelect && currentView === 'AUTH' && (
          <div className="relative z-10 h-full w-full overflow-y-auto bg-skillfi-bg flex items-center justify-center">
              <Auth onLogin={handleLogin} currentLang={currentLang} />
          </div>
      )}

      {/* Onboarding Tour Overlay */}
      {showTour && <OnboardingTour onClose={() => setShowTour(false)} />}

      {/* Main App */}
      {!showSplash && !showLanguageSelect && currentView !== 'AUTH' && (
          <div className="flex h-screen w-full overflow-hidden relative z-20">
              
              <Sidebar 
                isOpen={isSidebarOpen} 
                onModeSelect={handleNavigate}
                onClose={() => setIsSidebarOpen(false)}
                credits={user?.credits || 0}
                currentLang={currentLang}
              />

              <div className="flex-1 flex flex-col h-full relative w-full z-10 overflow-hidden bg-skillfi-bg">
                <Header 
                    onNewChat={handleNewChat}
                    onToggleMenu={() => setIsSidebarOpen(!isSidebarOpen)}
                    isVoiceMode={isVoiceMode}
                    onToggleVoice={toggleVoiceMode}
                    currentLang={currentLang}
                    onLangChange={(l) => setCurrentLang(l)}
                    onViewNotifications={() => handleNavigate('NOTIFICATIONS')}
                    onViewInbox={() => handleNavigate('INBOX')}
                    onShare={() => {}}
                    onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    theme={theme}
                    onSync={handleGlobalSync}
                    onToggleTour={() => setShowTour(!showTour)}
                />

                <main className="flex-1 overflow-hidden relative flex flex-col w-full">
                  {currentView === 'DASHBOARD' && (
                      <Dashboard 
                        user={user!} 
                        onNavigate={handleNavigate}
                        onAddSkill={handleAddSkill}
                        currentLang={currentLang}
                        onScout={handleInstantScout}
                      />
                  )}
                  
                  {currentView === 'CAREER' && (
                      <CareerArsenal 
                        user={user!} 
                        initialScoutData={scoutPrompt} 
                        lastSync={lastSync}
                      />
                  )}
                  {currentView === 'EDUCATION' && <EducationCenter lastSync={lastSync} />}
                  {currentView === 'MENTAL_HEALTH' && <MentalHealth />}

                  {currentView === 'CHAT' && (
                    <>
                      <ChatInterface messages={messages} isLoading={isLoading} />
                      <div className="p-4 md:p-6 bg-transparent border-t border-skillfi-border w-full">
                        <div className="max-w-4xl mx-auto w-full">
                            <InputArea 
                                onSendMessage={handleSendMessage} 
                                onStop={() => setIsLoading(false)}
                                isLoading={isLoading} 
                            />
                        </div>
                      </div>
                    </>
                  )}

                  {currentView === 'TOOLS_CALC' && <FinanceTools onAnalyze={handleAnalyzeFinance} currentLang={currentLang} lastSync={lastSync} />}
                  
                  {currentView === 'TRIBES' && <Tribes userCredits={user?.credits || 0} onNavigate={handleNavigate} />}

                  {currentView === 'SUPPORT' && <Support />}
                  
                  {currentView === 'INBOX' && <Inbox />}

                  {currentView === 'NOTIFICATIONS' && <Notifications onNavigate={handleNavigate} />}

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
