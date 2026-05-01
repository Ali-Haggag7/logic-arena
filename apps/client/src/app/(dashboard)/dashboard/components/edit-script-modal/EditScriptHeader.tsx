import React from "react";
import { X } from "lucide-react";

interface EditScriptHeaderProps {
    title: string;
    version: number;
    onClose: () => void;
}

export const EditScriptHeader = React.memo(({ title, version, onClose }: EditScriptHeaderProps) => {
    return (
        <div className="flex items-center justify-between gap-3 py-3.5 px-5 border-b border-accent/10 shrink-0 bg-accent/5">
            <div className="flex items-center gap-2.5 min-w-0">
                <span className="font-mono text-[0.9rem] font-bold tracking-[0.12em] text-accent drop-shadow-[0_0_14px_rgba(var(--accent-rgb),0.45)] whitespace-nowrap overflow-hidden text-ellipsis">{title}</span>
                <span className="font-mono text-[0.6rem] font-bold tracking-[0.15em] text-accent bg-accent/10 border border-accent/30 py-0.5 px-2 rounded-full shrink-0">V.{version}</span>
            </div>
            <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-md border border-transparent text-text-secondary bg-transparent cursor-pointer transition-all duration-150 shrink-0 hover:text-accent hover:border-accent/30 hover:bg-accent/10" aria-label="Close editor">
                <X size={15} />
            </button>
        </div>
    );
});
EditScriptHeader.displayName = "EditScriptHeader";
