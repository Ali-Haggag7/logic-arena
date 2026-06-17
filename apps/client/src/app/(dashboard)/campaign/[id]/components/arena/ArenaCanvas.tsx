"use client";
import React, { useCallback, useEffect, useRef, memo, useState } from "react";
import { FastForward, Pause, Play, Rewind } from "lucide-react";
import type { ArenaRobot, SceneDef, SceneState } from "./scenes";
import { createEvalState } from "./miniEvaluator";
import type { EvalState } from "./miniEvaluator";

import { ROBOT_SIZE, FOV_SWEEP_FRAMES, FLASH_DURATION, BATTLE_END_DELAY_MS } from "./constants";
import { drawGrid, drawScanLine, drawLabel, drawGraphNet } from "./rendering/drawBackground";
import { drawFovCone, drawRobot } from "./rendering/drawRobot";
import { drawProjectile } from "./rendering/drawProjectile";
import { drawObstacle } from "./rendering/drawObstacle";
import { updateProjectiles } from "./physics/projectileSystem";
import type { RuntimeArenaRobot } from "./combat/applyAction";
import { tickFovTimers, ensureEnemyFov } from "./combat/fovSystem";
import { runEvalTick } from "./battle/battleOrchestrator";
import { syncReplayFrame, type CampaignFrame } from "./battle/replaySync";

const TARGET_FPS = 60;
const FRAME_MS = 1000 / TARGET_FPS;
const FRAME_THROTTLE_TOLERANCE_MS = 2;
const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 280;
const DEFAULT_ACCENT_RGB = "34,211,238";
const DEFAULT_WARNING_COLOR = "#f59e0b";
const DEFAULT_DANGER_COLOR = "#ef4444";
const DEFAULT_WARNING_RGB = "245,158,11";
const DEFAULT_DANGER_RGB = "239,68,68";
const PLAYER_SCRIPT_ERROR_Y_OFFSET = 7;
const ENEMY_SCRIPT_ERROR_Y = 14;
const ERROR_TEXT_X = 8;
const ERROR_FONT_SCALE = 0.022;
const ERROR_MIN_FONT_SIZE = 10;
const ERROR_ALPHA_BASE = 0.5;
const ERROR_ALPHA_RANGE = 0.3;
const ERROR_ALPHA_SPEED = 0.08;
const BOSS_VISUAL_SCALE = 1.32;
const BOSS_AURA_SCALE = 2.7;
const BOSS_AURA_PULSE_SCALE = 0.3;
const BOSS_SPIKE_COUNT = 8;
const BOSS_SPIKE_LONG_SCALE = 1.18;
const BOSS_SPIKE_SHORT_SCALE = 0.78;
const BOSS_CORE_SCALE = 0.34;
const BOSS_CANNON_START_SCALE = 0.2;
const BOSS_CANNON_END_SCALE = 1.62;
const BOSS_TRAIL_COUNT = 3;
const BOSS_TRAIL_SPACING = 0.9;
const BOSS_TRAIL_ALPHA = 0.12;
const BOSS_TRAIL_GROWTH_SCALE = 0.16;
const BOSS_AURA_INNER_ALPHA = 0.32;
const BOSS_AURA_MID_STOP = 0.48;
const BOSS_AURA_MID_ALPHA = 0.12;
const BOSS_BODY_ALPHA = 0.22;
const BOSS_BODY_LINE_WIDTH = 2.2;
const BOSS_BODY_SHADOW_SCALE = 0.75;
const BOSS_CANNON_SHADOW_SCALE = 0.45;
const BOSS_CANNON_LINE_WIDTH = 2.8;
const SIMULATION_TICKS_PER_SECOND = 60;
const REPLAY_SEEK_SECONDS = 5;
const REPLAY_SEEK_TICKS = SIMULATION_TICKS_PER_SECOND * REPLAY_SEEK_SECONDS;
const REPLAY_FRAME_INTERVAL_MS = 50;
const REPLAY_UI_UPDATE_MS = 100;
const REPLAY_SPEEDS = [1, 1.25, 1.5, 2] as const;

function formatReplayTime(tick: number): string {
  const totalSeconds = Math.max(0, Math.floor(tick / SIMULATION_TICKS_PER_SECOND));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

interface ArenaCanvasProps {
  scene: SceneDef;
  levelId: string;
  userScript?: string;
  enemyScript?: string;
  onBattleEnd?: (winner: 'player' | 'enemy' | 'draw') => void;
  latestFrameRef?: React.MutableRefObject<CampaignFrame | null>;
  replayFramesRef?: React.MutableRefObject<CampaignFrame[]>;
  isReplaying?: boolean;
  fightResult?: { winner: string; completionToken: string | null; tick?: number; fightDurationTicks?: number } | null;
  serverPaused?: boolean;
  onPauseFight?: () => void;
  onResumeFight?: () => void;
  aspectRatio?: number;
  className?: string;
  waitingForReplay?: boolean;
  isBossLevel?: boolean;
}

function drawBossRobot(
  ctx: CanvasRenderingContext2D,
  robot: ArenaRobot,
  W: number,
  H: number,
  tick: number,
  fovAlpha: number,
  dangerColor: string,
  warningColor: string,
  dangerRgb: string,
  warningRgb: string,
): void {
  if (!robot.isAlive) return;

  const bossRobot: ArenaRobot = { ...robot, color: dangerColor };
  drawFovCone(ctx, bossRobot, W, H, fovAlpha);

  const px = robot.x * W;
  const py = robot.y * H;
  const r = robot.size * Math.min(W, H) * BOSS_VISUAL_SCALE;
  const invPulse = robot.invulnerableTimer > 0 ? 0.3 + Math.sin(tick * 0.3) * 0.3 : 0;
  const alpha = robot.invulnerableTimer > 0 ? 0.4 + invPulse : 1;

  ctx.save();
  ctx.translate(px, py);
  ctx.globalAlpha = alpha;

  for (let index = BOSS_TRAIL_COUNT; index > 0; index--) {
    const offset = index * r * BOSS_TRAIL_SPACING;
    ctx.fillStyle = `rgba(${dangerRgb},${BOSS_TRAIL_ALPHA / index})`;
    ctx.beginPath();
    ctx.arc(-Math.cos(robot.angle) * offset, -Math.sin(robot.angle) * offset, r * (1 + index * BOSS_TRAIL_GROWTH_SCALE), 0, Math.PI * 2);
    ctx.fill();
  }

  const glowRadius = r * (BOSS_AURA_SCALE + Math.sin(tick * 0.075) * BOSS_AURA_PULSE_SCALE);
  const gradient = ctx.createRadialGradient(0, 0, r * BOSS_CORE_SCALE, 0, 0, glowRadius);
  gradient.addColorStop(0, `rgba(${dangerRgb},${BOSS_AURA_INNER_ALPHA})`);
  gradient.addColorStop(BOSS_AURA_MID_STOP, `rgba(${warningRgb},${BOSS_AURA_MID_ALPHA})`);
  gradient.addColorStop(1, "transparent");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.rotate(robot.angle);
  ctx.beginPath();
  for (let index = 0; index < BOSS_SPIKE_COUNT; index++) {
    const angle = (index / BOSS_SPIKE_COUNT) * Math.PI * 2;
    const scale = index % 2 === 0 ? BOSS_SPIKE_LONG_SCALE : BOSS_SPIKE_SHORT_SCALE;
    const rx = Math.cos(angle) * r * scale;
    const ry = Math.sin(angle) * r * scale;
    index === 0 ? ctx.moveTo(rx, ry) : ctx.lineTo(rx, ry);
  }
  ctx.closePath();
  ctx.fillStyle = `rgba(${dangerRgb},${BOSS_BODY_ALPHA})`;
  ctx.strokeStyle = dangerColor;
  ctx.lineWidth = BOSS_BODY_LINE_WIDTH;
  ctx.shadowColor = dangerColor;
  ctx.shadowBlur = r * BOSS_BODY_SHADOW_SCALE;
  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = r * BOSS_CANNON_SHADOW_SCALE;
  ctx.strokeStyle = warningColor;
  ctx.lineWidth = BOSS_CANNON_LINE_WIDTH;
  ctx.beginPath();
  ctx.moveTo(r * BOSS_CANNON_START_SCALE, 0);
  ctx.lineTo(r * BOSS_CANNON_END_SCALE, 0);
  ctx.stroke();

  ctx.fillStyle = warningColor;
  ctx.beginPath();
  ctx.arc(0, 0, r * BOSS_CORE_SCALE, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export const ArenaCanvas = memo(function ArenaCanvas({
  scene,
  levelId,
  userScript,
  enemyScript: enemyScriptProp,
  onBattleEnd,
  latestFrameRef,
  replayFramesRef,
  isReplaying = false,
  fightResult,
  serverPaused = false,
  onPauseFight,
  onResumeFight,
  aspectRatio = 16 / 7,
  className = "",
  waitingForReplay = false,
  isBossLevel = false,
}: ArenaCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<SceneState>(scene.init());
  const evalRef = useRef<Map<string, EvalState | null>>(new Map());
  const rafRef = useRef<number>(0);
  const visibleRef = useRef(true);
  const nextIdRef = useRef({ current: 0 });
  const errRef = useRef<Set<string>>(new Set());
  const accentRgbRef = useRef(DEFAULT_ACCENT_RGB);
  const warningColorRef = useRef(DEFAULT_WARNING_COLOR);
  const dangerColorRef = useRef(DEFAULT_DANGER_COLOR);
  const warningRgbRef = useRef(DEFAULT_WARNING_RGB);
  const dangerRgbRef = useRef(DEFAULT_DANGER_RGB);
  const bgPrimaryRef = useRef("rgba(3,7,18,0.92)");
  const pausedRef = useRef(false);
  const [isPaused, setIsPaused] = useState(false);
  const replayFrameIndexRef = useRef(0);
  const replayLastAdvanceRef = useRef(0);
  const replayLastUiUpdateRef = useRef(0);
  const replaySpeedIndexRef = useRef(0);
  const resultAnnouncedRef = useRef(false);
  const [replayFrameIndex, setReplayFrameIndex] = useState(0);
  const [replaySpeedIndex, setReplaySpeedIndex] = useState(0);
  const serverPausedRef = useRef(serverPaused);

  const fovTimerRef = useRef<Map<string, number>>(new Map());
  const flashTimerRef = useRef(0);

  const battleEndedRef = useRef(false);
  const battleEvalTickRef = useRef(0);
  const onBattleEndRef = useRef(onBattleEnd);
  useEffect(() => { onBattleEndRef.current = onBattleEnd; }, [onBattleEnd]);

  const fightResultRef = useRef(fightResult);
  useEffect(() => { fightResultRef.current = fightResult; }, [fightResult]);
  useEffect(() => { serverPausedRef.current = serverPaused; }, [serverPaused]);

  const userScriptRef = useRef(userScript);
  useEffect(() => { userScriptRef.current = userScript; }, [userScript]);
  const enemyScriptPropRef = useRef(enemyScriptProp);
  useEffect(() => { enemyScriptPropRef.current = enemyScriptProp; }, [enemyScriptProp]);

  useEffect(() => {
    const updateAccentRgb = (): void => {
      const css = getComputedStyle(document.documentElement);
      accentRgbRef.current = css.getPropertyValue('--accent-rgb').trim() || DEFAULT_ACCENT_RGB;
      warningColorRef.current = css.getPropertyValue('--sem-warning').trim() || DEFAULT_WARNING_COLOR;
      dangerColorRef.current = css.getPropertyValue('--sem-danger').trim() || DEFAULT_DANGER_COLOR;
      warningRgbRef.current = css.getPropertyValue('--sem-warning-rgb').trim() || DEFAULT_WARNING_RGB;
      dangerRgbRef.current = css.getPropertyValue('--sem-danger-rgb').trim() || DEFAULT_DANGER_RGB;
      const bg = css.getPropertyValue('--bg-primary').trim();
      bgPrimaryRef.current = bg || "rgba(3,7,18,0.92)";
    };

    updateAccentRgb();
    const observer = new MutationObserver(updateAccentRgb);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "style", "class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    pausedRef.current = false;
    setIsPaused(false);
    replayFrameIndexRef.current = 0;
    setReplayFrameIndex(0);
    replayLastAdvanceRef.current = 0;
  }, [isReplaying, levelId]);

  const toggleReplayPause = useCallback((): void => {
    const frameCount = replayFramesRef?.current.length ?? 0;
    if (pausedRef.current && frameCount > 0 && replayFrameIndexRef.current >= frameCount - 1) {
      replayFrameIndexRef.current = 0;
      setReplayFrameIndex(0);
    }
    pausedRef.current = !pausedRef.current;
    setIsPaused(pausedRef.current);
    replayLastAdvanceRef.current = 0;
  }, [replayFramesRef]);

  const setReplayIndex = useCallback((nextIndex: number): void => {
    const frameCount = replayFramesRef?.current.length ?? 0;
    const maxIndex = Math.max(0, frameCount - 1);
    const boundedIndex = Math.max(0, Math.min(maxIndex, nextIndex));
    replayFrameIndexRef.current = boundedIndex;
    setReplayFrameIndex(boundedIndex);
    replayLastAdvanceRef.current = 0;
  }, [replayFramesRef]);

  const seekReplayByTicks = useCallback((tickDelta: number): void => {
    const frames = replayFramesRef?.current ?? [];
    if (frames.length === 0) return;

    const currentTick = frames[replayFrameIndexRef.current]?.tick ?? 0;
    const targetTick = Math.max(0, currentTick + tickDelta);
    const targetIndex = frames.findIndex((frame) => (frame.tick ?? 0) >= targetTick);
    setReplayIndex(targetIndex === -1 ? frames.length - 1 : targetIndex);
  }, [replayFramesRef, setReplayIndex]);

  const cycleReplaySpeed = useCallback((): void => {
    const nextSpeedIndex = (replaySpeedIndexRef.current + 1) % REPLAY_SPEEDS.length;
    replaySpeedIndexRef.current = nextSpeedIndex;
    setReplaySpeedIndex(nextSpeedIndex);
  }, []);

  const handleReplaySeek = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    setReplayIndex(Number(event.target.value));
  }, [setReplayIndex]);

  const handleLivePauseToggle = useCallback((): void => {
    if (fightResultRef.current !== null) return;
    if (serverPausedRef.current) {
      onResumeFight?.();
      return;
    }
    onPauseFight?.();
  }, [onPauseFight, onResumeFight]);

  useEffect(() => {
    if (!fightResult) {
      resultAnnouncedRef.current = false;
      return;
    }
    if (resultAnnouncedRef.current) return;

    pausedRef.current = true;
    setIsPaused(true);
    replayFrameIndexRef.current = 0;
    setReplayFrameIndex(0);
    replayLastAdvanceRef.current = 0;
    resultAnnouncedRef.current = true;
    const winner = fightResult.winner as 'player' | 'enemy' | 'draw';
    const timer = window.setTimeout(() => {
      onBattleEndRef.current?.(winner);
    }, BATTLE_END_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [fightResult]);

  const previewMode = !userScript;
  const prevPreviewMode = useRef(previewMode);
  const previewModeRef = useRef(previewMode);
  useEffect(() => {
    previewModeRef.current = previewMode;
  }, [previewMode]);

  useEffect(() => {
    let cancelled = false;
    prevPreviewMode.current = previewMode;

    const s = scene.init();
    if (!s.local) s.local = {};
    stateRef.current = s;
    nextIdRef.current.current = 0;
    fovTimerRef.current = new Map();
    flashTimerRef.current = 0;
    battleEndedRef.current = false;
    battleEvalTickRef.current = 0;

    const initEvals = async (): Promise<void> => {
      // Dynamic import — levelScripts.ts (~42 KB) is only fetched on level
      // pages, never bundled into the campaign listing page chunk.
      const enemyScriptProp = enemyScriptPropRef.current;
      let enemyScr = enemyScriptProp ?? '';
      if (!enemyScr) {
        const { getEnemyScript } = await import('../levelScripts');
        enemyScr = getEnemyScript(levelId) ?? '';
      }

      if (cancelled) return;

      const evals = new Map<string, EvalState | null>();
      const errors = new Set<string>();

      if (!previewMode) {
        const playerState = createEvalState(userScriptRef.current ?? '');
        if (!playerState) errors.add('player');
        evals.set('player', playerState);
      }
      if (enemyScr) {
        const enemyState = createEvalState(enemyScr);
        if (!enemyState) errors.add('enemy');
        evals.set('enemy', enemyState);
      }

      evalRef.current = evals;
      errRef.current = errors;
    };

    void initEvals();

    return () => {
      cancelled = true;
    };
  }, [scene, levelId, previewMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const io = new IntersectionObserver(
      ([e]) => { visibleRef.current = e.isIntersecting; },
      { threshold: 0.1 },
    );
    io.observe(canvas);

    let lastTime = 0;
    let evalTick = 0;

    const render = (now: number) => {
      rafRef.current = requestAnimationFrame(render);
      if (!visibleRef.current) return;
      if (waitingForReplay) return;
      if (now - lastTime < FRAME_MS - FRAME_THROTTLE_TOLERANCE_MS) return;
      lastTime = now;

      const W = canvas.width, H = canvas.height;
      const state = stateRef.current;
      const evals = evalRef.current;
      const nextId = nextIdRef.current;
      const errors = errRef.current;
      const rgb = accentRgbRef.current;

      const replayFrames = replayFramesRef?.current ?? [];
      const reviewMode = isReplaying && fightResultRef.current !== null && replayFrames.length > 0;
      const liveServerPaused = isReplaying && fightResultRef.current === null && serverPausedRef.current;
      let streamingFrame: CampaignFrame | null = null;

      if (reviewMode) {
        if (replayFrameIndexRef.current >= replayFrames.length) {
          replayFrameIndexRef.current = replayFrames.length - 1;
        }

        if (!pausedRef.current) {
          const speed = REPLAY_SPEEDS[replaySpeedIndexRef.current];
          const frameInterval = REPLAY_FRAME_INTERVAL_MS / speed;
          if (replayLastAdvanceRef.current === 0) {
            replayLastAdvanceRef.current = now;
          } else if (now - replayLastAdvanceRef.current >= frameInterval) {
            replayLastAdvanceRef.current = now;
            const nextIndex = replayFrameIndexRef.current + 1;
            if (nextIndex >= replayFrames.length) {
              replayFrameIndexRef.current = replayFrames.length - 1;
              pausedRef.current = true;
              setIsPaused(true);
            } else {
              replayFrameIndexRef.current = nextIndex;
            }
          }
        }

        if (now - replayLastUiUpdateRef.current >= REPLAY_UI_UPDATE_MS) {
          replayLastUiUpdateRef.current = now;
          setReplayFrameIndex(replayFrameIndexRef.current);
        }

        streamingFrame = replayFrames[replayFrameIndexRef.current] ?? null;
      } else {
        streamingFrame = isReplaying ? latestFrameRef?.current ?? null : null;
      }

      const streamingMode = streamingFrame !== null;

      if (previewModeRef.current && !streamingMode) {
        scene.tick(state);
      }
      if (!liveServerPaused) {
        state.tick++;
      }

      if (streamingFrame) {
        syncReplayFrame(state, streamingFrame, battleEndedRef, null, fovTimerRef.current);
      }

      if (!streamingMode) {
        evalTick = runEvalTick(state, evals, errors, nextId, previewModeRef.current, battleEndedRef, battleEvalTickRef, fovTimerRef.current, onBattleEndRef.current ?? null, evalTick);
      }

      if (!liveServerPaused) {
        for (const robot of state.robots) {
          const runtimeRobot = robot as RuntimeArenaRobot;
          if ((runtimeRobot._fireCooldown ?? 0) > 0) {
            runtimeRobot._fireCooldown = (runtimeRobot._fireCooldown ?? 0) - 1;
          }
          if (robot.isAlive && runtimeRobot._lastMoveAngle !== undefined) {
            // Normal speed: 150/800/60 = 0.003125
            // Fast speed: 220/800/60 = 0.004583
            const PER_FRAME_SPD = runtimeRobot._lastMoveFast ? 0.004583 : 0.003125;
            const v = runtimeRobot._lastMoveValue ?? 0;
            if (v === -2) {
              robot.x -= Math.cos(robot.angle) * PER_FRAME_SPD;
              robot.y -= Math.sin(robot.angle) * PER_FRAME_SPD;
            } else {
              robot.x += Math.cos(robot.angle) * PER_FRAME_SPD;
              robot.y += Math.sin(robot.angle) * PER_FRAME_SPD;
            }
            robot.x = Math.max(ROBOT_SIZE, Math.min(1 - ROBOT_SIZE, robot.x));
            robot.y = Math.max(ROBOT_SIZE, Math.min(1 - ROBOT_SIZE, robot.y));
          }
        }

        tickFovTimers(fovTimerRef.current);
        ensureEnemyFov(fovTimerRef.current, state.robots);
        if (flashTimerRef.current > 0) flashTimerRef.current--;
      }

      if (!streamingMode) {
        updateProjectiles(state.projectiles, state.robots, state.obstacles, previewModeRef.current, battleEndedRef, flashTimerRef, onBattleEndRef.current ?? null);
      }

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = bgPrimaryRef.current;
      ctx.fillRect(0, 0, W, H);
      drawGrid(ctx, W, H, rgb);
      drawScanLine(ctx, W, H, state.tick, rgb);

      if (/PATHFIND|gfx|GRAPH|NODE|EDGE|BREADTH|DEPTH|CYCLE|SPANNING|TOPOLOGICAL|DIJKSTRA|ORACLE/.test(scene.label)) {
        drawGraphNet(ctx, W, H, state.tick, rgb, levelId);
      }

      state.obstacles.forEach(obs => drawObstacle(ctx, obs, W, H));
      state.projectiles.forEach(p => drawProjectile(ctx, p, W, H));

      const enemy = state.robots.find(r => r.id === 'enemy');
      const player = state.robots.find(r => r.id === 'player');
      const enemyFov = (fovTimerRef.current.get('enemy') ?? 0) / FOV_SWEEP_FRAMES;
      const playerFov = (fovTimerRef.current.get('player') ?? 0) / FOV_SWEEP_FRAMES;

      if (enemy) {
        if (isBossLevel) {
          drawBossRobot(
            ctx,
            enemy,
            W,
            H,
            state.tick,
            enemyFov,
            dangerColorRef.current,
            warningColorRef.current,
            dangerRgbRef.current,
            warningRgbRef.current,
          );
        } else {
          drawRobot(ctx, enemy, W, H, state.tick, enemyFov);
        }
      }
      if (player) drawRobot(ctx, player, W, H, state.tick, playerFov);

      if (flashTimerRef.current > 0) {
        const fa = (flashTimerRef.current / FLASH_DURATION) * 0.35;
        ctx.save();
        ctx.globalAlpha = fa;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }

      if (errors.has('player') && !previewModeRef.current) {
        ctx.save(); ctx.fillStyle = warningColorRef.current;
        ctx.font = `bold ${Math.max(ERROR_MIN_FONT_SIZE, W * ERROR_FONT_SCALE)}px monospace`;
        ctx.textAlign = 'left'; ctx.globalAlpha = ERROR_ALPHA_BASE + Math.sin(state.tick * ERROR_ALPHA_SPEED) * ERROR_ALPHA_RANGE;
        ctx.fillText('\u26a0 PLAYER SCRIPT ERROR', ERROR_TEXT_X, H - PLAYER_SCRIPT_ERROR_Y_OFFSET); ctx.restore();
      }
      if (errors.has('enemy')) {
        ctx.save(); ctx.fillStyle = dangerColorRef.current;
        ctx.font = `bold ${Math.max(ERROR_MIN_FONT_SIZE, W * ERROR_FONT_SCALE)}px monospace`;
        ctx.textAlign = 'left'; ctx.globalAlpha = ERROR_ALPHA_BASE + Math.sin(state.tick * ERROR_ALPHA_SPEED) * ERROR_ALPHA_RANGE;
        ctx.fillText('\u26a0 ENEMY SCRIPT ERROR', ERROR_TEXT_X, ENEMY_SCRIPT_ERROR_Y); ctx.restore();
      }

      drawLabel(ctx, scene.label, W, H, rgb);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(rafRef.current); io.disconnect(); };
  }, [scene, levelId, isReplaying, isBossLevel]);

  const replayFramesForControls = replayFramesRef?.current ?? [];
  const reviewModeActive = isReplaying && fightResult !== null && replayFramesForControls.length > 0;
  const replayMaxIndex = Math.max(0, replayFramesForControls.length - 1);
  const currentReplayFrame = replayFramesForControls[replayFrameIndex];
  const finalReplayFrame = replayFramesForControls[replayMaxIndex];
  const currentReplayTick = currentReplayFrame?.tick ?? 0;
  const finalReplayTick = finalReplayFrame?.tick ?? 0;
  const replaySpeed = REPLAY_SPEEDS[replaySpeedIndex];
  const livePauseActive = isReplaying && fightResult === null && !waitingForReplay;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl ${className}`}
      style={{ aspectRatio: `${aspectRatio}`, contain: "layout paint" }}
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
        style={{ imageRendering: 'crisp-edges' }}
      />
      {livePauseActive && (
        <button
          type="button"
          onClick={handleLivePauseToggle}
          aria-label={serverPaused ? "Resume campaign match" : "Pause campaign match"}
          title={serverPaused ? "Resume campaign match" : "Pause campaign match"}
          className="group absolute inset-0 z-20 flex items-center justify-center bg-transparent"
        >
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-full border border-accent/25 bg-bg-primary/75 text-accent shadow-[0_0_22px_rgba(var(--accent-rgb),0.18)] backdrop-blur-sm transition-opacity ${serverPaused ? "opacity-100" : "opacity-0 group-hover:opacity-90"}`}
          >
            {serverPaused ? <Play className="h-5 w-5" aria-hidden="true" /> : <Pause className="h-5 w-5" aria-hidden="true" />}
          </span>
        </button>
      )}
      {reviewModeActive && (
        <div className="absolute inset-x-2 bottom-2 z-30 box-border rounded-lg border border-accent/20 bg-bg-primary/85 px-1.5 py-1.5 shadow-[0_0_18px_rgba(var(--accent-rgb),0.16)] backdrop-blur-sm">
          <div className="flex min-w-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => seekReplayByTicks(-REPLAY_SEEK_TICKS)}
              aria-label={`Seek back ${REPLAY_SEEK_SECONDS} seconds`}
              title={`Seek back ${REPLAY_SEEK_SECONDS} seconds`}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-accent/20 bg-accent/5 text-accent/70 transition-colors hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
            >
              <Rewind className="h-3 w-3" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={toggleReplayPause}
              aria-label={isPaused ? "Play replay" : "Pause replay"}
              title={isPaused ? "Play replay" : "Pause replay"}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-accent/30 bg-accent/10 text-accent transition-colors hover:border-accent/50 hover:bg-accent/15"
            >
              {isPaused ? <Play className="h-3 w-3" aria-hidden="true" /> : <Pause className="h-3 w-3" aria-hidden="true" />}
            </button>
            <button
              type="button"
              onClick={() => seekReplayByTicks(REPLAY_SEEK_TICKS)}
              aria-label={`Seek forward ${REPLAY_SEEK_SECONDS} seconds`}
              title={`Seek forward ${REPLAY_SEEK_SECONDS} seconds`}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-accent/20 bg-accent/5 text-accent/70 transition-colors hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
            >
              <FastForward className="h-3 w-3" aria-hidden="true" />
            </button>
            <span className="min-w-[54px] shrink-0 text-[7px] font-black tracking-[0.08em] text-accent/60">
              {formatReplayTime(currentReplayTick)} / {formatReplayTime(finalReplayTick)}
            </span>
            <input
              aria-label="Replay position"
              type="range"
              min={0}
              max={replayMaxIndex}
              value={Math.min(replayFrameIndex, replayMaxIndex)}
              onChange={handleReplaySeek}
              className="h-1 min-w-0 flex-1 basis-0"
              style={{ accentColor: "var(--accent)" }}
            />
            <button
              type="button"
              onClick={cycleReplaySpeed}
              className="h-6 w-[38px] shrink-0 rounded-md border border-accent/20 bg-accent/5 px-1 text-[8px] font-black tracking-[0.08em] text-accent/70 transition-colors hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
            >
              {replaySpeed}x
            </button>
          </div>
        </div>
      )}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 pointer-events-none">
        <span
          className="w-1.5 h-1.5 rounded-full bg-accent"
          style={{ animation: 'pulse 1.5s ease-in-out infinite', boxShadow: '0 0 6px var(--accent)' }}
        />
        <span className="text-[10px] md:text-[8px] font-mono font-bold tracking-[0.2em] text-accent/60 uppercase">{reviewModeActive ? "REPLAY" : "LIVE"}</span>
      </div>
    </div>
  );
});
