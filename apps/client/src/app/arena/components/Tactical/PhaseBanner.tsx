import React from 'react';

interface PhaseBannerProps {
  phase: string;
  timeRemaining: number;
}

export function PhaseBanner({ phase, timeRemaining }: PhaseBannerProps) {
  const isFighting = phase === 'ROUND_ACTIVE';
  const isBreak = phase === 'BREAK';

  if (!isFighting && !isBreak) return null;

  const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center animate-[fadeInDown_0.3s_ease-out]">
      <div 
        className={`flex items-center gap-3 px-6 py-2 rounded-full border shadow-2xl backdrop-blur-md transition-all duration-500 ${
          isFighting 
            ? 'bg-red-950/80 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)]' 
            : 'bg-cyan-950/80 border-cyan-500/50 shadow-[0_0_30px_rgba(34,211,238,0.2)]'
        }`}
      >
        <span className="text-xl">{isFighting ? '⚔️' : '⏸️'}</span>
        <div className="flex flex-col items-center">
          <span className={`text-[10px] font-black tracking-[0.3em] uppercase ${isFighting ? 'text-red-400' : 'text-cyan-400'}`}>
            {isFighting ? 'COMBAT ROUND' : 'TACTICAL BREAK'}
          </span>
          <span className={`text-2xl font-mono font-black tracking-widest ${isFighting ? 'text-red-100' : 'text-cyan-100'}`}>
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>
    </div>
  );
}
