import { Robot } from '@logic-arena/engine';
import { DEFAULT_MAX_ENERGY } from '@logic-arena/engine';

export function syncRotationToMemory(
  robot: Robot,
  memory: Record<string, unknown>,
): void {
  // Sync physical rotational state into script memory each tick
  // so `set rotation = ...` knows the actual current facing.
  // All aliases (rotation / angle / rot) are synchronized simultaneously.
  memory['rotation'] = robot.rotation;
  memory['angle'] = robot.rotation;
  memory['rot'] = robot.rotation;
  memory['fovDirection'] = robot.fovDirection;
}

export function syncFovToMemory(
  robot: Robot,
  memory: Record<string, unknown>,
): void {
  // --- FOV-aware last_spotted memory ---
  // Only update last_spotted_x/y when the enemy is WITHIN the robot's FOV.
  // This enforces true blindness: a robot that hasn't scanned toward the enemy
  // retains the last known position but cannot refresh it.
  const visibleRobots = robot.visibleEntities?.robots ?? [];
  if (visibleRobots.length > 0) {
    // Use nearest visible enemy
    let nearest = visibleRobots[0];
    let nearestDst = Infinity;
    for (const r of visibleRobots) {
      const dx = r.position.x - robot.position.x;
      const dy = r.position.y - robot.position.y;
      const dst = dx * dx + dy * dy;
      if (dst < nearestDst) {
        nearestDst = dst;
        nearest = r;
      }
    }
    memory['last_spotted_x'] = nearest.position.x;
    memory['last_spotted_y'] = nearest.position.y;
  }
  // If nothing visible, last_spotted_x/y remain from the previous tick
  // (players must implement their own "forget after N ticks" logic)
}

export function syncEnergyToMemory(
  robot: Robot,
  memory: Record<string, unknown>,
): void {
  // Write live energy values into memory each tick so any cached variable
  // (e.g. SET e = MY_ENERGY) is refreshed and script logic stays accurate.
  const maxEnergy = robot.maxEnergy ?? DEFAULT_MAX_ENERGY;
  const energy = robot.energy ?? maxEnergy;
  memory['MY_ENERGY'] = energy;
  memory['ENERGY_PCT'] = Math.round((energy / maxEnergy) * 100);
  memory['IN_STASIS'] = robot.inStasis ?? false;
}
