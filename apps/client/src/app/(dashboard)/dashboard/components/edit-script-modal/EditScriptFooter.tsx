import React from "react";

export type FooterStatus = "idle" | "success" | "error";

interface EditScriptFooterProps {
    status: FooterStatus;
    errorMessage?: string;
    formattedDate: string;
    onClose: () => void;
    onSave: () => void;
}

export const EditScriptFooter = React.memo(({ status, errorMessage, formattedDate, onClose, onSave }: EditScriptFooterProps) => {
    return (
        <div className="flex items-center justify-between gap-3 py-3 px-5 border-t border-accent/10 shrink-0 flex-wrap bg-accent/5">
            <div className="flex-1 min-w-0">
                {status === "idle" && (
                    <span className="font-mono text-[0.625rem] tracking-[0.15em] text-text-secondary opacity-70">LAST MODIFIED: {formattedDate}</span>
                )}
                {status === "success" && (
                    <span className="font-mono text-[0.65rem] font-bold tracking-[0.12em] text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)] animate-in fade-in slide-in-from-bottom-1 duration-200">✓ SCRIPT UPDATED</span>
                )}
                {status === "error" && (
                    <span className="font-mono text-[0.65rem] font-bold tracking-[0.12em] text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.4)] animate-in fade-in slide-in-from-bottom-1 duration-200">✗ {errorMessage || "SAVE FAILED"}</span>
                )}
            </div>
            <div className="flex gap-2 shrink-0">
                <button onClick={onClose} className="font-mono text-[0.6rem] font-bold tracking-[0.2em] py-2 px-5 rounded-lg cursor-pointer whitespace-nowrap transition-all duration-150 border border-accent/15 bg-transparent text-text-secondary hover:border-accent/35 hover:text-text-primary hover:bg-accent/5">CANCEL</button>
                <button onClick={onSave} className="font-mono text-[0.6rem] font-bold tracking-[0.2em] py-2 px-5 rounded-lg cursor-pointer whitespace-nowrap transition-all duration-150 border border-accent/35 bg-accent/10 text-accent hover:bg-accent/20 hover:border-accent/65 hover:shadow-[0_0_18px_rgba(var(--accent-rgb),0.22)]">SAVE CHANGES</button>
            </div>
        </div>
    );
});
EditScriptFooter.displayName = "EditScriptFooter";
