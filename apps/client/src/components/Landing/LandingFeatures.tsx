import React from "react";
import { PLATFORM_FEATURES } from "./LandingConstants";

export const LandingFeatures = () => {
  return (
    <section className="py-20 sm:py-28 px-4" id="features">
      <div className="max-w-7xl mx-auto">
        <div className="section-reveal text-center mb-12 sm:mb-16">
          <h2 className="text-accent text-3xl sm:text-4xl md:text-5xl font-black tracking-[0.1em] uppercase mb-4 drop-shadow-[0_0_12px_rgba(var(--accent-rgb),0.3)]">
            EVERYTHING A COMPETITIVE
            <br className="hidden sm:block" />
            {" "}PLATFORM NEEDS
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {PLATFORM_FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="landing-feature-card glass-card rounded-xl p-4 sm:p-6 section-reveal-scale"
            >
              <div className="mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Icon className="text-accent" size={20} />
                </div>
              </div>
              <h3 className="text-text-primary font-black text-xs sm:text-sm tracking-widest uppercase mb-1 sm:mb-2">
                {title}
              </h3>
              <p className="text-text-secondary text-[10px] sm:text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default LandingFeatures;
