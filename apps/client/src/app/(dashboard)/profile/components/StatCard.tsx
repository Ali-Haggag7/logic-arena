import React, { useState } from "react";

interface Props {
  label: string;
  value: string | number;
  accent: string;
}

export function StatCard({ label, value, accent }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="bg-black/55 rounded-[10px] p-[20px_22px] flex flex-col gap-2 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.6)] transition-colors duration-250 shrink-0"
      style={{
        border: `1px solid ${hovered ? accent + "55" : accent + "22"}`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.6), inset 0 1px 0 ${accent}18`
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        style={{ color: `${accent}88` }}
        className="text-[8px] tracking-[0.22em] font-bold uppercase"
      >
        {label}
      </span>
      <span
        style={{ color: accent, textShadow: `0 0 14px ${accent}99` }}
        className="text-[32px] font-black leading-none tracking-[-0.02em]"
      >
        {value}
      </span>
    </div>
  );
}
