"use client";
import React, { memo, useMemo } from "react";

export const ArrVis = memo(function ArrVis({ order, c }: { order: number; c: string }) {
  const cols = Math.min(order + 3, 10);
  const cellW = Math.min(14, 120 / cols);
  const totalW = cols * cellW;
  const startX = 75 - totalW / 2;
  const cells = useMemo(() => Array.from({ length: cols }, (_, i) => {
    const x = startX + i * cellW;
    const active = i < order;
    return (
      <g key={i}>
        <rect x={x + 1} y="25" width={cellW - 2} height={cellW - 2}
          rx="2" fill={active ? `${c}20` : `${c}06`}
          stroke={active ? `${c}70` : `${c}18`} strokeWidth="0.8">
          {active && (
            <animate attributeName="fill-opacity" values="0.3;0.8;0.3"
              dur={`${1.2 + i * 0.15}s`} repeatCount="indefinite" begin={`${i * 0.1}s`} />
          )}
        </rect>
        <text x={x + cellW / 2} y={25 + cellW / 2 + 2}
          textAnchor="middle" fill={active ? c : `${c}25`}
          fontSize="6" fontFamily="monospace" fontWeight="bold">{i}</text>
      </g>
    );
  }), [c, cellW, cols, order, startX]);

  return (
    <svg viewBox="0 0 150 90" className="w-full h-full">
      <defs>
        {/* Scanning beam gradient */}
        <linearGradient id="scanBeam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={c} stopOpacity="0" />
          <stop offset="40%" stopColor={c} stopOpacity="0.5" />
          <stop offset="60%" stopColor={c} stopOpacity="0.5" />
          <stop offset="100%" stopColor={c} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Cells */}
      {cells}
      {/* Scanning beam that sweeps across */}
      <rect x={startX} y="24" width={cellW * 1.5} height={cellW} rx="1"
        fill="url(#scanBeam)" opacity="0.6">
        <animateTransform attributeName="transform" type="translate"
          values={`0,0;${totalW - cellW * 1.5},0;0,0`}
          dur={`${2 + order * 0.2}s`} repeatCount="indefinite" />
      </rect>
      {/* Pointer arrow */}
      <polygon points={`${startX + cellW / 2 - 3},${25 + cellW + 4} ${startX + cellW / 2 + 3},${25 + cellW + 4} ${startX + cellW / 2},${25 + cellW + 1}`}
        fill={c} opacity="0.7">
        <animateTransform attributeName="transform" type="translate"
          values={`0,0;${totalW - cellW},0;0,0`}
          dur={`${2 + order * 0.2}s`} repeatCount="indefinite" />
      </polygon>
      <text x="75" y="86" textAnchor="middle" fill={`${c}60`} fontSize="4.5" fontFamily="monospace">
        ARRAY[{cols}]
      </text>
    </svg>
  );
});
