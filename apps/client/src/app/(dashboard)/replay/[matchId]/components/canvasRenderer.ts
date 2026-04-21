import { Snapshot } from "../types";

export const CANVAS_W = 420;
export const CANVAS_H = 315; // 420 * (600/800)
const ARENA_W = 800;
const ARENA_H = 600;
const MAX_HEALTH = 100;
const HEALTH_LERP = 0.08;

function scaleX(x: number) {
  return (x / ARENA_W) * CANVAS_W;
}
function scaleY(y: number) {
  return (y / ARENA_H) * CANVAS_H;
}

const ROBOT_COLORS = [
  "#00ffff",
  "#ff00ff",
  "var(--color-orange-500)",
  "var(--color-emerald-500)",
  "#f43f5e",
  "#eab308",
  "#38bdf8",
  "#c084fc",
];

function getColorForId(idx: number): string {
  return ROBOT_COLORS[idx % ROBOT_COLORS.length];
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpAngle(a: number, b: number, t: number): number {
  let diff = b - a;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return a + diff * t;
}

export function drawFrame(
  ctx: CanvasRenderingContext2D,
  prevSnap: Snapshot | undefined,
  currSnap: Snapshot | undefined,
  t: number,
  smoothedHealth: Map<string, number>
) {
  const W = CANVAS_W;
  const H = CANVAS_H;

  ctx.fillStyle = "#030712";
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "rgba(8,145,178,0.12)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 10; i++) {
    ctx.beginPath();
    ctx.moveTo((i / 10) * W, 0);
    ctx.lineTo((i / 10) * W, H);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, (i / 10) * H);
    ctx.lineTo(W, (i / 10) * H);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(var(--accent-rgb),0.18)";
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, W - 4, H - 4);

  const snap = currSnap ?? prevSnap;
  if (!snap) {
    ctx.fillStyle = "rgba(var(--accent-rgb),0.15)";
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 16, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  snap.projectiles?.forEach((curr) => {
    if (!curr.position) return;

    let rx: number;
    let ry: number;

    if (curr.velocity) {
      rx = scaleX(curr.position.x + curr.velocity.x * t);
      ry = scaleY(curr.position.y + curr.velocity.y * t);
    } else {
      const prev = prevSnap?.projectiles?.find(
        (p) => p.id && curr.id ? p.id === curr.id : p.ownerId === curr.ownerId
      );
      if (prev?.position) {
        rx = lerp(scaleX(prev.position.x), scaleX(curr.position.x), t);
        ry = lerp(scaleY(prev.position.y), scaleY(curr.position.y), t);
      } else {
        rx = scaleX(curr.position.x);
        ry = scaleY(curr.position.y);
      }
    }

    ctx.beginPath();
    ctx.arc(rx, ry, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#22d3ee";
    ctx.shadowColor = "#22d3ee";
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  snap.robots?.forEach((curr, idx) => {
    if (!curr.position) return;

    const prev = prevSnap?.robots?.find((r) => r.id === curr.id);

    const rx = prev
      ? lerp(scaleX(prev.position.x), scaleX(curr.position.x), t)
      : scaleX(curr.position.x);
    const ry = prev
      ? lerp(scaleY(prev.position.y), scaleY(curr.position.y), t)
      : scaleY(curr.position.y);
    const rotation =
      prev?.rotation !== undefined && curr.rotation !== undefined
        ? lerpAngle(prev.rotation, curr.rotation, t)
        : curr.rotation;

    const color = curr.color || getColorForId(idx);
    const radius = 12;

    const targetHealth = Math.max(0, curr.health);
    const prevSmoothed = smoothedHealth.get(curr.id) ?? targetHealth;
    const newSmoothed = lerp(prevSmoothed, targetHealth, HEALTH_LERP);
    smoothedHealth.set(curr.id, newSmoothed);

    if (newSmoothed > 0) {
      const fraction = Math.max(0, Math.min(1, newSmoothed / MAX_HEALTH));
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + fraction * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(rx, ry, radius + 4, startAngle, endAngle);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    ctx.beginPath();
    ctx.arc(rx, ry, radius, 0, Math.PI * 2);
    ctx.fillStyle = `${color}30`;
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    if (rotation !== undefined) {
      const dotX = rx + Math.cos(rotation) * (radius - 3);
      const dotY = ry + Math.sin(rotation) * (radius - 3);
      ctx.beginPath();
      ctx.arc(dotX, dotY, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }

    const shortId = curr.id.startsWith("bot") ? "BOT" : curr.id.slice(0, 5);
    ctx.fillStyle = color;
    ctx.font = "bold 7px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(shortId, rx, ry);
    ctx.textBaseline = "alphabetic";
  });
}
