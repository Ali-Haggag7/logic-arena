import {
  GameLoop,
  KothModeData,
  CtfModeData,
  SurvivalModeData,
  Obstacle,
  Robot,
} from '@logic-arena/engine';
import {
  KOTH_ZONE_CENTER_X,
  KOTH_ZONE_CENTER_Y,
  KOTH_ZONE_RADIUS,
  KOTH_SCORE_TARGET,
  CTF_SCORE_TARGET,
  SURVIVAL_BASE_ENEMIES,
  SURVIVAL_MAX_ENEMIES,
  SURVIVAL_HEALTH_BOOST_INTERVAL,
} from './mode-processors';
import { createRobot, parseAndSetLogic } from './robot-factory';
import { GameDependencies } from './game-dependencies';

const SURVIVAL_DUMMY_SCRIPT = `
WHILE TRUE DO
  SCAN
  IF CAN_SEE_ENEMY THEN
    SET dx = NEAREST_VISIBLE_X - POSITION_X
    SET dy = NEAREST_VISIBLE_Y - POSITION_Y
    SET targetAngleRad = ATAN2(dy, dx)
    SET targetAngleDeg = targetAngleRad * 57.2957795
    SET rotation = targetAngleDeg
    SET distance = SQRT((dx * dx) + (dy * dy))
    IF distance <= 300 THEN
      FIRE
    END
    IF distance > 150 THEN
      MOVE_FAST
    ELSE
      STOP
    END
  ELSE
    SET rotation = rotation + 15
  END
END
`;

export class MatchModeManager {
  constructor(
    private readonly gameLoop: GameLoop,
    private readonly deps: GameDependencies,
    private readonly onEvent?: (event: string, payload: Record<string, unknown>) => void,
  ) {}

  initModeData(mode?: string): void {
    if (mode === 'KING_OF_THE_HILL') {
      const modeData: KothModeData = {
        type: 'KOTH',
        zone: {
          x: KOTH_ZONE_CENTER_X,
          y: KOTH_ZONE_CENTER_Y,
          radius: KOTH_ZONE_RADIUS,
        },
        zoneScores: { A: 0, B: 0 },
        scoreTarget: KOTH_SCORE_TARGET,
      };
      this.gameLoop.setModeData(modeData);

      // Spawn 4 solid obstacles around the KOTH zone to create a fortress
      const d = 110;
      const obstacles = this.gameLoop.getObstacles();
      obstacles.push({
        id: 'koth-wall-1',
        type: 'SOLID',
        width: 40,
        height: 100,
        rotation: 0,
        position: { x: KOTH_ZONE_CENTER_X - d, y: KOTH_ZONE_CENTER_Y },
      });
      obstacles.push({
        id: 'koth-wall-2',
        type: 'SOLID',
        width: 40,
        height: 100,
        rotation: 0,
        position: { x: KOTH_ZONE_CENTER_X + d, y: KOTH_ZONE_CENTER_Y },
      });
      obstacles.push({
        id: 'koth-wall-3',
        type: 'SOLID',
        width: 100,
        height: 40,
        rotation: 0,
        position: { x: KOTH_ZONE_CENTER_X, y: KOTH_ZONE_CENTER_Y - d },
      });
      obstacles.push({
        id: 'koth-wall-4',
        type: 'SOLID',
        width: 100,
        height: 40,
        rotation: 0,
        position: { x: KOTH_ZONE_CENTER_X, y: KOTH_ZONE_CENTER_Y + d },
      });
    } else if (mode === 'CAPTURE_THE_FLAG') {
      const modeData: CtfModeData = {
        type: 'CTF',
        flags: [
          { team: 'A', position: { x: 100, y: 300 }, atBase: true },
          { team: 'B', position: { x: 700, y: 300 }, atBase: true },
        ],
        teamScores: { A: 0, B: 0 },
        scoreTarget: CTF_SCORE_TARGET,
        bases: { A: { x: 100, y: 300 }, B: { x: 700, y: 300 } },
      };
      this.gameLoop.setModeData(modeData);
    } else if (mode === 'SURVIVAL') {
      const modeData: SurvivalModeData = {
        type: 'SURVIVAL',
        wave: 1,
        enemiesRemaining: SURVIVAL_BASE_ENEMIES,
        totalKills: 0,
        spawned: 0,
      };
      this.gameLoop.setModeData(modeData);
      this.spawnSurvivalWave(1);
    } else if (mode === 'RACING') {
      const finishLinePos = { x: 750, y: 300 };
      const modeData: import('@logic-arena/engine').RacingModeData = {
        type: 'RACING',
        laps: 1,
        finishLine: finishLinePos,
      };
      this.gameLoop.setModeData(modeData);

      const obstacles = this.gameLoop.getObstacles();
      obstacles.push({
        id: 'finish-line',
        type: 'FINISH_LINE',
        position: finishLinePos,
        width: 100,
        height: 600,
        rotation: 0,
      });
    }
  }

  spawnSurvivalWave(wave: number): void {
    const robots = this.gameLoop.getRobots();
    const player = robots.find((r) => !r.id.startsWith('dummy-'));
    if (player) {
      player.health = 100;
      if (player.energy !== undefined) {
        player.energy = player.maxEnergy ?? 100;
      }
      player.inStasis = false;
    }

    // Remove all existing dummy robots
    const dummies = robots.filter((r) => r.id.startsWith('dummy-'));
    for (const dummy of dummies) {
      this.gameLoop.removeRobot(dummy.id);
      this.deps.logicEvaluator.clearLogicForRobot(dummy.id);
    }

    const enemyCount = Math.min(wave + 2, SURVIVAL_MAX_ENEMIES);
    const enemyHealth =
      100 + Math.floor((wave - 1) / SURVIVAL_HEALTH_BOOST_INTERVAL) * 20;

    const colors = [
      '#ef4444',
      '#eab308',
      '#3b82f6',
      '#8b5cf6',
      '#ec4899',
      '#f97316',
    ];

    for (let i = 1; i <= enemyCount; i++) {
      const id = `dummy-${i}`;
      const color = colors[(i - 1) % colors.length];

      // Spawn along the edges randomly
      const edge = Math.floor(Math.random() * 4);
      let spawnX = 0,
        spawnY = 0;
      if (edge === 0) {
        spawnX = this.randomFloat(50, 750);
        spawnY = 50;
      } else if (edge === 1) {
        spawnX = 750;
        spawnY = this.randomFloat(50, 550);
      } else if (edge === 2) {
        spawnX = this.randomFloat(50, 750);
        spawnY = 550;
      } else {
        spawnX = 50;
        spawnY = this.randomFloat(50, 550);
      }

      const dummy = createRobot(
        id,
        SURVIVAL_DUMMY_SCRIPT,
        i, // index
        color,
        'unit-02',
        color,
        { x: spawnX, y: spawnY },
      );
      dummy.health = enemyHealth;
      dummy.ignoreEnergyCost = true;

      this.gameLoop.addRobot(dummy);
      parseAndSetLogic(
        dummy.id,
        SURVIVAL_DUMMY_SCRIPT,
        this.deps.logicEvaluator,
      );
    }

    // Track cumulative spawned for real-time totalKills computation
    const modeData = this.gameLoop.getModeData();
    if (modeData?.type === 'SURVIVAL') {
      modeData.spawned = (modeData.spawned || 0) + enemyCount;
    }

    if (this.onEvent) {
      this.onEvent('survivalWaveComplete', { wave });
    }
  }

  private randomFloat(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }
}
