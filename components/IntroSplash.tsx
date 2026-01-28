import React, { useEffect, useState, useRef } from 'react';

interface IntroSplashProps {
  onComplete: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'PLAYING' | 'FADE_OUT' | 'DONE'>('PLAYING');
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    // Attempt to play video, if it fails or ends, move to fade out
    const video = videoRef.current;
    
    const handleEnd = () => {
        setPhase('FADE_OUT');
        setTimeout(() => {
            setPhase('DONE');
            onComplete();
        }, 1000); // 1s Fade out time
    };

    if (video) {
        video.addEventListener('ended', handleEnd);
        video.play().catch(e => {
            console.warn("Autoplay blocked or video missing, using fallback timer", e);
            setTimeout(handleEnd, 4000); // Fallback duration
        });
    } else {
        setTimeout(handleEnd, 4000);
    }

    return () => {
        if (video) video.removeEventListener('ended', handleEnd);
    };
  }, [onComplete]);

  if (phase === 'DONE') return null;

  return (
    <div 
        className={`fixed inset-0 z-[100] bg-[#020409] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-1000 ${phase === 'FADE_OUT' ? 'opacity-0' : 'opacity-100'}`}
    >
        {/* Video Layer */}
        <div className="absolute inset-0 z-10">
            <video 
                ref={videoRef}
                className="w-full h-full object-cover"
                muted
                playsInline
                // Note: In a real environment, place 'intro.mp4' in your public/assets folder.
                // Using a reliable CDN placeholder that matches the Gold/Abstract aesthetic for now.
                src="https://videos.pexels.com/video-files/3252573/3252573-uhd_2560_1440_25fps.mp4" 
            >
                <source src="assets/intro.mp4" type="video/mp4" />
            </video>
            {/* Overlay to tint the video to exact Navy brand color */}
            <div className="absolute inset-0 bg-[#020409]/30 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#020409] via-transparent to-[#020409]"></div>
        </div>

        {/* Text Layer (Synced with video aesthetic) */}
        <div className="relative z-20 text-center animate-fade-in">
             {/* Logo mimicry if video fails to load visually */}
            <div className="mb-6 relative w-24 h-24 mx-auto border-4 border-skillfi-neon rounded-full flex items-center justify-center animate-pulse">
                <span className="text-4xl text-skillfi-neon">⚡</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold font-display tracking-[0.1em] text-white drop-shadow-xl">
                SKILLFI
            </h1>
            <div className="h-px w-32 bg-skillfi-neon mx-auto my-4"></div>
            <p className="text-skillfi-neon text-sm font-sans uppercase tracking-[0.3em] font-medium">
                Legacy . Wealth . Future
            </p>
        </div>
    </div>
  );
};