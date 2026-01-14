import { GrayscaleExportPanel } from '@components/GrayscaleExportPanel';
import { GrayscalePreview } from '@components/GrayscalePreview';
import { ImageUpload } from '@components/ImageUpload';
import { MethodSelector } from '@components/MethodSelector';
import { Button } from '@components/ui/button';
import { Card } from '@components/ui/card';
import { useGrayscaleState } from '@hooks/useGrayscaleState';
import { useState } from 'react';

export function App() {
  const {
    image,
    method,
    exportSettings,
    handleImageLoad,
    handleMethodChange,
    handleExportSettingsChange,
    resetImage,
  } = useGrayscaleState();

  const [grayscaleCanvas, setGrayscaleCanvas] = useState<HTMLCanvasElement | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-2">
            <a href="/" className="text-sm text-primary hover:underline">
              ← Tools トップに戻る
            </a>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">⚫ Image Grayscale</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            画像をグレースケール（白黒）に変換するツール。複数の変換方式から選択可能。
          </p>
          <p className="mt-1 text-xs text-muted-foreground/80">
            🔒 すべての処理はブラウザ内で完結 - データは外部に送信・保存されません
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            {image.status === 'idle' ? (
              <Card className="p-6">
                <ImageUpload onImageLoad={handleImageLoad} />
              </Card>
            ) : (
              <>
                <GrayscalePreview
                  src={image.src}
                  method={method}
                  naturalWidth={image.naturalWidth}
                  naturalHeight={image.naturalHeight}
                  onCanvasReady={setGrayscaleCanvas}
                />
                <Button variant="outline" onClick={resetImage} className="w-full">
                  別の画像を選択
                </Button>
              </>
            )}
          </div>

          {image.status === 'loaded' && (
            <div className="space-y-6">
              <Card className="p-6">
                <MethodSelector method={method} onMethodChange={handleMethodChange} />
              </Card>

              <GrayscaleExportPanel
                canvas={grayscaleCanvas}
                exportSettings={exportSettings}
                onExportSettingsChange={handleExportSettingsChange}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
