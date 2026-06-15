import React from "react";
import Link from "next/link";
import { ImageCard } from "../ImageCard";
import { ROBOTS } from "./LandingConstants";

export const LandingRoster = () => {
  return (
    <section className="py-20 sm:py-28 px-4 overflow-hidden" id="robots">
      <div className="max-w-7xl mx-auto">
        <div className="section-reveal text-center mb-4">
          <h2 className="text-accent text-3xl sm:text-4xl md:text-5xl font-black tracking-[0.1em] uppercase drop-shadow-[0_0_12px_rgba(var(--accent-rgb),0.3)]">
            BUILD YOUR ROBOT
          </h2>
        </div>
        <p className="section-reveal text-text-secondary text-center text-sm sm:text-base tracking-[0.15em] uppercase mb-12 sm:mb-16">
          Choose a chassis. Paint it. Fight.
        </p>

        {/* Mobile: Horizontal carousel / Desktop: Grid */}
        <div className="block sm:hidden">
          <div className="landing-carousel px-1" role="list">
            {ROBOTS.map((bot) => (
              <div key={bot.name} className="w-[65vw] min-w-[240px]" role="listitem">
                <ImageCard
                  src={bot.img}
                  name={bot.name}
                  description={bot.desc}
                  className="aspect-square"
                />
              </div>
            ))}
          </div>
          <p className="text-text-secondary/40 text-[10px] tracking-widest text-center mt-4 uppercase" aria-hidden="true">
            ← Swipe to explore →
          </p>
        </div>

        <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {ROBOTS.map((bot) => (
            <div key={bot.name} className="section-reveal-scale">
              <ImageCard
                src={bot.img}
                name={bot.name}
                description={bot.desc}
                className="aspect-square"
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-10 section-reveal">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-accent font-black text-sm tracking-widest hover:opacity-80 transition-all uppercase group"
            id="black-market-link"
          >
            Unlock in Black Market
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
export default LandingRoster;
