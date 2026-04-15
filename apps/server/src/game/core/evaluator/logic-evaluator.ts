import { GameLoop, Robot } from "@logic-arena/engine";
import { Program, Statement, NodeType, IfStatement, WhileStatement, AssignmentStatement, ActionStatement, CallStatement, FunctionDeclaration, WaitStatement, ScanStatement } from "../../../../../../packages/logic-parser/src";
import { ActionExecutor } from "../executor";
import { ExpressionEvaluator } from "./expression-evaluator";
import { MemoryManager } from "./memory-manager";
import { CombatMath } from "../combat-math";

export class LogicEvaluator {
    private robotLogic: Map<string, Program> = new Map();
    private memories = new MemoryManager();
    private expressionEvaluator = new ExpressionEvaluator();
    private functions: Map<string, Map<string, FunctionDeclaration>> = new Map();
    private readonly MAX_WHILE_ITERS = 10;

    constructor(private gameLoop: GameLoop, private actionExecutor: ActionExecutor) {}

    setLogic(robotId: string, ast: Program) {
        this.robotLogic.set(robotId, ast);
        this.memories.initialize(robotId);
        this.actionExecutor.clearState(robotId);
        
        const funcs = new Map<string, FunctionDeclaration>();
        ast.body.forEach(stmt => {
            if (stmt.type === NodeType.FunctionDeclaration) {
                const fd = stmt as FunctionDeclaration;
                funcs.set(fd.name.value, fd);
            }
        });
        this.functions.set(robotId, funcs);
    }

    clearAllLogic() {
        this.robotLogic.clear();
        this.memories.clearAll();
        this.functions.clear();
    }

    clearLogicForRobot(robotId: string) {
        this.robotLogic.delete(robotId);
        this.memories.clearForRobot(robotId);
        this.functions.delete(robotId);
    }

    evaluate(robotId: string): void {
        const program = this.robotLogic.get(robotId);
        const robot = this.gameLoop.getRobots().find(r => r.id === robotId);
        if (!program || !robot || robot.health <= 0) return;

        const memory = this.memories.getMemory(robotId);

        let waitTicks = memory["___waitTicks"] ?? 0;
        if (waitTicks > 0) {
            memory["___waitTicks"] = waitTicks - 1;
            return;
        }

        if (!('rotation' in memory)) memory["rotation"] = robot.rotation;
        
        const target = CombatMath.getClosestTarget(robot, this.gameLoop.getRobots());
        if (CombatMath.isTargetSpotted(robot, target) && target) {
            memory["last_spotted_x"] = target.position.x;
            memory["last_spotted_y"] = target.position.y;
        }

        this.executeBlock(robotId, robot, program.body, memory);
    }

    private executeBlock(robotId: string, robot: Robot, statements: Statement[], memory: Record<string, any>): void {
        for (const stmt of statements) {
            if (robot.health <= 0) return;

            switch (stmt.type) {
                case NodeType.AssignmentStatement: {
                    const assign = stmt as AssignmentStatement;
                    const val = this.expressionEvaluator.evaluateExpression(robot, assign.value, memory, () => this.gameLoop.getRobots());
                    memory[assign.name.value] = val;
                    if (assign.name.value === "rotation" && typeof val === "number") robot.rotation = val;
                    break;
                }
                case NodeType.ActionStatement: {
                    const action = (stmt as ActionStatement).consequence;
                    this.executeActionIfOffCooldown(robotId, action, memory);
                    break;
                }
                case NodeType.IfStatement: {
                    const ifStmt = stmt as IfStatement;
                    const cond = this.expressionEvaluator.evaluateCondition(robot, ifStmt.condition, memory, () => this.gameLoop.getRobots());
                    if (cond) {
                        this.executeBlock(robotId, robot, ifStmt.consequence, memory);
                    } else if (ifStmt.alternate) {
                        this.executeBlock(robotId, robot, ifStmt.alternate, memory);
                    }
                    break;
                }
                case NodeType.WhileStatement: {
                    const whileStmt = stmt as WhileStatement;
                    let iters = 0;
                    while (iters < this.MAX_WHILE_ITERS) {
                        const cond = this.expressionEvaluator.evaluateCondition(robot, whileStmt.condition, memory, () => this.gameLoop.getRobots());
                        if (!cond) break;
                        this.executeBlock(robotId, robot, whileStmt.body, memory);
                        iters++;
                    }
                    break;
                }
                case NodeType.CallStatement: {
                    const funcName = (stmt as CallStatement).functionName.value;
                    const func = this.functions.get(robotId)?.get(funcName);
                    if (func) this.executeBlock(robotId, robot, func.body, memory);
                    break;
                }
                case NodeType.WaitStatement: {
                    const ticks = (stmt as WaitStatement).ticks.value;
                    memory["___waitTicks"] = ticks;
                    return; // Stop current block execution
                }
                case NodeType.ScanStatement: {
                    this.actionExecutor.executeAction(robotId, stmt as ScanStatement, memory);
                    break;
                }
            }
        }
    }

    private executeActionIfOffCooldown(robotId: string, action: any, memory: Record<string, any>) {
        const cmd = action.command.toUpperCase();
        if (["MOVE", "MOVE_FAST", "BACKUP", "STOP"].includes(cmd)) {
            this.actionExecutor.executeAction(robotId, action, memory);
            this.actionExecutor.markBareActionExecuted(robotId, cmd);
        } else if (this.actionExecutor.isBareActionOffCooldown(robotId, cmd)) {
            this.actionExecutor.executeAction(robotId, action, memory);
            this.actionExecutor.markBareActionExecuted(robotId, cmd);
        }
    }
}
