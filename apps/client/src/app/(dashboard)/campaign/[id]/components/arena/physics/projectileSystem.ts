import { FIRE_DAMAGE, FLASH_DURATION, RESPAWN_DELAY, BATTLE_END_DELAY_MS } from '../constants';
import { hitCheck, projectileHitsObstacle } from './collision';
import type { ArenaProjectile, ArenaRobot, ArenaObstacle } from '../scenes';

export function updateProjectiles(
  projectiles: ArenaProjectile[],
  robots: ArenaRobot[],
  obstacles: ArenaObstacle[],
  previewMode: boolean,
  battleEndedRef: { current: boolean },
  flashTimerRef: { current: number },
  onBattleEnd: ((winner: 'player' | 'enemy' | 'draw') => void) | null,
): void {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    p.x += p.vx; p.y += p.vy; p.life--;
    let hit = false;
    for (const robot of robots) {
      if (robot.id === p.ownerId || !robot.isAlive || robot.invulnerableTimer > 0) continue;
      if (hitCheck(p, robot)) {
        if (previewMode && robot.id === 'player') {
          projectiles.splice(i, 1);
          hit = true;
          break;
        }
        robot.health = Math.max(0, robot.health - (p.damage ?? FIRE_DAMAGE));
        projectiles.splice(i, 1);
        hit = true;
        if (robot.health <= 0) {
          robot.isAlive = false;
          flashTimerRef.current = FLASH_DURATION;
          robot.respawnTimer = RESPAWN_DELAY;
          robot.energy = 0;
          if (!previewMode && !battleEndedRef.current) {
            battleEndedRef.current = true;
            const otherRobot = robots.find(r => r.id !== robot.id);
            const winner: 'player' | 'enemy' | 'draw' =
              (otherRobot && !otherRobot.isAlive) ? 'draw'
                : robot.id === 'player' ? 'enemy'
                  : 'player';
            setTimeout(() => onBattleEnd?.(winner), BATTLE_END_DELAY_MS);
          }
        }
        break;
      }
    }
    if (!hit) {
      for (const obs of obstacles) {
        if (projectileHitsObstacle(p, obs)) {
          projectiles.splice(i, 1);
          hit = true;
          break;
        }
      }
    }
    if (!hit && (p.life <= 0 || p.x < -0.05 || p.x > 1.05 || p.y < -0.05 || p.y > 1.05)) {
      projectiles.splice(i, 1);
    }
  }
}
