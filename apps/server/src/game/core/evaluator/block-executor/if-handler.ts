import { GameLoop, Robot } from '@logic-arena/engine';
import { IfStatement, Statement } from '@logic-arena/logic-parser';
import { ExpressionEvaluator } from '../expression-facade';
import { BlockResult } from './control-flow';
import { OpsCounter } from '../types';

export type ExecuteBlockFn = (
  robotId: string,
  robot: Robot,
  statements: Statement[],
  memory: Record<string, unknown>,
  opsCounter: OpsCounter,
  dispatchedActions: Set<string>,
) => BlockResult;

export function executeIfStatement(
  executeBlock: ExecuteBlockFn,
  expressionEvaluator: ExpressionEvaluator,
  robotId: string,
  robot: Robot,
  ifStmt: IfStatement,
  memory: Record<string, unknown>,
  opsCounter: OpsCounter,
  dispatchedActions: Set<string>,
  gameLoop: GameLoop,
): BlockResult | null {
  const cond = expressionEvaluator.evaluateCondition(
    robot,
    ifStmt.condition,
    memory,
    () => gameLoop.getRobots(),
    () => gameLoop.getGameState().obstacles,
  );

  const result = cond
    ? executeBlock(
        robotId,
        robot,
        ifStmt.consequence,
        memory,
        opsCounter,
        dispatchedActions,
      )
    : ifStmt.alternate
      ? executeBlock(
          robotId,
          robot,
          ifStmt.alternate,
          memory,
          opsCounter,
          dispatchedActions,
        )
      : {};

  if (result.signal) return result;
  return null;
}
