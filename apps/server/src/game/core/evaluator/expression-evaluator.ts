import { Robot } from "@logic-arena/engine";
import { Expression, NodeType, Identifier, NumberLiteral, StringLiteral } from "../../../../../../packages/logic-parser/src";
import { CombatMath } from "../combat-math";

export class ExpressionEvaluator {
    evaluateCondition(robot: Robot, expression: Expression, memory: Record<string, any>, getRobots: () => Robot[]): boolean {
        const value = this.evaluateExpression(robot, expression, memory, getRobots);
        return typeof value === "boolean" ? value : Boolean(value);
    }

    evaluateExpression(robot: Robot, expression: Expression, memory: Record<string, any>, getRobots: () => Robot[]): any {
        switch (expression.type) {
            case NodeType.NumberLiteral:
            case NodeType.StringLiteral:
            case NodeType.BooleanLiteral:
                return expression.value;
            case NodeType.Identifier:
                return this.resolveValue(robot, expression, memory, getRobots);
            case NodeType.BinaryExpression: {
                const left = this.evaluateExpression(robot, expression.left, memory, getRobots);
                const right = this.evaluateExpression(robot, expression.right, memory, getRobots);
                if (typeof left !== "number" || typeof right !== "number") return undefined;
                switch (expression.operator) {
                    case "+": return left + right;
                    case "-": return left - right;
                    case "*": return left * right;
                    case "/": return right !== 0 ? left / right : 0;
                    case "%": return right !== 0 ? left % right : 0;
                }
                return undefined;
            }
            case NodeType.UnaryExpression: {
                const argument = this.evaluateExpression(robot, expression.argument, memory, getRobots);
                return expression.operator === "NOT" ? !Boolean(argument) : undefined;
            }
            case NodeType.ComparisonExpression: {
                const leftValue = this.evaluateExpression(robot, expression.left, memory, getRobots);
                const rightValue = this.evaluateExpression(robot, expression.right, memory, getRobots);
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

    private resolveValue(robot: Robot, node: Identifier | NumberLiteral | StringLiteral, memory: Record<string, any>, getRobots: () => Robot[]): any {
        if (node.type === NodeType.NumberLiteral || node.type === NodeType.StringLiteral) return node.value;
        if (node.type === NodeType.Identifier) {
            if (node.value in memory) return memory[node.value];
            const target = CombatMath.getClosestTarget(robot, getRobots());
            switch (node.value) {
                case "distance":
                    if (!target) return Infinity;
                    const dx = robot.position.x - target.position.x;
                    const dy = robot.position.y - target.position.y;
                    return Math.hypot(dx, dy);
                case "health": return robot.health;
                case "rotation": return robot.rotation;
                case "target_vx": return target?.velocity.x || 0;
                case "target_vy": return target?.velocity.y || 0;
                case "bullet_speed": return 400;
                case "spotted": return CombatMath.isTargetSpotted(robot, target);
                default: return undefined;
            }
        }
    }
}