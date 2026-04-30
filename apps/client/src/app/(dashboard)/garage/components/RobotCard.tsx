"use client";

import React, { Suspense, useRef, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock } from "lucide-react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import { useTheme } from "next-themes";
import { useRobotColorTint } from "../hooks/useRobotColorTint";
import { ROBOTS, type RobotConfig } from "../constants/robots.constants";

/* ─── Preload all GLBs at module level ──────────────────────────────── */
ROBOTS.forEach((r) => useGLTF.preload(r.file));

/* ─── GLTF model — shared tint hook + hover-gated auto-rotate ───────── */
function GLTFModel({
  file,
  color,
  scale,
  onLoad,
  isHoveredRef,
}: {
  file: string;
  color: string;
  scale?: number;
  onLoad?: () => void;
  isHoveredRef: React.MutableRefObject<boolean>;
}) {
  const { scene } = useGLTF(file);
  const clonedScene = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const groupRef = useRef<THREE.Group>(null!);
  const { invalidate } = useThree();

  // Shared hook handles tinting + disposal
  useRobotColorTint(clonedScene as unknown as THREE.Group, color);

  // Signal the canvas to re-render when color changes
  useEffect(() => {
    invalidate();
  }, [color, invalidate]);

  // Fires once on mount — stable because onLoad is wrapped in useCallback upstream
  useEffect(() => {
    onLoad?.();
  }, [onLoad]);

  // Auto-rotate only while hovered — calls invalidate() to sustain the loop
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    if (isHoveredRef.current) {
      groupRef.current.rotation.y += delta * 0.6;
      state.invalidate();
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} scale={scale ?? 1.2} position={[0, -1, 0]} />
    </group>
  );
}

/* ─── Loading fallback ───────────────────────────────────────────────── */
function CanvasFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <span className="text-accent/50 text-[10px] tracking-[0.25em] font-mono animate-pulse uppercase">
        LOADING MODEL...
      </span>
    </div>
  );
}

/* ─── RobotCard ──────────────────────────────────────────────────────── */
interface RobotCardProps {
  robot: RobotConfig;
  color?: string;
  isMobile: boolean;
  isGuest?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

export function RobotCard({
  robot,
  color = "DEFAULT",
  isMobile,
  isGuest = false,
  isActive = false,
  onClick,
}: RobotCardProps) {
  const router = useRouter();
  const { theme } = useTheme();

  const isHoveredRef = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [resolvedAccent, setResolvedAccent] = useState("#22d3ee");

  // Resolve --accent CSS variable for WebGL lighting (theme-aware)
  useEffect(() => {
    const val = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim();
    if (val) setResolvedAccent(val);
  }, [theme]);

  const handleLoad = useCallback(() => setIsLoaded(true), []);

  const handleClick = useCallback(() => {
    if (onClick) onClick();
    else router.push(`/garage/${robot.id}`);
  }, [onClick, router, robot.id]);

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
  }, []);
  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
  }, []);

  // Light + footer color — resolved accent when DEFAULT, saved color otherwise
  const lightColor = color === "DEFAULT" ? resolvedAccent : color;

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={isGuest}
      aria-label={`Select ${robot.name}`}
      className={[
        "group relative flex flex-col rounded-xl overflow-hidden border transition-all duration-300",
        "backdrop-blur-sm text-left w-full active:scale-[0.98]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
        isGuest
          ? "border-accent/5 bg-accent/[0.02] cursor-not-allowed opacity-75"
          : isActive
          ? "border-accent/40 bg-card/70 shadow-[0_8px_32px_rgba(var(--accent-rgb),0.18)]"
          : "border-accent/10 bg-card/60 hover:border-accent/35 hover:shadow-[0_8px_32px_rgba(var(--accent-rgb),0.12)] cursor-pointer",
      ].join(" ")}
      style={{ animation: "cardReveal 0.35s ease" }}
    >
      {/* Active left stripe */}
      {isActive && (
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] z-20 pointer-events-none"
          style={{ background: lightColor }}
        />
      )}

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(var(--accent-rgb),0.4) 0px, rgba(var(--accent-rgb),0.4) 1px, transparent 1px, transparent 4px)",
        }}
      />

      {/* Corner accents */}
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-accent/50 rounded-tr-sm z-20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent/50 rounded-br-sm z-20 pointer-events-none" />

      {/* 3D Canvas */}
      <div
        className={`w-full ${
          isMobile ? "h-[240px]" : "h-[300px]"
        } bg-gradient-to-b from-bg-secondary/40 to-transparent relative`}
      >
        {!isLoaded && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            <CanvasFallback />
          </div>
        )}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <Canvas
            camera={{ position: [0, 1.5, 4], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
            frameloop="demand"
          >
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={1.5}
              color={lightColor}
            />
            <directionalLight position={[-5, 2, -5]} intensity={0.4} />
            <pointLight
              position={[0, -2, 0]}
              intensity={1}
              color={lightColor}
              distance={5}
            />
            <Suspense fallback={null}>
              <GLTFModel
                file={robot.file}
                color={color}
                scale={isMobile ? robot.cardScale * 0.9 : robot.cardScale}
                onLoad={handleLoad}
                isHoveredRef={isHoveredRef}
              />
              <Environment preset="night" />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* Card footer */}
      <div
        className={`px-5 ${
          isMobile ? "py-3" : "py-4"
        } border-t border-accent/10 flex items-center justify-between bg-bg-primary/50 backdrop-blur-md`}
      >
        <div>
          <p className="text-[8px] tracking-[0.28em] text-accent/30 mb-0.5 uppercase font-bold">
            // ROBOT_{robot.id.toUpperCase()}
          </p>
          <h2
            className={`${
              isMobile ? "text-base" : "text-[18px]"
            } font-black tracking-[0.18em] m-0 uppercase`}
            style={{
              color: lightColor,
              textShadow: `0 0 8px ${lightColor}90`,
            }}
          >
            {robot.name}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {isGuest ? (
            <Lock
              className="w-3.5 h-3.5 text-accent/30"
              aria-hidden="true"
            />
          ) : (
            <>
              <span
                className={`${
                  isMobile ? "text-[8px]" : "text-[10px]"
                } tracking-[0.2em] text-accent/60 group-hover:text-accent font-black transition-colors duration-200 uppercase`}
              >
                CUSTOMIZE
              </span>
              <ArrowRight
                className="w-3.5 h-3.5 text-accent/30 group-hover:translate-x-1 transition-transform duration-200"
                aria-hidden="true"
              />
            </>
          )}
        </div>
      </div>
    </button>
  );
}
