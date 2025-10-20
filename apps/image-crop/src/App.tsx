import { ImageUpload } from '@components/ImageUpload';
import { ImageCropper } from '@components/ImageCropper';
import { CropInput } from '@components/CropInput';
import { ExportPanel } from '@components/ExportPanel';
import { Button } from '@components/ui/button';
import { Card } from '@components/ui/card';
import { Toaster } from '@components/ui/toaster';
import { useCropState } from '@hooks/useCropState';
import { calculateAspectRatio } from '@utils/formatters';
import { ASPECT_RATIOS } from '@config/constants';

export function App() {
  const {
    image,
    crop,
    completedCrop,
    aspectRatio,
    exportSettings,
    handleImageLoad,
    handleCropChange,
    handleAspectRatioChange,
    handleAspectRatioApplied,
    handleManualCropChange,
    handleExportSettingsChange,
    resetImage,
  } = useCropState();

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-2">
              <a href="/" className="text-sm text-primary hover:underline">
                ← Tools トップに戻る
              </a>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">🖼️ Image Cropper</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              画像のトリミングとリサイズツール。OGP画像、README用スクリーンショット、SNSアイコン、サムネイル作成に最適。
            </p>
            <p className="mt-1 text-xs text-muted-foreground/80">
              🔒 すべての処理はブラウザ内で完結 - データは外部に送信・保存されません
            </p>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
            <Card className="p-6">
              {image.status === 'idle' ? (
                <ImageUpload onImageLoad={handleImageLoad} />
              ) : (
                <>
                  <ImageCropper
                    src={image.src}
                    crop={crop}
                    onCropChange={handleCropChange}
                    onAspectRatioApplied={handleAspectRatioApplied}
                    aspect={aspectRatio}
                    imageSize={{ width: image.naturalWidth, height: image.naturalHeight }}
                  />
                  <div className="mt-4">
                    <Button variant="outline" onClick={resetImage} className="w-full">
                      別の画像を選択
                    </Button>
                  </div>
                </>
              )}
            </Card>

            {image.status === 'loaded' && (
              <Card className="p-6">
                <CropInput
                  crop={crop}
                  imageSize={{ width: image.naturalWidth, height: image.naturalHeight }}
                  onCropChange={(newCrop) => handleCropChange(newCrop, completedCrop)}
                  onManualChange={handleManualCropChange}
                  selectedAspectRatio={aspectRatio}
                />

                <ExportPanel
                  imageSrc={image.src}
                  crop={completedCrop}
                  exportSettings={exportSettings}
                  onExportSettingsChange={handleExportSettingsChange}
                  aspectRatios={ASPECT_RATIOS}
                  selectedAspectRatio={aspectRatio}
                  onAspectRatioChange={handleAspectRatioChange}
                  previewInfo={{
                    originalSize: {
                      width: image.naturalWidth,
                      height: image.naturalHeight,
                    },
                    croppedSize: {
                      width: Math.round(completedCrop.width),
                      height: Math.round(completedCrop.height),
                    },
                    fileSize: '推定中...',
                    aspectRatio: calculateAspectRatio(
                      Math.round(completedCrop.width),
                      Math.round(completedCrop.height)
                    ),
                  }}
                />
              </Card>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
