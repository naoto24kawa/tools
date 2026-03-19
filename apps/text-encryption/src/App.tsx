import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Lock, Unlock, Trash2 } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { encrypt, decrypt } from '@/utils/textEncryption';

export default function App() {
  const [input, setInput] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleEncrypt = async () => {
    if (!input.trim() || !passphrase) {
      toast({ title: 'Text and passphrase are required', variant: 'destructive' });
      return;
    }
    setIsProcessing(true);
    try {
      const encrypted = await encrypt(input, passphrase);
      setOutput(encrypted);
      toast({ title: 'Text encrypted successfully' });
    } catch (e) {
      toast({
        title: 'Encryption failed',
        description: e instanceof Error ? e.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecrypt = async () => {
    if (!input.trim() || !passphrase) {
      toast({ title: 'Encrypted text and passphrase are required', variant: 'destructive' });
      return;
    }
    setIsProcessing(true);
    try {
      const decrypted = await decrypt(input, passphrase);
      setOutput(decrypted);
      toast({ title: 'Text decrypted successfully' });
    } catch (e) {
      toast({
        title: 'Decryption failed',
        description: e instanceof Error ? e.message : 'Wrong passphrase or corrupted data',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output);
      toast({ title: 'Copied to clipboard' });
    } catch {
      toast({ title: 'Copy failed', variant: 'destructive' });
    }
  };

  const clearAll = () => {
    setInput('');
    setPassphrase('');
    setOutput('');
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Text Encryption</h1>
          <p className="text-muted-foreground">
            Encrypt and decrypt text with a passphrase using AES-GCM (Web Crypto API).
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>
              Enter text to encrypt, or paste encrypted text to decrypt.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="input">Text</Label>
              <textarea
                id="input"
                className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none font-mono"
                placeholder="Enter text to encrypt or encrypted text to decrypt..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passphrase">Passphrase</Label>
              <Input
                id="passphrase"
                type="password"
                placeholder="Enter passphrase..."
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleEncrypt}
                disabled={!input.trim() || !passphrase || isProcessing}
              >
                <Lock className="mr-2 h-4 w-4" /> Encrypt
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleDecrypt}
                disabled={!input.trim() || !passphrase || isProcessing}
              >
                <Unlock className="mr-2 h-4 w-4" /> Decrypt
              </Button>
              <Button type="button" variant="outline" onClick={clearAll}>
                <Trash2 className="mr-2 h-4 w-4" /> Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {output && (
          <Card>
            <CardHeader>
              <CardTitle>Output</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                readOnly
                className="flex min-h-[150px] w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none font-mono"
                value={output}
              />
              <div className="flex justify-end">
                <Button type="button" onClick={copyOutput}>
                  <Copy className="mr-2 h-4 w-4" /> Copy
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Toaster />
    </div>
  );
}
