import { useCallback, useEffect, useRef, useState } from "react";
import { Snapshot } from "../types";

const BASE_FRAME_MS = 500;

export function useReplayPlayback(snapshots: Snapshot[]) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [lerpT, setLerpT] = useState(0);

  const snapshotsRef = useRef<Snapshot[]>([]);
  const currFrameRef = useRef(0);
  const speedRef = useRef(1);
  const isPlayingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const frameStartTimeRef = useRef<number>(0);

  useEffect(() => { snapshotsRef.current = snapshots; }, [snapshots]);
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { currFrameRef.current = currentFrame; }, [currentFrame]);

  const stopRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const tick = useCallback((timestamp: number) => {
      const snaps = snapshotsRef.current;
      const frame = currFrameRef.current;
      const spd = speedRef.current;
      const frameDuration = BASE_FRAME_MS / spd;

      const elapsed = timestamp - frameStartTimeRef.current;
      const t = Math.min(1, elapsed / frameDuration);

      setLerpT(t);

      if (t >= 1) {
        if (frame >= snaps.length - 1) {
          isPlayingRef.current = false;
          setIsPlaying(false);
          setLerpT(0);
          return;
        }
        const nextFrame = frame + 1;
        currFrameRef.current = nextFrame;
        setCurrentFrame(nextFrame);
        frameStartTimeRef.current = timestamp;
        setLerpT(0);
      }
      rafRef.current = requestAnimationFrame(tick);
    },
    []
  );

  const startRaf = useCallback((timestamp?: number) => {
      stopRaf();
      frameStartTimeRef.current = timestamp ?? performance.now();
      rafRef.current = requestAnimationFrame(tick);
    },
    [stopRaf, tick]
  );

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    if (isPlaying && snapshots.length > 0) {
      startRaf();
    } else {
      stopRaf();
    }
    return stopRaf;
  }, [isPlaying, snapshots.length, startRaf, stopRaf]);

  const handlePlay = useCallback(() => {
    if (snapshots.length === 0) return;
    if (currFrameRef.current >= snapshots.length - 1) {
      currFrameRef.current = 0;
      setCurrentFrame(0);
    }
    setIsPlaying(true);
  }, [snapshots.length]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    currFrameRef.current = 0;
    setCurrentFrame(0);
    setLerpT(0);
  }, []);

  const handleScrub = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setIsPlaying(false);
      const f = Number(e.target.value);
      currFrameRef.current = f;
      setCurrentFrame(f);
      setLerpT(0);
    },
    []
  );

  return {
    currentFrame,
    isPlaying,
    speed,
    lerpT,
    setSpeed,
    handlePlay,
    handlePause,
    handleReset,
    handleScrub,
  };
}
