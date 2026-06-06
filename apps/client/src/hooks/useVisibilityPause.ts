"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * A polling hook that automatically pauses when the browser tab is hidden.
 * Runs the callback immediately on mount, then at the given interval — but
 * only while `document.visibilityState === "visible"`.
 *
 * When the user returns to the tab the callback fires once immediately,
 * then resumes the normal interval cadence.
 *
 * @param callback  The function to invoke on each tick.
 * @param intervalMs  The polling interval in milliseconds.
 * @param enabled  Optional flag to disable the hook entirely (default: true).
 */
export function useVisibilityPause(
  callback: () => void,
  intervalMs: number,
  enabled = true,
): void {
  const savedCallback = useRef(callback);

  // Keep the ref current so the interval always calls the latest closure.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const tick = useCallback(() => {
    if (document.visibilityState === "visible") {
      savedCallback.current();
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Fire once immediately.
    tick();

    const id = setInterval(tick, intervalMs);

    // When the user returns to the tab, fire immediately instead of
    // waiting for the next interval tick.
    const handleVisibilityChange = (): void => {
      if (document.visibilityState === "visible") {
        savedCallback.current();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [intervalMs, enabled, tick]);
}
