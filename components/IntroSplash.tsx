import React, { useEffect, useState } from 'react';

interface IntroSplashProps {
  onComplete: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'VORTEX' | 'LOGO' | 'EXPLODE' | 'DONE'>('VORTEX');
  
  // Specific symbols requested: 📈, 💎, 🎨, 🥂, ✈️, 🩺, 🎓
  const symbols = ['📈', '💎', '🎨', '🥂', '✈️', '🩺', '🎓', '📈', '💎', '🎨', '🥂', '✈️', '🩺', '🎓'];

  useEffect(() => {
    // Phase 1: Vortex Suck In (High Velocity - 1.5s)
    setTimeout(() => setPhase('LOGO'), 1500);

    // Phase 2: Logo Hold (0.8s) -> Explode
    setTimeout(() => setPhase('EXPLODE'), 2300);

    // Phase 3: Handover
    setTimeout(() => {
        setPhase('DONE');
        onComplete();
    }, 3300);
  }, [onComplete]);

  if (phase === 'DONE') return null;

  return (
    <div className={`fixed inset-0 z-[100] bg-[#121212] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-1000 ${phase === 'EXPLODE' ? 'pointer-events-none' : ''}`}>
        
        {/* Kinetic Vortex & Explosion Container */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {symbols.map((sym, i) => {
                // Calculation for explosion trajectories
                const angle = (i / symbols.length) * Math.PI * 2;
                const dist = 100; // view units
                const flyX = Math.cos(angle) * dist;
                const flyY = Math.sin(angle) * dist;
                
                return (
                    <div 
                        key={i}
                        className={`absolute text-4xl md:text-6xl transition-all ease-in-out
                            ${phase === 'VORTEX' ? 'animate-vortex-in opacity-0' : ''}
                            ${phase === 'LOGO' ? 'scale-0 opacity-0 duration-300' : ''}
                            ${phase === 'EXPLODE' ? 'opacity-20 duration-[1000ms]' : ''}
                        `}
                        style={{
                            transform: phase === 'EXPLODE' ? `translate(${flyX}vw, ${flyY}vh) scale(0.5) rotate(${Math.random()*360}deg)` : undefined,
                            animationDelay: phase === 'VORTEX' ? `${i * 0.05}s` : '0s'
                        }}
                    >
                        {sym}
                    </div>
                );
            })}
        </div>

        {/* The Converged Logo */}
        <div className={`relative z-20 flex flex-col items-center justify-center transition-all duration-300 ${phase === 'VORTEX' ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
            <div className={`relative ${phase === 'EXPLODE' ? 'animate-glass-break' : ''}`}>
                <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white relative z-10 drop-shadow-2xl">
                    SKILLFI<span className="text-skillfi-neon">.</span>
                </h1>
                {/* Glow behind logo */}
                <div className="absolute -inset-10 bg-skillfi-neon/5 rounded-full blur-[100px]"></div>
            </div>

            {/* Sleek Neon Loading Bar - NO TEXT */}
            {phase !== 'EXPLODE' && (
                <div className="absolute -bottom-16 w-32 h-[2px] bg-gray-900 rounded-full overflow-hidden">
                    <div className="h-full bg-skillfi-neon w-full origin-left animate-[scanLine_0.8s_ease-in-out_infinite] shadow-[0_0_10px_#00ffff]"></div>
                </div>
            )}
        </div>
    </div>
  );
};