import { SceneDef, makeRobot } from './types';

// EASY — 2x2 block grid (arr-01, arr-02)

const sc_arr01: SceneDef = {
  label: 'ECHO LATTICE — command array cycle',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.38, y: 0.38, w: 0.06, h: 0.06, type: 'SOLID' },
      { x: 0.62, y: 0.38, w: 0.06, h: 0.06, type: 'SOLID' },
      { x: 0.38, y: 0.62, w: 0.06, h: 0.06, type: 'SOLID' },
      { x: 0.62, y: 0.62, w: 0.06, h: 0.06, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_arr02: SceneDef = {
  label: 'SEQUENCE WALKER — strafe direction array',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.38, y: 0.33, w: 0.06, h: 0.06, type: 'SOLID' },
      { x: 0.62, y: 0.33, w: 0.06, h: 0.06, type: 'SOLID' },
      { x: 0.38, y: 0.67, w: 0.06, h: 0.06, type: 'SOLID' },
      { x: 0.62, y: 0.67, w: 0.06, h: 0.06, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

// MEDIUM — 3x3 sparse grid (arr-03, arr-04, arr-05)
// arr-05 enemy waypoints: (0.25,0.33) (0.75,0.33) (0.75,0.67) (0.25,0.67) — place grid columns at 0.4/0.5/0.6 only

const sc_arr03: SceneDef = {
  label: 'SWARM VECTOR — lowest-health targeting',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.35, y: 0.25, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.5,  y: 0.25, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.65, y: 0.25, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.35, y: 0.5,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.5,  y: 0.5,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.65, y: 0.5,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.35, y: 0.75, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.5,  y: 0.75, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.65, y: 0.75, w: 0.05, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.82, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_arr04: SceneDef = {
  label: 'BURST TABLE — [2,1,3,1] fire pattern',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.38, y: 0.25, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.5,  y: 0.25, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.62, y: 0.25, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.38, y: 0.5,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.5,  y: 0.5,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.62, y: 0.5,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.38, y: 0.75, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.5,  y: 0.75, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.62, y: 0.75, w: 0.05, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.4, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.6, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_arr05: SceneDef = {
  label: 'WAYPOINT RUNNER — rectangle corners',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.42, y: 0.25, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.5,  y: 0.25, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.58, y: 0.25, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.42, y: 0.5,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.5,  y: 0.5,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.58, y: 0.5,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.42, y: 0.75, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.5,  y: 0.75, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.58, y: 0.75, w: 0.05, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.82, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

// HARD — 2 rows of blocks (arr-06, arr-07, arr-08)

const sc_arr06: SceneDef = {
  label: 'PRIORITY QUEUE — closest target orbit',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.35, y: 0.33, w: 0.06, h: 0.06, type: 'SOLID' },
      { x: 0.5,  y: 0.33, w: 0.06, h: 0.06, type: 'SOLID' },
      { x: 0.65, y: 0.33, w: 0.06, h: 0.06, type: 'SOLID' },
      { x: 0.35, y: 0.67, w: 0.06, h: 0.06, type: 'SOLID' },
      { x: 0.5,  y: 0.67, w: 0.06, h: 0.06, type: 'SOLID' },
      { x: 0.65, y: 0.67, w: 0.06, h: 0.06, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.82, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_arr07: SceneDef = {
  label: 'OVERDRIVE MATRIX — speed multiplier array',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.32, y: 0.3, w: 0.06, h: 0.06, type: 'SOLID' },
      { x: 0.47, y: 0.3, w: 0.06, h: 0.06, type: 'SOLID' },
      { x: 0.62, y: 0.3, w: 0.06, h: 0.06, type: 'SOLID' },
      { x: 0.77, y: 0.3, w: 0.06, h: 0.06, type: 'SOLID' },
      { x: 0.32, y: 0.7, w: 0.06, h: 0.06, type: 'SOLID' },
      { x: 0.47, y: 0.7, w: 0.06, h: 0.06, type: 'SOLID' },
      { x: 0.62, y: 0.7, w: 0.06, h: 0.06, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.88, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_arr08: SceneDef = {
  label: 'TWIN ARRAYS — radii + burst counts',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.35, y: 0.28, w: 0.06, h: 0.06, type: 'SOLID' },
      { x: 0.5,  y: 0.28, w: 0.06, h: 0.06, type: 'SOLID' },
      { x: 0.65, y: 0.28, w: 0.06, h: 0.06, type: 'SOLID' },
      { x: 0.35, y: 0.72, w: 0.06, h: 0.06, type: 'SOLID' },
      { x: 0.5,  y: 0.72, w: 0.06, h: 0.06, type: 'SOLID' },
      { x: 0.65, y: 0.72, w: 0.06, h: 0.06, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.82, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

// EXTREME — dense grid with corridors (arr-09, arr-10)

const sc_arr09: SceneDef = {
  label: 'RING BUFFER — sliding window analysis',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.33, y: 0.2,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.44, y: 0.2,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.56, y: 0.2,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.67, y: 0.2,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.33, y: 0.38, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.44, y: 0.38, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.56, y: 0.38, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.67, y: 0.38, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.33, y: 0.62, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.44, y: 0.62, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.56, y: 0.62, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.67, y: 0.62, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.33, y: 0.8,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.44, y: 0.8,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.56, y: 0.8,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.67, y: 0.8,  w: 0.05, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.85, y: 0.3, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.13, y: 0.7, angle: 0.3, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_arr10: SceneDef = {
  label: 'ARRAY OVERLORD — RAYCAST filter + POP',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.33, y: 0.2,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.44, y: 0.2,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.56, y: 0.2,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.67, y: 0.2,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.33, y: 0.4,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.56, y: 0.4,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.33, y: 0.6,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.56, y: 0.6,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.33, y: 0.8,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.44, y: 0.8,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.56, y: 0.8,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.67, y: 0.8,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.44, y: 0.5,  w: 0.05, h: 0.05, type: 'LAVA' },
      { x: 0.67, y: 0.5,  w: 0.05, h: 0.05, type: 'LAVA' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.85, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.13, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
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
