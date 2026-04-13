"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Socket } from "socket.io-client";

interface WinnerScreenProps {
  matchResult: {
    winner: { id: string; color: string } | null;
    draw: boolean;
  };
  currentUserId: string | null;
  socket: Socket;
  matchId: string;
}

const WinnerScreen: React.FC<WinnerScreenProps> = ({ matchResult, currentUserId, socket, matchId }) => {
  const router = useRouter();
  const { winner, draw } = matchResult;
  const [username, setUsername] = useState<string>("OPERATOR");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const isWinner = winner?.id === currentUserId;
  const title = draw ? "DRAW" : isWinner ? "VICTORY" : "DEFEATED";
  
  const titleColor = draw 
    ? "text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" 
    : isWinner 
      ? "text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" 
      : "text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]";

  const orbGlow = draw 
    ? "shadow-[0_0_50px_rgba(250,204,21,0.6)] border-yellow-400/50" 
    : isWinner 
      ? "shadow-[0_0_50px_rgba(34,211,238,0.6)] border-cyan-400/50" 
      : "shadow-[0_0_50px_rgba(239,68,68,0.6)] border-red-500/50";

  const handleRematch = () => {
    socket.emit("resetGame", { matchId });
    window.location.reload();
  };

  const handleReturnToLobby = () => {
    router.push("/lobby");
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden animate-in fade-in duration-700">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 z-0">
        {/* Starfield / Particles */}
        <div className="absolute inset-0 opacity-30" 
          style={{ 
            backgroundImage: `radial-gradient(circle at center, white 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }} 
        />
        {/* Scanlines */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]" />
        {/* Moving Grid */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(500px)_rotateX(60deg)] [transform-origin:top]" />
      </div>

      <div className="relative z-20 flex flex-col items-center max-w-2xl w-full px-4">
        {/* Status Text */}
        <div className="mb-2 text-[10px] tracking-[0.5em] text-white/40 uppercase font-black">
          {draw ? "MATCH_TERMINATED" : isWinner ? "NEURAL_DOMINANCE_ACHIEVED" : `OPERATOR_${username}_ELIMINATED`}
        </div>

        {/* Main Title with Effects */}
        <div className="relative mb-12">
          <h1 className={`text-8xl md:text-9xl font-black tracking-tighter ${titleColor} ${!isWinner && !draw ? 'animate-glitch' : 'animate-pulse'}`}>
            {title}
          </h1>
          {/* Duplicate for glitch/glow effect */}
          <h1 className={`absolute inset-0 text-8xl md:text-9xl font-black tracking-tighter opacity-50 blur-sm ${titleColor}`}>
            {title}
          </h1>
        </div>

        {/* Pulsing Orb */}
        {!draw && winner && (
          <div className="relative mb-16">
            {/* Outer Rings */}
            <div className={`absolute inset-0 -m-8 rounded-full border border-dashed animate-[spin_10s_linear_infinite] opacity-20 ${isWinner ? 'border-cyan-400' : 'border-red-500'}`} />
            <div className={`absolute inset-0 -m-4 rounded-full border animate-[spin_15s_linear_infinite_reverse] opacity-40 ${isWinner ? 'border-cyan-400' : 'border-red-500'}`} />
            
            {/* The Orb */}
            <div 
              className={`w-32 h-32 rounded-full border-2 animate-pulse flex items-center justify-center ${orbGlow}`}
              style={{ backgroundColor: `${winner.color}33` }} // 20% opacity
            >
              <div 
                className="w-16 h-16 rounded-full shadow-[inset_0_0_20px_rgba(255,255,255,0.5)]"
                style={{ backgroundColor: winner.color }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-6 w-72">
          <button
            onClick={handleRematch}
            className="group relative px-8 py-4 bg-transparent transition-all overflow-hidden"
          >
            {/* Neon Border */}
            <div className="absolute inset-0 border border-cyan-500/50 group-hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all" />
            <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-all" />
            <span className="relative z-10 text-cyan-400 font-black tracking-[0.3em] text-sm group-hover:text-cyan-300">
              REINIT_SESSION
            </span>
          </button>

          <button
            onClick={handleReturnToLobby}
            className="group relative px-8 py-4 bg-transparent transition-all overflow-hidden"
          >
            <div className="absolute inset-0 border border-white/10 group-hover:border-white/20 transition-all" />
            <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-all" />
            <span className="relative z-10 text-white/40 font-black tracking-[0.3em] text-sm group-hover:text-white/60">
              ABORT_TO_LOBBY
            </span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        .animate-glitch {
          animation: glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite;
        }
      `}</style>
    </div>
  );
};

export default WinnerScreen;
