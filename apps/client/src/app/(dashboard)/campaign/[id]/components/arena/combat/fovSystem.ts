import { FOV_SWEEP_FRAMES } from '../constants';
import type { ArenaRobot } from '../scenes';

export function startFovSweep(timers: Map<string, number>, robotId: string): void {
  if ((timers.get(robotId) ?? 0) <= 0) {
    timers.set(robotId, FOV_SWEEP_FRAMES);
  }
}

export function tickFovTimers(fovTimerRef: Map<string, number>): void {
  for (const [id, t] of fovTimerRef) {
    if (t > 0) fovTimerRef.set(id, t - 1);
  }
}

export function ensureEnemyFov(fovTimerRef: Map<string, number>, robots: ArenaRobot[]): void {
  for (const robot of robots) {
    if (robot.id === 'enemy' && robot.isAlive && (fovTimerRef.get(robot.id) ?? 0) === 0) {
      fovTimerRef.set(robot.id, FOV_SWEEP_FRAMES);
    }
  }
}
