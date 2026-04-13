import { GameLoop } from "@logic-arena/engine";
import { ActionExecutor } from "../../game/core/action-executor";
import { Pathfinder } from "../../game/core/pathfinder";
import { LogicEvaluator } from "../../game/core/evaluator/logic-evaluator";

export interface GameDependencies {
    pathfinder: Pathfinder;
    actionExecutor: ActionExecutor;
    logicEvaluator: LogicEvaluator;
}

export function createGameDependencies(gameLoop: GameLoop): GameDependencies {
    const pathfinder = new Pathfinder(gameLoop);
    const actionExecutor = new ActionExecutor(gameLoop, new Map(), pathfinder);
    const logicEvaluator = new LogicEvaluator(gameLoop, actionExecutor);
    return { pathfinder, actionExecutor, logicEvaluator };
}