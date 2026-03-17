import { Copy, RefreshCw } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import {
  DEFAULT_OPTIONS,
  estimateStrength,
  generatePasswords,
  type PasswordOptions,
} from '@/utils/passwordGenerator';

export default function App() {
  const [options, setOptions] = useState<PasswordOptions>(DEFAULT_OPTIONS);
  const [passwords, setPasswords] = useState<string[]>([]);
  const { toast } = useToast();

  const generate = useCallback(() => {
    const result = generatePasswords(options);
    setPasswords(result);
  }, [options]);

  const copyPassword = async (pw: string) => {
    try {
      await navigator.clipboard.writeText(pw);
      toast({ title: 'Copied to clipboard' });
    } catch {
      toast({ title: 'コピーに失敗しました', variant: 'destructive' });
    }
  };

  const strengthColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-emerald-500',
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Password Generator</h1>
          <p className="text-muted-foreground">安全なパスワードを生成します。</p>
        </header>

        <div className="grid gap-4 md:grid-cols-[280px,1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="length">文字数: {options.length}</Label>
                <input
                  id="length"
                  type="range"
                  min={4}
                  max={128}
                  value={options.length}
                  onChange={(e) => setOptions((p) => ({ ...p, length: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="count">生成数</Label>
                <input
                  id="count"
                  type="number"
                  min={1}
                  max={50}
                  value={options.count}
                  onChange={(e) =>
                    setOptions((p) => ({
                      ...p,
                      count: Math.max(1, Math.min(50, Number(e.target.value))),
                    }))
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              {(
                [
                  ['uppercase', '大文字 (A-Z)'],
                  ['lowercase', '小文字 (a-z)'],
                  ['numbers', '数字 (0-9)'],
                  ['symbols', '記号 (!@#$...)'],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="flex items-center gap-2">
                  <input
                    id={key}
                    type="checkbox"
                    checked={options[key]}
                    onChange={(e) => setOptions((p) => ({ ...p, [key]: e.target.checked }))}
                    className="h-4 w-4 rounded border-input"
                  />
                  <Label htmlFor={key}>{label}</Label>
                </div>
              ))}
              <div className="space-y-2">
                <Label htmlFor="exclude">除外文字</Label>
                <input
                  id="exclude"
                  type="text"
                  value={options.excludeChars}
                  onChange={(e) => setOptions((p) => ({ ...p, excludeChars: e.target.value }))}
                  placeholder="例: lI1O0"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <Button onClick={generate} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" /> 生成
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Passwords</CardTitle>
              <CardDescription>生成ボタンを押してパスワードを生成してください。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {passwords.length > 0 ? (
                passwords.map((pw, i) => {
                  const strength = estimateStrength(pw);
                  return (
                    // biome-ignore lint/suspicious/noArrayIndexKey: passwords list is regenerated entirely
                    <div key={i} className="flex items-center gap-2 p-2 rounded-md border">
                      <code className="flex-1 text-sm font-mono break-all">{pw}</code>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${strengthColors[strength.score]}`} />
                        <span className="text-xs text-muted-foreground w-20">{strength.label}</span>
                      </div>
                      <Button size="icon" variant="ghost" onClick={() => copyPassword(pw)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  );
                })
              ) : (
                <div className="text-muted-foreground text-sm py-8 text-center">
                  生成ボタンを押してパスワードを生成してください
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
