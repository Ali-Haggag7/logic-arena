import React, { useEffect, useState } from 'react';

interface RoundTransitionOverlayProps {
  phase: string;
}

export function RoundTransitionOverlay({ phase }: RoundTransitionOverlayProps) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayPhase, setOverlayPhase] = useState(phase);

  useEffect(() => {
    if (phase !== overlayPhase) {
      if (phase === 'BREAK') {
        setShowOverlay(true);
        const timer = setTimeout(() => {
          setShowOverlay(false);
          setOverlayPhase(phase);
        }, 2000);
        return () => clearTimeout(timer);
      } else {
        setOverlayPhase(phase);
      }
    }
  }, [phase, overlayPhase]);

  if (!showOverlay) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl animate-[fadeIn_0.2s_ease-out]" style={{ pointerEvents: 'auto' }}>
      <div className="flex flex-col items-center animate-[scaleIn_0.3s_ease-out_forwards]">
        <h1 className="text-5xl font-black text-cyan-400 tracking-tighter drop-shadow-[0_0_20px_rgba(34,211,238,0.5)] mb-4 uppercase">
          Round Complete
        </h1>
        <p className="text-cyan-100/70 font-mono text-lg tracking-widest uppercase">
          Analyze the field. Update your strategy.
        </p>
      </div>
    </div>
  );
}
