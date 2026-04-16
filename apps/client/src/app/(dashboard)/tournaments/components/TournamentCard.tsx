import React, { useState } from "react";
import { useRouter } from "next/navigation";

export interface Participant {
  id: string;
  username: string;
}
export interface Creator {
  id: string;
  username: string;
}
export interface Tournament {
  id: string;
  name: string;
  status: string;
  creatorId: string;
  creator: Creator;
  participants: Participant[];
  winnerId: string | null;
  createdAt: string;
}

const STATUS_STYLES: Record<string, { color: string; bg: string; border: string; glow: string }> = {
  WAITING: {
    color: "#facc15",
    bg: "rgba(250,204,21,0.08)",
    border: "rgba(250,204,21,0.35)",
    glow: "0 0 10px rgba(250,204,21,0.25)",
  },
  IN_PROGRESS: {
    color: "#22d3ee",
    bg: "rgba(34,211,238,0.08)",
    border: "rgba(34,211,238,0.35)",
    glow: "0 0 10px rgba(34,211,238,0.25)",
  },
  COMPLETED: {
    color: "#22c55e",
    bg: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.35)",
    glow: "0 0 10px rgba(34,197,94,0.25)",
  },
};

interface Props {
  tournament: Tournament;
  index: number;
  userId: string | null;
  joining: string | null;
  onJoin: (id: string) => void;
}

export function TournamentCard({ tournament: t, index, userId, joining, onJoin }: Props) {
  const router = useRouter();
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  
  const s = STATUS_STYLES[t.status] || STATUS_STYLES.WAITING;
  const isJoined = t.participants.some((p) => p.id === userId);
  const canJoin = t.status === "WAITING" && !isJoined && t.participants.length < 8;

  return (
    <div
      className="bg-black/55 rounded-xl p-6 border border-[#22d3ee]/10 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.5)] flex flex-col gap-4 group transition-all duration-300 hover:-translate-y-[3px] hover:border-[#22d3ee]/40 animate-[fadeIn_0.3s_ease_both]"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="text-[14px] font-black tracking-[0.12em] text-[#22d3ee] mb-1.5 transition-all group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
            {t.name}
          </div>
          <div className="text-[8px] text-[#22d3ee]/25 tracking-[0.15em]">
            BY {t.creator.username.toUpperCase()}
          </div>
        </div>
        {/* Status badge */}
        <span
          className="px-2.5 py-1 rounded text-[8px] font-extrabold tracking-[0.18em] whitespace-nowrap"
          style={{
            backgroundColor: s.bg,
            border: `1px solid ${s.border}`,
            color: s.color,
            boxShadow: s.glow,
          }}
        >
          {t.status === "IN_PROGRESS" ? "ACTIVE" : t.status}
        </span>
      </div>

      {/* Players bar */}
      <div>
        <div className="flex justify-between mb-1.5">
          <span className="text-[8px] text-[#22d3ee]/30 tracking-[0.15em]">COMBATANTS</span>
          <span className="text-[9px] text-[#22d3ee]/50 font-bold">{t.participants.length}/8</span>
        </div>
        <div className="h-[3px] rounded bg-[#22d3ee]/5 overflow-hidden">
          <div
            className="h-full rounded bg-gradient-to-r from-[#22d3ee] to-[#06b6d4] shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all duration-300"
            style={{ width: `${(t.participants.length / 8) * 100}%` }}
          />
        </div>
      </div>

      {/* Participant avatars */}
      <div className="flex gap-1 flex-wrap">
        {t.participants.map((p) => (
          <span
            key={p.id}
            title={p.username}
            className="px-2 py-[2px] rounded-sm bg-[#22d3ee]/5 border border-[#22d3ee]/15 text-[8px] text-[#22d3ee]/50 tracking-[0.1em] font-semibold"
          >
            {p.username}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-2 border-t border-[#22d3ee]/10">
        {canJoin && (
          <button
            onClick={() => onJoin(t.id)}
            disabled={joining === t.id}
            onMouseEnter={() => setHoveredBtn("join")}
            onMouseLeave={() => setHoveredBtn(null)}
            className={`flex-1 px-3.5 py-2 rounded-md text-[9px] font-extrabold tracking-[0.18em] font-mono transition-all duration-200 ${
              joining === t.id ? 'opacity-50 cursor-wait' : 'cursor-pointer'
            } ${
              hoveredBtn === "join" 
              ? "bg-[#facc15]/15 border-[#facc15]/60 text-[#facc15]" 
              : "bg-[#facc15]/5 border-[#facc15]/25 text-[#facc15]/60"
            }`}
            style={{ borderWidth: "1px" }}
          >
            {joining === t.id ? "JOINING..." : "⚡ JOIN"}
          </button>
        )}
        <button
          onClick={() => router.push(`/tournaments/${t.id}`)}
          onMouseEnter={() => setHoveredBtn("view")}
          onMouseLeave={() => setHoveredBtn(null)}
          className={`flex-1 px-3.5 py-2 rounded-md text-[9px] font-extrabold tracking-[0.18em] font-mono cursor-pointer transition-all duration-200 ${
            hoveredBtn === "view"
            ? "bg-[#22d3ee]/15 border-[#22d3ee]/60 text-[#22d3ee]"
            : "bg-[#22d3ee]/5 border-[#22d3ee]/20 text-[#22d3ee]/60"
          }`}
          style={{ borderWidth: "1px" }}
        >
          ◉ VIEW BRACKET
        </button>
      </div>
    </div>
  );
}
