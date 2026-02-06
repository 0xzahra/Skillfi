
import React, { useState } from 'react';
import { LanguageCode, LANGUAGES } from '../types';

interface LanguageSelectorProps {
  onSelect: (code: LanguageCode) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelect }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black animate-fade-in font-sans">
         {/* Background Layer */}
         <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-br from-gray-900 to-black">
             {/* Only show video if it plays successfully */}
             <div className={`absolute inset-0 transition-opacity duration-1000 ${videoLoaded ? 'opacity-30' : 'opacity-0'}`}>
                 <video 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    onPlaying={() => setVideoLoaded(true)}
                    className="w-full h-full object-cover filter contrast-125 brightness-50 grayscale"
                >
                    <source src="https://videos.pexels.com/video-files/3196360/3196360-uhd_2560_1440_25fps.mp4" type="video/mp4" />
                </video>
             </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60"></div>
        </div>

         <div className="text-center mb-8 relative z-10 p-4">
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
                Skillfi<span className="text-skillfi-neon">.</span>
            </h1>
            <p className="text-gray-500 text-xs font-mono uppercase tracking-[0.3em]">Select your preferred dialect</p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto p-4 scrollbar-hide w-full max-w-4xl relative z-10">
            {LANGUAGES.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => onSelect(lang.code)}
                    className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-4 rounded-xl hover:bg-skillfi-neon/10 hover:border-skillfi-neon/50 hover:scale-105 transition-all group text-left w-full active:scale-95"
                >
                    <span className="text-2xl">{lang.flag}</span>
                    <div>
                        <div className="text-white font-bold text-sm group-hover:text-skillfi-neon">{lang.name}</div>
                        <div className="text-gray-600 text-[10px] uppercase tracking-wider">{lang.code}</div>
                    </div>
                </button>
            ))}
         </div>
    </div>
  );
};
