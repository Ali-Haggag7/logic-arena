import React, { memo, useState, useRef, useEffect } from "react";
import { Socket } from "socket.io-client";

interface CommandConsoleProps {
    socket: Socket | null;
    robotId: string;
    availableRobots: string[];
    onRobotChange: (id: string) => void;
}

const COMMAND_DOCS: Record<string, string[]> = {
    Movement: ["MOVE", "STOP", "MOVE_FAST", "BACKUP", "PATHFIND"],
    Attack: ["FIRE", "BURST_FIRE", "IF spotted THEN FIRE", "IF distance < 500 THEN FIRE"],
    "Advanced Combat": ["IF health < 20 THEN STOP"],
    Tactics: ["IF spotted THEN MOVE"],
    "Evasion": ["IF health < 30 THEN MOVE", "IF distance < 200 THEN MOVE"],
    Intelligence: ["SET rotation = rotation + 0.1", "IF NOT spotted THEN SET rotation = rotation + 0.1"]
};

const REFERENCE_ITEMS = ["health", "distance", "spotted", "rotation", "target_vx", "target_vy", "bullet_speed"];

const CommandConsoleComponent: React.FC<CommandConsoleProps> = ({ socket, robotId, availableRobots, onRobotChange }) => {
    const [commandInput, setCommandInput] = useState<string>("");
    const [output, setOutput] = useState<string[]>([]);
    const outputRef = useRef<HTMLDivElement>(null);
    const [scriptInput, setScriptInput] = useState<string>("");
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [isReferenceOpen, setIsReferenceOpen] = useState(false);
    const [activePrebuilt, setActivePrebuilt] = useState<string | null>(null);

    const appendOutputLine = (line: string) => {
        setOutput((prev) => {
            const next = [...prev, line];
            return next.slice(-60);
        });
    };

    const appendScriptLine = (line: string) => {
        setScriptInput((prev) => {
            const sanitizedPrev = prev.trim();
            return sanitizedPrev ? `${sanitizedPrev}\n${line}` : `${line}\n`;
        });
        setActivePrebuilt(null);
    };

    const prebuiltScripts = {
        "Safe Mode": "IF health < 50 THEN MOVE",
        "Aggressive": "IF distance < 200 THEN FIRE",
        "Sniper": "IF distance < 1200 THEN FIRE",
    };

    const handleCommandSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const command = commandInput.trim().toUpperCase();
        if (command === "") return;

        appendOutputLine(`> ${commandInput}`);

        if (socket) {
            if (command === "FIRE") {
                socket.emit("manualCommand", { robotId, targetX: 600, targetY: 400 });
                appendOutputLine(`[SYS] Command Broadcast: ${command}`);
            } else {
                appendOutputLine(`[ERR] Unknown sequence: ${command}`);
            }
        } else {
            appendOutputLine("[ERR] Uplink severed. Socket offline.");
        }
        setCommandInput("");
    };

    const handleDeployBrain = (scriptToDeploy: string = scriptInput) => {
        if (socket) {
            socket.emit("updateLogic", { robotId, script: scriptToDeploy });
            appendOutputLine(`[UPLINK] Neural payload injected into ${robotId}...`);
        } else {
            appendOutputLine("[ERR] Uplink severed. Socket offline.");
        }
    };

    useEffect(() => {
        if (!socket) return;
        const handleLogicExecuted = (data: { robotId: string; action: string }) => {
            if (data.robotId === robotId) {
                appendOutputLine(`[${data.robotId}] Logic Triggered: ${data.action}`);
            }
        };
        socket.on("logicExecuted", handleLogicExecuted);
        return () => { socket.off("logicExecuted", handleLogicExecuted); };
    }, [socket, robotId]);

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output]);

    return (
        // Replaced absolute positioning with w-full and flex-col to fill parent container
        <div className="flex flex-col w-full h-full bg-black/60 backdrop-blur-xl border border-cyan-900/60 rounded-xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.8)] relative z-20">

            {/* TABS - Tactical Styling */}
            <div className="flex gap-2 mb-4 border-b border-cyan-900/60 pb-3">
                {availableRobots.map(id => (
                    <button
                        type="button"
                        key={id}
                        onClick={() => onRobotChange(id)}
                        className={`px-4 py-1.5 text-xs font-bold tracking-widest transition-all clip-edges ${robotId === id
                            ? "bg-cyan-500/20 text-cyan-300 border-b-2 border-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                            : "bg-transparent text-cyan-800 hover:text-cyan-500 hover:bg-cyan-950/30"
                            }`}
                    >
                        {id.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* TERMINAL OUTPUT */}
            <div className="flex-1 overflow-y-auto pr-2 mb-4 custom-scrollbar text-[11px] leading-relaxed" ref={outputRef}>
                {output.length === 0 && <p className="text-cyan-800 italic">Awaiting telemetry data...</p>}
                {output.map((line, index) => {
                    let colorClass = "text-cyan-600";
                    if (line.includes("[SYS]") || line.includes("[UPLINK]")) colorClass = "text-purple-400";
                    if (line.includes("Logic Triggered")) colorClass = "text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.4)]";
                    if (line.includes("[ERR]")) colorClass = "text-red-400";

                    return (
                        <p key={index} className={`${colorClass} break-words font-medium`}>
                            {line}
                        </p>
                    );
                })}
            </div>

            {/* LIVE COMMAND LINE */}
            <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 mb-4 bg-black/40 border border-cyan-900/50 rounded p-2 focus-within:border-cyan-500/50 transition-colors">
                <span className="text-cyan-500 font-bold ml-1">{'>'}</span>
                <input
                    placeholder="Execute override (e.g. FIRE)"
                    type="text"
                    className="flex-grow bg-transparent outline-none text-cyan-300 text-xs placeholder-cyan-900"
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                />
            </form>

            {/* SCRIPT EDITOR */}
            <div className="relative flex flex-col gap-3">
                <div className="relative">
                    <textarea
                        className="w-full h-28 bg-black/50 border border-purple-900/40 rounded-lg p-3 text-purple-300 font-mono text-xs outline-none focus:border-purple-500/60 focus:bg-purple-950/10 transition-all custom-scrollbar resize-none shadow-inner"
                        placeholder="Initialize neural script (e.g. IF spotted THEN FIRE)"
                        value={scriptInput}
                        onChange={(e) => {
                            setScriptInput(e.target.value);
                            setActivePrebuilt(null);
                        }}
                    />
                    <div className="absolute top-2 right-3 text-[9px] text-purple-500/50 tracking-widest pointer-events-none">ALISCRIPT_V1</div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-3 relative">
                    <button
                        type="button"
                        onClick={() => handleDeployBrain()}
                        className="flex-1 py-2.5 bg-purple-600/20 border border-purple-500/50 text-purple-300 font-bold text-xs hover:bg-purple-600/40 hover:text-white transition-all rounded uppercase tracking-[0.1em] shadow-[0_0_15px_rgba(168,85,247,0.25)]"
                    >
                        Deploy Brain
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsLibraryOpen((prev) => !prev)}
                        className="flex-1 py-2.5 bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 font-bold text-xs hover:bg-cyan-800/50 transition-all rounded uppercase tracking-[0.1em]"
                    >
                        Database
                    </button>
                </div>

                {/* SLIDE-UP DATABASE */}
                {isLibraryOpen && (
                    <div className="absolute bottom-full mb-3 left-0 w-full max-h-[250px] overflow-y-auto border border-cyan-800/50 bg-gray-950/95 backdrop-blur-xl p-4 rounded-lg shadow-[0_-10px_40px_rgba(8,145,178,0.2)] custom-scrollbar z-40">
                        {Object.entries(COMMAND_DOCS).map(([category, commands]) => (
                            <div key={category} className="mb-4 last:mb-0">
                                <p className="text-cyan-600 uppercase tracking-widest text-[9px] mb-2 font-bold">{category}</p>
                                <div className="grid grid-cols-1 gap-1.5">
                                    {commands.map((command) => (
                                        <button
                                            key={command}
                                            type="button"
                                            onClick={() => appendScriptLine(command)}
                                            className="text-left rounded border border-cyan-900/40 bg-cyan-950/20 px-3 py-1.5 hover:bg-cyan-800/40 hover:border-cyan-500/50 hover:text-cyan-100 text-cyan-400 text-xs transition-all"
                                        >
                                            {command}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* QUICK PRESETS & REFERENCE */}
            <div className="mt-4 flex flex-col gap-2">
                <div className="flex gap-2">
                    {Object.entries(prebuiltScripts).map(([name, script]) => {
                        const isActive = activePrebuilt === name;
                        return (
                            <button
                                key={name}
                                type="button"
                                onClick={() => {
                                    setScriptInput(script);
                                    setActivePrebuilt(name);
                                    handleDeployBrain(script);
                                }}
                                className={`flex-1 py-1.5 text-[10px] tracking-wider rounded uppercase transition-all ${isActive
                                    ? "bg-purple-500/20 border border-purple-400 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                                    : "bg-black/40 border border-cyan-900/50 text-cyan-700 hover:border-cyan-700 hover:text-cyan-500"
                                    }`}
                            >
                                {name}
                            </button>
                        );
                    })}
                </div>

                <div className="border border-cyan-900/40 bg-black/30 rounded overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setIsReferenceOpen((prev) => !prev)}
                        className="w-full px-3 py-1.5 flex items-center justify-between uppercase tracking-[0.2em] text-cyan-600 text-[9px] hover:bg-cyan-950/50 transition-colors"
                    >
                        <span>Variables Ref</span>
                        <span className="text-cyan-400">{isReferenceOpen ? "▼" : "▶"}</span>
                    </button>
                    {isReferenceOpen && (
                        <div className="p-2 border-t border-cyan-900/40 flex flex-wrap gap-1.5">
                            {REFERENCE_ITEMS.map((item) => (
                                <span key={item} className="px-1.5 py-0.5 bg-cyan-950/40 border border-cyan-900/60 rounded text-cyan-500 text-[10px]">
                                    {item}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Custom scrollbars and styling embedded */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(34, 211, 238, 0.2);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(34, 211, 238, 0.5);
                }
            `}</style>
        </div>
    );
};

export const CommandConsole = memo(CommandConsoleComponent);
export default CommandConsole;