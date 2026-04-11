import React from "react";

interface ScriptEditorProps {
    scriptInput: string;
    setScriptInput: (val: string) => void;
    handleDeployBrain: () => void;
    toggleLibrary: () => void;
    clearPrebuilt: () => void;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({ scriptInput, setScriptInput, handleDeployBrain, toggleLibrary, clearPrebuilt }) => (
    <div className="relative flex flex-col gap-3">
        <div className="relative">
            <textarea
                className="w-full h-28 bg-black/50 border border-purple-900/40 rounded-lg p-3 text-purple-300 font-mono text-xs outline-none focus:border-purple-500/60 focus:bg-purple-950/10 transition-all custom-scrollbar resize-none shadow-inner"
                placeholder="Initialize neural script (e.g. IF spotted THEN FIRE)"
                value={scriptInput}
                onChange={(e) => {
                    setScriptInput(e.target.value);
                    clearPrebuilt();
                }}
            />
            <div className="absolute top-2 right-3 text-[9px] text-purple-500/50 tracking-widest pointer-events-none">ALISCRIPT_V1</div>
        </div>
        <div className="flex gap-3 relative">
            <button
                type="button"
                onClick={handleDeployBrain}
                className="flex-1 py-2.5 bg-purple-600/20 border border-purple-500/50 text-purple-300 font-bold text-xs hover:bg-purple-600/40 hover:text-white transition-all rounded uppercase tracking-[0.1em] shadow-[0_0_15px_rgba(168,85,247,0.25)]"
            >
                Deploy Brain
            </button>
            <button
                type="button"
                onClick={toggleLibrary}
                className="flex-1 py-2.5 bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 font-bold text-xs hover:bg-cyan-800/50 transition-all rounded uppercase tracking-[0.1em]"
            >
                Database
            </button>
        </div>
    </div>
);