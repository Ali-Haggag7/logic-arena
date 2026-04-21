"use client";

import React, { useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { CommandConsole } from './CommandConsole';

interface MobileControlsProps {
  socket: any;
  selectedRobotId: string;
  scriptId: string | null;
  availableRobots: any[];
  setSelectedRobotId: (id: string) => void;
  isMobile: boolean;
}

export function MobileControls({
  socket,
  selectedRobotId,
  scriptId,
  availableRobots,
  setSelectedRobotId,
  isMobile,
}: MobileControlsProps) {
  const [activeSheet, setActiveSheet] = useState<'controls' | 'script' | 'tactical' | null>(null);

  if (!isMobile) return null;

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[50] flex flex-row items-center gap-5 pointer-events-auto">
        <button
          onClick={() => setActiveSheet(activeSheet === 'controls' ? null : 'controls')}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${activeSheet === 'controls'
            ? 'bg-cyan-500/90 shadow-[0_0_16px_rgba(34,211,238,0.6)] scale-105'
            : 'bg-black/70 border border-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.6)]'
            }`}
        >
          <span className="text-base">⚡</span>
        </button>

        <button
          onClick={() => setActiveSheet(activeSheet === 'script' ? null : 'script')}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${activeSheet === 'script'
            ? 'bg-cyan-500/90 shadow-[0_0_16px_rgba(34,211,238,0.6)] scale-105'
            : 'bg-black/70 border border-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.6)]'
            }`}
        >
          <span className="text-base">📟</span>
        </button>
      </div>

      <BottomSheet
        isMobile={isMobile}
        isOpen={activeSheet === 'controls'}
        onClose={() => setActiveSheet(null)}
        title="COMBAT_OVERRIDE"
      >
        <CommandConsole
          socket={socket}
          robotId={selectedRobotId}
          scriptId={scriptId}
          availableRobots={availableRobots}
          onRobotChange={setSelectedRobotId}
          isMobile={isMobile}
          mobileSheet="controls"
        />
      </BottomSheet>

      <BottomSheet
        isMobile={isMobile}
        isOpen={activeSheet === 'script'}
        onClose={() => setActiveSheet(null)}
        title="ALISCRIPT_EDITOR"
      >
        <CommandConsole
          socket={socket}
          robotId={selectedRobotId}
          scriptId={scriptId}
          availableRobots={availableRobots}
          onRobotChange={setSelectedRobotId}
          isMobile={isMobile}
          mobileSheet="script"
        />
      </BottomSheet>
    </>
  );
}
