import { ROBOT_SIZE } from '../constants';
import type { ArenaProjectile, ArenaRobot, ArenaObstacle } from '../scenes';

export function hitCheck(p: ArenaProjectile, robot: ArenaRobot): boolean {
  if (!robot.isAlive) return false;
  const dx = p.x - robot.x, dy = p.y - robot.y;
  return Math.sqrt(dx * dx + dy * dy) < ROBOT_SIZE * 2;
}

export function projectileHitsObstacle(p: ArenaProjectile, obs: ArenaObstacle): boolean {
  if (obs.type !== 'SOLID') return false;
  const left = obs.x - obs.w / 2;
  const right = obs.x + obs.w / 2;
  const top = obs.y - obs.h / 2;
  const bottom = obs.y + obs.h / 2;
  return p.x >= left && p.x <= right && p.y >= top && p.y <= bottom;
}
