import React, { useEffect, useState } from 'react';

interface IntroSplashProps {
  onComplete: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'START' | 'EXPLODE' | 'DONE'>('START');
  
  // Expanded symbol set covering many careers
  const symbols = [
      '📈', '💎', '🎨', '🥂', '✈️', '🩺', '🎓', '⚖️', '💻', '🏗️', 
      '🎤', '🚒', '🚀', '🌱', '🍳', '📽️', '⚽', '🔬', '🔧', '📚'
  ];

  useEffect(() => {
    // Phase 1: Logo appears (0s)
    
    // Phase 2: Symbols Explode Out (1s)
    setTimeout(() => setPhase('EXPLODE'), 800);

    // Phase 3: Finish (3.5s)
    setTimeout(() => {
        setPhase('DONE');
        onComplete();
    }, 3500);
  }, [onComplete]);

  if (phase === 'DONE') return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#121212] flex flex-col items-center justify-center overflow-hidden">
        
        {/* Main Logo Container */}
        <div className="relative z-20 flex flex-col items-center justify-center">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white drop-shadow-2xl animate-pulse">
                SKILLFI<span className="text-skillfi-neon">.</span>
            </h1>
            <p className="text-gray-400 mt-4 text-sm md:text-base font-medium animate-fade-in text-center max-w-xs md:max-w-md">
                Fixing career confusion.
            </p>
        </div>

        {/* Symbols Explosion Container */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            {symbols.map((sym, i) => {
                // Calculate random trajectory for explosion
                const angle = (i / symbols.length) * Math.PI * 2;
                // Random distance between 30vw and 50vw
                const dist = 30 + Math.random() * 20; 
                const x = Math.cos(angle) * dist;
                const y = Math.sin(angle) * dist;
                const rotate = Math.random() * 360;
                
                return (
                    <div 
                        key={i}
                        className={`absolute text-4xl transition-all duration-[2000ms] ease-out`}
                        style={{
                            opacity: phase === 'EXPLODE' ? 0.6 : 0,
                            transform: phase === 'EXPLODE' 
                                ? `translate(${x}vw, ${y}vh) rotate(${rotate}deg) scale(1.5)` 
                                : `translate(0, 0) scale(0)`,
                        }}
                    >
                        {sym}
                    </div>
                );
            })}
        </div>
    </div>
  );
};