"use client";

import React, { useEffect, useRef } from "react";
import { Snapshot } from "../types";
import { drawFrame, CANVAS_W, CANVAS_H } from "./canvasRenderer";

export { CANVAS_W, CANVAS_H };

interface Props {
  prevSnapshot?: Snapshot;
  currSnapshot?: Snapshot;
  lerpT?: number;
}

export function ReplayCanvas({ prevSnapshot, currSnapshot, lerpT = 0 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smoothedHealthRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawFrame(
      ctx,
      prevSnapshot,
      currSnapshot,
      lerpT,
      smoothedHealthRef.current
    );
  }, [prevSnapshot, currSnapshot, lerpT]);

  return (
    <div className="relative w-full max-w-[420px] rounded-[10px] overflow-hidden border border-accent/20 shadow-[0_0_40px_rgba(var(--accent-rgb),0.06),0_0_0_1px_rgba(var(--accent-rgb),0.05)]">
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="w-full h-auto block"
      />
      {/* Corner accents */}
      {[
        { top: 0, left: 0, borderTop: true, borderLeft: true },
        { top: 0, right: 0, borderTop: true, borderRight: true },
        { bottom: 0, left: 0, borderBottom: true, borderLeft: true },
        { bottom: 0, right: 0, borderBottom: true, borderRight: true },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute w-4 h-4 pointer-events-none"
          style={{
            top: pos.top !== undefined ? 0 : undefined,
            bottom: pos.bottom !== undefined ? 0 : undefined,
            left: pos.left !== undefined ? 0 : undefined,
            right: pos.right !== undefined ? 0 : undefined,
            borderTop: pos.borderTop
              ? "2px solid rgba(var(--accent-rgb),0.5)"
              : "none",
            borderBottom: pos.borderBottom
              ? "2px solid rgba(var(--accent-rgb),0.5)"
              : "none",
            borderLeft: pos.borderLeft
              ? "2px solid rgba(var(--accent-rgb),0.5)"
              : "none",
            borderRight: pos.borderRight
              ? "2px solid rgba(var(--accent-rgb),0.5)"
              : "none",
          }}
        />
      ))}
    </div>
  );
}
