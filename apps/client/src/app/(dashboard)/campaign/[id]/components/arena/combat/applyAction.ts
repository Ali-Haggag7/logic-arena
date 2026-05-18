import { FIRE_DAMAGE, BURST_DAMAGE, BURST_SPREAD, PROJ_SPEED, PROJ_LIFE, ROBOT_SIZE } from '../constants';
import type { ArenaRobot, ArenaProjectile } from '../scenes';
import type { EvalAction } from '../miniEvaluator';

export type RuntimeArenaRobot = ArenaRobot & {
  _fireCooldown?: number;
  _lastMoveAngle?: number;
  _lastMoveValue?: number;
  _lastMoveFast?: boolean;
};

export function applyAction(
  action: EvalAction,
  robot: ArenaRobot,
  projs: ArenaProjectile[],
  nextId: { current: number },
): void {
  const runtimeRobot = robot as RuntimeArenaRobot;
  switch (action.type) {
    case 'fire': {
      if ((runtimeRobot._fireCooldown ?? 0) > 0) break;
      runtimeRobot._fireCooldown = 30;
      const a = action.value, d = robot.size * 2;
      projs.push({
        id: nextId.current++,
        x: robot.x + Math.cos(a) * d,
        y: robot.y + Math.sin(a) * d,
        vx: Math.cos(a) * PROJ_SPEED,
        vy: Math.sin(a) * PROJ_SPEED,
        color: robot.trailColor,
        ownerId: robot.id,
        life: PROJ_LIFE,
        damage: FIRE_DAMAGE,
      });
      break;
    }
    case 'burst': {
      if ((runtimeRobot._fireCooldown ?? 0) > 0) break;
      runtimeRobot._fireCooldown = 50;
      const d = robot.size * 2;
      for (let i = -1; i <= 1; i++) {
        const a = action.value + BURST_SPREAD * i;
        projs.push({
          id: nextId.current++,
          x: robot.x + Math.cos(a) * d,
          y: robot.y + Math.sin(a) * d,
          vx: Math.cos(a) * PROJ_SPEED,
          vy: Math.sin(a) * PROJ_SPEED,
          color: robot.trailColor,
          ownerId: robot.id,
          life: PROJ_LIFE,
          damage: BURST_DAMAGE,
        });
      }
      break;
    }
    case 'move': {
      const spd = action.fast ? 0.025 : 0.012;
      switch (action.value) {
        case -2:
          robot.x -= Math.cos(robot.angle) * spd;
          robot.y -= Math.sin(robot.angle) * spd;
          break;
        case -1:
          robot.x -= Math.cos(robot.angle + Math.PI / 2) * spd;
          robot.y -= Math.sin(robot.angle + Math.PI / 2) * spd;
          break;
        case 1:
          robot.x += Math.cos(robot.angle + Math.PI / 2) * spd;
          robot.y += Math.sin(robot.angle + Math.PI / 2) * spd;
          break;
        default:
          robot.x += Math.cos(robot.angle) * spd;
          robot.y += Math.sin(robot.angle) * spd;
      }
      robot.x = Math.max(ROBOT_SIZE, Math.min(1 - ROBOT_SIZE, robot.x));
      robot.y = Math.max(ROBOT_SIZE, Math.min(1 - ROBOT_SIZE, robot.y));
      break;
    }
  }
}
