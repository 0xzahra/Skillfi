import React, { useEffect, useState } from 'react';

interface IntroSplashProps {
  onComplete: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'VORTEX' | 'LOGO' | 'EXPLODE' | 'DONE'>('VORTEX');
  
  // Symbols representing Career, Wealth, Skills
  const symbols = ['📈', '💎', '🎨', '🥂', '✈️', '🩺', '💻', '🎓', '🔐', '⚡', '🏗️', '⚖️'];

  useEffect(() => {
    // Phase 1: Vortex Suck In (2s)
    setTimeout(() => setPhase('LOGO'), 2000);

    // Phase 2: Logo Hold (1s) -> Explode
    setTimeout(() => setPhase('EXPLODE'), 3500);

    // Phase 3: Handover control but keep background elements
    setTimeout(() => {
        setPhase('DONE');
        onComplete();
    }, 4500);

  }, [onComplete]);

  // If DONE, we render nothing here (or could render the floating background if we lifted state up)
  // For this architecture, we fade out the blocking layer.
  if (phase === 'DONE') {
      return null;
  }

  return (
    <div className={`fixed inset-0 z-[100] bg-[#121212] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-1000 ${phase === 'EXPLODE' ? 'pointer-events-none' : ''}`}>
        
        {/* Kinetic Vortex & Explosion Container */}
        <div className="absolute inset-0 flex items-center justify-center">
            {symbols.map((sym, i) => {
                const angle = (i / symbols.length) * 360;
                // Randomize flight path for explosion
                const flyX = (Math.random() - 0.5) * 200; // vw unit approximation
                const flyY = (Math.random() - 0.5) * 200; // vh unit approximation
                
                return (
                    <div 
                        key={i}
                        className={`absolute text-4xl md:text-6xl transition-all duration-[1500ms] ease-out
                            ${phase === 'VORTEX' ? 'animate-vortex-in opacity-0' : ''}
                            ${phase === 'LOGO' ? 'scale-0 opacity-0' : ''}
                            ${phase === 'EXPLODE' ? 'opacity-20 animate-float-random' : ''}
                        `}
                        style={{
                            // During VORTEX, animation handles transform.
                            // During EXPLODE, we set final transform
                            transform: phase === 'EXPLODE' 
                                ? `translate(${flyX}vw, ${flyY}vh) scale(1)` 
                                : undefined,
                            animationDelay: phase === 'VORTEX' ? `${i * 0.1}s` : '0s'
                        }}
                    >
                        {sym}
                    </div>
                );
            })}
        </div>

        {/* The Converged Logo */}
        <div className={`relative z-20 flex flex-col items-center justify-center transition-all duration-500 ${phase === 'VORTEX' ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
            <div className={`relative ${phase === 'EXPLODE' ? 'animate-glass-break' : ''}`}>
                <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white relative z-10">
                    SKILLFI<span className="text-skillfi-neon">.</span>
                </h1>
                <div className="absolute -inset-10 bg-skillfi-neon/10 rounded-full blur-[80px]"></div>
            </div>

            {/* Neon Loading Bar - NO TEXT */}
            {phase !== 'EXPLODE' && (
                <div className="mt-8 w-64 h-[2px] bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-skillfi-neon animate-[scanLine_1s_linear_infinite_horizontal] w-full origin-left scale-x-0 transition-transform duration-[2000ms]" style={{ transform: 'scaleX(1)' }}></div>
                </div>
            )}
        </div>
    </div>
  );
};