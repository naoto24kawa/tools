export type Tool = 'pen' | 'eraser' | 'line' | 'rectangle' | 'circle';

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  tool: Tool;
  points: Point[];
  color: string;
  width: number;
}

export interface WhiteboardState {
  strokes: Stroke[];
  undoneStrokes: Stroke[];
}

export function createInitialState(): WhiteboardState {
  return {
    strokes: [],
    undoneStrokes: [],
  };
}

export function addStroke(state: WhiteboardState, stroke: Stroke): WhiteboardState {
  return {
    strokes: [...state.strokes, stroke],
    undoneStrokes: [],
  };
}

export function undo(state: WhiteboardState): WhiteboardState {
  if (state.strokes.length === 0) return state;
  const lastStroke = state.strokes[state.strokes.length - 1];
  return {
    strokes: state.strokes.slice(0, -1),
    undoneStrokes: [...state.undoneStrokes, lastStroke],
  };
}

export function redo(state: WhiteboardState): WhiteboardState {
  if (state.undoneStrokes.length === 0) return state;
  const lastUndone = state.undoneStrokes[state.undoneStrokes.length - 1];
  return {
    strokes: [...state.strokes, lastUndone],
    undoneStrokes: state.undoneStrokes.slice(0, -1),
  };
}

export function clearAll(): WhiteboardState {
  return createInitialState();
}

export function drawStroke(
  ctx: CanvasRenderingContext2D,
  stroke: Stroke
): void {
  ctx.strokeStyle = stroke.tool === 'eraser' ? '#ffffff' : stroke.color;
  ctx.lineWidth = stroke.width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (stroke.tool === 'pen' || stroke.tool === 'eraser') {
    if (stroke.points.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    for (let i = 1; i < stroke.points.length; i++) {
      ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
    }
    ctx.stroke();
  } else if (stroke.tool === 'line') {
    if (stroke.points.length < 2) return;
    const start = stroke.points[0];
    const end = stroke.points[stroke.points.length - 1];
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  } else if (stroke.tool === 'rectangle') {
    if (stroke.points.length < 2) return;
    const start = stroke.points[0];
    const end = stroke.points[stroke.points.length - 1];
    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);
    const w = Math.abs(end.x - start.x);
    const h = Math.abs(end.y - start.y);
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.stroke();
  } else if (stroke.tool === 'circle') {
    if (stroke.points.length < 2) return;
    const start = stroke.points[0];
    const end = stroke.points[stroke.points.length - 1];
    const cx = (start.x + end.x) / 2;
    const cy = (start.y + end.y) / 2;
    const rx = Math.abs(end.x - start.x) / 2;
    const ry = Math.abs(end.y - start.y) / 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
}

export function redrawCanvas(
  ctx: CanvasRenderingContext2D,
  state: WhiteboardState,
  width: number,
  height: number
): void {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  for (const stroke of state.strokes) {
    drawStroke(ctx, stroke);
  }
}

export function getCanvasPoint(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number
): Point {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
}

export function saveAsPng(canvas: HTMLCanvasElement, filename: string = 'whiteboard.png'): void {
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}
