import React from "react";
import LandingNavbar from "../components/Landing/LandingNavbar";
import LandingHero from "../components/Landing/LandingHero";
import LandingTrustBar from "../components/Landing/LandingTrustBar";
import LandingHowItWorks from "../components/Landing/LandingHowItWorks";
import LandingGameModes from "../components/Landing/LandingGameModes";
import LandingArenas from "../components/Landing/LandingArenas";
import LandingShowcase from "../components/Landing/LandingShowcase";
import LandingRoster from "../components/Landing/LandingRoster";
import LandingFeatures from "../components/Landing/LandingFeatures";
import LandingTechStack from "../components/Landing/LandingTechStack";
import LandingFinalCTA from "../components/Landing/LandingFinalCTA";

export default function LandingPage(): React.JSX.Element {
  return (
    <div className="min-h-dvh bg-bg-primary font-mono text-text-primary selection:bg-accent/30">
      <LandingNavbar />
      <LandingHero />
      <LandingTrustBar />
      <LandingHowItWorks />
      <div className="landing-section-divider" aria-hidden="true" />
      <LandingGameModes />
      <div className="landing-section-divider" aria-hidden="true" />
      <LandingArenas />
      <div className="landing-section-divider" aria-hidden="true" />
      <LandingShowcase />
      <div className="landing-section-divider" aria-hidden="true" />
      <LandingRoster />
      <div className="landing-section-divider" aria-hidden="true" />
      <LandingFeatures />
      <div className="landing-section-divider" aria-hidden="true" />
      <LandingTechStack />
      <div className="landing-section-divider" aria-hidden="true" />
      <LandingFinalCTA />
    </div>
  );
}
