import { Copy } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { adjustBrightness, adjustHue, adjustSaturation, getHSL } from '@/utils/colorBrightness';

export default function App() {
  const [color, setColor] = useState('#3b82f6');
  const [brightness, setBrightness] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [hue, setHue] = useState(0);
  const { toast } = useToast();

  const adjusted = useMemo(() => {
    let result = color;
    result = adjustBrightness(result, brightness);
    result = adjustSaturation(result, saturation);
    result = adjustHue(result, hue);
    return result;
  }, [color, brightness, saturation, hue]);

  const hsl = useMemo(() => getHSL(adjusted), [adjusted]);

  const copyColor = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      toast({ title: `${hex} copied` });
    } catch {
      toast({ title: 'コピーに失敗しました', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Color Brightness & Saturation</h1>
          <p className="text-muted-foreground">色の明暗・彩度・色相を調整します。</p>
        </header>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="h-32 rounded-lg border" style={{ backgroundColor: color }} />
            <div className="text-xs text-muted-foreground mt-1">Original</div>
          </div>
          <div className="text-center">
            <div className="h-32 rounded-lg border" style={{ backgroundColor: adjusted }} />
            <div className="flex items-center justify-center gap-1 mt-1">
              <code className="text-sm font-mono">{adjusted}</code>
              <Button size="icon" variant="ghost" onClick={() => copyColor(adjusted)}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Label>Base Color</Label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-10 rounded cursor-pointer border-0"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-28 h-10 rounded-md border border-input bg-background px-3 text-sm font-mono"
              />
            </div>
            {(
              [
                ['brightness', 'Brightness', brightness, setBrightness, -50, 50],
                ['saturation', 'Saturation', saturation, setSaturation, -50, 50],
                ['hue', 'Hue', hue, setHue, -180, 180],
              ] as const
            ).map(([key, label, val, setter, min, max]) => (
              <div key={key} className="space-y-1">
                <Label className="text-xs">
                  {label}: {val > 0 ? `+${val}` : val}
                </Label>
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={val}
                  onChange={(e) => setter(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            ))}
            <div className="text-xs text-muted-foreground">
              HSL: {hsl.h}deg, {hsl.s}%, {hsl.l}%
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setBrightness(0);
                setSaturation(0);
                setHue(0);
              }}
            >
              Reset
            </Button>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}
