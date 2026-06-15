import React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { HERO_LINES, HERO_BADGES, PARTICLE_COUNT } from "./LandingConstants";

export const LandingHero = () => {
  return (
    <section
      className="relative min-h-[calc(100dvh-64px)] flex items-center justify-center py-16 sm:py-20 px-4 overflow-hidden landing-hero-gradient"
      id="hero-section"
    >
      {/* Background layers */}
      <div className="absolute inset-0 z-0 pointer-events-none landing-hero-grid" aria-hidden="true" />
      <div className="absolute inset-0 z-[1] pointer-events-none landing-hero-scanlines" aria-hidden="true" />
      <div className="absolute inset-0 z-[2] pointer-events-none landing-hero-vignette" aria-hidden="true" />

      {/* Floating particles — decorative, hidden on mobile via CSS */}
      <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden" aria-hidden="true">
        {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
          <div
            key={`particle-${i}`}
            className="landing-particle"
            style={{
              left: `${(i * 8.3) % 100}%`,
              bottom: `-${10 + (i * 7) % 20}px`,
              animationDuration: `${8 + (i * 3) % 12}s`,
              animationDelay: `${(i * 1.7) % 8}s`,
              width: `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
            }}
          />
        ))}
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
        {/* Main headline */}
        <div className="mb-6 sm:mb-8">
          {HERO_LINES.map((line, i) => (
            <span
              key={line}
              className="block hero-word text-[3.5rem] sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-[0.02em] leading-[1.05] text-text-primary"
              style={{ animationDelay: `${0.1 + i * 0.18}s` }}
            >
              {line}
            </span>
          ))}
        </div>

        {/* Subheadline with glowing keyword */}
        <p className="text-text-secondary text-sm sm:text-base md:text-lg tracking-[0.12em] uppercase mb-8 sm:mb-10 max-w-2xl font-mono leading-relaxed">
          The only arena where your{" "}
          <span className="relative inline-block text-accent font-bold">
            algorithms
            <span
              className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-accent rounded-full animate-pulse landing-hero-shadow"
              aria-hidden="true"
            />
          </span>{" "}
          fight for you.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 w-full sm:w-auto">
          <Link
            href="/dashboard"
            className="landing-cta-primary px-8 sm:px-10 h-12 sm:h-14 flex items-center justify-center rounded-lg font-black text-sm sm:text-base tracking-widest w-full sm:w-auto"
            id="hero-cta-primary"
          >
            ENTER THE ARENA
          </Link>
          <Link
            href="/replay"
            className="landing-cta-secondary px-8 sm:px-10 h-12 sm:h-14 flex items-center justify-center rounded-lg text-sm sm:text-base tracking-widest font-bold w-full sm:w-auto"
            id="hero-cta-secondary"
          >
            WATCH A BATTLE
          </Link>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {HERO_BADGES.map((pill) => (
            <span
              key={pill}
              className="glass-card text-[10px] sm:text-xs font-black tracking-widest uppercase text-text-secondary px-3 py-1.5 rounded-md"
            >
              {pill}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 hero-scroll-indicator" aria-hidden="true">
        <ChevronDown className="text-accent/40" size={28} strokeWidth={1.5} />
      </div>
    </section>
  );
};
export default LandingHero;
