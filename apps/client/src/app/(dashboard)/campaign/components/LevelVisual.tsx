"use client";
import React, { memo, useMemo } from "react";
import { VIS_MAP } from "./visuals";

interface Props { levelId: string; difficulty: string; }

const DC: Record<string, string> = {
  EASY: "#34d399", MEDIUM: "#eab308", HARD: "#f97316", EXTREME: "#ef4444",
};

export const LevelVisual = memo(function LevelVisual({ levelId, difficulty }: Props) {
  const { Comp, c, order } = useMemo(() => {
    const [prefix, num] = levelId.split("-");
    return {
      Comp: VIS_MAP[prefix],
      order: parseInt(num, 10) || 1,
      c: DC[difficulty] ?? DC.EASY,
    };
  }, [difficulty, levelId]);

  if (!Comp) return null;

  return (
    <div className="w-full h-[110px] rounded-xl border border-accent/10 overflow-hidden relative"
      style={{ background: `${c}06` }}>
      <Comp order={order} c={c} />
      <style>{`
        @keyframes nodePop {
          from { r: 0; opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
});
