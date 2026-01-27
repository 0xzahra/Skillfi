import React, { useEffect, useState } from 'react';

interface IntroSplashProps {
  onComplete: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0); // 0: Init, 1: Logo, 2: Loading, 3: Exit

  useEffect(() => {
    // Sequence Timeline
    const timers: any[] = [];

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
      
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video 
            autoPlay 
            loop 
            muted 
            playsInline
            // Using a Pexels stock video representing diverse group interaction/happiness
            src="https://videos.pexels.com/video-files/3196344/3196344-hd_1920_1080_25fps.mp4"
            className="w-full h-full object-cover opacity-50 scale-1