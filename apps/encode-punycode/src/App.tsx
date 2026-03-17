import { ArrowRight, Copy, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { domainFromASCII, domainToASCII } from '@/utils/punycode';

export default function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const handleEncode = () => {
    try {
      setOutput(domainToASCII(input));
    } catch {
      toast({ title: 'Encoding failed', variant: 'destructive' });
    }
  };

  const handleDecode = () => {
    try {
      setOutput(domainFromASCII(input));
    } catch {
      toast({ title: 'Decoding failed', variant: 'destructive' });
    }
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Punycode Converter</h1>
          <p className="text-muted-foreground">
            ドメイン名のPunycode(国際化ドメイン名)変換を行います。
          </p>
        </header>
        <Card>
          <CardHeader>
            <CardTitle>Converter</CardTitle>
            <CardDescription>ドメイン名を入力してください。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-6 md:grid-cols-[1fr,auto,1fr] items-start">
              <div className="space-y-2">
                <Label htmlFor="input">Input</Label>
                <input
                  id="input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="日本語.jp or xn--wgv71a309e.jp"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="flex flex-col gap-4 justify-center pt-6">
                <Button onClick={handleEncode} disabled={!input}>
                  To ASCII <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button onClick={handleDecode} variant="secondary" disabled={!input}>
                  To Unicode <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Output</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-muted rounded px-3 py-2 text-sm font-mono min-h-[40px] break-all">
                    {output || '\u00A0'}
                  </code>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={copyToClipboard}
                    disabled={!output}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setInput('');
                  setOutput('');
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}
