import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { drawWheel, pickWinner, easeOut } from '@/utils/wheel';

const WHEEL_SIZE = 400;

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [choices, setChoices] = useState<string[]>(['Option A', 'Option B', 'Option C']);
  const [newChoice, setNewChoice] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const animRef = useRef<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    drawWheel(ctx, choices, rotation, WHEEL_SIZE);
  }, [choices, rotation]);

  const handleAddChoice = useCallback(() => {
    const trimmed = newChoice.trim();
    if (!trimmed) return;
    setChoices((prev) => [...prev, trimmed]);
    setNewChoice('');
  }, [newChoice]);

  const handleRemoveChoice = useCallback((index: number) => {
    setChoices((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSpin = useCallback(() => {
    if (choices.length < 2 || spinning) return;
    setSpinning(true);
    setWinner(null);

    const totalRotation = Math.PI * 2 * (5 + Math.random() * 5);
    const duration = 4000;
    const startTime = performance.now();
    const startRotation = rotation;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOut(progress);
      const currentRotation = startRotation + totalRotation * easedProgress;
      setRotation(currentRotation);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        const result = pickWinner(choices, currentRotation);
        setWinner(result);
        toast({ title: `Result: ${result}` });
      }
    };

    animRef.current = requestAnimationFrame(animate);
  }, [choices, spinning, rotation, toast]);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Decision Wheel</h1>
          <p className="text-muted-foreground">
            Add choices, spin the wheel, get a random result
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          <Card className="flex-shrink-0 w-full lg:w-64">
            <CardHeader>
              <CardTitle>Choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newChoice}
                  onChange={(e) => setNewChoice(e.target.value)}
                  placeholder="Add a choice..."
                  onKeyDown={(e) => e.key === 'Enter' && handleAddChoice()}
                />
                <Button type="button" size="sm" onClick={handleAddChoice}>
                  Add
                </Button>
              </div>

              <div className="space-y-1 max-h-60 overflow-y-auto">
                {choices.map((choice, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 text-sm p-1 rounded hover:bg-muted">
                    <span className="truncate">{choice}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveChoice(i)}
                      className="h-6 w-6 p-0 flex-shrink-0"
                    >
                      x
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                onClick={handleSpin}
                disabled={spinning || choices.length < 2}
                className="w-full"
              >
                {spinning ? 'Spinning...' : 'Spin!'}
              </Button>

              {winner && (
                <div className="p-3 bg-primary/10 rounded-md text-center">
                  <Label>Winner</Label>
                  <p className="text-lg font-bold mt-1">{winner}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardContent className="p-4 flex justify-center items-center">
              <canvas
                ref={canvasRef}
                width={WHEEL_SIZE}
                height={WHEEL_SIZE}
                className="max-w-full"
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
