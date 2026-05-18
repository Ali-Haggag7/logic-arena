export function drawGrid(ctx: CanvasRenderingContext2D, W: number, H: number, rgb: string): void {
  ctx.save();
  ctx.strokeStyle = `rgba(${rgb},0.04)`;
  ctx.lineWidth = 0.5;
  const step = Math.min(W, H) / 10;
  for (let x = 0; x <= W; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.restore();
}

export function drawScanLine(ctx: CanvasRenderingContext2D, W: number, H: number, tick: number, rgb: string): void {
  const y = (tick * 1.4) % H;
  ctx.save();
  const g = ctx.createLinearGradient(0, y - 4, 0, y + 4);
  g.addColorStop(0, 'transparent');
  g.addColorStop(0.5, `rgba(${rgb},0.03)`);
  g.addColorStop(1, 'transparent');
  ctx.fillStyle = g;
  ctx.fillRect(0, y - 4, W, 8);
  ctx.restore();
}

export function drawLabel(ctx: CanvasRenderingContext2D, label: string, W: number, H: number, rgb: string): void {
  ctx.save();
  ctx.font = `500 ${Math.max(9, W * 0.018)}px monospace`;
  ctx.fillStyle = `rgba(${rgb},0.35)`;
  ctx.textAlign = 'right';
  ctx.fillText(label.toUpperCase(), W - 8, H - 7);
  ctx.restore();
}

export function drawGraphNet(ctx: CanvasRenderingContext2D, W: number, H: number, tick: number, rgb: string, levelId: string): void {
  const allNodes = [{ x: 0.5, y: 0.5 }, { x: 0.65, y: 0.3 }, { x: 0.8, y: 0.55 }, { x: 0.7, y: 0.75 }, { x: 0.55, y: 0.8 }, { x: 0.75, y: 0.2 }];
  let activeNodes = [0, 1, 2, 3, 4, 5];
  let activeEdges = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 4], [0, 3], [1, 5], [5, 2]];

  switch (levelId) {
    case 'gfx-01': activeNodes = [0, 1, 2]; activeEdges = [[0, 1], [1, 2]]; break;
    case 'gfx-02': activeNodes = [0, 1, 2, 3]; activeEdges = [[0, 1], [1, 2], [2, 3]]; break;
    case 'gfx-03': activeNodes = [0, 1, 2, 3, 4, 5]; activeEdges = [[0, 1], [1, 5], [5, 2], [2, 3], [3, 4], [4, 0]]; break;
    case 'gfx-04': activeNodes = [0, 1, 2, 5]; activeEdges = [[0, 1], [1, 2], [2, 5]]; break;
    case 'gfx-05': activeNodes = [0, 1, 2, 3, 4]; activeEdges = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]]; break;
    case 'gfx-06':
    case 'gfx-07':
    case 'gfx-08':
    case 'gfx-09':
    case 'gfx-10':
      activeNodes = [0, 1, 2, 3, 4, 5]; activeEdges = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 3], [1, 5], [5, 2]]; break;
  }

  ctx.save();
  ctx.strokeStyle = `rgba(${rgb},0.15)`; ctx.lineWidth = 1.2;
  activeEdges.forEach(([u, v]) => {
    ctx.beginPath(); ctx.moveTo(allNodes[u].x * W, allNodes[u].y * H); ctx.lineTo(allNodes[v].x * W, allNodes[v].y * H); ctx.stroke();
  });
  activeNodes.forEach((idx, i) => {
    const n = allNodes[idx];
    const p = 0.5 + Math.sin(tick * 0.04 + i * 1.2) * 0.3;
    ctx.strokeStyle = `rgba(${rgb},${p * 0.6})`; ctx.beginPath(); ctx.arc(n.x * W, n.y * H, 4.5, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = `rgba(${rgb},${0.6 + Math.sin(tick * 0.04) * 0.4})`; ctx.fill();
  });
  ctx.restore();
}
