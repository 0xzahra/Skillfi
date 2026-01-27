import React, { useEffect, useState } from 'react';

interface IntroSplashProps {
  onComplete: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0); // 0: Init, 1: Logo, 2: Loading, 3: Exit
  const [bootLog, setBootLog] = useState<string[]>([]);

  const logs = [
    "INITIALIZING_KERNEL...",
    "LOADING_MODULES: [CAREER, FINANCE, RELATIONSHIPS]...",
    "CONNECTING_TO_GLOBAL_MARKET_DATA...",
    "ANALYZING_USER_PATTERN...",
    "SYNCING_WITH_REALITY_ENGINE...",
    "SKILLFI_OS_READY."
  ];

  useEffect(() => {
    // Log Sequence
    logs.forEach((log, index) => {
        setTimeout(() => {
            setBootLog(prev => [...prev, log]);
        }, index * 400 + 200);
    });

    // Progress Bar Simulation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        //