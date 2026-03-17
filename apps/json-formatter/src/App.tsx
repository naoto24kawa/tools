import { CheckCircle, Copy, MinusCircle, Trash2, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { formatJSON, minifyJSON, validateJSON } from '@/utils/jsonFormatter';

export default function App() {
  const [input, setInput] = useState('');
  const [indent, setIndent] = useState(2);
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const validation = useMemo(() => validateJSON(input), [input]);

  const handleFormat = () => {
    const result = formatJSON(input, indent);
    if (result.error) {
      toast({ title: 'Format failed', description: result.error, variant: 'destructive' });
    } else {
      setOutput(result.formatted);
    }
  };

  const handleMinify = () => {
    const result = minifyJSON(input);
    if (result.error) {
      toast({ title: 'Minify failed', description: result.error, variant: 'destructive' });
    } else {
      setOutput(result.formatted);
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
          <h1 className="text-3xl font-bold tracking-tight">JSON Formatter</h1>
          <p className="text-muted-foreground">JSONを整形またはミニファイします。</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Formatter</CardTitle>
            <CardDescription>JSONを入力してFormat/Minifyを選択してください。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="indent">インデント:</Label>
                <select
                  id="indent"
                  value={indent}
                  onChange={(e) => setIndent(Number(e.target.value))}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                  <option value={1}>1 tab</option>
                </select>
              </div>
              {input.trim() && (
                <div className="flex items-center gap-1 text-sm">
                  {validation.valid ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-green-600">Valid JSON</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-red-600">Invalid JSON</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="input">Input</Label>
                <textarea
                  id="input"
                  className="flex min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  placeholder='{"key": "value"}'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="output">Output</Label>
                <textarea
                  id="output"
                  readOnly
                  className="flex min-h-[400px] w-full rounded-md border border-input bg-muted px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  placeholder="整形結果がここに表示されます..."
                  value={output}
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t">
              <div className="flex gap-2">
                <Button onClick={handleFormat} disabled={!validation.valid}>
                  Format
                </Button>
                <Button onClick={handleMinify} variant="secondary" disabled={!validation.valid}>
                  <MinusCircle className="mr-2 h-4 w-4" /> Minify
                </Button>
              </div>
              <div className="flex gap-2">
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
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}
