'use client';

import React, { useState } from 'react';
import {
  UserPlus,
  UserCheck,
  Swords,
  Trophy,
  Info,
  Check,
  Trash2,
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
  onDelete: (id: string) => void;
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
  onDelete,
}: NotificationItemProps) {
  const [hovered, setHovered] = useState(false);
  const config = ICON_MAP[notification.type] ?? ICON_MAP.SYSTEM;
  const { Icon, tone, label } = config;
  const summary = getPayloadSummary(notification.data);

  const toneClass: Record<IconConfig['tone'], string> = {
    accent: 'text-accent border-accent/40 bg-accent/5',
    success:
      'text-[color:var(--sem-success)] border-[color:var(--sem-success)]/40 bg-[color:var(--sem-success)]/5',
    warning:
      'text-[color:var(--sem-warning)] border-[color:var(--sem-warning)]/40 bg-[color:var(--sem-warning)]/5',
    info: 'text-text-secondary border-accent/20 bg-bg-secondary/50',
  };

  return (
    <div
      role="button"
      tabIndex={0}
      data-focused={isFocused ? 'true' : 'false'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(notification)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(notification);
        }
      }}
      className={`group relative w-full text-left px-4 py-3 flex gap-3 items-start cursor-pointer transition-colors duration-150 ${
        !notification.read ? 'bg-accent/[0.04]' : ''
      } hover:bg-accent/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-[-2px] focus-visible:bg-accent/[0.08]`}
    >
      <div
        className={`shrink-0 w-9 h-9 rounded border flex items-center justify-center transition-transform duration-150 ${
          toneClass[tone]
        } ${hovered ? 'scale-105' : ''}`}
      >
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-0.5">
          <span className="text-[10px] font-mono tracking-[0.18em] text-text-secondary/70 uppercase">
            {label}
          </span>
          {!notification.read && (
            <span
              className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 animate-pulse"
              aria-label="Unread"
            />
          )}
        </div>
        <p
          className={`text-sm leading-snug line-clamp-2 ${
            notification.read ? 'text-text-secondary' : 'text-text-primary font-medium'
          }`}
        >
          {notification.title}
        </p>
        {summary && (
          <p className="text-[11px] text-text-secondary/70 mt-0.5 font-mono">
            {summary}
          </p>
        )}
      </div>
      <div
        className={`flex items-center gap-1 shrink-0 transition-opacity duration-150 ${
          hovered || !notification.read ? 'opacity-100' : 'opacity-0'
        }`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {!notification.read && (
          <button
            type="button"
            data-action="mark-read"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onDismiss(notification.id);
            }}
            aria-label="Mark as read"
            title="Mark as read"
            className="w-7 h-7 rounded text-text-secondary/60 hover:text-[color:var(--sem-success)] hover:bg-[color:var(--sem-success)]/10 active:scale-90 flex items-center justify-center cursor-pointer transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--sem-success)] focus-visible:outline-offset-2"
          >
            <Check size={14} />
          </button>
        )}
        <button
          type="button"
          data-action="delete"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
          aria-label="Delete notification"
          title="Delete"
          className="w-7 h-7 rounded text-text-secondary/60 hover:text-[color:var(--sem-danger)] hover:bg-[color:var(--sem-danger)]/10 active:scale-90 flex items-center justify-center cursor-pointer transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--sem-danger)] focus-visible:outline-offset-2"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
