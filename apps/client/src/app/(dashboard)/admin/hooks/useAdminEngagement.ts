"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { requestAdminWithRetry } from "./adminRequest";

const REFRESH_INTERVAL_MS = 120_000;

export interface EngagementStats {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  engagementRate: number;
  activityTimeline: { date: string; count: number }[];
  matchCompletionRate: number;
  avgMatchesPerActiveUser: number;
}

interface UseAdminEngagementResult {
  stats: EngagementStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Unable to load engagement stats";
}

export function useAdminEngagement(): UseAdminEngagementResult {
  const [stats, setStats] = useState<EngagementStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef<boolean>(false);

  const refetch = useCallback(async (): Promise<void> => {
    setIsLoading(!hasLoadedRef.current);
    setError(null);

    try {
      const response = await requestAdminWithRetry(() => apiClient.get<EngagementStats>("/admin/stats/engagement"));
      setStats(response.data);
      hasLoadedRef.current = true;
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect((): (() => void) => {
    void refetch();
    const intervalId = window.setInterval(() => {
      void refetch();
    }, REFRESH_INTERVAL_MS);

    return (): void => {
      window.clearInterval(intervalId);
    };
  }, [refetch]);

  return { stats, isLoading, error, refetch };
}
