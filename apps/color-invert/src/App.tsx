import { Copy } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { invertColor } from '@/utils/colorInvert';

export default function App() {
  const [color, setColor] = useState('#3b82f6');
  const { toast } = useToast();
  const inverted = useMemo(() => invertColor(color), [color]);

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
          <h1 className="text-3xl font-bold tracking-tight">Color Invert</h1>
          <p className="text-muted-foreground">色を反転(補色)します。</p>
        </header>
        <Card>
          <CardHeader>
            <CardTitle>Inverter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="space-y-1">
                <Label>入力カラー</Label>
                <div className="flex gap-2">
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
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="h-32 rounded-lg border" style={{ backgroundColor: color }} />
                <div className="flex items-center justify-center gap-1 mt-2">
                  <code className="text-sm font-mono">{color}</code>
                  <Button size="icon" variant="ghost" onClick={() => copyColor(color)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">Original</div>
              </div>
              <div className="text-center">
                <div className="h-32 rounded-lg border" style={{ backgroundColor: inverted }} />
                <div className="flex items-center justify-center gap-1 mt-2">
                  <code className="text-sm font-mono">{inverted}</code>
                  <Button size="icon" variant="ghost" onClick={() => copyColor(inverted)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">Inverted</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}
