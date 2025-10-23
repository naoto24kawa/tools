import { useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import type { Crop, PixelCrop } from '@types';
import { convertPercentToPixelCrop } from '@utils/coordinateConverter';
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

    // 初期cropを実画像ピクセルに変換（エクスポート用）
    const initialPixelCrop = convertPercentToPixelCrop(
      initialCrop,
      width,
      height,
      imageSize.width,
      imageSize.height
    ) as PixelCrop;

    // crop にはパーセント座標、completedCrop には実画像ピクセル座標を保存
    onCropChange(initialCrop, initialPixelCrop);
  };

  return (
    <div className="image-container">
      <ReactCrop
        crop={crop}
        onChange={(_, percentCrop) => {
          if (!imgRef.current) return;

          const displayWidth = imgRef.current.width;
          const displayHeight = imgRef.current.height;

          // 実画像ピクセル座標を計算（エクスポート用）
          const pixelCrop = convertPercentToPixelCrop(
            percentCrop,
            displayWidth,
            displayHeight,
            imageSize.width,
            imageSize.height
          ) as PixelCrop;

          // crop にはパーセント座標、completedCrop には実画像ピクセル座標を保存
          onCropChange(percentCrop, pixelCrop);
        }}
        onComplete={() => {
          // onChangeで処理済み
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
