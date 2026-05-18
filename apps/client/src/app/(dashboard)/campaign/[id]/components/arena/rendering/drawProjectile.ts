import type { ArenaProjectile } from '../scenes';

export function drawProjectile(ctx: CanvasRenderingContext2D, p: ArenaProjectile, W: number, H: number): void {
  const px = p.x * W, py = p.y * H;
  ctx.save();
  const g = ctx.createRadialGradient(px, py, 0, px, py, 6);
  g.addColorStop(0, p.color);
  g.addColorStop(0.5, `${p.color}80`);
  g.addColorStop(1, 'transparent');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
