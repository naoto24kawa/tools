import { Copy, RefreshCw } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { generateBulk, UUID_FORMAT_OPTIONS, type UUIDFormat } from '@/utils/uuidGenerator';

export default function App() {
  const [format, setFormat] = useState<UUIDFormat>('v4');
  const [count, setCount] = useState(5);
  const [results, setResults] = useState<string[]>([]);
  const { toast } = useToast();

  const generate = useCallback(() => {
    setResults(generateBulk(format, count));
  }, [format, count]);

  const copyOne = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({ title: 'Copied to clipboard' });
    } catch {
      toast({ title: 'コピーに失敗しました', variant: 'destructive' });
    }
  };

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(results.join('\n'));
      toast({ title: 'All copied to clipboard' });
    } catch {
      toast({ title: 'コピーに失敗しました', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">UUID / ULID Generator</h1>
          <p className="text-muted-foreground">UUID v4 および ULID を生成します。</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Generator</CardTitle>
            <CardDescription>形式と生成数を選択してGenerateを押してください。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-2">
                <Label>形式</Label>
                <div className="flex gap-2">
                  {UUID_FORMAT_OPTIONS.map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setFormat(opt.value)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        format === opt.value
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted border'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="count">生成数</Label>
                <input
                  id="count"
                  type="number"
                  min={1}
                  max={100}
                  value={count}
                  onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value))))}
                  className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <Button onClick={generate}>
                <RefreshCw className="mr-2 h-4 w-4" /> Generate
              </Button>
              {results.length > 0 && (
                <Button variant="outline" onClick={copyAll}>
                  <Copy className="mr-2 h-4 w-4" /> Copy All
                </Button>
              )}
            </div>

            {results.length > 0 && (
              <div className="space-y-2 pt-4 border-t">
                {results.map((id, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: list is regenerated entirely
                  <div key={i} className="flex items-center gap-2">
                    <code className="flex-1 text-sm font-mono bg-muted rounded px-2 py-1 break-all">
                      {id}
                    </code>
                    <Button size="icon" variant="ghost" onClick={() => copyOne(id)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}
