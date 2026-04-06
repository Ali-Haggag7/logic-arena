"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, PerspectiveCamera, Html } from "@react-three/drei";

const RobotModel = ({ position, color, health }: { position: [number, number, number], color: string, health: number }) => (
    <mesh position={position}>
        {/* Radius 0.375 matches a 15px radius in engine (15 / 40) */}
        <sphereGeometry args={[0.375, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />

        <Html distanceFactor={10} position={[0, 0.8, 0]} center>
            <div style={{
                width: '40px',
                height: '5px',
                background: 'rgba(0, 0, 0, 0.7)',
                border: '1px solid #444',
                borderRadius: '2px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${health}%`,
                    height: '100%',
                    background: health > 30 ? '#00FF00' : '#FF0000',
                    transition: 'width 0.2s ease-out'
                }} />
            </div>
        </Html>
    </mesh>
);

const LaserModel = ({ position }: { position: [number, number, number] }) => (
    <mesh position={position}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#00FFFF" emissiveIntensity={10} toneMapped={false} />
    </mesh>
);

export const Scene3D = ({ robots, projectiles = [] }: { robots: any[], projectiles?: any[] }) => {
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
                    <planeGeometry args={[20, 15]} />
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
                                3 // itemSize must be the second argument
                            ]}
                        />
                    </bufferGeometry>
                    <lineBasicMaterial attach="material" color="#00FFFF" linewidth={2} />
                </lineLoop>

                {/* Draw Robots */}
                {robots.map((robot: any) => (
                    <RobotModel
                        key={robot.id}
                        position={[
                            (robot.position.x / 40) - 10,
                            0.375,
                            (robot.position.y / 40) - 7.5
                        ]}
                        color={robot.color}
                        health={robot.health}
                    />
                ))}

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