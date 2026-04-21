"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SectionHeader } from "./Shared";

const THEME_CARDS = [
  {
    id: "cyberpunk",
    label: "CYBERPUNK",
    palette: ["#0a0f1e", "#00e5ff", "#e2e8f0"],
    desc: "Dark neon — the default operative environment",
  },
  {
    id: "light",
    label: "LIGHT",
    palette: ["#f8fafc", "#0ea5e9", "#0f172a"],
    desc: "High-visibility tactical interface",
  },
  {
    id: "desert",
    label: "DESERT",
    palette: ["#1a1208", "#f59e0b", "#fde68a"],
    desc: "Amber warmth for extended operations",
  },
] as const;

export function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader>APPEARANCE</SectionHeader>
      <div className="grid grid-cols-1 gap-3">
        {THEME_CARDS.map(({ id, label, palette, desc }) => {
          const isActive = theme === id;
          return (
            <button
              key={id}
              onClick={() => setTheme(id)}
              className={`w-full text-left p-5 rounded-xl border transition-all duration-200 group ${isActive
                ? "border-accent bg-accent/[0.07] shadow-[0_0_20px_rgba(var(--accent-rgb),0.12),inset_0_0_30px_rgba(var(--accent-rgb),0.04)]"
                : "border-accent/10 bg-bg-secondary hover:border-accent/30 hover:bg-accent/[0.03]"
                }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[11px] font-black tracking-[0.25em] ${isActive ? "text-accent [text-shadow:0_0_8px_rgba(var(--accent-rgb),0.6)]" : "text-text-secondary group-hover:text-text-primary"} transition-colors`}>
                  {label}
                </span>
                <div className="flex gap-1.5 items-center">
                  {palette.map((color, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full border border-white/10"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  {isActive && (
                    <span className="ml-2 text-accent text-[10px] font-bold tracking-widest">ACTIVE</span>
                  )}
                </div>
              </div>
              <p className="text-[10px] text-text-secondary/60 tracking-[0.06em]">{desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
