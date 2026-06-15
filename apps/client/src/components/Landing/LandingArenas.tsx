import React from "react";
import { ImageCard } from "../ImageCard";
import { ARENAS } from "./LandingConstants";

export const LandingArenas = () => {
  return (
    <section className="py-20 sm:py-28 px-4 overflow-hidden" id="arenas">
      <div className="max-w-7xl mx-auto">
        <div className="section-reveal text-center mb-12 sm:mb-16">
          <h2 className="text-accent text-3xl sm:text-4xl md:text-5xl font-black tracking-[0.1em] uppercase mb-4 drop-shadow-[0_0_12px_rgba(var(--accent-rgb),0.3)]">
            SELECT YOUR ARENA
          </h2>
          <p className="text-text-secondary text-sm sm:text-base tracking-[0.15em] uppercase">
            Each environment changes the rules of engagement
          </p>
        </div>

        {/* Mobile: Horizontal carousel / Desktop: Grid */}
        <div className="block sm:hidden">
          <div className="landing-carousel px-1" role="list">
            {ARENAS.map((env) => (
              <div key={env.name} className="w-[80vw] min-w-[300px]" role="listitem">
                <ImageCard src={env.img} name={env.name} description={env.desc} className="h-56" />
              </div>
            ))}
          </div>
          <p className="text-text-secondary/40 text-[10px] tracking-widest text-center mt-4 uppercase" aria-hidden="true">
            ← Swipe to explore →
          </p>
        </div>

        <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARENAS.map((env) => (
            <div key={env.name} className="section-reveal-scale">
              <ImageCard
                src={env.img}
                name={env.name}
                description={env.desc}
                className="h-56"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default LandingArenas;
