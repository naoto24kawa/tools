import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, Check, X, Copy, Trash2 } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';

type Algorithm = 'SHA-256' | 'SHA-512' | 'SHA-1';

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export default function App() {
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [algorithm, setAlgorithm] = useState<Algorithm>('SHA-256');
  const [hash, setHash] = useState('');
  const [compareHash, setCompareHash] = useState('');
  const [computing, setComputing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(file.size);
    setHash('');
    setComputing(true);

    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
      setHash(bufferToHex(hashBuffer));
      toast({ title: `${algorithm} hash computed` });
    } catch {
      toast({ title: 'Failed to compute hash', variant: 'destructive' });
    } finally {
      setComputing(false);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const recompute = async () => {
    if (!fileName) return;
    toast({ title: 'Please re-upload the file to recompute with a different algorithm' });
  };

  const copyHash = async () => {
    try {
      await navigator.clipboard.writeText(hash);
      toast({ title: 'Hash copied to clipboard' });
    } catch {
      toast({ title: 'Copy failed', variant: 'destructive' });
    }
  };

  const hashMatch =
    hash && compareHash.trim()
      ? hash.toLowerCase() === compareHash.trim().toLowerCase()
      : null;

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${units[i]}`;
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">File Hash Checker</h1>
          <p className="text-muted-foreground">
            Compute SHA-256, SHA-512, or SHA-1 hashes of files and compare against expected values.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Upload File</CardTitle>
            <CardDescription>Select a file to compute its hash.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Algorithm</Label>
              <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as Algorithm)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SHA-256">SHA-256</SelectItem>
                  <SelectItem value="SHA-512">SHA-512</SelectItem>
                  <SelectItem value="SHA-1">SHA-1</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-3">
                {fileName ? `${fileName} (${formatSize(fileSize)})` : 'Drop a file or click to upload'}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={computing}
              >
                {computing ? 'Computing...' : 'Choose File'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {hash && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Hash Result</CardTitle>
                  <CardDescription>{algorithm} - {fileName}</CardDescription>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={copyHash}>
                  <Copy className="mr-2 h-4 w-4" /> Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="rounded-md bg-muted p-4 text-sm font-mono break-all whitespace-pre-wrap">
                {hash}
              </pre>

              <div className="space-y-2">
                <Label>Compare Hash (optional)</Label>
                <Input
                  value={compareHash}
                  onChange={(e) => setCompareHash(e.target.value)}
                  placeholder="Paste expected hash to compare..."
                  className="font-mono"
                />
              </div>

              {hashMatch !== null && (
                <div
                  className={`flex items-center gap-2 p-3 rounded-md ${
                    hashMatch
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {hashMatch ? (
                    <>
                      <Check className="h-5 w-5" />
                      <span className="font-medium">Hashes match</span>
                    </>
                  ) : (
                    <>
                      <X className="h-5 w-5" />
                      <span className="font-medium">Hashes do not match</span>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      <Toaster />
    </div>
  );
}
