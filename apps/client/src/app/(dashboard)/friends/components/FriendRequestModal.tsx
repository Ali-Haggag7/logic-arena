'use client';

import React, { useEffect, useRef } from 'react';
import { Check, X, UserPlus } from 'lucide-react';
import type { IncomingFriendRequest } from '../../../../hooks/useFriendsSystem';

interface FriendRequestModalProps {
  request: IncomingFriendRequest | null;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
}

export function FriendRequestModal({ request, onAccept, onDecline }: FriendRequestModalProps) {
  const acceptButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!request) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    acceptButtonRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDecline(request.request.id);
    };
    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
      previousFocusRef.current?.focus();
    };
  }, [request, onDecline]);

  if (!request) return null;

  const { sender, message } = request.request;

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="friend-request-title"
      style={{
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div
        className="max-w-sm w-full mx-4 font-mono"
        style={{
          borderRadius: 24,
          background: 'rgba(var(--bg-card),0.94)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          padding: 24,
          border: '1px solid rgba(var(--accent-rgb),0.12)',
          boxShadow: '0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(var(--accent-rgb),0.05)',
          animation: 'modalIn 0.2s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div className="flex flex-col items-center text-center mb-5">
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              background: 'rgba(var(--accent-rgb),0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}
          >
            <UserPlus size={22} className="text-accent" />
          </div>
          <h2
            id="friend-request-title"
            className="text-accent font-bold text-lg mb-1"
          >
            Friend Request
          </h2>
          <p className="text-sm" style={{ color: 'rgba(var(--accent-rgb),0.6)' }}>
            <span className="text-accent font-semibold">{sender.username}</span> wants to be your ally
          </p>
        </div>
        {message && (
          <div
            className="mb-4 text-sm italic"
            style={{
              padding: '10px 14px',
              borderRadius: 12,
              background: 'rgba(var(--accent-rgb),0.06)',
              color: 'rgba(var(--accent-rgb),0.7)',
              borderLeft: '3px solid rgba(var(--accent-rgb),0.3)',
            }}
          >
            &ldquo;{message}&rdquo;
          </div>
        )}
        <div className="flex gap-3">
          <button
            ref={acceptButtonRef}
            type="button"
            onClick={() => onAccept(request.request.id)}
            aria-label={`Accept friend request from ${sender.username}`}
            className="flex-1 min-h-[48px] text-[12px] font-semibold cursor-pointer transition-all duration-150 active:scale-[0.97] flex items-center justify-center gap-2"
            style={{
              borderRadius: 14,
              background: 'rgba(var(--sem-success-rgb),0.12)',
              color: 'var(--sem-success)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(var(--sem-success-rgb),0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(var(--sem-success-rgb),0.12)'; }}
          >
            <Check size={16} aria-hidden="true" />
            Accept
          </button>
          <button
            type="button"
            onClick={() => onDecline(request.request.id)}
            aria-label={`Decline friend request from ${sender.username}`}
            className="flex-1 min-h-[48px] text-[12px] font-semibold cursor-pointer transition-all duration-150 active:scale-[0.97] flex items-center justify-center gap-2"
            style={{
              borderRadius: 14,
              background: 'rgba(var(--sem-danger-rgb),0.08)',
              color: 'var(--sem-danger)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(var(--sem-danger-rgb),0.15)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(var(--sem-danger-rgb),0.08)'; }}
          >
            <X size={16} aria-hidden="true" />
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
