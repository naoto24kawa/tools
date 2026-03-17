import { ArrowRight, Copy, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { textToCodePoints, textToUnicodeEscape, unicodeEscapeToText } from '@/utils/unicode';

export default function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const codePoints = useMemo(() => (input ? textToCodePoints(input) : ''), [input]);

  const handleEncode = () => {
    try {
      setOutput(textToUnicodeEscape(input));
    } catch {
      toast({ title: 'Encoding failed', variant: 'destructive' });
    }
  };

  const handleDecode = () => {
    try {
      setOutput(unicodeEscapeToText(input));
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
          <h1 className="text-3xl font-bold tracking-tight">Unicode Escape Converter</h1>
          <p className="text-muted-foreground">Unicodeエスケープシーケンスの変換を行います。</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Converter</CardTitle>
            <CardDescription>テキストまたはUnicodeエスケープを入力してください。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-6 md:grid-cols-[1fr,auto,1fr] items-start">
              <div className="space-y-2">
                <Label htmlFor="input">Input</Label>
                <textarea
                  id="input"
                  className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  placeholder="Hello or \u0048\u0065\u006c\u006c\u006f"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-4 justify-center pt-10">
                <Button onClick={handleEncode} disabled={!input}>
                  Escape <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button onClick={handleDecode} variant="secondary" disabled={!input}>
                  Unescape <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="output">Output</Label>
                <textarea
                  id="output"
                  readOnly
                  className="flex min-h-[200px] w-full rounded-md border border-input bg-muted px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  value={output}
                />
              </div>
            </div>

            {codePoints && (
              <div className="text-xs text-muted-foreground font-mono pt-2 border-t">
                Code Points: {codePoints}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setInput('');
                  setOutput('');
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Clear
              </Button>
              <Button onClick={copyToClipboard} disabled={!output}>
                <Copy className="mr-2 h-4 w-4" /> Copy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}
