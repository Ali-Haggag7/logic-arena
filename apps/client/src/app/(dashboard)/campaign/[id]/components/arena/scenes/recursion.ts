import { SceneDef, makeRobot } from './types';

// EASY — 2 symmetric pillars (rec-01, rec-02)

const sc_rec01: SceneDef = {
  label: 'ECHO PULSE — depth 2 oscillate',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.5, y: 0.3, w: 0.06, h: 0.06, type: 'SOLID' },
      { x: 0.5, y: 0.7, w: 0.06, h: 0.06, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_rec02: SceneDef = {
  label: 'DOUBLE ECHO — depth 3 wind/unwind',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.5, y: 0.28, w: 0.06, h: 0.06, type: 'SOLID' },
      { x: 0.5, y: 0.72, w: 0.06, h: 0.06, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.35, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.65, angle: 0.2, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

// MEDIUM — nested square obstacles (rec-03, rec-04, rec-05)

const sc_rec03: SceneDef = {
  label: 'DEPTH CHARGE — increasing max depth',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.5,  y: 0.5,  w: 0.08, h: 0.08, type: 'SOLID' },
      { x: 0.4,  y: 0.4,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.6,  y: 0.4,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.4,  y: 0.6,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.6,  y: 0.6,  w: 0.05, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_rec04: SceneDef = {
  label: 'MIRROR RECURSION — symmetric fire',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.5,  y: 0.5,  w: 0.08, h: 0.08, type: 'SOLID' },
      { x: 0.38, y: 0.38, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.62, y: 0.38, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.38, y: 0.62, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.62, y: 0.62, w: 0.05, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_rec05: SceneDef = {
  label: 'FIBONACCI STRIKER — 1,1,2,3,5 gaps',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.5,  y: 0.5,  w: 0.09, h: 0.09, type: 'SOLID' },
      { x: 0.36, y: 0.36, w: 0.06, h: 0.06, type: 'SOLID' },
      { x: 0.64, y: 0.36, w: 0.06, h: 0.06, type: 'SOLID' },
      { x: 0.36, y: 0.64, w: 0.06, h: 0.06, type: 'SOLID' },
      { x: 0.64, y: 0.64, w: 0.06, h: 0.06, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.80, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

// HARD — fractal-like L-shapes (rec-06, rec-07, rec-08)

const sc_rec06: SceneDef = {
  label: 'TOWER OF POWER — push/pop stack frames',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.42, y: 0.38, w: 0.05, h: 0.20, type: 'SOLID' },
      { x: 0.55, y: 0.38, w: 0.14, h: 0.05, type: 'SOLID' },
      { x: 0.58, y: 0.62, w: 0.05, h: 0.20, type: 'SOLID' },
      { x: 0.45, y: 0.75, w: 0.14, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.3, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.7, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_rec07: SceneDef = {
  label: 'BINARY SPLITTER — left/right branch',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.4,  y: 0.35, w: 0.05, h: 0.20, type: 'SOLID' },
      { x: 0.52, y: 0.35, w: 0.15, h: 0.05, type: 'SOLID' },
      { x: 0.6,  y: 0.65, w: 0.05, h: 0.20, type: 'SOLID' },
      { x: 0.48, y: 0.77, w: 0.15, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_rec08: SceneDef = {
  label: 'FRACTAL STORM — jagged orbit pattern',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.38, y: 0.30, w: 0.05, h: 0.24, type: 'SOLID' },
      { x: 0.51, y: 0.30, w: 0.16, h: 0.05, type: 'SOLID' },
      { x: 0.62, y: 0.70, w: 0.05, h: 0.24, type: 'SOLID' },
      { x: 0.49, y: 0.79, w: 0.16, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.80, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

// EXTREME — recursive corner barriers (rec-09, rec-10)

const sc_rec09: SceneDef = {
  label: 'CALL STACK OVERLOAD — ghost trail replay',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.28, y: 0.28, w: 0.05, h: 0.18, type: 'SOLID' },
      { x: 0.28, y: 0.28, w: 0.18, h: 0.05, type: 'SOLID' },
      { x: 0.72, y: 0.28, w: 0.05, h: 0.18, type: 'SOLID' },
      { x: 0.72, y: 0.28, w: 0.18, h: 0.05, type: 'SOLID' },
      { x: 0.28, y: 0.72, w: 0.05, h: 0.18, type: 'SOLID' },
      { x: 0.28, y: 0.72, w: 0.18, h: 0.05, type: 'SOLID' },
      { x: 0.72, y: 0.72, w: 0.05, h: 0.18, type: 'SOLID' },
      { x: 0.72, y: 0.72, w: 0.18, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.82, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_rec10: SceneDef = {
  label: 'OMEGA UNWIND — dual entangled vars',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.27, y: 0.27, w: 0.05, h: 0.20, type: 'SOLID' },
      { x: 0.27, y: 0.27, w: 0.20, h: 0.05, type: 'SOLID' },
      { x: 0.73, y: 0.27, w: 0.05, h: 0.20, type: 'SOLID' },
      { x: 0.73, y: 0.27, w: 0.20, h: 0.05, type: 'SOLID' },
      { x: 0.27, y: 0.73, w: 0.05, h: 0.20, type: 'SOLID' },
      { x: 0.27, y: 0.73, w: 0.20, h: 0.05, type: 'SOLID' },
      { x: 0.73, y: 0.73, w: 0.05, h: 0.20, type: 'SOLID' },
      { x: 0.73, y: 0.73, w: 0.20, h: 0.05, type: 'SOLID' },
      { x: 0.5,  y: 0.5,  w: 0.07, h: 0.07, type: 'LAVA' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.82, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

export const RECURSION_SCENES: Record<string, SceneDef> = {
  'rec-01': sc_rec01, 'rec-02': sc_rec02, 'rec-03': sc_rec03,
  'rec-04': sc_rec04, 'rec-05': sc_rec05, 'rec-06': sc_rec06,
  'rec-07': sc_rec07, 'rec-08': sc_rec08, 'rec-09': sc_rec09,
  'rec-10': sc_rec10,
};
