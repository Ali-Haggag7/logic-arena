"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./garage.css";
import { RobotCard } from "./components/RobotCard";
import { AuthModal } from "../../../components/AuthModal";
import { apiClient } from "../../../lib/api-client";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import {
  ROBOTS,
  GUEST_ROBOT,
  MOBILE_BREAKPOINT,
} from "./constants/robots.constants";

export default function GaragePage() {
  // Synchronous guest detection before first render — prevents race condition
  const [isGuest, setIsGuest] = useState<boolean>(
    () => typeof window !== "undefined" && !localStorage.getItem("token")
  );
  const [activeRobotId, setActiveRobotId] = useState<string | null>(null);
  const [activeColor, setActiveColor] = useState("DEFAULT");
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isMobile = useMediaQuery(MOBILE_BREAKPOINT);

  // Memoize robot list — avoids recalculating on every render
  const displayRobots = useMemo(
    () => (isGuest ? [GUEST_ROBOT] : ROBOTS),
    [isGuest]
  );

  useEffect(() => {
    if (isGuest) return;
    apiClient
      .get("/users/profile")
      .then((res) => {
        if (res.data.selectedRobotId) setActiveRobotId(res.data.selectedRobotId);
        if (res.data.selectedColor) setActiveColor(res.data.selectedColor);
      })
      .catch((err: unknown) => {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 401) {
          setIsGuest(true);
          setActiveRobotId("guest-unit");
          setActiveColor("DEFAULT");
        }
      });
  }, [isGuest]);

  const handleGuestClick = useCallback(() => setShowAuthModal(true), []);

  return (
    <>
      <div
        className={`min-h-screen bg-bg-primary font-mono text-accent/90 relative overflow-hidden ${
          isMobile ? "pb-[env(safe-area-inset-bottom)]" : ""
        }`}
      >
        {/* Cyan grid background */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(var(--accent-rgb),0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),0.07) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div
          className={`max-w-[960px] mx-auto ${
            isMobile ? "px-4 pt-6" : "px-6 pt-12"
          } pb-20 relative z-10`}
          style={{ animation: "garageFadeIn 0.35s ease" }}
        >
          {/* ── Header ── */}
          <div className={`border-b border-accent/10 ${isMobile ? "pb-4 mb-6" : "pb-6 mb-10"}`}>
            <p className="text-[9px] tracking-[0.28em] text-accent/35 mb-2 uppercase font-bold">
              // GARAGE v2.0
            </p>
            <h1
              className={`m-0 ${
                isMobile ? "text-2xl" : "text-[clamp(24px,4vw,38px)]"
              } font-black tracking-[0.18em] text-accent drop-shadow-[0_0_12px_rgba(var(--accent-rgb),0.7)] leading-tight`}
            >
              GARAGE
            </h1>
            <p
              className={`mt-2 ${
                isMobile ? "text-[9px]" : "text-[10px]"
              } text-accent/30 tracking-[0.15em] uppercase font-bold`}
            >
              SELECT A ROBOT — CUSTOMIZE YOUR LOADOUT
            </p>
          </div>

          {/* ── Robot Grid ── */}
          <div
            className={`grid grid-cols-1 ${
              isMobile ? "gap-4" : "sm:grid-cols-2 gap-6"
            }`}
          >
            {displayRobots.map((robot) => {
              const isActive = robot.id === activeRobotId;
              return (
                <div key={robot.id} className="relative">
                  {/* ACTIVE badge */}
                  {isActive && (
                    <div
                      className={`absolute ${
                        isMobile ? "-top-2 left-3" : "-top-3 left-4"
                      } z-20 flex items-center gap-1.5 ${
                        isMobile
                          ? "px-2 py-0.5 text-[8px]"
                          : "px-3 py-1 text-[9px]"
                      } font-bold tracking-[0.25em] border rounded-lg backdrop-blur-md shadow-[0_0_15px_rgba(var(--accent-rgb),0.2)]`}
                      style={{
                        background: "rgba(var(--accent-rgb),0.12)",
                        borderColor: "rgba(var(--accent-rgb),0.4)",
                        color:
                          activeColor !== "DEFAULT"
                            ? activeColor
                            : "var(--accent)",
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{
                          background:
                            activeColor !== "DEFAULT"
                              ? activeColor
                              : "var(--accent)",
                          boxShadow: `0 0 6px ${
                            activeColor !== "DEFAULT"
                              ? activeColor
                              : "var(--accent)"
                          }`,
                        }}
                      />
                      ACTIVE
                    </div>
                  )}

                  <RobotCard
                    robot={robot}
                    color={isActive ? activeColor : "DEFAULT"}
                    isMobile={isMobile}
                    isGuest={isGuest}
                    isActive={isActive}
                    onClick={isGuest ? handleGuestClick : undefined}
                  />
                </div>
              );
            })}
          </div>

          {/* ── Footer beacon ── */}
          <p
            className={`text-center ${
              isMobile ? "text-[9px]" : "text-[10px]"
            } tracking-[0.22em] text-accent/20 ${
              isMobile ? "mt-8" : "mt-10"
            } uppercase font-bold`}
            style={{ animation: "garageBeaconPulse 3s ease-in-out infinite" }}
          >
            ◈ CHOOSE YOUR ROBOT ◈
          </p>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="CHASSIS LOCKED"
        message="Robot customization is restricted for guests. Initialize a user account to unlock new chassis types, apply custom paint jobs, and upgrade your battle bot."
      />
    </>
  );
}
