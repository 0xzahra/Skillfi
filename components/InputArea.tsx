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

  return (
    <div className="w-full flex flex-col gap-3 font-sans relative z-50">
      
      {/* Advanced Plus Menu */}
      {showPlusMenu && (
          <div ref={menuRef} className="absolute bottom-full left-0 mb-4 w-full md:w-[400px] glass-panel bg-[#020409]/95 backdrop-blur-2xl border border-skillfi-neon/30 rounded-2xl p-4 shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-fade-in overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-skillfi-neon to-transparent opacity-50"></div>
              
              <div className="grid grid-cols-3 gap-3">
                  {/* Visual Analysis */}
                  <button onClick={() => handleFileTrigger('image/*')} className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-white/10 transition-all group border border-white/5 hover:border-skillfi-neon/50">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform text-blue-400">👁️</div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300 group-hover:text-white">Vision</span>
                  </button>

                  {/* Document Analysis */}
                  <button onClick={() => handleFileTrigger('.pdf,.doc,.docx,.txt')} className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-white/10 transition-all group border border-white/5 hover:border-skillfi-neon/50">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform text-purple-400">📄</div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300 group-hover:text-white">Docs</span>
                  </button>

                  {/* Deep Reasoning */}
                  <button onClick={() => handleModeSelect('[DEEP THINKING MODE]:')} className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-white/10 transition-all group border border-white/5 hover:border-skillfi-neon/50">
                      <div className="w-10 h-10 rounded-full bg-skillfi-neon/20 flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform text-skillfi-neon">🧠</div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300 group-hover:text-white">Reasoning</span>
                  </button>

                  {/* Web Search */}
                  <button onClick={() => handleModeSelect('[WEB SEARCH]:')} className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-white/10 transition-all group border border-white/5 hover:border-skillfi-neon/50">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform text-green-400">🌐</div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300 group-hover:text-white">Web Link</span>
                  </button>

                  {/* Code Interpreter Sim */}
                  <button onClick={() => handleModeSelect('[CODE INTERPRETER]:')} className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-white/10 transition-all group border border-white/5 hover:border-skillfi-neon/50">
                      <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform text-orange-400">💻</div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300 group-hover:text-white">Code</span>
                  </button>

                  {/* Audio */}
                  <button onClick={() => toggleRecording()} className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-white/10 transition-all group border border-white/5 hover:border-skillfi-neon/50">
                      <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform text-red-400">🎙️</div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300 group-hover:text-white">Studio</span>
                  </button>
              </div>
              
              <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-center px-1">
                  <span className="text-[9px] text-gray-600 font-mono uppercase">System Ready</span>
                  <span className="text-[9px] text-skillfi-neon font-mono uppercase animate-pulse">v4.5 Connected</span>
              </div>
          </div>
      )}

      {attachment && (
        <div className="flex items-center justify-between glass-panel px-4 py-2 rounded-xl text-sm animate-fade-in shadow-lg border border-skillfi-neon/30">
          <span className="text-skillfi-neon truncate max-w-[200px] flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z" clipRule="evenodd" />
            </svg>
            {attachment.name}
          </span>
          <button onClick={() => setAttachment(null)} className="text-gray-400 hover:text-white px-2">✕</button>
        </div>
      )}

      {/* Floating Command Bar */}
      <div className="flex items-end gap-2 p-2 glass-panel rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-visible backdrop-blur-xl transition-all duration-300 hover:border-skillfi-neon/30">
        
        {/* Recording Waveform Overlay */}
        {isRecording && (
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-20 pointer-events-none rounded-2xl overflow-hidden">
                <div className="flex items-end gap-1 h-full pb-4">
                    {[...Array(20)].map((_, i) => (
                        <div 
                            key={i} 
                            className="w-1 bg-skillfi-neon animate-pulse" 
                            style={{ 
                                height: `${Math.random() * 100}%`,
                                animationDuration: `${0.2 + Math.random() * 0.5}s` 
                            }}
                        ></div>
                    ))}
                </div>
            </div>
        )}

        {/* PLUS BUTTON (The Advanced Trigger) */}
        <button 
            onClick={() => setShowPlusMenu(!showPlusMenu)}
            className={`p-3 rounded-xl transition-all relative z-10 group ${showPlusMenu ? 'bg-skillfi-neon text-black rotate-45' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
            disabled={isLoading}
            title="Open Command Center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
        
        {/* Hidden File Input */}
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isRecording ? "Listening to audio stream..." : "Enter Command..."}
          className="flex-1 bg-transparent border-none px-2 py-3.5 text-white placeholder-gray-500 focus:outline-none text-base resize-none h-[52px] max-h-32 transition-colors relative z-10 font-medium"
          disabled={isLoading || isRecording}
          rows={1}
        />

        {/* Quick Mic (Legacy/Quick Access) */}
        {!text && !attachment && (
            <button 
            onClick={toggleRecording}
            className={`p-3 rounded-xl transition-all duration-300 relative z-10 ${isRecording ? 'bg-red-500/20 text-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
            disabled={isLoading}
            title={isRecording ? "Stop Recording" : "Voice Input"}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
            </button>
        )}

        {isLoading ? (
          <button 
            onClick={onStop}
            className="relative px-6 py-3 font-bold tracking-wide transition-all duration-300 bg-white/5 text-white rounded-xl shadow-lg overflow-hidden border border-white/10 group hover:border-red-500/50 z-10"
          >
             {/* Content Layer */}
             <span className="relative z-10 flex items-center gap-2 text-xs">
                 <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                 HALT
             </span>
          </button>
        ) : (
          <button 
            onClick={handleSend}
            disabled={(!text.trim() && !attachment)}
            className={`px-4 py-3 font-bold tracking-wide transition-all duration-300 rounded-xl shadow-lg flex items-center justify-center z-10 ${
              (!text.trim() && !attachment)
                ? 'bg-transparent text-gray-600 cursor-not-allowed' 
                : 'bg-skillfi-neon text-black hover:bg-white hover:shadow-[0_0_20px_#00ffff]'
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