"use client";

import React from "react";
import { MatchEntry } from "../../types";
import { fmtDate, fmtDuration } from "../../utils";
import { ResultBadge } from "../ui/ResultBadge";
import { ReplayButton } from "./ReplayButton";
import { UserLink } from "../../../../../components/ui/UserLink";

interface Props {
  m: MatchEntry;
  isGuest?: boolean;
}

export function MobileCard({ m, isGuest }: Props) {
  const isWin = m.result === "WIN";
  return (
    <div
      className="p-4 rounded-xl flex flex-col gap-3"
      style={{
        background: "rgba(var(--accent-rgb),0.02)",
        border: "1px solid rgba(var(--accent-rgb),0.08)",
      }}
    >
      <div className="flex items-center justify-between">
        <UserLink
          username={m.opponent}
          className="font-bold text-[13px] text-accent tracking-[0.15em] uppercase hover:text-accent/80 transition-colors"
        />
        <ResultBadge isWin={isWin} />
      </div>

      <div className="flex items-center justify-between text-[10px] text-accent/50 tracking-[0.1em]">
        <span>{m.type}</span>
        <span>{fmtDate(m.date)}</span>
      </div>

      <div className="flex items-center justify-between mt-2 pt-3 border-t border-accent/10">
        <span className="text-[10px] text-accent/40 font-mono tracking-[0.2em]">
          DUR: {fmtDuration(m.duration)}
        </span>
        <ReplayButton matchId={m.id} isGuest={isGuest} />
      </div>
    </div>
  );
}
