import type { SceneScript } from '../sceneScriptEngine';
import { CONDITIONAL_SCRIPTS } from './conditionals';
import { LOOP_SCRIPTS } from './loops';
import { ARRAY_SCRIPTS } from './arrays';
import { DATA_STRUCTURE_SCRIPTS } from './data-structures';
import { RECURSION_SCRIPTS } from './recursion';
import { GRAPH_THEORY_SCRIPTS } from './graph-theory';

export const SCRIPTS: Record<string, SceneScript> = {
  ...CONDITIONAL_SCRIPTS,
  ...LOOP_SCRIPTS,
  ...ARRAY_SCRIPTS,
  ...DATA_STRUCTURE_SCRIPTS,
  ...RECURSION_SCRIPTS,
  ...GRAPH_THEORY_SCRIPTS,
};
