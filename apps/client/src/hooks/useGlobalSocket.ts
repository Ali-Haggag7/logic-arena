import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '../lib/api-client';
import { hasAuthSession } from '../lib/client-security';
import type { FriendRequestEntry } from '../lib/api/friends.types';
import type { NotificationEntry } from '../lib/api/notifications.types';

export interface FriendRequestReceivedPayload {
  request: FriendRequestEntry;
  unreadCount: number;
}

export interface FriendRequestAcceptedPayload {
  by: { id: string; username: string };
  friendshipCreatedAt: string;
  unreadCount: number;
}

export interface FriendRequestDeclinedPayload {
  by: { id: string; username: string };
}

export interface FriendRemovedPayload {
  by: { id: string; username: string };
}

interface Handlers {
  onChallengeReceived: (data: { challengerId: string; challengerName: string }) => void;
  onChallengeSent: () => void;
  onChallengeFailed: (reason: string) => void;
  onChallengeAccepted: (matchId: string) => void;
  onFriendRequestReceived: (data: FriendRequestReceivedPayload) => void;
  onFriendRequestAccepted: (data: FriendRequestAcceptedPayload) => void;
  onFriendRequestDeclined: (data: FriendRequestDeclinedPayload) => void;
  onFriendRemoved: (data: FriendRemovedPayload) => void;
  onFriendsListInvalidate: () => void;
  onNotificationNew: (notification: NotificationEntry) => void;
  onNotificationsInvalidate: () => void;
}

export type PartialHandlers = Partial<Handlers>;

type RouterRef = ReturnType<typeof useRouter>;

interface SocketManager {
  socket: Socket;
  refCount: number;
  handlers: Set<PartialHandlers>;
  heartbeat: ReturnType<typeof setInterval>;
  router: RouterRef | null;
}

let manager: SocketManager | null = null;

function buildWsUrl(): string {
  return API_BASE_URL
    .replace('https://', 'wss://')
    .replace('http://', 'ws://')
    .replace(/\/api$/, '');
}

function getOrCreateManager(): SocketManager | null {
  if (typeof window === 'undefined') return null;
  if (!hasAuthSession()) return null;
  if (manager) return manager;

  const socket = io(buildWsUrl(), { withCredentials: true });
  const heartbeat = setInterval(() => socket.emit('ping'), 60_000);

  const m: SocketManager = {
    socket,
    refCount: 0,
    handlers: new Set(),
    heartbeat,
    router: null,
  };

  socket.on('challenge-received', (data: { challengerId: string; challengerName: string }) => {
    m.handlers.forEach((h) => h.onChallengeReceived?.(data));
  });
  socket.on('challenge-sent', () => {
    m.handlers.forEach((h) => h.onChallengeSent?.());
  });
  socket.on('challenge-failed', ({ reason }: { reason: string }) => {
    m.handlers.forEach((h) => h.onChallengeFailed?.(reason));
  });
  socket.on('challenge-accepted', ({ matchId }: { matchId: string }) => {
    m.handlers.forEach((h) => h.onChallengeAccepted?.(matchId));
    m.router?.push(`/arena?matchId=${matchId}`);
  });
  socket.on('friend:request-received', (data: FriendRequestReceivedPayload) => {
    m.handlers.forEach((h) => h.onFriendRequestReceived?.(data));
  });
  socket.on('friend:request-accepted', (data: FriendRequestAcceptedPayload) => {
    m.handlers.forEach((h) => h.onFriendRequestAccepted?.(data));
  });
  socket.on('friend:request-declined', (data: FriendRequestDeclinedPayload) => {
    m.handlers.forEach((h) => h.onFriendRequestDeclined?.(data));
  });
  socket.on('friend:removed', (data: FriendRemovedPayload) => {
    m.handlers.forEach((h) => h.onFriendRemoved?.(data));
  });
  socket.on('friends:list-invalidate', () => {
    m.handlers.forEach((h) => h.onFriendsListInvalidate?.());
  });
  socket.on('notification:new', (data: NotificationEntry) => {
    m.handlers.forEach((h) => h.onNotificationNew?.(data));
  });
  socket.on('notifications:invalidate', () => {
    m.handlers.forEach((h) => h.onNotificationsInvalidate?.());
  });

  manager = m;
  return m;
}

function disposeManager() {
  if (!manager) return;
  clearInterval(manager.heartbeat);
  manager.socket.disconnect();
  manager = null;
}

export function useGlobalSocket(handlers: PartialHandlers) {
  const handlersRef = useRef<PartialHandlers>(handlers);
  const router = useRouter();

  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    const m = getOrCreateManager();
    if (!m) return;

    m.refCount += 1;
    m.router = router;

    const wrapped: PartialHandlers = {
      onChallengeReceived: (data) => handlersRef.current.onChallengeReceived?.(data),
      onChallengeSent: () => handlersRef.current.onChallengeSent?.(),
      onChallengeFailed: (reason) => handlersRef.current.onChallengeFailed?.(reason),
      onChallengeAccepted: (matchId) => handlersRef.current.onChallengeAccepted?.(matchId),
      onFriendRequestReceived: (data) => handlersRef.current.onFriendRequestReceived?.(data),
      onFriendRequestAccepted: (data) => handlersRef.current.onFriendRequestAccepted?.(data),
      onFriendRequestDeclined: (data) => handlersRef.current.onFriendRequestDeclined?.(data),
      onFriendRemoved: (data) => handlersRef.current.onFriendRemoved?.(data),
      onFriendsListInvalidate: () => handlersRef.current.onFriendsListInvalidate?.(),
      onNotificationNew: (data) => handlersRef.current.onNotificationNew?.(data),
      onNotificationsInvalidate: () => handlersRef.current.onNotificationsInvalidate?.(),
    };

    m.handlers.add(wrapped);

    return () => {
      m.handlers.delete(wrapped);
      m.refCount -= 1;
      if (m.refCount <= 0) {
        disposeManager();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendChallenge = useCallback((targetUserId: string, source?: 'friend' | 'leaderboard' | 'profile') => {
    manager?.socket.emit('send-challenge', { targetUserId, source });
  }, []);

  const acceptChallenge = useCallback((challengerId: string) => {
    manager?.socket.emit('accept-challenge', { challengerId });
  }, []);

  const sendFriendRequest = useCallback(
    (receiverUsername: string, message?: string) => {
      manager?.socket.emit('friend:send-request', { receiverUsername, message });
    },
    [],
  );

  const acceptFriendRequest = useCallback((requestId: string) => {
    manager?.socket.emit('friend:accept-request', { requestId });
  }, []);

  const declineFriendRequest = useCallback((requestId: string) => {
    manager?.socket.emit('friend:decline-request', { requestId });
  }, []);

  const unfriendSocket = useCallback((friendId: string) => {
    manager?.socket.emit('friend:unfriend', { friendId });
  }, []);

  return {
    sendChallenge,
    acceptChallenge,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    unfriendSocket,
  };
}
