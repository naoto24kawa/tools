import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';

interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  width?: number;
  height?: number;
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

export default function App() {
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const meta: FileMetadata = {
      name: file.name,
      size: file.size,
      type: file.type || 'unknown',
      lastModified: file.lastModified,
    };

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      const img = new Image();
      img.onload = () => {
        meta.width = img.naturalWidth;
        meta.height = img.naturalHeight;
        setMetadata(meta);
        toast({ title: 'Image metadata loaded' });
      };
      img.onerror = () => {
        setMetadata(meta);
        toast({ title: 'File metadata loaded' });
      };
      img.src = url;
    } else {
      setPreviewUrl('');
      setMetadata(meta);
      toast({ title: 'File metadata loaded' });
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClear = () => {
    setMetadata(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
  };

  const extension = metadata?.name.split('.').pop()?.toLowerCase() || '';

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">File Metadata Viewer</h1>
          <p className="text-muted-foreground">
            Upload a file to view its metadata including name, size, type, and image dimensions.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Upload File</CardTitle>
            <CardDescription>Select any file to inspect its metadata.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-3">
                Drop a file or click to upload
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
              >
                Choose File
              </Button>
            </div>
          </CardContent>
        </Card>

        {metadata && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {metadata.type.startsWith('image/') ? (
                    <ImageIcon className="h-5 w-5" />
                  ) : (
                    <FileText className="h-5 w-5" />
                  )}
                  File Metadata
                </CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={handleClear}>
                  <Trash2 className="mr-2 h-4 w-4" /> Clear
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">File Name</Label>
                  <p className="font-mono text-sm break-all">{metadata.name}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Extension</Label>
                  <p className="font-mono text-sm">.{extension}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Size</Label>
                  <p className="font-mono text-sm">
                    {formatSize(metadata.size)} ({metadata.size.toLocaleString()} bytes)
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">MIME Type</Label>
                  <p className="font-mono text-sm">{metadata.type}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Last Modified</Label>
                  <p className="font-mono text-sm">{formatDate(metadata.lastModified)}</p>
                </div>
                {metadata.width !== undefined && metadata.height !== undefined && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Dimensions</Label>
                    <p className="font-mono text-sm">
                      {metadata.width} x {metadata.height} px
                    </p>
                  </div>
                )}
              </div>

              {previewUrl && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Preview</Label>
                  <div className="flex justify-center bg-muted rounded-md p-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-w-full max-h-[300px] object-contain"
                    />
                  </div>
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
