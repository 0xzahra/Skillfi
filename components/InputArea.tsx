
import React, { useState, useRef, useEffect } from 'react';

interface InputAreaProps {
  onSendMessage: (text: string, attachment?: { data: string; mimeType: string }) => void;
  onStop: () => void;
  isLoading: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, onStop, isLoading }) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [attachment, setAttachment] = useState<{ name: string; type: string; data: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowPlusMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = () => {
    if ((!text.trim() && !attachment) || isLoading) return;
    
    onSendMessage(
      text, 
      attachment ? { data: attachment.data, mimeType: attachment.type } : undefined
    );
    
    setText('');
    setAttachment(null);
    setShowPlusMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileTrigger = (acceptType: string) => {
      if (fileInputRef.current) {
          fileInputRef.current.accept = acceptType;
          fileInputRef.current.click();
      }
      setShowPlusMenu(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        setAttachment({
          name: file.name,
          type: file.type,
          data: base64Data
        });
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleModeSelect = (modePrefix: string) => {
      setText(prev => `${modePrefix} ${prev}`);
      setShowPlusMenu(false);
  };

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        const audioChunks: Blob[] = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const base64Data = base64String.split(',')[1];
                setAttachment({
                    name: "Voice Note",
                    type: "audio/mp3",
                    data: base64Data
                });
            };
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
        alert("Microphone access denied.");
      }
    }
  };

  const menuItems = [
      { 
          icon: '👁️', 
          label: 'Visual Uplink', 
          desc: 'Analyze Images', 
          action: () => handleFileTrigger('image/*'), 
          bg: 'bg-blue-50 text-blue-600' 
      },
      { 
          icon: '📄', 
          label: 'Doc Parser', 
          desc: 'Read PDFs/Txt', 
          action: () => handleFileTrigger('.pdf,.doc,.docx,.txt'), 
          bg: 'bg-purple-50 text-purple-600' 
      },
      { 
          icon: '🎙️', 
          label: 'Voice Log', 
          desc: 'Record Memo', 
          action: () => toggleRecording(), 
          bg: 'bg-red-50 text-red-600' 
      },
      { 
          icon: '🧠', 
          label: 'Strategist', 
          desc: 'Deep Reasoning', 
          action: () => handleModeSelect('[DEEP THINKING MODE]:'), 
          bg: 'bg-yellow-50 text-yellow-600' 
      },
      { 
          icon: '🌐', 
          label: 'Live Data', 
          desc: 'Web Search', 
          action: () => handleModeSelect('[WEB SEARCH]:'), 
          bg: 'bg-green-50 text-green-600' 
      },
      { 
          icon: '🏗️', 
          label: 'Builder', 
          desc: 'Code Gen', 
          action: () => handleModeSelect('[CODE INTERPRETER]:'), 
          bg: 'bg-orange-50 text-orange-600' 
      }
  ];

  return (
    <div className="w-full flex flex-col gap-3 font-sans relative z-50">
      
      {/* Command Center */}
      {showPlusMenu && (
          <div ref={menuRef} className="absolute bottom-full left-0 mb-4 w-full md:w-[450px] bg-white border border-skillfi-border rounded-2xl p-6 shadow-2xl animate-fade-in overflow-hidden">
              <div className="flex justify-between items-center mb-4 border-b border-skillfi-border pb-2">
                  <h3 className="text-skillfi-accent font-bold uppercase tracking-widest text-xs">Command Center</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                  {menuItems.map((btn, idx) => (
                      <button 
                        key={idx} 
                        onClick={btn.action} 
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border border-transparent hover:border-skillfi-border transition-all group ${btn.bg} hover:shadow-sm`}
                      >
                          <div className={`text-2xl mb-2 group-hover:scale-110 transition-transform`}>{btn.icon}</div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-skillfi-text">{btn.label}</span>
                      </button>
                  ))}
              </div>
          </div>
      )}

      {attachment && (
        <div className="flex items-center justify-between bg-white border border-skillfi-border px-4 py-2 rounded-xl text-sm animate-fade-in shadow-sm">
          <span className="text-skillfi-neon truncate max-w-[200px] flex items-center gap-2 font-medium">
            <span className="text-lg">📎</span> {attachment.name}
          </span>
          <button onClick={() => setAttachment(null)} className="text-skillfi-dim hover:text-skillfi-error px-2">✕</button>
        </div>
      )}

      {/* Input Bar */}
      <div className="flex items-end gap-3 p-3 bg-white rounded-2xl shadow-lg border border-skillfi-border relative overflow-visible transition-all duration-300">
        
        {/* Recording Visualizer */}
        {isRecording && (
            <div className="absolute inset-0 z-0 flex items-center justify-center bg-red-50/50 rounded-2xl">
                <div className="text-red-500 font-bold text-xs uppercase animate-pulse">Recording Active...</div>
            </div>
        )}

        {/* PLUS BUTTON */}
        <button 
            onClick={() => setShowPlusMenu(!showPlusMenu)}
            className={`p-4 rounded-xl transition-all relative z-10 ${showPlusMenu ? 'bg-skillfi-neon text-white rotate-45' : 'bg-gray-100 text-skillfi-dim hover:bg-gray-200'}`}
            disabled={isLoading}
            title="Open Command Center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
        
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isRecording ? "Listening..." : "Type your command..."}
          className="flex-1 bg-transparent border-none px-2 py-4 text-skillfi-text placeholder-skillfi-dim focus:outline-none text-base resize-none h-[56px] max-h-32 transition-colors relative z-10 font-medium"
          disabled={isLoading || isRecording}
          rows={1}
        />

        {/* Quick Mic */}
        {!text && !attachment && (
            <button 
            onClick={toggleRecording}
            className={`p-4 rounded-xl transition-all duration-300 relative z-10 ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-skillfi-dim hover:text-skillfi-neon hover:bg-gray-100'}`}
            disabled={isLoading}
            title={isRecording ? "Stop" : "Voice"}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
            </button>
        )}

        {isLoading ? (
          <button 
            onClick={onStop}
            className="px-6 py-4 font-bold tracking-wide bg-gray-100 text-skillfi-text rounded-xl hover:bg-red-50 hover:text-red-500 transition-all z-10"
          >
             <span className="flex items-center gap-2 text-xs">
                 <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                 STOP
             </span>
          </button>
        ) : (
          <button 
            onClick={handleSend}
            disabled={(!text.trim() && !attachment)}
            className={`px-5 py-4 font-bold transition-all rounded-xl flex items-center justify-center z-10 ${
              (!text.trim() && !attachment)
                ? 'bg-transparent text-gray-300 cursor-not-allowed' 
                : 'bg-skillfi-neon text-white hover:bg-blue-700 shadow-md transform active:scale-95'
            }`}
          >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
             </svg>
          </button>
        )}
      </div>
    </div>
  );
};
