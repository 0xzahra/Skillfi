import React, { useEffect, useState } from 'react';

interface IntroSplashProps {
  onComplete: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'INIT' | 'VORTEX' | 'LOGO' | 'BREAK'>('INIT');
  
  const symbols = ['📈', '💎', '🎨', '🥂', '✈️', '🩺', '💻', '🎓'];

  useEffect(() => {
    // Phase 1: Init (Brief pause)
    setTimeout(() => setPhase('VORTEX'), 500);

    // Phase 2: Vortex to Logo
    setTimeout(() => setPhase('LOGO'), 2500);

    // Phase 3: Glass Break / End
    setTimeout(() => {
        setPhase('BREAK');
        setTimeout(onComplete, 800); // Wait for break anim
    }, 4500);

  }, [onComplete]);

  if (phase === 'BREAK') {
      return (
          <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-glass-break pointer-events-none">
              <h1 className="text-9xl font-black text-white tracking-tighter mix-blend-difference">SKILLFI</h1>
          </div>
      );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center overflow-hidden">
        
        {/* Vortex Container */}
        {phase === 'VORTEX' && (
            <div className="relative w-full h-full flex items-center justify-center">
                {symbols.map((sym, i) => (
                    <div 
                        key={i}
                        className="absolute text-6xl animate-vortex-spin opacity-0"
                        style={{
                            animationDelay: `${i * 0.1}s`,
                            left: '50%',
                            top: '50%',
                            marginLeft: '-30px',
                            marginTop: '-30px',
                            textShadow: '0 0 20px rgba(0,255,255,0.8)'
                        }}
                    >
                        {sym}
                    </div>
                ))}
            </div>
        )}

        {/* Converged Logo */}
        {phase === 'LOGO' && (
            <div className="relative z-10 animate-pulse-fast">
                <div className="absolute -inset-20 bg-skillfi-neon/20 rounded-full blur-[100px]"></div>
                <h1 className="text-8xl md:text-9xl font-black tracking-tighter text-white relative z-10 scale-150 transition-transform duration-500">
                    SKILLFI<span className="text-skillfi-neon">.</span>
                </h1>
                <div className="mt-4 text-center">
                     <div className="inline-block px-4 py-1 border border-skillfi-neon/50 rounded-full bg-skillfi-neon/10 text-skillfi-neon text-xs font-mono tracking-[0.5em] uppercase">
                        Ultra Interface Loaded
                     </div>
                </div>
            </div>
        )}

        <div className="absolute bottom-10 text-[10px] text-gray-600 font-mono tracking-widest uppercase">
            System Initialization // v3.0 Ultra
        </div>
    </div>
  );
};