import React, { useRef, useMemo, useCallback, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles, Clouds, Cloud } from "@react-three/drei";
import {
  Group,
  Mesh,
  InstancedMesh,
  Vector3,
  Quaternion,
  Color,
  Euler,
  BufferGeometry,
  Material,
  MeshBasicMaterial
} from "three";
import { IS_MOBILE, getRandomPos } from "./constants";
import { AmbientSynthesizer } from "./AmbientSynthesizer";

const UP = new Vector3(0, 1, 0);

interface LavaMeteorProps {
  startPos: [number, number, number];
  speed: number;
  dir: [number, number, number];
}

const LavaMeteor = ({ startPos, speed, dir }: LavaMeteorProps) => {
  const groupRef = useRef<Group>(null);

  const { velocity, quaternion } = useMemo(() => {
    const d = new Vector3(...dir).normalize();
    const q = new Quaternion().setFromUnitVectors(UP, d);
    const v = d.multiplyScalar(speed);
    return { velocity: v, quaternion: q };
  }, [dir[0], dir[1], dir[2], speed]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.position.x += velocity.x * delta;
      groupRef.current.position.y += velocity.y * delta;
      groupRef.current.position.z += velocity.z * delta;
      if (groupRef.current.position.lengthSq() > 250000) {
        groupRef.current.position.set(...startPos);
      }
    }
  });

  return (
    <group ref={groupRef} position={startPos} quaternion={quaternion}>
      <AmbientSynthesizer type="meteor" maxDistance={150} maxVol={0.35} />
      <mesh>
        <dodecahedronGeometry args={[3, 1]} />
        <meshStandardMaterial color="#ff2200" emissive="#ff3300" emissiveIntensity={2} flatShading />
      </mesh>
      <mesh position={[0, -4, 0]}>
        <coneGeometry args={[2.5, 12, 8]} />
        <meshBasicMaterial color="#ff5500" transparent opacity={0.6} />
      </mesh>
    </group>
  );
};

interface LavaEnvironmentProps {
  isHighQuality: boolean;
}

export const LavaEnvironment = ({ isHighQuality }: LavaEnvironmentProps) => {
  const rocksRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const deadStarRef = useRef<Mesh>(null);
  const localCamRef = useRef(new Vector3());

  useFrame((_, delta) => {
    if (rocksRef.current) {
      rocksRef.current.rotation.y += delta * 0.005;
      rocksRef.current.rotation.z -= delta * 0.002;
    }
    if (coreRef.current) coreRef.current.rotation.z -= delta * 0.02;
    if (deadStarRef.current) deadStarRef.current.rotation.x += delta * 0.01;
  });

  const cloudData = useMemo(() => [...Array(12)].map((_, i) => ({
    pos: getRandomPos(100, 250, 40, 120),
    color: i % 3 === 0 ? "#ff2200" : (i % 3 === 1 ? "#440000" : "#220000"),
    seed: i
  })), []);

  const rockCount = 40;
  const rockMeshRef = useRef<InstancedMesh>(null);
  const _rockDummy = useMemo(() => new Mesh(), []);

  const rockData = useMemo(() => [...Array(rockCount)].map(() => {
    const s = 2 + Math.random() * 20;
    return {
      pos: new Vector3(...getRandomPos(100, 350, -50, 100)),
      scale: new Vector3(s, s, s),
      rot: new Quaternion().setFromEuler(new Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI))
    };
  }), []);

  useLayoutEffect(() => {
    if (!rockMeshRef.current) return;
    rockData.forEach((d, i) => {
      _rockDummy.position.copy(d.pos);
      _rockDummy.quaternion.copy(d.rot);
      _rockDummy.scale.copy(d.scale);
      _rockDummy.updateMatrix();
      rockMeshRef.current!.setMatrixAt(i, _rockDummy.matrix);
    });
    rockMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [rockData, _rockDummy]);

  const getRockDist = useCallback((camPos: Vector3) => {
    if (!rocksRef.current) return Infinity;
    const localCam = localCamRef.current.copy(camPos);
    rocksRef.current.worldToLocal(localCam);
    let minD = Infinity;
    for (let i = 0; i < rockData.length; i++) {
      const d = localCam.distanceTo(rockData[i].pos);
      if (d < minD) minD = d;
    }
    return minD;
  }, [rockData]);

  return (
    <>
      <Sparkles count={IS_MOBILE ? 80 : (isHighQuality ? 500 : 150)} scale={[80, 20, 80]} position={[0, 10, 0]} size={6} speed={1.5} opacity={1} color="#ff5500" />
      
      {isHighQuality && (
        <group>
          <AmbientSynthesizer type="lava" position={[-200, 80, -200]} maxDistance={450} />
          {/* Main Magma Core (Sun) in the distance */}
          <mesh ref={coreRef} position={[-200, 80, -200]}>
            <sphereGeometry args={[90, 32, 32]} />
            <meshStandardMaterial color="#ff1100" emissive="#ff4400" emissiveIntensity={2} wireframe />
          </mesh>

          {/* Directional light acting as the sun's illumination (no decay over distance) */}
          <directionalLight position={[-200, 80, -200]} intensity={3} color="#ff4400" />

          {/* Secondary dead star on the other side */}
          <mesh ref={deadStarRef} position={[250, 40, 150]}>
            <AmbientSynthesizer type="moon" position={[250, 40, 150]} maxDistance={250} />
            <sphereGeometry args={[50, 16, 16]} />
            <meshStandardMaterial color="#220000" emissive="#440000" emissiveIntensity={0.5} wireframe />
          </mesh>

          {/* 360 Clouds of Ash */}
          <Clouds material={MeshBasicMaterial} limit={40}>
            {cloudData.map((data, i) => (
              <Cloud key={i} position={data.pos} speed={0.3} opacity={0.3} bounds={[100, 40, 100]} color={data.color} seed={data.seed} />
            ))}
          </Clouds>

          {/* Meteors falling from everywhere */}
          <LavaMeteor startPos={[150, 250, -100]} speed={60} dir={[-1, -1, 0]} />
          <LavaMeteor startPos={[-100, 200, 150]} speed={80} dir={[1, -1.5, -0.5]} />
          <LavaMeteor startPos={[200, 300, 200]} speed={90} dir={[-1.5, -2, -1]} />
          <LavaMeteor startPos={[-250, 220, -200]} speed={70} dir={[2, -1, 1]} />
          <LavaMeteor startPos={[50, 280, 300]} speed={100} dir={[0, -2, -1]} />

          {/* 360 massive asteroid belt with varied sizes */}
          <group ref={rocksRef}>
            <AmbientSynthesizer type="asteroid" distanceFunc={getRockDist} maxDistance={120} />
            <instancedMesh ref={rockMeshRef} args={[undefined as unknown as BufferGeometry, undefined as unknown as Material, rockCount]}>
              <dodecahedronGeometry args={[1, 1]} />
              <meshStandardMaterial color="#330000" emissive="#220000" emissiveIntensity={0.5} roughness={0.9} flatShading />
            </instancedMesh>
          </group>
        </group>
      )}
    </>
  );
};
export default LavaEnvironment;
