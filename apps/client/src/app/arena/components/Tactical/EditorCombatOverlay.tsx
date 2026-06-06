import React from 'react';

interface EditorCombatOverlayProps {
  isActive: boolean;
}

export function EditorCombatOverlay({ isActive }: EditorCombatOverlayProps) {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-lg border border-red-500/30 animate-[fadeIn_0.3s_ease-out]" style={{ pointerEvents: 'auto' }}>
      <div className="flex flex-col items-center justify-center gap-3 bg-red-950/80 p-6 rounded-xl border border-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.2)] text-center">
        <span className="text-4xl animate-bounce">⚔️</span>
        <div className="flex flex-col gap-1">
          <span className="text-red-400 font-black tracking-widest uppercase text-sm">Combat In Progress</span>
          <span className="text-red-200/60 font-mono text-xs uppercase tracking-wider">No Coding Allowed</span>
        </div>
      </div>
    </div>
  );
}
