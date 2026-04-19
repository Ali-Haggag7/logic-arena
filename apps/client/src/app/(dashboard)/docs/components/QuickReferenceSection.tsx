import React from "react";
import { SectionLabel } from "./SectionLabel";
import { QUICK_REF } from "../constants/docsData";

export function QuickReferenceSection() {
  return (
    <section className="mb-[60px]">
      <SectionLabel text="QUICK_REFERENCE" />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 mt-5">
        {QUICK_REF.map((card) => (
          <div
            key={card.title}
            className="quick-card bg-card/60 rounded-xl p-6 backdrop-blur-md"
            style={{
              boxShadow: 'var(--card-shadow)',
              border: `1px solid ${card.color}22`,
            }}
          >
            {/* Card header */}
            <div
              className="flex items-center gap-2.5 mb-[18px] pb-3.5"
              style={{ borderBottom: `1px solid ${card.color}18` }}
            >
              <span
                className="text-lg"
                style={{ color: card.color, textShadow: `0 0 10px ${card.color}88` }}
              >
                {card.icon}
              </span>
              <span
                className="text-[10px] font-black tracking-[0.28em]"
                style={{ color: card.color, textShadow: `0 0 8px ${card.color}66` }}
              >
                {card.title}
              </span>
            </div>

            {/* Commands list */}
            <div className="flex flex-col gap-2">
              {card.commands.map((cmd) => (
                <div
                  key={cmd}
                  className="px-3 py-2 rounded-md text-[11px] font-semibold tracking-[0.06em] font-mono"
                  style={{
                    backgroundColor: `${card.color}08`,
                    border: `1px solid ${card.color}15`,
                    color: `${card.color}cc`,
                  }}
                >
                  {cmd}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
