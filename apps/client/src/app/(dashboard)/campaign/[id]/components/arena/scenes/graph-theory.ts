import { SceneDef, makeRobot } from './types';

export const NODES_6 = [
  { x: 0.5, y: 0.5 }, { x: 0.65, y: 0.3 }, { x: 0.8, y: 0.55 },
  { x: 0.7, y: 0.75 }, { x: 0.55, y: 0.8 }, { x: 0.75, y: 0.2 },
];

// EASY — minimal obstacles (gfx-01, gfx-02)
// Enemies start/walk at node coords — no obstacles near nodes

const sc_gfx01: SceneDef = {
  label: 'NODE WALKER — linear DAG chain',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.5, y: 0.5, angle: 0, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_gfx02: SceneDef = {
  label: 'EDGE CRAWLER — Hamiltonian cycle',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.28, y: 0.5, w: 0.05, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.5, y: 0.5, angle: 0, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

// MEDIUM — 3 node-pillars (gfx-03, gfx-04, gfx-05)
// Place pillars away from NODES_6 coords — use left side only

const sc_gfx03: SceneDef = {
  label: 'BREADTH SCANNER — star graph',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.28, y: 0.25, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.28, y: 0.5,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.28, y: 0.75, w: 0.05, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.5, y: 0.5, angle: 0, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_gfx04: SceneDef = {
  label: 'DEPTH PROBE — DFS with RAYCAST',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.28, y: 0.2, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.28, y: 0.5, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.28, y: 0.8, w: 0.05, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.5, y: 0.5, angle: 0, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_gfx05: SceneDef = {
  label: 'CYCLE DETECTOR — figure-8 graph',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.27, y: 0.28, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.27, y: 0.5,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.27, y: 0.72, w: 0.05, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.5, y: 0.5, angle: 0, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.65, angle: 0.3, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

// HARD — 5 node-pillars in star pattern (gfx-06, gfx-07, gfx-08)
// Pillars placed on left half only, away from NODES_6

const sc_gfx06: SceneDef = {
  label: 'SHORTEST PATH — greedy grid approach',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.27, y: 0.17, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.35, y: 0.38, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.27, y: 0.5,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.35, y: 0.62, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.27, y: 0.83, w: 0.05, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.5, y: 0.5, angle: 0, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_gfx07: SceneDef = {
  label: 'SPANNING TREE — perimeter collapse',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.26, y: 0.17, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.33, y: 0.35, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.26, y: 0.5,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.33, y: 0.65, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.26, y: 0.83, w: 0.05, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.5, y: 0.5, angle: 0, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.7, angle: 0.2, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_gfx08: SceneDef = {
  label: 'TOPOLOGICAL STRIKE — tiered unlocks',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.25, y: 0.15, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.34, y: 0.32, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.25, y: 0.5,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.34, y: 0.68, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.25, y: 0.85, w: 0.05, h: 0.05, type: 'SOLID' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.75, y: 0.2, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

// EXTREME — full node network layout (gfx-09, gfx-10)
// Dense pillar network on left half; nodes on right half remain clear

const sc_gfx09: SceneDef = {
  label: 'DIJKSTRA DAEMON — weighted targeting',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.23, y: 0.17, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.32, y: 0.30, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.23, y: 0.43, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.32, y: 0.57, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.23, y: 0.70, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.32, y: 0.83, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.23, y: 0.5,  w: 0.05, h: 0.33, type: 'LAVA' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.5, y: 0.5, angle: 0, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

const sc_gfx10: SceneDef = {
  label: 'NETWORK ORACLE — 3x3 grid prediction',
  init: () => ({
    tick: 0, nextProjId: 0, obstacles: [
      { x: 0.23, y: 0.17, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.32, y: 0.28, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.23, y: 0.39, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.32, y: 0.5,  w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.23, y: 0.61, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.32, y: 0.72, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.23, y: 0.83, w: 0.05, h: 0.05, type: 'SOLID' },
      { x: 0.23, y: 0.5,  w: 0.05, h: 0.44, type: 'LAVA' },
    ], projectiles: [],
    robots: [
      makeRobot({ id: 'enemy', x: 0.75, y: 0.2, angle: Math.PI, color: '#ef4444', trailColor: '#ff6060' }),
      makeRobot({ id: 'player', x: 0.19, y: 0.5, angle: 0, color: '#22d3ee', trailColor: '#22d3ee' }),
    ],
  }),
  tick: () => {},
};

export const GRAPH_THEORY_SCENES: Record<string, SceneDef> = {
  'gfx-01': sc_gfx01, 'gfx-02': sc_gfx02, 'gfx-03': sc_gfx03,
  'gfx-04': sc_gfx04, 'gfx-05': sc_gfx05, 'gfx-06': sc_gfx06,
  'gfx-07': sc_gfx07, 'gfx-08': sc_gfx08, 'gfx-09': sc_gfx09,
  'gfx-10': sc_gfx10,
};
