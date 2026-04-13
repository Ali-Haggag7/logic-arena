"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";

interface LobbyMatch {
    hostId: string;
    hostName: string;
    matchId: string;
    createdAt: number;
}

const LobbyPage = () => {
    const router = useRouter();
    const [matches, setMatches] = useState<LobbyMatch[]>([]);
    const [scriptId, setScriptId] = useState<string | null>(null);

    const socket: Socket = useMemo(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        return io("http://localhost:3001", {
            autoConnect: false,
            auth: { token }
        });
    }, []);

    useEffect(() => {
        const storedScriptId = localStorage.getItem("selectedScriptId");
        if (!storedScriptId) {
            router.push("/dashboard");
            return;
        }
        setScriptId(storedScriptId);

        socket.connect();

        socket.on("connect", () => {
            console.log("Connected to lobby socket");
            socket.emit("getLobby");
        });

        socket.on("lobbyList", (data: LobbyMatch[]) => {
            setMatches(data);
        });

        socket.on("lobbyUpdated", (data: LobbyMatch[]) => {
            setMatches(data);
        });

        socket.on("matchCreated", (data: { matchId: string }) => {
            router.push(`/arena?scriptId=${storedScriptId}&matchId=${data.matchId}`);
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
        }
    };

    const handleJoinMatch = (matchId: string) => {
        if (scriptId) {
            router.push(`/arena?scriptId=${scriptId}&matchId=${matchId}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 font-mono text-cyan-300 selection:bg-cyan-500/30 relative overflow-hidden pb-12">
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none fixed"
                style={{ backgroundImage: 'linear-gradient(rgba(8, 145, 178, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(8, 145, 178, 0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            <div className="max-w-5xl mx-auto pt-10 sm:pt-16 px-4 sm:px-6 relative z-20">
                <div className="mb-8 border-b border-cyan-900/60 pb-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-cyan-400 font-black text-3xl tracking-[0.15em] drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] mb-2">
                            MULTIPLAYER LOBBY
                        </h1>
                        <h2 className="text-cyan-600/80 text-xs tracking-widest uppercase flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
                            Scanning for active battlefields...
                        </h2>
                    </div>
                    <button
                        onClick={handleCreateMatch}
                        className="px-6 py-2 bg-green-600/10 border border-green-500/40 text-green-400 text-xs font-bold uppercase tracking-[0.15em] hover:bg-green-600/30 hover:border-green-400 hover:text-white transition-all rounded shadow-[0_0_10px_rgba(34,197,94,0)] hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                    >
                        [+] Create Match
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {matches.length === 0 ? (
                        <div className="bg-black/40 border border-cyan-900/50 border-dashed rounded-lg p-12 text-center text-cyan-800 text-sm tracking-wider">
                            NO ACTIVE MATCHES FOUND. INITIALIZE A NEW MATCH TO CHALLENGE OTHERS.
                        </div>
                    ) : (
                        matches.map((match) => (
                            <div key={match.matchId} className="flex justify-between items-center bg-black/60 backdrop-blur-md p-5 rounded-lg border border-cyan-900/50 hover:border-cyan-500/50 transition-all group">
                                <div>
                                    <h3 className="text-lg font-bold text-cyan-300 tracking-wider">
                                        HOST: {match.hostName}
                                    </h3>
                                    <p className="text-[10px] text-cyan-700 uppercase tracking-widest mt-1">
                                        MATCH ID: {match.matchId} | CREATED: {new Date(match.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleJoinMatch(match.matchId)}
                                    className="px-8 py-2 bg-cyan-600/10 border border-cyan-500/40 text-cyan-400 text-xs font-bold uppercase tracking-[0.15em] hover:bg-cyan-600/30 hover:border-cyan-400 hover:text-white transition-all rounded shadow-[0_0_10px_rgba(34,211,238,0)] hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                                >
                                    JOIN
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default LobbyPage;
