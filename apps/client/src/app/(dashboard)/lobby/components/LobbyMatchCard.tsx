import React, { useState } from "react";

export interface LobbyMatch {
  hostId: string;
  hostName: string;
  matchId: string;
  createdAt: number;
}

interface Props {
  match: LobbyMatch;
  index: number;
  onJoin: (matchId: string) => void;
}

export function LobbyMatchCard({ match, index, onJoin }: Props) {
  const [hoveredBtn, setHoveredBtn] = useState(false);

  return (
    <div
      className="bg-black/55 backdrop-blur-md p-5 rounded-lg border border-[#22d3ee]/10 shadow-[0_4px_24px_rgba(0,0,0,0.5)] flex justify-between items-center group transition-all duration-300 hover:border-[#22d3ee]/40 hover:-translate-y-[2px] animate-[fadeIn_0.3s_ease_both]"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div>
        <h3 className="text-[14px] font-black tracking-[0.14em] text-[#22d3ee] transition-all group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
          HOST: {match.hostName}
        </h3>
        <p className="text-[9px] text-[#22d3ee]/40 tracking-[0.18em] uppercase mt-2">
          ID: {match.matchId} <span className="opacity-50 mx-2">|</span> DETECTED: {new Date(match.createdAt).toLocaleTimeString()}
        </p>
      </div>
      
      <button
        onClick={() => onJoin(match.matchId)}
        onMouseEnter={() => setHoveredBtn(true)}
        onMouseLeave={() => setHoveredBtn(false)}
        className={`px-8 py-2.5 rounded-md text-[10px] font-black tracking-[0.18em] font-mono transition-all duration-200 cursor-pointer ${
          hoveredBtn
            ? "bg-[#22d3ee]/20 border-[#22d3ee]/70 text-[#22d3ee] shadow-[0_0_15px_rgba(34,211,238,0.25)]"
            : "bg-[#22d3ee]/5 border-[#22d3ee]/30 text-[#22d3ee]/70"
        }`}
        style={{ borderWidth: "1px" }}
      >
        ⚡ JOIN
      </button>
    </div>
  );
}
