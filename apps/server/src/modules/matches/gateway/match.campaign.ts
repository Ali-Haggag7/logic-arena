import * as crypto from 'crypto';
import { MatchEngine } from '../match.engine';
import { RedisService } from '../../../common/redis.service';
import { CampaignService } from '../../campaign/campaign.service';
import { checkWinCondition } from './match.win-condition';
import { AuthenticatedSocket } from './types';
import { CAMPAIGN_MATCH_MAX_STEPS } from '@logic-arena/engine/constants';
import type { Obstacle, ObstacleType } from '@logic-arena/engine';

type CampaignObstaclePayload = {
  x: number;
  y: number;
  w: number;
  h: number;
  type?: ObstacleType;
};

type CampaignWinner = 'player' | 'enemy' | 'draw';

type CampaignFramePayload = {
  robots: Array<{
    id: string;
    position: { x: number; y: number };
    rotation: number;
    health: number;
    energy?: number;
    isAlive: boolean;
    color?: string;
    tracerColor?: string;
    scanActive: boolean;
  }>;
  projectiles: Array<{
    id: string | number;
    position: { x: number; y: number };
    ownerId?: string;
    color?: string;
  }>;
  tick: number;
};

export type CampaignPauseState = {
  paused: boolean;
  tick: number;
};

export type CampaignSession = {
  interval: NodeJS.Timeout;
  paused: boolean;
  engine: MatchEngine;
  stepCount: number;
  logicCounter: number;
  simulationTimeMs: number;
  winner: CampaignWinner;
  matchOver: boolean;
  lastScanTicks: Map<string, number>;
  totalPausedMs: number;
  pauseStartedAt: number | null;
  client: AuthenticatedSocket;
  userId: string;
  levelId: string;
};

export type CampaignFightData = {
  levelId: string;
  userScript: string;
  obstacles?: CampaignObstaclePayload[];
  playerSpawn?: { x: number; y: number; angle?: number };
  enemySpawn?: { x: number; y: number; angle?: number };
};

const ARENA_W = 800;
const ARENA_H = 600;
const FIXED_DT = 1 / 60;
const MS_PER_STEP = FIXED_DT * 1000;
const LOGIC_EVERY = 6;
const INTERVAL_MS = 50;
const CAMPAIGN_FRAME_STEPS = 3;
const SCAN_ACTIVE_TICKS = 3;
const STALE_SCAN_TICK = -999;
const DEFAULT_PLAYER_SPAWN = { x: 275, y: 300, angle: 0 };
const DEFAULT_ENEMY_SPAWN = { x: 525, y: 300, angle: Math.PI };

export class CampaignFightRunner {
  constructor(
    private campaignService: CampaignService,
    private redisService: RedisService,
    private campaignSessions: Map<string, CampaignSession>,
  ) {}

  async handle(
    client: AuthenticatedSocket,
    data: CampaignFightData,
  ): Promise<void> {
    const userId = client.isGuest ? 'guest' : client.userId;

    if (!userId) {
      client.emit('campaignFightError', {
        message: 'Authentication required.',
      });
      return;
    }

    const {
      levelId,
      userScript,
      obstacles = [],
      playerSpawn,
      enemySpawn,
    } = data;

    if (!levelId || !userScript?.trim()) {
      client.emit('campaignFightError', { message: 'Invalid payload.' });
      return;
    }

    let enemyScript: string;
    try {
      enemyScript = await this.campaignService.getEnemyScriptSecure(
        userId,
        levelId,
      );
    } catch {
      client.emit('campaignFightError', {
        message: 'Level locked or not found.',
      });
      return;
    }

    this.clearSession(userId);

    const CAMPAIGN_PLAYER_SPAWN = playerSpawn ?? DEFAULT_PLAYER_SPAWN;
    const CAMPAIGN_ENEMY_SPAWN = enemySpawn ?? DEFAULT_ENEMY_SPAWN;

    const playerFacing =
      typeof CAMPAIGN_PLAYER_SPAWN.angle === 'number'
        ? CAMPAIGN_PLAYER_SPAWN.angle
        : Math.atan2(
            CAMPAIGN_ENEMY_SPAWN.y - CAMPAIGN_PLAYER_SPAWN.y,
            CAMPAIGN_ENEMY_SPAWN.x - CAMPAIGN_PLAYER_SPAWN.x,
          );
    const enemyFacing =
      typeof CAMPAIGN_ENEMY_SPAWN.angle === 'number'
        ? CAMPAIGN_ENEMY_SPAWN.angle
        : Math.atan2(
            CAMPAIGN_PLAYER_SPAWN.y - CAMPAIGN_ENEMY_SPAWN.y,
            CAMPAIGN_PLAYER_SPAWN.x - CAMPAIGN_ENEMY_SPAWN.x,
          );

    const mappedObstacles: Obstacle[] = obstacles.map(
      (o: CampaignObstaclePayload) => ({
        id: `scene-obs-${Math.random().toString(36).slice(2, 7)}`,
        type: o.type ?? 'SOLID',
        position: { x: o.x * ARENA_W, y: o.y * ARENA_H },
        width: o.w * ARENA_W,
        height: o.h * ARENA_H,
        rotation: 0,
      }),
    );

    const lastScanTicks = new Map<string, number>();

    const engine = new MatchEngine(
      `campaign-${crypto.randomUUID()}`,
      [
        {
          id: 'player',
          script: userScript,
          spawnPosition: CAMPAIGN_PLAYER_SPAWN,
          initialFovDirection: playerFacing,
        },
        {
          id: 'enemy',
          script: enemyScript,
          spawnPosition: CAMPAIGN_ENEMY_SPAWN,
          initialFovDirection: enemyFacing,
        },
      ],
      { obstacles: mappedObstacles },
      (event, payload) => {
        if (
          event === 'logicExecuted' &&
          payload.action === 'SCAN' &&
          typeof payload.robotId === 'string'
        ) {
          const session = this.campaignSessions.get(userId);
          lastScanTicks.set(payload.robotId, session?.stepCount ?? 0);
        }
      },
    );
    const campaignEnemy = engine
      .getGameLoop()
      .getRobots()
      .find((r) => r.id === 'enemy');
    if (campaignEnemy) {
      campaignEnemy.ignoreEnergyCost = true;
    }

    const session: CampaignSession = {
      interval: setInterval(() => {
        void this.advanceSession(userId);
      }, INTERVAL_MS),
      paused: false,
      engine,
      stepCount: 0,
      logicCounter: 0,
      simulationTimeMs: 0,
      winner: 'draw',
      matchOver: false,
      lastScanTicks,
      totalPausedMs: 0,
      pauseStartedAt: null,
      client,
      userId,
      levelId,
    };

    this.campaignSessions.set(userId, session);
    client.emit('campaignFrame', this.createFrame(session));
    client.emit('campaign:pause-state', this.createPauseState(session));
  }

  pause(client: AuthenticatedSocket): CampaignPauseState | null {
    const session = this.getSessionForClient(client);
    if (!session || session.matchOver) return null;

    if (!session.paused) {
      session.paused = true;
      session.pauseStartedAt = Date.now();
    }

    const state = this.createPauseState(session);
    session.client.emit('campaign:pause-state', state);
    return state;
  }

  resume(client: AuthenticatedSocket): CampaignPauseState | null {
    const session = this.getSessionForClient(client);
    if (!session || session.matchOver) return null;

    if (session.paused && session.pauseStartedAt !== null) {
      const pausedDuration = Date.now() - session.pauseStartedAt;
      session.totalPausedMs += pausedDuration;
      session.engine.shiftTimestamps(pausedDuration);
    }

    session.paused = false;
    session.pauseStartedAt = null;
    const state = this.createPauseState(session);
    session.client.emit('campaign:pause-state', state);
    return state;
  }

  clearSession(userId: string): void {
    const session = this.campaignSessions.get(userId);
    if (!session) return;

    clearInterval(session.interval);
    this.campaignSessions.delete(userId);
  }

  clearAllSessions(): void {
    for (const session of this.campaignSessions.values()) {
      clearInterval(session.interval);
    }
    this.campaignSessions.clear();
  }

  private async advanceSession(userId: string): Promise<void> {
    const session = this.campaignSessions.get(userId);
    if (!session || session.matchOver || session.paused) return;

    for (let i = 0; i < CAMPAIGN_FRAME_STEPS; i++) {
      session.simulationTimeMs += MS_PER_STEP;
      session.engine.setVirtualTime(session.simulationTimeMs);
      session.engine.getGameLoop().update(FIXED_DT);

      session.logicCounter++;
      if (session.logicCounter >= LOGIC_EVERY) {
        session.logicCounter = 0;
        session.engine.tick();
      }

      session.stepCount++;
      if (session.stepCount >= CAMPAIGN_MATCH_MAX_STEPS) {
        session.matchOver = true;
        break;
      }
    }

    session.client.emit('campaignFrame', this.createFrame(session));

    const state = session.engine.getState();
    const { matchIsOver, winner: matchWinner } = checkWinCondition(
      state,
      'COMBAT',
    );

    if (matchIsOver) {
      session.matchOver = true;
      if (matchWinner) {
        session.winner = matchWinner.id === 'player' ? 'player' : 'enemy';
      }
    }

    if (session.matchOver) {
      await this.finishSession(session);
    }
  }

  private async finishSession(session: CampaignSession): Promise<void> {
    clearInterval(session.interval);
    this.campaignSessions.delete(session.userId);

    let completionToken: string | null = null;
    if (session.winner === 'player' && !session.client.isGuest) {
      completionToken = crypto.randomUUID();
      await this.redisService.set(
        `campaign:token:${session.userId}:${session.levelId}`,
        completionToken,
        120,
      );
    }

    session.client.emit('campaignFightResult', {
      winner: session.winner,
      completionToken,
      tick: session.stepCount,
      fightDurationTicks: session.stepCount,
    });
  }

  private createFrame(session: CampaignSession): CampaignFramePayload {
    const state = session.engine.getState();
    return {
      robots: state.robots.map((r) => ({
        id: r.id,
        position: { x: r.position.x, y: r.position.y },
        rotation: r.rotation,
        health: r.health,
        energy: r.energy,
        isAlive: r.isAlive,
        color: r.color,
        tracerColor: r.tracerColor,
        scanActive:
          session.stepCount -
            (session.lastScanTicks.get(r.id) ?? STALE_SCAN_TICK) <
          SCAN_ACTIVE_TICKS,
      })),
      projectiles: state.projectiles.map((p) => ({
        id: p.id,
        position: { x: p.position.x, y: p.position.y },
        ownerId: p.ownerId,
        color: p.color,
      })),
      tick: session.stepCount,
    };
  }

  private createPauseState(session: CampaignSession): CampaignPauseState {
    return {
      paused: session.paused,
      tick: session.stepCount,
    };
  }

  private getSessionForClient(
    client: AuthenticatedSocket,
  ): CampaignSession | null {
    const userId = client.isGuest ? 'guest' : client.userId;
    if (!userId) return null;
    return this.campaignSessions.get(userId) ?? null;
  }
}
