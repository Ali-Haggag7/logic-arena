import React from "react";

export interface RobotScript {
    id: string;
    title: string;
    content: string;
    version: number;
    createdAt: string;
}

interface ScriptCardProps {
    script: RobotScript;
    onEditBrain: (id: string) => void;
    onDeployToLobby: (id: string) => void;
    onDeployToArena: (id: string) => void;
}

export const ScriptCard = ({ script, onEditBrain, onDeployToLobby, onDeployToArena }: ScriptCardProps) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black/60 backdrop-blur-md p-4 sm:p-5 rounded-lg border border-cyan-900/50 hover:border-cyan-500/50 hover:bg-cyan-950/30 transition-all group shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col gap-1 w-full">
                <h3 className="text-base sm:text-lg font-bold text-cyan-300 tracking-wider group-hover:text-cyan-200 transition-colors break-words">
                    {script.title}
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-4 text-[9px] sm:text-[10px] text-cyan-700 tracking-widest font-bold">
                    <span>V.{script.version}</span>
                    <span className="hidden sm:inline">|</span>
                    <span>INIT: {new Date(script.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto mt-2 md:mt-0">
                <button
                    onClick={() => onEditBrain(script.id)}
                    className="w-full sm:w-auto text-center px-4 py-2.5 sm:py-2 bg-purple-600/10 border border-purple-500/40 text-purple-400 text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-purple-600/30 hover:border-purple-400 hover:text-white transition-all rounded shadow-[0_0_10px_rgba(168,85,247,0)] hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] whitespace-nowrap"
                >
                    Edit Script
                </button>
                <button
                    onClick={() => onDeployToLobby(script.id)}
                    className="w-full sm:w-auto text-center px-4 py-2.5 sm:py-2 bg-blue-600/10 border border-blue-500/40 text-blue-400 text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-blue-600/30 hover:border-blue-400 hover:text-white transition-all rounded shadow-[0_0_10px_rgba(59,130,246,0)] hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] whitespace-nowrap"
                >
                    Deploy to Lobby
                </button>
                <button
                    onClick={() => onDeployToArena(script.id)}
                    className="w-full sm:w-auto text-center px-4 py-2.5 sm:py-2 bg-cyan-600/10 border border-cyan-500/40 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-cyan-600/30 hover:border-cyan-400 hover:text-white transition-all rounded shadow-[0_0_10px_rgba(34,211,238,0)] hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] whitespace-nowrap"
                >
                    Deploy to Arena
                </button>
            </div>
        </div>
    );
};
