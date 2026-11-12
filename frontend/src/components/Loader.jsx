import React, { useState, useEffect } from 'react';

const TIPS = [
  '💡 "Tracking small daily expenses can uncover up to 20% in hidden savings."',
  '📊 "Categorizing expenses makes budget reviews clearer and faster."',
  '🎯 "Aim for the 50/30/20 guideline: 50% Needs, 30% Wants, 20% Savings."',
  '🛡️ "An emergency fund should cover 3 to 6 months of essential costs."',
  '💳 "Paying credit card balances in full avoids unnecessary interest charges."'
];

const STAGES = [
  'Verifying session...',
  'Fetching accounts & balances...',
  'Synchronizing transactions...',
  'Preparing analytical reports...'
];

function Loader({ message, fullScreen = true }) {
  const [tipIndex, setTipIndex] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 3500);

    const stageInterval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % STAGES.length);
    }, 1800);

    return () => {
      clearInterval(tipInterval);
      clearInterval(stageInterval);
    };
  }, []);

  return (
    <div
      className={`${
        fullScreen ? 'fixed inset-0 z-50 bg-[#FFFBF3]/90 backdrop-blur-sm' : 'py-12'
      } flex flex-col items-center justify-center p-4 select-none`}
    >
      <div className="relative flex flex-col items-center max-w-sm w-full text-center">
        {/* Animated Pulsing Orbit + FinGlide Coin Ring */}
        <div className="relative w-28 h-28 flex items-center justify-center mb-5">
          {/* Dashed spinning outer track */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-orange-400/50 animate-[spin_8s_linear_infinite]" />
          
          {/* Glowing pulse ring */}
          <div className="absolute inset-2 rounded-full border-2 border-[#D96D38]/30 animate-ping" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#da6e39] to-amber-300 opacity-20 blur-md animate-pulse" />

          {/* Central FinGlide Coin / Brand Icon */}
          <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#da6e39] to-[#f96c4a] text-white flex items-center justify-center shadow-lg shadow-orange-500/30 transform transition-all duration-300 hover:scale-105">
            <svg
              className="w-8 h-8 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Sparkles */}
          <span className="absolute top-1 right-2 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        </div>

        {/* Dynamic Stage Text */}
        <h3 className="text-base font-semibold text-[#3A3A3A] tracking-wide mb-1">
          {message || STAGES[stageIndex]}
        </h3>

        {/* Animated Shimmer Progress Bar */}
        <div className="w-56 h-1.5 bg-orange-100 rounded-full overflow-hidden mb-4 border border-orange-200/50">
          <div className="h-full bg-gradient-to-r from-[#da6e39] via-amber-400 to-emerald-400 rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" />
        </div>

        {/* Rotating Financial Insight */}
        <div className="h-12 flex items-center justify-center px-2">
          <p className="text-xs text-[#7D5555] italic transition-opacity duration-500">
            {TIPS[tipIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Loader;
