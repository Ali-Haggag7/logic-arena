"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FALLBACK_COLOR } from "../constants/robots.constants";

/**
 * Applies a hex color tint to all meshes in a GLTF scene.
 * - Snapshots original materials on first call.
 * - Restores originals when color is "DEFAULT".
 * - Clones materials per color change and disposes the clone on cleanup,
 *   preventing the material-leak bug that occurred on every picker click.
 */
export function useRobotColorTint(
  scene: THREE.Group | null | undefined,
  color: string
): void {
  const originalMaterials = useRef(
    new Map<string, THREE.Material | THREE.Material[]>()
  );

  useEffect(() => {
    if (!scene) return;

    // Snapshot originals once per scene instance
    if (originalMaterials.current.size === 0) {
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          originalMaterials.current.set(mesh.uuid, mesh.material);
        }
      });
    }

    const cloned: THREE.Material[] = [];

    if (!color || color.trim().toUpperCase() === "DEFAULT") {
      // Restore original materials
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          const orig = originalMaterials.current.get(mesh.uuid);
          if (orig !== undefined) mesh.material = orig;
        }
      });
    } else {
      let col: THREE.Color;
      try {
        col = new THREE.Color(color.trim());
      } catch {
        col = new THREE.Color(FALLBACK_COLOR);
      }

      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          const orig = originalMaterials.current.get(mesh.uuid);
          if (orig !== undefined) {
            const mat = (orig as THREE.MeshStandardMaterial).clone();
            mat.color = col;
            cloned.push(mat);
            mesh.material = mat;
          }
        }
      });
    }

    // Dispose clones when color changes or component unmounts
    return () => {
      cloned.forEach((mat) => mat.dispose());
    };
  }, [scene, color]);
}
