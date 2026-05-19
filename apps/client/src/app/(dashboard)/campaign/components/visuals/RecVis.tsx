"use client";
import React from "react";

export function RecVis({ order, c }: { order: number; c: string }) {
  const depth = Math.min(order + 1, 7);
  const rects: React.ReactElement[] = [];
  function nest(cx: number, cy: number, size: number, lvl: number) {
    if (lvl > depth || size < 4) return;
    const opacity = 0.15 + (lvl / depth) * 0.6;
    const dur = 3 - lvl * 0.2;
    rects.push(
      <rect key={`${cx}-${cy}-${lvl}`}
        x={cx - size / 2} y={cy - size / 2} width={size} height={size}
        rx="2" fill="none" stroke={c} strokeWidth="0.7" opacity={opacity}>
        <animateTransform attributeName="transform" type="rotate"
          values={`0,${cx},${cy};${lvl % 2 === 0 ? 5 : -5},${cx},${cy};0,${cx},${cy}`}
          dur={`${dur}s`} repeatCount="indefinite" />
        <animate attributeName="opacity" values={`${opacity};${opacity + 0.2};${opacity}`}
          dur={`${dur}s`} repeatCount="indefinite" />
      </rect>
    );
    nest(cx, cy, size * 0.58, lvl + 1);
  }
  nest(75, 42, 62, 1);
  return (
    <svg viewBox="0 0 150 90" className="w-full h-full">
      {rects}
      {/* Center pulsing core */}
      <circle cx="75" cy="42" r="3" fill={c} opacity="0.8">
        <animate attributeName="r" values="2;4;2" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <text x="75" y="86" textAnchor="middle" fill={`${c}60`} fontSize="4.5" fontFamily="monospace">
        DEPTH: {depth}
      </text>
    </svg>
  );
}
