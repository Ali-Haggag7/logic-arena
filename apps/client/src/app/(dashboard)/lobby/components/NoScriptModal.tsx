import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  onClose: () => void;
}

export function NoScriptModal({ onClose }: Props) {
  const router = useRouter();
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease]">
      <div className="w-full max-w-md bg-[#030712] border border-[#ef4444]/30 rounded-xl p-6 shadow-[0_0_40px_rgba(239,68,68,0.15)] flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-[#ef4444]/10 border border-[#ef4444]/40 flex items-center justify-center mb-4 text-[#ef4444] text-xl pb-1 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          !
        </div>
        <h3 className="text-[14px] font-black tracking-[0.2em] text-[#ef4444] mb-2 uppercase drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]">
          No Script Selected
        </h3>
        <p className="text-[10px] text-[#ef4444]/70 tracking-[0.14em] mb-8 leading-relaxed max-w-[85%]">
          YOU MUST EQUIP A TACTICAL SCRIPT BEFORE ENTERING COMBAT. RETURN TO HEADQUARTERS TO SELECT YOUR WEAPON.
        </p>

        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            onMouseEnter={() => setHoveredBtn("close")}
            onMouseLeave={() => setHoveredBtn(null)}
            className={`flex-1 py-3 rounded-md text-[9px] font-bold tracking-[0.2em] font-mono transition-all duration-200 border ${
              hoveredBtn === "close"
                ? "bg-white/10 text-white border-white/30"
                : "bg-white/5 text-white/50 border-white/10"
            }`}
          >
            DISMISS
          </button>
          
          <button
            onClick={() => router.push("/dashboard")}
            onMouseEnter={() => setHoveredBtn("dash")}
            onMouseLeave={() => setHoveredBtn(null)}
            className={`flex-[1.5] py-3 rounded-md text-[9px] font-black tracking-[0.2em] font-mono transition-all duration-200 border ${
              hoveredBtn === "dash"
                ? "bg-[#22d3ee]/20 text-[#22d3ee] border-[#22d3ee]/70 shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                : "bg-[#22d3ee]/10 text-[#22d3ee]/70 border-[#22d3ee]/30"
            }`}
          >
            [←] DASHBOARD
          </button>
        </div>
      </div>
    </div>
  );
}
