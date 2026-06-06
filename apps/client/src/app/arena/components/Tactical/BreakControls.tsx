import React from 'react';

interface BreakControlsProps {
  isActive: boolean;
  isReady: boolean;
  opponentReady: boolean;
  onToggleReady: () => void;
  opponentName?: string;
}

export function BreakControls({ isActive, isReady, opponentReady, onToggleReady, opponentName = "OPPONENT" }: BreakControlsProps) {
  if (!isActive) return null;

  return (
    <div className="mt-4 flex flex-col gap-3 p-4 bg-black/50 border border-cyan-900/50 rounded-xl backdrop-blur-md animate-[fadeInUp_0.3s_ease-out]">
      <div className="flex justify-between items-center px-2">
        <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-500/70">
          Tactical Link Established
        </span>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-black tracking-widest uppercase ${opponentReady ? 'text-green-400' : 'text-amber-400 animate-pulse'}`}>
            {opponentReady ? `[✅ ${opponentName} IS READY]` : `[✍️ ${opponentName} IS WRITING...]`}
          </span>
        </div>
      </div>
      
      <button
        type="button"
        onClick={onToggleReady}
        className={`w-full py-4 rounded-lg border text-sm font-black tracking-[0.2em] uppercase transition-all duration-300 ${
          isReady
            ? 'bg-green-950/60 border-green-500/50 text-green-400 shadow-[inset_0_0_20px_rgba(34,197,94,0.2)]'
            : 'bg-cyan-950/60 border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/80 hover:border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)] cursor-pointer'
        }`}
      >
        {isReady ? 'READY FOR COMBAT' : 'MARK AS READY'}
      </button>
    </div>
  );
}
