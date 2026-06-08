"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface Props {
    matchId: string;
    isGuest?: boolean;
    fullWidth?: boolean;
}

export function ReplayButton({ matchId, isGuest, fullWidth }: Props) {
    const router = useRouter();


    return (
        <button
            type="button"
            onClick={() => router.push(`/replay/${matchId}`)}
            className={`py-2.5 rounded-lg text-[10px] font-black tracking-[0.25em] bg-accent/10 border border-accent/30 text-accent transition-all duration-300 hover:bg-accent/20 hover:border-accent/50 hover:shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)] active:scale-95 cursor-pointer ${fullWidth ? "w-full" : "px-6"}`}
        >
            VIEW
        </button>
    );
}
