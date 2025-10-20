import { useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import type { Crop, PixelCrop } from '@types';
import { convertPercentToPixelCrop, convertToActualPixels } from '@utils/coordinateConverter';
import { useAspectRatioSync } from '@hooks/useAspectRatioSync';

interface ImageCropperProps {
  src: string;
  crop: Crop;
  onCropChange: (crop: Crop, pixelCrop: PixelCrop) => void;
  onAspectRatioApplied?: ((crop: Crop) => void) | undefined;
  aspect?: number | undefined;
  imageSize: { width: number; height: number };
}

export function ImageCropper({
  src,
  crop,
  onCropChange,
  onAspectRatioApplied,
  aspect,
  imageSize,
}: ImageCropperProps) {
  const imgRef = useRef<HTMLImageElement>(null);

  // アスペクト比の同期ロジックを専用フックに委譲
  useAspectRatioSync({
    imgRef,
    src,
    crop,
    aspect,
    imageSize,
    onCropChange,
    onAspectRatioApplied,
  });

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // cropが既に有効な値を持っている場合は初期化をスキップ
    // （ユーザー設定を維持するため）
    if (crop.width > 0 && crop.height > 0) {
      return;
    }

    const { width, height } = e.currentTarget;

    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 50,
        },
        aspect || 16 / 9,
        width,
        height
      ),
      width,
      height
    );

    // 初期cropをピクセル単位に変換してから渡す
    const initialPixelCropForUI = convertPercentToPixelCrop(
      initialCrop,
      width,
      height,
      imageSize.width,
      imageSize.height
    );
    const initialPixelCrop = convertToActualPixels(
      initialPixelCropForUI,
      width,
      height,
      imageSize.width,
      imageSize.height
    );
    onCropChange(initialPixelCropForUI, initialPixelCrop);
  };

  return (
    <div className="image-container">
      <ReactCrop
        crop={crop}
        onChange={(_, percentCrop) => {
          if (!imgRef.current) return;

          const displayWidth = imgRef.current.width;
          const displayHeight = imgRef.current.height;

          // パーセント→ピクセルに変換してから渡す
          const pixelCropForUI = convertPercentToPixelCrop(
            percentCrop,
            displayWidth,
            displayHeight,
            imageSize.width,
            imageSize.height
          );
          const pixelCrop = convertToActualPixels(
            pixelCropForUI,
            displayWidth,
            displayHeight,
            imageSize.width,
            imageSize.height
          );
          onCropChange(pixelCropForUI, pixelCrop);
        }}
        onComplete={() => {
          if (!imgRef.current) return;

          const displayWidth = imgRef.current.width;
          const displayHeight = imgRef.current.height;

          // 確定時：現在のcropをピクセルに変換
          const actualPixelCrop = convertToActualPixels(
            crop,
            displayWidth,
            displayHeight,
            imageSize.width,
            imageSize.height
          );
          onCropChange(crop, actualPixelCrop);
        }}
        {...(aspect !== undefined && { aspect })}
      >
        <img
          ref={imgRef}
          src={src}
          alt="トリミング対象の画像"
          onLoad={onImageLoad}
          style={{ maxWidth: '100%', display: 'block' }}
        />
      </ReactCrop>
    </div>
  );
}
