export interface LevelInfo {
  id: number;
  name: string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "ELITE";
  description: string;
  rewardRank: number;
  unlocked: boolean;
  completed: boolean;
}

export const DIFF_COLORS: Record<string, { text: string; border: string; glow: string }> = {
  EASY: { text: "text-emerald-500", border: "border-emerald-500/30", glow: "rgba(16,185,129,0.6)" },
  MEDIUM: { text: "text-yellow-500", border: "border-yellow-500/30", glow: "rgba(234,179,8,0.6)" },
  HARD: { text: "text-orange-500", border: "border-orange-500/30", glow: "rgba(var(--color-orange-500),0.6)" },
  ELITE: { text: "text-red-500", border: "border-red-500/30", glow: "rgba(var(--color-red-500),0.6)" },
};
