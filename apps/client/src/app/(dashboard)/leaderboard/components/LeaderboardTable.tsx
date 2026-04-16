import React from "react";
import { LeaderboardSkeleton } from "./LeaderboardSkeleton";

export interface LeaderboardUser {
    id: string;
    username: string;
    rank: number;
    _count: {
        wonMatches: number;
    };
}

const getRankColor = (index: number) => {
    if (index === 0) return "#FFD700"; // Gold
    if (index === 1) return "#C0C0C0"; // Silver
    if (index === 2) return "#CD7F32"; // Bronze
    return "#22d3ee"; // Cyan
};

export const LeaderboardTable = ({ users, isLoading }: { users: LeaderboardUser[], isLoading: boolean }) => {
    return (
        <div className="bg-black/60 backdrop-blur-xl border border-cyan-900/60 rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-cyan-900/60 bg-cyan-950/20">
                            <th className="px-6 py-4 text-cyan-500 uppercase tracking-widest text-[10px] sm:text-xs font-bold">Rank</th>
                            <th className="px-6 py-4 text-cyan-500 uppercase tracking-widest text-[10px] sm:text-xs font-bold">Operator</th>
                            <th className="px-6 py-4 text-cyan-500 uppercase tracking-widest text-[10px] sm:text-xs font-bold">Rank Points</th>
                            <th className="px-6 py-4 text-cyan-500 uppercase tracking-widest text-[10px] sm:text-xs font-bold text-right">Victories</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <LeaderboardSkeleton />
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-cyan-700 tracking-widest uppercase text-xs">
                                    No combat data available in neural archives.
                                </td>
                            </tr>
                        ) : (
                            users.map((user, index) => (
                                <tr key={user.id} className="border-b border-cyan-900/30 hover:bg-cyan-950/20 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-lg" style={{ color: getRankColor(index) }}>
                                                #{index + 1}
                                            </span>
                                            {index === 0 && <span className="text-xl">👑</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-cyan-100 font-bold tracking-wider group-hover:text-white transition-colors">
                                            {user.username}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-cyan-400 font-bold">{user.rank}</span>
                                            <div className="h-1 w-20 bg-cyan-900/30 rounded-full overflow-hidden hidden sm:block">
                                                <div 
                                                    className="h-full bg-cyan-500 shadow-[0_0_8px_#22d3ee]" 
                                                    style={{ width: `${Math.min((user.rank / 1000) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-green-400 font-bold drop-shadow-[0_0_5px_rgba(74,222,128,0.3)]">
                                            {user._count.wonMatches}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
