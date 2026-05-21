"use client";

import { useCallback } from "react";
import { apiClient } from "../../../../lib/api-client";
import type { ApiLevelInfo } from "../types/campaign.types";

const CACHE_PREFIX = "logic-arena:campaign-level:";
const CACHE_TTL_MS = 5 * 60 * 1000;
const NEXT_LEVEL_PATTERN = /^(.*-)(\d+)$/;

interface CachedLevel {
  cachedAt: number;
  level: ApiLevelInfo;
}

function getCacheKey(levelId: string): string {
  return `${CACHE_PREFIX}${levelId}`;
}

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function getCachedCampaignLevel(levelId: string): ApiLevelInfo | null {
  if (!canUseStorage()) return null;

  const raw = window.sessionStorage.getItem(getCacheKey(levelId));
  if (!raw) return null;

  try {
    const cached = JSON.parse(raw) as CachedLevel;
    if (Date.now() - cached.cachedAt > CACHE_TTL_MS) {
      window.sessionStorage.removeItem(getCacheKey(levelId));
      return null;
    }
    return cached.level;
  } catch {
    window.sessionStorage.removeItem(getCacheKey(levelId));
    return null;
  }
}

export function cacheCampaignLevel(level: ApiLevelInfo): void {
  if (!canUseStorage()) return;

  const cached: CachedLevel = {
    cachedAt: Date.now(),
    level,
  };
  window.sessionStorage.setItem(getCacheKey(level.id), JSON.stringify(cached));
}

function getNextLevelId(level: ApiLevelInfo): string | null {
  const match = level.id.match(NEXT_LEVEL_PATTERN);
  if (!match) return null;

  const [, prefix, rawIndex] = match;
  const nextIndex = String(Number.parseInt(rawIndex, 10) + 1).padStart(rawIndex.length, "0");
  return `${prefix}${nextIndex}`;
}

export function useCampaignPrefetch(): {
  prefetchLevel: (levelId: string) => Promise<void>;
  prefetchNextLevel: (level: ApiLevelInfo) => Promise<void>;
} {
  const prefetchLevel = useCallback(async (levelId: string): Promise<void> => {
    if (!levelId || getCachedCampaignLevel(levelId)) return;

    try {
      const response = await apiClient.get<ApiLevelInfo>(`/campaign/levels/${levelId}`);
      cacheCampaignLevel(response.data);
    } catch {
      // Prefetch is opportunistic; the normal level load path handles errors.
    }
  }, []);

  const prefetchNextLevel = useCallback(async (level: ApiLevelInfo): Promise<void> => {
    const nextLevelId = getNextLevelId(level);
    if (!nextLevelId) return;
    await prefetchLevel(nextLevelId);
  }, [prefetchLevel]);

  return { prefetchLevel, prefetchNextLevel };
}
