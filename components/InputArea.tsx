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
        // Remove data URL prefix (e.g., "data:image/png;base64,")
        const base64Data = base64String.split(',')[1];
        setAttachment({
          name: file.name,
          type: file.type,
          data: base64Data
        });
      };
      reader.readAsDataURL(file);
    }
    // Reset input
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
            const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' }); // Defaulting generic type container
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const base64Data = base64String.split(',')[1];
                setAttachment({
                    name: "Voice Note",
                    type: "audio/mp3", // MIME type for Gemini
                    data: base64Data
                });
            };
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
        alert("Microphone access denied or unavailable.");
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Attachment Preview Indicator */}
      {attachment && (
        <div className="flex items-center justify-between bg-skillfi-surface p-2 rounded-lg border border-skillfi-neon/30 text-xs">
          <span className="text-skillfi-neon truncate max-w-[200px]">{attachment.name}</span>
          <button 
            onClick={() => setAttachment(null)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* File Upload */}
        <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-400 hover:text-skillfi-neon transition-colors"
            disabled={isLoading}
            title="Upload resume, image, or PDF"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
          </svg>
        </button>
        <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange}
            accept="image/*,application/pdf,audio/*"
        />

        {/* Text Input */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isRecording ? "Listening..." : "Tell me your skills hobbies or upload a resume..."}
          className="flex-1 bg-skillfi-surface border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-skillfi-neon resize-none h-12 max-h-32 py-3"
          disabled={isLoading || isRecording}
          rows={1}
        />

        {/* Mic Button */}
        <button 
          onClick={toggleRecording}
          className={`p-3 rounded-full transition-all duration-300 ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-skillfi-neon'}`}
          disabled={isLoading}
        >
          {isRecording ? (
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
               <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
             </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>

        {/* Send / Stop Button */}
        {isLoading ? (
          <button 
            onClick={onStop}
            className="px-6 py-3 rounded-xl font-bold tracking-wider transition-all duration-300 bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(255,0,0,0.3)] flex items-center justify-center"
            title="Pause/Stop Generation"
          >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
               <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5h13.5m-13.5 9h13.5" /> 
               {/* Using a generic Pause-like icon or a Stop square */}
               <rect x="6" y="6" width="12" height="12" fill="currentColor" rx="1" />
             </svg>
          </button>
        ) : (
          <button 
            onClick={handleSend}
            disabled={(!text.trim() && !attachment)}
            className={`px-4 py-3 rounded-xl font-bold tracking-wider transition-all duration-300 ${
              (!text.trim() && !attachment)
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-skillfi-neon text-black hover:bg-skillfi-accent hover:text-white shadow-[0_0_15px_rgba(0,255,255,0.3)]'
            }`}
          >
             ANALYZE
          </button>
        )}
      </div>
    </div>
  );
};