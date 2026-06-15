import {
  ARENA_HEIGHT,
  ARENA_WIDTH,
  Obstacle,
  Robot,
  MapTheme,
} from '@logic-arena/engine';

export class MatchHazards {
  private static readonly LAVA_POOL_RADIUS = 40;
  private static readonly ICE_PATCH_RADIUS = 50;
  private static readonly EMP_STRIKE_RADIUS = 60;
  private static readonly EMP_SPAWN_INTERVAL_TICKS = 200;
  private static readonly EMP_EXPLODE_AFTER_TICKS = 20;
  private static readonly EMP_ENERGY_DAMAGE = 100;
  private static readonly LAVA_DAMAGE_PER_TICK = 1;

  constructor(
    private readonly matchId: string,
    private readonly mapTheme: MapTheme,
  ) {}

  initEnvironmentHazards(obstacles: Obstacle[]): void {
    if (this.mapTheme === 'LAVA') {
      this.spawnThemeHazards(
        obstacles,
        'LAVA_POOL',
        MatchHazards.LAVA_POOL_RADIUS,
        this.randomInt(3, 4),
      );
    } else if (this.mapTheme === 'ICE') {
      this.spawnThemeHazards(
        obstacles,
        'ICE_PATCH',
        MatchHazards.ICE_PATCH_RADIUS,
        this.randomInt(2, 3),
      );
    }
  }

  processHazards(obstacles: Obstacle[], robots: Robot[], tickCount: number): void {
    for (const robot of robots) {
      robot.insideIcePatch = false;
    }

    for (const obstacle of obstacles) {
      if (obstacle.type !== 'LAVA_POOL' && obstacle.type !== 'ICE_PATCH') {
        continue;
      }

      const radius = obstacle.width / 2;
      for (const robot of robots) {
        if (
          !robot.isAlive ||
          !this.isRobotInsideHazard(robot, obstacle, radius)
        ) {
          continue;
        }

        if (obstacle.type === 'LAVA_POOL') {
          robot.health = Math.max(
            0,
            robot.health - MatchHazards.LAVA_DAMAGE_PER_TICK,
          );
          if (robot.health === 0) robot.isAlive = false;
        } else {
          robot.insideIcePatch = true;
        }
      }
    }

    if (this.mapTheme === 'CYBER') {
      this.processCyberStorm(obstacles, robots, tickCount);
    }
  }

  private processCyberStorm(obstacles: Obstacle[], robots: Robot[], tickCount: number): void {
    if (tickCount % MatchHazards.EMP_SPAWN_INTERVAL_TICKS === 0) {
      obstacles.push(
        this.createCircularHazard(
          `emp-strike-${this.matchId}-${tickCount}`,
          'EMP_STRIKE',
          MatchHazards.EMP_STRIKE_RADIUS,
          tickCount,
        ),
      );
    }

    for (let index = obstacles.length - 1; index >= 0; index -= 1) {
      const obstacle = obstacles[index];
      if (obstacle.type !== 'EMP_STRIKE') continue;

      const createdAtTick = obstacle.createdAt ?? tickCount;
      if (
        tickCount - createdAtTick <
        MatchHazards.EMP_EXPLODE_AFTER_TICKS
      ) {
        continue;
      }

      for (const robot of robots) {
        if (
          !robot.isAlive ||
          !this.isRobotInsideHazard(
            robot,
            obstacle,
            MatchHazards.EMP_STRIKE_RADIUS,
          )
        ) {
          continue;
        }

        robot.energy = Math.max(
          0,
          (robot.energy ?? 0) - MatchHazards.EMP_ENERGY_DAMAGE,
        );
        if ((robot.energy ?? 0) <= 0) {
          robot.inStasis = true;
        }
      }
      obstacles.splice(index, 1);
    }
  }

  private spawnThemeHazards(
    obstacles: Obstacle[],
    type: 'LAVA_POOL' | 'ICE_PATCH',
    radius: number,
    count: number,
  ): void {
    for (let index = 0; index < count; index += 1) {
      obstacles.push(
        this.createCircularHazard(
          `${type.toLowerCase()}-${this.matchId}-${index}`,
          type,
          radius,
        ),
      );
    }
  }

  private createCircularHazard(
    id: string,
    type: 'LAVA_POOL' | 'ICE_PATCH' | 'EMP_STRIKE',
    radius: number,
    createdAt?: number,
  ): Obstacle {
    return {
      id,
      type,
      position: {
        x: this.randomFloat(radius, ARENA_WIDTH - radius),
        y: this.randomFloat(radius, ARENA_HEIGHT - radius),
      },
      width: radius * 2,
      height: radius * 2,
      rotation: Math.random() * Math.PI * 2,
      createdAt,
    };
  }

  private isRobotInsideHazard(
    robot: Robot,
    obstacle: Obstacle,
    radius: number,
  ): boolean {
    const dx = robot.position.x - obstacle.position.x;
    const dy = robot.position.y - obstacle.position.y;
    return dx * dx + dy * dy <= radius * radius;
  }

  private randomFloat(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(this.randomFloat(min, max + 1));
  }
}
