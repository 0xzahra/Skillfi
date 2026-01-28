import React, { useEffect, useState, useRef } from 'react';
import { LanguageCode, LANGUAGES } from '../types';

interface IntroSplashProps {
  onComplete: (selectedLang: LanguageCode) => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [hide, setHide] = useState(false);
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('en');
  const [hasSelectedLang, setHasSelectedLang] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // High-Society & Legacy Icons
  const tradingIcons = ['📈', '💎', '⚡'];
  const designIcons = ['🎨', '🖋️', '📐'];
  const legacyIcons = ['⚖️', '🩺', '🔬', '🏢'];
  const societyIcons = ['🥂', '🐎', '✈️', '🏎️', '🍷'];

  // Force video play on mount
  useEffect(() => {
    if (videoRef.current) {
        videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
    }
  }, [hasSelectedLang]);

  useEffect(() => {
    if (!hasSelectedLang) return;

    // Progress Bar Simulation
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 2; // Smoother load
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
              setHide(true); // Start fade out
              setTimeout(() => onComplete(selectedLang), 1000); // Complete after transition
          }, 800);
          return 100;
        }
        return next;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [hasSelectedLang, onComplete, selectedLang]);

  const handleLangSelect = (code: LanguageCode) => {
      setSelectedLang(code);
      setHasSelectedLang(true);
  };

  if (!hasSelectedLang) {
      return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in font-sans">
             <div className="text-center mb-8 relative z-10">
                <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
                    Skillfi<span className="text-skillfi-neon">.</span>
                </h1>
                <p className="text-gray-500 text-xs font-mono uppercase tracking-[0.3em]">Select Protocol Language</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto p-4 scrollbar-hide w-full max-w-4xl relative z-10">
                {LANGUAGES.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => handleLangSelect(lang.code)}
                        className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-4 rounded-xl hover:bg-skillfi-neon/10 hover:border-skillfi-neon/50 hover:scale-105 transition-all group text-left w-full"
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
  }

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-1000 ease-in-out bg-black ${hide ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        
        {/* Background Video Layer */}
        <div className="absolute inset-0 z-0">
             <video 
                ref={videoRef}
                autoPlay 
                muted 
                loop 
                playsInline
                className="w-full h-full object-cover opacity-30 filter contrast-125 brightness-50 grayscale"
            >
                <source src="https://videos.pexels.com/video-files/3196360/3196360-uhd_2560_1440_25fps.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/60"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-80"></div>
        </div>

        {/* Center Logo Area */}
        <div className="relative z-20 flex flex-col items-center justify-center animate-fade-in mb-10">
             <div className="relative mb-6">
                <div className="absolute -inset-20 bg-skillfi-neon/10 rounded-full blur-[80px] animate-pulse"></div>
                <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white relative z-10 drop-shadow-2xl">
                    Skillfi<span className="text-skillfi-neon">.</span>
                </h1>
             </div>
             
             <div className="inline-block px-6 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-md">
                <span className="text-xs md:text-sm font-mono text-gray-300 tracking-[0.4em] uppercase font-bold">
                    Career Guidance Counselor
                </span>
             </div>
        </div>

        {/* Kinetic Vortex (Icons) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 overflow-hidden">
             
             {/* Ring 1 - Fast (Trading) */}
             <div className="absolute w-[500px] h-[500px] animate-spin-slow opacity-60">
                {tradingIcons.map((icon, i) => (
                    <div key={`trade-${i}`} className="absolute text-2xl md:text-3xl filter blur-[0.5px]" style={{
                        top: '50%', left: '50%',
                        transform: `rotate(${i * (360/tradingIcons.length)}deg) translate(200px) rotate(-${i * (360/tradingIcons.length)}deg)`
                    }}>{icon}</div>
                ))}
             </div>
             
             {/* Ring 2 - Medium (Design & Legacy) */}
             <div className="absolute w-[700px] h-[700px] animate-spin-reverse-slow opacity-50">
                {[...designIcons, ...legacyIcons].map((icon, i) => (
                    <div key={`mid-${i}`} className="absolute text-xl md:text-2xl filter blur-[0.5px]" style={{
                        top: '50%', left: '50%',
                        transform: `rotate(${i * (360/7)}deg) translate(300px) rotate(-${i * (360/7)}deg)`
                    }}>{icon}</div>
                ))}
             </div>

             {/* Ring 3 - Slow (High Society) */}
             <div className="absolute w-[900px] h-[900px] animate-spin-slow opacity-40">
                {societyIcons.map((icon, i) => (
                    <div key={`soc-${i}`} className="absolute text-2xl md:text-3xl" style={{
                        top: '50%', left: '50%',
                        transform: `rotate(${i * (360/societyIcons.length)}deg) translate(400px) rotate(-${i * (360/societyIcons.length)}deg)`
                    }}>{icon}</div>
                ))}
             </div>
        </div>

        {/* Loading Bar at Bottom */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-md px-8 z-30">
            <div className="w-full h-0.5 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                <div 
                    className="h-full bg-skillfi-neon shadow-[0_0_15px_#00ffff]"
                    style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
                ></div>
            </div>
            <div className="flex justify-between mt-3 font-mono text-[9px] text-gray-500 uppercase tracking-widest">
                <span>System Initialization</span>
                <span>{Math.round(progress)}%</span>
            </div>
        </div>

    </div>
  );
};