import React from "react";

interface Props {
  currentFrame: number;
  totalFrames: number;
  isPlaying: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onScrub: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ReplayControls({
  currentFrame,
  totalFrames,
  isPlaying,
  speed,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
  onScrub,
}: Props) {
  return (
    <>
      <style>{`
        @keyframes pulse-cyan { 
          0%,100% { box-shadow: 0 0 0 0 rgba(var(--accent-rgb),0.4); } 
          50% { box-shadow: 0 0 0 6px rgba(var(--accent-rgb),0); } 
        }
        input[type=range] { 
          -webkit-appearance: none; width: 100%; height: 4px;
          background: rgba(var(--accent-rgb),0.1); border-radius: 4px; outline: none; 
        }
        input[type=range]::-webkit-slider-thumb { 
          -webkit-appearance: none; width: 14px; height: 14px;
          border-radius: 50%; background: var(--accent); cursor: pointer;
          box-shadow: 0 0 8px rgba(var(--accent-rgb),0.7); border: 2px solid rgba(0,0,0,0.6); 
        }
      `}</style>
      
      <div className="w-full max-w-[420px] bg-card/60 border border-accent/[0.12] rounded-[10px] p-[20px_22px] backdrop-blur-md flex flex-col gap-[18px]">
        {/* Frame counter + Speed */}
        <div className="flex justify-between items-center">
          <span className="text-[10px] tracking-[0.18em] text-accent/60 font-bold">
            FRAME <span className="text-accent">{currentFrame + 1}</span> / {totalFrames}
          </span>
          <div className="flex gap-1.5">
            {([0.5, 1, 2]).map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`p-[6px_12px] rounded font-mono text-[10px] font-bold tracking-[0.1em] cursor-pointer transition-all duration-200 border ${
                  speed === s
                    ? "text-accent border-accent/60 bg-accent/[0.12]"
                    : "text-accent/50 border-accent/20 bg-card/60 hover:text-accent hover:border-accent/45"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Scrubber */}
        <input
          type="range"
          min={0}
          max={Math.max(0, totalFrames - 1)}
          value={currentFrame}
          onChange={onScrub}
        />

        {/* Play / Pause / Reset */}
        <div className="flex justify-center gap-3">
          {isPlaying ? (
            <button
              onClick={onPause}
              className="inline-flex items-center gap-[6px] p-[10px_22px] rounded-md text-[11px] font-bold tracking-[0.14em] cursor-pointer font-mono transition-all duration-200 bg-accent/[0.22] border border-accent text-accent animate-[pulse-cyan_1.5s_infinite]"
            >
              ⏸ PAUSE
            </button>
          ) : (
            <button
              onClick={onPlay}
              className="inline-flex items-center gap-[6px] p-[10px_22px] rounded-md text-[11px] font-bold tracking-[0.14em] cursor-pointer font-mono transition-all duration-200 bg-accent/[0.08] border border-accent/40 text-accent hover:bg-accent/[0.18] hover:border-accent/70 hover:shadow-[0_0_12px_rgba(var(--accent-rgb),0.3)]"
            >
              ▶ PLAY
            </button>
          )}
          <button
            onClick={onReset}
            className="inline-flex items-center gap-[6px] p-[10px_22px] rounded-md text-[11px] font-bold tracking-[0.14em] cursor-pointer font-mono transition-all duration-200 bg-accent/[0.08] border border-accent/40 text-accent hover:bg-accent/[0.18] hover:border-accent/70 hover:shadow-[0_0_12px_rgba(var(--accent-rgb),0.3)]"
          >
            ⏮ RESET
          </button>
        </div>
      </div>
    </>
  );
}
