import React, { memo } from "react";
import { Socket } from "socket.io-client";
import { useConsole } from "../../hooks/useConsole";
import { BotSelector } from "./BotSelector";
import { TerminalOutput } from "./TerminalOutput";
import { ScriptEditor } from "./ScriptEditor";
import { CommandsDatabase } from "./CommandsDatabase";
import { PrebuiltScripts } from "./PrebuiltScripts";
import { ReferencePanel } from "./ReferencePanel";

interface CommandConsoleProps {
    socket: Socket | null;
    robotId: string;
    availableRobots: string[];
    onRobotChange: (id: string) => void;
}

const CommandConsoleComponent: React.FC<CommandConsoleProps> = ({ socket, robotId, availableRobots, onRobotChange }) => {
    const {
        output, commandInput, setCommandInput, scriptInput, setScriptInput,
        isLibraryOpen, setIsLibraryOpen, activePrebuilt, setActivePrebuilt,
        appendScriptLine, handleCommandSubmit, handleDeployBrain
    } = useConsole(socket, robotId);

    return (
        <div className="flex flex-col w-full h-full bg-black/60 backdrop-blur-xl border border-cyan-900/60 rounded-xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.8)] relative z-20">
            <BotSelector availableRobots={availableRobots} robotId={robotId} onRobotChange={onRobotChange} />
            <TerminalOutput output={output} />
            
            {/* Live Command Line inline for brevity */}
            <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 mb-4 bg-black/40 border border-cyan-900/50 rounded p-2 focus-within:border-cyan-500/50 transition-colors">
                <span className="text-cyan-500 font-bold ml-1">{'>'}</span>
                <input placeholder="Execute override (e.g. FIRE)" type="text" className="flex-grow bg-transparent outline-none text-cyan-300 text-xs placeholder-cyan-900" value={commandInput} onChange={(e) => setCommandInput(e.target.value)} />
            </form>

            <ScriptEditor 
                scriptInput={scriptInput} 
                setScriptInput={setScriptInput} 
                handleDeployBrain={() => handleDeployBrain()} 
                toggleLibrary={() => setIsLibraryOpen(!isLibraryOpen)} 
                clearPrebuilt={() => setActivePrebuilt(null)} 
            />
            
            {/* UPDATED: Appends the script AND closes the dropdown immediately */}
            <CommandsDatabase 
                isOpen={isLibraryOpen} 
                onSelect={(cmd) => {
                    appendScriptLine(cmd);
                    setIsLibraryOpen(false); 
                }} 
            />

            <div className="mt-4 flex flex-col gap-2">
                <PrebuiltScripts activePrebuilt={activePrebuilt} onSelect={(name, script) => { setScriptInput(script); setActivePrebuilt(name); handleDeployBrain(script); }} />
                <ReferencePanel />
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.2); border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(34, 211, 238, 0.2); border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(34, 211, 238, 0.5); }
            `}</style>
        </div>
    );
};

export const CommandConsole = memo(CommandConsoleComponent);
export default CommandConsole;