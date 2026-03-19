import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Upload, Download, Trash2, FileText } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';

interface FileEntry {
  name: string;
  data: Uint8Array;
  size: number;
}

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createZip(files: FileEntry[]): Uint8Array {
  const localHeaders: Uint8Array[] = [];
  const centralHeaders: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = new TextEncoder().encode(file.name);
    const crc = crc32(file.data);

    // Local file header
    const localHeader = new Uint8Array(30 + nameBytes.length + file.data.length);
    const lv = new DataView(localHeader.buffer);
    lv.setUint32(0, 0x04034b50, true); // signature
    lv.setUint16(4, 20, true); // version needed
    lv.setUint16(6, 0, true); // flags
    lv.setUint16(8, 0, true); // compression (store)
    lv.setUint16(10, 0, true); // mod time
    lv.setUint16(12, 0, true); // mod date
    lv.setUint32(14, crc, true); // crc32
    lv.setUint32(18, file.data.length, true); // compressed size
    lv.setUint32(22, file.data.length, true); // uncompressed size
    lv.setUint16(26, nameBytes.length, true); // filename length
    lv.setUint16(28, 0, true); // extra field length
    localHeader.set(nameBytes, 30);
    localHeader.set(file.data, 30 + nameBytes.length);
    localHeaders.push(localHeader);

    // Central directory header
    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(centralHeader.buffer);
    cv.setUint32(0, 0x02014b50, true); // signature
    cv.setUint16(4, 20, true); // version made by
    cv.setUint16(6, 20, true); // version needed
    cv.setUint16(8, 0, true); // flags
    cv.setUint16(10, 0, true); // compression
    cv.setUint16(12, 0, true); // mod time
    cv.setUint16(14, 0, true); // mod date
    cv.setUint32(16, crc, true); // crc32
    cv.setUint32(20, file.data.length, true); // compressed size
    cv.setUint32(24, file.data.length, true); // uncompressed size
    cv.setUint16(28, nameBytes.length, true); // filename length
    cv.setUint16(30, 0, true); // extra field length
    cv.setUint16(32, 0, true); // comment length
    cv.setUint16(34, 0, true); // disk number
    cv.setUint16(36, 0, true); // internal attrs
    cv.setUint32(38, 0, true); // external attrs
    cv.setUint32(42, offset, true); // local header offset
    centralHeader.set(nameBytes, 46);
    centralHeaders.push(centralHeader);

    offset += localHeader.length;
  }

  const centralDirOffset = offset;
  const centralDirSize = centralHeaders.reduce((s, h) => s + h.length, 0);

  // End of central directory record
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true); // signature
  ev.setUint16(4, 0, true); // disk number
  ev.setUint16(6, 0, true); // disk with central dir
  ev.setUint16(8, files.length, true); // entries on disk
  ev.setUint16(10, files.length, true); // total entries
  ev.setUint32(12, centralDirSize, true); // central dir size
  ev.setUint32(16, centralDirOffset, true); // central dir offset
  ev.setUint16(20, 0, true); // comment length

  const totalSize = offset + centralDirSize + 22;
  const result = new Uint8Array(totalSize);
  let pos = 0;

  for (const header of localHeaders) {
    result.set(header, pos);
    pos += header.length;
  }
  for (const header of centralHeaders) {
    result.set(header, pos);
    pos += header.length;
  }
  result.set(eocd, pos);

  return result;
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${units[i]}`;
}

export default function App() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded) return;

    const entries: FileEntry[] = [];
    for (const file of Array.from(uploaded)) {
      const buffer = await file.arrayBuffer();
      entries.push({
        name: file.name,
        data: new Uint8Array(buffer),
        size: file.size,
      });
    }
    setFiles((prev) => [...prev, ...entries]);
    toast({ title: `${entries.length} file(s) added` });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCreateZip = () => {
    if (files.length === 0) return;

    const zipData = createZip(files);
    const blob = new Blob([zipData], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'archive.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({ title: `ZIP created with ${files.length} file(s)` });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const totalSize = files.reduce((s, f) => s + f.size, 0);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">ZIP Creator</h1>
          <p className="text-muted-foreground">
            Upload files and create a ZIP archive for download.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Add Files</CardTitle>
            <CardDescription>Select files to include in the ZIP archive.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-3">
                Drop files or click to upload
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose Files
              </Button>
            </div>
          </CardContent>
        </Card>

        {files.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    Files ({files.length})
                  </CardTitle>
                  <CardDescription>Total: {formatSize(totalSize)}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setFiles([])}>
                    <Trash2 className="mr-2 h-4 w-4" /> Clear All
                  </Button>
                  <Button type="button" size="sm" onClick={handleCreateZip}>
                    <Download className="mr-2 h-4 w-4" /> Create ZIP
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {files.map((file, i) => (
                  <div
                    key={`${file.name}-${i}`}
                    className="flex items-center gap-3 p-3 rounded-md bg-muted"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-mono truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(i)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
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
