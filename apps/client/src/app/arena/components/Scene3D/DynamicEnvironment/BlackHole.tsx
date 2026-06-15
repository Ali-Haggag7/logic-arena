import React, { useRef, useMemo, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import {
  Group,
  InstancedMesh,
  Object3D,
  Vector3,
  Color,
  AdditiveBlending,
  DoubleSide,
  BufferGeometry,
  Material
} from "three";
import { AmbientSynthesizer } from "./AmbientSynthesizer";

const DISK_VERT = `
  varying vec2 vPos;
  void main() {
    vPos = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const DISK_FRAG = `
  uniform vec3 colorIn;
  uniform vec3 colorOut;
  uniform float minR;
  uniform float maxR;
  uniform float mult;
  varying vec2 vPos;
  void main() {
    float dist = length(vPos);
    float t = clamp((dist - minR) / (maxR - minR), 0.0, 1.0);
    float alpha = pow(1.0 - t, 2.0) * mult;
    vec3 color = mix(colorIn, colorOut, t);
    gl_FragColor = vec4(color, alpha);
  }
`;

interface GlowingDiskProps {
  minRadius: number;
  maxRadius: number;
  opacityMultiplier?: number;
  rot?: [number, number, number];
}

const GlowingDisk = ({ minRadius, maxRadius, opacityMultiplier = 1, rot = [0, 0, 0] }: GlowingDiskProps) => {
  const uniforms = useRef({
    colorIn: { value: new Vector3(1.0, 0.8, 0.2) }, // Golden/White core
    colorOut: { value: new Vector3(0.4, 0.0, 0.2) }, // Deep purple edge
    minR: { value: minRadius },
    maxR: { value: maxRadius },
    mult: { value: opacityMultiplier }
  });

  return (
    <mesh rotation={rot}>
      <ringGeometry args={[minRadius, maxRadius, 64]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        side={DoubleSide}
        uniforms={uniforms.current}
        vertexShader={DISK_VERT}
        fragmentShader={DISK_FRAG}
      />
    </mesh>
  );
};

interface BlackHoleProps {
  position: [number, number, number];
  scale?: number;
}

export const BlackHole = ({ position, scale = 1 }: BlackHoleProps) => {
  const ringsRef = useRef<Group>(null);
  const count = 60;
  const debrisMeshRef = useRef<InstancedMesh>(null);
  const _dummy = useMemo(() => new Object3D(), []);

  const debrisData = useMemo(() => [...Array(count)].map(() => ({
    pos: new Vector3(
      (Math.random() - 0.5) * 150,
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 150
    ),
    resetPos: new Vector3(
      (Math.random() - 0.5) * 150,
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 150
    ),
    color: new Color(Math.random() > 0.5 ? "#ff8800" : "#ff00ff"),
    scale: 0.5 + Math.random() * 1.5
  })), []);

  useLayoutEffect(() => {
    if (!debrisMeshRef.current) return;
    debrisData.forEach((d, i) => debrisMeshRef.current!.setColorAt(i, d.color));
    debrisMeshRef.current.instanceColor!.needsUpdate = true;
  }, [debrisData]);

  useFrame((_, delta) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.z -= delta * 0.2;
    }
    
    if (debrisMeshRef.current) {
      debrisMeshRef.current.rotation.y -= delta * 0.2;
      
      debrisData.forEach((d, i) => {
        const distSq = d.pos.lengthSq();
        if (distSq < 225) {
          d.pos.copy(d.resetPos);
        } else {
          const dist = Math.sqrt(distSq);
          const speed = 250 / (dist + 1);
          d.pos.multiplyScalar(1 - delta * speed * 0.01);
          
          const s = Math.max(0.01, dist / 150) * d.scale;
          _dummy.position.copy(d.pos);
          _dummy.scale.setScalar(s);
          _dummy.updateMatrix();
          debrisMeshRef.current!.setMatrixAt(i, _dummy.matrix);
        }
      });
      debrisMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Event Horizon (Pure Black Sphere) */}
      <mesh renderOrder={0}>
        <sphereGeometry args={[15, 16, 16]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Gravitational Lensing Halo (Billboarded to frame the black hole from any camera angle) */}
      <Billboard>
        <GlowingDisk minRadius={15} maxRadius={35} opacityMultiplier={0.8} />
      </Billboard>

      {/* Main Equatorial Accretion Disk (Slightly tilted) */}
      <group ref={ringsRef} rotation={[0.2, 0, -0.1]}>
        {/* Core Volumetric Blazing Rings */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[16.5, 1.5, 16, 100]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} blending={AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[19, 2.5, 16, 100]} />
          <meshBasicMaterial color="#ffaa00" transparent opacity={0.4} blending={AdditiveBlending} depthWrite={false} />
        </mesh>
        {/* Smooth Extended Gradient Disk */}
        <GlowingDisk minRadius={15.5} maxRadius={65} opacityMultiplier={1.0} rot={[-Math.PI / 2, 0, 0]} />
      </group>

      {/* Matter/Debris getting sucked in */}
      <instancedMesh ref={debrisMeshRef} args={[undefined as unknown as BufferGeometry, undefined as unknown as Material, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial transparent opacity={0.8} blending={AdditiveBlending} depthWrite={false} />
      </instancedMesh>
    </group>
  );
};
export default BlackHole;
