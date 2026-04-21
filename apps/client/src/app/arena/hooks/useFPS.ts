import { useState, useRef, useEffect } from 'react';

export function useFPS() {
  const [fps, setFps] = useState(0);
  const frameCount = useRef(0);
  const lastTime = useRef(typeof performance !== 'undefined' ? performance.now() : 0);

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      frameCount.current++;
      const now = performance.now();
      const delta = now - lastTime.current;
      if (delta >= 500) {
        setFps(Math.round((frameCount.current / delta) * 1000));
        frameCount.current = 0;
        lastTime.current = now;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return fps;
}
