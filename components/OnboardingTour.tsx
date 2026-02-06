
import React, { useState } from 'react';

interface OnboardingTourProps {
  onClose: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Skillfi",
      desc: "Your AI-powered career and financial guidance counselor. This platform is designed to align your passions with market reality.",
      position: "center"
    },
    {
      title: "Strategic Navigation",
      desc: "Use the sidebar (or menu on mobile) to switch between Career Mapping, Financial Tools, and Elite Wisdom modules.",
      position: "left"
    },
    {
      title: "Command Interface",
      desc: "Type or use Voice Mode to interact. Upload CVs, Resumes, or Market Data for deep analysis.",
      position: "bottom"
    },
    {
      title: "Live Synchronization",
      desc: "Use the Refresh icon in the header to pull real-time market data and update your profile stats.",
      position: "top-right"
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-skillfi-neon/30 p-8 rounded-2xl max-w-md w-full relative shadow-2xl dark:shadow-[0_0_50px_rgba(212,175,55,0.2)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute -top-3 -left-3 w-6 h-6 bg-skillfi-neon rounded-full flex items-center justify-center text-white dark:text-black font-bold text-xs border-2 border-white dark:border-black shadow-md">
            {step + 1}
        </div>
        
        <h3 className="text-2xl font-bold font-display text-gray-900 dark:text-white mb-2">{steps[step].title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-8">{steps[step].desc}</p>
        
        <div className="flex justify-between items-center">
            <div className="flex gap-1">
                {steps.map((_, i) => (
                    <div key={i} className={`h-1 rounded-full transition-all ${i === step ? 'w-8 bg-skillfi-neon' : 'w-2 bg-gray-300 dark:bg-gray-800'}`}></div>
                ))}
            </div>
            <div className="flex gap-3">
                <button onClick={onClose} className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white px-3 py-2 uppercase font-bold tracking-wider transition-colors">Skip</button>
                <button 
                    onClick={handleNext}
                    className="bg-skillfi-neon text-white dark:text-black px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-white transition-colors shadow-sm"
                >
                    {step === steps.length - 1 ? 'Finish' : 'Next'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
