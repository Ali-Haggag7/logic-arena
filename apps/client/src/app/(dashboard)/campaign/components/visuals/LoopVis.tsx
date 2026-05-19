"use client";
import React, { memo, useMemo } from "react";

export const LoopVis = memo(function LoopVis({ order, c }: { order: number; c: string }) {
  const rings = Math.min(order + 1, 5);
  const dots = order + 2;
  const ringElements = useMemo(() => Array.from({ length: rings }, (_, i) => {
    const rx = 16 + i * 9, ry = 9 + i * 5;
    return (
      <g key={`r${i}`}>
        <ellipse cx="75" cy="42" rx={rx} ry={ry}
          fill="none" stroke={`${c}20`} strokeWidth="0.6" />
        <circle r="2.5" fill={c} opacity={0.9 - i * 0.1} filter="url(#glow)">
          <animateMotion
            dur={`${2 + i * 0.8}s`} repeatCount="indefinite"
            path={`M${75 - rx},42 A${rx},${ry} 0 1,${i % 2} ${75 + rx},42 A${rx},${ry} 0 1,${i % 2} ${75 - rx},42`}
          />
        </circle>
        <circle r="1.5" fill={c} opacity="0.3">
          <animateMotion
            dur={`${2 + i * 0.8}s`} repeatCount="indefinite" begin={`-${0.3 + i * 0.1}s`}
            path={`M${75 - rx},42 A${rx},${ry} 0 1,${i % 2} ${75 + rx},42 A${rx},${ry} 0 1,${i % 2} ${75 - rx},42`}
          />
        </circle>
      </g>
    );
  }), [c, rings]);
  return (
    <svg viewBox="0 0 150 90" className="w-full h-full">
      {/* Center hub */}
      <circle cx="75" cy="42" r="4" fill={c} opacity="0.8">
        <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="75" cy="42" r="8" fill="none" stroke={c} strokeWidth="0.3" opacity="0.3">
        <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Orbital rings */}
      {ringElements}
      <defs>
        <filter id="glow"><feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <text x="75" y="86" textAnchor="middle" fill={`${c}60`} fontSize="4.5" fontFamily="monospace">
        ITERATIONS: {dots}
      </text>
    </svg>
  );
});
