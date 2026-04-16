import React, { useState } from "react";
import { Tournament } from "../types";

interface Props {
  tournament: Tournament;
  userId: string | null;
  onStart: () => void;
}

export function TournamentHeader({ tournament, userId, onStart }: Props) {
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  
  const isCreator = userId === tournament.creatorId;
  const statusColor =
    tournament.status === "WAITING"
      ? "#facc15"
      : tournament.status === "IN_PROGRESS"
      ? "#22d3ee"
      : "#22c55e";

  return (
    <div className="border-b border-[#22d3ee]/10 pb-7 mb-8 flex justify-between items-end flex-wrap gap-4">
      <div>
        <p className="text-[9px] tracking-[0.4em] text-[#22d3ee]/25 mb-2 uppercase">
          // TOURNAMENT_BRACKET
        </p>
        <h1 className="m-0 text-[clamp(24px,4vw,40px)] font-black tracking-[0.2em] text-[#22d3ee] drop-shadow-[0_0_12px_rgba(34,211,238,0.8)] shadow-[#22d3ee]/40 leading-tight">
          {tournament.name}
        </h1>
        <div className="flex gap-3 items-center mt-2.5">
          <span
            className="px-3 py-1 rounded text-[9px] font-extrabold tracking-[0.2em]"
            style={{
              backgroundColor: tournament.status === "WAITING" ? "rgba(250,204,21,0.08)" : tournament.status === "IN_PROGRESS" ? "rgba(34,211,238,0.08)" : "rgba(34,197,94,0.08)",
              border: `1px solid ${statusColor}55`,
              color: statusColor,
            }}
          >
            {tournament.status === "IN_PROGRESS" ? "ACTIVE" : tournament.status}
          </span>
          <span className="text-[9px] text-[#22d3ee]/30 tracking-[0.12em]">
            {tournament.participants.length} COMBATANTS
          </span>
        </div>
      </div>

      {isCreator && tournament.status === "WAITING" && (
        <button
          onClick={onStart}
          onMouseEnter={() => setHoveredBtn("start")}
          onMouseLeave={() => setHoveredBtn(null)}
          className={`px-8 py-3 rounded-lg text-[11px] font-black tracking-[0.25em] font-mono cursor-pointer transition-all duration-200 ${
            hoveredBtn === "start"
              ? "bg-[#22c55e]/20 border border-[#22c55e]/70 text-[#22c55e] drop-shadow-[0_0_12px_rgba(34,197,94,0.5)] shadow-[0_0_24px_rgba(34,197,94,0.15)]"
              : "bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e]/70"
          }`}
        >
          ▶ START TOURNAMENT
        </button>
      )}
    </div>
  );
}
