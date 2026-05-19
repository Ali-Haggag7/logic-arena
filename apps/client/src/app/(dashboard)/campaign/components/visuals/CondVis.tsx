"use client";
import React, { memo, useMemo } from "react";

export const CondVis = memo(function CondVis({ order, c }: { order: number; c: string }) {
  const depth = Math.min(order + 1, 6);
  const { nodes, lines } = useMemo(() => {
    const nextNodes: React.ReactElement[] = [];
    const nextLines: React.ReactElement[] = [];
    let idx = 0;

    function addNode(x: number, y: number, lvl: number, key: string) {
      if (lvl > depth) return;
      const r = 4.5 - lvl * 0.4;
      nextNodes.push(
        <circle key={`n${key}`} cx={x} cy={y} r={Math.max(r, 2)}
          fill={lvl === 1 ? c : `${c}50`} stroke={c} strokeWidth="0.5"
          style={{ animation: `nodePop 0.4s ${lvl * 0.12}s both` }} />
      );
      if (lvl < depth) {
        const spread = 48 / Math.pow(2, lvl);
        const ny = y + 16;
        const lx = x - spread, rx = x + spread;
        nextLines.push(
          <g key={`l${key}l`}>
            <line x1={x} y1={y} x2={lx} y2={ny} stroke={`${c}30`} strokeWidth="0.8" />
            <circle r="1.5" fill={c}>
              <animateMotion dur={`${1 + idx * 0.1}s`} repeatCount="indefinite"
                path={`M${x},${y} L${lx},${ny}`} />
            </circle>
          </g>
        );
        nextLines.push(
          <g key={`l${key}r`}>
            <line x1={x} y1={y} x2={rx} y2={ny} stroke={`${c}30`} strokeWidth="0.8" />
            <circle r="1.5" fill={c} opacity="0.6">
              <animateMotion dur={`${1.3 + idx * 0.1}s`} repeatCount="indefinite"
                path={`M${x},${y} L${rx},${ny}`} />
            </circle>
          </g>
        );
        idx++;
        addNode(lx, ny, lvl + 1, `${key}l`);
        addNode(rx, ny, lvl + 1, `${key}r`);
      }
    }
    addNode(75, 8, 1, "r");
    return { nodes: nextNodes, lines: nextLines };
  }, [c, depth]);

  return (
    <svg viewBox="0 0 150 90" className="w-full h-full">
      <defs>
        <filter id="glow"><feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {lines}{nodes}
      <text x="75" y="88" textAnchor="middle" fill={`${c}60`} fontSize="4.5" fontFamily="monospace">
        IF/ELSE DEPTH: {depth}
      </text>
    </svg>
  );
});
