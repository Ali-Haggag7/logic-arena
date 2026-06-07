"use client";

import React, { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";

interface ScriptFormProps {
    newScriptTitle: string;
    setNewScriptTitle: (val: string) => void;
    newScriptMode: "CLASSIC" | "TACTICAL" | "HYBRID";
    setNewScriptMode: (val: "CLASSIC" | "TACTICAL" | "HYBRID") => void;
    isLoading: boolean;
    onSubmit: (e: React.FormEvent) => void;
    isGuest?: boolean;
}

export const ScriptForm = ({ newScriptTitle, setNewScriptTitle, newScriptMode, setNewScriptMode, isLoading, onSubmit, isGuest }: ScriptFormProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="z-30">
            {/* Mobile Layout */}
            <div className={`md:hidden bg-card/45 backdrop-blur-xl border border-accent/25 rounded-2xl overflow-hidden transition-all duration-300 ease-in-out shadow-lg ${isExpanded ? "max-h-[300px]" : "max-h-[60px]"}`}>
                {!isExpanded ? (
                    <button
                        type="button"
                        aria-label="Expand create script form"
                        onClick={() => setIsExpanded(true)}
                        className="w-full h-[60px] flex items-center justify-between px-5 text-accent font-black tracking-[0.18em] text-xs group"
                    >
                        <span className="flex items-center gap-3">
                            <Plus size={16} className="text-accent" />
                            CREATE NEW SCRIPT
                        </span>
                        <ChevronDown size={16} className="text-text-secondary opacity-50 group-hover:opacity-100 transition-opacity" />
                    </button>
                ) : (
                    <div className="p-4 flex flex-col gap-4">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-accent font-black tracking-[0.18em] uppercase">Script Creation</span>
                            <button 
                                type="button" 
                                aria-label="Collapse create script form" 
                                onClick={() => setIsExpanded(false)} 
                                className="p-1 cursor-pointer"
                            >
                                <ChevronDown size={16} className="text-text-secondary rotate-180 transition-transform duration-300" />
                            </button>
                        </div>
                        <form onSubmit={(e) => { onSubmit(e); setIsExpanded(false); }} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="mobile-script-name-input" className="sr-only">
                                    Script Name
                                </label>
                                <input
                                    id="mobile-script-name-input"
                                    type="text"
                                    value={newScriptTitle}
                                    onChange={(e) => setNewScriptTitle(e.target.value)}
                                    placeholder="Enter script name..."
                                    className="w-full bg-bg-primary/30 border border-accent/25 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent/50 focus:bg-accent/5 transition-colors font-mono"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="mobile-script-mode-select" className="sr-only">
                                    Script Mode
                                </label>
                                <CustomSelect
                                    id="mobile-script-mode-select"
                                    value={newScriptMode}
                                    onChange={setNewScriptMode}
                                    disabled={isLoading || isGuest}
                                    size="large"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || isGuest || !newScriptTitle.trim()}
                                className="w-full py-3 bg-accent/10 border border-accent/25 rounded-xl text-accent text-xs font-black tracking-[0.18em] uppercase active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isGuest ? "LOGIN REQUIRED" : isLoading ? "CREATING..." : "GENERATE SCRIPT"}
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block bg-bg-primary/25 border border-accent/15 rounded-[18px] p-3.5 shadow-inner relative overflow-visible">
                <form onSubmit={onSubmit} className="flex gap-3 items-end">
                    <div className="flex-1 flex flex-col gap-1.5">
                        <label htmlFor="desktop-script-name-input" className="text-[9px] text-text-secondary uppercase tracking-[0.18em] font-black ml-1">
                            NEW SCRIPT NAME
                        </label>
                        <input
                            id="desktop-script-name-input"
                            type="text"
                            placeholder="Enter script name..."
                            className="w-full bg-bg-primary/30 border border-accent/15 rounded-xl p-2.5 px-3 text-text-primary text-xs outline-none focus:border-accent/40 focus:bg-accent/5 focus:shadow-[0_0_12px_rgba(var(--accent-rgb),0.1)] transition-all placeholder:text-text-secondary/40 font-mono tracking-wide"
                            value={newScriptTitle}
                            onChange={(e) => setNewScriptTitle(e.target.value)}
                            required
                            disabled={isLoading || isGuest}
                        />
                    </div>
                    <div className="w-[120px] flex flex-col gap-1.5 shrink-0">
                        <label htmlFor="desktop-script-mode-select" className="text-[9px] text-text-secondary uppercase tracking-[0.18em] font-black ml-1">
                            MODE
                        </label>
                        <CustomSelect
                            id="desktop-script-mode-select"
                            value={newScriptMode}
                            onChange={setNewScriptMode}
                            disabled={isLoading || isGuest}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || isGuest || !newScriptTitle.trim()}
                        className="h-[38px] px-5 bg-accent/10 border border-accent/30 text-accent font-black text-xs hover:bg-accent/20 hover:border-accent/50 hover:text-text-primary transition-all duration-300 rounded-xl uppercase tracking-[0.18em] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                        {isGuest ? "LOCKED" : isLoading ? "CREATING..." : "CREATE"}
                    </button>
                </form>
            </div>
        </div>
    );
};

const CustomSelect = ({ 
    value, 
    onChange, 
    disabled, 
    id,
    size = "normal"
}: { 
    value: "CLASSIC" | "TACTICAL" | "HYBRID", 
    onChange: (v: "CLASSIC" | "TACTICAL" | "HYBRID") => void, 
    disabled?: boolean, 
    id?: string,
    size?: "normal" | "large"
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const options = ["HYBRID", "CLASSIC", "TACTICAL"] as const;

    const baseClasses = size === "large" 
        ? "px-4 py-3 text-sm" 
        : "p-2.5 px-3 text-xs";

    return (
        <div className="relative w-full" onBlur={(e) => {
            // Only close if focus leaves the container
            if (!e.currentTarget.contains(e.relatedTarget)) {
                setIsOpen(false);
            }
        }}>
            <button
                type="button"
                id={id}
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-bg-primary/30 border border-accent/15 hover:border-accent/30 hover:bg-accent/5 rounded-xl ${baseClasses} text-text-primary outline-none focus:border-accent/40 focus:bg-accent/5 focus:shadow-[0_0_12px_rgba(var(--accent-rgb),0.1)] transition-all font-mono tracking-wide flex justify-between items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group`}
            >
                <span className="group-hover:text-accent transition-colors">{value === "HYBRID" && size === "large" ? "HYBRID (Free)" : value}</span>
                <ChevronDown size={14} className={`text-text-secondary group-hover:text-accent transition-all duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>
            
            {isOpen && (
                <div className="absolute z-[100] top-full left-0 right-0 mt-1.5 bg-bg-secondary/95 backdrop-blur-xl border border-accent/20 rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-top-2 duration-200">
                    {options.map((opt) => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => {
                                onChange(opt);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2.5 text-xs font-mono tracking-wide transition-colors cursor-pointer ${value === opt ? "bg-accent/20 text-accent font-bold hover:bg-accent/30" : "text-text-secondary hover:bg-accent/10 hover:text-text-primary"}`}
                        >
                            {opt === "HYBRID" && size === "large" ? "HYBRID (Free)" : opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
