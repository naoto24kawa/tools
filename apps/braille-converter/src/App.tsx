import { useMemo, useState } from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Label } from './components/ui/label';
import { Toaster } from './components/ui/toaster';
import { useToast } from './hooks/useToast';
import { brailleToText, textToBraille } from './utils/braille';

const MODES = ['toBraille', 'toText'] as const;
type Mode = (typeof MODES)[number];

function App() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('toBraille');
  const { toast } = useToast();

  const output = useMemo(() => {
    if (!input) return '';
    try {
      return mode === 'toBraille' ? textToBraille(input) : brailleToText(input);
    } catch {
      return 'Error: Invalid input';
    }
  }, [input, mode]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      toast({ title: 'Copied!' });
    } catch {
      toast({ title: 'Copy failed', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Braille Converter</CardTitle>
            <CardDescription>Convert text to Braille and back</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Mode</Label>
              <div className="flex gap-2">
                {MODES.map((m) => (
                  <Button
                    key={m}
                    variant={mode === m ? 'default' : 'outline'}
                    onClick={() => setMode(m)}
                    type="button"
                  >
                    {m === 'toBraille' ? 'Text to Braille' : 'Braille to Text'}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="input">Input</Label>
              <textarea
                id="input"
                className="w-full rounded-md border p-3 font-mono text-sm"
                rows={6}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'toBraille' ? 'Enter text...' : 'Enter braille...'}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="output">Output</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  disabled={!output}
                  type="button"
                >
                  Copy
                </Button>
              </div>
              <textarea
                id="output"
                className="w-full rounded-md border bg-gray-50 p-3 text-2xl"
                rows={6}
                value={output}
                readOnly
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
