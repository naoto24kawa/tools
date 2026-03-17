import { Copy } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { kanjiToNumber, numberToKanji } from '@/utils/kanjiNumber';

export default function App() {
  const [number, setNumber] = useState('');
  const [kanjiInput, setKanjiInput] = useState('');
  const [useDaiji, setUseDaiji] = useState(false);
  const { toast } = useToast();

  const kanji = useMemo(() => {
    const n = Number(number);
    if (Number.isNaN(n) || number === '') return '';
    return numberToKanji(n, useDaiji);
  }, [number, useDaiji]);

  const parsed = useMemo(() => {
    if (!kanjiInput) return null;
    return kanjiToNumber(kanjiInput);
  }, [kanjiInput]);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copied to clipboard' });
    } catch {
      toast({ title: 'コピーに失敗しました', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">漢数字変換</h1>
          <p className="text-muted-foreground">数値と漢数字の相互変換を行います。</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>数値 → 漢数字</CardTitle>
            <CardDescription>数値を入力すると漢数字に変換されます。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                id="daiji"
                type="checkbox"
                checked={useDaiji}
                onChange={(e) => setUseDaiji(e.target.checked)}
                className="h-4 w-4 rounded border-input"
              />
              <Label htmlFor="daiji">大字(壱弐参)を使用</Label>
            </div>
            <input
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="12345"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
            />
            {kanji && (
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold flex-1">{kanji}</div>
                <Button size="icon" variant="ghost" onClick={() => copy(kanji)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>漢数字 → 数値</CardTitle>
            <CardDescription>漢数字を入力すると数値に変換されます。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="text"
              value={kanjiInput}
              onChange={(e) => setKanjiInput(e.target.value)}
              placeholder="一万二千三百四十五"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {parsed !== null && (
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold font-mono flex-1">{parsed.toLocaleString()}</div>
                <Button size="icon" variant="ghost" onClick={() => copy(String(parsed))}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}
