import { Vector3 } from "three";

export const IS_MOBILE = typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent);

export const CRYSTAL_MAT_PROPS = {
  color: "#e0f2fe",
  emissive: "#022c4a",
  emissiveIntensity: 0.8,
  roughness: 0.1,
  metalness: 0.6,
  transparent: true,
  opacity: 0.85,
  flatShading: true,
} as const;

export const CYBER_SHIPS = [
  { startPos: [100, 100, -100] as [number, number, number], speed: 100, color: "#00ffff", axis: "z" as const },
  { startPos: [-200, 150, 100] as [number, number, number], speed: 150, color: "#ff00ff", axis: "x" as const },
  { startPos: [50, 50, 150] as [number, number, number], speed: 80, color: "#00ffff", axis: "z" as const },
  { startPos: [200, 200, 0] as [number, number, number], speed: -120, color: "#ff00ff", axis: "y" as const },
  { startPos: [-250, 150, 50] as [number, number, number], speed: 50, color: "#ffffff", axis: "x" as const }
];

export const getRandomPos = (
  minRadius: number,
  maxRadius: number,
  minY: number,
  maxY: number
): [number, number, number] => {
  const angle = Math.random() * Math.PI * 2;
  const radius = minRadius + Math.random() * (maxRadius - minRadius);
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const y = minY + Math.random() * (maxY - minY);
  return [x, y, z];
};
