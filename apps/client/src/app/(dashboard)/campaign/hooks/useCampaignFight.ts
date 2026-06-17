'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '../../../../lib/api-client';

export type FightStatus = 'idle' | 'connecting' | 'fighting' | 'streaming' | 'done' | 'error';

export type FightResult = {
  winner: 'player' | 'enemy' | 'draw';
  completionToken: string | null;
  tick?: number;
  fightDurationTicks?: number;
};

export type CampaignRobotSpawn = {
  x: number;
  y: number;
  /** Initial body/FOV angle in radians, copied from the 2D scene definition. */
  angle?: number;
};

export type CampaignFrameRobot = {
  id: 'player' | 'enemy';
  position?: { x?: number; y?: number };
  rotation?: number;
  health?: number;
  energy?: number;
  isAlive?: boolean;
  scanActive?: boolean;
};

export type CampaignFrameProjectile = {
  id: number;
  position?: { x?: number; y?: number };
  color?: string;
  ownerId?: 'player' | 'enemy';
};

export type CampaignFrame = {
  robots?: CampaignFrameRobot[];
  projectiles?: CampaignFrameProjectile[];
  tick?: number;
};

export type CampaignPauseState = {
  paused: boolean;
  tick: number;
};

function cloneCampaignFrame(frame: CampaignFrame): CampaignFrame {
  return {
    tick: frame.tick,
    robots: frame.robots?.map((robot) => ({
      ...robot,
      position: robot.position
        ? { x: robot.position.x, y: robot.position.y }
        : undefined,
    })),
    projectiles: frame.projectiles?.map((projectile) => ({
      ...projectile,
      position: projectile.position
        ? { x: projectile.position.x, y: projectile.position.y }
        : undefined,
    })),
  };
}

function buildWsUrl(): string {
  return API_BASE_URL
    .replace('https://', 'wss://')
    .replace('http://', 'ws://')
    .replace(/\/api$/, '');
}

export function useCampaignFight() {
  const socketRef = useRef<Socket | null>(null);
  const [status, setStatus] = useState<FightStatus>('idle');
  const [result, setResult] = useState<FightResult | null>(null);
  const [serverPaused, setServerPaused] = useState(false);
  const latestFrameRef = useRef<CampaignFrame | null>(null);
  const replayFramesRef = useRef<CampaignFrame[]>([]);

  // ── Connect once on mount, reuse across fights ────────────────────────────
  useEffect(() => {
    const socket = io(buildWsUrl(), {
      withCredentials: true,
      transports: ['websocket'],  // skip polling probe round-trip
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on('campaignFrame', (frame: CampaignFrame) => {
      latestFrameRef.current = frame;
      replayFramesRef.current.push(cloneCampaignFrame(frame));
      setStatus('streaming');
    });

    socket.on('campaign:pause-state', (data: CampaignPauseState) => {
      setServerPaused(data.paused);
    });

    socket.on('campaignFightResult', (data: FightResult) => {
      setResult(data);
      setServerPaused(false);
      setStatus('done');
    });

    socket.on('campaignFightError', (data: { message: string }) => {
      console.error('[campaignFight] error:', data.message);
      setServerPaused(false);
      setStatus('error');
    });

    socket.on('connect_error', () => {
      setStatus('error');
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // ── Emit fight — reuses the existing socket, no reconnection ─────────────
  const fight = useCallback((
    levelId: string,
    userScript: string,
    obstacles: unknown[],
    playerSpawn?: CampaignRobotSpawn,
    enemySpawn?: CampaignRobotSpawn,
  ) => {
    const socket = socketRef.current;
    if (!socket) return;

    latestFrameRef.current = null;
    replayFramesRef.current = [];
    setResult(null);
    setServerPaused(false);

    if (!socket.connected) {
      setStatus('connecting');
      socket.once('connect', () => {
        setStatus('fighting');
        socket.emit('campaignFight', { levelId, userScript, obstacles, playerSpawn, enemySpawn });
      });
      socket.connect();
    } else {
      setStatus('fighting');
      socket.emit('campaignFight', { levelId, userScript, obstacles, playerSpawn, enemySpawn });
    }
  }, []);

  const pauseFight = useCallback((): void => {
    socketRef.current?.emit('campaign:pause');
  }, []);

  const resumeFight = useCallback((): void => {
    socketRef.current?.emit('campaign:resume');
  }, []);

  return {
    fight,
    status,
    result,
    latestFrameRef,
    replayFramesRef,
    serverPaused,
    pauseFight,
    resumeFight,
  };
}
