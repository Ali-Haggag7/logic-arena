import React from "react";
import Image from "next/image";
import Link from "next/link";

export const LandingNavbar = () => {
  return (
    <nav className="sticky top-0 z-50 border-b border-accent/10" id="landing-nav">
      <div className="absolute inset-0 bg-bg-primary/70 backdrop-blur-xl" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/dashboard-logo.webp"
            alt="Logic Arena logo"
            width={36}
            height={36}
            sizes="36px"
            priority
            className="shrink-0 transition-transform duration-300 group-hover:scale-110"
          />
          <span className="text-accent font-black text-base tracking-[0.15em] hidden sm:block">
            LOGIC ARENA
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/dashboard"
            className="landing-cta-primary px-4 sm:px-6 h-9 sm:h-10 flex items-center rounded-md font-black text-[11px] sm:text-xs tracking-widest"
            id="nav-join-btn"
          >
            JOIN AS GUEST
          </Link>
          <Link
            href="/login"
            className="landing-cta-secondary px-4 sm:px-6 h-9 sm:h-10 flex items-center rounded-md text-[11px] sm:text-xs tracking-widest font-bold"
            id="nav-signin-btn"
          >
            SIGN IN
          </Link>
        </div>
      </div>
    </nav>
  );
};
export default LandingNavbar;
