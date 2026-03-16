import { Copy, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { CASE_OPTIONS, type CaseType, convertCase } from '@/utils/caseConverter';

export default function App() {
  const [input, setInput] = useState('');
  const [caseType, setCaseType] = useState<CaseType>('upper');
  const { toast } = useToast();

  const output = useMemo(() => {
    if (!input) return '';
    return convertCase(input, caseType);
  }, [input, caseType]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({ title: 'Copied to clipboard' });
  };

  const clearAll = () => {
    setInput('');
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Text Case Converter</h1>
          <p className="text-muted-foreground">テキストの大文字/小文字を変換します。</p>
        </header>

        <div className="grid gap-4 md:grid-cols-[200px,1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">変換タイプ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {CASE_OPTIONS.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => setCaseType(option.value)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    caseType === option.value
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div
                    className={`text-xs ${caseType === option.value ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}
                  >
                    {option.description}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Converter</CardTitle>
              <CardDescription>テキストを入力すると、リアルタイムで変換されます。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input">Input</Label>
                <textarea
                  id="input"
                  className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  placeholder="ここにテキストを入力..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="output">Output</Label>
                <textarea
                  id="output"
                  readOnly
                  className="flex min-h-[200px] w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  placeholder="変換結果がここに表示されます..."
                  value={output}
                />
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
      </div>
      <Toaster />
    </div>
  );
}
