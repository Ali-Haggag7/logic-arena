"use client";

import React, { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import { motion } from "framer-motion";

interface RobotState {
  id: string;
  position: { x: number; y: number };
  color: string;
}

const Arena: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [robots, setRobots] = useState<RobotState[]>([]);

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("connect", () => console.log("✅ Socket Connected!"));

    socket.on("gameState", (newRobots: RobotState[]) => {
      setRobots([...newRobots]);
    });

    return () => { socket.disconnect(); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    let animationFrameId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      robots.forEach((robot) => {
        if (robot.position) {
          ctx.beginPath();
          ctx.arc(robot.position.x, robot.position.y, 15, 0, Math.PI * 2);
          ctx.fillStyle = robot.color;
          ctx.shadowColor = robot.color;
          ctx.shadowBlur = 20;
          ctx.fill();
          ctx.closePath();
        }
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateSize);
    };
  }, [robots]);

  return (
    <div className="w-full h-full bg-black overflow-hidden flex items-center justify-center">
      <canvas ref={canvasRef} className="block shadow-[0_0_50px_rgba(0,163,255,0.2)]" />
    </div>
  );
};

export default Arena;