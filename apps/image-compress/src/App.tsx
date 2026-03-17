import { Download, Upload } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { type CompressResult, compressImage, formatBytes } from '@/utils/imageCompress';

export default function App() {
  const [quality, setQuality] = useState(75);
  const [maxWidth, setMaxWidth] = useState(0);
  const [format, setFormat] = useState<'image/jpeg' | 'image/webp'>('image/jpeg');
  const [result, setResult] = useState<CompressResult | null>(null);
  const [_originalSize, setOriginalSize] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = useCallback(
    async (file: File) => {
      setOriginalSize(file.size);
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = async () => {
        try {
          const r = await compressImage(img, quality, maxWidth, format);
          r.originalSize = file.size;
          r.ratio = Math.round((1 - r.compressedSize / file.size) * 100);
          setResult(r);
        } catch {
          toast({ title: '圧縮に失敗しました', variant: 'destructive' });
        }
        URL.revokeObjectURL(url);
      };
      img.src = url;
    },
    [quality, maxWidth, format, toast]
  );

  const download = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.dataUrl;
    a.download = `compressed.${format === 'image/webp' ? 'webp' : 'jpg'}`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Image Compressor</h1>
          <p className="text-muted-foreground">画像をブラウザ上で圧縮します。</p>
        </header>
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>品質と最大幅を設定してください。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Quality: {quality}%</Label>
              <input
                type="range"
                min={1}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Max Width (0=original)</Label>
                <input
                  type="number"
                  min={0}
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(Number(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label>Format</Label>
                <div className="flex gap-2">
                  {(['image/jpeg', 'image/webp'] as const).map((f) => (
                    <button
                      type="button"
                      key={f}
                      onClick={() => setFormat(f)}
                      className={`px-3 py-2 rounded-md text-sm ${format === f ? 'bg-primary text-primary-foreground' : 'border hover:bg-muted'}`}
                    >
                      {f === 'image/jpeg' ? 'JPEG' : 'WebP'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted transition-colors"
            >
              <Upload className="mx-auto h-6 w-6 text-muted-foreground mb-1" />
              <p className="text-sm text-muted-foreground">画像を選択して圧縮</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFile(e.target.files[0]);
                }}
              />
            </button>
            {result && (
              <div className="space-y-2 pt-4 border-t">
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="text-muted-foreground">Before</div>
                    <div className="font-bold">{formatBytes(result.originalSize)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">After</div>
                    <div className="font-bold">{formatBytes(result.compressedSize)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Saved</div>
                    <div className="font-bold text-green-600">{result.ratio}%</div>
                  </div>
                </div>
                <img
                  ref={imgRef}
                  src={result.dataUrl}
                  alt="Compressed"
                  className="max-h-64 mx-auto rounded border"
                />
                <Button onClick={download} className="w-full">
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}
