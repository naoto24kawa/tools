import { useState } from 'react';
import { ImageUpload } from '@components/ImageUpload';
import { ImageCropper } from '@components/ImageCropper';
import { CropInput } from '@components/CropInput';
import { ExportPanel } from '@components/ExportPanel';
import type { ImageState, Crop, PixelCrop, ExportSettings, UserPreferences } from '@types';
import { calculateAspectRatio } from '@utils/cropCalculator';
import { ASPECT_RATIOS } from '@config/constants';

export function App() {
  const [image, setImage] = useState<ImageState>({ status: 'idle' });
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({});

  const [crop, setCrop] = useState<Crop>({
    unit: 'px',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
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
    format: 'png',
    quality: 0.95,
    filename: `cropped-${Date.now()}.png`,
  });

  /**
   * ユーザー設定を新しい画像に適用する
   */
  const applyCropPreferences = (
    imageWidth: number,
    imageHeight: number,
    preferences: UserPreferences
  ): Crop => {
    // サイズ設定がある場合
    if (preferences.manualSize) {
      let { width, height, unit } = preferences.manualSize;

      // ピクセル単位の場合、画像サイズより大きければ画像に合わせる
      if (unit === 'px') {
        width = Math.min(width, imageWidth);
        height = Math.min(height, imageHeight);
      }

      // アスペクト比設定もある場合は調整
      if (preferences.manualAspectRatio) {
        // アスペクト比を維持しつつサイズ調整
        const newHeight = width / preferences.manualAspectRatio;
        if (newHeight <= imageHeight) {
          height = newHeight;
        } else {
          // 高さが画像を超える場合は高さから逆算
          height = imageHeight;
          width = height * preferences.manualAspectRatio;
        }
      }

      return { x: 0, y: 0, width, height, unit };
    }

    // サイズ設定がなくアスペクト比のみ設定されている場合
    if (preferences.manualAspectRatio) {
      // デフォルトの50%幅でアスペクト比を適用
      const width = imageWidth * 0.5;
      const height = width / preferences.manualAspectRatio;
      return { x: 0, y: 0, width, height, unit: 'px' };
    }

    // 設定なし：デフォルト値
    return { unit: 'px', x: 0, y: 0, width: 100, height: 100 };
  };

  const handleImageLoad = (file: File, src: string, width: number, height: number) => {
    setImage({
      status: 'loaded',
      file,
      src,
      naturalWidth: width,
      naturalHeight: height,
    });
    setExportSettings({
      ...exportSettings,
      filename: `cropped-${file.name.split('.')[0]}.${exportSettings.format}`,
    });

    // ユーザー設定を適用
    const newCrop = applyCropPreferences(width, height, userPreferences);
    setCrop(newCrop);
    setCompletedCrop({
      unit: 'px',
      x: newCrop.x,
      y: newCrop.y,
      width: newCrop.width,
      height: newCrop.height,
    });
  };

  const handleCropChange = (newCrop: Crop, pixelCrop: PixelCrop) => {
    setCrop(newCrop);
    setCompletedCrop(pixelCrop);
  };

  const handleAspectRatioChange = (ratio: number | null) => {
    setAspectRatio(ratio || undefined);
    // ユーザー設定に保存
    setUserPreferences((prev) => ({
      ...prev,
      manualAspectRatio: ratio,
    }));
  };

  /**
   * アスペクト比適用後のサイズをユーザー設定に保存
   */
  const handleAspectRatioApplied = (newCrop: Crop) => {
    setUserPreferences((prev) => ({
      ...prev,
      manualSize: {
        width: newCrop.width,
        height: newCrop.height,
        unit: newCrop.unit,
      },
    }));
  };

  /**
   * CropInputからの手動変更を受け取る
   */
  const handleManualCropChange = (newCrop: Crop) => {
    // サイズと単位をユーザー設定に保存
    setUserPreferences((prev) => ({
      ...prev,
      manualSize: {
        width: newCrop.width,
        height: newCrop.height,
        unit: newCrop.unit,
      },
    }));
  };

  return (
    <div className="container">
      <header className="header">
        <div style={{ marginBottom: '0.5rem' }}>
          <a href="/" style={{ color: '#667eea', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← Tools トップに戻る
          </a>
        </div>
        <h1>画像トリミングアプリ</h1>
        <p>クライアントサイドで完結する画像トリミングツール</p>
      </header>

      <main className="main-content">
        <div className="card">
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
              <div style={{ marginTop: '1rem' }}>
                <button
                  className="button button-secondary"
                  onClick={() => setImage({ status: 'idle' })}
                >
                  別の画像を選択
                </button>
              </div>
            </>
          )}
        </div>

        {image.status === 'loaded' && (
          <div className="card">
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
              onExportSettingsChange={setExportSettings}
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
          </div>
        )}
      </main>
    </div>
  );
}
