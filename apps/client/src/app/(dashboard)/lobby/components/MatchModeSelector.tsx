"use client";

import { Brain, Check, PencilLine, Shield, Swords, Timer, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactElement } from "react";
import type { MatchMode } from "../../../../context/SocketContext";

interface MatchModeSelectorProps {
  selectedMode: MatchMode;
  onSelectMode: (mode: MatchMode) => void;
  isMobile: boolean;
}

interface MatchModeFeature {
  label: string;
  Icon: LucideIcon;
}

interface MatchModeOption {
  value: MatchMode;
  eyebrow: string;
  label: string;
  summary: string;
  Icon: LucideIcon;
  features: MatchModeFeature[];
}

const MATCH_MODE_OPTIONS: MatchModeOption[] = [
  {
    value: "CLASSIC",
    eyebrow: "FAST DUEL",
    label: "Classic",
    summary: "Script first. Adapt live with limited edits.",
    Icon: Swords,
    features: [
      { label: "Pre-match script", Icon: PencilLine },
      { label: "10 edit tokens", Icon: Zap },
    ],
  },
  {
    value: "TACTICAL",
    eyebrow: "ROUND PLAY",
    label: "Tactical",
    summary: "Three rounds with breaks between fights.",
    Icon: Brain,
    features: [
      { label: "3 rounds", Icon: Timer },
      { label: "No edit limit", Icon: Shield },
    ],
  },
];

export function MatchModeSelector({
  selectedMode,
  onSelectMode,
  isMobile,
}: MatchModeSelectorProps): ReactElement {
  if (isMobile) {
    return (
      <section aria-label="Match mode" className="flex flex-col gap-2.5">
        {MATCH_MODE_OPTIONS.map((option) => {
          const isSelected = selectedMode === option.value;
          const Icon = option.Icon;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectMode(option.value)}
              className={`group flex min-h-[94px] w-full cursor-pointer items-center gap-4 rounded-[28px] border p-4 text-left transition-all duration-300 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 shadow-lg ${
                isSelected
                    ? "border-accent/50 bg-accent/[0.12] shadow-[0_14px_30px_rgba(var(--accent-rgb),0.18)]"
                    : "border-accent/10 bg-bg-secondary/50 backdrop-blur-xl hover:border-accent/20 hover:bg-bg-secondary"
              }`}
            >
              <span
                  className={`grid h-14 w-14 shrink-0 place-items-center rounded-[20px] border transition-all ${
                  isSelected
                    ? "border-accent/60 bg-gradient-to-br from-accent/80 to-accent shadow-[0_0_24px_rgba(var(--accent-rgb),0.4)] text-bg-primary"
                    : "border-accent/10 bg-bg-secondary text-text-secondary group-hover:text-text-primary"
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-base font-bold tracking-tight text-text-primary">
                    {option.label}
                  </span>
                  <span className="rounded-full border border-accent/10 bg-bg-secondary px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-text-secondary">
                    {option.eyebrow}
                  </span>
                </span>
                <span className="mt-1 block text-xs font-medium leading-relaxed text-text-secondary">
                  {option.summary}
                </span>
                <span className="mt-2.5 flex flex-wrap gap-2">
                  {option.features.map((feature) => {
                    const FeatureIcon = feature.Icon;
                    return (
                      <span
                        key={feature.label}
                        className="inline-flex h-6 items-center gap-1.5 rounded-full border border-accent/10 bg-bg-primary px-2.5 text-[9px] font-semibold uppercase tracking-wider text-text-secondary"
                      >
                        <FeatureIcon className="h-3 w-3 opacity-70" />
                        {feature.label}
                      </span>
                    );
                  })}
                </span>
              </span>

              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all ${
                  isSelected
                    ? "border-accent bg-accent text-bg-primary"
                    : "border-accent/10 bg-bg-primary text-transparent group-hover:border-accent/20"
                }`}
              >
                <Check className="h-4 w-4" />
              </span>
            </button>
          );
        })}
      </section>
    );
  }

  return (
    <section aria-label="Match mode" className="grid grid-cols-2 gap-3">
      {MATCH_MODE_OPTIONS.map((option) => {
        const isSelected = selectedMode === option.value;
        const Icon = option.Icon;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelectMode(option.value)}
            className={`group relative min-h-[110px] cursor-pointer overflow-hidden rounded-[20px] border p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
              isSelected
                ? "border-accent/50 bg-accent/[0.12] shadow-[0_0_30px_rgba(var(--accent-rgb),0.2)]"
                : "border-accent/10 bg-bg-secondary/50 backdrop-blur-2xl hover:border-accent/20 hover:bg-bg-secondary"
            }`}
          >
            <span className="pointer-events-none absolute inset-x-5 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--accent),transparent)] opacity-45" />
            <span className="flex items-start justify-between gap-4">
              <span
                className={`grid h-10 w-10 place-items-center rounded-xl border transition-all ${
                  isSelected
                    ? "border-accent/60 bg-gradient-to-br from-accent/80 to-accent text-bg-primary shadow-[0_0_16px_rgba(var(--accent-rgb),0.4)]"
                    : "border-accent/10 bg-bg-secondary text-text-secondary group-hover:text-text-primary"
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span
                className={`inline-flex h-7 items-center gap-2 rounded-full border px-3 text-[10px] font-bold transition-all ${
                  isSelected
                    ? "border-accent bg-accent text-bg-primary"
                    : "border-accent/10 bg-bg-secondary text-text-secondary group-hover:text-text-primary"
                }`}
              >
                {isSelected && <Check className="h-3.5 w-3.5" />}
                {isSelected ? "Selected" : "Select"}
              </span>
            </span>

            <span className="mt-3 block text-[9px] font-bold uppercase tracking-wider text-text-secondary">
              {option.eyebrow}
            </span>
            <span className="mt-1 block text-xl font-bold tracking-tight text-text-primary">
              {option.label}
            </span>
            <span className="mt-1 block text-[11px] font-medium leading-relaxed text-text-secondary">
              {option.summary}
            </span>

            <span className="mt-3 flex flex-wrap gap-2">
              {option.features.map((feature) => {
                const FeatureIcon = feature.Icon;
                return (
                  <span
                    key={feature.label}
                    className="inline-flex h-6 items-center gap-1.5 rounded-full border border-accent/10 bg-bg-primary px-2.5 text-[9px] font-semibold uppercase tracking-wider text-text-secondary"
                  >
                    <FeatureIcon className="h-3 w-3 opacity-70" />
                    {feature.label}
                  </span>
                );
              })}
            </span>
          </button>
        );
      })}
    </section>
  );
}
