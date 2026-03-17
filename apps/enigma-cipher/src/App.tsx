import { useMemo, useState } from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Label } from './components/ui/label';
import { Toaster } from './components/ui/toaster';
import { useToast } from './hooks/useToast';
import { type EnigmaConfig, enigmaEncrypt, type RotorName } from './utils/enigma';

const ROTOR_OPTIONS: RotorName[] = ['I', 'II', 'III'];

function App() {
  const [input, setInput] = useState('');
  const [rotors, setRotors] = useState<[RotorName, RotorName, RotorName]>(['I', 'II', 'III']);
  const [positions, setPositions] = useState<[number, number, number]>([0, 0, 0]);
  const { toast } = useToast();

  const config: EnigmaConfig = useMemo(() => ({ rotors, positions }), [rotors, positions]);
  const output = useMemo(() => {
    if (!input) return '';
    return enigmaEncrypt(input, config);
  }, [input, config]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      toast({ title: 'Copied!' });
    } catch {
      toast({ title: 'Copy failed', variant: 'destructive' });
    }
  };

  const updateRotor = (index: number, value: RotorName) => {
    const newRotors = [...rotors] as [RotorName, RotorName, RotorName];
    newRotors[index] = value;
    setRotors(newRotors);
  };

  const updatePosition = (index: number, value: number) => {
    const newPositions = [...positions] as [number, number, number];
    newPositions[index] = value;
    setPositions(newPositions);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Enigma Cipher Simulator</CardTitle>
            <CardDescription>Historical Enigma machine simulation (Enigma I)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div key={`rotor-${ROTOR_OPTIONS[i]}`} className="space-y-2">
                  <Label>Rotor {i + 1}</Label>
                  <select
                    className="w-full rounded-md border p-2"
                    value={rotors[i]}
                    onChange={(e) => updateRotor(i, e.target.value as RotorName)}
                  >
                    {ROTOR_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <Label>Position</Label>
                  <input
                    type="number"
                    className="w-full rounded-md border p-2"
                    min={0}
                    max={25}
                    value={positions[i]}
                    onChange={(e) => updatePosition(i, Number(e.target.value))}
                  />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="input">Input</Label>
              <textarea
                id="input"
                className="w-full rounded-md border p-3 font-mono text-sm"
                rows={4}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text..."
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Output</Label>
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
                className="w-full rounded-md border bg-gray-50 p-3 font-mono text-sm"
                rows={4}
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
