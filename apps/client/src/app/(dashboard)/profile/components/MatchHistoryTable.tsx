import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MatchEntry } from "../types";
import { fmtDuration, fmtDate } from "../utils";

function SkeletonRow() {
  return (
    <tr>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <td key={i} className="p-[12px_16px]">
          <div
            className="h-[12px] rounded animate-[shimmer_1.5s_infinite]"
            style={{
              width: i === 1 ? "60%" : "80%",
              background: "linear-gradient(90deg, rgba(34,211,238,0.04) 0%, rgba(34,211,238,0.12) 50%, rgba(34,211,238,0.04) 100%)",
              backgroundSize: "200% 100%",
            }}
          />
        </td>
      ))}
    </tr>
  );
}

interface ReplayButtonProps {
  id: string;
}

function ReplayButton({ id }: ReplayButtonProps) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  
  return (
    <button
      onClick={() => router.push(`/replay/${id}`)}
      className="inline-flex items-center gap-[5px] p-[4px_10px] rounded text-[8px] font-bold tracking-[0.14em] cursor-pointer font-mono whitespace-nowrap transition-all duration-200"
      style={{
        border: `1px solid ${hovered ? "rgba(34,211,238,0.7)" : "rgba(34,211,238,0.3)"}`,
        background: hovered ? "rgba(34,211,238,0.16)" : "rgba(34,211,238,0.06)",
        color: "#22d3ee",
        boxShadow: hovered ? "0 0 8px rgba(34,211,238,0.25)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      ▶ REPLAY
    </button>
  );
}

interface TableRowProps {
  m: MatchEntry;
  isLast: boolean;
}

function MatchRow({ m, isLast }: TableRowProps) {
  const [hovered, setHovered] = useState(false);
  const isWin = m.result === "WIN";

  return (
    <tr
      className="transition-colors duration-200"
      style={{
        borderBottom: isLast ? "none" : "1px solid rgba(34,211,238,0.06)",
        backgroundColor: hovered ? "rgba(34,211,238,0.03)" : "transparent",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <td className="p-[12px_16px] text-[#22d3ee]/45">{fmtDate(m.date)}</td>
      <td className="p-[12px_16px] text-[#22d3ee]/90 font-bold">{m.opponent}</td>
      <td className="p-[12px_16px] text-[#22d3ee]/40">{m.type}</td>
      <td className="p-[12px_16px]">
        <span
          className="inline-block p-[3px_10px] rounded text-[9px] font-bold tracking-[0.16em]"
          style={{
            backgroundColor: isWin ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
            border: isWin ? "1px solid rgba(34,197,94,0.35)" : "1px solid rgba(239,68,68,0.35)",
            color: isWin ? "#4ade80" : "#f87171",
            textShadow: isWin ? "0 0 8px rgba(34,197,94,0.4)" : "0 0 8px rgba(239,68,68,0.4)",
          }}
        >
          {m.result}
        </span>
      </td>
      <td className="p-[12px_16px] text-[#22d3ee]/45">{fmtDuration(m.duration)}</td>
      <td className="p-[12px_16px]">
        <ReplayButton id={m.id} />
      </td>
    </tr>
  );
}

interface Props {
  loading: boolean;
  history: MatchEntry[];
}

export function MatchHistoryTable({ loading, history }: Props) {
  return (
    <div className="rounded-[10px] border border-[#22d3ee]/10 overflow-hidden bg-black/50 backdrop-blur-md">
      <table className="w-full border-collapse text-[10px] tracking-[0.1em]">
        <thead>
          <tr className="border-b border-[#22d3ee]/10 bg-[#22d3ee]/[0.04]">
            {["Date", "Opponent", "Type", "Result", "Duration", "Replay"].map((h) => (
              <th
                key={h}
                className="p-[12px_16px] text-left text-[8px] font-bold tracking-[0.22em] text-[#22d3ee]/35 uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : history.length > 0 ? (
            history.map((m, idx) => (
              <MatchRow key={m.id} m={m} isLast={idx === history.length - 1} />
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="p-[48px_16px] text-center text-[#22d3ee]/20 text-[11px] tracking-[0.18em]"
              >
                NO MATCH RECORDS FOUND. DEPLOY TO BATTLE LOBBY TO BEGIN.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
