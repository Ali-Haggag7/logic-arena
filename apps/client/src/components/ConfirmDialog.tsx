'use client';

import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

type ConfirmTone = 'danger' | 'warning' | 'accent';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: ConfirmTone;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const TONE_STYLES: Record<ConfirmTone, {
  iconWrap: string;
  icon: string;
  confirmBtn: string;
  glow: string;
}> = {
  danger: {
    iconWrap: 'border-[color:var(--sem-danger)]/40 bg-[color:var(--sem-danger)]/10',
    icon: 'text-[color:var(--sem-danger)]',
    confirmBtn:
      'border-[color:var(--sem-danger)]/40 bg-[color:var(--sem-danger)]/10 text-[color:var(--sem-danger)] hover:bg-[color:var(--sem-danger)]/20 hover:border-[color:var(--sem-danger)]/60 focus-visible:outline-[color:var(--sem-danger)]',
    glow: 'rgba(var(--sem-danger-rgb),0.15)',
  },
  warning: {
    iconWrap: 'border-[color:var(--sem-warning)]/40 bg-[color:var(--sem-warning)]/10',
    icon: 'text-[color:var(--sem-warning)]',
    confirmBtn:
      'border-[color:var(--sem-warning)]/40 bg-[color:var(--sem-warning)]/10 text-[color:var(--sem-warning)] hover:bg-[color:var(--sem-warning)]/20 hover:border-[color:var(--sem-warning)]/60 focus-visible:outline-[color:var(--sem-warning)]',
    glow: 'rgba(var(--sem-warning-rgb),0.15)',
  },
  accent: {
    iconWrap: 'border-accent/40 bg-accent/10',
    icon: 'text-accent',
    confirmBtn:
      'border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 hover:border-accent/60 focus-visible:outline-accent',
    glow: 'rgba(var(--accent-rgb),0.15)',
  },
};

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'CONFIRM',
  cancelLabel = 'CANCEL',
  tone = 'danger',
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const toneStyle = TONE_STYLES[tone];

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => cancelRef.current?.focus(), 30);

    const handleKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Enter' && !isLoading) {
        e.preventDefault();
        onConfirm();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', handleKey);
      previous?.focus();
    };
  }, [isOpen, onClose, onConfirm, isLoading]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-card/60 backdrop-blur-sm p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-bg-primary border border-accent/30 rounded-xl w-full max-w-sm font-mono overflow-hidden"
        style={{
          boxShadow: `0 0 40px ${toneStyle.glow}`,
          animation: 'modalIn 0.2s ease',
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 p-5 pb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className={`shrink-0 w-10 h-10 rounded-lg border flex items-center justify-center ${toneStyle.iconWrap}`}
            >
              <AlertTriangle size={18} className={toneStyle.icon} aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <h2
                id="confirm-dialog-title"
                className="text-accent font-black tracking-[0.16em] text-sm uppercase m-0"
              >
                {title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="shrink-0 min-w-[32px] min-h-[32px] flex items-center justify-center text-accent/40 hover:text-accent hover:bg-accent/10 rounded transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>

        <div className="px-5 pb-5">
          <p
            id="confirm-dialog-message"
            className="text-text-secondary/90 text-[12px] leading-relaxed font-mono m-0"
          >
            {message}
          </p>
        </div>

        <div className="flex gap-2 px-5 pb-5">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 min-h-[40px] text-[11px] tracking-[0.18em] font-bold border border-accent/20 bg-accent/5 text-accent/70 hover:bg-accent/10 hover:text-accent hover:border-accent/40 active:scale-95 rounded-lg transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 min-h-[40px] text-[11px] tracking-[0.18em] font-bold border rounded-lg transition-all active:scale-95 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${toneStyle.confirmBtn}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
