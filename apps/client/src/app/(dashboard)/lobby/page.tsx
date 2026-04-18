"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { LobbyMatch, LobbyMatchCard } from "./components/LobbyMatchCard";
import { LobbySkeleton } from "./components/LobbySkeleton";
import { NoScriptModal } from "./components/NoScriptModal";

import { API_BASE_URL } from "../../../lib/api-client";

export default function LobbyPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<LobbyMatch[]>([]);
  const [scriptId, setScriptId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredBtn, setHoveredBtn] = useState(false);
  const [showScriptWarning, setShowScriptWarning] = useState(false);

  const socket: Socket = useMemo(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return io(API_BASE_URL, {
      autoConnect: false,
      auth: { token },
    });
  }, []);

  useEffect(() => {
    const storedScriptId = localStorage.getItem("selectedScriptId");
    if (storedScriptId) {
      setScriptId(storedScriptId);
    }

    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to lobby socket");
      socket.emit("getLobby");
      setTimeout(() => setLoading(false), 500); // Artificial delay to show structure
    });

    socket.on("lobbyList", (data: LobbyMatch[]) => {
      setMatches(data);
      setLoading(false);
    });

    socket.on("lobbyUpdated", (data: LobbyMatch[]) => {
      setMatches(data);
    });

    socket.on("matchCreated", (data: { matchId: string }) => {
      if (storedScriptId) {
        router.push(`/arena?scriptId=${storedScriptId}&matchId=${data.matchId}`);
      }
    });

    return () => {
      socket.off("lobbyList");
      socket.off("lobbyUpdated");
      socket.off("matchCreated");
      socket.disconnect();
    };
  }, [socket, router]);

  const handleCreateMatch = () => {
    if (scriptId) {
      socket.emit("createMatch", { scriptId, hostName: "Player" });
    } else {
      setShowScriptWarning(true);
    }
  };

  const handleJoinMatch = (matchId: string) => {
    if (scriptId) {
      router.push(`/arena?scriptId=${scriptId}&matchId=${matchId}`);
    } else {
      setShowScriptWarning(true);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      <div className="min-h-screen bg-[#030712] font-mono text-[#22d3ee]/90 relative overflow-hidden pb-12">
        {/* Grid Background */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: "linear-gradient(rgba(8,145,178,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(8,145,178,0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="max-w-[1000px] mx-auto px-6 pt-12 pb-[100px] relative z-10 animate-[fadeIn_0.35s_ease]">
          {/* Header */}
          <div className="border-b border-[#22d3ee]/10 pb-7 mb-10 flex justify-between items-end flex-wrap gap-5">
            <div>
              <p className="text-[9px] tracking-[0.4em] text-[#22d3ee]/30 mb-2.5 uppercase">
                // GLOBAL_NETWORK
              </p>
              <h1 className="m-0 text-[clamp(24px,5vw,40px)] font-black tracking-[0.2em] text-[#22d3ee]" style={{ textShadow: "0 0 12px rgba(34,211,238,0.7), 0 0 30px rgba(34,211,238,0.3)" }}>
                MULTIPLAYER LOBBY
              </h1>
              <div className="flex items-center gap-2.5 mt-3 text-[10px] tracking-[0.18em] text-[#22c55e]/70 uppercase font-bold">
                <span className="w-2 h-2 bg-[#22c55e] rounded-full shadow-[0_0_8px_#22c55e] animate-pulse" />
                Scanning for active battlefields...
              </div>
            </div>
            
            <button
              onClick={handleCreateMatch}
              onMouseEnter={() => setHoveredBtn(true)}
              onMouseLeave={() => setHoveredBtn(false)}
              className={`px-7 py-3 rounded-md text-[10px] font-black tracking-[0.25em] font-mono cursor-pointer transition-all duration-200 ${
                hoveredBtn
                  ? "bg-[#22c55e]/20 border border-[#22c55e]/70 text-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                  : "bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e]/70"
              }`}
            >
              [+] DEPLOY MATCH
            </button>
          </div>

          {/* Lobby Content */}
          <div className="flex flex-col gap-4">
            {loading ? (
              <LobbySkeleton />
            ) : matches.length === 0 ? (
              <div className="text-center p-[60px_24px] text-[#22d3ee]/25 text-[11px] tracking-[0.2em] border border-dashed border-[#22d3ee]/10 rounded-xl bg-black/30 backdrop-blur-md">
                NO ACTIVE MATCHES FOUND.<br />
                <span className="text-[9px] text-[#22d3ee]/15 mt-2 block">
                  DEPLOY A NEW MATCH TO CHALLENGE OTHER OPERATORS.
                </span>
              </div>
            ) : (
              matches.map((match, idx) => (
                <LobbyMatchCard 
                  key={match.matchId} 
                  match={match} 
                  index={idx}
                  onJoin={handleJoinMatch} 
                />
              ))
            )}
          </div>
        </div>
      </div>
      
      {showScriptWarning && (
        <NoScriptModal onClose={() => setShowScriptWarning(false)} />
      )}
    </>
  );
}
