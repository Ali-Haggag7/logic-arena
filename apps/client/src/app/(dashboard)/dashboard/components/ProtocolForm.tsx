import React from "react";

interface ProtocolFormProps {
    newScriptTitle: string;
    setNewScriptTitle: (val: string) => void;
    isLoading: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export const ProtocolForm = ({ newScriptTitle, setNewScriptTitle, isLoading, onSubmit }: ProtocolFormProps) => {
    return (
        <div className="bg-black/60 backdrop-blur-xl border border-cyan-900/60 rounded-xl p-5 sm:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.8)] lg:sticky lg:top-8">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
            
            <h3 className="text-green-400 uppercase tracking-widest text-[10px] sm:text-xs font-bold mb-4 sm:mb-6 flex items-center gap-2">
                [+] Initialize Protocol
            </h3>

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-[8px] sm:text-[9px] text-cyan-600 uppercase tracking-[0.2em] font-bold ml-1">
                        Protocol Designation
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. AGGRESSIVE_SWARM"
                        className="w-full bg-black/50 border border-cyan-900/50 rounded-lg p-3 text-cyan-300 outline-none focus:border-cyan-400 focus:bg-cyan-950/20 transition-all shadow-inner text-[10px] sm:text-xs placeholder-cyan-900/50"
                        value={newScriptTitle}
                        onChange={(e) => setNewScriptTitle(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading || !newScriptTitle.trim()}
                    className="w-full py-3 mt-1 sm:mt-2 bg-green-600/10 border border-green-500/40 text-green-400 font-bold text-[10px] sm:text-xs hover:bg-green-600/30 hover:border-green-400 hover:text-white transition-all rounded-lg uppercase tracking-[0.15em] shadow-[0_0_15px_rgba(34,197,94,0)] hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "COMPILING..." : "GENERATE SCRIPT"}
                </button>
            </form>
        </div>
    );
};
