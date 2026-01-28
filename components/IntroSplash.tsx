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
            setTimeout(handleEnd, 5000); // Fallback duration slightly longer for the new video
        });
    } else {
        setTimeout(handleEnd, 5000);
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
                // Use the local asset if available, fallback to empty to force error handling if not found (or use previous as fallback)
                // Assuming user places the file from prompt as 'assets/skillfi_intro.mp4'
            >
                <source src="assets/skillfi_intro.mp4" type="video/mp4" />
                {/* Fallback to Pexels if local not found, though visual style is different */}
                <source src="https://videos.pexels.com/video-files/3252573/3252573-uhd_2560_1440_25fps.mp4" type="video/mp4" />
            </video>
            {/* Light Overlay to ensure text readability if needed, but keeping it minimal to show off the gold video */}
            <div className="absolute inset-0 bg-[#020409]/20"></div>
        </div>

        {/* Text Layer - Positioned to complement the video center */}
        <div className="relative z-20 text-center animate-fade-in mt-32 md:mt-48">
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