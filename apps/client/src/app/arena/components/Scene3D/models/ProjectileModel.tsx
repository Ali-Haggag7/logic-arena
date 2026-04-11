"use client";
import React, { useRef, useEffect, memo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { LaserModelProps } from "../../../types";

export const LaserModel = memo(({ position }: LaserModelProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const targetPos = useRef(new THREE.Vector3(...position));
    const currentPos = useRef(new THREE.Vector3(...position));

    useEffect(() => {
        targetPos.current.set(position[0], position[1], position[2]);
    }, [position]);

    useFrame((_, delta) => {
        if (!meshRef.current) return;
        // Fast lerp for projectiles — they move quick so lerpFactor is high
        const lerpFactor = 1 - Math.pow(0.001, delta * 20);
        currentPos.current.lerp(targetPos.current, lerpFactor);
        meshRef.current.position.copy(currentPos.current);
    });

    return (
        <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial
                color="#FFFFFF"
                emissive="#00FFFF"
                emissiveIntensity={10}
                toneMapped={false}
            />
        </mesh>
    );
});
LaserModel.displayName = "LaserModel";