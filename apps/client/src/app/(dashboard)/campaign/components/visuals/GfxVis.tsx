"use client";
import React, { memo, useMemo } from "react";

export const GfxVis = memo(function GfxVis({ order, c }: { order: number; c: string }) {
  const nodeCount = Math.min(order + 3, 10);
  const positions = useMemo(() => Array.from({ length: nodeCount }, (_, i) => {
    const angle = (i / nodeCount) * Math.PI * 2 - Math.PI / 2;
    const r = 26 + (i % 3) * 5;
    return { x: 75 + Math.cos(angle) * r, y: 44 + Math.sin(angle) * r };
  }), [nodeCount]);
  // Build edges
  const edges = useMemo(() => {
    const nextEdges: React.ReactElement[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const j = (i + 1) % nodeCount;
      const pi = positions[i], pj = positions[j];
      nextEdges.push(
        <g key={`e${i}`}>
          <line x1={pi.x} y1={pi.y} x2={pj.x} y2={pj.y}
            stroke={`${c}20`} strokeWidth="0.8" />
          <circle r="1.8" fill={c} opacity="0.8">
            <animateMotion dur={`${1.5 + i * 0.15}s`} repeatCount="indefinite"
              begin={`${i * 0.3}s`}
              path={`M${pi.x},${pi.y} L${pj.x},${pj.y}`} />
          </circle>
        </g>
      );
      if (i + 2 < nodeCount && i % 2 === 0) {
        const pk = positions[i + 2];
        nextEdges.push(
          <line key={`x${i}`} x1={pi.x} y1={pi.y} x2={pk.x} y2={pk.y}
            stroke={`${c}10`} strokeWidth="0.5" strokeDasharray="2 2">
            <animate attributeName="stroke-dashoffset" values="0;-8" dur="2s" repeatCount="indefinite" />
          </line>
        );
      }
    }
    return nextEdges;
  }, [c, nodeCount, positions]);
  return (
    <svg viewBox="0 0 150 90" className="w-full h-full">
      {edges}
      {positions.map((p, i) => (
        <g key={`n${i}`}>
          {/* Pulse ring */}
          <circle cx={p.x} cy={p.y} r={i === 0 ? 6 : 5} fill="none" stroke={c} strokeWidth="0.4" opacity="0.3">
            <animate attributeName="r" values={`${i === 0 ? 5 : 4};${i === 0 ? 8 : 7};${i === 0 ? 5 : 4}`}
              dur={`${2 + i * 0.1}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0;0.3" dur={`${2 + i * 0.1}s`} repeatCount="indefinite" />
          </circle>
          {/* Node */}
          <circle cx={p.x} cy={p.y} r={i === 0 ? 4 : 3} fill={i === 0 ? c : `${c}50`}
            stroke={c} strokeWidth="0.4" />
          <text x={p.x} y={p.y + 1.5} textAnchor="middle"
            fill={i === 0 ? "#000" : `${c}90`}
            fontSize="4" fontFamily="monospace" fontWeight="bold">{i}</text>
        </g>
      ))}
      <text x="75" y="86" textAnchor="middle" fill={`${c}60`} fontSize="4.5" fontFamily="monospace">
        NODES: {nodeCount}
      </text>
    </svg>
  );
});
