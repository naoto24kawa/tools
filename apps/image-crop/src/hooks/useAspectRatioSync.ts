import { useRef, useEffect } from 'react';
import { centerCrop, makeAspectCrop } from 'react-image-crop';
import type { Crop, PixelCrop } from '@types';
import { convertPercentToPixelCrop } from '@utils/coordinateConverter';

/**
 * アスペクト比同期フック
 *
 * ## 責務
 * - アスペクト比の変更を監視
 * - 新しい画像のアップロードを検知
 * - アスペクト比に基づいてクロップ領域を自動調整
 *
 * ## 使用例
 * ```typescript
 * useAspectRatioSync({
 *   imgRef,
 *   src,
 *   crop,
 *   aspect,
 *   imageSize,
 *   onCropChange,
 *   onAspectRatioApplied,
 * });
 * ```
 */
export function useAspectRatioSync({
  imgRef,
  src,
  crop,
  aspect,
  imageSize,
  onCropChange,
  onAspectRatioApplied,
}: {
  imgRef: React.RefObject<HTMLImageElement>;
  src: string;
  crop: Crop;
  aspect?: number | undefined;
  imageSize: { width: number; height: number };
  onCropChange: (crop: Crop, pixelCrop: PixelCrop) => void;
  onAspectRatioApplied?: ((crop: Crop) => void) | undefined;
}) {
  const prevAspectRef = useRef<number | undefined>();
  const srcRef = useRef(''); // 空文字列で初期化して、最初のマウント時にisNewImage = trueになるようにする

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
    if (isNewImage && crop.width > 0 && crop.height > 0) {
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

    // パーセント→実画像ピクセルに変換（エクスポート用）
    const pixelCrop = convertPercentToPixelCrop(
      newCrop,
      width,
      height,
      imageSize.width,
      imageSize.height
    ) as PixelCrop;

    // crop にはパーセント座標、completedCrop には実画像ピクセル座標を保存
    onCropChange(newCrop, pixelCrop);

    // アスペクト比適用後のサイズを通知
    onAspectRatioApplied?.(newCrop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspect, imageSize, src, onCropChange, onAspectRatioApplied, imgRef]);
}
