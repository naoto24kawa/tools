import { Copy, Hash } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { crc32 } from '@/utils/crc32';

export default function App() {
  const [input, setInput] = useState('');
  const { toast } = useToast();
  const hash = useMemo(() => (input ? crc32(input) : ''), [input]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(hash);
      toast({ title: 'Copied to clipboard' });
    } catch {
      toast({ title: 'コピーに失敗しました', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">CRC32 Checksum</h1>
          <p className="text-muted-foreground">テキストのCRC32チェックサムを計算します。</p>
        </header>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" /> Calculator
            </CardTitle>
            <CardDescription>
              テキストを入力するとリアルタイムでCRC32が計算されます。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="input">Input</Label>
              <textarea
                id="input"
                className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                placeholder="テキストを入力..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            {hash && (
              <div className="space-y-2">
                <Label>CRC32</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-muted rounded px-3 py-2 text-sm font-mono">
                    {hash}
                  </code>
                  <Button size="icon" variant="outline" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}
