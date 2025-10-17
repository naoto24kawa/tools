import React, { useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import type { Crop, PixelCrop } from '../types';

interface ImageCropperProps {
  src: string;
  crop: Crop;
  onCropChange: (crop: Crop, pixelCrop: PixelCrop) => void;
  aspect?: number;
  imageSize: { width: number; height: number };
}

export function ImageCropper({ src, crop, onCropChange, aspect, imageSize }: ImageCropperProps) {
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
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

    // 初期cropをピクセルに変換
    const initialPixelCrop = convertToActualPixels(initialCrop);
    onCropChange(initialCrop, initialPixelCrop);
  };

  const convertToActualPixels = (cropData: Crop): PixelCrop => {
    if (!imgRef.current) return cropData as PixelCrop;

    // 表示サイズを取得
    const displayWidth = imgRef.current.width;
    const displayHeight = imgRef.current.height;

    let pixelX, pixelY, pixelWidth, pixelHeight;

    // パーセント単位の場合は、まず表示サイズのピクセルに変換
    if (cropData.unit === '%') {
      pixelX = (cropData.x / 100) * displayWidth;
      pixelY = (cropData.y / 100) * displayHeight;
      pixelWidth = (cropData.width / 100) * displayWidth;
      pixelHeight = (cropData.height / 100) * displayHeight;
    } else {
      pixelX = cropData.x;
      pixelY = cropData.y;
      pixelWidth = cropData.width;
      pixelHeight = cropData.height;
    }

    // 実際のサイズとの比率を計算
    const scaleX = imageSize.width / displayWidth;
    const scaleY = imageSize.height / displayHeight;

    // 実際の画像サイズのピクセル座標に変換
    return {
      unit: 'px' as const,
      x: pixelX * scaleX,
      y: pixelY * scaleY,
      width: pixelWidth * scaleX,
      height: pixelHeight * scaleY,
    };
  };

  return (
    <div className="image-container">
      <ReactCrop
        crop={crop}
        onChange={(_, percentCrop) => {
          // リアルタイムプレビュー用：パーセントをピクセルに変換
          const pixelCrop = convertToActualPixels(percentCrop);
          onCropChange(percentCrop, pixelCrop);
        }}
        onComplete={(_, pixelCrop) => {
          // 確定時：現在のcropをピクセルに変換
          const actualPixelCrop = convertToActualPixels(crop);
          onCropChange(crop, actualPixelCrop);
        }}
        aspect={aspect}
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
