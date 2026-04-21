import React from "react";

export function SkeletonNode() {
  return (
    <div
      className="w-[280px] h-[120px] rounded-xl animate-[shimmer_1.5s_infinite]"
      style={{
        background: "linear-gradient(90deg, rgba(var(--accent-rgb),0.03) 0%, rgba(var(--accent-rgb),0.08) 50%, rgba(var(--accent-rgb),0.03) 100%)",
        backgroundSize: "200% 100%",
      }}
    />
  );
}

export function MobileSkeletonNode() {
  return (
    <div className="flex flex-col items-center mb-10 w-full relative">
       <div className="absolute top-0 -translate-y-full w-[2px] h-10 bg-accent/10" />
       <div className="w-14 h-14 rounded-full bg-accent/10 animate-[pulse_1.5s_infinite]" />
       <div className="mt-3 w-32 h-4 bg-accent/10 rounded animate-[pulse_1.5s_infinite]" />
       <div className="mt-2 w-24 h-3 bg-accent/5 rounded animate-[pulse_1.5s_infinite]" />
    </div>
  );
}
