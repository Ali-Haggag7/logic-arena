"use client";
import { Component, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, PerspectiveCamera, Html } from "@react-three/drei";
import * as THREE from "three";

type RobotModelProps = {
  position: [number, number, number];
  color: string;
  health: number;
  velocity: { x: number; y: number };
};

type RobotErrorBoundaryProps = {
  fallback: React.ReactNode;
  children: React.ReactNode;
};

type RobotErrorBoundaryState = {
  hasError: boolean;
};

class RobotErrorBoundary extends Component<RobotErrorBoundaryProps, RobotErrorBoundaryState> {
  state: RobotErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): RobotErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(): void {
    // Intentionally empty to avoid crashing render tree
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const FallbackRobot = ({ position, color }: { position: [number, number, number]; color: string }) => (
  <mesh position={position}>
    <sphereGeometry args={[0.35, 24, 24]} />
    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
  </mesh>
);

const RobotModel = ({ position, color, health, velocity }: RobotModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const basePosition = useRef(new THREE.Vector3(...position));
  const hoverOffset = useRef(Math.random() * Math.PI * 2);
  const thrusterMaterials = useRef<THREE.MeshStandardMaterial[]>([]);

  useEffect(() => {
    basePosition.current.set(position[0], position[1], position[2]);
    if (groupRef.current) {
      groupRef.current.position.set(position[0], position[1], position[2]);
    }
  }, [position]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const speed = Math.hypot(velocity.x, velocity.y);
    if (speed > 0.001) {
      const targetRotation = -Math.atan2(velocity.y, velocity.x);
      const lerpFactor = 1 - Math.pow(0.001, delta);
      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetRotation, lerpFactor);
    }

    const hover = Math.sin(state.clock.elapsedTime * 2 + hoverOffset.current) * 0.05;
    group.position.y = basePosition.current.y + hover;
    group.position.x = basePosition.current.x;
    group.position.z = basePosition.current.z;

    const flicker = 1.2 + Math.sin(state.clock.elapsedTime * 12 + hoverOffset.current) * 0.5;
    thrusterMaterials.current.forEach(material => {
      if (material) {
        material.emissiveIntensity = flicker;
      }
    });
  });

  const thrusterMaterialRef = (index: number) => (material: THREE.MeshStandardMaterial | null) => {
    if (material) {
      thrusterMaterials.current[index] = material;
    }
  };

  const bodyColor = new THREE.Color(color);
  const emissiveColor = new THREE.Color(color).multiplyScalar(1.5);

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.7, 0.4, 0.9]} />
        <meshStandardMaterial color={bodyColor} emissive={emissiveColor} emissiveIntensity={1.2} />
      </mesh>

      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial color={bodyColor} emissive={emissiveColor} emissiveIntensity={1.1} />
      </mesh>

      <mesh position={[-0.08, 0.72, 0.2]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[0.08, 0.72, 0.2]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={2.5} />
      </mesh>

      <mesh position={[-0.25, 0.05, -0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.12, 12]} />
        <meshStandardMaterial ref={thrusterMaterialRef(0)} color="#111111" emissive="#00FFFF" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0.25, 0.05, -0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.12, 12]} />
        <meshStandardMaterial ref={thrusterMaterialRef(1)} color="#111111" emissive="#00FFFF" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[-0.25, 0.05, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.12, 12]} />
        <meshStandardMaterial ref={thrusterMaterialRef(2)} color="#111111" emissive="#00FFFF" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0.25, 0.05, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.12, 12]} />
        <meshStandardMaterial ref={thrusterMaterialRef(3)} color="#111111" emissive="#00FFFF" emissiveIntensity={1.2} />
      </mesh>

      <pointLight position={[0, 0.4, 0]} intensity={1.8} distance={3} color={color} />

      <Html distanceFactor={10} position={[0, 1.0, 0]} center>
        <div style={{
          width: "40px",
          height: "5px",
          background: "rgba(0, 0, 0, 0.7)",
          border: "1px solid #444",
          borderRadius: "2px",
          overflow: "hidden"
        }}>
          <div style={{
            width: `${health}%`,
            height: "100%",
            background: health > 30 ? "#00FF00" : "#FF0000",
            transition: "width 0.2s ease-out"
          }} />
        </div>
      </Html>
    </group>
  );
};

const LaserModel = ({ position }: { position: [number, number, number] }) => (
  <mesh position={position}>
    <sphereGeometry args={[0.1, 16, 16]} />
    <meshStandardMaterial color="#FFFFFF" emissive="#00FFFF" emissiveIntensity={10} toneMapped={false} />
  </mesh>
);

const SpeechBubble = ({ position, message }: { position: [number, number, number], message: string }) => {
  return (
    <Html position={[position[0], position[1] + 1, position[2]]} center>
      <div style={{
        background: "rgba(0, 0, 0, 0.7)",
        padding: "5px 10px",
        borderRadius: "5px",
        color: "#00FF00",
        fontSize: "12px",
        whiteSpace: "nowrap",
        border: "1px solid #00FF00",
        pointerEvents: "none",
        transform: "translateY(-100%)",
      }}>
        {message}
      </div>
    </Html>
  );
};

export const Scene3D = ({
  robots,
  projectiles = [],
  firedTracer = null,
  speechBubble = null
}: {
  robots: any[],
  projectiles?: any[],
  firedTracer?: { robotId: string; targetPosition: { x: number; y: number; }; } | null,
  speechBubble?: { robotId: string; message: string; } | null
}) => {
  // Arena units based on 800x600 engine (Scale 1 unit = 40px)
  const arenaWidth = 20; // 800 / 40
  const arenaHeight = 15; // 600 / 40

  return (
    <div className="w-full h-screen bg-black">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 18, 18]} />
        <OrbitControls target={[0, 0, 0]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={2} />

        {/* Custom Grid: Scaled to match the 20x15 (800x600) Arena */}
        <gridHelper
          args={[20, 20, "#333", "#111"]}
          scale={[1, 1, 0.75]}
          position={[0, 0, 0]}
        />

        {/* Arena Floor - Matches Engine Bounds */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <planeGeometry args={[arenaWidth, arenaHeight]} />
          <meshBasicMaterial color="#0a0a0a" />
        </mesh>

        {/* Boundary Line (Neon Cyan Rectangle) */}
        <lineLoop>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attach="attributes-position"
              count={4}
              itemSize={3}
              args={[
                new Float32Array([
                  -10, 0, -7.5,
                  10, 0, -7.5,
                  10, 0, 7.5,
                  -10, 0, 7.5
                ]),
                3
              ]}
            />
          </bufferGeometry>
          <lineBasicMaterial attach="material" color="#00FFFF" linewidth={2} />
        </lineLoop>

        {/* Draw Robots */}
        {robots.map((robot: any) => {
          const robotPosition: [number, number, number] = [
            (robot.position.x / 40) - 10,
            0.15,
            (robot.position.y / 40) - 7.5
          ];

          return (
            <RobotErrorBoundary
              key={robot.id}
              fallback={<FallbackRobot position={robotPosition} color={robot.color} />}
            >
              <RobotModel
                position={robotPosition}
                color={robot.color}
                health={robot.health}
                velocity={robot.velocity ?? { x: 0, y: 0 }}
              />
            </RobotErrorBoundary>
          );
        })}

        {/* Draw Tracer Line for Fired Projectiles */}
        {firedTracer && robots.map(robot => {
          if (robot.id === firedTracer.robotId) {
            const startPos = [
              (robot.position.x / 40) - 10,
              0.375,
              (robot.position.y / 40) - 7.5
            ];
            const endPos = [
              (firedTracer.targetPosition.x / 40) - 10,
              0.375,
              (firedTracer.targetPosition.y / 40) - 7.5
            ];
            return (
              <line key={`tracer-${robot.id}`}>
                <bufferGeometry attach="geometry">
                  <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    itemSize={3}
                    args={[
                      new Float32Array([...startPos, ...endPos]),
                      3
                    ]}
                  />
                </bufferGeometry>
                <lineBasicMaterial attach="material" color="#FF00FF" linewidth={3} />
              </line>
            );
          }
          return null;
        })}

        {/* Display Speech Bubble */}
        {speechBubble && robots.map(robot => {
          if (robot.id === speechBubble.robotId) {
            const pos = [
              (robot.position.x / 40) - 10,
              0.375,
              (robot.position.y / 40) - 7.5
            ] as [number, number, number];
            return <SpeechBubble key={`bubble-${robot.id}`} position={pos} message={speechBubble.message} />;
          }
          return null;
        })}

        {/* Draw Projectiles */}
        {projectiles.map((p: any) => (
          <LaserModel
            key={p.id}
            position={[
              (p.position.x / 40) - 10,
              0.375,
              (p.position.y / 40) - 7.5
            ]}
          />
        ))}
      </Canvas>
    </div>
  );
};