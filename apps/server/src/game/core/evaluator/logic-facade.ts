import { GameLoop } from '@logic-arena/engine';
import { Program } from '../../../../../../packages/logic-parser/src';
import { ActionExecutor } from '../executor';
import { ExpressionEvaluator } from './expression-facade';
import { LogicRegistry } from './logic-registry';
import { BlockExecutor } from './block-executor';
import { syncRotationToMemory, syncFovToMemory } from './memory-sync';

export class LogicEvaluator {
  private registry: LogicRegistry;
  private blockExecutor: BlockExecutor;

  constructor(private gameLoop: GameLoop, private actionExecutor: ActionExecutor) {
    this.registry = new LogicRegistry(actionExecutor);
    const expressionEvaluator = new ExpressionEvaluator();
    this.blockExecutor = new BlockExecutor(gameLoop, actionExecutor, expressionEvaluator, this.registry.functions);
  }

  setLogic(robotId: string, ast: Program): void {
    this.registry.setLogic(robotId, ast);
  }

  clearAllLogic(): void {
    this.registry.clearAllLogic();
  }

  clearLogicForRobot(robotId: string): void {
    this.registry.clearLogicForRobot(robotId);
  }

  evaluate(robotId: string): void {
    const program = this.registry.robotLogic.get(robotId);
    const robot = this.gameLoop.getRobots().find(r => r.id === robotId);
    if (!program || !robot || robot.health <= 0) return;

    const memory = this.registry.memories.getMemory(robotId);

    // Honour WAIT ticks
    const waitTicks = (memory['___waitTicks'] as number) ?? 0;
    if (waitTicks > 0) {
      memory['___waitTicks'] = waitTicks - 1;
      return;
    }

    syncRotationToMemory(robot, memory);
    syncFovToMemory(robot, memory);

    const tickStart = Date.now();
    this.blockExecutor.executeBlock(robotId, robot, program.body, memory, tickStart);
  }
}
