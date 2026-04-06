import { Robot, Vector2 } from "./types";
import { performance } from "perf_hooks"; // Import performance for Node.js environment

// Shim for requestAnimationFrame in Node.js
const requestAnimationFrame = (callback: FrameRequestCallback) => (setTimeout(() => callback(performance.now()), 1000 / 60) as unknown) as number;
const cancelAnimationFrame = (id: number) => clearTimeout(id);

const ARENA_WIDTH = 800;
const ARENA_HEIGHT = 600;

export class GameLoop {
  private lastFrameTime: number = 0;
  private animationFrameId: number | null = null;
  private isRunning: boolean = false;
  private robots: Robot[] = [];
  private lastLogTime: number = 0;
  private readonly LOG_INTERVAL = 1000; // 1 second
  private readonly ARENA = { width: ARENA_WIDTH, height: ARENA_HEIGHT };

  constructor() {}

  addRobot(robot: Robot): void {
    this.robots.push(robot);
  }

  removeRobot(id: string): void {
    this.robots = this.robots.filter(robot => robot.id !== id);
  }

  getRobots(): Robot[] {
    return this.robots;
  }

  start(): void {
    if (this.isRunning) {
      console.warn("GameLoop is already running.");
      return;
    }
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    this.loop(this.lastFrameTime);
    console.log("GameLoop started.");
  }

  stop(): void {
    if (!this.isRunning) {
      console.warn("GameLoop is not running.");
      return;
    }
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    console.log("GameLoop stopped.");
  }

  private loop = (currentTime: number): void => {
    if (!this.isRunning) {
      return;
    }

    const deltaTime = (currentTime - this.lastFrameTime) / 1000; // Convert to seconds
    this.lastFrameTime = currentTime;

    this.update(deltaTime);
    this.render();
    this.logRobotPositions();

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  public update(deltaTime: number): Robot[] {
    this.robots.forEach(robot => {
      // Update position
      robot.position.x += robot.velocity.x * deltaTime;
      robot.position.y += robot.velocity.y * deltaTime;

      // Collision Detection with Arena Boundaries
      if (robot.position.x < 0) {
        robot.position.x = 0;
        robot.velocity.x *= -1; // Reverse X velocity
      } else if (robot.position.x > this.ARENA.width) {
        robot.position.x = this.ARENA.width;
        robot.velocity.x *= -1; // Reverse X velocity
      }

      if (robot.position.y < 0) {
        robot.position.y = 0;
        robot.velocity.y *= -1; // Reverse Y velocity
      } else if (robot.position.y > this.ARENA.height) {
        robot.position.y = this.ARENA.height;
        robot.velocity.y *= -1; // Reverse Y velocity
      }
    });
    return this.robots;
  }

  private render(): void {
    // Rendering logic here (e.g., Canvas API)
  }

  private logRobotPositions(): void {
    const currentTime = performance.now();
    if (currentTime - this.lastLogTime >= this.LOG_INTERVAL) {
      this.robots.forEach(robot => {
        console.log(`Robot ${robot.id}: Position (${robot.position.x.toFixed(2)}, ${robot.position.y.toFixed(2)})`);
      });
      this.lastLogTime = currentTime;
    }
  }
}



export type { Robot };

