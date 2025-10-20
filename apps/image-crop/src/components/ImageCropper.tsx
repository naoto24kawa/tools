import { useRef, useEffect } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import type { Crop, PixelCrop } from '@types';
import { convertPercentToPixelCrop, convertToActualPixels } from '@utils/coordinateConverter';

interface ImageCropperProps {
  src: string;
  crop: Crop;
  onCropChange: (crop: Crop, pixelCrop: PixelCrop) => void;
  onAspectRatioApplied?: (crop: Crop) => void;
  aspect?: number;
  imageSize: { width: number; height: number };
}

export function ImageCropper({ src, crop, onCropChange, onAspectRatioApplied, aspect, imageSize }: ImageCropperProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const prevAspectRef = useRef<number | undefined>();
  const srcRef = useRef(''); // 空文字列で初期化して、最初のマウント時にisNewImage = trueになるようにする
  const cropRef = useRef(crop);
  cropRef.current = crop;

  // アスペクト比が変更されたときにクロップ領域を再計算
  useEffect(() => {
    // srcが変更されたかチェック（新しい画像がアップロードされた）
    const isNewImage = srcRef.current !== src;
    if (isNewImage) {
      srcRef.current = src;
    }

    // アスペクト比が変更されていない場合はスキップ
    if (!imgRef.current || !aspect || prevAspectRef.current === aspect) {
      prevAspectRef.current = aspect;
      return;
    }

    // cropが既に有効な値を持っており、かつ新しい画像の場合
    // これは新しい画像がアップロードされ、ユーザー設定が適用されている状態
    // この場合のみスキップ
    if (isNewImage && cropRef.current.width > 0 && cropRef.current.height > 0) {
      prevAspectRef.current = aspect;
      return;
    }

    prevAspectRef.current = aspect;

    const { width, height } = imgRef.current;

    // 現在のクロップ領域を新しいアスペクト比に合わせて調整
    const newCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 50,
        },
        aspect,
        width,
        height
      ),
      width,
      height
    );

    // パーセント→ピクセルに変換してから渡す
    const pixelCropForUI = convertPercentToPixelCrop(
      newCrop,
      width,
      height,
      imageSize.width,
      imageSize.height
    );
    const pixelCrop = convertToActualPixels(
      pixelCropForUI,
      width,
      height,
      imageSize.width,
      imageSize.height
    );
    onCropChange(pixelCropForUI, pixelCrop);

    // アスペクト比適用後のサイズを通知
    onAspectRatioApplied?.(pixelCropForUI);
  }, [aspect, imageSize, src, onCropChange, onAspectRatioApplied]);

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
