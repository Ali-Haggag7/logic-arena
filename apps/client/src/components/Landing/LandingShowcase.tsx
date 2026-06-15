import React from "react";
import { ALISCRIPT_FEATURES } from "./LandingConstants";
import { HIGHLIGHTED_EXAMPLE } from "./LandingHighlight";

export const LandingShowcase = () => {
  return (
    <section className="py-20 sm:py-28 px-4 overflow-hidden" id="aliscript">
      <div className="max-w-7xl mx-auto">
        <div className="section-reveal text-center mb-4">
          <h2 className="text-accent text-3xl sm:text-4xl md:text-5xl font-black tracking-[0.1em] uppercase drop-shadow-[0_0_12px_rgba(var(--accent-rgb),0.3)]">
            POWERED BY ALISCRIPT
          </h2>
        </div>
        <p className="section-reveal text-text-secondary text-center text-sm sm:text-base tracking-[0.15em] uppercase mb-12 sm:mb-16">
          A Turing-complete scripting language built for robot combat
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Features grid */}
          <div className="section-reveal-left">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {ALISCRIPT_FEATURES.map((feature, i) => (
                <div
                  key={feature}
                  className="glass-card rounded-lg px-4 py-3 sm:py-4 text-accent font-black text-[11px] sm:text-sm tracking-widest flex items-center gap-2"
                >
                  <span className="text-accent/40 text-[10px] font-mono" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {feature}
                </div>
              ))}
            </div>

            {/* AliScript badges */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-6">
              {["v2.4", "2,000 ops/tick quota", "Big O enforced"].map((badge) => (
                <span
                  key={badge}
                  className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-text-secondary border border-accent/20 px-3 py-1.5 rounded-md"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Code terminal */}
          <div className="section-reveal-right">
            <div className="landing-terminal glass-card-strong rounded-xl">
              {/* Terminal header */}
              <div className="landing-terminal-header">
                <div className="landing-terminal-dot" style={{ background: "#ff5f57" }} aria-hidden="true" />
                <div className="landing-terminal-dot" style={{ background: "#febc2e" }} aria-hidden="true" />
                <div className="landing-terminal-dot" style={{ background: "#28c840" }} aria-hidden="true" />
                <span className="ml-3 text-text-secondary/60 text-xs tracking-widest font-mono">
                  swarm_logic.ali
                </span>
              </div>

              {/* Code content */}
              <div className="relative p-4 sm:p-5">
                <div className="landing-terminal-scan" aria-hidden="true" />
                <pre className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-mono">
                  <code dangerouslySetInnerHTML={HIGHLIGHTED_EXAMPLE} />
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default LandingShowcase;
