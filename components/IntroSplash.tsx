
import React, { useEffect, useState, useRef } from 'react';

interface IntroSplashProps {
  onComplete: () => void;
}

const SKILL_SYMBOLS = [
    { icon: '🏗️', x: '15%', y: '-40%', d: '0s', size: 'text-5xl' }, // Builder
    { icon: '💻', x: '80%', y: '-30%', d: '1.5s', size: 'text-4xl' }, // Tech
    { icon: '📈', x: '10%', y: '120%', d: '2.5s', size: 'text-6xl' }, // Finance
    { icon: '⚖️', x: '85%', y: '100%', d: '0.5s', size: 'text-5xl' }, // Law
    { icon: '🎨', x: '5%', y: '40%', d: '3s', size: 'text-4xl' }, // Art
    { icon: '♟️', x: '90%', y: '30%', d: '1s', size: 'text-5xl' }, // Strategy
    { icon: '🧬', x: '45%', y: '-80%', d: '2s', size: 'text-3xl' }, // Science
    { icon: '⚜️', x: '50%', y: '180%', d: '1.2s', size: 'text-4xl' }, // Elite
];

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

        {/* Text & Symbols Layer */}
        <div className="relative z-20 text-center animate-fade-in mt-32 md:mt-48 pointer-events-none select-none w-full max-w-3xl mx-auto px-4">
            
            {/* Submerging/Floating Symbols */}
            {SKILL_SYMBOLS.map((s, i) => (
                <div 
                    key={i}
                    className={`absolute ${s.size} opacity-10 animate-float blur-[1px] text-skillfi-neon`}
                    style={{ 
                        left: s.x, 
                        top: s.y, 
                        animationDelay: s.d,
                        animationDuration: '8s',
                        textShadow: '0 0 20px rgba(212, 175, 55, 0.3)'
                    }}
                >
                    {s.icon}
                </div>
            ))}

            <h1 className="text-5xl md:text-7xl font-bold font-display tracking-[0.1em] text-white drop-shadow-2xl text-shadow-gold relative z-20">
                SKILLFI
            </h1>
            <div className="h-px w-32 bg-skillfi-neon mx-auto my-6 shadow-[0_0_10px_#D4AF37] relative z-20"></div>
            <p className="text-skillfi-neon text-xs md:text-sm font-sans uppercase tracking-[0.2em] font-medium drop-shadow-md bg-black/30 px-6 py-2 rounded-full backdrop-blur-sm inline-block border border-skillfi-neon/20 relative z-20">
                The Career and Financial Guidance Counselor
            </p>
        </div>
    </div>
  );
};
