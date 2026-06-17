import { Logger } from '@nestjs/common';
import {
  GameLoop,
  Robot,
  GameConfig,
  MapTheme,
} from '@logic-arena/engine';
import {
  processKothTick,
  processCtfTick,
  processSurvivalTick,
  processRacingTick,
} from './mode-processors';
import { SandboxRunner } from '../../common/sandbox.runner';
import { createRobot, parseAndSetLogic } from './robot-factory';
import { createGameDependencies, GameDependencies } from './game-dependencies';
import {
  NodeType,
  ActionExpression,
  ScanStatement,
} from '@logic-arena/logic-parser';
import { MatchHazards } from './match-hazards';
import { MatchModeManager } from './match-modes';

export class MatchEngine {
  private readonly logger = new Logger(MatchEngine.name);
  private gameLoop: GameLoop;
  private sandboxRunner: SandboxRunner;
  private deps: GameDependencies;
  private initialPlayers: {
    id: string;
    script: string;
    color?: string;
    model?: string;
    tracerColor?: string;
    spawnPosition?: { x: number; y: number };
    initialFovDirection?: number;
  }[] = [];
  private tickInterval: NodeJS.Timeout | null = null;
  private matchId: string;
  private config?: GameConfig;
  private readonly mapTheme: MapTheme;
  private tickCount: number = 0;

  /** Accumulate match-level tracking for efficiency score */
  private lastTickTime: number = Date.now();

  private readonly hazards: MatchHazards;
  private modeManager: MatchModeManager;

  constructor(
    matchId: string,
    initialPlayers: {
      id: string;
      script: string;
      color?: string;
      model?: string;
      tracerColor?: string;
      spawnPosition?: { x: number; y: number };
      initialFovDirection?: number;
    }[],
    config?: GameConfig,
    private onEvent?: (event: string, payload: Record<string, unknown>) => void,
  ) {
    this.matchId = matchId;
    this.mapTheme = config?.mapTheme ?? 'CYBER';
    this.config = { ...config, mapTheme: this.mapTheme };
    this.gameLoop = new GameLoop(this.config);
    this.sandboxRunner = new SandboxRunner();
    this.deps = createGameDependencies(this.gameLoop, this.onEvent);
    this.initialPlayers = initialPlayers;

    initialPlayers.forEach((p, i) => {
      this.gameLoop.addRobot(
        createRobot(
          p.id,
          p.script,
          i,
          p.color,
          p.model,
          p.tracerColor,
          p.spawnPosition,
          p.initialFovDirection,
        ),
      );
      parseAndSetLogic(p.id, p.script, this.deps.logicEvaluator);
    });

    this.hazards = new MatchHazards(this.matchId, this.mapTheme);
    this.modeManager = new MatchModeManager(
      this.gameLoop,
      this.deps,
      this.onEvent,
    );

    this.modeManager.initModeData(this.config?.mode);
    this.hazards.initEnvironmentHazards(this.gameLoop.getObstacles());
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  reset(): void {
    this.stop();
    this.gameLoop = new GameLoop(this.config);
    this.deps = createGameDependencies(this.gameLoop, this.onEvent);
    this.tickCount = 0;
    this.initialPlayers.forEach((p, i) => {
      this.gameLoop.addRobot(
        createRobot(
          p.id,
          p.script,
          i,
          p.color,
          p.model,
          p.tracerColor,
          p.spawnPosition,
          p.initialFovDirection,
        ),
      );
      parseAndSetLogic(p.id, p.script, this.deps.logicEvaluator);
    });
    this.modeManager = new MatchModeManager(
      this.gameLoop,
      this.deps,
      this.onEvent,
    );
    this.modeManager.initModeData(this.config?.mode);
    this.hazards.initEnvironmentHazards(this.gameLoop.getObstacles());
    this.start();
  }

  start(tickRate: number = 100): void {
    if (this.tickInterval) return;
    this.gameLoop.start();
    this.lastTickTime = Date.now();
    this.tickInterval = setInterval(() => this.tick(), tickRate);
  }

  stop(): void {
    this.gameLoop.stop();

    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  // ---------------------------------------------------------------------------
  // Per-tick logic evaluation
  // ---------------------------------------------------------------------------

  tick(): void {
    try {
      this.tickCount += 1;
      this.hazards.processHazards(
        this.gameLoop.getObstacles(),
        this.gameLoop.getRobots(),
        this.tickCount,
      );

      this.gameLoop.getRobots().forEach((robot) => {
        if (!robot.isAlive) return;
        // Clear flag so logic executor can set it if an action is performed
        robot.executedCommandThisTick = false;
        try {
          this.deps.logicEvaluator.evaluate(robot.id);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          this.logger.error(`Script error for robot ${robot.id}: ${msg}`);
          this.onEvent?.('scriptError', { robotId: robot.id, error: msg });
          // Reset runtime state so the robot can recover on the next tick
          // instead of being permanently frozen with stale memory/cooldowns.
          this.deps.logicEvaluator.resetRuntimeState(robot.id);
        }
        // Flush buffered action emits after all scripts for this robot have
        // been evaluated — prevents command alternation spam in the display.
        this.deps.actionExecutor.flushEmits(robot.id);
      });

      const modeData = this.gameLoop.getModeData();
      if (modeData) {
        const robots = this.gameLoop.getRobots();
        if (modeData.type === 'KOTH') {
          this.gameLoop.setModeData(processKothTick(robots, modeData));
        } else if (modeData.type === 'CTF') {
          this.gameLoop.setModeData(processCtfTick(robots, modeData));
        } else if (modeData.type === 'SURVIVAL') {
          const result = processSurvivalTick(robots, modeData);
          this.gameLoop.setModeData(result.modeData);
          if (result.waveComplete) {
            this.modeManager.spawnSurvivalWave(result.modeData.wave);
          }
        } else if (modeData.type === 'RACING') {
          this.gameLoop.setModeData(processRacingTick(robots, modeData));
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Fatal tick error: ${msg}`);
      // Outer guard: never let a crash escape tick().
      // The match continues; next tick runs fresh in 100ms.
    }
  }

  // ---------------------------------------------------------------------------
  // Player management
  // ---------------------------------------------------------------------------

  addPlayer(playerScript: {
    id: string;
    script: string;
    color?: string;
    model?: string;
    tracerColor?: string;
  }): void {
    const exists = this.gameLoop
      .getRobots()
      .some((p) => p.id === playerScript.id);
    if (!exists) {
      let initIdx = this.initialPlayers.findIndex(
        (p) => p.id === playerScript.id,
      );

      if (initIdx === -1) {
        // Try to claim the bot-2 placeholder slot first (lobby join scenario)
        const botSlot = this.initialPlayers.findIndex((p) => p.id === 'bot-2');
        if (botSlot !== -1) {
          initIdx = botSlot;
          this.initialPlayers[initIdx] = playerScript;
        } else {
          // Reconnect scenario: reuse the first player slot (index 0) rather than
          // appending a brand-new entry, which would create a 3rd robot.
          initIdx = 0;
          this.initialPlayers[initIdx] = playerScript;
        }
      }

      this.gameLoop.addRobot(
        createRobot(
          playerScript.id,
          playerScript.script,
          initIdx,
          playerScript.color,
          playerScript.model,
          playerScript.tracerColor,
        ),
      );
      parseAndSetLogic(
        playerScript.id,
        playerScript.script,
        this.deps.logicEvaluator,
      );
    }
  }

  removePlayer(userId: string): void {
    this.gameLoop.removeRobot(userId);
    this.deps.logicEvaluator.clearLogicForRobot(userId);
  }

  updateRobotScript(robotId: string, scriptContent: string): boolean {
    const exists = this.gameLoop.getRobots().some((r) => r.id === robotId);
    if (!exists) return false;
    return parseAndSetLogic(robotId, scriptContent, this.deps.logicEvaluator);
  }

  updateInitialPlayer(userId: string, script: string): void {
    const index = this.initialPlayers.findIndex((p) => p.id === userId);
    if (index !== -1) this.initialPlayers[index].script = script;
  }

  /** Commands allowed via the manual override input. */
  private static readonly MANUAL_ALLOWED = new Set([
    'MOVE',
    'MOVE_FAST',
    'BACKUP',
    'STOP',
    'FIRE',
    'LEAD_FIRE',
    'BURST_FIRE',
    'SCAN',
  ]);

  /**
   * Execute a manual override command for a robot.
   * Routes through actionExecutor.executeAction() which owns the full
   * energy-deduction + stasis-check pipeline via energyManager.deduct().
   * Returns false if blocked (stasis, unknown command, or robot not found).
   */
  receiveManualCommand(userId: string, command: string): boolean {
    const cmd = command.toUpperCase();
    const robot = this.gameLoop.getRobots().find((r) => r.id === userId);
    if (!robot || !robot.isAlive) return false;
    if (!MatchEngine.MANUAL_ALLOWED.has(cmd)) return false;

    if (cmd === 'SCAN') {
      const scanStmt: ScanStatement = { type: NodeType.ScanStatement };
      this.deps.actionExecutor.executeAction(userId, scanStmt, {});
    } else {
      const action: ActionExpression = {
        type: NodeType.ActionExpression,
        command: cmd,
        args: [],
      };
      this.deps.actionExecutor.executeAction(userId, action, {});
    }

    this.logger.debug(`Manual command for ${userId}: ${cmd}`);
    return true;
  }

  /**
   * Toggle lockVision for a robot.
   * When enabled, fovDirection syncs to rotation every tick.
   * When disabled, fovDirection freezes at its current value.
   * Returns the new lockVision state.
   */
  toggleLockVision(userId: string): boolean | null {
    const robot = this.gameLoop.getRobots().find((r) => r.id === userId);
    if (!robot || !robot.isAlive) return null;
    robot.lockVision = !robot.lockVision;
    // When enabling, immediately sync so there's no 1-tick lag
    if (robot.lockVision) {
      robot.fovDirection = robot.rotation;
    }
    return robot.lockVision;
  }

  // ---------------------------------------------------------------------------
  // State access
  // ---------------------------------------------------------------------------

  getGameLoop(): GameLoop {
    return this.gameLoop;
  }

  /** Enable headless simulation mode for campaign — cooldowns use virtual time. */
  setVirtualTime(ms: number): void {
    this.deps.actionExecutor.setVirtualTime(ms);
  }

  /** Shift raw wall-clock timestamps forward after a campaign pause. */
  shiftTimestamps(offsetMs: number): void {
    if (offsetMs <= 0) return;

    for (const robot of this.gameLoop.getRobots()) {
      if (typeof robot.hitWallTimestamp === 'number') {
        robot.hitWallTimestamp += offsetMs;
      }
      if (typeof robot.shieldHitTimestamp === 'number') {
        robot.shieldHitTimestamp += offsetMs;
      }
    }

    for (const obstacle of this.gameLoop.getObstacles()) {
      if (obstacle.type === 'MINE' && typeof obstacle.createdAt === 'number') {
        obstacle.createdAt += offsetMs;
      }
    }
  }

  getState() {
    return this.gameLoop.getGameState();
  }

  getInitialPlayers(): {
    id: string;
    script: string;
    color?: string;
    model?: string;
  }[] {
    return this.initialPlayers;
  }

  /**
   * Returns per-robot efficiency scores keyed by robot ID.
   * Called by the gateway when the match ends.
   */
  getEfficiencyScores(): Record<string, number> {
    const scores: Record<string, number> = {};
    for (const robot of this.gameLoop.getRobots()) {
      scores[robot.id] = this.deps.energyManager.getEfficiencyScore(robot);
    }
    return scores;
  }
}
