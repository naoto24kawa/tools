import React, { useState } from 'react';
import { ImageUpload } from './components/ImageUpload';
import { ImageCropper } from './components/ImageCropper';
import { CropInput } from './components/CropInput';
import { ExportPanel } from './components/ExportPanel';
import type { ImageState, Crop, PixelCrop, ExportSettings, AspectRatioOption } from './types';
import { calculateAspectRatio } from './utils/cropCalculator';

const ASPECT_RATIOS: AspectRatioOption[] = [
  { label: '自由', value: null },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '16:9', value: 16 / 9 },
  { label: '3:2', value: 3 / 2 },
];

export function App() {
  const [image, setImage] = useState<ImageState>({
    file: null,
    src: null,
    naturalWidth: 0,
    naturalHeight: 0,
  });

  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });

  const [completedCrop, setCompletedCrop] = useState<PixelCrop>({
    unit: 'px',
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);

  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    format: 'jpeg',
    quality: 0.95,
    filename: `cropped-${Date.now()}.jpeg`,
  });

  const handleImageLoad = (file: File, src: string, width: number, height: number) => {
    setImage({ file, src, naturalWidth: width, naturalHeight: height });
    setExportSettings({
      ...exportSettings,
      filename: `cropped-${file.name.split('.')[0]}.${exportSettings.format}`,
    });
  };

  const handleCropChange = (newCrop: Crop, pixelCrop: PixelCrop) => {
    setCrop(newCrop);
    setCompletedCrop(pixelCrop);
  };

  const handleAspectRatioChange = (ratio: number | null) => {
    setAspectRatio(ratio || undefined);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>画像トリミングアプリ</h1>
        <p>クライアントサイドで完結する画像トリミングツール</p>
      </header>

      <main className="main-content">
        <div className="card">
          {!image.src ? (
            <ImageUpload onImageLoad={handleImageLoad} />
          ) : (
            <>
              <ImageCropper
                src={image.src}
                crop={crop}
                onCropChange={handleCropChange}
                aspect={aspectRatio}
                imageSize={{ width: image.naturalWidth, height: image.naturalHeight }}
              />
              <div style={{ marginTop: '1rem' }}>
                <button
                  className="button button-secondary"
                  onClick={() => setImage({ file: null, src: null, naturalWidth: 0, naturalHeight: 0 })}
                >
                  別の画像を選択
                </button>
              </div>
            </>
          )}
        </div>

        {image.src && (
          <div className="card">
            <CropInput
              crop={crop}
              imageSize={{ width: image.naturalWidth, height: image.naturalHeight }}
              onCropChange={(newCrop) => handleCropChange(newCrop, completedCrop)}
            />

            <ExportPanel
              imageSrc={image.src}
              crop={completedCrop}
              exportSettings={exportSettings}
              onExportSettingsChange={setExportSettings}
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
          </div>
        )}
      </main>
    </div>
  );
}
