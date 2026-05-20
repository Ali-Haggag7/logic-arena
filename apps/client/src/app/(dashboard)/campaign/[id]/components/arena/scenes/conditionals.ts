import { SceneDef, makeRobot } from './types';

// EASY — no obstacles (cond-01, cond-02)

const sc_cond01: SceneDef = {
  label: 'BINARY REFLEX — patrol stops and fires',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_cond02: SceneDef = {
  label: 'MIRROR PROTOCOL — symmetry combat',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff8080' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

// MEDIUM — 1-2 cover pillars (cond-03, cond-04, cond-05)

const sc_cond03: SceneDef = {
  label: 'SENTINEL OVERRIDE — nested distance gate',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.5, y: 0.5, w: 0.06, h: 0.16, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_cond04: SceneDef = {
  label: 'FORKED JUDGMENT — three thresholds',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.38, y: 0.3, w: 0.06, h: 0.16, type: 'SOLID' },
      { x: 0.62, y: 0.7, w: 0.06, h: 0.16, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.3, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.7, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_cond05: SceneDef = {
  label: 'THRESHOLD GATE — health-gated behavior',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.5, y: 0.33, w: 0.06, h: 0.16, type: 'SOLID' },
      { x: 0.5, y: 0.67, w: 0.06, h: 0.16, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

// HARD — L-shaped walls (cond-06, cond-07, cond-08)

const sc_cond06: SceneDef = {
  label: 'POLARITY SWITCH — damage flips state',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.5,  y: 0.33, w: 0.16, h: 0.05, type: 'SOLID' },
      { x: 0.42, y: 0.42, w: 0.05, h: 0.14, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.3, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.7, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_cond07: SceneDef = {
  label: 'CASCADE REACTOR — 3-deep decision tree',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.42, y: 0.38, w: 0.05, h: 0.18, type: 'SOLID' },
      { x: 0.55, y: 0.38, w: 0.14, h: 0.05, type: 'SOLID' },
      { x: 0.58, y: 0.62, w: 0.05, h: 0.18, type: 'SOLID' },
      { x: 0.45, y: 0.75, w: 0.14, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_cond08: SceneDef = {
  label: 'DEAD RECKONING — threat level counter',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.38, y: 0.38, w: 0.05, h: 0.22, type: 'SOLID' },
      { x: 0.50, y: 0.38, w: 0.14, h: 0.05, type: 'SOLID' },
      { x: 0.62, y: 0.62, w: 0.05, h: 0.22, type: 'SOLID' },
      { x: 0.50, y: 0.75, w: 0.14, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.3, angle: Math.PI * 0.75, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.7, angle: 0.5, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

// EXTREME — central pillar cluster (cond-09, cond-10)

const sc_cond09: SceneDef = {
  label: 'QUANTUM OBSERVER — 4-deep condition tree',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.5,  y: 0.5,  w: 0.07, h: 0.07, type: 'SOLID' },
      { x: 0.38, y: 0.38, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.62, y: 0.38, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.38, y: 0.62, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.62, y: 0.62, w: 0.05, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.4, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.6, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_cond10: SceneDef = {
  label: 'ARBITER PRIME — priority encoder',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.5,  y: 0.5,  w: 0.07, h: 0.07, type: 'SOLID' },
      { x: 0.38, y: 0.38, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.62, y: 0.38, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.38, y: 0.62, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.62, y: 0.62, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.5,  y: 0.25, w: 0.05, h: 0.05, type: 'LAVA' },
      { x: 0.5,  y: 0.75, w: 0.05, h: 0.05, type: 'LAVA' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.82, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

export const CONDITIONAL_SCENES: Record<string, SceneDef> = {
  'cond-01': sc_cond01, 'cond-02': sc_cond02, 'cond-03': sc_cond03,
  'cond-04': sc_cond04, 'cond-05': sc_cond05, 'cond-06': sc_cond06,
  'cond-07': sc_cond07, 'cond-08': sc_cond08, 'cond-09': sc_cond09,
  'cond-10': sc_cond10,
};
