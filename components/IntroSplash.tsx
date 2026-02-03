import React, { useEffect, useState, useRef } from 'react';

interface IntroSplashProps {
  onComplete: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'PLAYING' | 'FADE_OUT' | 'DONE'>('PLAYING');
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const handleComplete = () => {
      if (phase === 'FADE_OUT' || phase === 'DONE') return;
      setPhase('FADE_OUT');
      setTimeout(() => {
          setPhase('DONE');
          onComplete();
      }, 800);
  };

  useEffect(() => {
    // Safety timeout: Auto-complete after 12 seconds max (intro shouldn't be longer)
    const safetyTimer = setTimeout(() => {
        handleComplete();
    }, 12000);

    const video = videoRef.current;
    
    if (video) {
        // Try to play immediately
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn("Autoplay prevented or video error:", error);
            });
        }
    }

    return () => {
        clearTimeout(safetyTimer);
    };
  }, []);

  if (phase === 'DONE') return null;

  return (
    <div 
        className={`fixed inset-0 z-[100] bg-[#020409] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-1000 ${phase === 'FADE_OUT' ? 'opacity-0' : 'opacity-100'}`}
        onClick={handleComplete} // Allow click anywhere to skip
    >
        {/* Video Layer */}
        <div className="absolute inset-0 z-10 bg-black">
            <video 
                ref={videoRef}
                className="w-full h-full object-cover opacity-80"
                muted
                playsInline
                autoPlay
                onEnded={handleComplete}
                onError={() => handleComplete()}
            >
                {/* Primary: Local Asset (if user added it) */}
                <source src="assets/skillfi_intro.mp4" type="video/mp4" />
                {/* Fallback: Abstract Golden Particles (Reliable Pexels Link) */}
                <source src="https://videos.pexels.com/video-files/3196360/3196360-uhd_2560_1440_25fps.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-[#020409]/30 via-transparent to-[#020409]/80"></div>
        </div>

        {/* Text Layer */}
        <div className="relative z-20 text-center animate-fade-in mt-32 md:mt-48 pointer-events-none select-none">
            <h1 className="text-5xl md:text-7xl font-bold font-display tracking-[0.1em] text-white drop-shadow-2xl text-shadow-gold">
                SKILLFI
            </h1>
            <div className="h-px w-32 bg-skillfi-neon mx-auto my-6 shadow-[0_0_10px_#D4AF37]"></div>
            <p className="text-skillfi-neon text-sm font-sans uppercase tracking-[0.3em] font-medium drop-shadow-md bg-black/30 px-4 py-1 rounded-full backdrop-blur-sm inline-block border border-skillfi-neon/20">
                Legacy . Wealth . Future
            </p>
        </div>
    </div>
  );
};