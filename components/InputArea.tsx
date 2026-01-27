import React, { useState, useRef } from 'react';

interface InputAreaProps {
  onSendMessage: (text: string, attachment?: { data: string; mimeType: string }) => void;
  onStop: () => void;
  isLoading: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, onStop, isLoading }) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [attachment, setAttachment] = useState<{ name: string; type: string; data: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleSend = () => {
    if ((!text.trim() && !attachment) || isLoading) return;
    
    onSendMessage(
      text, 
      attachment ? { data: attachment.data, mimeType: attachment.type } : undefined
    );
    
    setText('');
    setAttachment(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
    <div className="w-full flex flex-col gap-2 font-sans">
      {attachment && (
        <div className="flex items-center justify-between bg-[#111] px-4 py-2 border border-skillfi-neon/30 rounded-lg text-sm">
          <span className="text-skillfi-neon truncate max-w-[200px] flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z" clipRule="evenodd" />
            </svg>
            {attachment.name}
          </span>
          <button onClick={() => setAttachment(null)} className="text-gray-400 hover:text-white px-2">✕</button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3.5 text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-xl transition-all"
            disabled={isLoading}
            title="Upload Data"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
          </svg>
        </button>
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*,application/pdf,audio/*" />

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isRecording ? "Recording..." : "Ask Skillfi..."}
          className="flex-1 bg-[#111] border border-gray-800 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-skillfi-neon/50 text-base resize-none h-[52px] max-h-32 shadow-sm transition-colors"
          disabled={isLoading || isRecording}
          rows={1}
        />

        <button 
          onClick={toggleRecording}
          className={`p-3.5 rounded-xl transition-all duration-300 ${isRecording ? 'bg-red-500/10 text-red-500 animate-pulse ring-1 ring-red-500' : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'}`}
          disabled={isLoading}
          title={isRecording ? "Stop Recording" : "Voice Input"}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
        </button>

        {isLoading ? (
          <button 
            onClick={onStop}
            className="relative px-8 py-3.5 font-bold tracking-wide transition-all duration-300 bg-[#1a1a1a] text-white rounded-xl shadow-lg overflow-hidden border border-gray-700 group"
          >
             {/* Progress Bar Layer */}
             <div className="absolute top-0 left-0 h-full bg-skillfi-neon w-full opacity-20 animate-progress-fill origin-left"></div>
             
             {/* Content Layer */}
             <span className="relative z-10 flex items-center gap-2">
                 <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                 STOP
             </span>
          </button>
        ) : (
          <button 
            onClick={handleSend}
            disabled={(!text.trim() && !attachment)}
            className={`px-6 py-3.5 font-bold tracking-wide transition-all duration-300 rounded-xl shadow-lg ${
              (!text.trim() && !attachment)
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-skillfi-neon text-black hover:bg-white hover:shadow-skillfi-neon/25'
            }`}
          >
             RUN
          </button>
        )}
      </div>
    </div>
  );
};