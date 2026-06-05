'use client';

import React from 'react';
import {
  UserPlus,
  UserCheck,
  Swords,
  Trophy,
  Info,
  Check,
} from 'lucide-react';
import type {
  NotificationEntry,
  NotificationPayload,
} from '@/lib/api/notifications.types';

interface NotificationItemProps {
  notification: NotificationEntry;
  isFocused: boolean;
  onClick: (notification: NotificationEntry) => void;
  onDismiss: (id: string) => void;
}

interface IconConfig {
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  tone: 'accent' | 'success' | 'warning' | 'info';
  label: string;
}

const ICON_MAP: Record<string, IconConfig> = {
  FRIEND_REQUEST: { Icon: UserPlus, tone: 'accent', label: 'FRIEND_REQUEST' },
  FRIEND_ACCEPTED: { Icon: UserCheck, tone: 'success', label: 'FRIEND_ACCEPTED' },
  CHALLENGE_RECEIVED: { Icon: Swords, tone: 'warning', label: 'CHALLENGE' },
  MATCH_RESULT: { Icon: Trophy, tone: 'accent', label: 'MATCH' },
  SYSTEM: { Icon: Info, tone: 'info', label: 'SYSTEM' },
};

function getPayloadSummary(payload: NotificationPayload | null): string {
  if (!payload) return '';
  switch (payload.kind) {
    case 'FRIEND_REQUEST':
      return `from @${payload.senderUsername}`;
    case 'FRIEND_ACCEPTED':
      return `@${payload.friendUsername} is now your ally`;
    case 'CHALLENGE_RECEIVED':
      return `@${payload.challengerName} wants to fight`;
    case 'MATCH_RESULT':
      return `${payload.outcome === 'win' ? '+' : ''}${payload.ratingDelta} rating`;
    case 'SYSTEM':
      return payload.reference;
  }
}

export function NotificationItem({
  notification,
  isFocused,
  onClick,
  onDismiss,
}: NotificationItemProps) {
  const config = ICON_MAP[notification.type] ?? ICON_MAP.SYSTEM;
  const { Icon, tone, label } = config;
  const summary = getPayloadSummary(notification.data);

  const toneClass: Record<IconConfig['tone'], string> = {
    accent: 'text-accent border-accent/40 bg-accent/5',
    success: 'text-[color:var(--sem-success)] border-[color:var(--sem-success)]/40 bg-[color:var(--sem-success)]/5',
    warning: 'text-[color:var(--sem-warning)] border-[color:var(--sem-warning)]/40 bg-[color:var(--sem-warning)]/5',
    info: 'text-text-secondary border-border-primary/40 bg-bg-secondary/50',
  };

  return (
    <button
      type="button"
      onClick={() => onClick(notification)}
      data-focused={isFocused ? 'true' : 'false'}
      className={`group w-full text-left px-4 py-3 flex gap-3 items-start border-b border-border-primary/30 hover:bg-bg-secondary/60 transition-colors ${
        !notification.read ? 'bg-accent/[0.03]' : ''
      }`}
    >
      <div className={`shrink-0 w-9 h-9 rounded border flex items-center justify-center ${toneClass[tone]}`}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-0.5">
          <span className="text-xs font-mono tracking-[0.15em] text-text-secondary/70 uppercase">
            {label}
          </span>
          {!notification.read && (
            <span
              className="w-1.5 h-1.5 rounded-full bg-accent shrink-0"
              aria-label="Unread"
            />
          )}
        </div>
        <p className="text-sm text-text-primary leading-snug line-clamp-2">
          {notification.title}
        </p>
        {summary && (
          <p className="text-[11px] text-text-secondary/70 mt-0.5 font-mono">
            {summary}
          </p>
        )}
      </div>
      {!notification.read && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss(notification.id);
          }}
          aria-label="Mark as read"
          className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity shrink-0 w-7 h-7 rounded text-text-secondary/60 hover:text-accent hover:bg-accent/10 flex items-center justify-center"
        >
          <Check size={14} />
        </button>
      )}
    </button>
  );
}
