import {
  Robot,
  Vector2,
  Projectile,
  Obstacle,
  GameState,
  ObstacleType,
} from './types';
import { performance } from 'node:perf_hooks';

const requestAnimationFrame = (callback: FrameRequestCallback) =>
  (setTimeout(() => callback(performance.now()), 1000 / 60) as unknown) as number;
const cancelAnimationFrame = (id: number) => clearTimeout(id);

const ARENA_WIDTH = 800;
const ARENA_HEIGHT = 600;
const ROBOT_RADIUS = 15;

const DEFAULT_OBSTACLES: Obstacle[] = [
  // Center cross walls
  { id: 'wall-1', type: 'WALL', position: { x: 400, y: 200 }, width: 80, height: 25, rotation: 0 },
  { id: 'wall-2', type: 'WALL', position: { x: 400, y: 400 }, width: 80, height: 25, rotation: 0 },
  { id: 'wall-3', type: 'WALL', position: { x: 250, y: 300 }, width: 25, height: 80, rotation: 0 },
  { id: 'wall-4', type: 'WALL', position: { x: 550, y: 300 }, width: 25, height: 80, rotation: 0 },

  // Traps near center
  { id: 'trap-1', type: 'TRAP', position: { x: 200, y: 150 }, width: 40, height: 40, rotation: 0.3 },
  { id: 'trap-2', type: 'TRAP', position: { x: 600, y: 450 }, width: 40, height: 40, rotation: -0.3 },

  // Slow zones at corridors
  { id: 'slow-1', type: 'SLOW', position: { x: 150, y: 400 }, width: 60, height: 35, rotation: 0.15 },
  { id: 'slow-2', type: 'SLOW', position: { x: 650, y: 200 }, width: 60, height: 35, rotation: -0.15 },

  // Bouncers in corners
  { id: 'bounce-1', type: 'BOUNCER', position: { x: 120, y: 120 }, width: 35, height: 35, rotation: 0.785 },
  { id: 'bounce-2', type: 'BOUNCER', position: { x: 680, y: 480 }, width: 35, height: 35, rotation: 0.785 },
];

export class GameLoop {
  private lastFrameTime: number = 0;
  private animationFrameId: number | null = null;
  private isRunning: boolean = false;
  private robots: Robot[] = [];
  private projectiles: Projectile[] = [];
  private obstacles: Obstacle[] = [];
  private readonly ARENA = { width: ARENA_WIDTH, height: ARENA_HEIGHT };

  constructor() {
    this.obstacles = DEFAULT_OBSTACLES;
  }

  addRobot(robot: Robot): void {
    this.robots.push(robot);
  }

  getRobots(): Robot[] {
    return this.robots;
  }

  getProjectiles(): Projectile[] {
    return this.projectiles;
  }

  getObstacles(): Obstacle[] {
    return this.obstacles;
  }

  getGameState(): GameState {
    return {
      robots: this.robots,
      projectiles: this.projectiles,
      obstacles: this.obstacles,
    };
  }

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    this.loop(this.lastFrameTime);
  }

  private loop = (currentTime: number): void => {
    if (!this.isRunning) return;

    const deltaTime = (currentTime - this.lastFrameTime) / 1000;
    this.lastFrameTime = currentTime;

    this.update(deltaTime);
    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  public update(deltaTime: number): void {
    const now = Date.now();

    // 1. Update Projectiles & Check Robot Hits
    this.projectiles = this.projectiles.filter(p => {
      p.position.x += p.velocity.x * deltaTime;
      p.position.y += p.velocity.y * deltaTime;

      let hasHit = false;

      for (const robot of this.robots) {
        if (robot.id !== p.ownerId && robot.isAlive) {
          const dx = p.position.x - robot.position.x;
          const dy = p.position.y - robot.position.y;
          const distance = Math.hypot(dx, dy);

          if (distance < ROBOT_RADIUS) {
            robot.health = Math.max(0, robot.health - 10);
            if (robot.health === 0) robot.isAlive = false;
            hasHit = true;
            break;
          }
        }
      }

      const isOutOfBounds =
        p.position.x < 0 ||
        p.position.x > this.ARENA.width ||
        p.position.y < 0 ||
        p.position.y > this.ARENA.height;

      return !hasHit && !isOutOfBounds;
    });

    // 2. Update Robots
    this.robots.forEach(robot => {
      if (!robot.isAlive) {
        robot.velocity = { x: 0, y: 0 };
        return;
      }

      // Handle status effects
      if (robot.trappedUntil && now < robot.trappedUntil) {
        robot.velocity = { x: 0, y: 0 };
        return; // Skip movement
      } else if (robot.trappedUntil) {
        robot.trappedUntil = undefined;
      }

      let speedMultiplier = 1.0;
      if (robot.slowedUntil && now < robot.slowedUntil) {
        speedMultiplier = robot.speedMultiplier ?? 0.4;
      } else if (robot.slowedUntil) {
        robot.slowedUntil = undefined;
        robot.speedMultiplier = undefined;
      }

      // Update position
      robot.position.x += robot.velocity.x * speedMultiplier * deltaTime;
      robot.position.y += robot.velocity.y * speedMultiplier * deltaTime;

      // Boundary Collisions
      if (robot.position.x < ROBOT_RADIUS) {
        robot.position.x = ROBOT_RADIUS;
        robot.velocity.x *= -1;
      } else if (robot.position.x > this.ARENA.width - ROBOT_RADIUS) {
        robot.position.x = this.ARENA.width - ROBOT_RADIUS;
        robot.velocity.x *= -1;
      }

      if (robot.position.y < ROBOT_RADIUS) {
        robot.position.y = ROBOT_RADIUS;
        robot.velocity.y *= -1;
      } else if (robot.position.y > this.ARENA.height - ROBOT_RADIUS) {
        robot.position.y = this.ARENA.height - ROBOT_RADIUS;
        robot.velocity.y *= -1;
      }

      // Obstacle Collisions
      this.checkObstacleCollisions(robot);

      const speed = Math.hypot(robot.velocity.x, robot.velocity.y);
      if (speed > 0.001) {
        robot.rotation = Math.atan2(robot.velocity.y, robot.velocity.x);
      }
    });

    // 3. Robot vs Robot Collision
    for (let i = 0; i < this.robots.length; i++) {
      for (let j = i + 1; j < this.robots.length; j++) {
        const r1 = this.robots[i];
        const r2 = this.robots[j];

        if (!r1.isAlive || !r2.isAlive) continue;

        const dx = r2.position.x - r1.position.x;
        const dy = r2.position.y - r1.position.y;
        const distance = Math.hypot(dx, dy);

        if (distance < ROBOT_RADIUS * 2) {
          // Simple elastic collision
          const tempVx = r1.velocity.x;
          const tempVy = r1.velocity.y;
          r1.velocity.x = r2.velocity.x;
          r1.velocity.y = r2.velocity.y;
          r2.velocity.x = tempVx;
          r2.velocity.y = tempVy;

          // Resolve overlap
          const overlap = ROBOT_RADIUS * 2 - distance + 1;
          const angle = Math.atan2(dy, dx);
          r1.position.x -= (overlap / 2) * Math.cos(angle);
          r1.position.y -= (overlap / 2) * Math.sin(angle);
          r2.position.x += (overlap / 2) * Math.cos(angle);
          r2.position.y += (overlap / 2) * Math.sin(angle);
        }
      }
    }
  }

  private checkObstacleCollisions(robot: Robot): void {
    const now = Date.now();
    for (const obstacle of this.obstacles) {
      const closestX = Math.max(
        obstacle.position.x - obstacle.width / 2,
        Math.min(robot.position.x, obstacle.position.x + obstacle.width / 2)
      );
      const closestY = Math.max(
        obstacle.position.y - obstacle.height / 2,
        Math.min(robot.position.y, obstacle.position.y + obstacle.height / 2)
      );

      const dx = robot.position.x - closestX;
      const dy = robot.position.y - closestY;
      const distance = Math.hypot(dx, dy);

      if (distance < ROBOT_RADIUS) {
        // Collision detected, first push robot out
        const overlap = ROBOT_RADIUS - distance;
        const angle = Math.atan2(dy, dx);
        robot.position.x += overlap * Math.cos(angle);
        robot.position.y += overlap * Math.sin(angle);

        // Apply obstacle-specific effects
        switch (obstacle.type) {
          case 'WALL':
            // Reflect velocity based on which side was hit
            if (Math.abs(dx) > Math.abs(dy)) {
              robot.velocity.x *= -1;
            } else {
              robot.velocity.y *= -1;
            }
            break;
          case 'TRAP':
            robot.health = Math.max(0, robot.health - 10);
            if (robot.health === 0) robot.isAlive = false;
            robot.trappedUntil = now + 5000; // 5 seconds
            robot.velocity = { x: 0, y: 0 };
            break;
          case 'SLOW':
            robot.slowedUntil = now + 3000; // 3 seconds
            robot.speedMultiplier = 0.4;
            break;
          case 'BOUNCER':
            if (Math.abs(dx) > Math.abs(dy)) {
              robot.velocity.x *= -1.8;
              robot.velocity.y *= 1.8;
            } else {
              robot.velocity.x *= 1.8;
              robot.velocity.y *= -1.8;
            }
            break;
        }
      }
    }
  }

  spawnProjectile(ownerId: string, pos: Vector2, targetPos: Vector2): void {
    const robot = this.robots.find(r => r.id === ownerId);
    if (!robot) return;

    const angle = Math.atan2(targetPos.y - pos.y, targetPos.x - pos.x);
    const speed = 400;
    const spawnDistance = ROBOT_RADIUS + 5;

    this.projectiles.push({
      id: Math.random().toString(36).substr(2, 9),
      ownerId,
      team: robot.team,
      position: {
        x: pos.x + Math.cos(angle) * spawnDistance,
        y: pos.y + Math.sin(angle) * spawnDistance,
      },
      velocity: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
    });
  }
}

export type { Robot, Projectile, Obstacle, GameState, ObstacleType, Vector2 };