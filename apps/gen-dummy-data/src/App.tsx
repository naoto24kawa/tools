import { Copy, RefreshCw } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { type DummyRecord, generateDummyData, toCSV, toJSON } from '@/utils/dummyData';

export default function App() {
  const [count, setCount] = useState(10);
  const [format, setFormat] = useState<'json' | 'csv'>('json');
  const [data, setData] = useState<DummyRecord[]>([]);
  const { toast } = useToast();

  const generate = useCallback(() => setData(generateDummyData(count)), [count]);

  const output = format === 'json' ? toJSON(data) : toCSV(data);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      toast({ title: 'Copied to clipboard' });
    } catch {
      toast({ title: 'コピーに失敗しました', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dummy Data Generator</h1>
          <p className="text-muted-foreground">テスト用のダミーデータを生成します。</p>
        </header>
        <div className="flex items-end gap-4">
          <div className="space-y-1">
            <Label>件数</Label>
            <input
              type="number"
              min={1}
              max={1000}
              value={count}
              onChange={(e) => setCount(Math.max(1, Number(e.target.value)))}
              className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-1">
            {(['json', 'csv'] as const).map((f) => (
              <button
                type="button"
                key={f}
                onClick={() => setFormat(f)}
                className={`px-3 py-2 rounded-md text-sm ${format === f ? 'bg-primary text-primary-foreground' : 'hover:bg-muted border'}`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
          <Button onClick={generate}>
            <RefreshCw className="mr-2 h-4 w-4" /> Generate
          </Button>
          {data.length > 0 && (
            <Button variant="outline" onClick={copyToClipboard}>
              <Copy className="mr-2 h-4 w-4" /> Copy
            </Button>
          )}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Output ({data.length} records)</CardTitle>
            <CardDescription>生成されたダミーデータです。</CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              readOnly
              className="flex min-h-[400px] w-full rounded-md border border-input bg-muted px-3 py-2 text-xs font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              value={output}
            />
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}
