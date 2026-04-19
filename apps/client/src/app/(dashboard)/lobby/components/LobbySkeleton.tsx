import React from "react";

export function LobbySkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-card/55 rounded-lg p-5 border border-accent/10 backdrop-blur-md flex justify-between items-center w-full animate-pulse"
        >
          <div className="flex-1">
            <div className="h-5 w-48 bg-accent/20 rounded mb-2.5" />
            <div className="h-2.5 w-64 bg-accent/10 rounded" />
          </div>
          <div className="w-24 h-9 bg-accent/10 rounded" />
        </div>
      ))}
    </div>
  );
}
