import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { type ShapeTool, type DrawAction, type Point, redrawAll, drawAction } from '@/utils/whiteboard';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<ShapeTool>('pen');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [actions, setActions] = useState<DrawAction[]>([]);
  const [currentAction, setCurrentAction] = useState<DrawAction | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    redrawAll(ctx, actions, CANVAS_WIDTH, CANVAS_HEIGHT);
    if (currentAction) {
      drawAction(ctx, currentAction);
    }
  }, [actions, currentAction]);

  const getPoint = useCallback((e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getPoint(e);
    setIsDrawing(true);
    setCurrentAction({
      tool,
      color,
      width: lineWidth,
      points: [point],
    });
  }, [tool, color, lineWidth, getPoint]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentAction) return;
    const point = getPoint(e);
    setCurrentAction((prev) => {
      if (!prev) return prev;
      return { ...prev, points: [...prev.points, point] };
    });
  }, [isDrawing, currentAction, getPoint]);

  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !currentAction) return;
    setIsDrawing(false);
    setActions((prev) => [...prev, currentAction]);
    setCurrentAction(null);
  }, [isDrawing, currentAction]);

  const handleUndo = useCallback(() => {
    setActions((prev) => prev.slice(0, -1));
  }, []);

  const handleClear = useCallback(() => {
    setActions([]);
    toast({ title: 'Canvas cleared' });
  }, [toast]);

  const handleSavePng = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast({ title: 'PNG saved' });
  }, [toast]);

  const tools: { key: ShapeTool; label: string }[] = [
    { key: 'pen', label: 'Pen' },
    { key: 'eraser', label: 'Eraser' },
    { key: 'line', label: 'Line' },
    { key: 'rect', label: 'Rect' },
    { key: 'circle', label: 'Circle' },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Whiteboard</h1>
          <p className="text-muted-foreground">
            Freehand drawing, shapes, undo, PNG export
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          <Card className="flex-shrink-0 w-full lg:w-48">
            <CardHeader>
              <CardTitle>Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-1">
                {tools.map((t) => (
                  <Button
                    key={t.key}
                    type="button"
                    variant={tool === t.key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTool(t.key)}
                  >
                    {t.label}
                  </Button>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-8 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <Label>Width: {lineWidth}</Label>
                <Input
                  type="range"
                  min={1}
                  max={20}
                  value={lineWidth}
                  onChange={(e) => setLineWidth(Number(e.target.value))}
                />
              </div>

              <Button type="button" variant="outline" onClick={handleUndo} className="w-full" disabled={actions.length === 0}>
                Undo
              </Button>
              <Button type="button" variant="outline" onClick={handleClear} className="w-full">
                Clear
              </Button>
              <Button type="button" onClick={handleSavePng} className="w-full">
                Save PNG
              </Button>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardContent className="p-4">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="border border-border rounded cursor-crosshair bg-white w-full"
                style={{ maxWidth: CANVAS_WIDTH }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
