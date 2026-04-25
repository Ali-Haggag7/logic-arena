"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const THRESHOLD = 72;
const MAX_PULL = 110;

type Phase = "idle" | "pulling" | "ready" | "loading";

export default function PullToRefresh({ children }: { children: React.ReactNode }) {
    const [phase, setPhase] = useState<Phase>("idle");
    const [pullY, setPullY] = useState(0);

    const router = useRouter();
    const pathname = usePathname();
    const startYRef = useRef(0);
    const phaseRef = useRef<Phase>("idle");
    const isLandscapeRef = useRef(false);

    useEffect(() => { phaseRef.current = phase; }, [phase]);

    // track orientation via listener — zero per-touch overhead
    useEffect(() => {
        const mq = window.matchMedia("(orientation: landscape)");
        isLandscapeRef.current = mq.matches;
        const handler = (e: MediaQueryListEvent) => { isLandscapeRef.current = e.matches; };
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
        const isDisabled = () =>
            pathname?.startsWith("/arena") ||
            isLandscapeRef.current;

        const isAtTop = () => window.scrollY <= 0;

        const onTouchStart = (e: TouchEvent) => {
            if (isDisabled() || !isAtTop()) return;
            startYRef.current = e.touches[0].clientY;
        };

        const onTouchMove = (e: TouchEvent) => {
            if (isDisabled() || phaseRef.current === "loading" || !isAtTop()) return;

            const delta = e.touches[0].clientY - startYRef.current;
            if (delta <= 0) {
                if (phaseRef.current !== "idle") { setPhase("idle"); setPullY(0); }
                return;
            }

            const eased = Math.min(MAX_PULL, delta * (1 - delta / (MAX_PULL * 3)));
            setPullY(eased);
            setPhase(eased >= THRESHOLD ? "ready" : "pulling");
            e.preventDefault();
        };

        const onTouchEnd = () => {
            if (isDisabled()) return;

            if (phaseRef.current === "ready") {
                setPhase("loading");
                setPullY(44);
                router.refresh();
                setTimeout(() => { setPhase("idle"); setPullY(0); }, 1000);
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
    }, [router, pathname]);

    const isActive = !pathname?.startsWith("/arena");
    const progress = Math.min(1, pullY / THRESHOLD);
    const dashOffset = 60 - progress * 60;
    const opacity = phase === "idle" ? 0 : Math.min(1, progress * 2);
    const isSpinning = phase === "loading";

    return (
        <>
            {isActive && (
                <div
                    aria-hidden
                    style={{
                        position: "fixed",
                        top: 0,
                        left: "50%",
                        transform: `translateX(-50%) translateY(${pullY - 52}px)`,
                        transition: phase === "idle" || phase === "loading"
                            ? "transform 0.25s ease, opacity 0.25s ease"
                            : "none",
                        zIndex: 9999,
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity,
                        pointerEvents: "none",
                    }}
                >
                    <svg
                        width="28" height="28" viewBox="0 0 28 28"
                        style={{ animation: isSpinning ? "ptr-spin 0.75s linear infinite" : "none" }}
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
            )}

            {children}

            <style>{`
        @keyframes ptr-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
        </>
    );
}