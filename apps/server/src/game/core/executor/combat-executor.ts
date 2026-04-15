import { GameLoop } from "@logic-arena/engine";
import { CooldownManager } from "./cooldown-manager";

export class CombatExecutor {
    constructor(private gameLoop: GameLoop, private cooldowns: CooldownManager) {}

    execute(robotId: string, actionCommand: string): void {
        if (!this.cooldowns.isFireOffCooldown(robotId)) return;
        
        const robots = this.gameLoop.getRobots();
        const robot = robots.find(r => r.id === robotId);
        const targetRobot = robots.find(r => r.id !== robotId && r.health > 0);
        
        if (robot && robot.health > 0 && targetRobot) {
            if (actionCommand === "FIRE" || actionCommand === "BURST_FIRE") {
                this.gameLoop.spawnProjectile(robotId, { ...robot.position }, { x: targetRobot.position.x, y: targetRobot.position.y });
                this.cooldowns.markFired(robotId);
            }
        }
    }
}
