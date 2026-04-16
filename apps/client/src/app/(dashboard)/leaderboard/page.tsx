"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "../../../lib/api-client";
import { LeaderboardTable, LeaderboardUser } from "./components/LeaderboardTable";

const LeaderboardPage = () => {
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                // Fixed axios call to use apiClient for auth and environment-safe routing
                const response = await apiClient.get("/users/leaderboard");
                setUsers(response.data);
            } catch (error) {
                console.error("Failed to fetch leaderboard:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <div className="min-h-screen bg-gray-950 font-mono text-cyan-300 selection:bg-cyan-500/30 relative overflow-hidden pb-12">
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none fixed"
                style={{ backgroundImage: 'linear-gradient(rgba(8, 145, 178, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(8, 145, 178, 0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            <div className="max-w-4xl mx-auto pt-10 sm:pt-16 px-4 sm:px-6 relative z-20">
                {/* Header */}
                <div className="mb-8 border-b border-cyan-900/60 pb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-cyan-400 font-black text-3xl sm:text-4xl tracking-[0.15em] drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                            NEURAL COMBAT RANKINGS
                        </h1>
                        <p className="text-cyan-600/80 text-[10px] sm:text-xs tracking-widest uppercase mt-2">
                            Global Hackers Leaderboard | Top Tier Operators
                        </p>
                    </div>
                    <Link href="/dashboard" className="px-4 py-2 bg-cyan-600/10 border border-cyan-500/40 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-cyan-600/30 hover:border-cyan-400 hover:text-white transition-all rounded shadow-[0_0_10px_rgba(34,211,238,0)] hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] whitespace-nowrap">
                        Back to Command Center
                    </Link>
                </div>

                {/* Table Container Abstracted */}
                <LeaderboardTable users={users} isLoading={isLoading} />

                {/* Footer Decor */}
                <div className="mt-8 flex justify-center opacity-30">
                    <div className="flex gap-4 items-center">
                        <div className="h-px w-24 bg-gradient-to-r from-transparent to-cyan-500"></div>
                        <div className="w-2 h-2 border border-cyan-500 rotate-45 animate-pulse"></div>
                        <div className="h-px w-24 bg-gradient-to-l from-transparent to-cyan-500"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;
