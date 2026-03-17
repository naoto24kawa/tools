import { useState } from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Toaster } from './components/ui/toaster';
import { useToast } from './hooks/useToast';
import { generateHash, verifyHash } from './utils/bcryptHash';

function App() {
  const [password, setPassword] = useState('');
  const [rounds, setRounds] = useState(10);
  const [hashOutput, setHashOutput] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [verifyHashInput, setVerifyHashInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!password) return;
    const hash = generateHash(password, rounds);
    setHashOutput(hash);
  };

  const handleVerify = () => {
    if (!verifyPassword || !verifyHashInput) return;
    setVerifyResult(verifyHash(verifyPassword, verifyHashInput));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hashOutput);
      toast({ title: 'Copied!' });
    } catch {
      toast({ title: 'Copy failed', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-2xl space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Bcrypt Hash Generator</CardTitle>
            <CardDescription>Generate bcrypt password hashes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rounds">Rounds (cost factor)</Label>
              <Input
                id="rounds"
                type="number"
                min={4}
                max={16}
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
              />
            </div>
            <Button onClick={handleGenerate} disabled={!password} type="button">
              Generate Hash
            </Button>
            {hashOutput && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Hash</Label>
                  <Button variant="outline" size="sm" onClick={handleCopy} type="button">
                    Copy
                  </Button>
                </div>
                <div className="rounded-md border bg-gray-50 p-3 font-mono text-sm break-all">
                  {hashOutput}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bcrypt Verify</CardTitle>
            <CardDescription>Check if a password matches a hash</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verify-password">Password</Label>
              <Input
                id="verify-password"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
                placeholder="Enter password..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="verify-hash">Hash</Label>
              <Input
                id="verify-hash"
                value={verifyHashInput}
                onChange={(e) => setVerifyHashInput(e.target.value)}
                placeholder="$2b$10$..."
              />
            </div>
            <Button
              onClick={handleVerify}
              disabled={!verifyPassword || !verifyHashInput}
              type="button"
            >
              Verify
            </Button>
            {verifyResult !== null && (
              <div
                className={`rounded-md p-3 text-sm font-medium ${verifyResult ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              >
                {verifyResult ? 'Match! Password is correct.' : 'No match. Password is incorrect.'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
