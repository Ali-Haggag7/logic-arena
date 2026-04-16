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
          0%,100% { box-shadow: 0 0 0 0 rgba(34,211,238,0.4); } 
          50% { box-shadow: 0 0 0 6px rgba(34,211,238,0); } 
        }
        input[type=range] { 
          -webkit-appearance: none; width: 100%; height: 4px;
          background: rgba(34,211,238,0.1); border-radius: 4px; outline: none; 
        }
        input[type=range]::-webkit-slider-thumb { 
          -webkit-appearance: none; width: 14px; height: 14px;
          border-radius: 50%; background: #22d3ee; cursor: pointer;
          box-shadow: 0 0 8px rgba(34,211,238,0.7); border: 2px solid rgba(0,0,0,0.6); 
        }
      `}</style>
      
      <div className="w-full max-w-[420px] bg-black/60 border border-[#22d3ee]/[0.12] rounded-[10px] p-[20px_22px] backdrop-blur-md flex flex-col gap-[18px]">
        {/* Frame counter + Speed */}
        <div className="flex justify-between items-center">
          <span className="text-[10px] tracking-[0.18em] text-[#22d3ee]/60 font-bold">
            FRAME <span className="text-[#22d3ee]">{currentFrame + 1}</span> / {totalFrames}
          </span>
          <div className="flex gap-1.5">
            {([0.5, 1, 2]).map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`p-[6px_12px] rounded font-mono text-[10px] font-bold tracking-[0.1em] cursor-pointer transition-all duration-200 border ${
                  speed === s
                    ? "text-[#22d3ee] border-[#22d3ee]/60 bg-[#22d3ee]/[0.12]"
                    : "text-[#22d3ee]/50 border-[#22d3ee]/20 bg-black/40 hover:text-[#22d3ee] hover:border-[#22d3ee]/45"
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
              className="inline-flex items-center gap-[6px] p-[10px_22px] rounded-md text-[11px] font-bold tracking-[0.14em] cursor-pointer font-mono transition-all duration-200 bg-[#22d3ee]/[0.22] border border-[#22d3ee] text-[#22d3ee] animate-[pulse-cyan_1.5s_infinite]"
            >
              ⏸ PAUSE
            </button>
          ) : (
            <button
              onClick={onPlay}
              className="inline-flex items-center gap-[6px] p-[10px_22px] rounded-md text-[11px] font-bold tracking-[0.14em] cursor-pointer font-mono transition-all duration-200 bg-[#22d3ee]/[0.08] border border-[#22d3ee]/40 text-[#22d3ee] hover:bg-[#22d3ee]/[0.18] hover:border-[#22d3ee]/70 hover:shadow-[0_0_12px_rgba(34,211,238,0.3)]"
            >
              ▶ PLAY
            </button>
          )}
          <button
            onClick={onReset}
            className="inline-flex items-center gap-[6px] p-[10px_22px] rounded-md text-[11px] font-bold tracking-[0.14em] cursor-pointer font-mono transition-all duration-200 bg-[#22d3ee]/[0.08] border border-[#22d3ee]/40 text-[#22d3ee] hover:bg-[#22d3ee]/[0.18] hover:border-[#22d3ee]/70 hover:shadow-[0_0_12px_rgba(34,211,238,0.3)]"
          >
            ⏮ RESET
          </button>
        </div>
      </div>
    </>
  );
}
