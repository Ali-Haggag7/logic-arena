import React from "react";
import { HOW_IT_WORKS_STEPS } from "./LandingConstants";

export const LandingHowItWorks = () => {
  return (
    <section className="py-20 sm:py-28 px-4 max-w-7xl mx-auto" id="how-it-works">
      <div className="section-reveal text-center mb-16 sm:mb-20">
        <h2 className="text-accent text-3xl sm:text-4xl md:text-5xl font-black tracking-[0.1em] uppercase mb-4 drop-shadow-[0_0_12px_rgba(var(--accent-rgb),0.3)]">
          HOW IT WORKS
        </h2>
        <p className="text-text-secondary text-sm sm:text-base tracking-[0.15em] uppercase">
          Three steps to domination
        </p>
      </div>

      {/* Desktop: Timeline layout / Mobile: Stacked cards */}
      <div className="relative">
        {/* Timeline connector — desktop only */}
        <div className="hidden md:block landing-timeline-line" aria-hidden="true" />

        <div className="flex flex-col gap-8 sm:gap-12 md:gap-16">
          {HOW_IT_WORKS_STEPS.map(({ step, title, icon: Icon, desc }, i) => (
            <div
              key={step}
              className={`section-reveal flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-10 ${
                i % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Step content card */}
              <div className={`flex-1 w-full order-2 md:order-none ${i % 2 === 1 ? "md:text-right" : "md:text-left"}`}>
                <div className="glass-card-strong rounded-xl p-6 sm:p-8">
                  <div className={`flex items-center gap-3 mb-3 ${i % 2 === 1 ? "md:justify-end" : ""}`}>
                    <Icon className="text-accent" size={20} />
                    <h3 className="text-accent font-black text-lg sm:text-xl tracking-[0.15em] uppercase">
                      {title}
                    </h3>
                  </div>
                  <p className="text-text-secondary text-sm sm:text-base leading-relaxed">{desc}</p>
                </div>
              </div>

              {/* Center dot */}
              <div className="landing-timeline-dot order-1 md:order-none" aria-hidden="true">
                {step}
              </div>

              {/* Spacer for opposite side */}
              <div className="flex-1 hidden md:block" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default LandingHowItWorks;
