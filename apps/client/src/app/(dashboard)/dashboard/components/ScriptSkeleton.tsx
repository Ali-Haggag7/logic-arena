import React from "react";

export const ScriptSkeleton = () => {
    return (
        <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black/60 backdrop-blur-md p-4 sm:p-5 rounded-lg border border-cyan-900/30 shadow-[0_4px_15px_rgba(0,0,0,0.5)] animate-pulse">
                    <div className="flex flex-col gap-1 w-full">
                        <div className="h-6 w-1/3 bg-cyan-900/40 rounded"></div>
                        <div className="h-3 w-1/4 bg-cyan-900/30 rounded mt-1"></div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto mt-2 md:mt-0">
                        <div className="w-full sm:w-[110px] h-[34px] bg-purple-900/30 rounded"></div>
                        <div className="w-full sm:w-[140px] h-[34px] bg-blue-900/30 rounded"></div>
                        <div className="w-full sm:w-[140px] h-[34px] bg-cyan-900/30 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};
