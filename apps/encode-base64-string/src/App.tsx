import { ArrowRight, Copy, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { decodeBase64, encodeBase64 } from '@/utils/base64';

export default function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const handleEncode = () => {
    try {
      setOutput(encodeBase64(input));
      toast({ title: 'Encoded successfully' });
    } catch {
      toast({ title: 'Encoding failed', variant: 'destructive' });
    }
  };

  const handleDecode = () => {
    try {
      setOutput(decodeBase64(input));
      toast({ title: 'Decoded successfully' });
    } catch {
      toast({
        title: 'Decoding failed',
        description: 'Invalid Base64 string',
        variant: 'destructive',
      });
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

  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Base64 Encoder / Decoder</h1>
          <p className="text-muted-foreground">テキストのBase64エンコード/デコードを行います。</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Converter</CardTitle>
            <CardDescription>テキストを入力してEncode/Decodeを選択してください。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-6 md:grid-cols-[1fr,auto,1fr] items-start">
              <div className="space-y-2">
                <Label htmlFor="input">Input</Label>
                <textarea
                  id="input"
                  className="flex min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  placeholder="Enter text here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-4 justify-center pt-10">
                <Button onClick={handleEncode} disabled={!input}>
                  Encode <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button onClick={handleDecode} variant="secondary" disabled={!input}>
                  Decode <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="output">Output</Label>
                <textarea
                  id="output"
                  readOnly
                  className="flex min-h-[300px] w-full rounded-md border border-input bg-muted px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  placeholder="Result will appear here..."
                  value={output}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={clearAll}>
                <Trash2 className="mr-2 h-4 w-4" /> Clear
              </Button>
              <Button onClick={copyToClipboard} disabled={!output}>
                <Copy className="mr-2 h-4 w-4" /> Copy Result
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}
