import {
  Robot,
  Obstacle,
  assertAliScriptCollectionSize,
  createAliScriptDictionary,
  enforceAliScriptStringLimit,
  isForbiddenAliScriptPropertyKey,
  safeGetAliScriptProperty,
  safeSetAliScriptProperty,
} from '@logic-arena/engine';
import {
  Expression,
  NodeType,
  Identifier,
  NumberLiteral,
  StringLiteral,
  FunctionCallExpression,
  ArrayLiteral,
  IndexExpression,
  ObjectLiteral,
  MemberExpression,
} from '../../../../../../packages/logic-parser/src';
import { resolveIdentifier } from './identifier-resolver';
import {
  evaluateBinary,
  evaluateUnary,
  evaluateComparison,
} from './operator-handlers';
import { evaluateMathFunction } from './builtins/math';
import { evaluateArrayFunction } from './builtins/array';
import { evaluateSensoryFunction } from './builtins/sensory';
import { evaluateCommunicationFunction } from './builtins/communication';
import { UNHANDLED } from './builtins/internal';

/** Maximum depth for recursive expression evaluation to prevent stack overflow. */
const MAX_EVAL_DEPTH = 64;

export class ExpressionEvaluator {
  evaluateCondition(
    robot: Robot,
    expression: Expression,
    memory: Record<string, unknown>,
    getRobots: () => Robot[],
    getObstacles: () => Obstacle[],
  ): boolean {
    const value = this.evaluateExpression(
      robot,
      expression,
      memory,
      getRobots,
      getObstacles,
    );
    return typeof value === 'boolean' ? value : Boolean(value);
  }

  evaluateExpression(
    robot: Robot,
    expression: Expression,
    memory: Record<string, unknown>,
    getRobots: () => Robot[],
    getObstacles: () => Obstacle[],
    depth: number = 0,
  ): unknown {
    if (depth > MAX_EVAL_DEPTH) return undefined;

    switch (expression.type) {
      case NodeType.NumberLiteral:
      case NodeType.BooleanLiteral:
        return expression.value;

      case NodeType.StringLiteral:
        return enforceAliScriptStringLimit(String(expression.value));

      case NodeType.Identifier:
        return resolveIdentifier(
          robot,
          expression as Identifier | NumberLiteral | StringLiteral,
          memory,
        );

      case NodeType.BinaryExpression: {
        const left = this.evaluateExpression(
          robot,
          expression.left,
          memory,
          getRobots,
          getObstacles,
          depth + 1,
        );
        const right = this.evaluateExpression(
          robot,
          expression.right,
          memory,
          getRobots,
          getObstacles,
          depth + 1,
        );
        return evaluateBinary(left, right, expression.operator);
      }

      case NodeType.UnaryExpression: {
        const arg = this.evaluateExpression(
          robot,
          expression.argument,
          memory,
          getRobots,
          getObstacles,
          depth + 1,
        );
        return evaluateUnary(arg, expression.operator);
      }

      case NodeType.ComparisonExpression: {
        const lv = this.evaluateExpression(
          robot,
          expression.left,
          memory,
          getRobots,
          getObstacles,
          depth + 1,
        );
        const rv = this.evaluateExpression(
          robot,
          expression.right,
          memory,
          getRobots,
          getObstacles,
          depth + 1,
        );
        return evaluateComparison(lv, rv, expression.operator);
      }

      // ── Built-in function calls: ABS(x), GET_ALL_VISIBLE_ENEMIES(), etc. ──
      case NodeType.FunctionCallExpression: {
        const fnCall = expression;
        const evaluatedArgs = fnCall.args.map((a) =>
          this.evaluateExpression(
            robot,
            a,
            memory,
            getRobots,
            getObstacles,
            depth + 1,
          ),
        );
        return evaluateBuiltinFunction(
          fnCall.name,
          evaluatedArgs,
          memory,
          robot,
          getRobots,
          getObstacles,
        );
      }

      // ── Array literal: [1, 2, 3] ──────────────────────────────────────────
      case NodeType.ArrayLiteral: {
        const arrLit = expression;
        assertAliScriptCollectionSize(arrLit.elements.length);
        return arrLit.elements.map((el) =>
          this.evaluateExpression(
            robot,
            el,
            memory,
            getRobots,
            getObstacles,
            depth + 1,
          ),
        );
      }

      // Index access: arr[0] or obj["key"]
      case NodeType.IndexExpression: {
        const idxExpr = expression;
        const obj = this.evaluateExpression(
          robot,
          idxExpr.object,
          memory,
          getRobots,
          getObstacles,
          depth + 1,
        );
        const idx = this.evaluateExpression(
          robot,
          idxExpr.index,
          memory,
          getRobots,
          getObstacles,
          depth + 1,
        );
        if (Array.isArray(obj) && typeof idx === 'number') {
          const i = Math.floor(idx);
          if (i >= 0 && i < obj.length) return obj[i];
          return undefined;
        }
        if (obj !== null && typeof obj === 'object' && !Array.isArray(obj)) {
          const key = String(idx);
          if (isForbiddenAliScriptPropertyKey(key)) return undefined;
          return safeGetAliScriptProperty(obj as Record<string, unknown>, key);
        }
        return undefined;
      }

      // Object literal: { mode: "HUNT", target_id: 4 }
      case NodeType.ObjectLiteral: {
        const objLit = expression;
        assertAliScriptCollectionSize(objLit.properties.length);
        const result: Record<string, unknown> = createAliScriptDictionary();
        for (const prop of objLit.properties) {
          safeSetAliScriptProperty(
            result,
            prop.key,
            this.evaluateExpression(
              robot,
              prop.value,
              memory,
              getRobots,
              getObstacles,
              depth + 1,
            ),
          );
        }
        return result;
      }

      // Member (dot) access: state.mode
      case NodeType.MemberExpression: {
        const memExpr = expression;
        const target = this.evaluateExpression(
          robot,
          memExpr.object,
          memory,
          getRobots,
          getObstacles,
          depth + 1,
        );
        if (
          target !== null &&
          typeof target === 'object' &&
          !Array.isArray(target)
        ) {
          if (isForbiddenAliScriptPropertyKey(memExpr.property))
            return undefined;
          return safeGetAliScriptProperty(
            target as Record<string, unknown>,
            memExpr.property,
          );
        }
        return undefined;
      }

      default:
        return undefined;
    }
  }

}

// ── Built-in function dispatcher ─────────────────────────────────────────────
function evaluateBuiltinFunction(
  name: string,
  args: unknown[],
  memory: Record<string, unknown>,
  robot: Robot,
  getRobots: () => Robot[],
  getObstacles: () => Obstacle[],
): unknown {
  let result = evaluateMathFunction(name, args);
  if (result !== UNHANDLED) return result;

  result = evaluateArrayFunction(name, args);
  if (result !== UNHANDLED) return result;

  result = evaluateSensoryFunction(name, args, robot, getRobots, getObstacles);
  if (result !== UNHANDLED) return result;

  return evaluateCommunicationFunction(name, args, memory, robot, getRobots);
}
