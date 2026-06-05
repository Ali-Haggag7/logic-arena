export type NotificationType =
  | 'FRIEND_REQUEST'
  | 'FRIEND_ACCEPTED'
  | 'CHALLENGE_RECEIVED'
  | 'MATCH_RESULT'
  | 'SYSTEM';

export interface NotificationEntry {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  data: NotificationPayload | null;
}

export type NotificationPayload =
  | { kind: 'FRIEND_REQUEST'; requestId: string; senderId: string; senderUsername: string }
  | { kind: 'FRIEND_ACCEPTED'; friendId: string; friendUsername: string }
  | { kind: 'CHALLENGE_RECEIVED'; challengerId: string; challengerName: string }
  | { kind: 'MATCH_RESULT'; matchId: string; outcome: 'win' | 'loss'; ratingDelta: number }
  | { kind: 'SYSTEM'; reference: string };

export interface NotificationListResponse {
  items: NotificationEntry[];
  total: number;
  unreadCount: number;
  hasMore: boolean;
}
