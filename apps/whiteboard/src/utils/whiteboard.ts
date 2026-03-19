export type ShapeTool = 'pen' | 'eraser' | 'line' | 'rect' | 'circle';

export interface Point {
  x: number;
  y: number;
}

export interface DrawAction {
  tool: ShapeTool;
  color: string;
  width: number;
  points: Point[];
}

export function drawAction(
  ctx: CanvasRenderingContext2D,
  action: DrawAction
): void {
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = action.width;

  if (action.tool === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = 'rgba(0,0,0,1)';
  } else {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = action.color;
  }

  if (action.tool === 'pen' || action.tool === 'eraser') {
    ctx.beginPath();
    if (action.points.length > 0) {
      ctx.moveTo(action.points[0].x, action.points[0].y);
      for (let i = 1; i < action.points.length; i++) {
        ctx.lineTo(action.points[i].x, action.points[i].y);
      }
    }
    ctx.stroke();
  } else if (action.tool === 'line' && action.points.length >= 2) {
    const start = action.points[0];
    const end = action.points[action.points.length - 1];
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  } else if (action.tool === 'rect' && action.points.length >= 2) {
    const start = action.points[0];
    const end = action.points[action.points.length - 1];
    ctx.beginPath();
    ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
  } else if (action.tool === 'circle' && action.points.length >= 2) {
    const start = action.points[0];
    const end = action.points[action.points.length - 1];
    const radius = Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    );
    ctx.beginPath();
    ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }

  ctx.globalCompositeOperation = 'source-over';
}

export function redrawAll(
  ctx: CanvasRenderingContext2D,
  actions: DrawAction[],
  width: number,
  height: number
): void {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  for (const action of actions) {
    drawAction(ctx, action);
  }
}

export function getDistance(a: Point, b: Point): number {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}
