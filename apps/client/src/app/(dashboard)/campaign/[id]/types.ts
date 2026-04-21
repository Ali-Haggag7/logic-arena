export interface LevelDetail {
  id: number;
  name: string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "ELITE";
  description: string;
  rewardRank: number;
  enemyScript: string;
  unlocked: boolean;
}

export const DIFF_CONFIG = {
  EASY: { color: "var(--color-emerald-500)", label: "EASY" },
  MEDIUM: { color: "#eab308", label: "MEDIUM" },
  HARD: { color: "var(--color-orange-500)", label: "HARD" },
  ELITE: { color: "var(--color-red-500)", label: "ELITE" },
} as const;

export type ModalState = "idle" | "loading" | "victory" | "defeat";
