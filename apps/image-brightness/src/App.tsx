import { Download, RotateCcw, Upload } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { applyFilters } from '@/utils/imageBrightness';

export default function App() {
  const [src, setSrc] = useState('');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setSrc(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const download = () => {
    if (!imgRef.current) return;
    const dataUrl = applyFilters(imgRef.current, brightness, contrast, saturate);
    if (!dataUrl) {
      toast({ title: '処理に失敗しました', variant: 'destructive' });
      return;
    }
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'adjusted.png';
    a.click();
  };

  const reset = () => {
    setBrightness(100);
    setContrast(100);
    setSaturate(100);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Image Brightness/Contrast</h1>
          <p className="text-muted-foreground">画像の明るさ/コントラスト/彩度を調整します。</p>
        </header>
        <Card>
          <CardHeader>
            <CardTitle>Adjuster</CardTitle>
            <CardDescription>画像をアップロードしてスライダーで調整してください。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted transition-colors"
            >
              <Upload className="mx-auto h-6 w-6 text-muted-foreground mb-1" />
              <p className="text-sm text-muted-foreground">画像を選択</p>
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
            {src && (
              <>
                <div className="flex justify-center">
                  <img
                    ref={imgRef}
                    src={src}
                    alt="Original"
                    className="max-h-64 rounded border"
                    style={{
                      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)`,
                    }}
                  />
                </div>
                {(
                  [
                    ['Brightness', brightness, setBrightness],
                    ['Contrast', contrast, setContrast],
                    ['Saturate', saturate, setSaturate],
                  ] as const
                ).map(([label, val, setter]) => (
                  <div key={label} className="space-y-1">
                    <Label className="text-xs">
                      {label}: {val}%
                    </Label>
                    <input
                      type="range"
                      min={0}
                      max={200}
                      value={val}
                      onChange={(e) => setter(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={reset}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                  </Button>
                  <Button onClick={download}>
                    <Download className="mr-2 h-4 w-4" /> Download
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}
