'use client';

import React, { useState } from 'react';
import { ChevronDown, Lightbulb } from 'lucide-react';
import { ROTATION_SYSTEM_GUIDE, RotationExample } from '../constants/docsData';
import { SectionLabel } from './SectionLabel';

interface RotationSystemSectionProps {
  onLoadScript: (code: string) => void;
  isMobile: boolean;
}

const splitTitle = (title: string) => {
  const parts = title.split(/--|---| - |â€”/);
  return {
    name: parts[0]?.trim() ?? title,
    detail: parts.slice(1).join(' - ').trim() || 'Example',
  };
};

const ExampleCard = ({
  example,
  onLoadScript,
  isExpanded,
  onToggle,
  isMobile,
  index,
}: {
  example: RotationExample;
  onLoadScript: (code: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
  isMobile: boolean;
  index: number;
}) => {
  const color = 'var(--docs-orange)';
  const codeColor = 'var(--docs-yellow)';
  const title = splitTitle(example.title);

  return (
    <div
      className={`border bg-card/60 backdrop-blur-sm transition-all duration-300 rounded-xl overflow-hidden ${isExpanded ? 'ring-1 ring-accent/20' : ''}`}
      style={{
        borderColor: isExpanded ? `color-mix(in srgb, ${color} 40%, transparent)` : `color-mix(in srgb, ${color} 14%, transparent)`,
        boxShadow: isExpanded ? `0 0 20px color-mix(in srgb, ${color} 13%, transparent)` : 'none',
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center justify-between ${isMobile ? 'px-4 py-4' : 'px-5 py-4'} text-left transition-colors hover:bg-text-primary/[0.02]`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Lightbulb className="w-4 h-4 shrink-0" style={{ color }} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-bold tracking-widest uppercase"
                style={{ color: `color-mix(in srgb, ${color} 62%, transparent)` }}
              >
                EX_{String(index + 1).padStart(2, '0')}
              </span>
              <h3
                className={`${isMobile ? 'text-[11px]' : 'text-sm'} font-black tracking-[0.1em] uppercase truncate`}
                style={{ color }}
              >
                {title.name}
              </h3>
            </div>
            <p className="text-[9px] text-text-primary/40 tracking-wider font-bold uppercase mt-1">
              {title.detail}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-300 opacity-40 ${isExpanded ? 'rotate-180' : ''}`}
          style={{ color }}
        />
      </button>

      {isExpanded && (
        <div
          className={`${isMobile ? 'px-4' : 'px-5'} pb-5 border-t animate-in fade-in slide-in-from-top-1 duration-200`}
          style={{ borderColor: `color-mix(in srgb, ${color} 12%, transparent)` }}
        >
          <p className="text-[11px] text-text-primary/60 mt-4 mb-4 leading-relaxed tracking-wide font-medium">
            {example.description}
          </p>

          <div
            className="mb-4 p-3 rounded-lg border"
            style={{
              background: `color-mix(in srgb, ${color} 5%, transparent)`,
              borderColor: `color-mix(in srgb, ${color} 20%, transparent)`,
            }}
          >
            <span className="text-[9px] font-black tracking-widest uppercase block mb-1" style={{ color }}>
              Result:
            </span>
            <span className="text-[11px] leading-relaxed font-medium" style={{ color: `color-mix(in srgb, ${color} 82%, var(--text-primary))` }}>
              {example.result}
            </span>
          </div>

          <div className="relative">
            <div
              className="absolute inset-0 opacity-5 rounded-lg pointer-events-none"
              style={{ background: `linear-gradient(135deg, ${color}, transparent)` }}
            />
            <pre
              className={`text-[10px] leading-relaxed p-4 rounded-lg overflow-x-auto font-mono bg-card/60 backdrop-blur-md docs-scrollbar border ${isMobile ? 'max-h-[200px]' : ''}`}
              style={{
                color: codeColor,
                borderColor: `color-mix(in srgb, ${color} 20%, transparent)`,
              }}
            >
              {example.code}
            </pre>
          </div>

          <button
            type="button"
            onClick={() => onLoadScript(example.code)}
            className="mt-4 w-full py-3 text-[10px] font-black tracking-[0.3em] uppercase transition-all border rounded-lg active:scale-[0.98] hover:opacity-90 cursor-pointer"
            style={{
              color,
              borderColor: `color-mix(in srgb, ${color} 40%, transparent)`,
              background: `color-mix(in srgb, ${color} 5%, transparent)`,
            }}
          >
            LOAD_TO_CORE
          </button>
        </div>
      )}
    </div>
  );
};

export const RotationSystemSection = ({ onLoadScript, isMobile }: RotationSystemSectionProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const color = 'var(--docs-orange)';

  return (
    <section className={isMobile ? 'mb-10' : 'mb-16'}>
      <SectionLabel text="ROTATION SYSTEM v2.3" isMobile={isMobile} />

      <div className={`flex flex-col ${isMobile ? 'gap-6' : 'gap-10'} mt-5`}>
        <div>
          <SectionLabel text="THE_3_CONTROLS" isMobile={isMobile} />
          <div className="grid gap-3 mt-4">
            {ROTATION_SYSTEM_GUIDE.controls.map((ctrl) => (
              <div
                key={ctrl.name}
                className={`${isMobile ? 'flex flex-col p-4' : 'grid grid-cols-[140px_1fr_1fr] items-center p-4'} gap-4 rounded-xl border bg-card/40 transition-colors hover:bg-text-primary/[0.02]`}
                style={{ borderColor: `color-mix(in srgb, ${color} 20%, transparent)` }}
              >
                <div className="flex flex-col gap-1">
                  <code className="text-xs font-black tracking-wider" style={{ color: 'var(--docs-yellow)' }}>
                    {ctrl.name}
                  </code>
                  {ctrl.alias && (
                    <span className="text-[9px] text-text-secondary/50 font-mono tracking-tighter">
                      alias: {ctrl.alias.join(', ')}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest" style={{ color: `color-mix(in srgb, ${color} 74%, var(--text-primary))` }}>
                    {ctrl.controls}
                  </span>
                  <div className="flex gap-2 text-[9px] font-mono">
                    <span className={ctrl.affectsMovement ? 'text-green-400' : 'text-text-secondary/30'}>
                      [MOVE {ctrl.affectsMovement ? 'YES' : 'NO'}]
                    </span>
                    <span className={ctrl.affectsVision ? 'text-cyan-400' : 'text-text-secondary/30'}>
                      [VISION {ctrl.affectsVision ? 'YES' : 'NO'}]
                    </span>
                  </div>
                </div>
                <span className={`${isMobile ? 'text-[10px]' : 'text-[11px]'} text-text-secondary leading-relaxed opacity-80`}>
                  {ctrl.description}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionLabel text="COMMON_ANGLES" isMobile={isMobile} />
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4">
            {ROTATION_SYSTEM_GUIDE.angleReference.map((angle) => (
              <div
                key={angle.value}
                className="flex flex-col items-center justify-center p-3 rounded-lg border bg-card/30"
                style={{ borderColor: `color-mix(in srgb, ${color} 12%, transparent)` }}
              >
                <span className="text-2xl mb-1" style={{ color }}>
                  {angle.direction}
                </span>
                <code className="text-[11px] font-black" style={{ color: 'var(--docs-yellow)' }}>
                  {angle.value}
                </code>
                <span className="text-[9px] font-bold tracking-wider text-text-secondary/60 mt-1 uppercase text-center">
                  {angle.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionLabel text="CONFLICT_RESOLUTION" isMobile={isMobile} />
          <div
            className="mt-4 rounded-xl border bg-card/40 overflow-hidden"
            style={{ borderColor: `color-mix(in srgb, ${color} 20%, transparent)` }}
          >
            <div className="grid grid-cols-1 divide-y divide-text-primary/5">
              {ROTATION_SYSTEM_GUIDE.conflictRules.map((rule, idx) => (
                <div key={idx} className={`${isMobile ? 'flex flex-col p-3 gap-2' : 'grid grid-cols-[260px_1fr] p-3 gap-6 items-center'} hover:bg-text-primary/[0.02]`}>
                  <div className="text-[10px] font-mono" style={{ color: `color-mix(in srgb, ${color} 84%, var(--text-primary))` }}>
                    {rule.scenario}
                  </div>
                  <div className="text-[11px] text-text-secondary/80 leading-relaxed">{rule.outcome}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <SectionLabel text="EXAMPLE_SCRIPTS" isMobile={isMobile} />
          <div className="flex flex-col gap-3 mt-4">
            {ROTATION_SYSTEM_GUIDE.examples.map((example, i) => (
              <ExampleCard
                key={example.title}
                example={example}
                index={i}
                onLoadScript={onLoadScript}
                isExpanded={expandedIndex === i}
                onToggle={() => setExpandedIndex(prev => (prev === i ? null : i))}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
