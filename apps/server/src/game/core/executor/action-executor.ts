import { GameLoop } from "@logic-arena/engine";
import { Socket } from "socket.io";
import { ActionExpression } from "../../../../../../packages/logic-parser/src";
import { Pathfinder } from "../pathfinder";
import { CooldownManager } from "./cooldown-manager";

export class ActionExecutor {
  private cooldowns = new CooldownManager();
  private readonly MOVE_SPEED = 150;
  private readonly MOVE_FAST_MULTIPLIER = 2;

  constructor(
    private gameLoop: GameLoop,
    private connectedClients: Map<string, Socket>,
    private pathfinder: Pathfinder
  ) { }

  isBareActionOffCooldown(robotId: string, actionCommand: string): boolean {
    return this.cooldowns.isOffCooldown(robotId, actionCommand);
  }

  markBareActionExecuted(robotId: string, actionCommand: string): void {
    this.cooldowns.markExecuted(robotId, actionCommand);
  }

  fire(robotId: string, targetX: number, targetY: number): void {
    const robot = this.gameLoop.getRobots().find(r => r.id === robotId);
    if (robot && robot.health > 0) {
      this.gameLoop.spawnProjectile(robotId, { ...robot.position }, { x: targetX, y: targetY });
    }
  }

  fireProjectile(robotId: string): void {
    if (!this.cooldowns.isFireOffCooldown(robotId)) return;
    const robots = this.gameLoop.getRobots();
    const robot = robots.find(r => r.id === robotId);
    const targetRobot = robots.find(r => r.id !== robotId && r.health > 0);
    if (robot && robot.health > 0 && targetRobot) {
      this.fire(robotId, targetRobot.position.x, targetRobot.position.y);
      this.cooldowns.markFired(robotId);
    }
  }

  executeAction(robotId: string, action: ActionExpression, memory: Map<string, any>): void {
    const actionCommand = action.command.toUpperCase();

    if (this.cooldowns.shouldEmitAction(robotId, actionCommand)) {
      this.connectedClients.forEach(client => {
        client.emit("logicExecuted", { robotId, action: actionCommand, message: `Logic Triggered: ${actionCommand}` });
      });
      this.cooldowns.markEmitted(robotId, actionCommand);
      console.log(`[Logic Execution] ${robotId} status changed to: ${actionCommand}`);
    }

    switch (actionCommand) {
      case "FIRE":
      case "BURST_FIRE":
        this.fireProjectile(robotId);
        break;
      case "PATHFIND": {
        const robot = this.gameLoop.getRobots().find(r => r.id === robotId);
        if (robot) this.pathfinder.executePathfind(robot, memory);
        break;
      }
      case "STOP": {
        const robot = this.gameLoop.getRobots().find(r => r.id === robotId);
        if (robot) { robot.velocity.x = 0; robot.velocity.y = 0; }
        break;
      }
      case "MOVE":
      case "MOVE_FAST":
      case "BACKUP": {
        const robot = this.gameLoop.getRobots().find(r => r.id === robotId);
        if (robot) {
          if (robot.trappedUntil && Date.now() < robot.trappedUntil) {
            robot.velocity.x = 0;
            robot.velocity.y = 0;
            break;
          }
          const slowMult = (robot.slowedUntil && Date.now() < robot.slowedUntil)
            ? (robot.speedMultiplier ?? 0.4) : 1;
          const speedMultiplier = actionCommand === "MOVE_FAST" ? this.MOVE_FAST_MULTIPLIER : 1;
          const directionMultiplier = actionCommand === "BACKUP" ? -1 : 1;
          const speed = this.MOVE_SPEED * speedMultiplier * directionMultiplier * slowMult;
          const speedMagnitude = Math.hypot(robot.velocity.x, robot.velocity.y);
          if (robot.rotation === 0 && speedMagnitude < 0.001) {
            robot.velocity.x = speed;
            robot.velocity.y = 0;
            break;
          }
          robot.velocity.x = Math.cos(robot.rotation) * speed;
          robot.velocity.y = Math.sin(robot.rotation) * speed;
        }
        break;
      }
      default:
        console.warn(`[Logic Error] Unknown command: ${actionCommand}`);
    }
  }

  clearState(robotId: string): void {
    this.cooldowns.clearState(robotId);
  }
}