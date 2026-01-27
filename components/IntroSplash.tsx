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

  if (hide && progress === 100) {
      // Return null or empty div to allow unmounting/fade logic from parent if needed, 
      // but strictly we handle the fade via the container class below before onComplete is called.
  }

  return (
    <div className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden transition-opacity duration-1000 ease-in-out ${hide ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {/* Background Video Layer */}
        <div className="absolute inset-0 z-0">
             {/* Diverse city crowd / busy market vibe - Pexels ID 3252573 (Crowd walking time lapse) */}
            <video 
                autoPlay 
                muted 
                loop 
                playsInline
                className="w-full h-full object-cover filter grayscale contrast-125 brightness-[0.4]"
            >
                <source src="https://videos.pexels.com/video-files/3252573/3252573-uhd_2560_1440_25fps.mp4" type="video/mp4" />
                {/* Fallback for video load fail */}
                <div className="w-full h-full bg-neutral-900"></div>
            </video>
            
            {/* Tech Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10"></div>
            {/* Scanline effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
            {/* Grain */}
            <div className="absolute inset-0 opacity-20 pointer-events-none z-10 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
        </div>

        {/* Content Content */}
        <div className="relative z-20 w-full max-w-2xl px-8 flex flex-col items-center">
            
            {/* Logo Animation */}
            <div className="mb-12 relative group">
                <div className="absolute -inset-8 bg-skillfi-neon/10 rounded-full blur-2xl group-hover:bg-skillfi-neon/20 transition-all duration-500 animate-pulse"></div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white relative z-10 flex items-center gap-2 select-none">
                    Skillfi<span className="text-skillfi-neon animate-pulse">.</span>
                </h1>
                <div className="text-xs font-mono text-skillfi-neon/80 tracking-[0.4em] text-center mt-3 uppercase select-none">
                    Tactical Guidance System
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-0.5 bg-gray-800/50 rounded-full overflow-hidden mb-8 relative backdrop-blur-sm">
                <div 
                    className="h-full bg-skillfi-neon shadow-[0_0_10px_#00ffff]"
                    style={{ width: `${progress}%`, transition: 'width 0.2s ease-out' }}
                ></div>
            </div>

            {/* Boot Logs */}
            <div className="w-full font-mono text-[10px] md:text-xs text-gray-400 h-32 flex flex-col justify-end items-start space-y-1.5 font-medium">
                {bootLog.map((log, i) => (
                    <div key={i} className="flex items-center gap-2 animate-fade-in">
                        <span className="text-skillfi-neon">➜</span>
                        <span className={i === bootLog.length - 1 ? "text-white font-bold tracking-wide" : "opacity-60"}>
                            {log}
                        </span>
                    </div>
                ))}
            </div>
            
            <div className="absolute bottom-[-80px] text-[9px] text-gray-600 font-mono tracking-widest opacity-40 uppercase">
                 Encryption: AES-256 // Protocol: Zero-Trust
            </div>
        </div>
    </div>
  );
};