import { PREVIEW_EVAL_INTERVAL, BATTLE_EVAL_INTERVAL, MAX_BATTLE_EVAL_TICKS, ENERGY_REGEN } from '../constants';
import { tickEvaluator } from '../miniEvaluator';
import type { EvalState } from '../miniEvaluator';
import type { SceneState } from '../scenes';
import { applyAction, type RuntimeArenaRobot } from '../combat/applyAction';
import { startFovSweep } from '../combat/fovSystem';

export function runEvalTick(
  state: SceneState,
  evals: Map<string, EvalState | null>,
  errors: Set<string>,
  nextId: { current: number },
  previewMode: boolean,
  battleEndedRef: { current: boolean },
  battleEvalTickRef: { current: number },
  fovTimerRef: Map<string, number>,
  onBattleEnd: ((winner: 'player' | 'enemy' | 'draw') => void) | null,
  evalTick: number,
): number {
  const evalInterval = previewMode ? PREVIEW_EVAL_INTERVAL : BATTLE_EVAL_INTERVAL;
  evalTick++;
  if (evalTick >= evalInterval) {
    evalTick = 0;
    if (!previewMode && !battleEndedRef.current) {
      battleEvalTickRef.current++;
      if (battleEvalTickRef.current >= MAX_BATTLE_EVAL_TICKS) {
        battleEndedRef.current = true;
        onBattleEnd?.('draw');
      }
    }

    for (const robot of state.robots) {
      if (previewMode && robot.id === 'player') continue;
      if (!robot.isAlive) {
        if (robot.respawnTimer > 0) robot.respawnTimer--;
        continue;
      }
      if (!previewMode && battleEndedRef.current) continue;

      if (robot.invulnerableTimer > 0) robot.invulnerableTimer--;
      if (robot.energy < robot.maxEnergy) robot.energy = Math.min(robot.maxEnergy, robot.energy + ENERGY_REGEN);

      const es = evals.get(robot.id);
      const hasErr = errors.has(robot.id);
      if (es && !hasErr) {
        const foe = state.robots.find(r => r.id !== robot.id);
        if (foe) {
          const action = tickEvaluator(es, robot, foe, state.projectiles, nextId);
          if (action) {
            if (action.type === 'scan' || action.type === 'fire' || action.type === 'burst') {
              startFovSweep(fovTimerRef, robot.id);
            }
            if (action.type === 'move') {
              (robot as RuntimeArenaRobot)._lastMoveAngle = robot.angle;
              (robot as RuntimeArenaRobot)._lastMoveValue = action.value;
              (robot as RuntimeArenaRobot)._lastMoveFast = action.fast;
            } else if (action.type === 'stop') {
              (robot as RuntimeArenaRobot)._lastMoveAngle = undefined;
            }
            applyAction(action, robot, state.projectiles, nextId);
          }
        }
      }
    }
  }
  return evalTick;
}
