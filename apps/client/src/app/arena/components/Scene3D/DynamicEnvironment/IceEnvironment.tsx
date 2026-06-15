import React, { useRef, useMemo, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles, Clouds, Cloud, Instances, Instance } from "@react-three/drei";
import {
  Group,
  Mesh,
  Vector3,
  Euler,
  DoubleSide,
  AdditiveBlending,
  MeshBasicMaterial
} from "three";
import { IS_MOBILE, CRYSTAL_MAT_PROPS, getRandomPos } from "./constants";
import { AmbientSynthesizer } from "./AmbientSynthesizer";

interface IceEnvironmentProps {
  isHighQuality: boolean;
}

export const IceEnvironment = ({ isHighQuality }: IceEnvironmentProps) => {
  const crystalsRef = useRef<Group>(null);
  const auroraRef = useRef<Group>(null);
  const localCamRef = useRef(new Vector3());
  const tempPosRef = useRef(new Vector3());

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const halfT = t * 0.5;
    if (crystalsRef.current) {
      crystalsRef.current.rotation.y -= delta * 0.002;
      crystalsRef.current.position.y = Math.sin(halfT) * 10;
    }
    if (auroraRef.current) {
      auroraRef.current.rotation.y += delta * 0.005;
      auroraRef.current.rotation.x = Math.sin(halfT) * 0.075;
      auroraRef.current.position.y = 100 + Math.sin(t / 3) * 15 + Math.sin(halfT) * 4;
    }
  });

  const cloudData = useMemo(() => [...Array(14)].map((_, i) => ({
    pos: getRandomPos(80, 250, -30, 0),
    color: i % 2 === 0 ? "#ffffff" : "#aaddff",
    seed: i
  })), []);

  const crystalData = useMemo(() => [...Array(35)].map(() => ({
    pos: getRandomPos(100, 300, -20, 100),
    scale: 1 + Math.random() * 4,
    rot: new Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
  })), []);

  const getCrystalDist = useCallback((camPos: Vector3) => {
    if (!crystalsRef.current) return Infinity;
    const localCam = localCamRef.current.copy(camPos);
    crystalsRef.current.worldToLocal(localCam);
    let minD = Infinity;
    for (let i = 0; i < crystalData.length; i++) {
      const p = crystalData[i].pos;
      const target = tempPosRef.current.set(p[0], p[1], p[2]);
      const d = localCam.distanceTo(target);
      if (d < minD) minD = d;
    }
    return minD;
  }, [crystalData]);

  return (
    <>
      <Sparkles count={IS_MOBILE ? 80 : (isHighQuality ? 800 : 200)} scale={[120, 30, 120]} position={[0, 15, 0]} size={4} speed={0.5} opacity={0.8} color="#ffffff" />
      
      {isHighQuality && (
        <group>
          <AmbientSynthesizer type="crystal" position={[180, 150, -200]} maxDistance={200} />
          {/* A cool directional light specifically for the ice crystals to glint */}
          <directionalLight position={[100, 150, -100]} intensity={2} color="#aaddff" />
          
          {/* Moons scattered 360 */}
          <mesh position={[180, 150, -200]}>
            <AmbientSynthesizer type="moon" position={[180, 150, -200]} maxDistance={250} />
            <sphereGeometry args={[60, 32, 32]} />
            <meshStandardMaterial color="#ffffff" emissive="#002244" emissiveIntensity={0.5} roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh position={[-200, 100, 150]}>
            <AmbientSynthesizer type="moon" position={[-200, 100, 150]} maxDistance={200} />
            <sphereGeometry args={[25, 32, 32]} />
            <meshStandardMaterial color="#aaddff" emissive="#001133" emissiveIntensity={0.8} roughness={0.1} metalness={0.9} />
          </mesh>
          <mesh position={[50, 200, 250]}>
            <AmbientSynthesizer type="moon" position={[50, 200, 250]} maxDistance={150} />
            <sphereGeometry args={[15, 16, 16]} />
            <meshStandardMaterial color="#ffffff" emissive="#0044aa" emissiveIntensity={0.4} roughness={0.5} />
          </mesh>

          {/* Massive enveloping Aurora Borealis */}
          <group ref={auroraRef}>
            <mesh position={[0, -20, 0]} rotation={[Math.PI / 1.9, -0.1, 0.1]}>
              <torusGeometry args={[280, 40, 8, 48]} />
              <meshBasicMaterial color="#00ccff" transparent opacity={0.08} blending={AdditiveBlending} depthWrite={false} side={DoubleSide} />
            </mesh>
          </group>

          {/* 360 Ground Mist Clouds */}
          <Clouds material={MeshBasicMaterial} limit={40}>
            {cloudData.map((data, i) => (
              <Cloud key={i} position={data.pos} speed={0.1} opacity={0.15} bounds={[100, 20, 100]} color={data.color} seed={data.seed} />
            ))}
          </Clouds>

          {/* 360 Luxurious Crystal Clusters */}
          <group ref={crystalsRef}>
            <AmbientSynthesizer type="crystal" distanceFunc={getCrystalDist} maxDistance={55} maxVol={0.12} />
            <Instances limit={105} range={105}>
              <dodecahedronGeometry args={[1, 0]} />
              <meshStandardMaterial {...CRYSTAL_MAT_PROPS} />
              {crystalData.map((data, i) => (
                <group key={`cgroup-${i}`} position={data.pos} rotation={data.rot} scale={data.scale}>
                  <Instance scale={[1 * 2, 2.5 * 2, 1 * 2]} />
                  <Instance position={[1.5, -1, 0]} rotation={[0, 0, Math.PI / 6]} scale={[0.8 * 1.5, 2 * 1.5, 0.8 * 1.5]} color="#bae6fd" />
                  <Instance position={[-1.2, 1, 1]} rotation={[Math.PI / 8, 0, -Math.PI / 6]} scale={[0.6 * 1.2, 1.5 * 1.2, 0.6 * 1.2]} color="#ffffff" />
                </group>
              ))}
            </Instances>
          </group>
        </group>
      )}
    </>
  );
};
export default IceEnvironment;
