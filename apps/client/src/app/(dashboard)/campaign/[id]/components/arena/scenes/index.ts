export type {
  ArenaRobot, ArenaProjectile, ArenaObstacle,
  SceneLocal, SceneState, SceneDef,
} from './types';
export { TAU, clamp, makeRobot } from './types';

import type { SceneDef } from './types';
import { CONDITIONAL_SCENES } from './conditionals';
import { LOOP_SCENES } from './loops';
import { ARRAY_SCENES } from './arrays';
import { DATA_STRUCTURE_SCENES } from './data-structures';
import { RECURSION_SCENES } from './recursion';
import { GRAPH_THEORY_SCENES } from './graph-theory';

export { NODES_6 } from './graph-theory';

const SCENE_REGISTRY: Record<string, SceneDef> = {
  ...CONDITIONAL_SCENES,
  ...LOOP_SCENES,
  ...ARRAY_SCENES,
  ...DATA_STRUCTURE_SCENES,
  ...RECURSION_SCENES,
  ...GRAPH_THEORY_SCENES,
};

export function getSceneForLevel(levelId: string): SceneDef | null {
  let def = SCENE_REGISTRY[levelId];
  if (!def) {
    const prefix = levelId.split('-')[0];
    const fallback: Record<string, SceneDef> = {
      'cond': CONDITIONAL_SCENES['cond-01'],
      'loop': LOOP_SCENES['loop-01'],
      'arr': ARRAY_SCENES['arr-01'],
      'ds': DATA_STRUCTURE_SCENES['ds-01'],
      'rec': RECURSION_SCENES['rec-01'],
      'gfx': GRAPH_THEORY_SCENES['gfx-01'],
    };
    def = fallback[prefix] ?? null;
  }
  return def;
}
