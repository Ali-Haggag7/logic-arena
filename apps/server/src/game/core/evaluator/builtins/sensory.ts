import { Robot, Obstacle, performRaycast } from '@logic-arena/engine';
import { UNHANDLED } from './internal';

type EnemySnapshot = [number, number, number, number];

export function evaluateSensoryFunction(
  name: string,
  args: unknown[],
  robot: Robot,
  getRobots: () => Robot[],
  getObstacles: () => Obstacle[],
): unknown {
  switch (name) {
    case 'GET_ALL_VISIBLE_ENEMIES': {
      const visibleEnemies = robot.visibleEntities?.robots ?? [];
      const snapshots: EnemySnapshot[] = [];

      for (const enemy of visibleEnemies) {
        if (!enemy.isAlive) continue;
        const edx = enemy.position.x - robot.position.x;
        const edy = enemy.position.y - robot.position.y;
        const distance = Math.round(Math.hypot(edx, edy));
        snapshots.push([
          distance,
          Math.round(enemy.position.x),
          Math.round(enemy.position.y),
          Math.round(enemy.health),
        ]);
      }

      return snapshots;
    }

    case 'RAYCAST': {
      const a = args[0] as number;
      const relativeAngle = typeof a === 'number' ? a : 0;
      const absoluteDirection = robot.rotation + relativeAngle;
      const fovRange = robot.fov?.range ?? 300;

      return Math.round(
        performRaycast(
          robot.position,
          absoluteDirection,
          getObstacles(),
          getRobots(),
          robot.id,
          fovRange,
        ),
      );
    }

    default:
      return UNHANDLED;
  }
}
