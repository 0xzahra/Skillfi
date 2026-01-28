import React, { useEffect, useState } from 'react';

interface IntroSplashProps {
  onComplete: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [hide, setHide] = useState(false);
  const [bootLog, setBootLog] = useState<string[]>([]);

  const logs = [
    "INITIALIZING_CORE_KERNEL...",
    "LOADING_MODULES: [CAREER, FINANCE, RELATIONSHIPS]...",
    "CONNECTING_TO_GLOBAL_MARKET_DATA...",
    "ESTABLISHING_SECURE_LINK...",
    "SYNCING_WITH_REALITY_ENGINE...",
    "SKILLFI_OS_V2.5_READY."
  ];

  useEffect(() => {
    // Log Sequence
    let logIndex = 0;
    const logInterval = setInterval(() => {
        if (logIndex < logs.length) {
            setBootLog(prev => [...prev, logs[logIndex]]);
            logIndex++;
        } else {
            clearInterval(logInterval);
        }
    }, 600);

    // Progress Bar Simulation
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 5;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
              setHide(true); // Start fade out
              setTimeout(onComplete, 800); // Complete after transition
          }, 800);
          return 100;
        }
        return next;
      });
    }, 150);

    return () => {
        clearInterval(interval);
        clearInterval(logInterval);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-1000 ease-in-out bg-transparent ${hide ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {/* Content Content - Sits on top of the App's video background */}
        <div className="relative z-20 w-full max-w-2xl px-8 flex flex-col items-center text-center">
            
            {/* Logo Animation */}
            <div className="mb-12 relative group">
                {/* Glow effect behind logo */}
                <div className="absolute -inset-10 bg-skillfi-neon/5 rounded-full blur-3xl group-hover:bg-skillfi-neon/10 transition-all duration-500 animate-pulse"></div>
                
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white relative z-10 flex items-center justify-center gap-2 select-none drop-shadow-2xl">
                    Skillfi<span className="text-skillfi-neon animate-pulse">.</span>
                </h1>
                <div className="text-xs font-mono text-skillfi-neon/90 tracking-[0.4em] text-center mt-3 uppercase select-none font-bold drop-shadow-md">
                    Tactical Guidance System
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-0.5 bg-gray-800/40 rounded-full overflow-hidden mb-8 relative backdrop-blur-sm border border-white/5">
                <div 
                    className="h-full bg-skillfi-neon shadow-[0_0_15px_#00ffff]"
                    style={{ width: `${progress}%`, transition: 'width 0.2s ease-out' }}
                ></div>
            </div>

            {/* Boot Logs */}
            <div className="w-full font-mono text-[10px] md:text-xs text-gray-300 h-32 flex flex-col justify-end items-start space-y-1.5 font-medium drop-shadow-md pl-2 border-l border-skillfi-neon/20 bg-black/20 p-2 rounded-r-lg backdrop-blur-sm">
                {bootLog.map((log, i) => (
                    <div key={i} className="flex items-center gap-2 animate-fade-in">
                        <span className="text-skillfi-neon">➜</span>
                        <span className={i === bootLog.length - 1 ? "text-white font-bold tracking-wide shadow-black drop-shadow-sm" : "opacity-70"}>
                            {log}
                        </span>
                    </div>
                ))}
            </div>
            
            <div className="absolute bottom-[-60px] text-[9px] text-gray-500 font-mono tracking-widest opacity-60 uppercase">
                 Encryption: AES-256 // Protocol: Zero-Trust
            </div>
        </div>
    </div>
  );
};