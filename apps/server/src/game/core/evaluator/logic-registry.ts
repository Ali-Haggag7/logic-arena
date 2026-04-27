import {
  Program,
  FunctionDeclaration,
  NodeType,
} from '../../../../../../packages/logic-parser/src';
import { MemoryManager } from './memory-manager';
import { ActionExecutor } from '../executor';

export class LogicRegistry {
  public robotLogic = new Map<string, Program>();
  public functions = new Map<string, Map<string, FunctionDeclaration>>();
  public memories = new MemoryManager();

  constructor(private actionExecutor: ActionExecutor) {}

  setLogic(robotId: string, ast: Program): void {
    this.robotLogic.set(robotId, ast);
    this.memories.initialize(robotId);
    this.actionExecutor.clearState(robotId, true);

    const funcs = new Map<string, FunctionDeclaration>();
    ast.body.forEach((stmt) => {
      if (stmt.type === NodeType.FunctionDeclaration) {
        funcs.set(
          (stmt as FunctionDeclaration).name.value,
          stmt as FunctionDeclaration,
        );
      }
    });
    this.functions.set(robotId, funcs);
  }

  clearAllLogic(): void {
    this.robotLogic.clear();
    this.memories.clearAll();
    this.functions.clear();
  }

  clearLogicForRobot(robotId: string): void {
    this.robotLogic.delete(robotId);
    this.memories.clearForRobot(robotId);
    this.functions.delete(robotId);
  }

  /**
   * Reset a robot's runtime execution state without touching its AST or functions.
   * Called when the robot exits STASIS so it re-executes from the top of its script
   * with a clean slate — no stale variables, no pending waitTicks, no cooldowns.
   */
  resetRuntimeState(robotId: string): void {
    this.memories.initialize(robotId);
    this.actionExecutor.clearState(robotId, false);
  }
}
