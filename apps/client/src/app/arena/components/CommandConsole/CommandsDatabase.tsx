import React from "react";

const COMMAND_DOCS: Record<string, string[]> = {
    Movement: ["MOVE", "STOP", "MOVE_FAST", "BACKUP", "PATHFIND"],
    Attack: ["FIRE", "BURST_FIRE", "IF spotted THEN FIRE", "IF distance < 500 THEN FIRE"],
    "Advanced Combat": ["IF health < 20 THEN STOP"],
    Tactics: ["IF spotted THEN MOVE"],
    "Evasion": ["IF health < 30 THEN MOVE", "IF distance < 200 THEN MOVE"],
    Intelligence: ["SET rotation = rotation + 0.1", "IF NOT spotted THEN SET rotation = rotation + 0.1"]
};

export const CommandsDatabase: React.FC<{ isOpen: boolean; onSelect: (cmd: string) => void }> = ({ isOpen, onSelect }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute top-0 mb-3 left-1/2 -translate-x-1/2 w-[370px] max-h-[250px] overflow-y-auto border border-cyan-800/50 bg-gray-950/95 backdrop-blur-xl p-4 rounded-lg shadow-[0_-10px_40px_rgba(8,145,178,0.2)] custom-scrollbar z-40">
            {Object.entries(COMMAND_DOCS).map(([category, commands]) => (
                <div key={category} className="mb-4 last:mb-0">
                    <p className="text-cyan-600 uppercase tracking-widest text-[9px] mb-2 font-bold">{category}</p>
                    <div className="grid grid-cols-1 gap-1.5">
                        {commands.map((command) => (
                            <button
                                key={command}
                                type="button"
                                onClick={() => onSelect(command)}
                                className="text-left rounded border border-cyan-900/40 bg-cyan-950/20 px-3 py-1.5 hover:bg-cyan-800/40 hover:border-cyan-500/50 hover:text-cyan-100 text-cyan-400 text-xs transition-all"
                            >
                                {command}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};