import { ColorPicker } from '@components/ColorPicker';
import { ExportPanel } from '@components/ExportPanel';
import { ImageUpload } from '@components/ImageUpload';
import { PreviewCanvas } from '@components/PreviewCanvas';
import { ToleranceSlider } from '@components/ToleranceSlider';
import { Card } from '@components/ui/card';
import { useImageLoader } from '@hooks/useImageLoader';
import { useTransparent } from '@hooks/useTransparent';
import type { RgbColor } from '@types';
import { useCallback, useState } from 'react';

export function App() {
  const { image, loadImage, resetImage } = useImageLoader();
  const {
    settings,
    isEyedropperMode,
    setTargetColor,
    setTolerance,
    toggleEyedropperMode,
    disableEyedropperMode,
    resetSettings,
  } = useTransparent();

  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileLoad = useCallback(
    (file: File) => {
      setError(null);
      loadImage(file);
    },
    [loadImage]
  );

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);

  const handleColorPick = useCallback(
    (color: RgbColor) => {
      setTargetColor(color);
      disableEyedropperMode();
    },
    [setTargetColor, disableEyedropperMode]
  );

  const handleProcessedImageChange = useCallback((dataUrl: string | null) => {
    setProcessedImageUrl(dataUrl);
  }, []);

  const handleReset = useCallback(() => {
    resetImage();
    resetSettings();
    setProcessedImageUrl(null);
    setError(null);
  }, [resetImage, resetSettings]);

  const isImageLoaded = image.status === 'loaded';

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="border-b bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-2">
            <a href="/" className="text-sm text-primary hover:underline">
              ← Tools トップに戻る
            </a>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">🔍 Image Transparent</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            画像の特定の色を透過に変換します。スポイトで色を取得、または直接色を指定できます。
          </p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        )}

        {!isImageLoaded ? (
          <ImageUpload onFileLoad={handleFileLoad} onError={handleError} />
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[400px_1fr]">
            {/* 左カラム: 設定パネル */}
            <Card className="h-fit p-6">
              <div className="space-y-6">
                <ColorPicker
                  color={settings.targetColor}
                  isEyedropperMode={isEyedropperMode}
                  onColorChange={setTargetColor}
                  onToggleEyedropper={toggleEyedropperMode}
                />

                <ToleranceSlider value={settings.tolerance} onChange={setTolerance} />

                <ExportPanel processedImageUrl={processedImageUrl} onReset={handleReset} />
              </div>
            </Card>

            {/* 右カラム: プレビュー */}
            <Card className="p-6">
              <PreviewCanvas
                imageSrc={image.src}
                width={image.naturalWidth}
                height={image.naturalHeight}
                settings={settings}
                isEyedropperMode={isEyedropperMode}
                onColorPick={handleColorPick}
                onProcessedImageChange={handleProcessedImageChange}
              />
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
