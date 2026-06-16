"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { Box3, Group, Vector3 } from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import { useRobotColorTint } from "../hooks/useRobotColorTint";

const CHASSIS_MODEL_PATHS: Record<string, string> = {
  "chassis-unit-01": "/robots/robot.glb",
  "chassis-unit-02": "/robots/robot2.glb",
  "chassis-titan": "/robots/armored-robot.glb",
  "chassis-sandman": "/robots/sandman.glb",
  "chassis-iron-mecha": "/robots/mecha.glb",
  "chassis-sentinel": "/robots/npc-robot.glb",
  "chassis-crimson-titan": "/robots/red_mecha.glb",
};

interface RobotMeshProps {
  chassisId: string;
  paintColor: string;
  tracerColor: string;
  animate: boolean;
}

function RobotMesh({ chassisId, paintColor, tracerColor, animate }: RobotMeshProps) {
  const groupRef = useRef<Group>(null);
  const modelPath = CHASSIS_MODEL_PATHS[chassisId];
  const activeGLTF = useGLTF(modelPath ?? "/robots/robot.glb");
  const activeScene = modelPath ? activeGLTF.scene : null;

  const clonedScene = useMemo(() => {
    if (!activeScene) return null;
    return SkeletonUtils.clone(activeScene);
  }, [activeScene]);

  useRobotColorTint(clonedScene as unknown as Group, paintColor);

  useFrame((_, delta) => {
    if (!animate) return;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  const TARGET_MODEL_HEIGHT = 2.0;
  const { modelScale, modelOffsetY } = useMemo(() => {
    if (!clonedScene) return { modelScale: 1.5, modelOffsetY: -0.85 };
    const box = new Box3().setFromObject(clonedScene);
    const size = new Vector3();
    box.getSize(size);
    const center = new Vector3();
    box.getCenter(center);
    if (size.y === 0) return { modelScale: 1.5, modelOffsetY: -0.85 };
    const scale = TARGET_MODEL_HEIGHT / size.y;
    const offsetY = -center.y * scale;
    return { modelScale: scale, modelOffsetY: offsetY };
  }, [clonedScene]);

  const PRIMITIVE_DEFAULT_COLOR = "#888888";
  const safePaintColor = paintColor === "DEFAULT" ? PRIMITIVE_DEFAULT_COLOR : paintColor;
  const isTitanPrimitive = chassisId.includes("titan") && !clonedScene;
  const isWraithPrimitive = chassisId.includes("wraith") && !clonedScene;

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      {clonedScene ? (
        <primitive
          object={clonedScene}
          position={[0, modelOffsetY, 0]}
          scale={modelScale}
        />
      ) : (
        <>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={isTitanPrimitive ? [1.3, 0.8, 0.75] : isWraithPrimitive ? [0.9, 0.6, 0.55] : [1.1, 0.7, 0.65]} />
            <meshStandardMaterial
              color={safePaintColor}
              metalness={0.85}
              roughness={0.15}
              emissive={safePaintColor}
              emissiveIntensity={0.25}
            />
          </mesh>

          {!isWraithPrimitive && (
            <>
              <mesh position={isTitanPrimitive ? [-0.85, 0.15, 0] : [-0.72, 0.12, 0]} castShadow>
                <boxGeometry args={isTitanPrimitive ? [0.35, 0.5, 0.6] : [0.28, 0.42, 0.55]} />
                <meshStandardMaterial color={safePaintColor} metalness={0.9} roughness={0.1} emissive={safePaintColor} emissiveIntensity={0.15} />
              </mesh>
              <mesh position={isTitanPrimitive ? [0.85, 0.15, 0] : [0.72, 0.12, 0]} castShadow>
                <boxGeometry args={isTitanPrimitive ? [0.35, 0.5, 0.6] : [0.28, 0.42, 0.55]} />
                <meshStandardMaterial color={safePaintColor} metalness={0.9} roughness={0.1} emissive={safePaintColor} emissiveIntensity={0.15} />
              </mesh>
            </>
          )}
          {isTitanPrimitive && (
            <>
              <mesh position={[-1.0, 0.05, 0]} castShadow>
                <boxGeometry args={[0.2, 0.4, 0.5]} />
                <meshStandardMaterial color={paintColor} metalness={0.9} roughness={0.1} emissive={paintColor} emissiveIntensity={0.15} />
              </mesh>
              <mesh position={[1.0, 0.05, 0]} castShadow>
                <boxGeometry args={[0.2, 0.4, 0.5]} />
                <meshStandardMaterial color={paintColor} metalness={0.9} roughness={0.1} emissive={paintColor} emissiveIntensity={0.15} />
              </mesh>
            </>
          )}

          <mesh position={isTitanPrimitive ? [0, 0.72, 0] : isWraithPrimitive ? [0, 0.55, 0.05] : [0, 0.62, 0]} castShadow>
            <boxGeometry args={isTitanPrimitive ? [0.65, 0.5, 0.55] : isWraithPrimitive ? [0.45, 0.35, 0.6] : [0.55, 0.45, 0.5]} />
            <meshStandardMaterial color={paintColor} metalness={0.8} roughness={0.2} emissive={paintColor} emissiveIntensity={0.2} />
          </mesh>

          <mesh position={isTitanPrimitive ? [0, 0.73, 0.29] : isWraithPrimitive ? [0, 0.56, 0.36] : [0, 0.63, 0.27]}>
            <boxGeometry args={isTitanPrimitive ? [0.45, 0.12, 0.02] : isWraithPrimitive ? [0.3, 0.06, 0.02] : [0.38, 0.1, 0.02]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive={paintColor}
              emissiveIntensity={3.5}
              toneMapped={false}
            />
          </mesh>

          <mesh position={isTitanPrimitive ? [0, 0.45, 0.4] : isWraithPrimitive ? [0, 0.32, 0.3] : [0, 0.38, 0.36]} castShadow>
            <cylinderGeometry args={isTitanPrimitive ? [0.18, 0.22, 0.2] : isWraithPrimitive ? [0.1, 0.14, 0.15] : [0.14, 0.18, 0.18, 8]} />
            <meshStandardMaterial color={paintColor} metalness={0.95} roughness={0.05} emissive={paintColor} emissiveIntensity={0.3} />
          </mesh>

          <mesh position={isTitanPrimitive ? [0, 0.45, 0.75] : isWraithPrimitive ? [0, 0.32, 0.6] : [0, 0.38, 0.7]} castShadow rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={isTitanPrimitive ? [0.07, 0.09, 0.85, 8] : isWraithPrimitive ? [0.04, 0.05, 0.6, 8] : [0.055, 0.07, 0.72, 8]} />
            <meshStandardMaterial color={paintColor} metalness={1} roughness={0.05} emissive={paintColor} emissiveIntensity={0.5} />
          </mesh>

          <mesh position={isTitanPrimitive ? [-0.35, -0.6, 0] : isWraithPrimitive ? [-0.2, -0.45, 0] : [-0.27, -0.52, 0]} castShadow>
            <boxGeometry args={isTitanPrimitive ? [0.35, 0.55, 0.45] : isWraithPrimitive ? [0.2, 0.35, 0.3] : [0.28, 0.45, 0.38]} />
            <meshStandardMaterial color={paintColor} metalness={0.8} roughness={0.2} emissive={paintColor} emissiveIntensity={0.1} />
          </mesh>
          <mesh position={isTitanPrimitive ? [0.35, -0.6, 0] : isWraithPrimitive ? [0.2, -0.45, 0] : [0.27, -0.52, 0]} castShadow>
            <boxGeometry args={isTitanPrimitive ? [0.35, 0.55, 0.45] : isWraithPrimitive ? [0.2, 0.35, 0.3] : [0.28, 0.45, 0.38]} />
            <meshStandardMaterial color={paintColor} metalness={0.8} roughness={0.2} emissive={paintColor} emissiveIntensity={0.1} />
          </mesh>

          <mesh position={isTitanPrimitive ? [-0.35, -0.92, 0.08] : isWraithPrimitive ? [-0.2, -0.67, 0.05] : [-0.27, -0.79, 0.06]} castShadow>
            <boxGeometry args={isTitanPrimitive ? [0.42, 0.18, 0.6] : isWraithPrimitive ? [0.25, 0.1, 0.4] : [0.33, 0.14, 0.5]} />
            <meshStandardMaterial color={paintColor} metalness={0.9} roughness={0.1} emissive={paintColor} emissiveIntensity={0.08} />
          </mesh>
          <mesh position={isTitanPrimitive ? [0.35, -0.92, 0.08] : isWraithPrimitive ? [0.2, -0.67, 0.05] : [0.27, -0.79, 0.06]} castShadow>
            <boxGeometry args={isTitanPrimitive ? [0.42, 0.18, 0.6] : isWraithPrimitive ? [0.25, 0.1, 0.4] : [0.33, 0.14, 0.5]} />
            <meshStandardMaterial color={paintColor} metalness={0.9} roughness={0.1} emissive={paintColor} emissiveIntensity={0.08} />
          </mesh>
        </>
      )}

      <mesh position={[0, 0.38, 1.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 1.2, 8]} />
        <meshStandardMaterial color={tracerColor} emissive={tracerColor} emissiveIntensity={4.0} toneMapped={false} />
      </mesh>
    </group>
  );
}

interface SceneLightsProps {
  color: string;
  highQuality: boolean;
}

function SceneLights({ color, highQuality }: SceneLightsProps) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 5, 3]} intensity={highQuality ? 1.2 : 0.9} />
      <pointLight position={[0, 1.5, 2]} color={color} intensity={2.5} distance={6} />
      {highQuality && <pointLight position={[-2, 0, -1]} color={color} intensity={1.0} distance={5} />}
    </>
  );
}

interface GarageCanvasProps {
  chassisId: string;
  paintColor: string;
  tracerColor: string;
  animate: boolean;
  dpr: [number, number];
  highQuality: boolean;
  activeQuality: string;
}

export function GarageCanvas({ chassisId, paintColor, tracerColor, animate, dpr, highQuality, activeQuality }: GarageCanvasProps) {
  const [readyToRender, setReadyToRender] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReadyToRender(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <Canvas
      frameloop={animate ? "always" : "demand"}
      dpr={dpr}
      gl={{ antialias: activeQuality !== "low", alpha: true, powerPreference: activeQuality === "low" ? "low-power" : "high-performance" }}
      camera={{ position: [0, 0.8, 3.8], fov: 45 }}
      style={{ background: "transparent" }}
    >
      <SceneLights color={paintColor} highQuality={highQuality} />

      <Suspense fallback={null}>
        {activeQuality !== "low" && <Environment preset="city" />}
        {readyToRender && (
          <RobotMesh chassisId={chassisId} paintColor={paintColor} tracerColor={tracerColor} animate={animate} />
        )}
      </Suspense>

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={0.5}
        maxDistance={10.0}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 1.5}
        panSpeed={1.2}
        enableDamping={true}
        dampingFactor={0.05}
        autoRotate={false}
      />
    </Canvas>
  );
}
