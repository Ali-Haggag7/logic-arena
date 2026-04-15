import { GameLoop } from "@logic-arena/engine";
import { CombatMath } from "../combat-math";

export class ScanExecutor {
    constructor(private gameLoop: GameLoop) {}

    execute(robotId: string, memory: Record<string, any>): void {
        const robots = this.gameLoop.getRobots();
        const robot = robots.find(r => r.id === robotId);
        if (!robot) return;

        const target = CombatMath.getClosestTarget(robot, robots);
        
        if (target) {
            const dx = target.position.x - robot.position.x;
            const dy = target.position.y - robot.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);
            const spotted = CombatMath.isTargetSpotted(robot, target);

            memory["scanned_distance"] = distance;
            memory["scanned_angle"] = angle;
            memory["scanned_spotted"] = spotted;
        } else {
            memory["scanned_distance"] = Infinity;
            memory["scanned_angle"] = 0;
            memory["scanned_spotted"] = false;
        }
    }
}
