"use client";

import { useEffect, useRef, useState } from "react";

const THRESHOLD = 80;      // px needed to trigger refresh
const MAX_PULL = 120;     // max px the content shifts down

type Phase = "idle" | "pulling" | "ready" | "loading";

export default function PullToRefresh({ children }: { children: React.ReactNode }) {
    const [phase, setPhase] = useState<Phase>("idle");
    const [pullY, setPullY] = useState(0);

    const startYRef = useRef(0);
    const currentYRef = useRef(0);
    const phaseRef = useRef<Phase>("idle");

    // keep ref in sync so touch handlers always see latest phase
    useEffect(() => { phaseRef.current = phase; }, [phase]);

    useEffect(() => {
        const isAtTop = () => window.scrollY <= 0;

        const onTouchStart = (e: TouchEvent) => {
            if (!isAtTop()) return;
            startYRef.current = e.touches[0].clientY;
            currentYRef.current = e.touches[0].clientY;
        };

        const onTouchMove = (e: TouchEvent) => {
            if (phaseRef.current === "loading") return;

            currentYRef.current = e.touches[0].clientY;
            const delta = currentYRef.current - startYRef.current;

            if (delta <= 0) {
                if (phaseRef.current !== "idle") {
                    setPhase("idle");
                    setPullY(0);
                }
                return;
            }

            // rubber-band easing
            const eased = Math.min(MAX_PULL, delta * (1 - delta / (MAX_PULL * 3)));
            setPullY(eased);
            setPhase(eased >= THRESHOLD ? "ready" : "pulling");

            // prevent native scroll bounce while pulling
            if (isAtTop() && delta > 0) e.preventDefault();
        };

        const onTouchEnd = () => {
            if (phaseRef.current === "ready") {
                setPhase("loading");
                setPullY(44); // settle to spinner height

                // Reload page data (SW will network-first)
                setTimeout(() => {
                    window.location.reload();
                }, 900);
            } else {
                setPhase("idle");
                setPullY(0);
            }
        };

        document.addEventListener("touchstart", onTouchStart, { passive: true });
        document.addEventListener("touchmove", onTouchMove, { passive: false });
        document.addEventListener("touchend", onTouchEnd, { passive: true });

        return () => {
            document.removeEventListener("touchstart", onTouchStart);
            document.removeEventListener("touchmove", onTouchMove);
            document.removeEventListener("touchend", onTouchEnd);
        };
    }, []);

    const progress = Math.min(1, pullY / THRESHOLD);
    const dashOffset = 60 - progress * 60;        // 0 = full circle
    const opacity = phase === "idle" ? 0 : Math.min(1, progress * 2);
    const isSpinning = phase === "loading";

    return (
        <>
            {/* ── Indicator ── */}
            <div
                aria-hidden
                style={{
                    position: "fixed",
                    top: 0,
                    left: "50%",
                    transform: `translateX(-50%) translateY(${pullY - 52}px)`,
                    transition: phase === "idle" || phase === "loading"
                        ? "transform 0.25s ease"
                        : "none",
                    zIndex: 9999,
                    width: 36,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity,
                }}
            >
                <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    style={{
                        animation: isSpinning ? "ptr-spin 0.75s linear infinite" : "none",
                    }}
                >
                    <circle
                        cx="14" cy="14" r="11"
                        fill="none"
                        stroke="#22d3ee"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray="60"
                        strokeDashoffset={isSpinning ? 15 : dashOffset}
                        style={{
                            transformOrigin: "center",
                            transition: isSpinning ? "none" : "stroke-dashoffset 0.1s linear",
                        }}
                    />
                </svg>
            </div>

            {/* ── Content wrapper — shifts down while pulling ── */}
            <div
                style={{
                    transform: `translateY(${pullY}px)`,
                    transition: phase === "idle" || phase === "loading"
                        ? "transform 0.25s ease"
                        : "none",
                    willChange: "transform",
                }}
            >
                {children}
            </div>

            {/* ── Keyframe for spinner ── */}
            <style>{`
        @keyframes ptr-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
        </>
    );
}