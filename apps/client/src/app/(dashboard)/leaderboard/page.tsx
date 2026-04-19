"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "../../../lib/api-client";
import { LeaderboardTable, LeaderboardUser } from "./components/LeaderboardTable";
import { useSocket } from "../../../context/SocketContext";

const LeaderboardPage = () => {
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string>("");
    const { sendChallenge } = useSocket();

    useEffect(() => {
        setCurrentUserId(localStorage.getItem('userId') ?? '');

        const fetchLeaderboard = async () => {
            try {
                const response = await apiClient.get("/users/leaderboard");
                setUsers(response.data);
            } catch (error) {
                console.error("Failed to fetch leaderboard:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();

        const interval = setInterval(() => {
            fetchLeaderboard();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-bg-primary font-mono text-accent selection:bg-accent/30 relative overflow-hidden pb-12">
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none fixed"
                style={{ backgroundImage: 'linear-gradient(rgba(var(--accent-rgb),0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            <div className="max-w-4xl mx-auto pt-10 sm:pt-16 px-4 sm:px-6 relative z-20">
                {/* Header */}
                <div className="mb-8 border-b border-accent/20 pb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-accent font-black text-3xl sm:text-4xl tracking-[0.15em] drop-shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]">
                            NEURAL COMBAT RANKINGS
                        </h1>
                        <p className="text-accent/60 text-[10px] sm:text-xs tracking-widest uppercase mt-2">
                            Global Hackers Leaderboard | Top Tier Operators
                        </p>
                    </div>
                    <Link href="/dashboard" className="px-4 py-2 bg-accent/10 border border-accent/40 text-accent text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-accent/30 hover:border-accent hover:text-text-primary transition-all rounded shadow-[0_0_10px_rgba(var(--accent-rgb),0)] hover:shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)] whitespace-nowrap">
                        Back to Command Center
                    </Link>
                </div>

                {/* Table */}
                <LeaderboardTable
                    users={users}
                    isLoading={isLoading}
                    currentUserId={currentUserId}
                    onChallenge={sendChallenge}
                />

                {/* Footer Decor */}
                <div className="mt-8 flex justify-center opacity-30">
                    <div className="flex gap-4 items-center">
                        <div className="h-px w-24 bg-gradient-to-r from-transparent to-accent"></div>
                        <div className="w-2 h-2 border border-accent rotate-45 animate-pulse"></div>
                        <div className="h-px w-24 bg-gradient-to-l from-transparent to-accent"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;
