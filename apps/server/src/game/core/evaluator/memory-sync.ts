import { Robot } from '@logic-arena/engine';

export function syncRotationToMemory(robot: Robot, memory: Record<string, unknown>): void {
  // Sync physical rotational state into script memory each tick
  // so `set rotation = ...` knows the actual current facing.
  // All aliases (rotation / angle / rot) are synchronized simultaneously.
  memory['rotation'] = robot.rotation;
  memory['angle'] = robot.rotation;
  memory['rot'] = robot.rotation;
  memory['fovDirection'] = robot.fovDirection;
}

export function syncFovToMemory(robot: Robot, memory: Record<string, unknown>): void {
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
