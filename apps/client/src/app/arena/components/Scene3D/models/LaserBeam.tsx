"use client";
import React, { useMemo } from "react";
import * as THREE from "three";
import { LaserBeamProps } from "../../../types";

const DEFAULT_TRACER_COLOR = "#22d3ee";

export const LaserBeam = ({ start, end, color }: LaserBeamProps) => {
  const midpoint = useMemo(() => {
    return new THREE.Vector3((start[0] + end[0]) / 2, (start[1] + end[1]) / 2, (start[2] + end[2]) / 2);
  }, [start, end]);

  const direction = useMemo(() => {
    return new THREE.Vector3(end[0] - start[0], end[1] - start[1], end[2] - start[2]);
  }, [start, end]);

  const length = direction.length();
  const quaternion = useMemo(() => {
    const axis = new THREE.Vector3(0, 1, 0);
    return new THREE.Quaternion().setFromUnitVectors(axis, direction.clone().normalize());
  }, [direction]);

  // Resolve color: skip non-hex values (e.g. 'DEFAULT', 'paint-default') → use fallback
  const resolvedColor = useMemo(() => {
    if (!color || color.toUpperCase() === 'DEFAULT' || color.toLowerCase().startsWith('paint-') || color.toLowerCase().startsWith('tracer-')) {
      return DEFAULT_TRACER_COLOR;
    }
    return color;
  }, [color]);

  return (
    <mesh position={midpoint} quaternion={quaternion}>
      <cylinderGeometry args={[0.025, 0.04, length, 12]} />
      <meshStandardMaterial color={resolvedColor} emissive={resolvedColor} emissiveIntensity={8} toneMapped={false} />
    </mesh>
  );
};
