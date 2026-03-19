import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Upload, Download, FileText, FolderOpen } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';

interface ZipEntry {
  name: string;
  compressedSize: number;
  uncompressedSize: number;
  offset: number;
  data: Uint8Array;
}

function parseZip(data: Uint8Array): ZipEntry[] {
  const entries: ZipEntry[] = [];
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);

  // Find end of central directory
  let eocdOffset = -1;
  for (let i = data.length - 22; i >= 0; i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocdOffset = i;
      break;
    }
  }

  if (eocdOffset === -1) throw new Error('Not a valid ZIP file');

  const centralDirOffset = view.getUint32(eocdOffset + 16, true);
  const entryCount = view.getUint16(eocdOffset + 10, true);

  let offset = centralDirOffset;

  for (let i = 0; i < entryCount; i++) {
    if (offset + 46 > data.length) break;
    if (view.getUint32(offset, true) !== 0x02014b50) break;

    const compression = view.getUint16(offset + 10, true);
    const compressedSize = view.getUint32(offset + 20, true);
    const uncompressedSize = view.getUint32(offset + 24, true);
    const nameLength = view.getUint16(offset + 28, true);
    const extraLength = view.getUint16(offset + 30, true);
    const commentLength = view.getUint16(offset + 32, true);
    const localHeaderOffset = view.getUint32(offset + 42, true);

    const nameBytes = data.slice(offset + 46, offset + 46 + nameLength);
    const name = new TextDecoder().decode(nameBytes);

    // Read file data from local header
    let fileData = new Uint8Array(0);
    if (localHeaderOffset + 30 < data.length) {
      const localNameLength = view.getUint16(localHeaderOffset + 26, true);
      const localExtraLength = view.getUint16(localHeaderOffset + 28, true);
      const dataStart = localHeaderOffset + 30 + localNameLength + localExtraLength;

      if (compression === 0 && dataStart + compressedSize <= data.length) {
        fileData = data.slice(dataStart, dataStart + compressedSize);
      }
    }

    entries.push({
      name,
      compressedSize,
      uncompressedSize,
      offset: localHeaderOffset,
      data: fileData,
    });

    offset += 46 + nameLength + extraLength + commentLength;
  }

  return entries;
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${units[i]}`;
}

function downloadFile(name: string, data: Uint8Array) {
  const blob = new Blob([data]);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name.split('/').pop() || name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function App() {
  const [entries, setEntries] = useState<ZipEntry[]>([]);
  const [zipName, setZipName] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setZipName(file.name);

    try {
      const buffer = await file.arrayBuffer();
      const data = new Uint8Array(buffer);
      const parsed = parseZip(data);
      setEntries(parsed);
      toast({ title: `${parsed.length} entries found in ${file.name}` });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse ZIP file');
      setEntries([]);
      toast({ title: 'Failed to parse ZIP', variant: 'destructive' });
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleExtract = (entry: ZipEntry) => {
    if (entry.data.length === 0) {
      toast({ title: 'Cannot extract: compressed or empty file', variant: 'destructive' });
      return;
    }
    downloadFile(entry.name, entry.data);
    toast({ title: `Extracted ${entry.name}` });
  };

  const isDirectory = (name: string) => name.endsWith('/');
  const totalSize = entries.reduce((s, e) => s + e.uncompressedSize, 0);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">ZIP Extractor</h1>
          <p className="text-muted-foreground">
            Upload a ZIP file to view and extract its contents.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Upload ZIP</CardTitle>
            <CardDescription>Select a .zip file to inspect.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-3">
                {zipName || 'Upload a ZIP file'}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip,application/zip"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose ZIP File
              </Button>
            </div>
            {error && (
              <p className="text-sm text-destructive mt-2">{error}</p>
            )}
          </CardContent>
        </Card>

        {entries.length > 0 && (
          <Card>
            <CardHeader>
              <div>
                <CardTitle>
                  Contents ({entries.length} entries)
                </CardTitle>
                <CardDescription>
                  Total uncompressed: {formatSize(totalSize)}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {entries.map((entry, i) => (
                  <div
                    key={`${entry.name}-${i}`}
                    className="flex items-center gap-3 p-3 rounded-md bg-muted"
                  >
                    {isDirectory(entry.name) ? (
                      <FolderOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                    ) : (
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-mono truncate">{entry.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatSize(entry.uncompressedSize)}
                      </p>
                    </div>
                    {!isDirectory(entry.name) && entry.data.length > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExtract(entry)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Toaster />
    </div>
  );
}
