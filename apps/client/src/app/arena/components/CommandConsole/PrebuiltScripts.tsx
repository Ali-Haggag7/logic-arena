import React from "react";

const PREBUILT_SCRIPTS = {
    "Safe Mode": "IF health < 50 THEN MOVE",
    "Aggressive": "IF distance < 200 THEN FIRE",
    "Sniper": "IF distance < 1200 THEN FIRE",
};

interface PrebuiltProps {
    activePrebuilt: string | null;
    onSelect: (name: string, script: string) => void;
}

export const PrebuiltScripts: React.FC<PrebuiltProps> = ({ activePrebuilt, onSelect }) => (
    <div className="flex gap-2">
        {Object.entries(PREBUILT_SCRIPTS).map(([name, script]) => {
            const isActive = activePrebuilt === name;
            return (
                <button
                    key={name}
                    type="button"
                    onClick={() => onSelect(name, script)}
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
);