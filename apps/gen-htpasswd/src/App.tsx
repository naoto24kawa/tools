import { Copy, RefreshCw } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { generateHtpasswd, validateUsername } from '@/utils/htpasswd';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [algorithm, setAlgorithm] = useState<'sha1' | 'plain'>('sha1');
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const usernameError = validateUsername(username);

  const generate = useCallback(async () => {
    if (usernameError) return;
    const result = await generateHtpasswd(username, password, algorithm);
    setOutput(result);
  }, [username, password, algorithm, usernameError]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      toast({ title: 'Copied to clipboard' });
    } catch {
      toast({ title: 'コピーに失敗しました', variant: 'destructive' });
    }
  };

  const cls =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">.htpasswd Generator</h1>
          <p className="text-muted-foreground">
            Apache .htpasswd形式のパスワードハッシュを生成します。
          </p>
        </header>
        <Card>
          <CardHeader>
            <CardTitle>Generator</CardTitle>
            <CardDescription>ユーザー名とパスワードを入力してください。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">ユーザー名</Label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className={cls}
                />
                {username && usernameError && (
                  <div className="text-xs text-red-500">{usernameError}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">パスワード</Label>
                <input
                  id="password"
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  className={cls}
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                {(['sha1', 'plain'] as const).map((alg) => (
                  <button
                    type="button"
                    key={alg}
                    onClick={() => setAlgorithm(alg)}
                    className={`px-3 py-2 rounded-md text-sm transition-colors ${algorithm === alg ? 'bg-primary text-primary-foreground' : 'hover:bg-muted border'}`}
                  >
                    {alg === 'sha1' ? 'SHA-1' : 'Plain'}
                  </button>
                ))}
              </div>
              <Button onClick={generate} disabled={!username || !password || !!usernameError}>
                <RefreshCw className="mr-2 h-4 w-4" /> Generate
              </Button>
            </div>
            {output && (
              <div className="space-y-2 pt-4 border-t">
                <Label>Output</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-muted rounded px-3 py-2 text-sm font-mono break-all">
                    {output}
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
