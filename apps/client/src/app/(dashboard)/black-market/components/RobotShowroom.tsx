"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { GarageSkeletonLoader } from "../../garage/components/GarageSkeletonLoader";

const GarageCanvas = dynamic(
  () => import("../../garage/components/GarageCanvas").then((m) => m.GarageCanvas),
  { ssr: false, loading: () => <GarageSkeletonLoader /> },
);

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return prefersReducedMotion;
}

interface RobotShowroomProps {
  chassisId: string;
  paintColor: string;
  tracerColor: string;
  quality?: "low" | "medium" | "high";
}

export function RobotShowroom({ chassisId, paintColor, tracerColor, quality }: RobotShowroomProps) {
  const [detectedQuality, setDetectedQuality] = useState<"low" | "medium" | "high">("medium");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
      if (isMobileDevice) {
        setDetectedQuality("low");
      }
    }
  }, []);

  const activeQuality = quality ?? detectedQuality;
  const prefersReducedMotion = usePrefersReducedMotion();
  const highQuality = activeQuality === "high";
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "50px", threshold: 0 },
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const shouldAnimate = !prefersReducedMotion && isVisible;

  const dpr = useMemo<[number, number]>(() => {
    if (activeQuality === "low") return [1, 1];
    if (activeQuality === "high") return [1, 2];
    return [1, 1.5];
  }, [activeQuality]);

  return (
    <div ref={containerRef} className="w-full h-full" style={{ touchAction: "pan-y" }}>
      <GarageCanvas
        chassisId={chassisId}
        paintColor={paintColor}
        tracerColor={tracerColor}
        animate={shouldAnimate}
        dpr={dpr}
        highQuality={highQuality}
        activeQuality={activeQuality}
      />
    </div>
  );
}
