import { SceneDef, makeRobot } from './types';

// EASY — single dividing wall with gap (ds-01, ds-02)

const sc_ds01: SceneDef = {
  label: 'STATE MACHINE — mode: PATROL / ENGAGE',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.5, y: 0.25, w: 0.05, h: 0.35, type: 'SOLID' },
      { x: 0.5, y: 0.75, w: 0.05, h: 0.35, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_ds02: SceneDef = {
  label: 'CONFIG OBJECT — dict parameters',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.5, y: 0.17, w: 0.05, h: 0.25, type: 'SOLID' },
      { x: 0.5, y: 0.83, w: 0.05, h: 0.25, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

// MEDIUM — 2 zones (ds-03, ds-04, ds-05)

const sc_ds03: SceneDef = {
  label: 'COUNTER MAP — sighting ratio',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.5, y: 0.5, w: 0.05, h: 0.60, type: 'SOLID' },
      { x: 0.33, y: 0.5, w: 0.05, h: 0.35, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_ds04: SceneDef = {
  label: 'PHASE SHIFTER — lock, travel, burst',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.42, y: 0.5, w: 0.05, h: 0.60, type: 'SOLID' },
      { x: 0.60, y: 0.5, w: 0.05, h: 0.60, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.80, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_ds05: SceneDef = {
  label: 'NEMESIS PROTOCOL — velocity delta',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.5,  y: 0.5,  w: 0.05, h: 0.65, type: 'SOLID' },
      { x: 0.35, y: 0.28, w: 0.05, h: 0.28, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.80, y: 0.3, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.7, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

// HARD — 3-room layout (ds-06, ds-07, ds-08)

const sc_ds06: SceneDef = {
  label: 'DUAL REGISTER — atk + def dicts',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.38, y: 0.5, w: 0.05, h: 0.60, type: 'SOLID' },
      { x: 0.62, y: 0.5, w: 0.05, h: 0.60, type: 'SOLID' },
      { x: 0.5,  y: 0.17, w: 0.25, h: 0.05, type: 'SOLID' },
      { x: 0.5,  y: 0.83, w: 0.25, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_ds07: SceneDef = {
  label: 'INVENTORY SYSTEM — ammo + heat',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.35, y: 0.5, w: 0.05, h: 0.55, type: 'SOLID' },
      { x: 0.60, y: 0.5, w: 0.05, h: 0.55, type: 'SOLID' },
      { x: 0.47, y: 0.25, w: 0.27, h: 0.05, type: 'SOLID' },
      { x: 0.47, y: 0.75, w: 0.27, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.80, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_ds08: SceneDef = {
  label: 'NEURAL MAP — quadrant learning',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.38, y: 0.5, w: 0.05, h: 0.70, type: 'SOLID' },
      { x: 0.65, y: 0.5, w: 0.05, h: 0.70, type: 'SOLID' },
      { x: 0.5,  y: 0.2, w: 0.30, h: 0.05, type: 'SOLID' },
      { x: 0.5,  y: 0.8, w: 0.30, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.82, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

// EXTREME — maze-like corridors (ds-09, ds-10)

const sc_ds09: SceneDef = {
  label: 'COMMAND STACK — task queue dict',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.38, y: 0.33, w: 0.05, h: 0.50, type: 'SOLID' },
      { x: 0.62, y: 0.67, w: 0.05, h: 0.50, type: 'SOLID' },
      { x: 0.5,  y: 0.17, w: 0.25, h: 0.05, type: 'SOLID' },
      { x: 0.5,  y: 0.83, w: 0.25, h: 0.05, type: 'SOLID' },
      { x: 0.5,  y: 0.5,  w: 0.05, h: 0.22, type: 'LAVA' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.80, y: 0.3, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.7, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_ds10: SceneDef = {
  label: 'OVERLORD SYSTEM — subsystems fail',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.35, y: 0.5,  w: 0.05, h: 0.65, type: 'SOLID' },
      { x: 0.60, y: 0.5,  w: 0.05, h: 0.65, type: 'SOLID' },
      { x: 0.47, y: 0.22, w: 0.27, h: 0.05, type: 'SOLID' },
      { x: 0.47, y: 0.78, w: 0.27, h: 0.05, type: 'SOLID' },
      { x: 0.47, y: 0.5,  w: 0.27, h: 0.05, type: 'LAVA' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.82, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

export const DATA_STRUCTURE_SCENES: Record<string, SceneDef> = {
  'ds-01': sc_ds01, 'ds-02': sc_ds02, 'ds-03': sc_ds03,
  'ds-04': sc_ds04, 'ds-05': sc_ds05, 'ds-06': sc_ds06,
  'ds-07': sc_ds07, 'ds-08': sc_ds08, 'ds-09': sc_ds09,
  'ds-10': sc_ds10,
};
