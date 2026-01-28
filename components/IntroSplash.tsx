import React, { useEffect, useState, useRef } from 'react';

interface IntroSplashProps {
  onComplete: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [hide, setHide] = useState(false);
  const [bootLog, setBootLog] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const logs = [
    "INITIALIZING_CORE_KERNEL...",
    "LOADING_MODULES: [CAREER, FINANCE, RELATIONSHIPS]...",
    "CONNECTING_TO_GLOBAL_MARKET_DATA...",
    "ESTABLISHING_SECURE_LINK...",
    "SYNCING_WITH_REALITY_ENGINE...",
    "SKILLFI_OS_V2.5_READY."
  ];

  // Force video play on mount
  useEffect(() => {
    if (videoRef.current) {
        videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
    }
  }, []);

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
    }, 400);

    // Progress Bar Simulation
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 5;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
              setHide(true); // Start fade out
              setTimeout(() => onComplete(), 800); // Complete after transition
          }, 800);
          return 100;
        }
        return next;
      });
    }, 80);

    return () => {
        clearInterval(interval);
        clearInterval(logInterval);
    };
  }, [onComplete]);

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
                className="w-full h-full object-cover opacity-50 filter contrast-125 brightness-75"
            >
                <source src="https://videos.pexels.com/video-files/3196360/3196360-uhd_2560_1440_25fps.mp4" type="video/mp4" />
            </video>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_2px,rgba(0,0,0,0.5)_2px)] bg-[size:100%_4px] pointer-events-none opacity-30"></div>
        </div>

        {/* Content */}
        <div className="relative z-20 w-full max-w-2xl px-8 flex flex-col items-center text-center mt-[-50px]">
            
            {/* Logo Animation */}
            <div className="mb-16 relative group">
                <div className="absolute -inset-10 bg-skillfi-neon/20 rounded-full blur-[60px] group-hover:bg-skillfi-neon/30 transition-all duration-500 animate-pulse"></div>
                
                <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white relative z-10 flex items-center justify-center gap-2 select-none drop-shadow-2xl">
                    Skillfi<span className="text-skillfi-neon animate-pulse">.</span>
                </h1>
                <div className="text-sm md:text-base font-mono text-white/90 tracking-[0.6em] text-center mt-4 uppercase select-none font-bold drop-shadow-lg bg-black/40 backdrop-blur-md py-2 px-6 rounded-full border border-white/20">
                    Career Guidance Counselor
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-gray-800/60 rounded-full overflow-hidden mb-8 relative backdrop-blur-md border border-white/10 shadow-2xl">
                <div 
                    className="h-full bg-skillfi-neon shadow-[0_0_20px_#00ffff]"
                    style={{ width: `${progress}%`, transition: 'width 0.2s ease-out' }}
                ></div>
            </div>

            {/* Boot Logs */}
            <div className="w-full font-mono text-[10px] md:text-xs text-gray-300 h-32 flex flex-col justify-end items-start space-y-1.5 font-medium drop-shadow-md pl-4 border-l-2 border-skillfi-neon/50 bg-black/80 p-4 rounded-r-xl backdrop-blur-md shadow-lg border-t border-b border-r border-white/5">
                {bootLog.map((log, i) => (
                    <div key={i} className="flex items-center gap-2 animate-fade-in">
                        <span className="text-skillfi-neon">➜</span>
                        <span className={i === bootLog.length - 1 ? "text-white font-bold tracking-wide shadow-black drop-shadow-sm" : "opacity-70"}>
                            {log}
                        </span>
                    </div>
                ))}
            </div>
            
            <div className="absolute bottom-[-80px] text-[9px] text-gray-400 font-mono tracking-widest opacity-80 uppercase bg-black/60 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/5">
                 Encryption: AES-256 // Protocol: Zero-Trust // v2.5
            </div>
        </div>
    </div>
  );
};