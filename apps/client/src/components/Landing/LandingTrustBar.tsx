import React from "react";
import { TRUST_STATS } from "./LandingConstants";

export const LandingTrustBar = () => {
  return (
    <section className="relative border-y border-accent/10 overflow-hidden" id="trust-bar">
      <div className="absolute inset-0 bg-bg-secondary/80 backdrop-blur-sm" />
      <div className="relative max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0">
          {TRUST_STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center relative"
            >
              {i > 0 && (
                <div
                  className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 h-8 w-px bg-accent/20"
                  aria-hidden="true"
                />
              )}
              <span className="text-accent font-black text-2xl sm:text-3xl md:text-4xl tracking-tight leading-none mb-1">
                {stat.value}
              </span>
              <span className="text-text-secondary font-bold text-[9px] sm:text-[10px] md:text-xs tracking-[0.2em] uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default LandingTrustBar;
