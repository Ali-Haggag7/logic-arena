import React, { useState } from "react";

export const CustomSelect = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const options = ["COMBAT", "RACING", "TRAINING_SOLO"];

    return (
        <div className="relative font-mono text-[10px] sm:text-xs tracking-widest z-50">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between gap-4 bg-black/80 backdrop-blur-xl border border-[#00f3ff] rounded px-3 py-1.5 text-[#00f3ff] shadow-[0_0_8px_rgba(0,243,255,0.4)] hover:shadow-[0_0_15px_rgba(0,243,255,0.8)] hover:bg-cyan-500/20 transition-all uppercase w-40"
            >
                <span className="truncate">{value}</span>
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''} text-[8px]`}>▼</span>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute top-full right-0 mt-2 w-40 z-50 bg-black/90 backdrop-blur-xl border border-[#00f3ff] shadow-[0_0_10px_rgba(0,243,255,0.5)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-1">
                        {options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => { onChange(opt); setIsOpen(false); }}
                                className={`px-3 py-2 text-left uppercase transition-all duration-75 hover:bg-cyan-400/30 hover:text-white hover:tracking-[0.1em] ${value === opt ? 'bg-cyan-950 text-[#00f3ff]' : 'text-cyan-300'}`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
