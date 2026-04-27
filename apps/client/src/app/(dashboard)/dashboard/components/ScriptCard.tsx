"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Pencil, Swords, Trophy, Trash2 } from "lucide-react";

export interface RobotScript {
    id: string;
    title: string;
    content: string;
    version: number;
    createdAt: string;
}

interface ScriptCardProps {
    script: RobotScript;
    onEditBrain: (id: string) => void;
    onDeployToLobby: (id: string) => void;
    onDeployToArena: (id: string) => void;
    onDelete: (id: string) => void;
    isMobile?: boolean;
    isGuest?: boolean;
}

const CONFIRM_TIMEOUT_MS = 3000;

export const ScriptCard = ({
    script,
    onEditBrain,
    onDeployToLobby,
    onDeployToArena,
    onDelete,
    isMobile,
    isGuest,
}: ScriptCardProps) => {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const startConfirm = useCallback(() => {
        setConfirmDelete(true);
    }, []);

    const cancelConfirm = useCallback(() => {
        setConfirmDelete(false);
    }, []);

    const confirmAndDelete = useCallback(() => {
        setConfirmDelete(false);
        onDelete(script.id);
    }, [onDelete, script.id]);

    // Auto-cancel confirmation after timeout
    useEffect(() => {
        if (!confirmDelete) return;
        const timer = setTimeout(cancelConfirm, CONFIRM_TIMEOUT_MS);
        return () => clearTimeout(timer);
    }, [confirmDelete, cancelConfirm]);

    const iconBtnBase = "flex items-center justify-center rounded-lg border transition-colors duration-150 cursor-pointer";
    const iconBtnSize = isMobile ? "w-12 h-12" : "w-10 h-10";

    const ActionRow = (
        <div className="flex gap-2 justify-end pt-3 border-t border-border/30 mt-3">
            {confirmDelete ? (
                <div className="flex items-center gap-2 w-full animate-in fade-in duration-150">
                    <span className="text-red-400 text-[10px] font-bold tracking-[0.15em] uppercase flex-1">
                        CONFIRM DELETE?
                    </span>
                    <button
                        type="button"
                        aria-label="Confirm delete"
                        onClick={confirmAndDelete}
                        className={`${iconBtnBase} ${iconBtnSize} bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30 text-[10px] font-black tracking-wider px-3`}
                    >
                        YES
                    </button>
                    <button
                        type="button"
                        aria-label="Cancel delete"
                        onClick={cancelConfirm}
                        className={`${iconBtnBase} ${iconBtnSize} bg-bg-secondary border-border text-text-secondary hover:bg-border text-[10px] font-black tracking-wider px-3`}
                    >
                        NO
                    </button>
                </div>
            ) : (
                <>
                    <button
                        type="button"
                        title={isGuest ? "LOCKED" : "Edit"}
                        aria-label="Edit script"
                        onClick={() => !isGuest && onEditBrain(script.id)}
                        disabled={isGuest}
                        className={`${iconBtnBase} ${iconBtnSize} ${isGuest ? 'bg-accent/5 border-accent/10 text-accent/20 cursor-not-allowed' : 'bg-accent/10 border-accent/30 text-accent hover:bg-accent/20'}`}
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        type="button"
                        title={isGuest ? "LOCKED" : "Lobby"}
                        aria-label="Deploy to lobby"
                        onClick={() => !isGuest && onDeployToLobby(script.id)}
                        disabled={isGuest}
                        className={`${iconBtnBase} ${iconBtnSize} ${isGuest ? 'bg-purple-500/5 border-purple-500/10 text-purple-400/20 cursor-not-allowed' : 'bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20'}`}
                    >
                        <Swords size={16} />
                    </button>
                    <button
                        type="button"
                        title="Arena"
                        aria-label="Deploy to arena"
                        onClick={() => onDeployToArena(script.id)}
                        className={`${iconBtnBase} ${iconBtnSize} bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20`}
                    >
                        <Trophy size={16} />
                    </button>
                    <button
                        type="button"
                        title={isGuest ? "LOCKED" : "Delete"}
                        aria-label="Delete script"
                        onClick={() => !isGuest && startConfirm()}
                        disabled={isGuest}
                        className={`${iconBtnBase} ${iconBtnSize} ${isGuest ? 'bg-red-500/5 border-red-500/10 text-red-400/20 cursor-not-allowed' : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'}`}
                    >
                        <Trash2 size={16} />
                    </button>
                </>
            )}
        </div>
    );

    if (isMobile) {
        return (
            <div
                className="group relative flex flex-col w-full bg-card border border-accent/50 rounded-2xl overflow-hidden transition-all duration-200"
                style={{ boxShadow: "inset 3px 0 0 var(--accent), 0 1px 3px rgba(0,0,0,0.2)" }}
            >
                <div className="p-5 flex flex-col gap-1">
                    <h3 className="text-base font-bold text-accent tracking-wide group-active:text-accent/80">
                        {script.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-text-secondary font-medium tracking-widest">
                        <span>v{script.version}</span>
                        <span className="opacity-30">·</span>
                        <span>
                            {new Date(script.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "2-digit",
                            })}
                        </span>
                    </div>
                    {ActionRow}
                </div>
            </div>
        );
    }

    return (
        <div
            className="flex flex-col bg-card/60 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-accent/20 hover:border-accent/50 hover:bg-accent/5 transition-colors duration-150 group"
            style={{ boxShadow: "var(--card-shadow)" }}
        >
            <div className="flex flex-col gap-1">
                <h3 className="text-base sm:text-lg font-bold text-accent tracking-wider group-hover:text-accent transition-colors wrap-break-word">
                    {script.title}
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-4 text-[10px] text-text-secondary tracking-widest font-bold">
                    <span>V.{script.version}</span>
                    <span className="hidden sm:inline">|</span>
                    <span>INIT: {new Date(script.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
            {ActionRow}
        </div>
    );
};
