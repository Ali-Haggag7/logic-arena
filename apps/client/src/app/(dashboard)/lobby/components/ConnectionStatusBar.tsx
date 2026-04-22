import React from "react";
import { ConnectionStatus } from "../hooks/useLobbySocket";

interface Props {
  connectionStatus: ConnectionStatus;
  isMobile: boolean;
}

function getDotClass(status: ConnectionStatus): string {
  if (status === "connecting") return "bg-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.8)]";
  if (status === "error") return "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]";
  return "bg-accent shadow-[0_0_8px_var(--accent)]";
}

export function ConnectionStatusBar({ connectionStatus, isMobile }: Props) {
  const dotClass = getDotClass(connectionStatus);

  if (isMobile) {
    return (
      <div className="flex items-center justify-center gap-2 mt-2 text-[9px] tracking-[0.18em] text-accent/70 uppercase font-bold">
        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dotClass}`} />
        {connectionStatus === "error" ? "SCANNER OFFLINE" : "Scanning signals..."}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 mt-3 text-[10px] tracking-[0.18em] text-accent/70 uppercase font-bold">
      <span className={`w-2 h-2 rounded-full animate-pulse ${dotClass}`} />
      {connectionStatus === "error"
        ? "NETWORK_ERROR — BATTLEFIELD SCANNER OFFLINE"
        : "Scanning for active battlefields..."}
    </div>
  );
}
