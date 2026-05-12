'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '../../../../lib/api-client';

export type FightStatus = 'idle' | 'connecting' | 'fighting' | 'done' | 'error';

export type FightResult = {
  winner: 'player' | 'enemy' | 'draw';
  replayFrames: any[];
  completionToken: string | null;
};

export function useCampaignFight() {
  const socketRef = useRef<Socket | null>(null);
  const [status, setStatus] = useState<FightStatus>('idle');
  const [result, setResult] = useState<FightResult | null>(null);

  const fight = useCallback((levelId: string, userScript: string, obstacles: any[]) => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    setStatus('connecting');
    setResult(null);

    const wsUrl = API_BASE_URL
      .replace('https://', 'wss://')
      .replace('http://', 'ws://')
      .replace(/\/api$/, '');

    const socket = io(wsUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setStatus('fighting');
      socket.emit('campaignFight', { levelId, userScript, obstacles });
    });

    socket.on('campaignFightResult', (data: FightResult) => {
      setResult(data);
      setStatus('done');
      socket.disconnect();
    });

    socket.on('campaignFightError', (data: { message: string }) => {
      console.error('[campaignFight] error:', data.message);
      setStatus('error');
      socket.disconnect();
    });

    socket.on('connect_error', () => {
      setStatus('error');
    });
  }, []);

  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return { fight, status, result };
}
