"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { apiClient } from "../../../../lib/api-client";
import { Tournament } from "./types";
import { TournamentHeader } from "./components/TournamentHeader";
import { BracketSVG } from "./components/BracketSVG";
import { MatchSidebar } from "./components/MatchSidebar";

export default function TournamentBracketPage() {
  const { id } = useParams<{ id: string }>();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [simulating, setSimulating] = useState<string | null>(null);

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, []);

  const fetchTournament = useCallback(async () => {
    try {
      const res = await apiClient.get(`/tournaments/${id}`);
      setTournament(res.data);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTournament();
    const interval = setInterval(fetchTournament, 3000);
    return () => clearInterval(interval);
  }, [fetchTournament]);

  const handleStart = async () => {
    try {
      await apiClient.post(`/tournaments/${id}/start`);
      fetchTournament();
    } catch {
      /* silent */
    }
  };

  const handleSimulateWin = async (matchId: string) => {
    if (!userId) return;
    setSimulating(matchId);
    try {
      await apiClient.post(`/tournaments/${id}/matches/${matchId}/complete`, { winnerId: userId });
      fetchTournament();
    } catch {
      /* silent */
    } finally {
      setSimulating(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center font-mono text-[#22d3ee]/30 text-[11px] tracking-[0.2em] animate-pulse">
        LOADING BRACKET DATA...
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center font-mono text-[#ef4444]/50 text-[11px] tracking-[0.2em]">
        TOURNAMENT NOT FOUND
      </div>
    );
  }

  const myMatch =
    tournament.status === "IN_PROGRESS" && userId
      ? tournament.matches.find(
          (m) =>
            m.status !== "COMPLETED" &&
            (m.player1Id === userId || m.player2Id === userId) &&
            m.player1Id &&
            m.player2Id
        ) || null
      : null;

  const myOpponent =
    myMatch && userId
      ? myMatch.player1Id === userId
        ? myMatch.player2
        : myMatch.player1
      : null;

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-border {
          0%, 100% { border-color: rgba(250,204,21,0.3); }
          50% { border-color: rgba(250,204,21,0.7); }
        }
      `}</style>
      <div className="min-h-screen bg-[#030712] font-mono text-[#22d3ee]/90 relative overflow-hidden">
        {/* Grid bg */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: "linear-gradient(rgba(8,145,178,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(8,145,178,0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="max-w-[1400px] mx-auto px-6 py-10 pb-[100px] relative z-10 animate-[fadeIn_0.35s_ease]">
          
          <TournamentHeader 
            tournament={tournament} 
            userId={userId} 
            onStart={handleStart} 
          />

          {/* MAIN CONTENT: Bracket + Sidebar */}
          <div className="flex gap-6 flex-wrap lg:flex-nowrap">
            {/* BRACKET AREA */}
            <div className="flex-1 min-w-0 lg:min-w-[600px] rounded-2xl bg-black/40 border border-[#22d3ee]/10 p-6 overflow-x-auto">
              <BracketSVG tournament={tournament} userId={userId} />
            </div>

            {/* SIDEBAR */}
            <MatchSidebar 
              tournament={tournament} 
              userId={userId} 
              myMatch={myMatch} 
              myOpponent={myOpponent} 
              simulating={simulating} 
              onSimulateWin={handleSimulateWin} 
            />
          </div>
        </div>
      </div>
    </>
  );
}
