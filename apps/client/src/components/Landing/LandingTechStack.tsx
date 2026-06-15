import React from "react";
import Image from "next/image";
import { TECH_STACK } from "./LandingConstants";

export const LandingTechStack = () => {
  return (
    <section className="py-16 sm:py-20 px-4" id="tech-stack">
      <div className="max-w-5xl mx-auto">
        <div className="section-reveal text-center mb-10 sm:mb-12">
          <p className="text-text-secondary/60 text-[10px] sm:text-xs font-black tracking-[0.3em] uppercase mb-3">
            ENGINEERED WITH
          </p>
          <h2 className="text-text-primary text-xl sm:text-2xl md:text-3xl font-black tracking-[0.08em] uppercase">
            BATTLE-TESTED TECHNOLOGY
          </h2>
        </div>

        {/* Mobile: Horizontal carousel / Desktop: Grid */}
        <div className="block sm:hidden">
          <div className="landing-carousel px-1 justify-start" role="list">
            {TECH_STACK.map((tech, i) => (
              <div
                key={tech.name}
                className="glass-card rounded-xl px-6 py-5 flex flex-col items-center justify-center gap-3 min-w-[120px]"
                role="listitem"
                style={{ animationDelay: `${i * 0.5}s` }}
              >
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <div 
                    className="absolute inset-0 opacity-20 blur-md rounded-full" 
                    style={{ background: tech.color }} 
                    aria-hidden="true" 
                  />
                  <Image 
                    src={tech.icon} 
                    alt={tech.name} 
                    width={28} 
                    height={28} 
                    className="object-contain relative z-10 drop-shadow-md" 
                  />
                </div>
                <span className="text-text-primary font-black text-[11px] tracking-widest uppercase whitespace-nowrap">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden sm:grid grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
          {TECH_STACK.map((tech, i) => (
            <div
              key={tech.name}
              className="landing-tech-logo glass-card rounded-xl px-4 py-5 sm:py-6 flex flex-col items-center justify-center gap-3 cursor-default outline-none"
              style={{ animationDelay: `${i * 0.5}s` }}
              tabIndex={0}
            >
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div 
                  className="absolute inset-0 opacity-20 blur-lg rounded-full" 
                  style={{ background: tech.color }} 
                  aria-hidden="true" 
                />
                <Image 
                  src={tech.icon} 
                  alt={tech.name} 
                  width={32} 
                  height={32} 
                  className="object-contain relative z-10 drop-shadow-md" 
                />
              </div>
              <span className="text-text-primary font-black text-[10px] sm:text-[11px] tracking-widest uppercase text-center">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default LandingTechStack;
