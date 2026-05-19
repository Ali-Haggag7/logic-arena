'use client';

import { Bot } from 'lucide-react';

interface ChatTriggerProps {
  isMobile: boolean;
  onClick: () => void;
}

export function ChatTrigger({ isMobile, onClick }: ChatTriggerProps) {
  const triggerPositionClass = isMobile
    ? 'fixed bottom-[88px] left-4 z-[100]'
    : 'fixed bottom-6 right-6 z-[100]';

  const triggerContent = isMobile ? (
    <Bot size={20} />
  ) : (
    <>
      <Bot size={18} />
      ARIA
    </>
  );

  const triggerClass = isMobile
    ? `${triggerPositionClass} flex items-center justify-center w-[48px] h-[48px] rounded-full border border-accent/40 bg-bg-primary text-accent hover:bg-accent/10 transition-all cursor-pointer`
    : `${triggerPositionClass} flex items-center gap-2 px-4 py-3 rounded-xl border border-accent/40 bg-bg-primary text-accent font-mono text-[11px] tracking-[0.18em] font-bold hover:bg-accent/10 transition-all cursor-pointer`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={triggerClass}
      style={{
        boxShadow: '0 0 20px rgba(var(--accent-rgb),0.2), 0 0 40px rgba(var(--accent-rgb),0.1)',
        animation: 'pulse-glow 3s ease-in-out infinite',
      }}
      aria-label="Open ARIA AI Tutor"
    >
      {triggerContent}
    </button>
  );
}
