import React from "react";
import { SectionLabel } from "./SectionLabel";
import { TACTICS_DATA } from "../constants/docsData";

export function BattleTacticsSection({ onLoadScript }: { onLoadScript: (code: string) => void }) {
  return (
    <section className="mb-[60px]">
      <SectionLabel text="BATTLE_TACTICS_MASTERCLASS" />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5 mt-5">
        {TACTICS_DATA.map((tactic) => (
          <div
            key={tactic.title}
            className="bg-[#0a0c14]/80 rounded-xl p-6 relative overflow-hidden"
            style={{ border: `1px solid ${tactic.color}33` }}
          >
            <div className="text-[11px] font-black tracking-[0.2em] mb-2" style={{ color: tactic.color }}>
              {tactic.title}
            </div>
            <div className="text-[10px] text-[#22d3ee]/50 mb-4 leading-relaxed">
              {tactic.desc}
            </div>
            <div className="bg-black/50 p-4 rounded-lg font-mono text-[10px] text-[#22d3ee] leading-relaxed whitespace-pre-wrap border border-[#22d3ee]/10">
              {tactic.code}
            </div>
            <button
              onClick={() => onLoadScript(tactic.code)}
              className="mt-4 w-full p-2 bg-transparent text-[9px] font-bold cursor-pointer rounded transition-all hover:bg-white/5"
              style={{
                border: `1px solid ${tactic.color}44`,
                color: tactic.color,
              }}
            >
              LOAD INTO PLAYGROUND
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
