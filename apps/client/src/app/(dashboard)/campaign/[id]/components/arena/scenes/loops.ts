import { SceneDef, makeRobot } from './types';

// EASY — 2 side pillars (loop-01, loop-02)
// loop-02 enemy waypoints: (0.25,0.5) and (0.75,0.5) — pillars placed top/bottom, not on waypoints

const sc_loop01: SceneDef = {
  label: 'PULSE DRUM — 5 shots then move',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.38, y: 0.22, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.62, y: 0.78, w: 0.05, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_loop02: SceneDef = {
  label: 'PATROL CIRCUIT — waypoint shuttling',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.5, y: 0.17, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.5, y: 0.83, w: 0.05, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.75, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

// MEDIUM — 4 corner pillars (loop-03, loop-04, loop-05)
// loop-05 enemy waypoints: (0.25,0.25) (0.75,0.25) (0.75,0.75) (0.25,0.75) — pillars placed near center

const sc_loop03: SceneDef = {
  label: 'ADAPTIVE VORTEX — orbit direction flip',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.25, y: 0.25, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.75, y: 0.25, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.25, y: 0.75, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.75, y: 0.75, w: 0.05, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.35, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.65, angle: 0.3, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_loop04: SceneDef = {
  label: 'RAMP PROTOCOL — escalating shot count',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.3,  y: 0.25, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.7,  y: 0.25, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.3,  y: 0.75, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.7,  y: 0.75, w: 0.05, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_loop05: SceneDef = {
  label: 'SEEK AND DESTROY — 4-waypoint scan',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.5,  y: 0.5,  w: 0.07, h: 0.07, type: 'SOLID' },
      { x: 0.38, y: 0.17, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.62, y: 0.17, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.38, y: 0.83, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.62, y: 0.83, w: 0.05, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.82, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

// HARD — 2 horizontal barriers (loop-06, loop-07, loop-08)

const sc_loop06: SceneDef = {
  label: 'ECHO CHAMBER — nested loops',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.45, y: 0.28, w: 0.35, h: 0.05, type: 'SOLID' },
      { x: 0.55, y: 0.72, w: 0.35, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_loop07: SceneDef = {
  label: 'DECIMATOR MK-IV — sight counter overdrive',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.42, y: 0.25, w: 0.38, h: 0.05, type: 'SOLID' },
      { x: 0.58, y: 0.75, w: 0.38, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.65, angle: Math.PI * 0.8, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.35, angle: 0.2, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_loop08: SceneDef = {
  label: 'SINE WAVE — phase oscillation',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.38, y: 0.22, w: 0.30, h: 0.05, type: 'SOLID' },
      { x: 0.62, y: 0.78, w: 0.30, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.78, y: 0.5, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

// EXTREME — cross-shaped barriers (loop-09, loop-10)

const sc_loop09: SceneDef = {
  label: 'CONVERGENCE ENGINE — counters meet',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.5, y: 0.5,  w: 0.40, h: 0.05, type: 'SOLID' },
      { x: 0.5, y: 0.5,  w: 0.05, h: 0.40, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.82, y: 0.25, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.75, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_loop10: SceneDef = {
  label: 'INFINITE NEMESIS — evolution per 3 hits',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.5, y: 0.5,  w: 0.44, h: 0.05, type: 'SOLID' },
      { x: 0.5, y: 0.5,  w: 0.05, h: 0.44, type: 'SOLID' },
      { x: 0.5, y: 0.28, w: 0.05, h: 0.05, type: 'LAVA' },
      { x: 0.5, y: 0.72, w: 0.05, h: 0.05, type: 'LAVA' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.82, y: 0.25, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.75, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

export const LOOP_SCENES: Record<string, SceneDef> = {
  'loop-01': sc_loop01, 'loop-02': sc_loop02, 'loop-03': sc_loop03,
  'loop-04': sc_loop04, 'loop-05': sc_loop05, 'loop-06': sc_loop06,
  'loop-07': sc_loop07, 'loop-08': sc_loop08, 'loop-09': sc_loop09,
  'loop-10': sc_loop10,
};
