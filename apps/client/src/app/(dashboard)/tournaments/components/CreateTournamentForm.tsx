import React, { useState } from "react";

interface Props {
  onClose: () => void;
  onCreate: (name: string) => void;
  creating: boolean;
}

export function CreateTournamentForm({ onClose, onCreate, creating }: Props) {
  const [name, setName] = useState("");
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  const handleSubmit = () => {
    if (name.trim()) {
      onCreate(name.trim());
    }
  };

  return (
    <div className="mb-8 p-6 rounded-xl bg-black/60 border border-[#22d3ee]/20 backdrop-blur-xl animate-[fadeIn_0.25s_ease] flex gap-3 items-center">
      <div className="text-[8px] tracking-[0.22em] text-[#22d3ee]/30 uppercase whitespace-nowrap">
        NAME:
      </div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="ENTER TOURNAMENT DESIGNATION..."
        className="flex-1 px-3.5 py-2.5 bg-black/50 border border-[#22d3ee]/20 rounded-md text-[#22d3ee] text-[12px] font-mono tracking-[0.08em] outline-none"
      />
      <button
        onClick={handleSubmit}
        disabled={creating || !name.trim()}
        onMouseEnter={() => setHoveredBtn("deploy")}
        onMouseLeave={() => setHoveredBtn(null)}
        className={`px-6 py-2.5 rounded-md text-[10px] font-black tracking-[0.22em] font-mono transition-all duration-200 ${
          creating ? 'cursor-wait' : 'cursor-pointer'
        } ${!name.trim() ? "opacity-40" : ""} ${
          hoveredBtn === "deploy"
            ? "bg-[#22c55e]/20 border-[#22c55e]/70 text-[#22c55e]"
            : "bg-[#22c55e]/10 border-[#22c55e]/30 text-[#22c55e]/70"
        }`}
        style={{ borderWidth: "1px" }}
      >
        {creating ? "DEPLOYING..." : "▶ DEPLOY"}
      </button>
      <button
        onClick={onClose}
        className="px-3.5 py-2.5 bg-[#ef4444]/5 border border-[#ef4444]/20 rounded-md text-[#ef4444]/50 text-[10px] font-bold tracking-[0.15em] font-mono cursor-pointer transition-all duration-200 hover:bg-[#ef4444]/10 hover:text-[#ef4444]/70"
      >
        ✕
      </button>
    </div>
  );
}
