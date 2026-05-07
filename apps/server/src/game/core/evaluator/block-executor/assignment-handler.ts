import {
  GameLoop,
  Robot,
  AliScriptSecurityError,
  enforceAliScriptStringLimit,
  assertAliScriptCollectionCanGrow,
  isForbiddenAliScriptPropertyKey,
  safeSetAliScriptProperty,
} from '@logic-arena/engine';
import { AssignmentStatement } from '@logic-arena/logic-parser';
import { ExpressionEvaluator } from '../expression-facade';

const ROTATION_ALIASES = ['rotation', 'angle', 'rot'];

interface AssignmentHandlerContext {
  gameLoop: GameLoop;
  expressionEvaluator: ExpressionEvaluator;
}

export function executeAssignmentStatement(
  context: AssignmentHandlerContext,
  robot: Robot,
  assign: AssignmentStatement,
  memory: Record<string, unknown>,
): void {
  const { gameLoop, expressionEvaluator } = context;
  const val = expressionEvaluator.evaluateExpression(
    robot,
    assign.value,
    memory,
    () => gameLoop.getRobots(),
    () => gameLoop.getGameState().obstacles,
  );

  // Handle dot-notation property assignment: SET obj.prop = value
  if (assign.property) {
    if (isForbiddenAliScriptPropertyKey(assign.property)) {
      throw new AliScriptSecurityError(
        `Forbidden AliScript dictionary key: ${assign.property}`,
      );
    }

    const dictTarget = memory[assign.name.value];
    if (
      dictTarget !== null &&
      typeof dictTarget === 'object' &&
      !Array.isArray(dictTarget)
    ) {
      safeSetAliScriptProperty(
        dictTarget as Record<string, unknown>,
        assign.property,
        val,
      );
    }
    return;
  }

  // Handle bracket-notation assignment: SET arr[i] = value OR SET obj["key"] = value
  if (assign.index) {
    const idx = expressionEvaluator.evaluateExpression(
      robot,
      assign.index,
      memory,
      () => gameLoop.getRobots(),
      () => gameLoop.getGameState().obstacles,
    );
    const container = memory[assign.name.value];

    if (Array.isArray(container) && typeof idx === 'number') {
      const i = Math.floor(idx);
      if (i === container.length) {
        assertAliScriptCollectionCanGrow(container.length);
        container.push(val);
        return;
      }
      if (i >= 0 && i < container.length) {
        container[i] = val;
      }
    } else if (
      container !== null &&
      typeof container === 'object' &&
      !Array.isArray(container)
    ) {
      safeSetAliScriptProperty(
        container as Record<string, unknown>,
        String(idx),
        val,
      );
    }
    return;
  }

  memory[assign.name.value] =
    typeof val === 'string' ? enforceAliScriptStringLimit(val) : val;
  syncRobotControlAssignment(robot, assign.name.value, val, memory);
}

function syncRobotControlAssignment(
  robot: Robot,
  assignmentName: string,
  val: unknown,
  memory: Record<string, unknown>,
): void {
  if (ROTATION_ALIASES.includes(assignmentName) && typeof val === 'number') {
    if ((robot.collisionCooldown ?? 0) > 0) {
      memory['rotation'] = robot.rotation;
      memory['angle'] = robot.rotation;
      memory['rot'] = robot.rotation;
      return;
    }

    robot.rotation = val;
    robot.isManualRotation = true;
    // Auto-disable lockVision — user is manually steering the body,
    // so the FOV should stay frozen at its last known direction.
    robot.lockVision = false;
  } else if (assignmentName === 'fovDirection' && typeof val === 'number') {
    robot.fovDirection = val;
    // Auto-disable lockVision — user is manually steering the scanner,
    // so the body should stay frozen at its last known direction.
    robot.lockVision = false;
  } else if (assignmentName === 'lockVision') {
    robot.lockVision = Boolean(val);
  }
}
