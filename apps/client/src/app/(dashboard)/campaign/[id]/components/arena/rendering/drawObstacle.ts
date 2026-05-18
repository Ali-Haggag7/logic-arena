import type { ArenaObstacle } from '../scenes';

export function drawObstacle(ctx: CanvasRenderingContext2D, obs: ArenaObstacle, W: number, H: number): void {
  const px = obs.x * W, py = obs.y * H, pw = obs.w * W, ph = obs.h * H;
  ctx.save();
  ctx.translate(px, py);
  const cm: Record<string, { fill: string; stroke: string }> = {
    SOLID: { fill: 'rgba(100,120,140,0.25)', stroke: 'rgba(100,140,180,0.4)' },
    TRAP: { fill: 'rgba(245,158,11,0.12)', stroke: 'rgba(245,158,11,0.35)' },
    LAVA: { fill: 'rgba(239,68,68,0.15)', stroke: 'rgba(239,68,68,0.45)' },
  };
  const c = cm[obs.type];
  ctx.fillStyle = c.fill;
  ctx.strokeStyle = c.stroke;
  ctx.lineWidth = 1;
  ctx.fillRect(-pw / 2, -ph / 2, pw, ph);
  ctx.strokeRect(-pw / 2, -ph / 2, pw, ph);
  ctx.restore();
}
