import React, { useState } from "react";
import { Tournament, TMatch, Player } from "../types";

const ROUND_LABELS: Record<number, Record<number, string>> = {
  3: { 1: "QUARTER FINALS", 2: "SEMI FINALS", 3: "GRAND FINAL" },
  2: { 1: "SEMI FINALS", 2: "GRAND FINAL" },
};

interface Props {
  tournament: Tournament;
  userId: string | null;
  myMatch: TMatch | null;
  myOpponent: Player | null;
  simulating: string | null;
  onSimulateWin: (matchId: string) => void;
}

export function MatchSidebar({ tournament, userId, myMatch, myOpponent, simulating, onSimulateWin }: Props) {
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  const totalRounds = tournament.participants.length === 8 || tournament.matches.some((m) => m.round === 3) ? 3 : 2;
  const roundLabels = ROUND_LABELS[totalRounds] || ROUND_LABELS[2];

  return (
    <div className="w-[280px] shrink-0">
      {myMatch && myOpponent && (
        <div className="mb-5 p-5 rounded-xl bg-[#facc15]/5 border border-[#facc15]/25 animate-[pulse-border_2s_infinite]">
          <div className="text-[8px] font-extrabold tracking-[0.3em] text-[#facc15]/50 mb-3 uppercase">
            ⚡ YOUR MATCH
          </div>
          <div className="text-[12px] font-bold text-[#facc15]/80 tracking-[0.1em] mb-1">
            VS {myOpponent.username.toUpperCase()}
          </div>
          <div className="text-[8px] text-[#facc15]/30 tracking-[0.15em] mb-3.5">
            ROUND {roundLabels[myMatch.round] || `#${myMatch.round}`}
          </div>
          <button
            onClick={() => onSimulateWin(myMatch.id)}
            disabled={simulating === myMatch.id}
            onMouseEnter={() => setHoveredBtn("sim")}
            onMouseLeave={() => setHoveredBtn(null)}
            className={`w-full py-2.5 px-4 rounded-md text-[9px] font-black tracking-[0.2em] font-mono transition-all duration-200 ${
              simulating === myMatch.id ? 'cursor-wait' : 'cursor-pointer'
            } ${
              hoveredBtn === "sim"
                ? "bg-[#22c55e]/20 border-[#22c55e]/70 text-[#22c55e]"
                : "bg-[#22c55e]/10 border-[#22c55e]/30 text-[#22c55e]/70"
            }`}
            style={{ borderWidth: "1px" }}
          >
            {simulating === myMatch.id ? "SIMULATING..." : "▶ SIMULATE WIN"}
          </button>
        </div>
      )}

      {/* Participants list */}
      <div className="p-5 rounded-xl bg-black/50 border border-[#22d3ee]/10 backdrop-blur-sm">
        <div className="text-[8px] font-extrabold tracking-[0.3em] text-[#22d3ee]/30 mb-4 uppercase pb-2.5 border-b border-[#22d3ee]/5">
          COMBATANTS ({tournament.participants.length})
        </div>
        <div className="flex flex-col gap-1.5">
          {tournament.participants.map((p) => {
            const isEliminated =
              tournament.status !== "WAITING" &&
              tournament.matches.some(
                (m) =>
                  m.status === "COMPLETED" &&
                  (m.player1Id === p.id || m.player2Id === p.id) &&
                  m.winnerId !== p.id
              );
            const isChampion = tournament.winnerId === p.id;

            return (
              <div
                key={p.id}
                className={`flex items-center gap-2 p-[8px_10px] rounded-md transition-all duration-200 ${
                  isChampion ? "bg-[#22c55e]/10 border border-[#22c55e]/30" : "bg-[#22d3ee]/5 border border-[#22d3ee]/5"
                } ${isEliminated ? "opacity-40" : "opacity-100"}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    isChampion ? "bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.5)]" : isEliminated ? "bg-[#ef4444]/40" : "bg-[#22d3ee]/30"
                  }`}
                />
                <span
                  className={`text-[10px] font-bold tracking-[0.1em] flex-1 ${
                    isChampion ? "text-[#22c55e]" : isEliminated ? "text-[#22d3ee]/30 line-through" : "text-[#22d3ee]/60"
                  }`}
                >
                  {p.username}
                </span>
                {isChampion && <span className="text-[12px]">🏆</span>}
                {isEliminated && !isChampion && (
                  <span className="text-[7px] text-[#ef4444]/40 tracking-[0.15em] font-bold">
                    OUT
                  </span>
                )}
                {p.id === userId && !isChampion && !isEliminated && (
                  <span className="text-[7px] text-[#facc15]/50 tracking-[0.15em] font-bold">
                    YOU
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
