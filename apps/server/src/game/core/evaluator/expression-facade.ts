import { Robot } from '@logic-arena/engine';
import {
  Expression, NodeType, Identifier, NumberLiteral, StringLiteral,
} from '../../../../../../packages/logic-parser/src';
import { resolveIdentifier } from './identifier-resolver';
import { evaluateBinary, evaluateUnary, evaluateComparison } from './operator-handlers';

export class ExpressionEvaluator {
  evaluateCondition(
    robot: Robot,
    expression: Expression,
    memory: Record<string, unknown>,
    getRobots: () => Robot[],
  ): boolean {
    const value = this.evaluateExpression(robot, expression, memory, getRobots);
    return typeof value === 'boolean' ? value : Boolean(value);
  }

  evaluateExpression(
    robot: Robot,
    expression: Expression,
    memory: Record<string, unknown>,
    getRobots: () => Robot[],
  ): unknown {
    switch (expression.type) {
      case NodeType.NumberLiteral:
      case NodeType.StringLiteral:
      case NodeType.BooleanLiteral:
        return expression.value;

      case NodeType.Identifier:
        return resolveIdentifier(robot, expression as Identifier | NumberLiteral | StringLiteral, memory);

      case NodeType.BinaryExpression: {
        const left = this.evaluateExpression(robot, expression.left, memory, getRobots);
        const right = this.evaluateExpression(robot, expression.right, memory, getRobots);
        return evaluateBinary(left, right, expression.operator);
      }

      case NodeType.UnaryExpression: {
        const arg = this.evaluateExpression(robot, expression.argument, memory, getRobots);
        return evaluateUnary(arg, expression.operator);
      }

      case NodeType.ComparisonExpression: {
        const lv = this.evaluateExpression(robot, expression.left, memory, getRobots);
        const rv = this.evaluateExpression(robot, expression.right, memory, getRobots);
        return evaluateComparison(lv, rv, expression.operator);
      }

      default:
        return undefined;
    }
  }
}
