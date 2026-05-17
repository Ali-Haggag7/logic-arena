export interface ArenaRobot {
  id: 'player' | 'enemy';
  x: number;
  y: number;
  angle: number;
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  isAlive: boolean;
  respawnTimer: number;
  invulnerableTimer: number;
  color: string;
  trailColor: string;
  speed: number;
  size: number;
  moveCooldown: number;
  vx: number;
  vy: number;
}

export interface ArenaProjectile {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  ownerId: 'player' | 'enemy';
  life: number;
  damage: number;
}

export interface ArenaObstacle {
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'SOLID' | 'TRAP' | 'LAVA';
}

export interface SceneLocal {
  scanning?: number;
  [key: string]: unknown;
}

export interface SceneState {
  tick: number;
  robots: ArenaRobot[];
  projectiles: ArenaProjectile[];
  obstacles: ArenaObstacle[];
  nextProjId: number;
  local?: SceneLocal;
}

export interface SceneDef {
  label: string;
  init: () => SceneState;
  tick: (state: SceneState) => void;
}

export const TAU = Math.PI * 2;

export function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

export function makeRobot(
  partial: Partial<ArenaRobot> & Pick<ArenaRobot, 'id' | 'x' | 'y' | 'color' | 'trailColor'>,
): ArenaRobot {
  return {
    angle: 0,
    health: 100,
    maxHealth: 100,
    energy: 100,
    maxEnergy: 100,
    isAlive: true,
    respawnTimer: 0,
    invulnerableTimer: 0,
    speed: 0.002,
    size: 0.035,
    moveCooldown: 0,
    vx: 0,
    vy: 0,
    ...partial,
  };
}
