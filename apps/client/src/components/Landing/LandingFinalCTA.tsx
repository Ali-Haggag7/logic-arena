import React from "react";
import Link from "next/link";

export const LandingFinalCTA = () => {
  return (
    <section className="relative py-24 sm:py-32 md:py-40 px-4 overflow-hidden" id="final-cta">
      {/* Radial spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(var(--accent-rgb), 0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="section-reveal">
          <h2 className="text-accent text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[0.04em] uppercase mb-6 sm:mb-8 leading-[1.1] drop-shadow-[0_0_30px_rgba(var(--accent-rgb),0.4)]">
            YOUR LOGIC IS A WEAPON.
          </h2>
        </div>

        <p className="section-reveal text-text-secondary text-sm sm:text-base md:text-lg tracking-[0.15em] uppercase mb-10 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
          Join as a guest or sign in to climb the leaderboard.
        </p>

        <div className="section-reveal flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 w-full sm:w-auto">
          <Link
            href="/dashboard"
            className="landing-cta-primary px-8 sm:px-10 h-13 sm:h-14 flex items-center justify-center rounded-lg font-black text-sm sm:text-base tracking-widest w-full sm:w-auto"
            id="final-cta-primary"
          >
            ENTER THE ARENA
          </Link>
          <Link
            href="/register"
            className="landing-cta-secondary px-8 sm:px-10 h-13 sm:h-14 flex items-center justify-center rounded-lg text-sm sm:text-base tracking-widest font-bold w-full sm:w-auto"
            id="final-cta-secondary"
          >
            CREATE ACCOUNT
          </Link>
        </div>

        <p className="section-reveal text-text-secondary/50 text-xs tracking-widest">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline transition-colors" id="final-signin-link">
            Sign in →
          </Link>
        </p>
      </div>
    </section>
  );
};
export default LandingFinalCTA;
