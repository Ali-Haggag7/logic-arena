"use client";

import React, { Suspense, useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "next-themes";

/* ─── Spinning robot model ─────────────────────────────────────── */
function RobotModel({ file, color }: { file: string; color: string }) {
  const { scene } = useGLTF(file);
  const groupRef = useRef<THREE.Group>(null!);

  // Apply tint colour to all meshes
  React.useEffect(() => {
    const col = new THREE.Color(color);
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
        mat.color = col;
        mesh.material = mat;
      }
    });
  }, [scene, color]);

  // Auto-rotate
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.6;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={1.2} position={[0, -1, 0]} />
    </group>
  );
}

/* ─── Loading fallback ──────────────────────────────────────────── */
function CanvasFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <span className="text-accent/50 text-[10px] tracking-[0.25em] animate-pulse">
        LOADING_MODEL...
      </span>
    </div>
  );
}

/* ─── RobotCard ─────────────────────────────────────────────────── */
interface RobotCardProps {
  robotId: string;
  name: string;
  file: string;
  color?: string;
}

export function RobotCard({ robotId, name, file, color }: RobotCardProps) {
  const router = useRouter();
  const { theme } = useTheme();
  
  // Resolve theme accent color for lighting
  const [resolvedAccent, setResolvedAccent] = useState("var(--accent)");
  useEffect(() => {
    const computed = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
    if (computed) setResolvedAccent(computed);
  }, [theme]);

  const effColor = color || resolvedAccent;

  return (
    <button
      onClick={() => router.push(`/garage/${robotId}`)}
      className="group relative flex flex-col rounded-xl overflow-hidden border border-accent/10 bg-card/80 hover:border-accent/40 transition-all duration-300 hover:shadow-[0_0_32px_rgba(var(--accent-rgb),0.12)] cursor-pointer text-left w-full"
      style={{ animation: "fadeIn 0.35s ease" }}
    >
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(var(--accent-rgb),0.4) 0px, rgba(var(--accent-rgb),0.4) 1px, transparent 1px, transparent 4px)",
        }}
      />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent/60 rounded-tl-sm z-20" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-accent/60 rounded-tr-sm z-20" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-accent/60 rounded-bl-sm z-20" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent/60 rounded-br-sm z-20" />

      {/* 3D Canvas */}
      <div className="w-full h-[320px] bg-bg-secondary/40">
        <Canvas
          camera={{ position: [0, 1.5, 4], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} color={resolvedAccent} />
          <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#a855f7" />
          <pointLight position={[0, -2, 0]} intensity={0.8} color={resolvedAccent} distance={6} />
          <Suspense fallback={<CanvasFallback />}>
            <RobotModel file={file} color={effColor} />
            <Environment preset="night" />
          </Suspense>
        </Canvas>
      </div>

      {/* Card footer */}
      <div className="px-5 py-4 border-t border-accent/10 flex items-center justify-between bg-bg-primary">
        <div>
          <p className="text-[8px] tracking-[0.28em] text-accent/35 mb-0.5 uppercase">
            // UNIT_FILE
          </p>
          <h2 className="text-[18px] font-black tracking-[0.18em] text-accent drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.6)] m-0">
            {name}
          </h2>
        </div>
        <span className="text-[10px] tracking-[0.2em] text-accent/40 group-hover:text-accent/80 transition-colors duration-200">
          INSPECT →
        </span>
      </div>
    </button>
  );
}
