"use client";
import React from "react";

export function DsVis({ order, c }: { order: number; c: string }) {
  const pairs = Math.min(order + 1, 6);
  const labels = ["mode", "ammo", "shield", "threat", "pos", "kills"];
  const vals = ["1", "8", "3", "0", "2", "5"];
  const boxH = 11;
  const totalH = pairs * (boxH + 2);
  const startY = 44 - totalH / 2;
  return (
    <svg viewBox="0 0 150 90" className="w-full h-full">
      {/* Container box */}
      <rect x="30" y={startY - 6} width="90" height={totalH + 14}
        rx="4" fill={`${c}04`} stroke={`${c}20`} strokeWidth="0.8">
        <animate attributeName="stroke-opacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite" />
      </rect>
      <text x="75" y={startY - 0.5} textAnchor="middle" fill={`${c}40`} fontSize="5" fontFamily="monospace">
        {"{ state }"}
      </text>
      {Array.from({ length: pairs }, (_, i) => {
        const y = startY + 7 + i * (boxH + 2);
        return (
          <g key={i}>
            {/* Key box */}
            <rect x="38" y={y} width="30" height={boxH} rx="2"
              fill={`${c}12`} stroke={`${c}25`} strokeWidth="0.5">
              <animate attributeName="fill-opacity" values="0.12;0.25;0.12"
                dur="2.5s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
            </rect>
            <text x="53" y={y + 7.5} textAnchor="middle" fill={`${c}70`}
              fontSize="5" fontFamily="monospace">{labels[i]}</text>
            <text x="72" y={y + 7.5} textAnchor="middle" fill={`${c}30`}
              fontSize="5" fontFamily="monospace">:</text>
            {/* Value box — animated value change */}
            <rect x="78" y={y} width="16" height={boxH} rx="2"
              fill={`${c}08`} stroke={`${c}20`} strokeWidth="0.5" />
            <text x="86" y={y + 7.8} textAnchor="middle" fill={c}
              fontSize="6" fontFamily="monospace" fontWeight="bold">
              {vals[i]}
              <animate attributeName="opacity" values="1;0.3;1" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
            </text>
            {/* Data flow arrow */}
            <line x1="96" y1={y + boxH / 2} x2="104" y2={y + boxH / 2}
              stroke={`${c}30`} strokeWidth="0.5" strokeDasharray="2 1">
              <animate attributeName="stroke-dashoffset" values="0;-6" dur="1s" repeatCount="indefinite" />
            </line>
          </g>
        );
      })}
    </svg>
  );
}
