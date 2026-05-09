"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, WifiOff } from "lucide-react";

interface Props {
  isMobile: boolean;
  username?: string;
  errorType: "NOT_FOUND" | "NETWORK" | "UNKNOWN";
  onRetry?: () => void;
}

function HexBroken({ size }: { size: number }) {
  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: "rgba(var(--accent-rgb),0.06)",
          clipPath: "polygon(50% 4%, 95% 27.5%, 95% 72.5%, 50% 96%, 5% 72.5%, 5% 27.5%)",
          border: "1px solid rgba(var(--accent-rgb),0.2)",
        }}
      />
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          color: "rgba(var(--accent-rgb),0.15)",
        }}
      >
        <AlertTriangle size={size * 0.4} strokeWidth={1.5} />
      </div>
    </div>
  );
}

export function ProfileErrorState({ isMobile, username, errorType, onRetry }: Props) {
  const isNotFound = errorType === "NOT_FOUND";

  return (
    <div
      className={`relative flex ${isMobile ? "flex-col items-center text-center gap-6" : "flex-row items-center gap-8"} pb-8 mb-6`}
      style={{ borderBottom: "1px solid rgba(var(--accent-rgb),0.12)" }}
    >
      <HexBroken size={isMobile ? 80 : 100} />

      <div className={`flex flex-col ${isMobile ? "items-center" : "items-start"} gap-3 flex-1 min-w-0`}>
        {/* Glitch-style header */}
        <div className="relative">
          <h1
            className="m-0 font-black tracking-[0.22em] leading-none animate-pulse"
            style={{
              fontSize: isMobile ? "clamp(20px,5vw,28px)" : "clamp(24px,3.5vw,36px)",
              color: "rgba(var(--accent-rgb),0.5)",
              textShadow: "0 0 15px rgba(var(--accent-rgb),0.15)",
            }}
          >
            {isNotFound ? "SIGNAL LOST" : "CONNECTION LOST"}
          </h1>
        </div>

        {/* Message */}
        <p
          className="m-0 text-[11px] tracking-[0.15em] font-mono"
          style={{ color: "rgba(var(--accent-rgb),0.4)" }}
        >
          {isNotFound ? (
            <>
              OPERATOR <span className="text-accent/60 font-bold tracking-[0.25em]">{username?.toUpperCase() ?? "UNKNOWN"}</span>
              {" // "}NOT FOUND IN DATABASE
            </>
          ) : errorType === "NETWORK" ? (
            <>
              UNABLE TO REACH SERVER{" // "}CHECK YOUR CONNECTION
            </>
          ) : (
            <>
              ANOMALOUS ERROR DETECTED{" // "}TRY AGAIN LATER
            </>
          )}
        </p>

        {/* Status code */}
        <div
          className="text-[8px] font-mono tracking-[0.35em]"
          style={{ color: "rgba(var(--accent-rgb),0.15)" }}
        >
          {isNotFound ? "[STATUS: 404 — ENTITY_DELETED_OR_MOVED]" : "[STATUS: 503 — SERVICE_UNAVAILABLE]"}
        </div>

        {/* Actions */}
        <div className={`flex ${isMobile ? "flex-col" : "flex-row"} gap-3 mt-2`}>
          <Link
            href="/leaderboard"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[10px] font-black tracking-[0.2em] font-mono border transition-all duration-200 bg-accent/5 border-accent/20 text-accent/60 hover:bg-accent/15 hover:border-accent/50 hover:text-accent"
          >
            <ArrowLeft size={12} />
            FIND OPERATORS
          </Link>

          {!isNotFound && onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[10px] font-black tracking-[0.2em] font-mono border transition-all duration-200 bg-transparent border-accent/10 text-accent/40 hover:bg-accent/10 hover:border-accent/30 hover:text-accent/70"
            >
              <WifiOff size={12} />
              RETRY LINK
            </button>
          )}
        </div>
      </div>

      {/* Scanline corner decoration */}
      {!isMobile && (
        <div
          className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(var(--accent-rgb),0.3) 0px, rgba(var(--accent-rgb),0.3) 1px, transparent 1px, transparent 8px)",
          }}
        />
      )}
    </div>
  );
}
