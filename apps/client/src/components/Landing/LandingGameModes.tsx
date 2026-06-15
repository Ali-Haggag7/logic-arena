import React from "react";
import { ImageCard } from "../ImageCard";
import { GAME_MODES } from "./LandingConstants";

export const LandingGameModes = () => {
  return (
    <section className="py-20 sm:py-28 px-4 overflow-hidden" id="game-modes">
      <div className="max-w-7xl mx-auto">
        <div className="section-reveal text-center mb-12 sm:mb-16">
          <h2 className="text-accent text-3xl sm:text-4xl md:text-5xl font-black tracking-[0.1em] uppercase mb-4 drop-shadow-[0_0_12px_rgba(var(--accent-rgb),0.3)]">
            CHOOSE YOUR GAME MODE
          </h2>
          <p className="text-text-secondary text-sm sm:text-base tracking-[0.15em] uppercase">
            Six ways to prove your code is superior
          </p>
        </div>

        {/* Mobile: Horizontal carousel / Desktop: Grid */}
        <div className="block sm:hidden">
          <div className="landing-carousel px-1" role="list">
            {GAME_MODES.map((mode) => (
              <div key={mode.name} className="w-[75vw] min-w-[280px]" role="listitem">
                <ImageCard src={mode.img} name={mode.name} description={mode.desc} className="h-52" />
              </div>
            ))}
          </div>
          <p className="text-text-secondary/40 text-[10px] tracking-widest text-center mt-4 uppercase" aria-hidden="true">
            ← Swipe to explore →
          </p>
        </div>

        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {GAME_MODES.map((mode) => (
            <div key={mode.name} className="section-reveal-scale">
              <ImageCard src={mode.img} name={mode.name} description={mode.desc} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default LandingGameModes;
