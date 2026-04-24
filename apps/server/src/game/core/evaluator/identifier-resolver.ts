import { Robot } from '@logic-arena/engine';
import { Identifier, NumberLiteral, StringLiteral, NodeType } from '../../../../../../packages/logic-parser/src';

export function resolveIdentifier(
  robot: Robot,
  node: Identifier | NumberLiteral | StringLiteral,
  memory: Record<string, unknown>,
): unknown {
  if (node.type === NodeType.NumberLiteral || node.type === NodeType.StringLiteral) {
    return node.value;
  }

  const name = (node as Identifier).value;

  // 1. User-defined variable (SET x = ...) takes highest priority
  if (name in memory) return memory[name];

  // 2. Built-in read-only identifiers
  const maxEnergy = robot.maxEnergy ?? 1000;
  const energy = robot.energy ?? maxEnergy;

  // --- Energy / Stasis identifiers ---
  switch (name) {
    case 'MY_ENERGY': return energy;
    case 'ENERGY_PCT': return Math.round((energy / maxEnergy) * 100);
    case 'IN_STASIS': return robot.inStasis ?? false;
  }

  // --- FOV / Visibility identifiers ---
  const visibleRobots = robot.visibleEntities?.robots ?? [];

  switch (name) {
    case 'CAN_SEE_ENEMY': return visibleRobots.length > 0;
    case 'VISIBLE_ENEMY_COUNT': return visibleRobots.length;
    case 'FOV_ANGLE': return robot.fov?.angle ?? 120;

    case 'NEAREST_VISIBLE_X':
    case 'NEAREST_VISIBLE_Y': {
      if (visibleRobots.length === 0) {
        return name === 'NEAREST_VISIBLE_X' ? robot.position.x : robot.position.y;
      }
      // Find nearest visible enemy
      let nearest = visibleRobots[0];
      let nearestDst = Infinity;
      for (const candidate of visibleRobots) {
        const dx = candidate.position.x - robot.position.x;
        const dy = candidate.position.y - robot.position.y;
        const dst = dx * dx + dy * dy;
        if (dst < nearestDst) { nearestDst = dst; nearest = candidate; }
      }
      return name === 'NEAREST_VISIBLE_X' ? nearest.position.x : nearest.position.y;
    }
  }

  // --- Legacy / existing identifiers (derived from visible entities only) ---
  const nearestVisible = getNearestVisible(robot);

  switch (name) {
    case 'distance': {
      if (!nearestVisible) return Infinity;
      const dx = robot.position.x - nearestVisible.position.x;
      const dy = robot.position.y - nearestVisible.position.y;
      return Math.hypot(dx, dy);
    }
    case 'health': return robot.health;
    case 'rotation': return robot.rotation;
    case 'target_vx': return nearestVisible?.velocity.x ?? 0;
    case 'target_vy': return nearestVisible?.velocity.y ?? 0;
    case 'bullet_speed': return 400;
    case 'spotted': return nearestVisible !== null;

    default: return undefined;
  }
}

function getNearestVisible(robot: Robot): Robot | null {
  const visible = robot.visibleEntities?.robots ?? [];
  if (visible.length === 0) return null;

  let nearest = visible[0];
  let nearestDst = Infinity;
  for (const candidate of visible) {
    const dx = candidate.position.x - robot.position.x;
    const dy = candidate.position.y - robot.position.y;
    const dst = dx * dx + dy * dy;
    if (dst < nearestDst) { nearestDst = dst; nearest = candidate; }
  }
  return nearest;
}
