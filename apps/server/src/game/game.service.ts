import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { GameLoop, Robot, GameState } from "@logic-arena/engine";
import {
  Parser,
  Program,
  NodeType,
  ComparisonExpression,
  ActionExpression,
  NumberLiteral,
  Identifier,
  StringLiteral,
  IfStatement,
  AssignmentStatement,
  ActionStatement,
  Expression
} from "../../../../packages/logic-parser/src";

@Injectable()
export class GameService {
  private connectedClients: Map<string, Socket> = new Map();
  private lastFireTime: Map<string, number> = new Map();
  private readonly FIRE_COOLDOWN_MS = 500;
  private readonly ACTION_COOLDOWN_MS = 500;
  private readonly MOVE_SPEED = 150;
  private readonly MOVE_FAST_MULTIPLIER = 2;
  private robotLogic: Map<string, Program> = new Map();
  private lastExecutedAction: Map<string, string> = new Map(); // Store the last executed action for feedback
  private lastLogicEmitTime: Map<string, number> = new Map();
  private actionCooldowns: Map<string, Map<string, number>> = new Map();
  private gameLoop: GameLoop;
  private logicStates: Map<string, Map<string, boolean>> = new Map();
  private robotMemory: Map<string, Map<string, any>> = new Map();
  
  // A* grid state
  private grid: boolean[][] = [];
  private readonly GRID_COLS = 40;
  private readonly GRID_ROWS = 30;
  private readonly CELL_SIZE = 20;

  constructor() {
    this.gameLoop = new GameLoop();

    this.gameLoop.addRobot({
      id: 'bot-1',
      team: 'A',
      position: { x: 100, y: 100 },
      velocity: { x: 0, y: 0 },
      rotation: 0,
      health: 100,
      lastActionTime: 0,
      isAlive: true,
      code: '',
      memory: {},
    });

    this.gameLoop.addRobot({
      id: 'bot-2',
      team: 'B',
      position: { x: 700, y: 500 },
      velocity: { x: 0, y: 0 },
      rotation: Math.PI,
      health: 100,
      lastActionTime: 0,
      isAlive: true,
      code: '',
      memory: {},
    });

    this.gameLoop.start();

    this.rebuildGrid();

    // High-performance Logic Evaluation Loop (60 FPS)
    setInterval(() => {
      const robots = this.gameLoop.getRobots();

      robots.forEach(robot => {
        const logic = this.robotLogic.get(robot.id);
        if (logic && robot.health > 0) {
          this.evaluateLogic(robot.id, logic);
        }
      });
    }, 16);
  }

  getGameLoop(): GameLoop {
    return this.gameLoop;
  }

  getGameState(): GameState {
    return this.gameLoop.getGameState();
  }

  fire(robotId: string, targetX: number, targetY: number): void {
    const robots = this.gameLoop.getRobots();
    const robot = robots.find(r => r.id === robotId);

    if (robot && robot.health > 0) {
      this.gameLoop.spawnProjectile(
        robotId,
        { ...robot.position },
        { x: targetX, y: targetY }
      );
    }
  }

  fireProjectile(robotId: string): void {
    const now = Date.now();
    const lastFire = this.lastFireTime.get(robotId) || 0;

    if (now - lastFire < this.FIRE_COOLDOWN_MS) {
      return; // Cooldown active, do not fire
    }

    const robots = this.gameLoop.getRobots();
    const robot = robots.find(r => r.id === robotId);

    // Find a target robot that is alive and not the current robot
    const targetRobot = robots.find(r => r.id !== robotId && r.health > 0);

    if (robot && robot.health > 0 && targetRobot) {
      this.fire(robotId, targetRobot.position.x, targetRobot.position.y);
      this.lastFireTime.set(robotId, now); // Update last fire time
      console.log(`>> EXECUTING FIRE FOR ${robotId}`); // Essential debug log
    } else {
      console.log(`[Logic Engine] Robot ${robotId} tried to FIRE but no valid target or robot is dead.`);
    }
  }

  joinGame(client: Socket, userId: string): void {
    this.connectedClients.set(userId, client);
    client.on("disconnect", () => {
      this.connectedClients.delete(userId);
    });
  }

  resetGame(): void {
    this.gameLoop.getRobots().forEach(robot => {
      robot.health = 100;
    });
    this.robotLogic.clear();
  }

  updateRobotLogic(robotId: string, script: string): void {
    try {
      const parser = new Parser(script);
      const ast = parser.parse();
      this.robotLogic.set(robotId, ast);

      // Reset last executed action to allow fresh evaluation
      this.lastExecutedAction.delete(robotId);
      this.lastLogicEmitTime.delete(robotId);
      this.logicStates.delete(robotId);
      this.robotMemory.set(robotId, new Map());
      this.actionCooldowns.set(robotId, new Map());

      console.log(`[Brain Deploy] Logic successfully updated for ${robotId}`);
    } catch (error) {
      console.error(`[Parser Error] Failed to parse script for ${robotId}:`, error);
    }
  }

  private evaluateLogic(robotId: string, program: Program): void {
    const robot = this.gameLoop.getRobots().find(r => r.id === robotId);
    if (!robot || robot.health <= 0) return;

    // Initialize state map for this robot if it doesn't exist
    if (!this.logicStates.has(robotId)) {
      this.logicStates.set(robotId, new Map());
    }
    if (!this.robotMemory.has(robotId)) {
      this.robotMemory.set(robotId, new Map());
    }
    if (!this.actionCooldowns.has(robotId)) {
      this.actionCooldowns.set(robotId, new Map());
    }
    const robotStates = this.logicStates.get(robotId)!;
    const robotMemory = this.robotMemory.get(robotId)!;

    if (!robotMemory.has("rotation")) {
      robotMemory.set("rotation", robot.rotation);
    }
    if (!robotMemory.has("last_spotted_x")) {
      robotMemory.set("last_spotted_x", robot.position.x);
    }
    if (!robotMemory.has("last_spotted_y")) {
      robotMemory.set("last_spotted_y", robot.position.y);
    }

    const target = this.getClosestTarget(robot);
    const isSpotted = this.isTargetSpotted(robot, target);
    if (isSpotted && target) {
      robotMemory.set("last_spotted_x", target.position.x);
      robotMemory.set("last_spotted_y", target.position.y);
    }

    const movementCommands = new Set(["MOVE", "MOVE_FAST", "BACKUP", "STOP"]);
    let pendingMovementAction: { action: ActionExpression; isBare: boolean; command: string } | null = null;

    program.body.forEach((statement, index) => {
      if (statement.type === NodeType.AssignmentStatement) {
        const assignment = statement as AssignmentStatement;
        const value = this.evaluateExpression(robotId, robot, assignment.value);
        robotMemory.set(assignment.name.value, value);

        if (assignment.name.value === "rotation" && typeof value === "number") {
          robot.rotation = value;
        }
        return;
      }

      if (statement.type === NodeType.ActionStatement) {
        const actionStatement = statement as ActionStatement;
        const actionCommand = actionStatement.consequence.command.toUpperCase();

        if (!this.isBareActionOffCooldown(robotId, actionCommand)) {
          return;
        }

        if (movementCommands.has(actionCommand)) {
          pendingMovementAction = { action: actionStatement.consequence, isBare: true, command: actionCommand };
          return;
        }

        this.executeAction(robotId, actionStatement.consequence);
        this.markBareActionExecuted(robotId, actionCommand);
        return;
      }

      if (statement.type === NodeType.IfStatement) {
        const ifStatement = statement as IfStatement;

        // 1. Evaluate current condition
        const isConditionMet = this.evaluateCondition(robotId, robot, ifStatement.condition);

        // 2. Get previous state of this specific IF statement
        const wasConditionMetBefore = robotStates.get(index.toString()) || false;

        // 3. ONLY execute if condition just turned from FALSE to TRUE (Edge Trigger)
        if (isConditionMet && !wasConditionMetBefore) {
          const actionCommand = ifStatement.consequence.command.toUpperCase();

          if (movementCommands.has(actionCommand)) {
            pendingMovementAction = { action: ifStatement.consequence, isBare: false, command: actionCommand };
          } else {
            this.executeAction(robotId, ifStatement.consequence);
          }
        }

        // 4. Update the state for the next frame (60 FPS tick)
        robotStates.set(index.toString(), isConditionMet);
      }
    });

    // Movement actions are resolved per tick; the last active movement command wins to avoid conflicts.
    if (pendingMovementAction !== null) {
      const { action, isBare, command } = pendingMovementAction;
      this.executeAction(robotId, action);
      if (isBare) {
        this.markBareActionExecuted(robotId, command);
      }
    }
  }

  private evaluateCondition(robotId: string, robot: Robot, expression: Expression): boolean {
    const value = this.evaluateExpression(robotId, robot, expression);
    if (typeof value === "boolean") {
      return value;
    }
    return Boolean(value);
  }

  private evaluateExpression(robotId: string, robot: Robot, expression: Expression): any {
    switch (expression.type) {
      case NodeType.NumberLiteral:
      case NodeType.StringLiteral:
      case NodeType.BooleanLiteral:
        return expression.value;
      case NodeType.Identifier:
        return this.resolveValue(robotId, robot, expression);
      case NodeType.BinaryExpression: {
        const left = this.evaluateExpression(robotId, robot, expression.left);
        const right = this.evaluateExpression(robotId, robot, expression.right);
        if (typeof left !== "number" || typeof right !== "number") {
          return undefined;
        }
        return expression.operator === "+" ? left + right : left - right;
      }
      case NodeType.UnaryExpression: {
        const argument = this.evaluateExpression(robotId, robot, expression.argument);
        return expression.operator === "NOT" ? !Boolean(argument) : undefined;
      }
      case NodeType.ComparisonExpression: {
        const leftValue = this.evaluateExpression(robotId, robot, expression.left);
        const rightValue = this.evaluateExpression(robotId, robot, expression.right);

        if (typeof leftValue !== typeof rightValue) return false;

        switch (expression.operator) {
          case "<": return leftValue < rightValue;
          case ">": return leftValue > rightValue;
          case "==": return leftValue === rightValue;
          default: return false;
        }
      }
      default:
        return undefined;
    }
  }

  private isBareActionOffCooldown(robotId: string, actionCommand: string): boolean {
    const now = Date.now();
    const robotCooldowns = this.actionCooldowns.get(robotId) ?? new Map();

    if (!this.actionCooldowns.has(robotId)) {
      this.actionCooldowns.set(robotId, robotCooldowns);
    }

    const lastExecutionTime = robotCooldowns.get(actionCommand) ?? 0;
    return now - lastExecutionTime >= this.ACTION_COOLDOWN_MS;
  }

  private markBareActionExecuted(robotId: string, actionCommand: string): void {
    const now = Date.now();
    const robotCooldowns = this.actionCooldowns.get(robotId) ?? new Map();

    if (!this.actionCooldowns.has(robotId)) {
      this.actionCooldowns.set(robotId, robotCooldowns);
    }

    robotCooldowns.set(actionCommand, now);
  }

  private executeAction(robotId: string, action: ActionExpression): void {
    // Normalize command to UpperCase to prevent string mismatch
    const actionCommand = action.command.toUpperCase();
    const lastAction = this.lastExecutedAction.get(robotId);
    const lastEmitTime = this.lastLogicEmitTime.get(robotId) || 0;
    const now = Date.now();
    const actionChanged = actionCommand !== lastAction;

    // Event-Driven Optimization: Only emit to clients if action state changes or debounce window passes
    if (actionChanged || now - lastEmitTime >= this.ACTION_COOLDOWN_MS) {
      this.connectedClients.forEach(client => {
        client.emit("logicExecuted", {
          robotId,
          action: actionCommand,
          message: `Logic Triggered: ${actionCommand}`
        });
      });

      this.lastLogicEmitTime.set(robotId, now);
    }

    if (actionChanged) {
      this.lastExecutedAction.set(robotId, actionCommand);
      console.log(`[Logic Execution] ${robotId} status changed to: ${actionCommand}`);
    }

    // Direct Execution Logic
    switch (actionCommand) {
      case "FIRE":
        this.fireProjectile(robotId);
        break;
      case "BURST_FIRE":
        this.fireProjectile(robotId);
        break;
      case "PATHFIND": {
        const robot = this.gameLoop.getRobots().find(r => r.id === robotId);
        const target = robot ? this.getClosestTarget(robot) : null;
        if (robot && target) {
          this.executePathfind(robot, target);
        }
        break;
      }
      case "STOP": {
        const robot = this.gameLoop.getRobots().find(r => r.id === robotId);
        if (robot) {
          robot.velocity.x = 0;
          robot.velocity.y = 0;
        }
        break;
      }
      case "MOVE":
      case "MOVE_FAST":
      case "BACKUP": {
        const robot = this.gameLoop.getRobots().find(r => r.id === robotId);
        if (robot) {
          const rotation = robot.rotation;
          const speedMultiplier = actionCommand === "MOVE_FAST" ? this.MOVE_FAST_MULTIPLIER : 1;
          const directionMultiplier = actionCommand === "BACKUP" ? -1 : 1;
          const speed = this.MOVE_SPEED * speedMultiplier * directionMultiplier;
          const speedMagnitude = Math.hypot(robot.velocity.x, robot.velocity.y);

          if (rotation === 0 && speedMagnitude < 0.001) {
            robot.velocity.x = speed;
            robot.velocity.y = 0;
            break;
          }

          robot.velocity.x = Math.cos(rotation) * speed;
          robot.velocity.y = Math.sin(rotation) * speed;
        }
        break;
      }
      default:
        console.warn(`[Logic Error] Unknown command: ${actionCommand}`);
    }
  }

  private getClosestTarget(robot: Robot): Robot | null {
    const targets = this.gameLoop.getRobots().filter(r => r.id !== robot.id && r.health > 0);
    if (targets.length === 0) return null;

    return targets.reduce((closest, current) => {
      const closestDx = robot.position.x - closest.position.x;
      const closestDy = robot.position.y - closest.position.y;
      const currentDx = robot.position.x - current.position.x;
      const currentDy = robot.position.y - current.position.y;

      const closestDistance = closestDx * closestDx + closestDy * closestDy;
      const currentDistance = currentDx * currentDx + currentDy * currentDy;

      return currentDistance < closestDistance ? current : closest;
    });
  }

  private isTargetSpotted(robot: Robot, target: Robot | null): boolean {
    if (!target) return false;

    const dx = target.position.x - robot.position.x;
    const dy = target.position.y - robot.position.y;
    const distance = Math.hypot(dx, dy);
    if (distance === 0) return true;
    if (distance > 1000) return false;

    const rotation = robot.rotation;
    let fx = 0;
    let fy = 0;

    if (rotation !== null) {
      fx = Math.cos(rotation);
      fy = Math.sin(rotation);
    } else {
      const vx = robot.velocity.x;
      const vy = robot.velocity.y;
      const speed = Math.hypot(vx, vy);
      if (speed < 0.001) return false;
      fx = vx / speed;
      fy = vy / speed;
    }

    const dot = (fx * dx + fy * dy) / distance;
    return dot >= 0.5;
  }

  private rebuildGrid() {
    this.grid = Array(this.GRID_ROWS).fill(null).map(() => Array(this.GRID_COLS).fill(false));
    const pad = 1; // 1 cell padding for robot radius
    const obstacles = this.gameLoop.getObstacles();

    for (const obs of obstacles) {
      const minCol = Math.max(0, Math.floor((obs.position.x - obs.width / 2) / this.CELL_SIZE) - pad);
      const maxCol = Math.min(this.GRID_COLS - 1, Math.floor((obs.position.x + obs.width / 2) / this.CELL_SIZE) + pad);
      const minRow = Math.max(0, Math.floor((obs.position.y - obs.height / 2) / this.CELL_SIZE) - pad);
      const maxRow = Math.min(this.GRID_ROWS - 1, Math.floor((obs.position.y + obs.height / 2) / this.CELL_SIZE) + pad);

      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          this.grid[r][c] = true;
        }
      }
    }
  }

  private performAStar(startX: number, startY: number, targetX: number, targetY: number): {x: number, y: number}[] {
    const startCol = Math.floor(startX / this.CELL_SIZE);
    const startRow = Math.floor(startY / this.CELL_SIZE);
    const targetCol = Math.floor(targetX / this.CELL_SIZE);
    const targetRow = Math.floor(targetY / this.CELL_SIZE);

    if (startCol < 0 || startCol >= this.GRID_COLS || startRow < 0 || startRow >= this.GRID_ROWS ||
        targetCol < 0 || targetCol >= this.GRID_COLS || targetRow < 0 || targetRow >= this.GRID_ROWS) {
      return [];
    }

    interface Node { c: number, r: number, g: number, h: number, f: number, parent: Node | null }
    const openSet: Node[] = [];
    const closedSet: boolean[][] = Array(this.GRID_ROWS).fill(null).map(() => Array(this.GRID_COLS).fill(false));

    const startNode = { c: startCol, r: startRow, g: 0, h: Math.abs(startCol - targetCol) + Math.abs(startRow - targetRow), f: 0, parent: null };
    startNode.f = startNode.g + startNode.h;
    openSet.push(startNode);

    while (openSet.length > 0) {
      let lowestIndex = 0;
      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i].f < openSet[lowestIndex].f) {
          lowestIndex = i;
        }
      }

      const current = openSet[lowestIndex];
      if (current.c === targetCol && current.r === targetRow) {
        const path: {x: number, y: number}[] = [];
        let curr: Node | null = current;
        while (curr) {
          path.push({ x: curr.c * this.CELL_SIZE + this.CELL_SIZE / 2, y: curr.r * this.CELL_SIZE + this.CELL_SIZE / 2 });
          curr = curr.parent;
        }
        return path.reverse();
      }

      openSet.splice(lowestIndex, 1);
      closedSet[current.r][current.c] = true;

      const dirs = [[0,1], [1,0], [0,-1], [-1,0], [1,1], [1,-1], [-1,1], [-1,-1]];
      for (const [dr, dc] of dirs) {
        const newR = current.r + dr;
        const newC = current.c + dc;

        if (newR >= 0 && newR < this.GRID_ROWS && newC >= 0 && newC < this.GRID_COLS) {
          if (closedSet[newR][newC] || this.grid[newR][newC]) continue;

          const tG = current.g + (dr !== 0 && dc !== 0 ? 1.414 : 1);
          let neighbor = openSet.find(n => n.r === newR && n.c === newC);

          if (!neighbor) {
            neighbor = { r: newR, c: newC, g: tG, h: Math.abs(newC - targetCol) + Math.abs(newR - targetRow), f: 0, parent: current };
            neighbor.f = neighbor.g + neighbor.h;
            openSet.push(neighbor);
          } else if (tG < neighbor.g) {
            neighbor.g = tG;
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.parent = current;
          }
        }
      }
    }
    return [];
  }

  private executePathfind(robot: Robot, target: Robot) {
    const memory = this.robotMemory.get(robot.id) || new Map();
    let currentPath: {x: number, y: number}[] = memory.get('path') || [];
    const lastCalcTarget = memory.get('lastPathCalcPosition') || {x: 0, y: 0};
    
    // Only recalculate if target moved > 50px or no path
    const targetMoveDist = Math.hypot(target.position.x - lastCalcTarget.x, target.position.y - lastCalcTarget.y);
    if (currentPath.length === 0 || targetMoveDist > 50) {
        currentPath = this.performAStar(robot.position.x, robot.position.y, target.position.x, target.position.y);
        memory.set('lastPathCalcPosition', {x: target.position.x, y: target.position.y});
        // smooth path here if needed
        memory.set('path', currentPath);
    }
    
    if (currentPath.length > 0) {
        const nextWaypoint = currentPath[0];
        const distToWaypoint = Math.hypot(robot.position.x - nextWaypoint.x, robot.position.y - nextWaypoint.y);
        
        if (distToWaypoint < 25) {
            currentPath.shift();
            memory.set('path', currentPath);
            if (currentPath.length > 0) {
                const next = currentPath[0];
                const angle = Math.atan2(next.y - robot.position.y, next.x - robot.position.x);
                robot.velocity.x = Math.cos(angle) * this.MOVE_SPEED;
                robot.velocity.y = Math.sin(angle) * this.MOVE_SPEED;
                robot.rotation = angle;
            } else {
                robot.velocity = {x:0, y:0};
            }
        } else {
            const angle = Math.atan2(nextWaypoint.y - robot.position.y, nextWaypoint.x - robot.position.x);
            robot.velocity.x = Math.cos(angle) * this.MOVE_SPEED;
            robot.velocity.y = Math.sin(angle) * this.MOVE_SPEED;
            robot.rotation = angle;
        }
    } else {
        // Direct movement fallback
        const angle = Math.atan2(target.position.y - robot.position.y, target.position.x - robot.position.x);
        robot.velocity.x = Math.cos(angle) * this.MOVE_SPEED;
        robot.velocity.y = Math.sin(angle) * this.MOVE_SPEED;
        robot.rotation = angle;
    }
  }

  private resolveValue(robotId: string, robot: Robot, node: Identifier | NumberLiteral | StringLiteral): any {
    if (node.type === NodeType.NumberLiteral || node.type === NodeType.StringLiteral) {
      return node.value;
    }

    if (node.type === NodeType.Identifier) {
      const memory = this.robotMemory.get(robotId);
      if (memory && memory.has(node.value)) {
        return memory.get(node.value);
      }

      const target = this.getClosestTarget(robot);

      switch (node.value) {
        case "distance":
          if (target) {
            const dx = robot.position.x - target.position.x;
            const dy = robot.position.y - target.position.y;
            return Math.sqrt(dx * dx + dy * dy); // Euclidean distance
          }
          return Infinity;
        case "health":
          return robot.health;
        case "rotation":
          return robot.rotation;
        case "target_vx":
          return target ? target.velocity.x : 0;
        case "target_vy":
          return target ? target.velocity.y : 0;
        case "bullet_speed":
          return 400;
        case "spotted":
          return this.isTargetSpotted(robot, target);
        default:
          return undefined;
      }
    }
    return undefined;
  }
}