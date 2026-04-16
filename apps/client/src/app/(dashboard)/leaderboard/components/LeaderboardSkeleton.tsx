import React from "react";

export const LeaderboardSkeleton = () => {
    return (
        <>
            {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-cyan-900/30 animate-pulse">
                    <td className="px-6 py-4 w-[100px]">
                        <div className="flex items-center gap-2">
                            <div className="h-5 w-8 bg-cyan-900/40 rounded"></div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="h-5 w-32 bg-cyan-900/40 rounded"></div>
                    </td>
                    <td className="px-6 py-4 w-[200px]">
                        <div className="flex items-center gap-2">
                            <div className="h-5 w-8 bg-cyan-900/40 rounded"></div>
                            <div className="h-1 w-20 bg-cyan-900/30 rounded-full hidden sm:block"></div>
                        </div>
                    </td>
                    <td className="px-6 py-4 flex justify-end w-[150px]">
                        <div className="h-5 w-6 bg-green-900/40 rounded"></div>
                    </td>
                </tr>
            ))}
        </>
    );
};
