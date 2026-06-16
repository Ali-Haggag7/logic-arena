import React from "react";

export function GarageSkeletonLoader() {
  return (
    <div className="w-full h-full rounded-2xl border border-accent/10 bg-bg-secondary/80 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        <span className="text-[10px] text-accent/50 tracking-[0.25em] font-mono uppercase">
          LOADING ARENA...
        </span>
      </div>
    </div>
  );
}
