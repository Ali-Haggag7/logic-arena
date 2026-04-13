import { Robot } from "@logic-arena/engine";
import { Expression, NodeType, Identifier, NumberLiteral, StringLiteral } from "../../../../../../packages/logic-parser/src";
import { CombatMath } from "../combat-math";

export class ExpressionEvaluator {
    evaluateCondition(robotId: string, robot: Robot, expression: Expression, memory: Map<string, Map<string, any>>, getRobots: () => Robot[]): boolean {
        const value = this.evaluateExpression(robotId, robot, expression, memory, getRobots);
        return typeof value === "boolean" ? value : Boolean(value);
    }

    evaluateExpression(robotId: string, robot: Robot, expression: Expression, memory: Map<string, Map<string, any>>, getRobots: () => Robot[]): any {
        switch (expression.type) {
            case NodeType.NumberLiteral:
            case NodeType.StringLiteral:
            case NodeType.BooleanLiteral:
                return expression.value;
            case NodeType.Identifier:
                return this.resolveValue(robotId, robot, expression, memory, getRobots);
            case NodeType.BinaryExpression: {
                const left = this.evaluateExpression(robotId, robot, expression.left, memory, getRobots);
                const right = this.evaluateExpression(robotId, robot, expression.right, memory, getRobots);
                if (typeof left !== "number" || typeof right !== "number") return undefined;
                return expression.operator === "+" ? left + right : left - right;
            }
            case NodeType.UnaryExpression: {
                const argument = this.evaluateExpression(robotId, robot, expression.argument, memory, getRobots);
                return expression.operator === "NOT" ? !Boolean(argument) : undefined;
            }
            case NodeType.ComparisonExpression: {
                const leftValue = this.evaluateExpression(robotId, robot, expression.left, memory, getRobots);
                const rightValue = this.evaluateExpression(robotId, robot, expression.right, memory, getRobots);
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

    private resolveValue(robotId: string, robot: Robot, node: Identifier | NumberLiteral | StringLiteral, memory: Map<string, Map<string, any>>, getRobots: () => Robot[]): any {
        if (node.type === NodeType.NumberLiteral || node.type === NodeType.StringLiteral) {
            return node.value;
        }
        if (node.type === NodeType.Identifier) {
            const mem = memory.get(robotId);
            if (mem && mem.has(node.value)) return mem.get(node.value);
            const target = CombatMath.getClosestTarget(robot, getRobots());
            switch (node.value) {
                case "distance":
                    if (target) {
                        const dx = robot.position.x - target.position.x;
                        const dy = robot.position.y - target.position.y;
                        return Math.sqrt(dx * dx + dy * dy);
                    }
                    return Infinity;
                case "health": return robot.health;
                case "rotation": return robot.rotation;
                case "target_vx": return target ? target.velocity.x : 0;
                case "target_vy": return target ? target.velocity.y : 0;
                case "bullet_speed": return 400;
                case "spotted": return CombatMath.isTargetSpotted(robot, target);
                default: return undefined;
            }
        }
        return undefined;
    }
}