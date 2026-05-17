import { SceneDef, makeRobot } from './types';

const sc_arr01: SceneDef = {
  label: 'ECHO LATTICE — fixed sensor array',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.3, y: 0.2, w: 0.02, h: 0.06, type: 'SOLID' },
      { x: 0.4, y: 0.2, w: 0.02, h: 0.06, type: 'SOLID' },
      { x: 0.5, y: 0.2, w: 0.02, h: 0.06, type: 'SOLID' },
      { x: 0.6, y: 0.2, w: 0.02, h: 0.06, type: 'SOLID' },
      { x: 0.7, y: 0.2, w: 0.02, h: 0.06, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.75, y: 0.6, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.38, y: 0.4, angle: 0.2, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_arr02: SceneDef = {
  label: 'SEQUENCE WALKER — command array',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.7, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.38, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_arr03: SceneDef = {
  label: 'SWARM VECTOR — visible enemy list',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.3, y: 0.5, w: 0.02, h: 0.3, type: 'SOLID' },
      { x: 0.7, y: 0.5, w: 0.02, h: 0.3, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.38, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_arr04: SceneDef = {
  label: 'BURST TABLE — fire count array',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.5, y: 0.5, w: 0.04, h: 0.04, type: 'TRAP' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.75, y: 0.4, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.38, y: 0.6, angle: 0.1, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_arr05: SceneDef = {
  label: 'WAYPOINT RUNNER — step waypoints',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.4, y: 0.3, w: 0.02, h: 0.02, type: 'LAVA' },
      { x: 0.55, y: 0.3, w: 0.02, h: 0.02, type: 'LAVA' },
      { x: 0.7, y: 0.3, w: 0.02, h: 0.02, type: 'LAVA' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.72, y: 0.6, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.38, y: 0.4, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_arr06: SceneDef = {
  label: 'PRIORITY QUEUE — sorted threats',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.5, y: 0.25, w: 0.3, h: 0.02, type: 'SOLID' },
      { x: 0.5, y: 0.75, w: 0.3, h: 0.02, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.38, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_arr07: SceneDef = {
  label: 'OVERDRIVE MATRIX — 9-cell grid',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.35, y: 0.35, w: 0.02, h: 0.02, type: 'SOLID' },
      { x: 0.5, y: 0.35, w: 0.02, h: 0.02, type: 'SOLID' },
      { x: 0.65, y: 0.35, w: 0.02, h: 0.02, type: 'SOLID' },
      { x: 0.35, y: 0.5, w: 0.02, h: 0.02, type: 'SOLID' },
      { x: 0.5, y: 0.5, w: 0.02, h: 0.02, type: 'SOLID' },
      { x: 0.65, y: 0.5, w: 0.02, h: 0.02, type: 'SOLID' },
      { x: 0.35, y: 0.65, w: 0.02, h: 0.02, type: 'SOLID' },
      { x: 0.5, y: 0.65, w: 0.02, h: 0.02, type: 'SOLID' },
      { x: 0.65, y: 0.65, w: 0.02, h: 0.02, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.8, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.38, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_arr08: SceneDef = {
  label: 'TWIN ARRAYS — cross-reference',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.4, y: 0.5, w: 0.02, h: 0.35, type: 'SOLID' },
      { x: 0.6, y: 0.5, w: 0.02, h: 0.35, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.75, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.38, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_arr09: SceneDef = {
  label: 'RING BUFFER — circular memory',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.5, y: 0.5, w: 0.06, h: 0.06, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.3, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.38, y: 0.7, angle: 0.3, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_arr10: SceneDef = {
  label: 'ARRAY OVERLORD — dynamic fire plan',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.3, y: 0.5, w: 0.02, h: 0.4, type: 'LAVA' },
      { x: 0.7, y: 0.5, w: 0.02, h: 0.4, type: 'LAVA' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.82, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.38, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

export const ARRAY_SCENES: Record<string, SceneDef> = {
  'arr-01': sc_arr01, 'arr-02': sc_arr02, 'arr-03': sc_arr03,
  'arr-04': sc_arr04, 'arr-05': sc_arr05, 'arr-06': sc_arr06,
  'arr-07': sc_arr07, 'arr-08': sc_arr08, 'arr-09': sc_arr09,
  'arr-10': sc_arr10,
};
