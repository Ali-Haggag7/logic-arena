import { Robot } from "@logic-arena/engine";
import { Parser } from "../../../../../packages/logic-parser/src";
import { LogicEvaluator } from "../../game/core/evaluator/logic-evaluator";

const ROBOT_COLORS = ["#00ffff", "#ff00ff"];

export function createRobot(id: string, script: string, index: number): Robot {
    return {
        id,
        position: { x: Math.random() * 800, y: Math.random() * 600 },
        health: 100,
        color: ROBOT_COLORS[index % ROBOT_COLORS.length],
        velocity: { x: 0, y: 0 },
        rotation: 0,
        isAlive: true,
        team: index % 2 === 0 ? "A" : "B",
        lastActionTime: 0,
        code: script,
        memory: {},
    };
}

export function parseAndSetLogic(id: string, script: string, logicEvaluator: LogicEvaluator): void {
    try {
        const parser = new Parser(script);
        const ast = parser.parse();
        logicEvaluator.setLogic(id, ast);
    } catch (e) {
        console.error(`Error parsing script for robot ${id}:`, e);
    }
}