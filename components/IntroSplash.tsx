import React, { useEffect, useState } from 'react';

interface IntroSplashProps {
  onComplete: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0); // 0: Init, 1: Logo, 2: Loading, 3: Exit

  useEffect(() => {
    // Sequence Timeline
    const timers: NodeJS.Timeout[] = [];

    // Start Progress Bar
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 5;
      });
    }, 100);

    // Stage 1: Reveal
    timers.push(setTimeout(() => setStage(1), 500));
    
    // Stage 2: Loading Text
    timers.push(setTimeout(() => setStage(2), 1500));

    // Stage 3: Exit
    timers.push(setTimeout(() => {
      setStage(3);
      setTimeout(onComplete, 800); // Wait for fade out animation
    }, 3500));

    return () => {
      clearInterval(interval);
      timers.forEach(t => clearTimeout(t));
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center font-sans transition-opacity duration-700 ${stage === 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Glitch Effect Container */}
      <div className="relative mb-8 p-4">
        <h1 className={`text-6xl md:text-8xl font-black tracking-tighter text-white transition-all duration-1000 transform ${stage >= 1 ? 'scale-100 blur-0 opacity-100' : 'scale-90 blur-lg opacity-0'}`}>
          SKILLFI<span className="text-skillfi-neon">.</span>
        </h1>
        {stage >= 1 && (
            <div className="absolute top-0 left-0 w-full h-full text-6xl md:text-8xl font-black tracking-tighter text-skillfi-neon opacity-30 animate-pulse" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 40%, 0 60%)', transform: 'translate(-2px, 2px)' }}>
                SKILLFI.
            </div>
        )}
      </div>

      <div className={`flex flex-col items-center gap-4 transition-all duration-700 ${stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <p className="text-gray-400 text-sm tracking-[0.3em] font-mono uppercase">
             Tactical Career OS
        </p>

        {/* Loading Bar */}
        <div className="w-64 h-1 bg-gray-900 rounded-full overflow-hidden mt-8 relative">
            <div 
                className="h-full bg-skillfi-neon shadow-[0_0_15px_#00ffff]"
                style={{ width: `${progress}%`, transition: 'width 0.1s ease-out' }}
            ></div>
        </div>

        {/* Terminal Output */}
        <div className="h-6 font-mono text-[10px] text-skillfi-neon/70">
            {stage === 2 && progress < 40 && "> INITIALIZING CORE MODULES..."}
            {stage === 2 && progress >= 40 && progress < 80 && "> LOADING USER PROFILES..."}
            {stage === 2 && progress >= 80 && "> ESTABLISHING SECURE LINK..."}
            {stage === 3 && "> SYSTEM READY."}
        </div>
      </div>
    </div>
  );
};